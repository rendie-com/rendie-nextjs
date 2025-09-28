'use strict';
var fun =
{
    obj: {
        siteNum: ""
    },
    a01: function () {
        o.params.jsFile = o.params.jsFile ? o.params.jsFile : ""//选择JS文件
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页  
        o.params.site = o.params.site ? o.params.site : 'sg'
        o.params.num = o.params.num ? o.params.num : "1"//该站点的第几个店
        this.obj.siteNum = Tool.siteNum(o.params.site, o.params.num);
        this.a02();
    },
    a02: function () {
        let data = [{
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/聊聊/" + this.obj.siteNum,
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/聊聊/" + this.obj.siteNum + ".db"],
                database: "shopee/聊聊/" + this.obj.siteNum,
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let where = " where @.last_message_region='" + o.params.site.toUpperCase() + "'"
        let data = [{
            action: "sqlite",
            database: "shopee/聊聊/" + this.obj.siteNum,
            sql: "select " + Tool.fieldAs("to_fromid,to_name,to_avatar,to_status,is_blocked,shop_id,to_shop_id,status,unread_count,latest_message_type,latest_message_source,last_message_time") + " FROM @.table" + where + " order by @.last_message_time desc" + Tool.limit(10, o.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/聊聊/" + this.obj.siteNum,
            sql: "select count(1) as Count FROM @.table" + where,
        }, {
            action: o.DEFAULT_DB,
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let siteArr = JSON.parse(t[2][0].config)[o.params.site]
        let tr = [], arr = t[0]
        for (let i = 0; i < arr.length; i++) {
            tr.push('\
            <tr>\
                <td>'+ this.b03(arr[i].to_avatar) + '</td>\
                <td class="p-0">'+ this.b04(arr[i].to_name, arr[i].to_fromid) + '</td>\
                <td class="p-0">'+ this.b05(arr[i].shop_id, arr[i].to_shop_id) + '</td>\
                <td class="p-0">'+ this.b06(arr[i].status, arr[i].to_status) + '</td>\
                <td>'+ arr[i].is_blocked + '</td>\
                <td>'+ arr[i].unread_count + '</td>\
                <td>'+ arr[i].latest_message_type + '</td>\
                <td>'+ arr[i].latest_message_source + '</td>\
                <td>'+ Tool.js_date_time2(arr[i].last_message_time, "-") + '</td>\
            </tr>')
        }
        let html = '\
        <div style="top:6px;position:relative;padding-left:25px;">' + this.b02() + '</div>\
        <header class="panel-heading"style="margin-left: 20px;">Shopee &gt; 聊聊</header>\
		<div class="p-2">\
			 ' + Tool.tab(o.params.jsFile, o.params.site, siteArr, o.params.num) + '\
             <table class="table align-middle table-hover center">\
				<thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
			</table>\
            ' + Tool.page(t[1][0].Count, 10, o.params.page) + '\
		</div>'
        Tool.html(null, null, html)
    },
    b01: function () {
        let html = '\
        <tr>\
            <th class="w80">买家头像</th>\
            <th>买家用户名和ID</th>\
            <th>铺店ID</th>\
            <th>状态</th>\
            <th>is_blocked</th>\
            <th>unread_count</th>\
            <th>latest_message_type</th>\
            <th>latest_message_source</th>\
            <th>最后消息时间</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'jsFile=js01\');"><a class="dropdown-item pointer">*获取聊聊信息</a></li>\
        </ul>'
    },
    b03: function (to_avatar) {
        let img = "";
        if (to_avatar) {
            img = '<a href="https://s-cf-sg.shopeesz.com/file/' + to_avatar + '" target="_blank"><img src="' + to_avatar + '_tn" class="img-fluid w60" style="border-radius:50%;"></a>'
        }
        else {
            img = '<div style="border-radius: 50%;height: 60px;width: 60px;align-items: center;background: #d8d8d8;color: #fff;display: flex;font-size: 0;ont-weight: 500;    justify-content: center;overflow: hidden;"><i style="color: #fff;height: 50%;width: 50%;fill: currentColor;display: inline-block;line-height: 0;"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="chat-icon"><path d="M12 12.255c3.159 0 5.72-2.743 5.72-6.127C17.72 2.743 15.159 0 12 0S6.28 2.743 6.28 6.128c0 3.384 2.561 6.127 5.72 6.127zM9.149 14.298c-4.4 0-8.198 3.026-9.104 7.254C-.225 22.813.755 24 2.068 24h19.864c1.313 0 2.293-1.187 2.023-2.448-.906-4.228-4.704-7.254-9.104-7.254H9.15z"></path></svg></i>'
        }
        return img
    },
    b04: function (to_name, to_fromid) {
        let tr = '\
        <tr title="买家用户名"><td>' + to_name + '</td></tr>\
        <tr title="买家用户名ID"><td>' + to_fromid + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0 center">' + tr + '</table>';
    },
    b05: function (shop_id, to_shop_id) {
        let tr = '\
        <tr title="卖家店铺ID"><td>' + shop_id + '</td></tr>\
        <tr title="买家店铺ID"><td>' + to_shop_id + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0 center">' + tr + '</table>';
    },
    b06: function (shop_id, to_shop_id) {
        let tr = '\
        <tr title="卖家状态"><td>' + shop_id + '</td></tr>\
        <tr title="买家状态"><td>' + to_shop_id + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0 center">' + tr + '</table>';
    },
}
$(function () { fun.a01(); })
