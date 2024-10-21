from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from starlette.requests import Request
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from src.database.supabase_client import supabase
import httpx
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
import asyncio

router = APIRouter()

# Load environment variables
config = Config('.env')
oauth = OAuth(config)

DISCORD_CLIENT_ID = config('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = config('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = config('DISCORD_REDIRECT_URI')
DISCORD_BOT_TOKEN = config('DISCORD_BOT_TOKEN')

# JWT settings
SECRET_KEY = config('JWT_SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

# Discord OAuth2 setup
oauth.register(
    name='discord',
    client_id=DISCORD_CLIENT_ID,
    client_secret=DISCORD_CLIENT_SECRET,
    api_base_url='https://discordapp.com/api/',
    access_token_url='https://discordapp.com/api/oauth2/token',
    authorize_url='https://discordapp.com/api/oauth2/authorize',
    client_kwargs={
        'scope': 'identify email guilds'
    }
)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"Created JWT token: {encoded_jwt}")
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = supabase.table('users').select("*").eq("username", token_data.username).execute()
    if not user.data:
        raise credentials_exception
    return user.data[0]

@router.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    return await oauth.discord.authorize_redirect(request, redirect_uri)

@router.get('/auth')
async def auth(request: Request):
    token = await oauth.discord.authorize_access_token(request)
    resp = await oauth.discord.get('users/@me', token=token)
    user = resp.json()
    
    # Prepare user data, excluding email if it's not provided
    user_data = {
        'id': user['id'],
        'username': user['username'],
        'avatar': user.get('avatar')
    }
    if 'email' in user:
        user_data['email'] = user['email']
    
    # Store user info in Supabase
    try:
        supabase.table('users').upsert(user_data).execute()
    except Exception as e:
        print(f"Error storing user data: {str(e)}")
        # You might want to log this error or handle it differently
    
    # Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    return RedirectResponse(url=f"http://localhost:3000/auth/callback?access_token={access_token}")

@router.get('/user')
async def get_user(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get('/guilds')
async def get_guilds(current_user: dict = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        while True:
            response = await client.get(
                'https://discord.com/api/v10/users/@me/guilds',
                headers={'Authorization': f'Bearer {current_user["access_token"]}'}
            )
            if await handle_rate_limit(response):
                continue
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail='Failed to fetch user guilds')
            return response.json()

@router.get('/bot/guilds')
async def get_bot_guilds():
    async with httpx.AsyncClient() as client:
        while True:
            response = await client.get(
                'https://discord.com/api/v10/users/@me/guilds',
                headers={'Authorization': f'Bot {DISCORD_BOT_TOKEN}'}
            )
            if await handle_rate_limit(response):
                continue
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail='Failed to fetch bot guilds')
            return response.json()

@router.get('/guild/{guild_id}/channels')
async def get_guild_channels(guild_id: str):
    async with httpx.AsyncClient() as client:
        while True:
            response = await client.get(
                f'https://discord.com/api/v10/guilds/{guild_id}/channels',
                headers={'Authorization': f'Bot {DISCORD_BOT_TOKEN}'}
            )
            if await handle_rate_limit(response):
                continue
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail='Failed to fetch guild channels')
            return response.json()

@router.get('/guild/{guild_id}/members')
async def get_guild_members(guild_id: str, limit: int = 1000):
    async with httpx.AsyncClient() as client:
        while True:
            response = await client.get(
                f'https://discord.com/api/v10/guilds/{guild_id}/members?limit={limit}',
                headers={'Authorization': f'Bot {DISCORD_BOT_TOKEN}'}
            )
            if await handle_rate_limit(response):
                continue
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail='Failed to fetch guild members')
            return response.json()

@router.get('/guild/{guild_id}/roles')
async def get_guild_roles(guild_id: str):
    async with httpx.AsyncClient() as client:
        while True:
            response = await client.get(
                f'https://discord.com/api/v10/guilds/{guild_id}/roles',
                headers={'Authorization': f'Bot {DISCORD_BOT_TOKEN}'}
            )
            if await handle_rate_limit(response):
                continue
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail='Failed to fetch guild roles')
            return response.json()

@router.get('/channel/{channel_id}/messages')
async def get_channel_messages(channel_id: str, limit: int = 100):
    async with httpx.AsyncClient() as client:
        while True:
            response = await client.get(
                f'https://discord.com/api/v10/channels/{channel_id}/messages?limit={limit}',
                headers={'Authorization': f'Bot {DISCORD_BOT_TOKEN}'}
            )
            if await handle_rate_limit(response):
                continue
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail='Failed to fetch channel messages')
            return response.json()

async def handle_rate_limit(response: httpx.Response):
    if response.status_code == 429:
        retry_after = int(response.headers.get('Retry-After', 1))
        await asyncio.sleep(retry_after)
        return True
    return False
