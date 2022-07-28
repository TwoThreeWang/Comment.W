#!/usr/bin/env python
# coding=utf-8

# @Time    : 2022/4/28 16:34
# @Author ：WangTwoThree
# @Site ：https://wangtwothree.com
# @File    : links.py
import time, re
from fastapi import APIRouter, Request
from fastapi.params import Depends
from utils.toolUtils import reponse
from sqlalchemy.orm import Session
from routers.auth import check_token, User, get_user
from sqlmodel.database import SessionLocal
from sqlmodel import crud, schemas
from cacheout import Cache

cache = Cache(maxsize=256, ttl=60 * 10, timer=time.time, default=None)

router = APIRouter()


def get_db():
    db = SessionLocal()
    yield db
    # try:
    #     db = SessionLocal()
    #     yield db
    # except Exception as error:
    #     print(f"数据库连接失败:{error}")
    # finally:
    #     db.close()


# 增加站点
@router.post("/add/site")
async def add_site(item: schemas.SiteBase, db: Session = Depends(get_db), user: User = Depends(check_token)):
    data = crud.db_create_site(db=db, item=item)
    return reponse(data=schemas.GetSite.from_orm(data).dict())


# 查询站点信息
@router.get("/get/site/")
@router.get("/get/site/{id}")
async def get_site(id: int = None, db: Session = Depends(get_db), user: User = Depends(check_token)):
    if id:
        data = crud.db_get_site_by_id(db, id)
        data = schemas.GetSite.from_orm(data).dict() if data else {}
    else:
        datas = crud.db_get_site(db)
        data = [schemas.GetSite.from_orm(item).dict() for item in datas]
    return reponse(data=data)


# 删除站点
@router.get("/delete/site/{id}")
async def delete_site(id: int, db: Session = Depends(get_db), user: User = Depends(check_token)):
    data = crud.db_del_site(id=id, db=db)
    return reponse(data=data)


# 修改站点信息
@router.post("/update/site/")
async def update_site(item_data: schemas.GetSite, db: Session = Depends(get_db), user: User = Depends(check_token)):
    data = crud.db_edit_site(item=item_data, db=db)
    return reponse(data=data)


# 查询站点下所有page_key
@router.get("/get/key/{sid}")
async def get_site_key(sid: int, db: Session = Depends(get_db), user: User = Depends(check_token)):
    data = crud.db_get_site_key_by_sid(sid, db)
    data = [row[0] for row in data]
    return reponse(data=data)


# 判断网站权限
def check_site(request, sid, db):
    host = request.headers.get("origin", "")
    if host:
        host = host.split('/')[2]
    else:
        host = ""
    # print(host)
    site_data = crud.db_get_site_by_id(db, sid)
    if not site_data:
        return False
    site_info = schemas.GetSite.from_orm(site_data).dict()
    if host in site_info['allow_origins'] or site_info['allow_origins'] == '' or site_info['allow_origins'] == None:
        return True
    return False


# 增加评论
@router.post("/add/comment")
async def add_comment(request: Request, item: schemas.AddCommentBase, db: Session = Depends(get_db)):
    # 判断网站权限
    if check_site(request, item.site_id, db):
        item.content = re.sub(r'</?\w+[^>]*>', '', item.content)
        item.name = re.sub(r'</?\w+[^>]*>', '', item.name)
        item.email = re.sub(r'</?\w+[^>]*>', '', item.email)
        item.page_key = re.sub(r'</?\w+[^>]*>', '', item.page_key)
        data = crud.db_add_comment(db=db, item=item)
        return reponse(data=schemas.GetComment.from_orm(data).dict())
    else:
        return reponse(code=403, data='该网址无权创建评论，请到后台添加网址白名单！')


def check_admin(username, password):
    user: User = get_user(username)
    if not user or user.password != password:
        return 0
    return 1


# 查询所有评论
@router.get("/list/comment/{sid}/{key}/{page}")
async def get_comment(request: Request, sid: int, key: str, page: int = 1, db: Session = Depends(get_db)):
    # 判断网站权限
    if check_site(request, sid, db):
        # 查询一级评论
        one_comments = crud.db_get_comment(key, page, sid, db)
        data = []
        id_names = {}
        for item in one_comments:
            comm = schemas.GetComment.from_orm(item).dict()
            comm['p_name'] = ''
            rid = comm['id']
            id_names[comm['id']] = comm['name']
            two_comments = crud.db_get_reply_comment(key, sid, rid, db)
            comm['is_admin'] = check_admin(comm['name'], comm['email'])
            comm['child'] = []
            for t_item in two_comments:
                co = schemas.GetComment.from_orm(t_item).dict()
                id_names[co['id']] = co['name']
                co['p_name'] = id_names.get(co['pid'], '未知用户')
                co['is_admin'] = check_admin(co['name'], co['email'])
                comm['child'].append(co)
            data.append(comm)
        return reponse(data=data)
    else:
        data = '该网址无权获取评论，请到后台添加网址白名单！'
        return reponse(code=403, data=data)


# 删除评论
@router.get("/del/comment/{id}")
async def del_comment(id: int, db: Session = Depends(get_db), user: User = Depends(check_token)):
    data = crud.db_del_comment(id=id, db=db)
    return reponse(data=data)


# 搜索评论
@router.get("/search/comment/{sid}/{page_key}/{key_word}")
async def search_comment(sid: int, page_key: str, key_word: str, db: Session = Depends(get_db),
                         user: User = Depends(check_token)):
    datas = crud.db_search_comment(sid, page_key, key_word, db)
    data = [schemas.GetComment.from_orm(data).dict() for data in datas]
    return reponse(data=data)
