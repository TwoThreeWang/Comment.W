# encoding: utf-8
# !/usr/bin/env python
'''
@version ：python 3.7
@File ：auth.py
@Author ：WangTwoThree
@Site ：https://wangtwothree.com
@Date ：5/14/22 3:55 PM 
@Description ：
'''
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from utils.toolUtils import reponse
from datetime import datetime, timedelta
from typing import Optional
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import jwt

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "wangtwothree"
ALGORITHM = "HS256"
expires = 60 * 60 * 2


class User(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


USER_LIST = [
    User(username="测试账号", password="123456"),
    User(username="测试账号2", password="123456")
]


def get_user(username: str) -> User:
    # 查询用户信息
    for user in USER_LIST:
        if user.username == username:
            return user


def create_token(user: User, expires_delta: Optional[timedelta] = None):
    expire = datetime.now() + expires_delta
    return jwt.encode(
        {"sub": user.username, "exp": expire},
        key=SECRET_KEY,
        algorithm=ALGORITHM
    )


@router.post("/token")
async def login_get_token(form_data: User):
    user: User = get_user(form_data.username)
    if not user or user.password != form_data.password:
        return reponse(code=401, data='用户名或密码错误！')
    access_token = create_token(user=user, expires_delta=timedelta(seconds=expires))
    return reponse(data={"access_token": access_token, "token_type": "bearer", "expires": expires})


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="token 无效！",
    headers={"WWW-Authenticate": "Bearer"},
)


def check_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username, expire = payload.get("sub"), payload.get("exp")
        user = get_user(username)
        if user is None:
            raise credentials_exception
    except Exception as error:
        print(error)
        raise credentials_exception
    return user
