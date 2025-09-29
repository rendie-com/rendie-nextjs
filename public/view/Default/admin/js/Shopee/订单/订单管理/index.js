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
        o.params.time = o.params.time ? o.params.time : ""//时间
        o.params.list_type = o.params.list_type ? o.params.list_type : ""//状态
        o.params.purchaseStatus = o.params.purchaseStatus ? o.params.purchaseStatus : ""//采购状态
        o.params.field = o.params.field ? o.params.field : '1'//搜索字段
        o.params.searchword = o.params.searchword ? Tool.Trim(o.params.searchword) : "";//搜索关键词
        o.params.num = o.params.num ? o.params.num : '1'//第几个店
        this.obj.siteNum = Tool.siteNum(o.params.site, o.params.num);
        this.a02();
    },
    a02: function () {
        Tool.download_sqlite.a01(["shopee/订单/订单管理/" + this.obj.siteNum], this.a03, this)
    },
    a03: function () {
        let where = this.b11()
        let data = [{
            action: "sqlite",
            database: "shopee/订单/订单管理/" + this.obj.siteNum,
            sql: "select count(1) as total FROM @.table " + where,
        }, {
            action: "sqlite",
            database: "shopee/订单/订单管理/" + this.obj.siteNum,
            sql: "select " + Tool.fieldAs("auto_cancel_3pl_ack_date,list_type,cancel_reason_ext,rate_by_date,status_ext,payby_date,order_sn,actual_carrier,total_price,status,auto_cancel_arrange_ship_date,escrow_release_time,payment_method,order_items,logistics_status,buyer_user,create_time,shipping_confirm_time,tracking_number,purchaseStatus,purchaseNotes") + " FROM @.table " + where + " order by @.create_time desc" + Tool.limit(20, o.params.page),
        }, {
            action: o.DEFAULT_DB,
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }, {
            action: o.DEFAULT_DB,
            database: "main",
            sql: "select @.value as value FROM @.config where @.name='" + o.params.template + "'",
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (arr) {
        let tr = [], t = arr[1]
        let siteArr = JSON.parse(arr[2][0].config)[o.params.site]
        for (let i = 0; i < t.length; i++) {
            tr.push('\
            <tr>\
                <td class="p-0">'+ this.b07(t[i].order_sn, JSON.parse(t[i].buyer_user), t[i].total_price, t[i].payment_method) + '</td>\
                <td class="p-0">'+ this.b03(JSON.parse(t[i].order_items)) + '</td>\
                <td class="p-0">'+ this.b06(
                t[i].create_time,
                t[i].shipping_confirm_time,
                t[i].auto_cancel_arrange_ship_date,
                t[i].auto_cancel_3pl_ack_date) + '</td>\
                <td class="p-0">'+ this.b10(
                    t[i].list_type,
                    t[i].status + "-" + t[i].status_ext + "-" + t[i].logistics_status,
                    t[i].cancel_reason_ext,
                    t[i].rate_by_date,
                    t[i].auto_cancel_arrange_ship_date,//超过这个时间没填国内运单算迟发货
                    t[i].escrow_release_time,//等待买家在2024/06/27前点选完成订单
                    t[i].payby_date,//买家付款的超时时间，就是买家的最晚付款时间
                    t[i].actual_carrier,
                    t[i].tracking_number) + '\
                </td>\
                <td class="p-0">'+ this.b14(t[i].purchaseStatus, t[i].purchaseNotes) + '</td>\
            </tr>');
        }
        let html = Tool.header2(o.params.jsFile, o.params.site, o.params.num) + '\
		<div class="p-2">\
            <div style="top:6px;position:relative;">'+ this.b17() + '</div>' +
            Tool.tab(o.params.jsFile, o.params.site, siteArr, o.params.num) + this.b15() + '\
			<table class="table align-top table-hover">\
				<thead class="table-light">'+ this.b01(arr[3]) + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
			</table>' + Tool.page(arr[0][0].total, 20, o.params.page) + '\
		</div>';
        Tool.html(null, null, html);
    },
    /////////////////////////////////////////////////////////////////
    b01: function (t3) {
        let config = JSON.parse(t3[0].value)["订单管理"]
        if (!config) { config = {}; }
        if (!config[this.obj.siteNum]) config[this.obj.siteNum] = {};
        let html = '\
        <tr>\
            <th style="padding-left:30px;position: relative;" class="w210">'+ this.b02() + '订单编号</th>\
            <th>商品</th>\
            <th class="p-0 w200">'+ this.b09("时间", o.params.time, config[this.obj.siteNum]["时间"]) + '</th>\
            <th class="p-0 w200">'+ this.b12("状态", o.params.list_type, config[this.obj.siteNum]["状态"]) + '</th>\
            <th class="p-0 w200">'+ this.b13("采购状态", o.params.purchaseStatus, config[this.obj.siteNum]["采购状态"]) + '</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'jsFile=js01&site='+ o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*获取订单信息</a></li>\
        </ul>';
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
                <td class="w100">' + arr[i].order_price + ' </td>\
                <td class="right w50">规格:</td>\
                <td>' + arr[i].item_model.name + '</td>\
            </tr>');
        }
        return '<table class="table table-bordered align-middle mb-0">' + rArr.join("") + '</table>';
    },
    b04: function (site, total_price) {
        let unit = "未开发:" + total_price;
        switch (site) {
            case "sg": unit = "$" + total_price; break;
            case "my": unit = "RM" + total_price; break;
            case "br": unit = "R$" + total_price; break;
            case "tw": unit = "NT$" + total_price; break;
            case "th": unit = "฿" + total_price; break;
            case "vn": unit = "₫" + total_price; break;
            case "co": unit = "COP " + total_price; break;
            case "ph": unit = "₱" + total_price; break;
            case "mx": unit = "$" + total_price + " MXN"; break;
            case "cl": unit = "CLP " + total_price; break;
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
            case 27:
            case 28: str = "ShopeePay"; break;
            case 33: str = "JKO Pay"; break;
            case 30: str = "ShopeePay已绑定银行账号"; break;
            case 49: str = "Google Pay"; break;
            case 50: str = "Mobile Banking"; break;
            case 51: str = "PayNow"; break;
            case 59: str = "Mari Savings Account"; break;
            case 62: str = "PSE"; break;
            case 66: str = "DBS PayLah!"; break;
            case 4:
            case 37:
                str = "网上银行"; break;
            case 100:
            case 79:
                str = "Pix"; break;
            case 80: str = "Boleto Bancário"; break;
            case 84: str = "Apple Pay"; break;
            case 87: str = "银行卡"; break;
            case 92: str = "QR Promptpay"; break;
            case 99: str = "Mari Credit Card Instant Checkout"; break;
        }
        return '<font color="#8c8c8c">' + str + '</font>';
    },
    b06: function (create_time, shipping_confirm_time, auto_cancel_arrange_ship_date, auto_cancel_3pl_ack_date) {
        let time1 = "&nbsp;"
        if (auto_cancel_arrange_ship_date) {
            time1 = Tool.js_date_time2(auto_cancel_arrange_ship_date)
            let day1 = Tool.datedifference(auto_cancel_arrange_ship_date * 1000)
            if (day1 > -10) { time1 += "(" + day1 + "天)"; }
        }
        ////////////////////////////////////////////////////////////////////////////////
        let time2 = "&nbsp;"
        if (auto_cancel_arrange_ship_date) {
            time2 = Tool.js_date_time2(auto_cancel_3pl_ack_date)
            let day2 = Tool.datedifference(auto_cancel_3pl_ack_date * 1000)
            if (day2 > -10) { time2 += "(" + day2 + "天)"; }
        }
        ////////////////////////////////////////////
        return '\
        <table class="table table-bordered align-middle mb-0 center">\
            <tr><td title="下单时间">' + Tool.js_date_time2(create_time) + '</td></tr>\
            <tr><td title="确认时间">' + Tool.js_date_time2(shipping_confirm_time) + '</td></tr>\
            <tr><td title="正常发货截止时间（注：最小天数<-10,就不显示天数了。）">' + time1 + '</td></tr>\
            <tr><td title="订单取消时间（注：最小天数<-10,就不显示天数了。）">' + time2 + '</td></tr>\
        </table>'
    },
    b07: function (order_sn, buyer_user, total_price, payment_method) {
        return '\
        <table class="table table-bordered mb-0 center">\
            <tr><td><a href="javascript:" onclick="Tool.openR(\'jsFile=js02&site='+ o.params.site + '&num=' + o.params.num + '&order_sn=' + order_sn + '\')">' + order_sn + '</a></td></tr>\
            <tr><td title="买家信息"><img src="'+ this.b08(buyer_user.portrait) + '" class="w20 me-1 rounded-circle">' + buyer_user.user_name + '</td></tr>\
            <tr><td title="买家支付金额">' + this.b04(o.params.site, total_price) + "<br/>" + this.b05(payment_method) + '</td></tr>\
        </table>';
    },
    b08: function (portrait) {
        if (portrait) {
            return 'https://s-cf-sg.shopeesz.com/file/' + portrait + "_tn"
        } else {
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAABJlBMVEXP2NxgfYtjf412j5uMoavO19uis7vG0dVxi5fBzNJyjJhjgI56kp5hfoxxi5h5kZ2ouL9ohJGInaipucCHnah3kJyxv8bL1NnM1dlphJGXqrN4kZzM1tqUp7Gnt76InqlkgY6wvsWGnKdrhpOnuL+xwMZ8lJ+3xMvAzNGCmaTFz9Sdr7fN1trN19tlgY5qhZJkgI6/y9COoqzL1dlphJJ0jZp7k566x8y7x81ng5CywMegsrp4kZ14kJyhs7uJn6nH0dZlgY+Fm6bG0daWqrO2xMqzwcfF0NXBzdK3xcu0wsh7k5+qusG0wsmzwchuiJVviZaYq7S7yM2Kn6m8yM6/y9GInqiWqbKNoqxzjJmjtLyqucGfsbmdr7iwv8WKoKpuiZVif42PQ9RwAAABzUlEQVR4Xu3YVZLjShBA0UyBmZmamXuYmZmZ3tv/Jua3Y8JWTdsKKR1zzwruR1aVlDIdAAAAAAAAAAAAAAAAAADyN1t+3fPqfiOTl7kQ1qp6QqkZinmdnP6hcFVs6wY6RtATwx75OlY7K2ZlczpBzmx194ZONOyKTbc0QiAmrWikFTHoIKeRKgdiz7o6LIo919XhophzRp3yYs01dcqINavqtCTWXFAnX6y5ok7nxZqyOhWJNjAeHERzVx6Py7Y6PRZzqnP4wSQ1dajN4U9AIRSDOhqpIyYFGuGs2HRuqBMNR/O3rKlYXjG1dazhbTGsF4yd557YtlFwrHpNCpslPeHZ81DmQj7T8OvFYt9vfM3LPwkAgOzDzMLdUqV/qHqnXymtLmRe3hPD9h/s7RzpGEc7e1v7Yk+4dX/zWCMsbw6eiClPgzV107XPL8SI3cEr/Wuv3+xK+t4ueXoq3rv3kq4PrbKeWvnjtqRn9MnTqXiDkaTkUkGn9uWypKK5rDM4/CYp+K4z+iGJW9SZrSc+z57OzEt6rtsag6ok6qfGYkOS1NJY/JIk/aexyEmS/tdYHEuSNCbzGU000UQTTTQAAAAAAAAAAAAAAAAAAL8BwZgl987F+p8AAAAASUVORK5CYII=';
        }
    },
    b09: function (name, time, timeArr) {
        let optionArr = [], arr = Tool.timeArr
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i][0] + '"' + (arr[i][0] == time ? 'selected="selected"' : '') + '>' + arr[i][0] + '.' + arr[i][1] + (timeArr ? '(' + timeArr[i] + ')' : '') + '</option>')
        }
        return '\
        <select onChange=" Tool.open(\'time\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    b10: function (list_type, status, cancel_reason_ext, rate_by_date, auto_cancel_arrange_ship_date, escrow_release_time, payby_date, actual_carrier, tracking_number) {
        return '\
        <table class="table table-bordered align-middle mb-0">\
            <tr><td title="状态 | 发货时限">' + Tool.status.a01(list_type, status, cancel_reason_ext, auto_cancel_arrange_ship_date, payby_date, rate_by_date, escrow_release_time) + '</td></tr>\
            <tr><td title="物流渠道">' + actual_carrier + '</td></tr>\
            <tr><td title="包裹号">' + (tracking_number ? tracking_number : "&nbsp;") + '</td></tr>\
        </table>';
    },
    b11: function () {
        let arr = []
        if (o.params.searchword) {
            switch (o.params.field) {
                case "1": arr.push("@.order_sn='" + o.params.searchword + "'"); break;//商品编码
                case "2": arr.push("@.package_number='" + o.params.searchword + "'"); break;//包裹号
                case "3": arr.push("@.purchaseInfo like '%" + o.params.searchword + "%'"); break;//采购订单号
            }
        }
        if (o.params.time != "") {
            switch (o.params.time) {
                case "1": arr.push("@.auto_cancel_arrange_ship_date>" + Tool.gettime("") + " and @.auto_cancel_arrange_ship_date<" + (Tool.gettime("") + 60 * 60 * 24)); break;
                case "2": arr.push("@.auto_cancel_arrange_ship_date>" + Tool.gettime("") + " and @.auto_cancel_arrange_ship_date<" + (Tool.gettime("") + 60 * 60 * 24 * 2)); break;
                case "3": arr.push("@.auto_cancel_arrange_ship_date>" + Tool.gettime("") + " and @.auto_cancel_arrange_ship_date<" + (Tool.gettime("") + 60 * 60 * 24 * 3)); break;
                case "4": arr.push("@.auto_cancel_arrange_ship_date>" + Tool.gettime("")); break;
                case "5": arr.push("@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 2)); break;
                case "6": arr.push("@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 3)); break;
                case "7": arr.push("@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 4)); break;
                case "8": arr.push("@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 5)); break;
                case "9": arr.push("@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 6)); break;
                case "10": arr.push("@.auto_cancel_3pl_ack_date>" + (Tool.gettime("") + 60 * 60 * 24 * 6)); break;
            }
        }
        if (o.params.list_type != "") {
            switch (o.params.list_type) {
                case "├9": arr.push("@.status_ext=9"); break;
                case "├10": arr.push("@.status_ext=10"); break;
                case "└10": arr.push("@.status_ext=10"); break;
                case "├2-2-9": arr.push("@.status=2 and @.status_ext=2 and @.logistics_status=9"); break;
                case "├1-1-1": arr.push("@.status=1 and @.status_ext=1 and @.logistics_status=1"); break;
                case "└2-2-1": arr.push("@.status=2 and @.status_ext=2 and @.logistics_status=1"); break;
                default: arr.push("@.list_type=" + o.params.list_type); break;
            }
        }
        if (o.params.purchaseStatus != "") { arr.push("@.purchaseStatus=" + o.params.purchaseStatus); }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    b12: function (name, list_type, list_typeArr) {
        let optionArr = [], arr = Tool.list_typeArr
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i][0] + '"' + (arr[i][0] == list_type ? 'selected="selected"' : '') + '>' + arr[i][0] + '.' + arr[i][1] + (list_typeArr ? '(' + list_typeArr[i] + ')' : '') + '</option>')
        }
        return '\
        <select onChange="Tool.open(\'list_type\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    b13: function (name, purchaseStatus, configArr) {
        let optionArr = [], arr = Tool.purchaseStatusArr
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i][0] + '"' + (arr[i][0] == purchaseStatus ? 'selected="selected"' : '') + '>' + arr[i][0] + '.' + arr[i][1] + (configArr ? '(' + configArr[i] + ')' : '') + '</option>')
        }
        return '\
        <select onChange=" Tool.open(\'purchaseStatus\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
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
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ o.params.field + '">' + this.b16(o.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">订单编号</li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)">包裹号</a></li>\
                <li class="dropdown-item pointer" onclick="fun.c01(3)">采购订单号</a></li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ o.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
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
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile=js06\');"><a class="dropdown-item pointer">*更新数量</a></li>\
        </ul>'
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
            Tool.main("jsFile=" + o.params.jsFile + "&site=" + o.params.site + "&page=1&field=" + field + "&searchword=" + searchword + "&num=" + o.params.num);
        } else { alert("请输入搜索内容"); }
    },
}
fun.a01();