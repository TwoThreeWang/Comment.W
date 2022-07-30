/* 原生JS仿AJAX */
function ajax(){ 
  var ajaxData = { 
    type:arguments[0].type || "GET", 
    url:arguments[0].url || "", 
    async:arguments[0].async || "true", 
    data:arguments[0].data || null, 
    dataType:arguments[0].dataType || "text", 
    contentType:arguments[0].contentType || "application/x-www-form-urlencoded", 
    beforeSend:arguments[0].beforeSend || function(){}, 
    success:arguments[0].success || function(){}, 
    error:arguments[0].error || function(){} 
  } 
  ajaxData.beforeSend() 
  var xhr = createxmlHttpRequest();  
  xhr.responseType=ajaxData.dataType; 
  xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);  
  xhr.setRequestHeader("Content-Type",ajaxData.contentType);  
  xhr.send(convertData(ajaxData.data));  
  xhr.onreadystatechange = function() {  
    if (xhr.readyState == 4) {  
      if(xhr.status == 200){ 
        ajaxData.success(xhr.response) 
      }else{ 
        ajaxData.error() 
      }  
    } 
  }  
}
function createxmlHttpRequest() {  
  if (window.ActiveXObject) {  
    return new ActiveXObject("Microsoft.XMLHTTP");  
  } else if (window.XMLHttpRequest) {  
    return new XMLHttpRequest();  
  }  
} 
function convertData(data){ 
  if( typeof data === 'object' ){ 
    var convertResult = "" ;  
    for(var c in data){  
      convertResult+= c + "=" + data[c] + "&";  
    }  
    convertResult=convertResult.substring(0,convertResult.length-1) 
    return convertResult; 
  }else{ 
    return data; 
  } 
}
/* 评论逻辑 */
document.getElementById('comment_w').innerHTML = `<div class="com_reply_body"id="com_reply_body"><div class="com_reply_msg"id="com_reply_msg"style="display:none">Reply to：<b id="com_reply_name"></b><span onclick="remove_reply()">取消回复</span></div><textarea rows="5"name="text"id="comment_text"class="text"tabindex="5"required=""></textarea><div class="com_yan"id="com_yan"style="display:none"><span onclick="add_yan(' w(ﾟДﾟ)w ')">w(ﾟДﾟ)w</span><span onclick="add_yan(' (╥_╥) ')">(╥_╥)</span><span onclick="add_yan(' ︿(￣︶￣)︿ ')">︿(￣︶￣)︿</span><span onclick="add_yan(' o(￣ヘ￣o＃) ')">o(￣ヘ￣o＃)</span><span onclick="add_yan(' (＠_＠;) ')">(＠_＠;)</span><span onclick="add_yan(' X﹏X ')">X﹏X</span><span onclick="add_yan(' :-) ')">:-)</span><span onclick="add_yan(' (๑•̀ㅂ•́)و✧ ')">(๑•̀ㅂ•́)و✧</span><span onclick="add_yan(' （*＾-＾*） ')">（*＾-＾*）</span><span onclick="add_yan(' (￣△￣；) ')">(￣△￣；)</span><span onclick="add_yan(' (⊙ˍ⊙) ')">(⊙ˍ⊙)</span><span onclick="add_yan(' ╮（╯＿╰）╭ ')">╮（╯＿╰）╭</span><span onclick="add_yan(' (⊙﹏⊙) ')">(⊙﹏⊙)</span><span onclick="add_yan(' （╬￣皿￣） ')">（╬￣皿￣）</span><span onclick="add_yan(' Thanks♪(･ω･)ﾉ ')">Thanks♪(･ω･)ﾉ</span></div><div class="com_reply_button"><div><span class="com_button"onclick="chenge_yan()">表情</span><span class="com_button"onclick="add_img()">图片</span></div><div class="comm_button_body"><span class="com_user"id="com_user"style="display:none"><span id="com_username"></span><a href=""onclick="com_login_out()">[退出]</a></span><span class="com_login"id="com_login"><input placeholder="用户名"type="text"class="input"id="comm_username"><input placeholder="邮箱"type="text"class="input"id="comm_email"></span><span class="com_button"onclick="do_send()"id="send_button">发送</span></div></div></div><div class="coms_body"id="commentArea"><div id="com_more">初始化...</div></div>`;
var reply_info={"pid":0,"rid":0};
/* 回复评论 */
function do_reply(pid,rid,p_name){
	document.getElementById("com_reply_msg").style.display="";
	document.getElementById("com_reply_name").innerHTML=p_name;
	reply_info={"pid":pid,"rid":rid};
	document.querySelector('#comment_w').scrollIntoView(true);
}
/* 移除回复 */
function remove_reply(){
	document.getElementById("com_reply_msg").style.display="none";
	document.getElementById("com_reply_name").innerHTML="";
	reply_info={"pid":0,"rid":0};
}
/* 颜文字按钮 */
function chenge_yan(){
	var flag = document.getElementById("com_yan")
	if(flag.style.display=="none"){
		flag.style.display="";
	}else{
		flag.style.display="none";
	}
}
/* 点击颜文字添加到评论框 */
function add_yan(con){
	document.getElementById("comment_text").value += con;
}
/* 添加图片链接 */
function add_img(){
	var img_url = prompt("请输入图片链接：");
	if(img_url){document.getElementById("comment_text").value+=`![](${img_url})`;}
}
/* 退出登录 */
function com_login_out(){
	localStorage.removeItem('w_user');
	location.reload();
}
/* 获取登录信息 */
function get_user(){
	var user = JSON.parse(localStorage.getItem('w_user'));
	if(document.getElementById("comm_username").value!='' && !user){
		localStorage.setItem('w_user','{"username":"'+document.getElementById("comm_username").value+'","email":"'+document.getElementById("comm_email").value+'"}');
		user = JSON.parse(localStorage.getItem('w_user'));
	}
	if(user){
		document.getElementById("com_login").style.display="none";
		document.getElementById("com_user").style.display="";
		document.getElementById("com_username").innerHTML=user.username;
		document.getElementById("comm_username").value=user.username;
		document.getElementById("comm_email").value=user.email;
	}
}
get_user();
/* 生成评论树*/
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
		    img_box+=`<img src="${capture}" class="com_img" onclick="expandPhoto(this)" title="点击查看大图"/>`
		    return '';
		});
		img_box+='</div>'
        var temps = '<div class="com_body '+flag+'"><div class="com_name">'+row.name+(row.is_admin?'<span class="com_admin">管理</span>':'')+'<span class="com_time">'+row.create_time+'</span><a href="javascript:do_reply('+row.id+','+(row.rid==0?row.id:row.rid)+',\''+row.name+'\')" class="com_button_reply">回复</a></div><div class="com_content">'+reply_name + row.content+'</div>'+img_box+'</div>';
        comment_str += temps;
        if (row.child && row.child.length>0){
			comment_str += "<div class='replay_body'>"+commentTree(row.child)+"</div>";
        }
    });
    return comment_str;
}
/* 获取评论 */
function get_comments(page=1){
	var more_msg = document.getElementById('com_more');
	var comment_body = document.getElementById('commentArea');
	ajax({ 
	  type:"GET", 
	  url:comment_w_config.api+"/list/comment/"+comment_w_config.sid+"/"+comment_w_config.key+"/"+page, 
	  dataType:"json", 
	  beforeSend:function(){ 
	    more_msg.innerHTML=" (ง •̀_•́)ง 评论数据加载中...";
	  }, 
	  success:function(result){
	  		console.log(result);
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
			more_msg.remove();
			if(page==1){comment_body.innerHTML=''};
			comment_body.innerHTML += comment_data;
	  }, 
	  error:function(e){
			more_msg.innerHTML="评论数据加载失败 (╥_╥)";
			console.log(e);
	  } 
	}) 
}
get_comments();
/* 发送评论 */
function send_data(username,email){
	var data = JSON.stringify({
	    "pid": reply_info.pid,
	    "rid": reply_info.rid,
	    "page_key": comment_w_config.key,
	    "site_id": comment_w_config.sid,
	    "name": username,
	    "email": email,
	    "content": document.getElementById("comment_text").value
	});
	ajax({ 
	  type:"POST", 
	  url:comment_w_config.api+"/add/comment", 
	  dataType:"json", 
	  contentType:"application/json",
	  data:data, 
	  beforeSend:function(){ 
	    document.getElementById("send_button").innerHTML="发送中...";
	  }, 
	  success:function(result){
	  	if(result['code']==200){
	  		remove_reply();
				document.getElementById("comment_text").value="";
				get_comments();
	  	}else{
	  		alert('评论出错:'+result['message']);
			console.log(result);
	  	}
	  	document.getElementById("send_button").innerHTML="发送";
	  }, 
	  error:function(e){
	  	alert('评论出错！'+e);
		document.getElementById("send_button").innerHTML="发送";
		console.log(e);
	  } 
	})	
}
/* 点击发送处理逻辑 */
function do_send(){
	var username = document.getElementById("comm_username").value;
	if(!username || !document.getElementById("comment_text").value){
		alert("用户名或评论内容不能为空！");
		return;
	}
	var email = document.getElementById("comm_email").value;
	get_user();
	send_data(username,email);
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
