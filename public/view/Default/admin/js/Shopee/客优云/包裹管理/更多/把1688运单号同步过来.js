'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        B1: 1, B2: 0, Barr: [],
    },
    a01: function () {
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 客优云 &gt; 包裹管理 &gt; 把1688运单号同步过来") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr>\
                <td class="w150 right">说明：</td>\
                <td colspan="2">\
                    (1)只同步【Shopee &gt; 客优云 &gt; 包裹管理 &gt; 待收货】的运单号。<hr/>\
                    (2)第一页有【交易成功】或【交易关闭】的商品不同步。（例如：【1688PLUS会员月卡】【退款成功】就没有运单号。）\
                </td>\
            </tr>\
		    <tr><td class="right">1688账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">客优云包裹条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">1688订单号进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		    <tr><td class="right">shopee站点：</td><td id="nodeCode" colspan="2"></td></tr>\
		    <tr><td class="right">shopee订单编号：</td><td id="ordersn" colspan="2"></td></tr>\
		    <tr><td class="right">shopee包裹号：</td><td id="packageId" colspan="2"></td></tr>\
		    <tr><td class="right">客优云运单信息：</td><td id="expressInfos" colspan="2"></td></tr>\
		    <tr><td class="right">客优云备注：</td><td id="packageComment" colspan="2"></td></tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        //这里不登陆客优云账号了，因为在“获取包裹信息”就已经登陆了。
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login_1688.a01(this.a03, this);
    },
    a03: function () {
        let where = " where @.statusName='待收货'"
        //where = " where @.ordersn='250204AQPFS7GN'"
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select " + Tool.fieldAs("ordersn,expressInfos,packageId,nodeCode,packageComment") + " FROM @.table" + where + Tool.limit(1, this.obj.A1, "sqlite"),
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/客优云/包裹管理",
                sql: "select count(1) as count FROM @.table" + where,
            })
        }
        $("#state").html("正在获取本地【shopee/客优云/包裹管理】信息。");
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].count; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d01, this, null, t[0]);
    },
    /////////////////////////////////////
    b01: function (packageComment) {
        let comment = ""
        if (packageComment) {
            let oo = JSON.parse(packageComment)
            if (oo.comment) {
                comment = oo.comment
            }
        }
        return comment;
    },
    //////////////////////////////////////
    b02: function (t) {
        let tbody = Tool.StrSlice(t, '<tbody>', '</tbody>');
        let arr = tbody.split("\n        \t\t\t                 </tr>"), isBool = false;
        for (let i = 0; i < arr.length - 1; i++) {
            let tempArr = Tool.regSplits(arr[i], '\n        \t         <td>', '</td>');
            if ("未发货" == Tool.Trim(tempArr[3].split('<br/>')[0])) {
                isBool = true; break;
            }
        }
        return isBool
    },
    ///////////////////////////////////
    d01: function (t) {
        $("#nodeCode").html(t[0].nodeCode)
        $("#ordersn").html(t[0].ordersn)
        $("#packageId").html(t[0].packageId)
        $("#expressInfos").html(t[0].expressInfos)
        t[0].packageComment = this.b01(t[0].packageComment);
        $("#packageComment").html(t[0].packageComment);
        let data = [{
            action: "sqlite",
            database: "shopee/订单/订单管理/" + t[0].nodeCode.toLowerCase(),
            sql: "select " + Tool.fieldAs("purchaseInfo") + " FROM @.table where @.order_sn='" + t[0].ordersn + "' limit 1",
        }]
        $("#state").html("正在获取【客优云包裹】对应的采购信息。");
        Tool.ajax.a01(data, this.d02, this, t[0]);
    },
    d02: function (t, oo) {
        if (t[0][0].purchaseInfo) {
            this.obj.Barr = JSON.parse(t[0][0].purchaseInfo);
            this.obj.B2 = this.obj.Barr.length;
            this.d03(oo)
        }
        else {
            Tool.at("这个订单的采购信息没有填写。")
        }
    },
    d03: function (oo) {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d04, this, this.e01, oo);
    },
    d04: function (oo) {
        let url = "https://trade.1688.com/order/new_step_order_detail.htm?orderId=" + this.obj.Barr[this.obj.B1 - 1].orderid
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在获取在线【1688】采购信息。");
        gg.getFetch(url, "gbk", this.d05, this, oo)
    },
    d05: function (t, oo) {
        if (t.indexOf("/_____tmd_____/punish?") != -1) {
            Tool.at("操作太频繁请稍后再试");
        }
        else {
            let WaybillNumber = Tool.StrSlice(t, '运单号码：</dt>\n\t\t\t\t\t\t<dd class=\"info-item-val\">', '</dd>');//运单号码
            WaybillNumber = WaybillNumber ? Tool.Trim(WaybillNumber) : "";
            oo.status = Tool.StrSlice(t, '<em class="stress">', '</em>');
            oo.itemsIsBool = this.b02(t);//是否有“未发货”的商品。
            if (WaybillNumber) {
                this.d06(WaybillNumber, oo)
            }
            else {
                $("#state").html("1688还没发货");
                this.d09("", oo)
            }
        }
    },
    d06: function (WaybillNumber, oo) {
        if (oo.expressInfos.indexOf('"' + WaybillNumber + '"') != -1) {
            $("#state").html("1688还发货了，且客优云也发货了。");
            this.d09("", oo);
        }
        else {
            this.d07(WaybillNumber, oo)
        }
    },
    d07: function (WaybillNumber, oo) {
        let url = "https://api.keyouyun.com/jax/api/package/add/package/express"
        let data = {
            "packageId": oo.packageId,
            "ordersn": oo.ordersn,
            "newNo": WaybillNumber
        }
        //////////保存要用///////////////////
        oo.expressInfos = JSON.parse(oo.expressInfos);
        oo.expressInfos.push({ "number": WaybillNumber, "received": false })
        ////////////////////////////////////
        gg.postFetch(url, JSON.stringify(data), this.d08, this, oo)
    },
    d08: function (t, oo) {
        if (t === true) {
            oo.expressInfos = JSON.stringify(oo.expressInfos);//oo.expressInfos下次不要用
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/包裹管理",
                sql: "update @.table set @.expressInfos=" + Tool.rpsql(oo.expressInfos) + "  where  @.nodeCode='" + oo.nodeCode + "' and @.packageId='" + oo.packageId + "'",
            }]
            Tool.ajax.a01(data, this.d09, this, oo);
        }
        else {
            Tool.at("在客优云添加运单号失败。")
        }
    },
    d09: function (t, oo) {
        if (t) {
            Tool.pre("可以停一下。")
        }
        else {
            this.obj.B1++
            this.d03(oo);
        }
    },
    //////////////////////////////////////////////////////////////////////////////////
    e01: function (oo) {
        if (oo.status == "交易已成功" || oo.status == "交易关闭") {
            this.obj.B2--;//(2)第一页有【交易成功】或【交易关闭】的商品不同步。（例如：【1688PLUS会员月卡】【退款成功】就没有运单号。）
        }
        if (this.obj.B2 > 1) {
            $("#state").html("一个shopee订单编号，而1688有多个快递单号，需要【包裹备注】。");
            this.e02(oo)
        }
        else {
            $("#state").html("去删除【000】运单号。");
            this.f01(oo);
        }
    },
    e02: function (oo) {
        let comment = "【要来" + this.obj.B2 + "个包裹】"
        if (oo.packageComment.indexOf(comment) == -1) {
            let url = "https://api.keyouyun.com/jax/api/package/comment"
            let data = { "packageId": oo.packageId, "comment": oo.packageComment + comment, "imgs": "" }
            gg.typeFetch(url, "PUT", JSON.stringify(data), this.e03, this, oo)
        }
        else {
            $("#state").html("已经有【包裹备注】了。");
            this.f01(oo);
        }
    },
    e03: function (t, oo) {
        if (t === true) {
            let packageComment = {
                comment: oo.packageComment + "【要来" + this.obj.B2 + "个包裹】"
            }
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/包裹管理",
                sql: "update @.table set @.packageComment=" + Tool.rpsql(JSON.stringify(packageComment)) + "  where  @.nodeCode='" + oo.nodeCode + "' and @.packageId='" + oo.packageId + "'",
            }]
            Tool.ajax.a01(data, this.e04, this, oo);
        }
        else {
            Tool.pre("包裹备注失败。")
        }
    },
    e04: function (t, oo) {
        this.f01(oo);
    },
    //////////////////////////////////////////////////////////////////////////////////
    f01: function (oo) {
        oo.expressInfos = JSON.parse(oo.expressInfos);
        //客优云运单数 > 实际运单数
        if (oo.expressInfos.length > this.obj.B2) {
            if (oo.itemsIsBool) {
                //是否有“未发货”的商品（true表示有），有的话就，备注，还不用删除【000】运单号。
                this.g01(oo)
            }
            else {
                //找不到【部分已发货】就删除【000】运单号。
                if (oo.packageComment.indexOf('【部分已发货】') == -1) {
                    //删除【000】运单号
                    this.f02(oo)
                }
                else {
                    $("#state").html("不用删除客优云的【000】运单号");
                    this.f04()
                }
            }
        }
        else {
            $("#state").html("不用删除客优云的【000】运单号");
            this.f04()
        }

    },
    f02: function (oo) {
        let url = "https://api.keyouyun.com/jax/api/package/express"
        let data = { "expressNum": "000", "packageId": oo.packageId }
        gg.typeFetch(url, "DELETE", JSON.stringify(data), this.f03, this, oo);
    },
    f03: function (t, oo) {
        if (t === true) {
            let arr = []
            for (let i = 0; i < oo.expressInfos.length; i++) {
                if (oo.expressInfos[i].number != "000") {
                    arr.push(oo.expressInfos[i])
                }
            }
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/包裹管理",
                sql: "update @.table set @.expressInfos=" + Tool.rpsql(JSON.stringify(arr)) + "  where  @.nodeCode='" + oo.nodeCode + "' and @.packageId='" + oo.packageId + "'",
            }]
            Tool.ajax.a01(data, this.f04, this);
        }
        else {
            Tool.at("删除运单号【000】失败。")
        }
    },
    f04: function () {
        this.obj.A1++;
        this.obj.B1 = 1; this.obj.B2 = 0; this.obj.Barr = [];
        $("#B1").css("width", "0%");
        $("#B1,#B2,#nodeCode,#ordersn,#packageId,#expressInfos,#packageComment,#url").html('')
        this.a03();
    },
    ///////////////////有“未发货”的商品（true表示有），有的话就，备注，还不用删除【000】运单号。////////////////////////////////////////////////////////////////
    g01: function (oo) {
        let comment = "【部分已发货】"
        if (oo.packageComment.indexOf(comment) == -1) {
            let url = "https://api.keyouyun.com/jax/api/package/comment"
            let data = { "packageId": oo.packageId, "comment": oo.packageComment + comment, "imgs": "" }
            gg.typeFetch(url, "PUT", JSON.stringify(data), this.g02, this, oo)
        }
        else {
            $("#state").html("已经有【包裹备注】了。2025.2.6");
            this.f04();
        }
    },
    g02: function (t, oo) {
        if (t === true) {
            let packageComment = {
                comment: oo.packageComment + "【部分已发货】"
            }
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/包裹管理",
                sql: "update @.table set @.packageComment=" + Tool.rpsql(JSON.stringify(packageComment)) + "  where  @.nodeCode='" + oo.nodeCode + "' and @.packageId='" + oo.packageId + "'",
            }]
            Tool.ajax.a01(data, this.f04, this);
        }
        else {
            Tool.pre("包裹备注失败。")
        }
    },
}
fun.a01();