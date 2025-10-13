'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,// 页进度
        seller: {},
        siteNum: null,
    },
    a01: function () {
        let html = Tool.header(o.params.return, "Shopee &gt; 营销中心 &gt; 优惠券 &gt; 状态 &gt; 结束") + '\
        <div class="p-2">\
        <table class="table table-hover">\
            <tbody>\
                <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
                <tr><td class="right">条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                <tr><td class="right">优惠券名称：</td><td id="name" colspan="2"></td></tr>\
                <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
                <tr><td class="right">说明：</td><td colspan="2">注：【关注礼优惠券】不能马上结束，要等时间过了（7天）自动结束。（这是shopee规定的）</td></tr>\
            </tbody>\
        </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (t) {
        this.obj.seller = t
        this.obj.siteNum = Tool.siteNum(o.params.site, o.params.num);
        this.a04();
    },
    a04: function () {
        let where = " where @.fe_status=" + o.params.status
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/优惠券/" + this.obj.siteNum,
            sql: "select " + Tool.fieldAs("voucher_id,name") + " FROM @.table" + where,
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/营销中心/优惠券/" + this.obj.siteNum,
                sql: "select count(1) as count FROM @.table" + where,
            })
        }
        $("#state").html("正在获取商品信息。。。");
        Tool.ajax.a01(data, this.a05, this);
    },
    a05: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].count; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d01, this, null, t[0])
    },
    ///////////////////////////////////////
    d01: function (t) {
        $("#name").html(t[0].name);
        if (t[0].name.indexOf("关注礼") != -1) {
            //注：【关注礼优惠券】不能马上结束，要等时间过了（7天）自动结束。（这是shopee规定的）
            //当我操作结束时，shopee会给我一个7天的结束时间。
            this.e01(t[0].voucher_id);
        }
        else {
            this.d02(t[0].voucher_id);
        }
    },
    d02: function (voucher_id) {
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[o.params.site][Tool.int(o.params.num) - 1].shopId,
            "cbsc_shop_region=" + o.params.site
        ]
        let url = "https://seller.shopee.cn/api/marketing/v3/voucher/stop/?" + arr.join("&")
        let data = '{"voucher_id":' + voucher_id + '}'
        $("#url").html(url + '【PUT】');
        $("#state").html("正在结束。。。");
        gg.typeFetch(url, "PUT", data, this.d03, this, voucher_id)
    },
    d03: function (t, voucher_id) {
        if (t.message == "success") {
            $("#state").html("结束成功。");
            this.d04(voucher_id, "@.fe_status=3")
        }
        else if (t.message == "ERROR_PARAM" || t.message == "ERROR_VOUCHER_NO_EDIT_PERMISSION") {
            $("#state").html("已经结束过了。");
            this.d04(voucher_id, "@.fe_status=3")
        }
        else {
            Tool.pre(["出错2025/10/10", t])
        }
    },
    d04: function (voucher_id, str) {
        //@.fe_status=3     已过期
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/优惠券/" + this.obj.siteNum,
            sql: "update @.table set " + str + " where @.voucher_id=" + voucher_id,
        }]
        Tool.ajax.a01(data, this.d05, this);
    },
    d05: function (t) {
        this.obj.A1++;
        this.a04();
    },
    ////////////////////////////////////////////////////////
    e01: function (voucher_id) {
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[o.params.site][Tool.int(o.params.num) - 1].shopId,
            "cbsc_shop_region=" + o.params.site
        ]
        let url = "https://seller.shopee.cn/api/marketing/v4/follow_prize/get_campaignids_by_promotionids/?" + arr.join("&")
        let data = '{"promotion_ids":[' + voucher_id + ']}'
        gg.postFetch(url, data, this.e02, this, voucher_id)
    },
    e02: function (t, voucher_id) {
        if (t.message == "success") {
            this.e03(t.data.campaign_lites[0].campaign_id, voucher_id)
        }
        else {
            Tool.pre(["出错", t])
        }
    },
    e03: function (campaign_id, voucher_id) {
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[o.params.site][Tool.int(o.params.num) - 1].shopId,
            "cbsc_shop_region=" + o.params.site
        ]
        let url = "https://seller.shopee.cn/api/marketing/v4/follow_prize/operation/?" + arr.join("&")
        let data = '{"action":"stop","campaign_id":' + campaign_id + '}'
        $("#url").html(url + '【post】');
        $("#state").html("正在结束关注礼。。。");
        gg.postFetch(url, data, this.e04, this, voucher_id)
    },
    e04: function (t, voucher_id) {
        if (t.message == "success") {
            $("#state").html("结束关注礼成功。（注：这里的意思是结束时间改到7天后。）");
            this.d04(voucher_id, "@.fe_status=0,@.end_time=" + (Tool.gettime("") + 60 * 60 * 24 * 7))
        }
        else {
            Tool.pre(["出错001", t])
        }
    },
}
fun.a01();