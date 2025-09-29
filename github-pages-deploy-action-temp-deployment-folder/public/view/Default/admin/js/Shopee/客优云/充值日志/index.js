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
            database: "shopee/客优云/充值日志",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/客优云/充值日志.db"],
                database: "shopee/客优云/充值日志",
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let where = this.b05()
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/充值日志",
            sql: "select " + Tool.fieldAs("transTime,ordersn,packageId,tradeNo,transType,comment,tradeAmount,operateType,transStatus") + " FROM @.table" + where + Tool.limit(35, o.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/客优云/充值日志",
            sql: "select count(1) as Count FROM @.table" + where,
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (arr) {
        let tr = [], t = arr[0]
        for (let i = 0; i < t.length; i++) {
            tr.push('\
            <tr>\
                <td>'+ (i + 1) + '</td>\
                <td>'+ Tool.js_date_time2(t[i].transTime, "-") + '</td>\
                <td>'+ t[i].ordersn + '</td>\
                <td>'+ (t[i].packageId ? t[i].packageId : "") + '</td>\
                <td>'+ t[i].tradeNo + '</td>\
                <td>'+ t[i].transType + '</td>\
                <td>'+ (t[i].comment ? t[i].comment : '无') + '</td>\
                <td>'+ (t[i].tradeAmount ? '<font color="red">' + t[i].operateType + t[i].tradeAmount.toFixed(1) + '</font>' : '') + '</td>\
                <td>'+ t[i].transStatus + '</td>\
           </tr>')
        }
        let html = Tool.header2(o.params.jsFile) + this.b03() + '\
		<div class="p-2">\
			<table class="table align-top table-hover center">\
				<thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
			</table>\
            ' + Tool.page(arr[1][0].Count, 35, o.params.page) + '\
		</div>'
        Tool.html(null, null, html)
    },
    /////////////////////////////////////
    b01: function () {
        let html = '\
        <tr>\
            <th class="w40" style="position: relative; left:5px;">'+ this.b02() + '</th>\
            <th class="w170">时间</th>\
            <th>订单号</th>\
            <th>包裹编号</th>\
            <th>流水号</th>\
            <th>类型</th>\
            <th>描述</th>\
            <th>积分值</th>\
            <th>状态</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile=js05\');"><a class="dropdown-item pointer">*获取充值日志</a></li>\
        </ul>'
    },
    b03: function () {
        return '\
        <div class="input-group w-50 m-2">\
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ o.params.field + '">' + this.b04(o.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">订单号</li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)">包裹编号</a></li>\
                <li class="dropdown-item pointer" onclick="fun.c01(3)">流水号</a></li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ o.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
    },
    b04: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "订单号"; break;
            case "2": name = "包裹编号"; break;
            case "3": name = "流水号"; break;
            default: name = "未知：" + val;
        }
        return name
    },
    b05: function () {
        let arr = []
        if (o.params.searchword) {
            switch (o.params.field) {
                case "1": arr.push("@.ordersn='" + o.params.searchword + "'"); break;//商品编码
                case "2": arr.push("@.packageId='" + o.params.searchword + "'"); break;//包裹号
                case "3": arr.push("@.tradeNo='" + o.params.searchword + "'"); break;//采购订单号
            }
        }
        return (arr.length == 0 ? "" : " where " + arr.join(" and ")) + " order by @.transTime desc";
    },
    //////////////////////////////////////////
    c01: function (val) {
        let name = this.b04("" + val)
        $("#field").html(name).val(val)
    },
    c02: function () {
        let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
        if (searchword) {
            Tool.main("jsFile=" + o.params.jsFile + "&page=1&field=" + field + "&searchword=" + searchword);
        } else { alert("请输入搜索内容"); }
    },
}
fun.a01();