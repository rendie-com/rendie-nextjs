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
            database: "shopee/客优云/订单管理",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/客优云/订单管理.db"],
                database: "shopee/客优云/订单管理",
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let where = " order by @.createTime desc"
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/订单管理",
            sql: "select " + Tool.fieldAs("items,ordersn,statusDescription,payTime,shipByDate,orderCancelDay") + " FROM @.table" + where + Tool.limit(10, obj.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/客优云/订单管理",
            sql: "select count(1) as Count FROM @.table" + where,
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (arr) {
        let tr = [], t = arr[0]
        for (let i = 0; i < t.length; i++) {
            tr.push('\
            <tr>\
                <td>'+ t[i].ordersn + '</td>\
                <td class="p-0">'+this.b03(t[i].items)+'</td>\
                <td>'+ Tool.js_date_time2(t[i].payTime, "-") + '</td>\
                <td>'+ Tool.js_date_time2(t[i].shipByDate, "-") + '</td>\
                <td>'+ Tool.js_date_time2(t[i].orderCancelDay, "-") + '</td>\
                <td>'+ t[i].statusDescription + '</td>\
            </tr>')
        }
        let html = '\
         '+ Tool.header2(obj.params.jsFile) + '\
		<div class="p-2">\
			<table class="table align-top table-hover">\
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
            <th style="padding-left: 25px;position: relative;" class="w140">'+ this.b02() + '订单号</th>\
            <th class="">商品信息</th>\
            <th>下单时间</th>\
            <th>发货时间</th>\
            <th>取消时间</th>\
            <th>状态</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'?jsFile=js01\');"><a class="dropdown-item pointer">*获取订单信息</a></li>\
        </ul>'
    },
    b03: function (items) {
        let rArr = [],arr=JSON.parse(items)
        for (let i = 0; i < arr.length; i++) {
            let td1 = '\
            <a href="https://s-cf-sg.shopeesz.com/file/' + (arr[i].skuImg.split("/file/")[1]).split("_")[0] + '" target="_blank">\
                <img src="https://s-cf-sg.shopeesz.com/file/' + arr[i].skuImg.split("/file/")[1] + '" class="img-fluid rounded w80">\
            </a>'
            rArr.push('\
            <tr>\
                <td class="w80 p-1" rowspan="2">' + td1 + '</td>\
                <td colspan="8">' + arr[i].itemName + '</td>\
            </tr>\
            <tr>\
                <td class="right w50">编码:</td>\
                <td class="w120">' + arr[i].variationSku + '</td>\
                <td class="right w50">数量:</td>\
                <td class="w50">' + arr[i].variationQuantityPurchased + '</td>\
                <td class="right w50">价格:</td>\
                <td class="w70">' + arr[i].variationOriginalPrice + ' </td>\
                <td class="right w50">规格:</td>\
                <td>' + arr[i].variationName + '</td>\
            </tr>\
           ')
        }
        return '<table class="table table-bordered align-middle mb-0">' + rArr.join("") + '</table>'
    },
}
fun.a01();