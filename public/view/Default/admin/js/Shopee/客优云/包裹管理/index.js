'use strict';
var fun =
{
    a01: function () {
        obj.params.jsFile = obj.params.jsFile ? obj.params.jsFile : ""//选择JS文件
        obj.params.page = obj.params.page ? parseInt(obj.params.page) : 1;//翻页  
        obj.params.field = obj.params.field ? obj.params.field : '1'//搜索字段
        obj.params.searchword = obj.params.searchword ? Tool.Trim(obj.params.searchword) : "";//搜索关键词
        obj.params.statusName = obj.params.statusName ? obj.params.statusName : ''//包裹状态
        obj.params.time = obj.params.time ? obj.params.time : ''//时间
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
        let where = this.b10()
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select " + Tool.fieldAs("shipByDate,orderCancelDay,statusName,orderInfos,ordersn,expressInfos,packageId,gmtCreate,logisticsProvider,nodeCode,gmtLeaving,packageComment") + " FROM @.table" + where + " order by @.gmtCreate desc" + Tool.limit(10, obj.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select count(1) as Count FROM @.table" + where,
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let arr = []
        for (let i = 0; i < t[0].length; i++) {
            t[0][i].expressInfos = JSON.parse(t[0][i].expressInfos)
            for (let j = 0; j < t[0][i].expressInfos.length; j++) {
                if (t[0][i].expressInfos[j].number != "000") {
                    arr.push(t[0][i].expressInfos[j].number);
                }
            }
        }
        if (arr.length) {
            let data = [{
                action: "sqlite",
                database: "1688/买家订单",
                sql: "select " + Tool.fieldAs("orderid,logisticsStatus,WaybillNumber,logisticsLastTime") + " FROM @.table where @.WaybillNumber in('" + arr.join("','") + "')",
            }]
            Tool.ajax.a01(data, this.a05, this, t);
        }
        else {
            this.a05([[]], t)
        }
    },
    a05: function (t1, t2) {
        let oo = {}
        for (let i = 0; i < t1[0].length; i++) {
            oo[t1[0][i].WaybillNumber] = {
                orderid: t1[0][i].orderid,
                logisticsStatus: t1[0][i].logisticsStatus,
                logisticsLastTime: Tool.js_date_time2(t1[0][i].logisticsLastTime)
            }
        }
        this.a06(oo, t2)
    },
    a06: function (oo, t2) {
        let tr = [], arr = t2[0]
        for (let i = 0; i < arr.length; i++) {
            tr.push('\
            <tr>\
                <td class="p-0">'+ this.b03(arr[i].orderInfos) + '</td>\
                <td class="p-0">'+ this.b05(arr[i].nodeCode, arr[i].statusName, arr[i].ordersn, arr[i].packageId) + '</td>\
                <td class="p-0">'+ this.b04(arr[i].logisticsProvider, arr[i].expressInfos, oo, arr[i].packageComment) + '</td>\
                <td class="p-0">'+ this.b06(arr[i].gmtLeaving, arr[i].shipByDate, arr[i].orderCancelDay, arr[i].gmtCreate) + '</td>\
            </tr>')
        }
        let html = Tool.header2(obj.params.jsFile) + this.b07() + '\
    	<div class="p-2">\
    		<table class="table align-top table-hover">\
    			<thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
    		</table>\
            ' + Tool.page(t2[1][0].Count, 10, obj.params.page) + '\
    	</div>'
        Tool.html(null, null, html);
    },
    /////////////////////////////////////
    b01: function () {
        let html = '\
        <tr>\
            <th class="left" style="position: relative;padding-left: 25px;" >'+ this.b02() + '商品信息</th>\
            <th class="w170 p-0">'+ this.b09("包裹状态", obj.params.statusName, config.statusName) + '</th>\
            <th>仓配商 / 快递单号 / 包裹备注</th>\
            <th class="w200 p-0">'+ this.b13("时间", obj.params.time, config.time) + '</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'?jsFile=js03\');"><a class="dropdown-item pointer">*获取包裹信息</a></li>\
	        <li onClick="Tool.openR(\'?jsFile=js16\');"><a class="dropdown-item pointer">*把1688运单号同步过来</a></li>\
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
    b04: function (logisticsProvider, arr, oo, packageComment) {
        let tr = ['<tr title="仓配商"><td>' + logisticsProvider + '</td></tr>']
        for (let i = 0; i < arr.length; i++) {
            let alink = arr[i].number
            if (oo[arr[i].number]) {
                alink = '<a href="https://trade.1688.com/order/new_step_order_detail.htm?orderId=' + oo["" + arr[i].number].orderid + '&amp;tracelog=20120313bscentertologisticsbuyer&amp;#logisticsTabTitle" target="_blank" title="点击查看物流">' + arr[i].number + '</a>'
            }
            tr.push('<tr title="快递单号"><td>' + alink +
                (
                    arr[i].received ?
                        '（已收件' + (arr[i].gmtReceipt ? " - " + Tool.js_date_time2(Tool.gettime(arr[i].gmtReceipt)) : '') + '）' :
                        this.b11(oo, arr[i].number)
                ) +
                '</td></tr>')
        }
        /////////////////////////////////////
        let comment = "&nbsp;"
        if (packageComment) {
            let oo = JSON.parse(packageComment)
            if (oo.comment) {
                comment = oo.comment
            }
        }
        tr.push('<tr title="包裹备注"><td class="left">' + comment + '</td></tr>')
        return '<table class="table table-bordered align-middle mb-0">' + tr.join("") + '</table>'
    },
    b05: function (nodeCode, statusName, ordersn, packageId) {
        let tr = '\
        <tr title="包裹状态"><td>【'+ nodeCode + '】' + statusName + '</td></tr>\
        <tr title="订单编号"><td>' + ordersn + '</td></tr>\
        <tr title="包裹号"><td>' + packageId + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0">' + tr + '</table>';
    },
    b06: function (gmtLeaving, shipByDate, orderCancelDay, gmtCreate) {
        let tr = '\
        <tr title="包裹创建时间"><td>' + Tool.js_date_time2(gmtCreate, "-") + '</td></tr>\
        <tr title="正常发货截止"><td>' + Tool.js_date_time2(shipByDate, "-") + "(" + Tool.datedifference(shipByDate * 1000) + '天)</td></tr>\
        <tr title="订单取消时间"><td>' + Tool.js_date_time2(orderCancelDay, "-") + "(" + Tool.datedifference(orderCancelDay * 1000) + '天)</td></tr>\
        <tr title="包裹出库或入库时间"><td>' + Tool.js_date_time2(gmtLeaving, "-") + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0 center">' + tr + '</table>';
    },
    b07: function () {
        return '\
        <div class="input-group w-50 m-2">\
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ obj.params.field + '">' + this.b08(obj.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">订单编号</li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)">包裹号</a></li>\
                <li class="dropdown-item pointer" onclick="fun.c01(3)">快递单号</a></li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ obj.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
    },
    b08: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "订单编号"; break;
            case "2": name = "包裹号"; break;
            case "3": name = "快递单号"; break;
            default: name = "未知：" + val;
        }
        return name
    },
    b09: function (name, statusName, configArr) {
        let optionArr = [], arr = [
            "待收货",
            "可打包",
            "待出库",
            "已出库",
            "已入平台仓库",
            "已搁置",
            "申请搁置",
            "已关闭",
            "已完成",
        ]
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i] + '"' + (arr[i] == statusName ? 'selected="selected"' : '') + '>' + arr[i] + '(' + configArr[i] + ')</option>')
        }
        return '\
        <select onChange="fun.c03(this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          <option value="-1">更新数量</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    b10: function () {
        let arr = []
        if (obj.params.searchword) {
            switch (obj.params.field) {
                case "1": arr.push("@.ordersn='" + obj.params.searchword + "'"); break;//商品编码
                case "2": arr.push("@.packageId='" + obj.params.searchword + "'"); break;//包裹号
                case "3": arr.push("@.expressInfos like '%" + obj.params.searchword + "%'"); break;//采购订单号
            }
        }
        if (obj.params.statusName) { arr.push("@.statusName='" + obj.params.statusName + "'"); }
        if (obj.params.time) {
            switch (obj.params.time) {
                case "1": arr.push("@.shipByDate>" + Tool.gettime("") + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24)); break;//发货截止剩0-1天
                case "2": arr.push("@.shipByDate>" + (Tool.gettime("") + 60 * 60 * 24 * 1) + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24 * 2)); break;//发货截止剩1-2天
                case "3": arr.push("@.shipByDate>" + (Tool.gettime("") + 60 * 60 * 24 * 2) + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24 * 5)); break;//发货截止剩2-5天
                case "4": arr.push("@.shipByDate>" + (Tool.gettime("") + 60 * 60 * 24 * 5) + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24 * 10)); break;//发货截止剩5-10天
                case "5": arr.push("@.shipByDate>" + (Tool.gettime("") + 60 * 60 * 24 * 10) + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24 * 20)); break;//发货截止剩10-20天
                case "6": arr.push("@.orderCancelDay>" + Tool.gettime("") + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 1)); break;//订单取消剩0-1天
                case "7": arr.push("@.orderCancelDay>" + (Tool.gettime("") + 60 * 60 * 24 * 1) + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 2)); break;//订单取消剩1-2天
                case "8": arr.push("@.orderCancelDay>" + (Tool.gettime("") + 60 * 60 * 24 * 2) + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 5)); break;//订单取消剩2-5天
                case "9": arr.push("@.orderCancelDay>" + (Tool.gettime("") + 60 * 60 * 24 * 5) + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 10)); break;//订单取消剩5-10天
                case "10": arr.push("@.orderCancelDay>" + (Tool.gettime("") + 60 * 60 * 24 * 10) + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 20)); break;//订单取消剩10-20天
            }
        }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    b11: function (oo, number) {
        let str = '（<font color=#f44336>'
        if (number == "000") { str += '未收件'; }
        else if (oo[number]) {
            if (oo[number].logisticsStatus == 0) { str += '无跟踪'; }
            else {
                str += this.b12(oo[number].logisticsStatus) + " - " + oo[number].logisticsLastTime;
            }
        }
        else {
            str += '1688没有这个运单号';
        }
        return str + '</font>）'
    },
    b12: function (logisticsStatus) {
        let arr = [
            [0, "无跟踪"],
            [1, "已揽件"],
            [2, "运输中"],
            [3, "物流异常"],
            [4, "派送中"],
            [5, "已签收"],
        ], val = "未知：" + logisticsStatus
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] === logisticsStatus) {
                val = arr[i][1];
                break;
            }
        }
        return val;
    },
    b13: function (name, time, configArr) {
        if (!configArr) configArr = [];
        let optionArr = [], arr = [
            [1, "发货截止剩0-1天"],
            [2, "发货截止剩1-2天"],
            [3, "发货截止剩2-5天"],
            [4, "发货截止剩5-10天"],
            [5, "发货截止剩10-20天"],
            [6, "订单取消剩0-1天"],
            [7, "订单取消剩1-2天"],
            [8, "订单取消剩2-5天"],
            [9, "订单取消剩5-10天"],
            [10, "订单取消剩10-20天"],
        ]
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i][0] + '"' + ("" + arr[i][0] == time ? 'selected="selected"' : '') + '>' + arr[i][0] + '.' + arr[i][1] + '(' + configArr[i] + ')</option>')
        }
        return '\
        <select onChange="fun.c04(this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          <option value="-1">更新数量</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    //////////////////////////////////////////
    c01: function (val) {
        let name = this.b08("" + val)
        $("#field").html(name).val(val)
    },
    c02: function () {
        let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
        if (searchword) {
            Tool.main("?jsFile=" + obj.params.jsFile + "&page=1&field=" + field + "&searchword=" + searchword);
        } else { alert("请输入搜索内容"); }
    },
    c03: function (val) {
        if (val == "-1") {
            Tool.openR("?jsFile=js17");
        }
        else {
            Tool.open("statusName", val);
        }
    },
    c04: function (val) {
        if (val == "-1") {
            Tool.openR("?jsFile=js18");
        }
        else {
            Tool.open("time", val);
        }
    },
}
fun.a01();