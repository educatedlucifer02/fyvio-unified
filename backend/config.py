import json
from os import getenv, path
from dotenv import load_dotenv
from Backend import LOGGER


load_dotenv(path.join(path.dirname(__file__), "../config.env"))
class Telegram:
    API_ID = int(getenv("API_ID", "9239475"))
    API_HASH = getenv("API_HASH", "45bca1de511c5133d0d83e0f7f456bee")
    BOT_TOKEN = getenv("BOT_TOKEN", "8218088730:AAEttCIJd_DYeFYXgNb3s-ENSygqxAf6DNs")
    PORT = int(getenv("PORT", "8000"))
    BASE_URL = getenv("BASE_URL", "0.0.0.0").rstrip('/')
    AUTH_CHANNEL = [channel.strip() for channel in (getenv("AUTH_CHANNEL") or "-1003122695002").split(",") if channel.strip()]
    DATABASE = getenv("DATABASE", "mongodb+srv://educatedlucifer:lucifer007@cluster0.pzdd4sm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").split(", ")
    TMDB_API = getenv("TMDB_API", "")
    IMDB_API = getenv("IMDB_API", "")
    UPSTREAM_REPO = getenv("UPSTREAM_REPO", "")
    UPSTREAM_BRANCH = getenv("UPSTREAM_BRANCH", "main")
    MULTI_CLIENT = getenv("MULTI_CLIENT", "False").lower() == "true"
    USE_CAPTION = getenv("USE_CAPTION", "False").lower() == "true"
    USE_TMDB = getenv("USE_TMDB", "False").lower() == "true"
    OWNER_ID = int(getenv("OWNER_ID", "8001097291"))
    USE_DEFAULT_ID = getenv("USE_DEFAULT_ID", None)
