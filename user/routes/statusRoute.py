from fastapi import APIRouter, Request
from auth.jwt_handler import signJWT, decodeJWT
from decouple import config
import os
import psutil
import time

statusRoute = APIRouter()
startTime = time.time()


@statusRoute.get('/status')
async def statusEndpoint():
    process = psutil.Process(os.getpid())
    status = {
        'status': "active",
        'pid': process.pid,
        'rss_bytes': process.memory_info().rss,
        'num_connections': len(process.connections()),
        'cpu_percent': process.cpu_percent(),
        'up_time': time.time() - startTime
    }

    return dict(
        status
    )
