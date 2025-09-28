'use strict';
var fun =
{
    a01: function () {
        o.params.jsFile = o.params.jsFile ? o.params.jsFile : ""//选择JS文件
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页  
        o.params.field = o.params.field ? o.params.field : '1'//搜索字段
        o.params.searchword = o.params.searchword ? Tool.Trim(o.params.searchword) : "";//搜索关键词
        o.params.statusDescription = o.params.statusDescription ? o.params.statusDescription : "";//订单状态
        o.params.kyyOrderStatusName = o.params.kyyOrderStatusName ? o.params.kyyOrderStatusName : "";//处理状态
        o.params.country = o.params.country ? o.params.country : "";//站点
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
    a03: function () {
        let where = this.b10();
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/订单管理",
            sql: "select " + Tool.fieldAs("items,ordersn,statusDescription,payTime,shipByDate,orderCancelDay,kyyOrderStatusName,country,shopName,currency") + " FROM @.table" + where + " order by @.createTime desc" + Tool.limit(10, o.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/客优云/订单管理",
            sql: "select count(1) as Count FROM @.table" + where,
        }, {
            action: o.DEFAULT_DB,
            database: "main",
            sql: "select @.value as value FROM @.config where @.name='" + o.params.template + "'",
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (arr) {
        let tr = [], t = arr[0]
        for (let i = 0; i < t.length; i++) {
            tr.push('\
            <tr>\
                <td class="p-0 left">'+ this.b03(t[i].items, t[i].currency) + '</td>\
                <td class="p-0">'+ this.b08(t[i].statusDescription, t[i].kyyOrderStatusName, t[i].ordersn) + '</td>\
                <td class="p-0">'+ this.b09(t[i].country, t[i].shopName) + '</td>\
                <td class="p-0">'+ this.b04(t[i].payTime, t[i].shipByDate, t[i].orderCancelDay) + '</td>\
            </tr>');
        }
        let html = Tool.header2(o.params.jsFile) + this.b05() + '\
		<div class="p-2">\
			<table class="table align-top table-hover center">\
				<thead class="table-light">'+ this.b01(arr[2]) + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
			</table>' + Tool.page(arr[1][0].Count, 10, o.params.page) + '\
		</div>';
        Tool.html(null, null, html);
    },
    /////////////////////////////////////
    b01: function (t2) {
        let config = {};
        if (t2[0].value) {
            config = JSON.parse(t2[0].value)["订单管理"]
            if (!config) { config = {}; }
        }
        let html = '\
        <tr>\
            <th class="left" style="padding-left:30px;position: relative;">'+ this.b02() + '商品信息</th>\
            <th class="p-0">'+ this.b07('状态', o.params.statusDescription, config["订单状态"], o.params.kyyOrderStatusName, config["处理状态"]) + '</th>\
            <th class="p-0">'+ this.b11("站点", o.params.country, config["站点"]) + '</th>\
            <th>时间</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'jsFile=js22\');"><a class="dropdown-item pointer">更新数量</a></li>\
	        <li onClick="Tool.openR(\'jsFile=js01\');"><a class="dropdown-item pointer">*同步缺失订单</a></li>\
        </ul>'
    },
    b03: function (items, currency) {
        let rArr = [], arr = JSON.parse(items)
        for (let i = 0; i < arr.length; i++) {
            let td1 = '\
            <a href="https://s-cf-sg.shopeesz.com/file/' + (arr[i].skuImg.split("/file/")[1]).split("_")[0] + '" target="_blank">\
                <img src="https://s-cf-sg.shopeesz.com/file/' + arr[i].skuImg.split("/file/")[1] + '" class="img-fluid rounded w80">\
            </a>'
            rArr.push('\
            <tr>\
                <td class="w70 p-0" rowspan="2">' + td1 + '</td>\
                <td colspan="8">' + arr[i].itemName + '</td>\
            </tr>\
            <tr>\
                <td class="right w50">编码:</td>\
                <td class="w120">' + arr[i].variationSku + '</td>\
                <td class="right w50">数量:</td>\
                <td class="w50">' + arr[i].variationQuantityPurchased + '</td>\
                <td class="right w50">价格:</td>\
                <td class="w100"><font color=rgba(0, 0, 0, .68)>'+ currency + "</font> " + arr[i].variationOriginalPrice + ' </td>\
                <td class="right w50">规格:</td>\
                <td>' + arr[i].variationName + '</td>\
            </tr>')
        }
        return '<table class="table table-bordered align-middle mb-0">' + rArr.join("") + '</table>'
    },
    b04: function (payTime, shipByDate, orderCancelDay) {
        let time1 = "&nbsp;", time2 = "&nbsp;"
        if (shipByDate) {
            time1 = Tool.js_date_time2(shipByDate, "-") + "(" + Tool.datedifference(shipByDate * 1000) + '天)'
        }
        if (orderCancelDay) {
            time2 = Tool.js_date_time2(orderCancelDay, "-") + "(" + Tool.datedifference(orderCancelDay * 1000) + '天)'
        }
        let tr = '\
        <tr title="下单时间"><td>' + Tool.js_date_time2(payTime, "-") + '</td></tr>\
        <tr title="正常发货截止"><td>' + time1 + '</td></tr>\
        <tr title="订单取消时间"><td>'  + time2 + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0 center">' + tr + '</table>';
    },
    b05: function () {
        return '\
        <div class="input-group w-50 m-2">\
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ o.params.field + '">' + this.b06(o.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">订单号</li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)">店铺名</a></li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ o.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
    },
    b06: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "订单号"; break;
            case "2": name = "店铺名"; break;
            default: name = "未知：" + val;
        }
        return name;
    },
    b07: function (name, statusDescription, config1Arr, kyyOrderStatusName, config2Arr) {
        let optionArr = [], arr = [
            "未付款",
            "待发货",
            "待重新发货",
            "已发货",
            "申请取消",
            "已取消",
            "申请退款",
            "确认收货",
            "已完成",
            "失败",
            "退货运回",
        ]
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i] + '"' + (arr[i] == statusDescription ? 'selected="selected"' : '') + '>' + (i + 1) + "." + arr[i] + (config1Arr ? '(' + config1Arr[i] + ')' : '') + '</option>')
        }
        /////////////////////////////////////////////////////
        let optionArr2 = [], arr2 = [
            "未处理",
            "已处理",
            "已申请运单号",
        ]
        for (let i = 0; i < arr2.length; i++) {
            optionArr2.push('<option value="' + arr2[i] + '"' + (arr2[i] == kyyOrderStatusName ? 'selected="selected"' : '') + '>' + arr2[i] + (config2Arr ? '(' + config2Arr[i] + ')' : '') + '</option>');
        }
        return '\
        <select onChange="fun.c03(this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          <option value="-1" disabled>订单状态</option>\
          '+ optionArr.join("") + '\
          <option value="-2" disabled>处理状态</option>\
          '+ optionArr2.join("") + '\
       </select>';
    },
    b08: function (statusDescription, kyyOrderStatusName, ordersn) {
        let tr = '\
        <tr title="状态"><td>' + statusDescription + '</td></tr>\
        <tr title="是否处理"><td>' + kyyOrderStatusName + '</td></tr>\
        <tr title="订单号"><td>' + ordersn + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0 center">' + tr + '</table>';
    },
    b09: function (country, shopName) {
        let tr = '\
        <tr title="站点"><td>' + Tool.site(country) + '</td></tr>\
        <tr title="店铺名"><td>' + shopName + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0 center">' + tr + '</table>';
    },
    b10: function () {
        let arr = []
        if (o.params.searchword) {
            switch (o.params.field) {
                case "1": arr.push("@.ordersn='" + o.params.searchword + "'"); break;//商品编码
                case "2": arr.push("@.shopName='" + o.params.searchword + "'"); break;//包裹号
            }
        }
        if (o.params.statusDescription) { arr.push("@.statusDescription='" + o.params.statusDescription + "'"); }
        if (o.params.kyyOrderStatusName) { arr.push("@.kyyOrderStatusName='" + o.params.kyyOrderStatusName + "'"); }
        if (o.params.country) { arr.push("@.country='" + o.params.country + "'"); }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    b11: function (name, val, configArr) {
        if (!configArr) configArr = []
        let optionArr = [], arr = Tool.siteArr();
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i][0] + '"' + ("" + arr[i][0] == val ? 'selected="selected"' : '') + '>' + arr[i][0] + '.' + arr[i][1] + '(' + configArr[i] + ')</option>');
        }
        return '\
        <select onChange=" Tool.open(\'country\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    ////////////////////////////////
    c01: function (val) {
        let name = this.b06("" + val);
        $("#field").html(name).val(val);
    },
    c02: function () {
        let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
        if (searchword) {
            Tool.main("jsFile=" + o.params.jsFile + "&page=1&field=" + field + "&searchword=" + searchword);
        } else { alert("请输入搜索内容"); }
    },
    c03: function (val) {
        if (val == "-1") {
            Tool.openR("jsFile=js22");
        }
        else if (val == "-2") {
            Tool.openR("jsFile=js25");
        }
        else {
            let name = "statusDescription";
            if (val == "未处理" || val == "已处理" || val == "已申请运单号") { name = "kyyOrderStatusName"; }
            Tool.open(name, val);
        }
    },
    c04: function (val) {
        if (val == "-1") {
            Tool.openR("jsFile=js23");
        }
        else {
            Tool.open("country", val);
        }
    },
}
fun.a01();