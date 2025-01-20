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
            database: "shopee/客优云/包裹管理",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/客优云/包裹管理.db"],
                database: "shopee/客优云/包裹管理",
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let where = " order by @.gmtCreate desc"
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select " + Tool.fieldAs("statusName,orderInfos,expressInfos,packageId,gmtCreate,logisticsProvider,nodeCode,gmtLeaving,comment") + " FROM @.table" + where + Tool.limit(10, obj.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select count(1) as Count FROM @.table" + where,
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (arr) {
        let tr = [], t = arr[0]
        for (let i = 0; i < t.length; i++) {
            tr.push('\
            <tr>\
                <td class="center">'+ t[i].nodeCode + '</td>\
                <td class="p-0">'+ this.b05(t[i].statusName, t[i].packageId, t[i].gmtCreate) + '</td>\
                <td class="p-0">'+ this.b03(t[i].orderInfos) + '</td>\
                <td class="p-0">'+ this.b04(t[i].logisticsProvider, t[i].expressInfos) + '</td>\
                <td class="p-0">'+ this.b06(t[i].gmtLeaving, t[i].comment) + '</td>\
            </tr>')
        }
        let html = '\
         '+ Tool.header2(obj.params.jsFile) + '\
		<div class="p-2">\
			<table class="table align-top table-hover">\
				<thead class="table-light center">'+ this.b01() + '</thead>\
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
            <th style="position: relative;" class="w100">'+ this.b02() + '站点</th>\
            <th class="w170">包裹状态 / 包裹号</th>\
            <th class="left">商品信息</th>\
            <th>仓配商 / 快递单号</th>\
            <th>包裹出库或入库时间 / 包裹备注</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'?jsFile=js03\');"><a class="dropdown-item pointer">*获取包裹信息</a></li>\
        </ul>'
    },
    b03: function (orderInfos) {
        let rArr = [], arr = JSON.parse(orderInfos)
        let items = arr[0].items
        for (let i = 0; i < items.length; i++) {
            let td1 = '\
            <a href="https://s-cf-sg.shopeesz.com/file/' + (items[i].skuImg.split("/file/")[1]).split("_")[0] + '" target="_blank">\
                <img src="https://s-cf-sg.shopeesz.com/file/' + items[i].skuImg.split("/file/")[1] + '" class="img-fluid rounded w80">\
            </a>'
            rArr.push('\
            <tr>\
                <td class="w80 p-1" rowspan="2">' + td1 + '</td>\
                <td colspan="6">' + items[i].itemName + '</td>\
            </tr>\
            <tr>\
                <td class="right w50">编码:</td>\
                <td class="w120">' + items[i].skuCode + '</td>\
                <td class="right w50">数量:</td>\
                <td class="w50">' + items[i].count + '</td>\
                <td class="right w50">规格:</td>\
                <td>' + items[i].sku + '</td>\
            </tr>\
           ')
        }
        return '<table class="table table-bordered align-middle mb-0">' + rArr.join("") + '</table>'
    },
    b04: function (logisticsProvider, expressInfos) {
        let tr = ['<tr title="仓配商"><td>' + logisticsProvider + '</td></tr>']
        let arr = JSON.parse(expressInfos);
        for (let i = 0; i < arr.length; i++) {
            tr.push('<tr title="快递单号"><td>' +
                arr[i].number +
                (arr[i].received ? '（已收件）' : ' <font color=#f44336>未收件</font>') +
                (arr[i].gmtReceipt ? ' <font color=#f44336>' + Tool.js_date_time2(Tool.gettime(arr[i].gmtReceipt)) + '</font>' : '') +
                '</td></tr>')
        }
        return '<table class="table table-bordered align-middle mb-0">' + tr.join("") + '</table>'
    },
    b05: function (statusName, packageId, gmtCreate) {
        let tr = '\
        <tr title="包裹状态"><td>' + statusName + '</td></tr>\
        <tr title="包裹号"><td>' + packageId + '</td></tr>\
        <tr title="包裹创建时间"><td>' + Tool.js_date_time2(gmtCreate, "-") + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0 center">' + tr + '</table>';
    },
    b06: function (gmtLeaving, comment) {
        let tr = '\
        <tr title="包裹出库或入库时间"><td>' + Tool.js_date_time2(gmtLeaving, "-") + '</td></tr>\
        <tr title="包裹备注"><td class="left">' + (comment ? comment : '&nbsp;') + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0 center">' + tr + '</table>';
    },
}
fun.a01();