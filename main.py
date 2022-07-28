#!/usr/bin/env python
# coding=utf-8

# @Time    : 2022/4/22 17:03
# @Author ：WangTwoThree
# @Site ：https://wangtwothree.com
# @File    : main.py
import time
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from starlette.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from utils.toolUtils import get_rel_ip, reponse, rate_limit_exceeded_handler, validation_exception_handler, \
    all_exception_handler, log_info
from routers import links, auth
from sqlmodel.database import engine
from sqlmodel import models

models.Base.metadata.create_all(bind=engine)
app = FastAPI(docs_url=None, redoc_url=None)
limiter = Limiter(key_func=get_rel_ip, default_limits=["20/minute"])  # 限流设置 20/minute 表示同一IP每分钟最大请求数量为20次
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, all_exception_handler)
app.add_middleware(SlowAPIMiddleware)  # 限速设置全局生效中间件
# 跨域配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(links.router)


@app.on_event("startup")
async def startup():
    log_info('程序启动')


@app.middleware("http")
async def logger_request(request: Request, call_next):
    '''
    全局请求中间件
    :param request:
    :param call_next:
    :return:
    '''
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time, 5))  # 返回接口处理耗时
    info = f"{request.get('method')} - {request.url.path} - {process_time}"
    log_info(info)
    return response


@app.get('/')
async def index():
    return reponse(data="Comment.W 评论后端 API，详细介绍：https://comment.wangtwothree.com")


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=1204, log_level="info")
