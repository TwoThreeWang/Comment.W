# Comment.W

![Comment.W](https://cdn.wangtwothree.com/imgur/cnlax7n.jpg "Comment.W")

一款轻量、简洁、高效的前后端分离评论系统，专注评论，简单易用！

Comment.W 诞生于 2022 年 7 月 23 日，为个人业余时间开发，第一版本耗时两周，会持续更新（但是不会添加花里胡哨跟评论无关的功能）。

系统前端基于原生 html+css+javascript 减少依赖，后端使用基于 Python 的 FastApi 框架，快速、简洁且高效，数据库默认使用 SQLite 本地存储，备份简单，理论可切换为任意关系型数据库。

简单四行代码即可将 Comment.W 嵌入页面，理论上支持但不限于静态博客和文档程序使用。

DEMO: [https://comment.wangtwothree.com/](https://comment.wangtwothree.com/)

详细介绍：[https://comment.wangtwothree.com/#!doc](https://comment.wangtwothree.com/#!doc)

# 评论界面

![图片alt](https://cdn.wangtwothree.com/imgur/rEBiQpV.png)

# 功能特性

- 轻量、简单、快速、安全、高颜值，可灵活自定义样式
- 数据本地存储，可自定义切换不同数据库
- 支持颜文字、图片评论
- 自带可视化后台管理功能
- 后台可设置域名权限，防止评论框滥用
- 可添加多个站点，每个站点下可有多个页面
- 可配置多管理员，管理权限后台校验，管理员评论前端自带徽标
- 后端登录前端同享，避免二次登录
- 删除站点，站点下所有相关数据全部删除
- 基于 IP 的发布评论频率限制
- 评论邮件通知

# 后台功能截图

![图片alt](https://cdn.wangtwothree.com/imgur/JkoyoMP.png)

![图片alt](https://cdn.wangtwothree.com/imgur/0nr2thP.png)

![图片alt](https://cdn.wangtwothree.com/imgur/34Vnv89.png)

![图片alt](https://cdn.wangtwothree.com/imgur/vaM5SNV.png)

![图片alt](https://cdn.wangtwothree.com/imgur/s1Ke3w6.png)

![图片alt](https://cdn.wangtwothree.com/imgur/hxtUQwn.png)

![图片alt](https://cdn.wangtwothree.com/imgur/3D6HUZ1.png)

# 技术架构

系统前端基于原生 html+css+javascript 减少依赖，后端使用基于 Python 的 FastApi 框架，快速、简洁且高效，数据库默认使用 SQLite 本地存储，备份简单，理论可切换为任意关系型数据库。

# 项目结构
```
.
├─ routers          # 接口路由目录
│  ├─ auth.py       # 用户权限类
│  ├─ links.py      # 评论操作接口类
├─ sqlmodel         # 数据操作目录
│  ├─ crud.py       # 数据库操作类
│  ├─ database.py   # 数据库连接信息，切换数据库类型修改此文件
│  ├─ models.py     # 数据库表模型
│  ├─ schemas.py    # 数据模式
├─ utils            # 通用工具类目录
│  ├─ toolUtils.py  # 通用工具类
│  ├─ mailUtils.py  # 邮件工具类
├─ web_admin        # 前端代码（可将目录复制出去单独部署）
│  ├─ static        # 后台页面静态文件
│  │  ├─ css
│  │  │  ├─ md.css     # markdown 样式
│  │  │  ├─ style.css  # 后台管理页面样式
│  │  ├─ img
│  │  ├─ js
│  │  │  ├─ admin_comment_select.js  # 评论管理操作逻辑
│  │  │  ├─ admin_edit_site.js       # 站点管理操作逻辑
│  │  │  ├─ admin_sites.js           # 后台管理主页操作逻辑
│  │  │  ├─ itorr.js                 # 开源的原生JS功能封装
│  │  │  ├─ login.js                 # 登陆页面操作逻辑
│  │  │  ├─ mdjs.min.js              # 开源 markdown 解析函数（有修改）
│  │  │  ├─ q.js                     # 开源前端单页路由框架
│  ├─ templet                          # 页面模板目录
│  │  ├─ admin                         # 管理页面模板
│  │  │  ├─ admin_comment_select.html  # 评论管理页面模板
│  │  │  ├─ index.html                 # 后台管理主页模板
│  │  │  ├─ login.html                 # 登录页模板
│  │  │  ├─ site.html                  # 站点管理页模板
│  │  ├─ help.html   # 文档页模板（本页面）
│  │  ├─ home.html   # 前台主页模板
│  ├─ comment_w.css  # 嵌入评论框样式
│  ├─ comment_w.js   # 嵌入评论框操作函数
│  ├─ index.html     # 前台首页入口函数
│  ├─ admin.html     # 后台首页入口函数
├─ config.ini         # 配置文件
├─ data.db          # sqlite 数据文件，程序启动会自动生成
├─ main.py          # 后端接口主文件
```

# 部署教程

**一、后端部署**

1、创建项目目录，将代码拷贝到目录下
```
mkdir comment
cd comment
```
2、创建虚拟环境
```
virtualenv myenv --python=python绝对路径
# --python 指定python版本，如果机器上只有一个python可不用此参数
```
3、激活虚拟环境并安装依赖包
```
source myenv/bin/activate
pip install -r requirements.txt
```
4、运行后端程序
```
python main.py
```

5、Nginx 代理设置

项目启动后默认端口 1204，需要配置 nginx 反向代理供前端调用

本站配置是将域名指向前端，`域名/api` 指向后端接口

由于接口限流及域名校验需要将前台用户真实 IP 及调用域名反馈到接口中，所以 nginx 配置时需要增加 Host 和 X-Real-IP 配置，如下为本站 nginx 配置参考：

```
#PROXY-START/api

location ^~ /api/
{
    proxy_pass http://127.0.0.1:1204/;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;

    #Set Nginx Cache
    
    
    set $static_filestbTNtrt 0;
    if ( $uri ~* "\.(gif|png|jpg|css|js|woff|woff2)$" )
    {
    	set $static_filestbTNtrt 1;
    	expires 12h;
        }
    if ( $static_filestbTNtrt = 0 )
    {
    add_header Cache-Control no-cache;
    }
}

#PROXY-END/api
```

配置完成后，访问 `你的域名/api` 应该能正常返回接口提示信息：

```
{
"code": 200,
"message": "Success",
"data": "Comment.W 评论后端 API，详细介绍：https://comment.wangtwothree.com"
}
```

6、初始化设置

- 后台接口根据用户真实 IP 限制流量，默认一个用户每分钟最大请求数量为 20 次，限制策略可在 main.py 中修改
- 可设置多管理员，`routers/auth.py` 文件中 `USER_LIST` 参数为管理员用户设置
- 如果要使用邮件通知功能，请修改 config.ini 中的邮箱账号配置，部分邮箱需要使用客户端专用密码，邮箱配置参考：https://github.com/zhangyunhao116/zmail/blob/master/README-cn.md

**二、前端部署**

目录 web_admin 为前端根目录，前端项目为纯 html+css+js 项目，直接域名解析到此目录即可

- index.html 为前台项目介绍页面
- admin.html 为后台首页

后端项目部署后，需要将反向代理后的接口地址配置到前端，将 web_admin 目录下的 index.html 和 admin.html 文件中的 api 参数修改为自己的后台接口地址即可。

# 使用教程

**1、后台登陆**

后台登陆页面：`你的域名/admin.html`

使用后端设置的用户名密码登陆即可

**2、新增站点**

首页点击 Create+ 可以添加站点

站点名称自定义即可；

允许的域名如果为空，表示所有网站都可以使用该站点的评论框，有被恶意使用风险，强烈建议设置域名；
如果设置了域名，则接口会校验来路域名是否包含在此处设置的域名中，非允许域名不允许评论及获取评论数据等任何操作；
一个站点可设置多个域名，使用英文逗号分隔即可，如："abc.com,def.com,aaa.com"

![图片alt](https://cdn.wangtwothree.com/imgur/qz9j8ja.png)

![图片alt](https://cdn.wangtwothree.com/imgur/e6rP4Dy.png)

**3、站点管理**

该页面可以修改站点名称及域名设置，同时该站点的评论框嵌入代码也在此处获取

![图片alt](https://cdn.wangtwothree.com/imgur/q1l0Uog.png)

嵌入代码 comment\_w\_config 参数中 api 为你自己的后端接口 API 地址； sid 为站点 ID，每个站点只有一个唯一ID，不可修改；key 为页面的标识符，可自定义，同一站点有多个页面，设置不同的 key 即可。

**4、评论管理**

不同站点不同页面的评论数据相互隔离，该页面可选择不同的站点，不同页面下的评论内容进行删除及回复操作。

站点和页面两个选项为必选框，搜索框如果为空，默认获取该站点页面下的所有评论；搜索框不为空时，会模糊搜索匹配用户名和内容相关的评论数据

![图片alt](https://cdn.wangtwothree.com/imgur/aoGhutS.png)

# 赞助

如果你觉得 Comment.W 对你有帮助，或者想对我微小的工作一点资瓷，欢迎扫码赞助。

![图片alt](https://cdn.wangtwothree.com/imgur/P77PJh2.png=150x200)

# 巨人的肩膀

tiangolo/fastapi: FastAPI
https://github.com/tiangolo/fastapi

itorr/iTorr.js: 基础类框架
https://github.com/itorr/iTorr.js

itorr/q.js: 炒鸡轻量的前端单页路由框架
https://github.com/itorr/q.js

SomeBottle/Comment.B: 简单的无数据库评论框系统
https://github.com/SomeBottle/Comment.B

hangxingliu/mdjs: A Lightweight Markdown Parser (JavaScript)
https://github.com/hangxingliu/mdjs
