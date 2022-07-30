if(!site_id){site_id = 1;}
var search_key = $('#key').value;
function get_sites_info(){
    $.x(header,api+'/get/site/',function(r){
        if(r['code']!=200){
            alertmsg('error','接口报错：'+r['message']);
            console.log(r);
        }else{
            html = '<option>选择站点</option>';
            r['data'].forEach((item,index)=>{
                html+=`<option value ="${item.id}" ${item.id==site_id?'selected':''}>${item.name}</option>`
            });
            
            $('#site-select').innerHTML = html;
        }
    })  
}
get_sites_info();
function get_site_key_info(){
    $.x(header,api+'/get/key/'+site_id,function(r){
        if(r['code']!=200){
            alertmsg('error','接口报错：'+r['message']);
            console.log(r);
        }else{
            html = '<option>选择页面标识KEY</option>';
            r['data'].forEach((item)=>{
                html+=`<option value ="${item}" ${item==page_key?'selected':''}>${item}</option>`
            });
            
            $('#key-select').innerHTML = html;
        }
    })  
}
get_site_key_info();
function do_search(){
    var comment_body = $('#commentArea');
    comment_body.innerHTML = "<div id='com_more'>搜索中...</div>";
    $.x(header,api+'/search/comment/'+site_id+'/'+page_key+'/'+search_key,function(result){
        if(result['code']!=200){
            alertmsg('error','接口报错：'+result['message']);
            $('#com_more').innerHTML="评论数据加载失败 (╥_╥)";
            console.log(result);
        }else{
            console.log(result);
            if(result['data'] instanceof Array){
                var comment_data = commentTree(result['data']);
                if(comment_data==''){
                    comment_data += '<div id="com_more">无更多评论 ╮(╯▽╰)╭</div>'
                }
            }else{
                var comment_data = '<div id="com_more">'+result['data']+'</div>';
            }
            comment_body.innerHTML = comment_data;
        }
    })  
}
function changeSelect(id,value){
    if(id=='site-select'){
        site_id = value;
        get_site_key_info();
    }else if(id=='key-select'){
        page_key = value;
    }
}
function search(){
    search_key = $('#key').value;
    if(search_key&&search_key!=''){
        if(!site_id || !page_key){
            alert('站点ID和页面标识KEY必选！');
            return;
        }
        do_search();
    }else{
        page_key = $('#key-select').value;
        site_id = $('#site-select').value;
        Q.go('comments/'+site_id+'/'+page_key);
        get_comments();
    }
}

function commentTree(commentList){
    comment_str = "";
    commentList.forEach(function(row) {
        if (row.pid == 0){
            var flag = "com_top";
            var reply_name = "";
        }else{
            var flag = "com_reply";
            var reply_name = "@"+row.p_name+"：";
        }
        var img_box = '<div class="com_imageBox">';
        row.content = row.content.replace(/!\[.*?\]\((.*?)\)/mg, function (match, capture) {
            img_box+=`<img src="${capture}" class="com_img" onclick="expandPhoto(this)"/>`
            return '';
        });
        img_box+='</div>'
        var temps = '<div class="com_body '+flag+'"><div class="com_name">'+row.name+(row.is_admin?'<span class="com_admin">管理</span>':'')+'<span class="com_time">'+row.create_time+'</span><a href="javascript:do_reply('+row.id+','+(row.rid==0?row.id:row.rid)+',\''+row.name+'\',this)" class="com_button_reply">回复</a><a href="javascript:del_comment('+row.id+')" class="com_button_reply">删除</a></div><div class="com_content">'+reply_name + row.content+'</div>'+img_box+'</div>';
        comment_str += temps;
        if (row.child && row.child.length>0){
            comment_str += "<div class='replay_body'>"+commentTree(row.child)+"</div>";
        }
    });
    return comment_str;
}

var page=1;
function get_comments(page=1){
    var more_msg = $('#com_more');
    var comment_body = $('#commentArea');
    $.x(header,api+'/list/comment/'+site_id+'/'+page_key+'/'+page,function(result){
        if(result['code']!=200){
            alertmsg('error','接口报错：'+result['message']);
            more_msg.innerHTML="评论数据加载失败 (╥_╥)";
            console.log(result);
        }else{
            if(result['data'] instanceof Array){
                var comment_data = commentTree(result['data']);
                if(comment_data!==''){
                    comment_data += '<div id="com_more" onclick="get_comments('+(page+1)+')">更多评论</div>'
                }else{
                    comment_data += '<div id="com_more">无更多评论 ╮(╯▽╰)╭</div>'
                }
            }else{
                var comment_data = '<div id="com_more">'+result['data']+'</div>';
            }
            more_msg?more_msg.remove():null;
            if(page==1){comment_body.innerHTML=''};
            comment_body.innerHTML += comment_data;
        }
    })  
}
function del_comment(id){
    var msg = "删除评论将同步删除该评论下所有子评论，确认删除吗？";
    if (confirm(msg)!==true){
        return false;
    }
    $.x(header,api+'/del/comment/'+id,function(r){
        if(r['code']!=200){
            alertmsg('error','接口报错：'+r['message']);
            console.log(r);
        }else{
            alertmsg('success',r['data']);
            page_key = $('#key-select').value;
            site_id = $('#site-select').value;
            Q.go('comments/'+site_id+'/'+page_key);
            setTimeout('document.location.reload()',1000);
        }
    })  
}
var reply_info={"pid":0,"rid":0};
function do_reply(pid,rid,p_name,item){
    $('#com_reply_body').style.display='';
    $("#com_reply_name").innerHTML=p_name;
    reply_info={"pid":pid,"rid":rid};
    document.querySelector('#key').scrollIntoView(true);
}
function remove_reply(){
    $("#com_reply_body").style.display="none";
    $("#com_reply_name").innerHTML="";
    reply_info={"pid":0,"rid":0};
}
function chenge_yan(){
    var flag = $("#com_yan")
    if(flag.style.display=="none"){
        flag.style.display="";
    }else{
        flag.style.display="none";
    }
}
function add_yan(con){
    $("#comment_text").value += con;
}
function add_img(){
    var img_url = prompt("请输入图片链接：");
    $("#comment_text").value+=`![](${img_url})`;
}
function do_send(){
    var data = JSON.stringify({
        "pid": reply_info.pid,
        "rid": reply_info.rid,
        "page_key": page_key,
        "site_id": site_id,
        "name": user.username,
        "email": user.email,
        "content": $("#comment_text").value
    });
    $("#send_button").innerHTML="发送中...";
    console.log(header);
    $.x(header,api+'/add/comment',data,function(r){
        if(r['code']!=200){
            alertmsg('error','接口报错：'+r['message']);
            console.log(r);
            $("#send_button").innerHTML="发送";
            document.querySelector('#head').scrollIntoView(true);
        }else{
            document.querySelector('#head').scrollIntoView(true);
            alertmsg('success',r['data']);
            setTimeout('document.location.reload()',1000);
        }
    }) 
}
if(page_key&&site_id){
    get_comments();
}
/** 以下是图片点击放大缩小逻辑 **/
function expandPhoto(item) {
    var overlay = document.createElement("div");
    overlay.setAttribute("id", "overlay");
    overlay.setAttribute("class", "overlay");
    document.body.appendChild(overlay);
    var img = document.createElement("img");
    img.setAttribute("class", "overlayimg");
    img.src = item.getAttribute("src");
    document.getElementById("overlay").appendChild(img);
    overlay.onclick = restore;
}
function restore() {
    document.body.removeChild(document.getElementById("overlay"));
}