'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,// 页进度
        seller: {},
        siteNum: Tool.siteNum(o.params.site, o.params.num),
    },
    a01: function () {
        //o.params.return
        //o.params.status
        //o.params.site
        let html = Tool.header(o.params.return, "Shopee &gt; 营销中心 &gt; 加购优惠 &gt; 状态_删除") + '\
        <div class="p-2">\
        <table class="table table-hover">\
            <tbody>\
                <tr><td class="w150 right">站点：</td><td colspan="2">'+ Tool.site(o.params.site) + '</td></tr>\
 		        <tr><td class="right">第几个店铺：</td><td colspan="2">'+ o.params.num + '</td></tr>\
                <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
                <tr><td class="right">条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
            </tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (t) {
        this.obj.seller = t;
        this.d01();
    },
    /////////////////////
    d01: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/加购优惠/" + this.obj.siteNum,
            sql: "select @.add_on_deal_id as add_on_deal_id from @.table where @.status=" + o.params.status + " limit 1",
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/营销中心/加购优惠/" + this.obj.siteNum,
                sql: "select count(1) as count from @.table where @.status=" + o.params.status
            })
        }
        $("#state").html("正在获取信息。。。");
        Tool.ajax.a01(data, this.d02, this);
    },
    d02: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].count; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d03, this, null, t[0])
    },
    d03: function (t2) {
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[o.params.site][Tool.int(o.params.num) - 1].shopId,
            "cbsc_shop_region=" + o.params.site
        ]
        let url = "https://seller.shopee.cn/api/marketing/v3/add_on_deal/operation/?" + arr.join("&")
        let data = {
            "add_on_deal_id": t2[0].add_on_deal_id,
            "action": 1
        }
        $("#state").html("正在删除。。。");
        gg.postFetch(url, JSON.stringify(data), this.d04, this, t2[0].add_on_deal_id)
    },
    d04: function (t, add_on_deal_id) {
        if (t.code == 0) {
            $("#state").html("删除成功。");
            this.d05(add_on_deal_id)
        }
        else if (t.message == "add-on deal not exists") {
            $("#state").html("这个已经删除过了。");
            this.d05(add_on_deal_id)
        }
        else {
            Tool.pre(["出错222", t])
        }
    },
    d05: function (add_on_deal_id) {
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/加购优惠/" + this.obj.siteNum,
            sql: "delete from @.table where @.add_on_deal_id=" + add_on_deal_id
        }]
        Tool.ajax.a01(data, this.d06, this);
    },
    d06: function () {
        this.obj.A1++;
        this.d01();
    },
}
fun.a01();