'use strict';
var fun =
{
    a01: function () {
        // o.params.jsFile    选择JS文件
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
    a03: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/账户",
            sql: "select " + Tool.fieldAs("id,authInfo") + " FROM @.table where @.isDefault=1",
        }]
        Tool.ajax.a01(data, this.a04, this);

    },
    a04: function (t) {
        let authInfo = JSON.parse(t[0][0].authInfo)
        let tr = []
        for (let i = 0; i < authInfo.length; i++) {
            tr.push('\
            <tr>\
                <td class="p-0">'+ this.b07(authInfo[i].region, authInfo[i].shopId) + '</td>\
                <td class="left p-0">'+ this.b06(authInfo[i].shopName, authInfo[i].name) + '</td>\
                <td class="p-0">'+ this.b04(authInfo[i].authTime, authInfo[i].expired, authInfo[i].expireTime) + '</td>\
                <td class="p-0">'+ this.b05(authInfo[i].chatAuth, authInfo[i].chatAuth) + '</td>\
                <td class="p-0">'+ this.b03(authInfo[i].sipShops) + '</td>\
          </tr>')
        }
        let html = Tool.header2(o.params.jsFile) + '\
		<div class="p-2">\
			<table class="table align-top table-hover center">\
				<thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
			</table>\
		</div>'
        Tool.html(null, null, html)
    },
    //////////////////////////////////////////
    b01: function () {
        let html = '\
        <tr>\
            <th class="w120" style="padding-left: 30px;position: relative;">'+ this.b02() + '站点/店铺ID</th>\
            <th class="left">店铺名称</th>\
            <th class="w250">授权时间/过期时间</th>\
            <th class="w170">相关授权</th>\
            <th>SIP子店铺</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile=js21\');"><a class="dropdown-item pointer">*添加授权</a></li>\
            <li onClick="Tool.openR(\'jsFile=js20\');"><a class="dropdown-item pointer">*获取授权信息</a></li>\
        </ul>'
    },
    b03: function (sipShops) {
        let tr = ['<tr><th class="w100">店铺ID</th><th class="left">店铺别名</th><th class="w70">站点</th></tr>']
        for (let i = 0; i < sipShops.length; i++) {
            tr.push('\
            <tr>\
                <td>'+ sipShops[i].shopId + '</td>\
                <td class="left">'+ sipShops[i].name + '</td>\
                <td>'+ sipShops[i].region + '</td>\
            </tr>')
        }
        let str = ''
        if (tr.length != 1) {
            str = '<table class="table table-bordered align-middle mb-0">' + tr.join("") + '</table>'
        }
        return str
    },
    b04: function (authTime, expired, expireTime) {
        let str = ''
        if (expired) {
            str = '(授权过期)'
        }
        else {
            str = Tool.js_date_time2(Tool.gettime(expireTime)) + '（授权正常）'
        }
        let tr = '<tr><td>' + Tool.js_date_time2(Tool.gettime(authTime)) + '</td></tr><tr><td>' + str + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0">' + tr + '</table>';
    },
    b05: function (chatAuth, adsAuth) {
        let tr = ['<tr><td><font color="' + (chatAuth ? '#4caf50' : '#9e9e9e') + '">聊聊授权：' + chatAuth + '</font></td></tr>']
        tr.push('<tr><td><font color="' + (adsAuth ? '#4caf50' : '#9e9e9e') + '">广告词授权：' + adsAuth + '</font></td></tr>')
        return '<table class="table table-bordered align-middle mb-0">' + tr.join("") + '</table>';
    },
    b06: function (shopName, name) {
        let tr = '<tr><td>' + shopName + '</td></tr><tr><td>' + name + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0">' + tr + '</table>';
    },
    b07: function (region, shopId) {
        let tr = '<tr><td>' + region + '</td></tr><tr><td>' + shopId + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0">' + tr + '</table>';
    },
}
fun.a01();