'use strict';
var fun =
{
    a01: function () {
        obj.params.jsFile = obj.params.jsFile ? obj.params.jsFile : ""//选择JS文件
        obj.params.page = obj.params.page ? parseInt(obj.params.page) : 1;//翻页  
        obj.params.field = obj.params.field ? obj.params.field : '1'//搜索字段
        obj.params.searchword = obj.params.searchword ? Tool.Trim(obj.params.searchword) : "";//搜索关键词
        this.a02()
    },
    a02: function () {
        let data = [{
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/客优云/系统消息",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/客优云/系统消息.db"],
                database: "shopee/客优云/系统消息",
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let where = ""
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/系统消息",
            sql: "select " + Tool.fieldAs("title,gmtCreate,messageStatusName,messageType") + " FROM @.table" + where + Tool.limit(10, obj.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/客优云/系统消息",
            sql: "select count(1) as Count FROM @.table" + where,
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (arr) {
        let tr = [], t = arr[0]
        for (let i = 0; i < t.length; i++) {
            tr.push('\
            <tr>\
                <td class="left">'+ t[i].title + '</td>\
                <td>'+ Tool.js_date_time2(t[i].gmtCreate, "-") + '</td>\
                <td>'+ JSON.parse(t[i].messageType).msg + '</td>\
                <td>'+ this.b03(t[i].messageStatusName) + '</td>\
           </tr>')
        }
        let html = Tool.header2(obj.params.jsFile) + '\
		<div class="p-2">\
			<table class="table align-top table-hover center">\
				<thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
			</table>\
            ' + Tool.page(arr[1][0].Count, 10, obj.params.page) + '\
		</div>'
        Tool.html(null, null, html)
    },
    /////////////////////////////////////
    b01: function () {
        let html = '\
        <tr>\
            <th style="position: relative;padding-left: 25px;" class="left">'+ this.b02() + ' 标题</th>\
            <th>时间</th>\
            <th>类型</th>\
            <th>状态</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'?jsFile=js07\');"><a class="dropdown-item pointer">*获取系统消息</a></li>\
        </ul>'
    },
    b03: function (messageStatusName) {
        let str = messageStatusName
        if (messageStatusName == "已读") {
            str = '<font color=#00e676>' + messageStatusName + '</font>'
        }               
        return str;
    },
}
fun.a01();