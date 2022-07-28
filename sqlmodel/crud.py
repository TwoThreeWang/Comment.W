#!/usr/bin/env python
# coding=utf-8

# @Time    : 2022/4/29 15:50
# @Author ：WangTwoThree
# @Site ：https://wangtwothree.com
# @File    : crud.py
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import or_
from sqlalchemy import distinct
from . import models, schemas


# 查询所有站点
def db_get_site(db: Session):
    return db.query(models.Site).all()


# 根据站点ID查询站点信息
def db_get_site_by_id(db: Session, site_id: int):
    return db.query(models.Site).filter(models.Site.id == site_id).first()


# 删除站点
def db_del_site(id: int, db: Session):
    res1 = db.query(models.Site).filter(models.Site.id == id).delete()
    db.commit()
    return f"成功删除 {res1} 个站点"


# 新增站点
def db_create_site(item: schemas.SiteBase, db: Session):
    data = models.Site(**item.dict())
    db.add(data)
    db.commit()
    db.refresh(data)
    return data


# 修改站点信息
def db_edit_site(item: schemas.GetSite, db: Session):
    db.query(models.Site).filter_by(id=item.id).update(
        {models.Site.name: item.name, models.Site.allow_origins: item.allow_origins})
    db.commit()
    return '数据修改成功！'


# 查询站点下所有page_key
def db_get_site_key_by_sid(sid: int, db: Session):
    return db.query(distinct(models.Comment.page_key)).filter(models.Comment.site_id == sid).all()


# 查询主评论（分页）
def db_get_comment(key: str, page: int, sid: int, db: Session):
    return db.query(models.Comment).filter(models.Comment.page_key == key, models.Comment.site_id == sid,
                                           models.Comment.rid == 0).order_by(models.Comment.id.desc()).offset(
        15 * (page - 1)).limit(15).all()


# 查询二级评论
def db_get_reply_comment(key: str, sid: int, rid: int, db: Session):
    return db.query(models.Comment).filter(models.Comment.page_key == key, models.Comment.site_id == sid,
                                           models.Comment.rid == rid).all()


# 增加评论
def db_add_comment(db: Session, item: schemas.AddCommentBase):
    data = models.Comment(**item.dict())
    db.add(data)
    db.commit()
    db.refresh(data)
    return data


# 删除评论
def db_del_comment(id: int, db: Session):
    res1 = db.query(models.Comment).filter(
        or_(models.Comment.id == id, models.Comment.rid == id, models.Comment.pid == id)).delete()
    db.commit()
    return f"成功删除 {res1} 条评论"


# 搜索评论
def db_search_comment(sid: int, page_key: str, key_word: str, db: Session):
    return db.query(models.Comment).filter(models.Comment.site_id == sid, models.Comment.page_key == page_key,
                                           or_(models.Comment.content.like('%' + key_word + '%'),
                                               models.Comment.name.like('%' + key_word + '%'),
                                               models.Comment.email.like('%' + key_word + '%'))).all()
