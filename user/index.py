import imp
from fastapi import FastAPI
from routes.userRoute import userRoute
from routes.statusRoute import statusRoute


app = FastAPI()
app.include_router(userRoute)
app.include_router(statusRoute)
