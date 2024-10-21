from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from src.routers import personality, discord_oauth
from src.websocket.connection_manager import manager
from starlette.websockets import WebSocketDisconnect
from starlette.config import Config

app = FastAPI()

# Load environment variables
config = Config('.env')
SECRET_KEY = config('SECRET_KEY', cast=str, default='your-secret-key')

# Add SessionMiddleware
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(personality.router, prefix="/personality")

app.include_router(discord_oauth.router, prefix="/discord")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # You can add custom logic here if needed
    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
