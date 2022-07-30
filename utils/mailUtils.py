#!/usr/bin/env python
# coding=utf-8

# @Time    : 2022/7/29 15:55
# @Author ：WangTwoThree
# @Site ：https://wangtwothree.com
# @File    : mailUtils.py
from configparser import ConfigParser
import zmail


class MailUtils(object):
    def __init__(self):
        config = ConfigParser()
        config.read('config.ini')
        self.user = config['EMAIL']["user"]
        password = config['EMAIL']["password"]
        self.flag = config['EMAIL']["flag"]
        self.server = zmail.server(self.user, password)

    def send(self, mail_info):
        if self.flag == '0':
            print('未配置邮箱登录信息！')
            return True
        if mail_info['email'] and mail_info['email'] != '':
            mail = {
                'subject': f'您在 {mail_info["site_name"]} 的评论有新的回复!',
                'content_html': f'<p>{mail_info["name"]}，你好：<br/></p><p>&nbsp;&nbsp;&nbsp;&nbsp;你在【{mail_info["site_name"]}】上发布的评论有了新的回复，请点击链接查看：<a href="{mail_info["link"]}" target="_blank">{mail_info["link"]}</a><br/></p><p>&nbsp;&nbsp;&nbsp;&nbsp;原评论：<br/></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; {mail_info["connect"]}<br/></p>'
            }
        else:
            mail_info["email"] = self.user
            mail = {
                'subject': f'{mail_info["site_name"]} 页面有新的评论!',
                'content_html': f'<p>你好：<br/></p><p>&nbsp;&nbsp;&nbsp;&nbsp;【{mail_info["site_name"]}】的页面上有了新的评论，请点击链接查看：<a href="{mail_info["link"]}" target="_blank">{mail_info["link"]}</a><br/></p><p>&nbsp;&nbsp;&nbsp;&nbsp;{mail_info["name"]} 发布的评论内容：<br/></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; {mail_info["connect"]}<br/></p>'
            }
        return self.server.send_mail(mail_info["email"], mail, cc=self.user)


if __name__ == '__main__':
    mail = MailUtils()
    mail_info = {
        "email": "test@qq.com",
        "name": "用户名",
        "site_name": "站点名称",
        "link": "评论链接",
        "connect": "原评论内容"
    }
    mail.send(mail_info)
