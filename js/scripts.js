/**
 * Created by 宇强 on 2016/10/2 0002.
 */
/**
 * 微信二维码扫描
 */
function wechat() {
    $('#myWechat').modal({
        keyboard: true
    });
}

/**
 * 模态对话框
 */
//确认模态框
function showComfirmDialog(title, body, ok) {
    $('#myComfirmLabel').html(title);
    $('#myComfirmBody').html(body);
    $('#btn_comfirm_ok').click(ok);
    $('#comfirmDialog').modal('show');
}

function dismissComfirmDialog() {
    $('#comfirmDialog').modal('hide')
}
//消息模态框
function showMsgDialog(body) {
    $('#myMsgLabel').html('消息提示');
    $('#myMsgBody').html(body);
    $('#msgDialog').modal('show');
}

/**
 *文章页面ftl脚本
 */
// 刷新访问量和喜爱数
function refreshLookedAndLikes(refreshURL) {
    $.ajax({
        type: "GET",
        url: refreshURL,
        success: function (art) {
            // alert(art['result']['article']['looked']+" -- " +art['result']['article']['likes']);
            updateLookedAndLikes('looked', art['result']['article']['looked'], 'likes', art['result']['article']['likes']);
        }
    });
}
//刷新最新三篇文章
function refreshLast3Articles(url,contextPath){
    $.ajax({
        url:url,
        type:'get',
        success: function (data) {
            var articles = data['result']['articles'];
            var html = "";
            for(var i=0;i<articles.length;i++){ html+="<li class=" list-group-item"="">" +'<div="" class="list-group-item-heading text-left">'
                    +'<h5><a href="'+contextPath+articles[i]['staticURL']+'/">'+articles[i]['title']+'</a></h5>'
                    +''
                    +'<div class="list-group-item-text text-right">'
                    +'<em>'+articles[i]['showtime'].replace('T',' ')+'</em>'
                    +'</div>'
                    +'';
            }
            html+='<li class="list-group-item text-center">'
                +'<a href="'+contextPath+'/list">more</a>'
                +'</li>';
            $('#last3').html(html);
        },
        error: function (error) {
            showMsgDialog("网络出错");
        }
    });
}
//刷新标签列表
function refreshCategories(url,contextPath){
    $.ajax({
        url:url,
        type:'get',
        success: function (data) {
            var categories = data['result']['categories'];
            var html="";
            for(var i=0;i<categories.length;i++){ html+="<li class=" list-group-item"=""><a href="" +contextpath+'="" list?cid="+categories[i][" cid']+'"="">'+categories[i]['cname']+'('+categories[i]['count']+')';
            }
            $('#categories').html(html);
        },
        error: function (error) {
            showMsgDialog("网络出错");
        }
    });
}

//用户点击喜爱文章
function like(likeURL) {
    $.ajax({
        type: "GET",
        url: likeURL,
        success: function (art) {
            var looked = art['result']['article']['looked'];
            var likes = art['result']['article']['likes'];
            updateLookedAndLikes('looked', looked, 'likes', likes);
        }
    });
}
//更新页面信息
function updateLookedAndLikes(lookedID, looked, likesID, likes) {
    var lookedEle = document.getElementById(lookedID);
    lookedEle.innerHTML = "<span class="glyphicon glyphicon-eye-open"></span> " + looked + " 已阅";
    var likesEle = document.getElementById(likesID);
    likesEle.innerHTML = "<span class="glyphicon glyphicon-heart"></span> " + likes + " 喜爱";
}
//列表的like
function like1(likeURL,artid) {
    $.ajax({
        type: "GET",
        url: likeURL,
        success: function (art) {
            var looked = art['result']['article']['looked'];
            var likes = art['result']['article']['likes'];
            updateLookedAndLikes1('looked-'+artid, looked, 'likes-'+artid, likes);
        }
    });
}
//更新页面信息
function updateLookedAndLikes1(lookedID, looked, likesID, likes) {
    var lookedEle = document.getElementById(lookedID);
    lookedEle.innerHTML = "<span class="glyphicon glyphicon-eye-open"></span> " + looked;
    var likesEle = document.getElementById(likesID);
    likesEle.innerHTML = "<span class="glyphicon glyphicon-heart"></span> " + likes;
}
//跳转到留言板
function onComment(commentUrl, title, artid) {
    var form = document.createElement('form');
    form.action = commentUrl;
    form.method = "post";
    form.style.display = "none";

    var input = document.createElement("input");
    input.name = "title";
    input.value = title;
    form.appendChild(input);

    var input2 = document.createElement("input");
    input2.name = "artid";
    input2.value = artid;
    form.appendChild(input2);

    document.body.appendChild(form);
    form.submit();
}
//留言校验
function submitComment(url) {
    var nickname = $('#nickname').val();
    var gemail = $('#gemail').val();
    var comcontent = $('#comcontent').val();
    if (nickname == null || nickname.length == 0) {
        showMsgDialog('昵称不能为空哦！');
        return false;
    }
    if (gemail == null || gemail.length == 0) {
        showMsgDialog('邮箱不能为空哦！');
        return false;
    }
    if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(gemail)) {
        showMsgDialog('邮箱格式不正确！');
        return false;
    }
    if (comcontent == null || comcontent.length == 0) {
        showMsgDialog('留言内容不能为空哦！');
        return false;
    }

    //ajax提交表单
    var option = {
        url: url,
        type: 'POST',
        dataType: 'json',
        headers: {"ClientCallMode": "ajax"}, //添加请求头部
        success: function (data) {
            //提取结果消息
            var status = data['status'];
            var message = data['result']['message'];
            //显示消息
            if (status['code'] == 0) {
                //输入框重置
                $('#nickname').val('');
                $('#gemail').val('');
                $('#comcontent').val('');

                showMsgDialog(message);
            } else {
                showMsgDialog(message);
            }
        },
        error: function (data) {
            showMsgDialog("提交失败,请刷新后重试，错误信息：" + data);
        }
    };
    $('#form').ajaxSubmit(option);

    return false;
}

//留言审核通过
function checkAllComment(url) {
    $('#btn_pass_ok').click(function () {
        var pass = $('#passD').val();
        $.ajax({
            url: url + '?pass=' + pass,
            type: 'post',
            dataType: 'json',
            data: {},
            success: function (res) {
                var status = res['status'];
                if (status['code'] == 0) {
                    showMsgDialog(res.result);
                } else {
                    showMsgDialog('留言设置失败,原因：' + status['reason']);
                }
            },
            error: function (res) {
                showMsgDialog('网络错误，错误信息为：' + JSON.stringify(res));
            }
        });
        $('#passDialog').modal('hide');
    });
    $('#passDialog').modal('show');
    return false;
}
</a></categories.length;i++){></div=""></articles.length;i++){>