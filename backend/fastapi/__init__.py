import uvicorn

# Delay importing FastAPI app to avoid circular imports

def create_server(host: str = "0.0.0.0", port: int = 8000):
    from backend.fastapi.main import app  # local import to break circular dependency
    config = uvicorn.Config(app=app, host=host, port=port)
    return uvicorn.Server(config)

# Provide a module-level server constructed with default env if available
try:
    from backend.config import Telegram
    server = create_server(port=getattr(Telegram, "PORT", 8000))
except Exception:
    # Fallback during import time; caller can use create_server() explicitly
    server = create_server()
