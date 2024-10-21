from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from os import getenv
from dotenv import load_dotenv
from jose import jwt, JWTError
from src.routers.discord_oauth import SECRET_KEY, ALGORITHM

load_dotenv()  # This loads the .env file

supabase: Client = create_client(
    getenv("SUPABASE_URL"),
    getenv("SUPABASE_KEY")
)

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        try:
            print(f"Attempting to decode token: {jwtoken}")
            if jwtoken == "undefined":
                print("Token is 'undefined'")
                return False
            payload = jwt.decode(jwtoken, SECRET_KEY, algorithms=[ALGORITHM])
            print(f"Decoded payload: {payload}")
            return True
        except JWTError as e:
            print(f"JWT verification failed: {str(e)}")
            return False
