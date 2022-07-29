$.x(header, api + '/get/site/', function (r) {
    var html = ''
    if (r['code'] == 405) {
        alertmsg('error', r['message']);
        console.log(r);
        Q.go('home');
    } else if (r['code'] != 200) {
        alertmsg('error', '接口报错：' + r['message']);
        console.log(r);
        html = '站点数据加载出错！';
    } else {
        r['data'].forEach((item, index) => {
            html += `<div class="card-item">${item.name}<div class="site-info"><a href="#!set_site/${item.id}">网站设置</a><a href="#!comments/${item.id}">评论管理</a></div></div>`
        });
        html += '<a class="card-item" href="#!set_site">Create +<div class="site-info">创建一个新站点</div></a>';
    }
    $('#card').innerHTML = html;
});
