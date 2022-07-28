function get_token(){
	var data = JSON.stringify({
		"username":$('#username').value,
		"password": $('#password').value
	});
	header = JSON.stringify({"Content-Type": "application/json"});
	$.x(header,api+'/token',data,function(r){
		console.log(r);
		if(r['code'] == 200){
			$.stor('w_user','{"username":"'+$('#username').value+'","email":"'+$('#password').value+'","token":"'+r['data']['token_type']+' '+r['data']['access_token']+'"}',r['data']['expires']);
			alertmsg('success','欢迎 '+$('#username').value+' 登录成功！');
			user = JSON.parse($.stor('w_user'));
    		header = JSON.stringify({"Authorization": user.token,"Content-Type": "application/json"});
			Q.go('home');
		}else{
			alertmsg('error',r['data']);
		}
	});
}