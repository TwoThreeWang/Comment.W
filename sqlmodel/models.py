#!/usr/bin/env python
# coding=utf-8

# @Time    : 2022/4/29 15:13
# @Author ：WangTwoThree
# @Site ：https://wangtwothree.com
# @File    : models.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from .database import Base


class Comment(Base):
    __tablename__ = "w_comment"

    id = Column(Integer, primary_key=True, index=True, comment='ID')
    rid = Column(Integer, index=True, default=0, comment='根ID')
    pid = Column(Integer, comment='父ID', default=0, index=True)
    site_id = Column(Integer, index=True, comment='所属站点')
    page_key = Column(String, comment='页面标识', index=True)
    name = Column(String, comment='用户名')
    email = Column(String, comment='邮箱')
    content = Column(String, comment='内容')
    create_time = Column(String, default=datetime.now, comment='创建时间')


class Site(Base):
    __tablename__ = "w_site"

    id = Column(Integer, primary_key=True, index=True, comment='ID')
    name = Column(String, comment='网站名称')
    allow_origins = Column(String, comment='允许的域名')
    create_time = Column(String, default=datetime.now, comment='创建时间')
