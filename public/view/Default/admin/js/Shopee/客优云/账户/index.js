'use strict';
var fun =
{
    a01: function () {
        o.params.jsFile = o.params.jsFile ? o.params.jsFile : ""//选择JS文件
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页  
        o.params.field = o.params.field ? o.params.field : '1'//搜索字段
        o.params.searchword = o.params.searchword ? Tool.Trim(o.params.searchword) : "";//搜索关键词
        this.a02()
    },
    a02: function () {
        let data = [{
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/客优云/账户",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/客优云/账户.db"],
                database: "shopee/客优云/账户",
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let where = ""
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/账户",
            sql: "select " + Tool.fieldAs("id,sort,username,phone,note,points") + " FROM @.table" + where + Tool.limit(10, o.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/客优云/账户",
            sql: "select count(1) as Count FROM @.table" + where,
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (arr) {
        let tr = [], t = arr[0]
        for (let i = 0; i < t.length; i++) {
            tr.push('\
            <tr>\
                <td class="p-0"><input type="text" class="form-control center" value="'+ t[i].sort + '" onblur="fun.c44($(this),' + t[i].id + ',\'sort\',\'' + t[i].sort + '\')"/></td>\
                <td class="w30" style="padding-left: 30px;position: relative;">\
					<button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false" id="dropdown0"><div></div><div></div><div></div></button>\
					<ul class="dropdown-menu" aria-labelledby="dropdown0">\
						<li><a class="dropdown-item pointer" onClick="Tool.openR(\'jsFile=js15&id='+ t[i].id + '\')">修改</a></li>\
				        <li onClick="fun.c02('+ t[i].id + ')"><a class="dropdown-item pointer">删除</a></li>\
					</ul>\
				</td>\
				<td class="left">* <a href="javascript:;" onclick="fun.SignIn.a01('+ t[i].id + ',$(this).parent())" title="点击登陆">' + t[i].username + '</a></td>\
                <td>'+ t[i].phone + '</td>\
                <td>'+ (t[i].note ? t[i].note : "") + '</td>\
                <td>'+ t[i].points + '</td>\
           </tr>')
        }
        let html = Tool.header2(o.params.jsFile) + '\
		<div class="p-2">\
			<table class="table align-top table-hover center">\
				<thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
			</table>\
            ' + Tool.page(arr[1][0].Count, 10, o.params.page) + '\
		</div>'
        Tool.html(null, null, html)
    },
    /////////////////////////////////////
    b01: function () {
        let html = '\
        <tr>\
            <th class="left w50">排序</th>\
            <th class="w30" style="padding-left: 30px;position: relative;">'+ this.b02() + '</th>\
            <th class="left">用户名</th>\
            <th>手机</th>\
            <th>备注</th>\
            <th>积分</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="fun.c01()"><a class="dropdown-item pointer">添加账户</a></li>\
        </ul>'
    },
    ////////////////////////////////////////
    c01: function () {
        if (confirm('确定要添加吗')) {
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/账户",
                sql: "INSERT into @.table(@.addtime)VALUES(" + Tool.gettime("") + ")",
            }]
            Tool.ajax.a01(data, Tool.reload)
        }
    },
    c02: function (id) {
        if (confirm('确定要删除吗？')) {
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/账户",
                sql: "delete from @.table where @.id=" + id,
            }]
            Tool.ajax.a01(data, Tool.reload)
        }
    },
    SignIn:
    {
        a01: function (id, This) {
            This.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
            let oo = {
                id: id,
                This: This,
            }
            gg.isRD(this.a02, this, oo);
        },
        a02: function (t, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/账户",
                sql: "select " + Tool.fieldAs("username,password,localstorage,cookies") + " FROM @.table where @.id=" + oo.id,
            }]
            Tool.ajax.a01(data, this.a03, this, oo)
        },
        a03: function (t, o1) {
            let oo = t[0][0]
            o1.username = oo.username;
            let cookies = oo.cookies ? JSON.parse(oo.cookies) : oo.cookies
            Tool.loginKeyouyun.a01(oo.username, oo.password, cookies, JSON.parse(oo.localstorage), o1.This, this.a04, this, o1)
        },
        a04: function (t, oo) {
            let url = "https://erp.keyouyun.com/dashboard"
            oo.This.html("正在打开页面...");
            gg.tabs_remove_create_indexOf(2, url, ['<script'], false, this.a05, this, oo)
        },
        a05: function (t, oo) {
            oo.This.html('* <a href="javascript:;" onclick="fun.SignIn.a01(' + oo.id + ',$(this).parent())" title="点击登陆">' + oo.username + '</a>')
        }
    },
}
fun.a01();