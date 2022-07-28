#!/usr/bin/env python
# coding=utf-8

# @Time    : 2022/4/24 15:41
# @Author ：WangTwoThree
# @Site ：https://wangtwothree.com
# @File    : toolUtils.py
import json, time
from typing import Union
from fastapi import status, Request
from fastapi.responses import JSONResponse, Response
from fastapi.exceptions import RequestValidationError
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException


def get_rel_ip(request):
    '''
    获取真实IP
    :param request:
    :return:
    '''
    if request.headers.get("x-forwarded-for", ""):
        ip = request.headers.get("x-forwarded-for", "")
    elif request.headers.get("x-real-ip", ""):
        ip = request.headers.get("x-real-ip", "")
    elif request.headers.get("X-Real-Ip", ""):
        ip = request.headers.get("X-Real-Ip", "")
    else:
        ip = request.client.host
    return ip


def reponse(*, code=200, data: Union[list, dict, str], msg="Success") -> Response:
    '''
    返回报文封装
    :param code:
    :param data:
    :param msg:
    :return:
    '''
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            'code': code,
            'message': msg,
            'data': data,
        }
    )


def validation_exception_handler(request: Request, exc: RequestValidationError):
    '''
    请求校验异常
    :param request:
    :param exc:
    :return:
    '''
    return reponse(code=403, data=exc.errors(), msg='参数错误')


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    '''
    请求频率限制封装
    :param request:
    :param exc:
    :return:
    '''
    ip = get_rel_ip(request)
    data = {'path': request.url.path, 'ip': ip, 'method': request.method}
    return reponse(code=403, data=data, msg='请求太快了，喝口茶休息休息吧！')


def all_exception_handler(request: Request, exc: StarletteHTTPException):
    '''
    全局请求错误拦截
    :param request:
    :param exc:
    :return:
    '''
    ip = get_rel_ip(request)
    data = {'path': request.url.path, 'ip': ip, 'method': request.method}
    # log_msg = f"捕获到系统错误：请求路径:{request.url.path}\n错误信息：{traceback.format_exc()}"
    if exc.status_code == 405:
        return reponse(code=405, data=data, msg=exc.detail)
    if exc.status_code == 404:
        return reponse(code=404, data=data, msg=exc.detail)
    elif exc.status_code == 429:
        return reponse(code=429, data=data, msg=exc.detail)
    elif exc.status_code == 500:
        return reponse(code=500, data=data, msg=exc.detail)
    elif exc.status_code == 400:
        # 有部分的地方直接的选择使用raise的方式抛出了异常，这里也需要进程处理
        # raise HTTPException(HTTP_400_BAD_REQUEST, 'Invalid token')
        return reponse(code=400, data=data, msg=exc.detail)
    return reponse(code=405, data='', msg=exc.detail)


def log_info(info):
    print(f"{time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))} | INFO | {info}")
