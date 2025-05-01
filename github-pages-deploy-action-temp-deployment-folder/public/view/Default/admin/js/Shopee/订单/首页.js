'use strict';
var fun =
{
    a01: function () {
        //obj.params.jsFile             选择JS文件
        obj.params.page = obj.params.page ? parseInt(obj.params.page) : 1;//翻页  
        obj.params.site = obj.params.site ? obj.params.site : 'sg'
        obj.params.status = obj.params.status ? obj.params.status : ""//订单状态
        obj.params.purchaseStatus = obj.params.purchaseStatus ? obj.params.purchaseStatus : ""//采购状态
        obj.params.field = obj.params.field ? obj.params.field : '1'//搜索字段
        obj.params.searchword = obj.params.searchword ? Tool.Trim(obj.params.searchword) : "";//搜索关键词
        this.a02();
    },
    a02: function () {
        let data = [{
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/订单",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/订单.db"],
                database: "shopee/订单",
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function () {
        let where = this.b17()
        let data = [{
            action: "sqlite",
            database: "shopee/订单/" + obj.params.site,
            sql: "select count(1) as total FROM @.table " + where,
        }, {
            action: "sqlite",
            database: "shopee/订单/" + obj.params.site,
            sql: "select " + Tool.fieldAs("cancel_reason_ext,rate_by_date,status_ext,payby_date,order_sn,actual_carrier,total_price,status,auto_cancel_arrange_ship_date,escrow_release_time,payment_method,order_items,logistics_status,buyer_user,create_time,shipping_confirm_time,tracking_number,purchaseStatus,purchaseNotes") + " FROM @.table " + where + " order by @.create_time desc" + Tool.limit(20, obj.params.page),
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (arr) {
        let tr = [], t = arr[1]
        for (let i = 0; i < t.length; i++) {
            tr.push('\
            <tr>\
                <td class="p-0">' + this.b07(t[i].order_sn, JSON.parse(t[i].buyer_user)) + '</td>\
                <td class="p-0">'+ this.b03(JSON.parse(t[i].order_items)) + '</td>\
                <td class="p-0">'+ this.b06(t[i].total_price, t[i].payment_method, t[i].create_time, t[i].shipping_confirm_time) + '</td>\
                <td class="p-0">'+ this.b10(
                t[i].status + "-" + t[i].status_ext + "-" + t[i].logistics_status,
                t[i].cancel_reason_ext,
                t[i].rate_by_date,
                t[i].auto_cancel_arrange_ship_date,//超过这个时间没填国内运单算迟发货
                t[i].escrow_release_time,//等待买家在2024/06/27前点选完成订单
                t[i].payby_date,//买家付款的超时时间，就是买家的最晚付款时间
                t[i].actual_carrier,
                t[i].tracking_number) + '</td>\
                <td class="p-0">'+ this.b14(t[i].purchaseStatus, t[i].purchaseNotes) + '</td>\
            </tr>');
        }
        let html = '\
        <div style="top:6px;position:relative;padding-left:25px;">'+ this.b09() + '</div><header class="panel-heading" style="margin-left: 20px;">Shopee &gt; 订单</header>\
		<div class="p-2">\
            '+ Tool.header3(obj.params.jsFile, obj.params.site) + this.b15() + '\
			<table class="table align-top table-hover">\
				<thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
			</table>\
            ' + Tool.page(arr[0][0].total, 20, obj.params.page) + '\
		</div>';
        Tool.html(null, null, html)
    },
    /////////////////////////////////////////
    b01: function () {
        let html = '\
        <tr>\
            <th style="padding-left:30px;position: relative;" class="w200">'+ this.b02() + '订单编号</th>\
            <th>商品</th>\
            <th class="w150">买家支付金额</th>\
            <th class="p-0">'+ this.b12("状态 | 发货时限", obj.params.status, config[obj.params.site].status) + '</th>\
            <th class="p-0">'+ this.b13("采购状态", obj.params.purchaseStatus, config[obj.params.site].purchaseStatus) + '</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'?jsFile=js01&site='+ obj.params.site + '\');"><a class="dropdown-item pointer">*获取订单信息</a></li>\
        </ul>'
    },
    b03: function (arr) {
        let rArr = []
        for (let i = 0; i < arr.length; i++) {
            let td1 = '\
            <a href="https://s-cf-sg.shopeesz.com/file/' + arr[i].product.images[0] + '" target="_blank">\
                <img src="https://s-cf-sg.shopeesz.com/file/' + arr[i].product.images[0] + '_tn" class="img-fluid rounded">\
            </a>'
            rArr.push('\
            <tr>\
                <td class="w70 p-0" rowspan="2">' + td1 + '</td>\
                <td colspan="8">' + arr[i].product.name + '</td>\
            </tr>\
            <tr>\
                <td class="right w50">编码:</td>\
                <td class="w120">' + arr[i].item_model.sku + '</td>\
                <td class="right w50">数量:</td>\
                <td class="w50">' + arr[i].amount + '</td>\
                <td class="right w50">价格:</td>\
                <td class="w70">' + arr[i].order_price + ' </td>\
                <td class="right w50">规格:</td>\
                <td>' + arr[i].item_model.name + '</td>\
            </tr>')
        }
        return '<table class="table table-bordered align-middle mb-0">' + rArr.join("") + '</table>'
    },
    b04: function (site) {
        let unit = "未开发"
        switch (site) {
            case "sg": unit = "$"; break;
            case "my": unit = "RM"; break;
            case "br": unit = "R$"; break;
            case "tw": unit = "NT$"; break;
            case "th": unit = "฿"; break;
        }
        return unit;
    },
    b05: function (payment_method) {
        let str = "未开发:" + payment_method
        switch (payment_method) {
            case 1: str = "信用卡/银行卡"; break;
            case 5: str = "撤销的款项"; break;
            case 6: str = "Cash on Delivery"; break;
            case 18: str = "Credit Card/Debit Card"; break;
            case 23: str = "Credit Card"; break;
            case 24: str = "SParcelado"; break;
            case 27: str = "ShopeePay"; break;
            case 33: str = "JKO Pay"; break;
            case 50: str = "Mobile Banking"; break;
            case 51: str = "PayNow"; break;
            case 66: str = "DBS PayLah!"; break;
            case 4:
            case 37:
                str = "网上银行"; break;
            case 100:
            case 79:
                str = "Pix"; break;
            case 80: str = "Boleto Bancário"; break;
        }
        return '<font color="#8c8c8c">' + str + '</font>';
    },
    b06: function (total_price, payment_method, create_time, shipping_confirm_time) {
        return '\
        <table class="table table-bordered align-middle mb-0">\
            <tr><td title="买家支付金额">' + this.b04(obj.params.site) + total_price + "<br/>" + this.b05(payment_method) + '</td></tr>\
            <tr><td title="下单时间">' + Tool.js_date_time2(create_time) + '</td></tr>\
            <tr><td title="确认时间">' + Tool.js_date_time2(shipping_confirm_time) + '</td></tr>\
        </table>'
    },
    b07: function (order_sn, buyer_user) {
        return '\
        <table class="table table-bordered mb-0 center">\
            <tr><td><a href="javascript:" onclick="Tool.openR(\'?jsFile=js02&site='+ obj.params.site + '&order_sn=' + order_sn + '\')">' + order_sn + '</a></td></tr>\
            <tr><td title="买家信息"><img src="'+ this.b08(buyer_user.portrait) + '" class="w20 me-1 rounded-circle">' + buyer_user.user_name + '</td></tr>\
        </table>'
    },
    b08: function (portrait) {
        if (portrait) {
            return 'https://s-cf-sg.shopeesz.com/file/' + portrait
        } else {
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAABJlBMVEXP2NxgfYtjf412j5uMoavO19uis7vG0dVxi5fBzNJyjJhjgI56kp5hfoxxi5h5kZ2ouL9ohJGInaipucCHnah3kJyxv8bL1NnM1dlphJGXqrN4kZzM1tqUp7Gnt76InqlkgY6wvsWGnKdrhpOnuL+xwMZ8lJ+3xMvAzNGCmaTFz9Sdr7fN1trN19tlgY5qhZJkgI6/y9COoqzL1dlphJJ0jZp7k566x8y7x81ng5CywMegsrp4kZ14kJyhs7uJn6nH0dZlgY+Fm6bG0daWqrO2xMqzwcfF0NXBzdK3xcu0wsh7k5+qusG0wsmzwchuiJVviZaYq7S7yM2Kn6m8yM6/y9GInqiWqbKNoqxzjJmjtLyqucGfsbmdr7iwv8WKoKpuiZVif42PQ9RwAAABzUlEQVR4Xu3YVZLjShBA0UyBmZmamXuYmZmZ3tv/Jua3Y8JWTdsKKR1zzwruR1aVlDIdAAAAAAAAAAAAAAAAAADyN1t+3fPqfiOTl7kQ1qp6QqkZinmdnP6hcFVs6wY6RtATwx75OlY7K2ZlczpBzmx194ZONOyKTbc0QiAmrWikFTHoIKeRKgdiz7o6LIo919XhophzRp3yYs01dcqINavqtCTWXFAnX6y5ok7nxZqyOhWJNjAeHERzVx6Py7Y6PRZzqnP4wSQ1dajN4U9AIRSDOhqpIyYFGuGs2HRuqBMNR/O3rKlYXjG1dazhbTGsF4yd557YtlFwrHpNCpslPeHZ81DmQj7T8OvFYt9vfM3LPwkAgOzDzMLdUqV/qHqnXymtLmRe3hPD9h/s7RzpGEc7e1v7Yk+4dX/zWCMsbw6eiClPgzV107XPL8SI3cEr/Wuv3+xK+t4ueXoq3rv3kq4PrbKeWvnjtqRn9MnTqXiDkaTkUkGn9uWypKK5rDM4/CYp+K4z+iGJW9SZrSc+z57OzEt6rtsag6ok6qfGYkOS1NJY/JIk/aexyEmS/tdYHEuSNCbzGU000UQTTTQAAAAAAAAAAAAAAAAAAL8BwZgl987F+p8AAAAASUVORK5CYII=';
        }
    },
    b09: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'?jsFile=js03\');"><a class="dropdown-item pointer">*从客优云和1688获取采购信息</a></li>\
        </ul>'
    },
    b10: function (status, cancel_reason_ext, rate_by_date, auto_cancel_arrange_ship_date, escrow_release_time, payby_date, actual_carrier, tracking_number) {
        return '\
        <table class="table table-bordered align-middle mb-0">\
        <tr><td title="状态 | 发货时限">' + this.b11(status, cancel_reason_ext, rate_by_date, auto_cancel_arrange_ship_date, escrow_release_time, payby_date) + '</td></tr>\
        <tr><td title="物流渠道">' + actual_carrier + '</td></tr>\
        <tr><td title="包裹号">' + (tracking_number ? tracking_number : "&nbsp;") + '</td></tr>\
        </table>'
    },
    //状态 | 发货时限
    b11: function (status, cancel_reason_ext, rate_by_date, auto_cancel_arrange_ship_date, escrow_release_time, payby_date) {
        let str = ""
        switch (status) {
            case "5-6-10":
            case "5-6-0":
            case "5-8-4":
            case "5-8-10":
            case "5-8-7":
                str = '已取消<br/>'
                switch (cancel_reason_ext) {
                    case 701: str += '<font color="#8c8c8c">已被系统自动取消订单<br/>取消原因:订单因买家未按时完成 EZ WAY 实名认证而取消</font>'; break;
                    case 506: str += '<font color="#8c8c8c">已被买家取消<br/>取消原因:不想购买了</font>'; break;
                    case 3: str += '<font color="#8c8c8c">已被买家取消<br/>取消原因:修改现有内容(例如:颜色、尺寸、地址、优惠卷...)</font>'; break;
                    case 100: str += '<font color="#8c8c8c">已被系统自动取消订单<br/>取消原因: 因为买家未能及时完成付款，系统已自动取消此笔订单。</font>'; break;
                    case 505: str += '<font color="#8c8c8c">已被买家取消<br/>取消原因:在别处找到更便宜的</font>'; break;
                    case 502: str += '<font color="#8c8c8c">已被买家取消<br/>取消原因:需要输入/更换优惠券代码</font>'; break;
                    case 507: str += '<font color="#8c8c8c">已被买家取消<br/>取消原因:其他</font>'; break;
                    case 503: str += '<font color="#8c8c8c">已被买家取消<br/>取消原因:需要修改订单(例如:尺寸，颜色，数量等等)</font>'; break;
                    case 9: str += '<font color="#8c8c8c">已被买家取消<br/>取消原因:其他/改变主意</font>'; break;
                    case 504: str += '<font color="#8c8c8c">已被买家取消<br/>取消原因:付款程序太麻烦了</font>'; break;
                    case 205: str += '<font color="red">已被系统自动取消订单<br/>取消原因: 已被Shopee仓库取消</font>'; break;
                    case 302: str += '<font color="red">已被系统自动取消订单<br/>取消原因: 卖家没在期限内出货</font>'; break;
                    case 303: str += '<font color="red">已被买家取消<br/>取消原因:订单未在截止日期之前运送至中转仓库。</font>'; break;
                    default: str += "<font color=red>未知取消原因：" + cancel_reason_ext + "</font>"; break;
                }
                break;
            /////////////////////////////////////////////////////////////////////
            case "1-1-0": str = '尚未付款<br/><font color="#8c8c8c">在' + Tool.js_date_time2(payby_date) + '前完成付款</font>'; break;
            case "2-2-2": str = '已出货<br/><font color="#8c8c8c">订单正在运送给买家。</font>'; break;
            ////////////////////////////////////////////////////////////////////
            case "2-2-1":
            case "1-1-1": str = '待出货<br/><font color="#8c8c8c">等待快递员确认发货。</font>'; break;
            ///////////////////////////////////////////////////////////////////
            case "2-2-5":
            case "2-2-9": str = '待出货<br/><font color="#8c8c8c">为了避免延迟出货，请在' + Tool.js_date_time2(auto_cancel_arrange_ship_date) + '前出货。</font>'; break;
            //////////////////////////////////////////////////////////////////////
            case "4-15-5": str = '已送达<br/><font color="#8c8c8c">订单已送达。拨款金额将在订单完成后入账。</font>'; break;
            case "4-10-5": str = '已完成<br/><font color="#8c8c8c">部分退货退款</font>'; break;//巴西（2412307QBA9A1Q）
            case "4-10-6": str = '已完成<br/><font color="#8c8c8c">亏钱</font>'; break;//巴西（241201MMTAKXEN）
            case "4-11-5":
                if (Tool.gettime("") > rate_by_date) {
                    str = '已完成';
                }
                else {
                    str = '已收到订单<br/><font color="#8c8c8c"> 拨款金额已入账，但买家可于' + Tool.js_date_time2(rate_by_date) + '前提出退货/退款申请。 </font>';
                }
                break;
            default: str = "<font color=red>未知status：" + status + "</font>"; break;
        }

        //case 2:
        //    str = '已出货<br/><font color="#8c8c8c">等待买家在' + Tool.js_date_time2(escrow_release_time) + '前点选完成订单</font>';
        //    break;
        return str;
    },
    b12: function (name, status, configstatus) {
        let optionArr = [], arr = [
            ["1", "待付款"],
            ["2", "待出货/已出货"],
            ["2-2-5", "待处理出货1"],
            ["2-2-9", "待处理出货2"],
            ["1-1-1", "已处理出货1"],
            ["2-2-1", "已处理出货2"],
            ["4", "已收到订单/已送达/已完成"],
            ["5", "已取消"],
        ]
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i][0] + '"' + (arr[i][0] == status ? 'selected="selected"' : '') + '>' + arr[i][0] + '.' + arr[i][1] + '(' + configstatus[i] + ')</option>')
        }
        return '\
        <select onChange="fun.c03(this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          <option value="-1">更新数量</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    b13: function (name, purchaseStatus, configPurchaseStatus) {
        if (!configPurchaseStatus) configPurchaseStatus = []
        let optionArr = [], arr = Tool.purchaseStatusArr
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i][0] + '"' + (arr[i][0] == purchaseStatus ? 'selected="selected"' : '') + '>' + arr[i][0] + '.' + arr[i][1] + '(' + configPurchaseStatus[i] + ')</option>')
        }
        return '\
        <select onChange="fun.c04(this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          <option value="-1">更新数量</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    b14: function (purchaseStatus, purchaseNotes) {
        let arr = Tool.purchaseStatusArr, val = "";
        for (let i = 0; i < arr.length; i++) {
            if (purchaseStatus == arr[i][0]) { val = arr[i][1]; break; }
        }
        return '\
        <table class="table table-bordered align-middle mb-0">\
            <tr><td title="采购状态">' + val + '</td></tr>\
            <tr><td title="采购备注">' + (purchaseNotes ? purchaseNotes : "&nbsp;") + '</td></tr>\
        </table>'
    },
    b15: function () {
        return '\
        <div class="input-group w-50 m-2">\
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ obj.params.field + '">' + this.b16(obj.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">订单编号</li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)">包裹号</a></li>\
                <li class="dropdown-item pointer" onclick="fun.c01(3)">采购订单号</a></li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ obj.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
    },
    b16: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "订单编号"; break;
            case "2": name = "包裹号"; break;
            case "3": name = "采购订单号"; break;
            default: name = "未知：" + val;
        }
        return name
    },
    b17: function () {
        let arr = [];
        if (obj.params.searchword) {
            switch (obj.params.field) {
                case "1": arr.push("@.order_sn='" + obj.params.searchword + "'"); break;//商品编码
                case "2": arr.push("@.package_number='" + obj.params.searchword + "'"); break;//包裹号
                case "3": arr.push("@.purchaseInfo like '%" + obj.params.searchword + "%'"); break;//采购订单号
            }
        }
        if (obj.params.status != "") { arr.push("@.status=" + obj.params.status); }
        if (obj.params.purchaseStatus != "") { arr.push("@.purchaseStatus=" + obj.params.purchaseStatus); }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    b18: function (logistics_status) {
        let str = ""
        switch (logistics_status) {
            case 0: str = '------------' + logistics_status; break;
            case 1: str = '待出货<br/><font color="#8c8c8c">等待快递员确认发货。</font>'; break;
            // case 4:
            // case 10: // 已被买家取消 
            //     str = '已取消'; break;
            //case 9: str = '待出货<br/><font color="#8c8c8c"> 为避免延迟出货，请于 ' + Tool.js_date_time2(auto_cancel_arrange_ship_date) + ' 前出货。</font>'; break;
            default: str = "未知：" + logistics_status; break;
        }
        return str
    },
    //////////////////////////////////////////
    c01: function (val) {
        let name = this.b16("" + val)
        $("#field").html(name).val(val)
    },
    c02: function () {
        let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
        if (field == "2" && isNaN(searchword)) {
            alert("【商品ID】必须是数字。")
        }
        else if (searchword) {
            Tool.main("?jsFile=" + obj.params.jsFile + "&site=" + obj.params.site + "&page=1&field=" + field + "&searchword=" + searchword);
        } else { alert("请输入搜索内容"); }
    },
    c03: function (val) {
        if (val == "-1") {
            Tool.openR("?jsFile=js04&site=" + obj.params.site);
        }
        else {
            Tool.open("status", val);
        }
    },
    c04: function (val) {
        if (val == "-1") {
            Tool.openR("?jsFile=js05&site=" + obj.params.site);
        }
        else {
            Tool.open("purchaseStatus", val);
        }
    },
}
fun.a01();