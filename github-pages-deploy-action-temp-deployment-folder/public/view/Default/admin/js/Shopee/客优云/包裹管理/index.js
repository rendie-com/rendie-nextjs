'use strict';
var fun =
{
    a01: function () {
        o.params.jsFile = o.params.jsFile ? o.params.jsFile : ""//选择JS文件
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页  
        o.params.field = o.params.field ? o.params.field : '1'//搜索字段
        o.params.searchword = o.params.searchword ? Tool.Trim(o.params.searchword) : "";//搜索关键词
        o.params.statusName = o.params.statusName ? o.params.statusName : ''//包裹状态
        o.params.time = o.params.time ? o.params.time : ''//时间
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
        let where = this.b10();
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select " + Tool.fieldAs("trackingNos,shipByDate,orderCancelDay,statusName,orderInfos,ordersn,expressInfos,packageId,gmtCreate,logisticsProvider,nodeCode,gmtLeaving,packageCommentList") + " FROM @.table" + where + " order by @.gmtCreate desc" + Tool.limit(10, o.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select count(1) as Count FROM @.table" + where,
        }, {
            action: o.DEFAULT_DB,
            database: "main",
            sql: "select @.value as value FROM @.config where @.name='" + o.params.template + "'",
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let arr = []
        for (let i = 0; i < t[0].length; i++) {
            t[0][i].expressInfos = JSON.parse(t[0][i].expressInfos)
            for (let j = 0; j < t[0][i].expressInfos.length; j++) {
                if (t[0][i].expressInfos[j].number != "0000") {
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
            this.a05([[]], t);
        }
    },
    a05: function (t1, t2) {
        let oo = {};
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
        let tr = [], arr = t2[0];
        for (let i = 0; i < arr.length; i++) {
            tr.push('\
            <tr>\
                <td class="p-0">'+ this.b03(arr[i].orderInfos) + '</td>\
                <td class="p-0">'+ this.b05(arr[i].nodeCode, arr[i].statusName) + '</td>\
                <td class="p-0">'+ this.b14(arr[i].ordersn, arr[i].packageId, arr[i].trackingNos) + '</td>\
                <td class="p-0">'+ this.b04(arr[i].logisticsProvider, arr[i].expressInfos, oo, arr[i].packageCommentList) + '</td>\
                <td class="p-0">'+ this.b06(arr[i].gmtLeaving, arr[i].shipByDate, arr[i].orderCancelDay, arr[i].gmtCreate) + '</td>\
            </tr>')
        }
        let html = Tool.header2(o.params.jsFile) + this.b07() + '\
    	<div class="p-2">\
    		<table class="table align-top table-hover">\
    			<thead class="table-light">'+ this.b01(t2[2]) + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
    		</table>' + Tool.page(t2[1][0].Count, 10, o.params.page) + '\
    	</div>'
        Tool.html(null, null, html);
    },
    /////////////////////////////////////
    b01: function (t) {
        let config = {};
        if (t[0].value) {
            config = JSON.parse(t[0].value)["包裹管理"]
            if (!config) { config = {}; }
        }
        let html = '\
        <tr>\
            <th class="left" style="position: relative;padding-left: 25px;" >'+ this.b02() + '商品信息</th>\
            <th class="w170 p-0">'+ this.b09("包裹状态", o.params.statusName, config["包裹状态"]) + '</th>\
            <th class="w200">订单 / 包裹号 / 物流单号</th>\
            <th class="w400">仓配商 / 快递单号 / 包裹备注</th>\
            <th class="w200 p-0">'+ this.b13("时间", o.params.time, config["时间"]) + '</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'jsFile=js17\');"><a class="dropdown-item pointer">更新数量</a></li>\
	        <li onClick="Tool.openR(\'jsFile=js03\');"><a class="dropdown-item pointer">*获取包裹信息</a></li>\
	        <li onClick="Tool.openR(\'jsFile=js16\');"><a class="dropdown-item pointer">*把1688运单号同步过来</a></li>\
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
            </tr>')
        }
        return '<table class="table table-bordered align-middle mb-0">' + rArr.join("") + '</table>'
    },
    b04: function (logisticsProvider, arr, oo, packageCommentList) {
        let tr = ['<tr title="仓配商"><td>' + logisticsProvider + '</td></tr>']
        for (let i = 0; i < arr.length; i++) {
            let alink = arr[i].number;
            if (oo[arr[i].number]) {
                alink = '<a href="https://trade.1688.com/order/new_step_order_detail.htm?orderId=' + oo["" + arr[i].number].orderid + '&amp;tracelog=20120313bscentertologisticsbuyer&amp;#logisticsTabTitle" target="_blank" title="点击查看物流">' + arr[i].number + '</a>'
            }
            tr.push('<tr title="快递单号"><td>' + alink +
                (
                    arr[i].received ?
                        '（已收件' + (arr[i].gmtReceipt ? " - " + Tool.js_date_time2(Tool.gettime(arr[i].gmtReceipt)) : '') + '）' :
                        this.b11(oo, arr[i].number)
                ) + '</td></tr>')
        }
        tr.push('<tr title="包裹备注"><td class="left">' + this.b15(packageCommentList) + '</td></tr>')
        return '<table class="table table-bordered align-middle mb-0">' + tr.join("") + '</table>'
    },
    b05: function (nodeCode, statusName) {
        let tr = '\
        <tr title="站点"><td>'+ Tool.site(nodeCode) + '</td></tr>\
        <tr title="包裹状态"><td>' + statusName + '</td></tr>'
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
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ o.params.field + '">' + this.b08(o.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">快递单号</a></li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)">包裹号</a></li>\
                <li class="dropdown-item pointer" onclick="fun.c01(3)">订单编号</li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ o.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
    },
    b08: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "快递单号"; break;
            case "2": name = "包裹号"; break;
            case "3": name = "订单编号"; break;
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
            optionArr.push('<option value="' + arr[i] + '"' + (arr[i] == statusName ? 'selected="selected"' : '') + '>' + arr[i] + (configArr ? '(' + configArr[i] + ')' : '') + '</option>')
        }
        return '\
        <select onChange=" Tool.open(\'statusName\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    b10: function () {
        let arr = []
        if (o.params.searchword) {
            switch (o.params.field) {
                case "1": arr.push("@.expressInfos like '%" + o.params.searchword + "%'"); break;//采购订单号
                case "2": arr.push("@.packageId='" + o.params.searchword + "'"); break;//包裹号
                case "3": arr.push("@.ordersn='" + o.params.searchword + "'"); break;//商品编码
            }
        }
        if (o.params.statusName) { arr.push("@.statusName='" + o.params.statusName + "'"); }
        if (o.params.time) {
            switch (o.params.time) {
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
        if (number == "0000") { str += '未收件'; }
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
        ], val = "未知：" + logisticsStatus;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] === logisticsStatus) { val = arr[i][1]; break; }
        }
        return val;
    },
    b13: function (name, time, configArr) {
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
            optionArr.push('\
            <option value="' + arr[i][0] + '"' + ("" + arr[i][0] == time ? 'selected="selected"' : '') + '>\
            ' + arr[i][0] + '.' + arr[i][1] + (configArr ? '(' + configArr[i] + ')' : '') + '\
            </option>');
        }
        return '\
        <select onChange=" Tool.open(\'time\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    b14: function (ordersn, packageId, trackingNos) {
        let tr = '\
        <tr title="订单编号"><td>' + ordersn + '</td></tr>\
        <tr title="包裹号"><td>' + packageId + '</td></tr>\
        <tr title="物流单号"><td>' + trackingNos + '</td></tr>'
        return '<table class="table table-bordered align-middle mb-0">' + tr + '</table>';
    },
    b15: function (packageCommentList) {
        let comment1Arr = [], comment2Arr = [];
        let arr = JSON.parse(packageCommentList)
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].login == "574754058@qq.com") {
                comment1Arr.push(arr[i].comment)
            }
            else {
                comment2Arr.push(arr[i].comment)
            }
        }
        return '<font color="red">卖家：</font>' + comment1Arr.join("<br/>") + '<hr/><font color="red">货代：</font>' + comment2Arr.join("<br/>")
    },
    //////////////////////////////////////////
    c01: function (val) {
        let name = this.b08("" + val)
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