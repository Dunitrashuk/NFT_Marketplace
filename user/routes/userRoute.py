import requests

from config.db import db
from urllib import request
from fastapi import APIRouter, Request
from models.user import User
from schemas.user import user_serializer, users_serializer
from passlib.context import CryptContext
from auth.jwt_handler import signJWT, decodeJWT

collection = db.users
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

print(collection)

userRoute = APIRouter()

# get all users


@userRoute.get('/users')
async def getAllUsers(request: Request):

    if decodeJWT(request.headers.get("auth-token")) == {}:
        return dict({
            "error": "Invalid Token"
        })

    users = users_serializer(collection.find())
    return users

# get specific user


@userRoute.get('/users/{username}')
async def getUser(username: str, request: Request):

    if decodeJWT(request.headers.get("auth-token")) == {}:
        return dict({
            "error": "Invalid Token"
        })

    user = users_serializer(collection.find({"username": username}))
    if user == []:
        return dict({
            "error": "No such user found!"
        })
    return user


# sign up, create user
@userRoute.post('/signUp')
async def signUp(user: User):

    # verify if username available
    available = users_serializer(collection.find({"username": user.username}))
    if(available != []):
        return dict({
            "error": "Username not available!"
        })
    # has the password
    user.password = pwd_context.hash(user.password)

    # post request to nft's db to save user with funds
    requests.post('http://gateway:5000/nftsService/users/addUser',
                  json={
                      "username": user.username})

    # save user to db
    _id = collection.insert_one(dict(user))
    user = users_serializer(collection.find({"_id": _id.inserted_id}))

    return user


@userRoute.post('/signIn')
async def signIn(user: User):
    # verify if user exists
    available = users_serializer(collection.find({"username": user.username}))
    if(available == []):
        return dict({
            "error": "Username not found!"
        })

    if not pwd_context.verify(user.password, available[0]["password"]):
        return dict({
            "error": "Incorect Password"
        })

    return signJWT(user.username)
