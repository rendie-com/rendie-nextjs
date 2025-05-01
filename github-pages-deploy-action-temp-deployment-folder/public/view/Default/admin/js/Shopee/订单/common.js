Object.assign(Tool, {
    header2: function (jsFile, site) {
        let html = '\
            <header class="panel-heading">\
              <div onclick="Tool.main(\'?jsFile=&site=' + site + '\')"' + (!jsFile ? ' class="active"' : '') + '>订单管理</div>\
              <div onclick="Tool.main(\'?jsFile=js07&site=' + site + '\')"' + (jsFile == "js07" ? ' class="active"' : '') + '>发货预报</div>\
            </header>'
        return html;
    },
    //选出SIP店铺对应的主站点
    sip: function (site) {
        switch (site) {
            case "th":
            case "th":
            case "vn": site = 'tw'; break;
            case "co":
            case "cl":
                site = 'br'; break;
        }
        return site;
    },
    binding: function (jsFile, site, binding_status) {
        let html = '\
       <ul class="makeHtmlTab" style="padding-left:25px;">\
            <li'+ (binding_status == "0" ? ' class="hover"' : '') + ' onclick="Tool.main(\'?jsFile=' + jsFile + '&site=' + site + '&binding_status=0\')">未绑定订单</li>\
            <li'+ (binding_status == "3" ? ' class="hover"' : '') + ' onclick="Tool.main(\'?jsFile=' + jsFile + '&site=' + site + '&binding_status=3\')">已绑定订单</li>\
        </ul>'
        return html;
    },
    //状态 | 发货时限
    status: {
        a01: function (list_type, status, cancel_reason_ext, auto_cancel_arrange_ship_date, payby_date, rate_by_date, escrow_release_time) {
            //已出货<br/><font color="#8c8c8c">等待买家在' + Tool.js_date_time2(escrow_release_time) + '前点选完成订单</font>
            let str = "";
            switch (list_type) {
                case 3:
                    switch (status) {
                        case "2-2-5":
                        case "4-15-5": str = '已送达<br/><font color="#8c8c8c">订单已送达。拨款金额将在订单完成后入账。</font>'; break;
                        case "4-10-5": str = '已完成<br/><font color="#8c8c8c">部分退货退款</font>'; break;//巴西（2412307QBA9A1Q）
                        case "4-10-6": str = '已完成<br/><font color="#8c8c8c">亏钱</font>'; break;//巴西（241201MMTAKXEN）
                        case "4-11-5":
                            if (Tool.gettime("") > rate_by_date) { str = '已完成'; } else { str = '已收到订单<br/><font color="#8c8c8c"> 拨款金额已入账，但买家可于' + Tool.js_date_time2(rate_by_date) + '前提出退货/退款申请。 </font>'; }
                            break;
                        default: str = "<font color=red>未知status：" + status + "</font>"; break;
                    }
                    break;
                case 4: str = '已取消<br/>' + this.b01(cancel_reason_ext); break;
                case 7:
                    switch (status) {
                        case "1-1-9":
                        case "2-2-9": str = '待出货<br/><font color="#8c8c8c">为了避免延迟出货，请在' + Tool.js_date_time2(auto_cancel_arrange_ship_date) + '前出货。</font>'; break;
                        case "2-2-1":
                        case "1-1-1": str = '待出货<br/><font color="#8c8c8c">等待快递员确认发货。</font>'; break;
                        case "2-16-9": str = '待取消'; break;
                        default: str = "<font color=red>未知status：" + status + "</font>"; break;
                    }
                    break;
                case 8:
                    switch (status) {
                        case "1-1-2":
                        case "2-2-2": str = '已出货<br/><font color="#8c8c8c">订单正在运送给买家。</font>'; break;
                        case "2-2-5": str = '已送达<br/><font color="#8c8c8c">订单已送达。拨款金额将在订单完成后入账。</font>'; break;
                        case "2-9-2": str = '已出货<br/><font color="#8c8c8c">买家提出了退货/退款申请。拨款金额将在退货/退款完成后入账。</font>'; break;
                        default: str = "<font color=red>未知status：" + status + "</font>"; break;
                    }
                    break;
                case 9: str = '尚未付款<br/><font color="#8c8c8c">在' + Tool.js_date_time2(payby_date) + '前完成付款</font>'; break;
                default: str = "<font color=red>未知list_type：" + list_type + "</font>"; break;
            }
            return "(" + list_type + "-" + status + ")" + str;
        },
        b01: function (cancel_reason_ext) {
            let str = "";
            switch (cancel_reason_ext) {
                case 701: str = '<font color="#8c8c8c">已被系统自动取消订单<br/>取消原因:订单因买家未按时完成 EZ WAY 实名认证而取消</font>'; break;
                case 506: str = '<font color="#8c8c8c">已被买家取消<br/>取消原因:不想购买了</font>'; break;
                case 3: str = '<font color="#8c8c8c">已被买家取消<br/>取消原因:修改现有内容(例如:颜色、尺寸、地址、优惠卷...)</font>'; break;
                case 100: str = '<font color="#8c8c8c">已被系统自动取消订单<br/>取消原因: 因为买家未能及时完成付款，系统已自动取消此笔订单。</font>'; break;
                case 505: str = '<font color="#8c8c8c">已被买家取消<br/>取消原因:在别处找到更便宜的</font>'; break;
                case 502: str = '<font color="#8c8c8c">已被买家取消<br/>取消原因:需要输入/更换优惠券代码</font>'; break;
                case 507: str = '<font color="#8c8c8c">已被买家取消<br/>取消原因:其他</font>'; break;
                case 503: str = '<font color="#8c8c8c">已被买家取消<br/>取消原因:需要修改订单(例如:尺寸，颜色，数量等等)</font>'; break;
                case 9: str = '<font color="#8c8c8c">已被买家取消<br/>取消原因:其他/改变主意</font>'; break;
                case 504: str = '<font color="#8c8c8c">已被买家取消<br/>取消原因:付款程序太麻烦了</font>'; break;
                case 205: str = '<font color="red">已被系统自动取消订单<br/>取消原因: 已被Shopee仓库取消</font>'; break;
                case 302: str = '<font color="red">已被系统自动取消订单<br/>取消原因: 卖家没在期限内出货</font>'; break;
                case 303: str = '<font color="red">已被买家取消<br/>取消原因:订单未在截止日期之前运送至中转仓库。</font>'; break;
                case 204: str = '<font color="red">已被系统自动取消订单<br/>取消原因:卖家未按时安排出货。</font>'; break;
                case 202: str = '<font color="red">已被系统自动取消订单<br/>取消原因:运送失败</font>'; break;
                default: str = "<font color=red>未知取消原因：" + cancel_reason_ext + "</font>"; break;
            }
            return str;
        }
    },
    timeArr: [
        ["1", "发货时间<1天"],
        ["2", "发货时间<2天"],
        ["3", "发货时间<3天"],
        ["4", "发货时间>3天"],
        ["5", "扫描时间<2天"],
        ["6", "扫描时间<3天"],
        ["7", "扫描时间<4天"],
        ["8", "扫描时间<5天"],
        ["9", "扫描时间<6天"],
        ["10", "扫描时间>6天"],
    ],
    list_typeArr: [
        ["3", "已完成"],
        ["├9", "退货/退款——待回应"],
        ["├9", "退货/退款——已回应"],
        ["└10", "退货/退款——已完成"],
        ["4", "已取消"],
        ["7", "待出货"],
        ["├2-2-9", "待处理出货"],
        ["├1-1-1", "已处理出货1"],
        ["└2-2-1", "已处理出货2"],
        ["8", "运送中"],
        ["9", "尚未付款"],
    ],
    purchaseStatusArr: [
        ["0", "待处理"],
        ["1", "待采购"],
        ["2", "采购待付款"],
        ["3", "采购已付款"],
        ["4", "采购退款中"],
        ["5", "采购取消"],
        ["6", "采购已付款(问题订单)"],
        ["7", "采购退款完成"],
        ["8", "采购退款失败"],
    ],
    login_1688:
    {
        a01: function (next, This, t) {
            let oo = {
                next: next,
                This: This,
                t: t
            }
            gg.isRD(this.a02, this, oo);
        },
        a02: function (t, oo) {
            $("#state").html("正在获得配置参数");
            let data = [{
                action: "sqlite",
                database: "1688/买家账户",
                sql: "select " + Tool.fieldAs("username,password,cookies") + " FROM @.table order by @.sort asc limit 1",
            }]
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            oo.username = t[0][0].username
            Tool.login1688.a01(t[0][0].username, t[0][0].password, t[0][0].cookies, $("#state"), this.a04, this, oo)
        },
        a04: function (isTab, oo) {
            Tool.apply(isTab, oo.next, oo.This, oo.t);
        },
    },
})