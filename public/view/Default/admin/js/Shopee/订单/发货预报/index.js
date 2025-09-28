'use strict';
var fun =
{
    obj: {
        siteNum: "",
    },
    a01: function () {
        o.params.jsFile = o.params.jsFile ? o.params.jsFile : ""//选择JS文件
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页  
        o.params.site = o.params.site ? o.params.site : 'sg'
        o.params.field = o.params.field ? o.params.field : '1'//搜索字段
        o.params.searchword = o.params.searchword ? Tool.Trim(o.params.searchword) : "";//搜索关键词
        o.params.binding_status = o.params.binding_status ? o.params.binding_status : '0';
        o.params.num = o.params.num ? o.params.num : '1'//第几个店
        this.obj.siteNum = Tool.siteNum(o.params.site, o.params.num);
        this.a02();
    },
    a02: function () {
        let data = [{
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/订单/发货预报/" + this.obj.siteNum,
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/发货预报/" + this.obj.siteNum + ".db"],
                database: "shopee/订单/发货预报/" + this.obj.siteNum,
            }]
        }];
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let where = this.b08();
        let data = [{
            action: "sqlite",
            database: "shopee/订单/发货预报/" + this.obj.siteNum,
            sql: "select count(1) as total FROM @.table " + where,
        }, {
            action: "sqlite",
            database: "shopee/订单/发货预报/" + this.obj.siteNum,
            sql: "select " + Tool.fieldAs("binding_status,images,ship_by_date,arrange_shipment_time,warehouse_id,channel_id,action_status,is_need_alarm,sls_tn,submit_time,order_sn,shipping_method,fm_tn,carrier_id,binding_status,is_sorting_center_received,is_pick_up_done") + " FROM @.table " + where + " order by @.arrange_shipment_time desc " + Tool.limit(10, o.params.page),//
            //包裹关联1688的运单号。
            list: [{
                action: "sqlite",
                database: "shopee/订单/订单管理/" + this.obj.siteNum,
                sql: "select " + Tool.fieldAs("purchaseInfo") + " FROM @.table where @.order_sn='${order_sn}' limit 1",
            }]
        }, {
            action: o.DEFAULT_DB,
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let orderidArr = [];
        for (let i = 0; i < t[1].length; i++) {
            let arr = JSON.parse(t[1][i].list[0][0].purchaseInfo);
            for (let j = 0; j < arr.length; j++) {
                orderidArr.push(arr[j].orderid)
            }
            t[1][i].list[0][0].purchaseInfo = arr;//后会用到。
        }
        if (orderidArr.length) {
            let data = [{
                action: "sqlite",
                database: "1688/买家订单",
                sql: "select " + Tool.fieldAs("orderid,logisticsStatus,WaybillNumber,logisticsLastTime") + " FROM @.table where @.orderid in('" + orderidArr.join("','") + "')",
            }]
            Tool.ajax.a01(data, this.a05, this, t);
        }
        else {
            this.a05([[]], t);
        }
    },
    a05: function (t1, t2) {
        let tr = [], arr = t2[1], td = ""
        for (let i = 0; i < arr.length; i++) {
            if (o.params.binding_status == "0") {
                td = '\
                <td class="p-0">' + this.b19(arr[i].warehouse_id, arr[i].channel_id) + '</td>\
                <td class="p-0">' + this.b15(arr[i].arrange_shipment_time, arr[i].ship_by_date) + '</td>';
            }
            else {
                td = '\
                <td class="p-0">'+ this.b18(arr[i].shipping_method, arr[i].action_status) + '</td>\
                <td class="p-0">'+ this.b14(arr[i].carrier_id, arr[i].fm_tn) + '</td>\
                <td class="p-0">'+ this.b20(arr[i].submit_time, arr[i].ship_by_date) + '</td>\
                <td>'+ (arr[i].is_pick_up_done ? '是' : '否') + '</td>\
                <td>' + this.b12(arr[i].is_need_alarm, arr[i].is_sorting_center_received) + '</td>';
            }
            ///////////////////////////////////////////////////////////////
            tr.push('\
            <tr>\
                <td class="left p-0">'+ this.b11(arr[i].images) + '</td>\
                <td class="p-0">'+ this.b13(arr[i].order_sn, arr[i].sls_tn) + '</td>\
                '+ td + '\
                <td class="left">' + this.b16(arr[i].list[0][0].purchaseInfo, t1[0]) + '</td>\
            </tr>');
            //arr[i].binding_status     如果是“2”，则可以删除绑定。
        }
        let siteArr = JSON.parse(t2[2][0].config)[o.params.site]
        let html = Tool.header2(o.params.jsFile, o.params.site, o.params.num) + '\
        <div class="p-2">\
            '+ '<div style="padding-left:30px;position: relative;top:6px;">' + this.b02() + '</div>' +
             Tool.tab(o.params.jsFile, o.params.site, siteArr, o.params.num) +
            Tool.binding(o.params.jsFile, o.params.site, o.params.num, o.params.binding_status) +
            this.b06() + '\
        	<table class="table center align-top table-hover">\
        		<thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
        	</table>\
            ' + Tool.page(t2[0][0].total, 10, o.params.page) + '\
        </div>';
        Tool.html(null, null, html);
    },
    ///////////////////////////////////////////////////////////////////////////////////
    b01: function () {
        let th = ""
        if (o.params.binding_status == "0") {
            th = '<th class="w350">转运仓/物流渠道</th><th class="w200">安排出货时间/出货时间</th>'
        }
        else {
            th = '\
            <th class="w80">运输方式</th>\
            <th class="w150">物流商/追踪号</th>\
            <th class="w200">提交时间/出货时间</th>\
            <th class="w60">已揽货</th>\
            <th class="w60" title="具有叹号标示的订单为迟到仓订单，指的是：在同一批次预报的包裹中，与该批次第一个包裹到Shopee仓库扫描时间相差超过24小时的订单。 例如：A和B两个订单同一批次被预报，A订单于2021年1月1日14:00被Shopee转运仓扫描，若B订单2021年1月2日14:00前未被Shopee转运仓扫描，则被定义为迟到仓订单。">转运仓</th>'
        }
        let html = '\
        <tr>\
            <th>图片</th>\
            <th class="w170">编号/追踪号</th>\
            '+ th + '\
            <th class="left w350">关联1688物流信息</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'jsFile=js09\');"><a class="dropdown-item pointer">*获取未绑定的包裹</a></li>\
	        <li onClick="Tool.openR(\'jsFile=js08\');"><a class="dropdown-item pointer">*获取已绑定的包裹</a></li>\
	        <li onClick="Tool.openR(\'jsFile=js10\');"><a class="dropdown-item pointer">*开始绑定发货预报</a></li>\
        </ul>';
    },
    b03: function (action_status) {
        let str = "";
        switch (action_status) {
            case 2: str = "绑定成功"; break;
            case 3: str = "绑定失败"; break;
            default: str = "未知：" + action_status; break;
        }
        return str;
    },
    b04: function (carrier_id) {
        let str = "";
        switch (carrier_id) {
            case 0: str = "-"; break;
            case 371: str = "中通快递"; break;
            case 285: str = "圆通速递"; break;
            case 222: str = "韵达快递"; break;
            case 435: str = "申通快递"; break;
            case 862: str = "极兔速递"; break;
            default: str = "<font color=red>未知：" + carrier_id + "</font>"; break;
        }
        return str;
    },
    b05: function (shipping_method) {
        let str = "";
        switch (shipping_method) {
            case 0: str = "-"; break;
            case 2: str = "快递寄送"; break;
            default: str = "<font color=red>未知：" + shipping_method + "</font>"; break;
        }
        return str;
    },
    b06: function () {
        return '\
        <div class="input-group w-50 m-2">\
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ o.params.field + '">' + this.b07(o.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">订单编号</li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)">包裹追踪号</a></li>\
                <li class="dropdown-item pointer" onclick="fun.c01(3)">首公里追踪号</a></li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ o.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
    },
    b07: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "订单编号"; break;
            case "2": name = "包裹追踪号"; break;
            case "3": name = "首公里追踪号"; break;
            default: name = "未知：" + val;
        }
        return name
    },
    b08: function () {
        let arr = []
        if (o.params.searchword) {
            switch (o.params.field) {
                case "1": arr.push("@.order_sn='" + o.params.searchword + "'"); break;//订单编号
                case "2": arr.push("@.sls_tn='" + o.params.searchword + "'"); break;//包裹追踪号
                case "3": arr.push("@.fm_tn='" + o.params.searchword + "'"); break;//首公里追踪号
            }
        }
        if (o.params.binding_status == "0") {
            //binding_status=0    表示未绑定
            //binding_status=1    表示绑定失败
            //binding_status=2    表示已删除的绑定或绑定成功
            arr.push("@.binding_status<2");
        } else { arr.push("@.binding_status>0"); }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    b09: function (warehouse_id) {
        let str = "";
        switch (warehouse_id) {
            case "ECP04": str = "Shopee义乌仓"; break;
            default: str = "<font color=red>未知：" + warehouse_id + "</font>"; break;
        }
        return str;
    },
    b10: function (channel_id) {
        let str = "";
        switch (channel_id) {
            case 18025: str = "Doorstep Delivery (Overseas)"; break;
            case 18098: str = "Pick Locker (Overseas)"; break;
            case 58007: str = "Standard Express"; break;
            case 90001: str = "Expresso padrão"; break;
            case 110001: str = "Estándar Rápido"; break;
            case 18099: str = "Shopee Collection Point (Overseas)"; break;
            case 78004: str = "Standard International Delivery (标准渠道)"; break;
            case 120001: str = "Estándar Rápido"; break;
            case 38018: str = "蝦皮海外 - 7-11（海運）"; break;
            case 18049: str = "Express Doorstep Delivery(International) (快速渠道)"; break;
            default: str = "<font color=red>未知：" + channel_id + "</font>"; break;
        }
        return str;
    },
    b11: function (images) {
        let img = "";
        if (images) {
            let imgArr = JSON.parse(images);
            for (let j = 0; j < imgArr.length; j++) {
                img += '\
                <a href="https://s-cf-sg.shopeesz.com/file/' + imgArr[j] + '" target="_blank">\
                    <img src="https://s-cf-sg.shopeesz.com/file/' + imgArr[j] + '_tn" class="img-fluid rounded h70">\
                </a>'
            }
        }
        return img;
    },
    b12: function (is_need_alarm, is_sorting_center_received) {
        return (is_need_alarm ? 'Alarm <svg style="width: 16px;fill: #ff4742;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.5824678,5.27561285 C14.229699,4.44154703 13.7237902,3.69362242 13.0811494,3.05098154 C12.4385085,2.40834066 11.6905839,1.90243188 10.856518,1.54966305 C9.99373848,1.18458834 9.07626607,1 8.13144724,1 C7.18662841,1 6.269156,1.18458834 5.40637643,1.54966305 C4.5723106,1.90243188 3.824386,2.40834066 3.18174512,3.05098154 C2.53910423,3.69362242 2.03319545,4.44154703 1.68042663,5.27561285 C1.31535192,6.13839242 1.13076358,7.05586483 1.13076358,8.00068366 C1.13076358,8.94550249 1.31535192,9.8629749 1.68042663,10.7257545 C2.03319545,11.5598203 2.53910423,12.3077449 3.18174512,12.9503858 C3.824386,13.5930267 4.57367792,14.0975681 5.40637643,14.4503369 C6.269156,14.8154117 7.18662841,15 8.13144724,15 C9.07626607,15 9.99373848,14.8154117 10.856518,14.4503369 C11.6905839,14.0989354 12.4385085,13.5930267 13.0811494,12.9503858 C13.7237902,12.3077449 14.2283317,11.558453 14.5811005,10.7257545 C14.9461752,9.8629749 15.1307636,8.94550249 15.1307636,8.00068366 C15.1307636,7.05586483 14.9475426,6.13839242 14.5824678,5.27561285 Z M8.13144724,11.9385682 C7.64878291,11.9385682 7.25636178,11.5461471 7.25636178,11.0634828 C7.25636178,10.5808184 7.64878291,10.1883973 8.13144724,10.1883973 C8.61411156,10.1883973 9.00653269,10.5808184 9.00653269,11.0634828 C9.00653269,11.5461471 8.61411156,11.9385682 8.13144724,11.9385682 Z M9.00653269,4.93514992 C9.00653269,4.93651724 9.00653269,4.93651724 9.00653269,4.93514992 L9.00653269,4.94745581 C9.00653269,4.99941401 9.00106341,5.05000488 8.99149216,5.09922844 L8.56625532,8.92362535 C8.54164355,9.14513136 8.35432056,9.31331185 8.13144724,9.31331185 C7.90857391,9.31331185 7.72125093,9.14513136 7.69663915,8.92499268 L7.27140231,5.10059576 C7.26183106,5.0513722 7.25636178,5.00078133 7.25636178,4.94882313 L7.25636178,4.9146401 C7.26866767,4.44291435 7.65561952,4.06143178 8.13144724,4.06143178 C8.60727495,4.06143178 8.99422681,4.44154703 9.00653269,4.9146401 L9.00653269,4.93514992 Z"></path></svg>' : (is_sorting_center_received ? '是' : '否'))
    },
    b13: function (order_sn, sls_tn) {
        return '\
        <table class="table table-bordered align-middle mb-0">\
            <tr><td title="订单编号">' + order_sn + '</td></tr>\
            <tr><td title="包裹追踪号">' + sls_tn + '</td></tr>\
        </table>';
    },
    b14: function (carrier_id, fm_tn) {
        return '\
        <table class="table table-bordered align-middle mb-0">\
            <tr><td title="订单编号">' + this.b04(carrier_id) + '</td></tr>\
            <tr><td title="包裹追踪号">' + (fm_tn ? fm_tn : '-') + '</td></tr>\
        </table>';
    },
    b15: function (arrange_shipment_time, ship_by_date) {
        return '\
        <table class="table table-bordered align-middle mb-0">\
            <tr><td title="安排出货时间">' + Tool.js_date_time2(arrange_shipment_time) + '</td></tr>\
            <tr><td title="出货时间">' + Tool.js_date_time2(ship_by_date) + '(' + Tool.datedifference(ship_by_date * 1000) + '天)</td></tr>\
        </table>';
    },
    b16: function (purchaseInfo, _1688OrderArr) {
        let strArr = [];
        for (let i = 0; i < purchaseInfo.length; i++) {
            for (let j = 0; j < _1688OrderArr.length; j++) {
                if (purchaseInfo[i].orderid == _1688OrderArr[j].orderid) {
                    let str = "";
                    if (_1688OrderArr[j].WaybillNumber) {
                        str = '<a href="https://trade.1688.com/order/new_step_order_detail.htm?orderId=' + _1688OrderArr[j].orderid + '&amp;tracelog=20120313bscentertologisticsbuyer&amp;#logisticsTabTitle" target="_blank" title="点击查看物流">' + _1688OrderArr[j].WaybillNumber + '</a>(' + this.b17(_1688OrderArr[j].logisticsStatus)
                        if (_1688OrderArr[j].logisticsStatus != 0) {
                            str += " - " + Tool.js_date_time2(_1688OrderArr[j].logisticsLastTime);
                        }
                        str += ")"
                    }
                    strArr.push(str);
                }
            }
        }
        return strArr.join("<hr/>");
    },
    b17: function (logisticsStatus) {
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
    b18: function (shipping_method, action_status) {
        return '\
        <table class="table table-bordered align-middle mb-0">\
            <tr><td title="状态">' + this.b03(action_status) + '</td></tr>\
            <tr><td title="首公里运输方式">' + this.b05(shipping_method) + '</td></tr>\
        </table>';
    },
    b19: function (warehouse_id, channel_id) {
        return '\
        <table class="table table-bordered align-middle mb-0">\
            <tr><td title="转运仓">' + this.b09(warehouse_id) + '</td></tr>\
            <tr><td title="物流渠道">' + this.b10(channel_id) + '</td></tr>\
        </table>';
    },
    b20: function (submit_time, ship_by_date) {
        let td2 = "&nbsp;"
        if (ship_by_date) {
            td2 = Tool.js_date_time2(ship_by_date) + '(' + Tool.datedifference(ship_by_date * 1000) + '天)'
        }
        return '\
        <table class="table table-bordered align-middle mb-0">\
            <tr><td title="提交时间">' + Tool.js_date_time2(submit_time) + '(' + Tool.datedifference(submit_time * 1000) + '天)</td></tr>\
            <tr><td title="出货时间">' + td2 + '</td></tr>\
        </table>';
    },
    //////////////////////////////////////////
    c01: function (val) {
        let name = this.b07("" + val);
        $("#field").html(name).val(val)
    },
    c02: function () {
        let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
        if (searchword) {
            Tool.main("jsFile=" + o.params.jsFile + "&site=" + o.params.site + "&page=1&field=" + field + "&searchword=" + searchword);
        } else { alert("请输入搜索内容"); }
    },
}
fun.a01();