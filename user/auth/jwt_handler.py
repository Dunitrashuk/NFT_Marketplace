import jwt
from decouple import config
import time

JWT_SECRET = config("TOKEN_SECRET")
JWT_ALGORITHM = config("algorithm")


def token_response(username: str, token: str):
    return {
        "username": username,
        "auth-token": token
    }


def signJWT(username: str):
    payload = {
        "username": username,
        "expiry": time.time() + 600
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token_response(username, token)


def decodeJWT(token: str):
    try:
        decode_token = jwt.decode(token, JWT_SECRET, algorithms=JWT_ALGORITHM)
        if decode_token['expiry'] >= time.time():
            return decode_token
    except:
        return {}
