'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
    },
    a01: function () {
        //o.params.return         返回URL  
        let html = Tool.header(o.params.return, "Shopee &gt; 客优云 &gt; 包裹管理 &gt; 把1688运单号同步过来") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr>\
                <td class="w150 right">说明：</td>\
                <td colspan="2">\
                    (1)只同步【Shopee &gt; 客优云 &gt; 包裹管理 &gt; 待收货】的运单号。<hr/>\
                    (2)第一页有【交易成功】或【交易关闭】的商品不同步。（例如：【1688PLUS会员月卡】【退款成功】就没有运单号。）<hr/>\
                    (3)操作顺序：先获取【shopee/客优云/包裹管理】待收货的订单，已知订单号找【1688/买家订单】对应的物流单号，\
                </td>\
            </tr>\
		    <tr><td class="right">1688账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">客优云包裹条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">1688订单号进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		    <tr><td class="right">shopee站点：</td><td id="siteNum" colspan="2"></td></tr>\
		    <tr><td class="right">shopee订单编号：</td><td id="ordersn" colspan="2"></td></tr>\
		    <tr><td class="right">shopee包裹号：</td><td id="packageId" colspan="2"></td></tr>\
		    <tr><td class="right">客优云运单信息：</td><td id="expressInfos" colspan="2"></td></tr>\
		    <tr><td class="right">客优云卖家备注：</td><td id="packageCommentList" colspan="2"></td></tr>\
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
        //where = " where @.ordersn='250326JT7KPCD1'"
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select " + Tool.fieldAs("nodeCode,ordersn,expressInfos,packageId,packageCommentList") + " FROM @.table" + where + Tool.limit(1, this.obj.A1, "sqlite"),
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/客优云/包裹管理",
                sql: "select count(1) as count FROM @.table" + where,
            });
        }
        $("#state").html("正在获取本地【shopee/客优云/包裹管理】信息。");
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].count; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a05, this, null, t[0]);
    },
    a05: function (t) {
        $("#ordersn").html(t[0].ordersn)
        $("#packageId").html(t[0].packageId)
        $("#expressInfos").html(t[0].expressInfos)
        t[0].packageCommentList = this.b01(t[0].packageCommentList);//Tool.common2.a01()还要用
        $("#packageCommentList").html(t[0].packageCommentList);
        $("#state").html("正在从1688中找出第几个站点。。。");
        let data = [{
            action: "sqlite",
            database: "1688/买家订单",
            sql: "select " + Tool.fieldAs("shopee_site,shopee_order_sn,WaybillNumber,orderid,status,items") + " FROM @.table where @.shopee_order_sn like '%\"" + t[0].ordersn + "\"%'",
        }]
        Tool.ajax.a01(data, this.a06, this, t[0]);
    },
    a06: function (t, keyouyun) {
        if (t[0].length == 0) {
            Tool.at("1688没有这个订单。");
        }
        else {
            Tool.common1.a01(t[0], keyouyun, this.a07, this);
        }
    },
    a07: function (oo) {
        Tool.common2.a01(oo, this.a08, this);
    },
    a08: function () {
        this.obj.A1++;
        $("#B1").css("width", "0%");
        $("#B1,#B2,#nodeCode,#ordersn,#packageId,#expressInfos,#packageCommentList,#url").html('')
        this.a03();
    },
    /////////////////////////////////////
    b01: function (packageCommentList) {
        let comment = ""
        let arr = JSON.parse(packageCommentList)
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].login == "574754058@qq.com" && arr[i].comment) {
                comment = arr[i].comment;
                break;
            }
        }
        return comment;
    },
}
fun.a01();