#!/usr/bin/env python
# coding=utf-8

# @Time    : 2022/4/29 15:22
# @Author ：WangTwoThree
# @Site ：https://wangtwothree.com
# @File    : schemas.py
from pydantic import BaseModel


class SiteBase(BaseModel):
    name: str
    allow_origins: str


class GetSite(SiteBase):
    id: int
    create_time: str

    class Config:
        orm_mode = True


class CommentBase(BaseModel):
    pid: int = None
    rid: int = None
    name: str
    email: str = None
    content: str


class GetComment(CommentBase):
    id: int
    page_key: str
    site_id: int
    create_time: str

    class Config:
        orm_mode = True


class AddCommentBase(CommentBase):
    page_key: str
    site_id: int

    class Config:
        orm_mode = True
