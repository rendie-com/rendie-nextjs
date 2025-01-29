'use strict';
var fun =
{
    a01: function () {
        obj.params.jsFile = obj.params.jsFile ? obj.params.jsFile : ""//选择JS文件
        obj.params.page = obj.params.page ? parseInt(obj.params.page) : 1;//翻页  
        this.a02();
    },
    a02: function () {
        let data = [{
            action: "sqlite",
            database: "1688/买家账户",
            sql: "select count(1) as total FROM @.table",
        }, {
            action: "sqlite",
            database: "1688/买家账户",
            sql: "select " + Tool.fieldAs("id,sort,note,cookies,username,addtime,phone") + " FROM @.table order by @.sort asc " + Tool.limit(20, obj.params.page),
        }]
        Tool.ajax.a01(data, this.a03, this)
    },
    a03: function (t) {
        let html = "", arr = t[1]
        for (let i = 0; i < arr.length; i++) {
            html += '\
            <tr>\
                <td>'+ arr[i].sort + '</td>\
		        <td style="padding-left: 30px;position: relative;">\
			        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
			        <ul class="dropdown-menu">\
				        <li onClick="Tool.openR(\'?jsFile=js01&id='+ arr[i].id + '\')"><a class="dropdown-item pointer">修改</a></li>\
				        <li onClick="fun.c02('+ arr[i].id + ')"><a class="dropdown-item pointer">删除</a></li>\
			        </ul>\
		        </td>\
                <td class="left">* <a href="javascript:;" onclick="fun.SignIn.a01('+ arr[i].id + ',$(this).parent())" title="点击登陆">' + arr[i].username + '</a></td>\
                <td class="left">'+ arr[i].phone + '</td>\
                <td class="left">'+ arr[i].note + '</td>\
                <td>'+ Tool.js_date_time2(arr[i].addtime, "/") + '</td>\
            </tr>'
        }
        html = '\
        <header class="panel-heading">1688 &gt; 买家账户</header>\
        <div class="p-2">\
          <table class="table table-hover align-middle center">\
            <thead class="table-light">'+ this.b01() + '</thead>\
            <tbody>'+ html + '</tbody>\
          </table>\
          ' + Tool.page(t[0][0].total, 20, obj.params.page) + '\
        </div>'
        Tool.html(null, null, html)
    },
    b01: function () {
        return '\
        <tr>\
            <th class="w50">排序</th>\
            <th class="w30" style="padding-left: 30px;position: relative;">\
                <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false" id="dropdown0"><div></div><div></div><div></div></button>\
                <ul class="dropdown-menu" aria-labelledby="dropdown0">\
                    <li><a class="dropdown-item pointer" onClick="fun.c01()">添加</a></li>\
                </ul>\
            </th>\
            <th class="left">登录用户名</th>\
            <th class="left">手机</th>\
            <th class="left">备注</th>\
            <th class="w170">添加时间</th>\
        </tr>'
    },
    c01: function () {
        if (confirm('确定要添加吗')) {
            let data = [{
                action: "sqlite",
                database: "1688/买家账户",
                sql: "INSERT into @.table(@.addtime)VALUES(" + Tool.gettime("") + ")",
            }]
            Tool.ajax.a01(data, Tool.reload)
        }
    },
    c02: function (id) {
        if (confirm('确定要删除吗？')) {
            let data = [{
                action: "sqlite",
                database: "1688/买家账户",
                sql: "delete from @.table where @.id=" + id,
            }]
            Tool.ajax.a01(data, Tool.reload)
        }
    },
    SignIn:
    {
        a01: function (id, This) {
            This.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
            gg.isRD(this.a02, this, { id: id, This: This });
        },
        a02: function (t, oo) {
            let data = [{
                action: "sqlite",
                database: "1688/买家账户",
                sql: "select " + Tool.fieldAs("username,password,cookies") + " FROM @.table where @.id=" + oo.id,
            }]
            Tool.ajax.a01(data, this.a03, this, oo)
        },
        a03: function (t, oo) {
            oo.username = t[0][0].username
            Tool.login1688.a01(t[0][0].username, t[0][0].password, t[0][0].cookies, oo.This, this.a04, this, oo)
        },
        a04: function (isTab, oo) {
            if (isTab) {
                this.a05("", oo)
            }
            else {
                let url = "https://work.1688.com/home/page/index.htm?tracelog=login_target_is_blank_1688"
                oo.This.html("正在打开页面...");
                gg.tabs_remove_create_indexOf(2, url, ['>' + oo.username + '<'], false, this.a05, this, oo)
            }
        },
        a05: function (t, oo) {
            oo.This.html('* <a href="javascript:;" onclick="fun.SignIn.a01(' + oo.id + ',$(this).parent())" title="点击登陆">' + oo.username + '</a>')
        }
    },
}
fun.a01();