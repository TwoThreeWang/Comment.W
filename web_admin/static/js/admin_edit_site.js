if(!site_id){
    $('#edit_site_but').style.display="none";
    $('#add_site_but').style.display="";
    $('#site_title').innerHTML="新增站点";
    $('#sid_item').style.display="none";
    $('#time_item').style.display="none";
    $('#code_item').style.display="none";
}else{
    get_site_info();
}

function get_site_info(){
    $.x(header,api+'/get/site/'+site_id,function(r){
        console.log(r);
        if(r['code']!=200){
            alertmsg('error','接口报错：'+r['message']);
            console.log(r);
        }else{
            if(!r['data'].id){
                alertmsg('error','查无此站！');
                Q.go('home');
            }
            $('#sid').innerHTML = r['data'].id;
            $('#create_time').innerHTML = r['data'].create_time;
            $('#sitename').value = r['data'].name;
            $('#allow_origins').value = r['data'].allow_origins;
            var domain = window.location.host;
            $('#in_code').innerHTML = `<link rel=stylesheet href="https://${domain}/comment_w.css">
<div id="comment_w"></div>
<script>
  var comment_w_config = {
    "api": "${api}",
    "sid": ${r['data'].id},
    "key": "HelloWorld"
  }
</script>
<script src="https://${domain}/comment_w.js"></script>`
        }
    })  
}

function edit_site(){
    var data = JSON.stringify({
        "name": $('#sitename').value,
        "allow_origins": $('#allow_origins').value,
        "id": parseInt($('#sid').innerHTML),
        "create_time": $('#create_time').innerHTML
    });
    $.x(header,api+'/update/site/',data,function(r){
        if(r['code'] == 200){
            alertmsg('success',r['data']);
            setTimeout('document.location.reload()',1000);
        }else{
            alertmsg('error',r['message']);
        }
    });
}

function del_site(){
    $.x(header,api+'/delete/site/'+$('#sid').innerHTML,function(r){
        if(r['code'] == 200){
            alertmsg('success',r['data']);
            Q.go('home');
            setTimeout('document.location.reload()',1000);
        }else{
            alertmsg('error',r['message']);
        }
    });
}

function add_site(){
    var data = JSON.stringify({
        "name": $('#sitename').value,
        "allow_origins": $('#allow_origins').value
    });
    $.x(header,api+'/add/site',data,function(r){
        if(r['code'] == 200){
            alertmsg('success',r['message']);
            Q.go('home');
            setTimeout('document.location.reload()',1000);
        }else{
            alertmsg('error',r['message']);
        }
    });
}