'use strict';
var fun =
{
    //说明：只要报名成功，商品将：不能下架，不能删除，不能改价，部分可以修改，只能等活动结束，才有所有权。
    obj:
    {
        D1: 1, D2: 0, Darr: [],
        E1: 1, E2: 0, Earr: [],
        seller: {},
    },
    a01: function () {
        //o.params.return             返回URL
        //o.params.site               站点
        let html = Tool.header(o.params.return, "Shopee &gt; 营销中心 &gt; 我的活动 &gt; 删除【尚未提交】商品") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle">\
                <tbody>\
                    <tr><td class="w200 right">站点：</td><td colspan="2">'+ Tool.site(o.params.site) + '</td></tr>\
                    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
                    <tr><td class="right">活动进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
                    <tr><td class="right">活动类型：</td><td id="campaign_scene" colspan="2"></td></tr>\
                    <tr><td class="right">活动名称：</td><td id="name" colspan="2"></td></tr>\
                    <tr><td class="right">活动介绍：</td><td id="description" colspan="2"></td></tr>\
                    <tr><td class="right">活动时间：</td><td id="time" colspan="2"></td></tr>\
                    <tr><td class="right">报名情况：</td><td id="RegistrationStatus" colspan="2"></td></tr>\
                    <tr><td class="right">子活动进度：</td>'+ Tool.htmlProgress('E') + '</tr>\
                    <tr><td class="right">子活动名称：</td><td id="name2" colspan="2"></td></tr>\
                    <tr><td class="right">子活动介绍：</td><td id="description2" colspan="2"></td></tr>\
                    <tr><td class="right">子活动活动报名时间：</td><td id="nomination_time" colspan="2"></td></tr>\
                    <tr><td class="right">子活动活动进行时间：</td><td id="session_time" colspan="2"></td></tr>\
                    <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
                </tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (seller) {
        this.obj.seller = seller;
        $("#state").html("正在获取可报名活动个数。。。");
        Tool.common2.a01(seller, o.params.site, Tool.int(o.params.num) - 1, this.a04, this)
    },
    a04: function (t) {
        this.obj.D2 = t.D2; this.obj.Darr = t.Darr;
        this.d01();
    },
    ////////////////////////////////////////
    d01: function () {
        Tool.x1x2("D", this.obj.D1, this.obj.D2, this.d02, this, null);
    },
    d02: function () {
        let o1 = this.obj.Darr[this.obj.D1 - 1]
        $("#name").html(o1.name)
        $("#description").html('<textarea rows="4" class="form-control" disabled>' + o1.description + "</textarea>")
        $("#time").html(Tool.js_date_time2(o1.start_time) + " 至 " + Tool.js_date_time2(o1.end_time));
        $("#RegistrationStatus").html('<span class="p-2">可报名：' + o1.session_statistics.available_session_num + '</span><span class="p-2">已报名：' + o1.session_statistics.nominated_session_num + '<span>');
        $("#state").html("正在进入子活动报名页面。。。");
        if (o1.campaign_scene_str == "CAMPAIGN_SCENE_BIG_CAMPAIGN") {
            $("#campaign_scene").html("商品活动");
            Tool.common3.a01(this.obj.seller, o.params.site, Tool.int(o.params.num) - 1, o1.id, this.d03, this);
        }
        else if (o1.campaign_scene_str == "CAMPAIGN_SCENE_NORMAL_VOUCHER_CAMPAIGN") {
            $("#campaign_scene").html("优惠券活动");
            this.e02()
        }
        else {
            Tool.pre(["未知活动类型", o1]);
        }
    },
    d03: function (t) {
        this.obj.E2 = t.E2; this.obj.Earr = t.Earr;
        this.d04();
    },
    d04: function () {
        Tool.x1x2("E", this.obj.E1, this.obj.E2, this.d05, this, this.e02);
    },
    d05: function () {
        let o1 = this.obj.Earr[this.obj.E1 - 1];
        $("#name2").html(o1.session_name);
        $("#description2").html('<textarea rows="4" class="form-control" disabled>' + o1.description + "</textarea>")
        $("#session_time").html(Tool.js_date_time2(o1.session_start_time) + " 至 " + Tool.js_date_time2(o1.session_end_time));
        $("#nomination_time").html(Tool.js_date_time2(o1.nomination_start_time) + " 至 " + Tool.js_date_time2(o1.nomination_end_time));
        this.d06(o1.session_id);
    },
    d06: function (session_id) {
        $("#state").html("正在获取【尚未提交的商品】，用来删除。");
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[o.params.site][Tool.int(o.params.num) - 1].shopId,
            "cbsc_shop_region=" + o.params.site
        ]
        let url = "https://seller.shopee.cn/api/mkt/cmt/preview/preview_list?" + arr.join("&")
        let data = { "session_id": session_id, "entity_type": [2] }
        gg.postFetch(url, JSON.stringify(data), this.d07, this);
    },
    d07: function (t) {
        if (t.data.entity_list_data) {
            let nomination_ids = [], arr = t.data.entity_list_data.recruiting_entities;
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].product.models.length; j++) {
                    nomination_ids.push(arr[i].product.models[j].nomination_id)
                }
            }
            if (nomination_ids.length == 0) {
                this.e01()
            }
            else {
                this.f01(t.preview_no, nomination_ids)//正在删除【尚未提交的商品】。
            }
        }
        else {
            this.e01()
        }
    },
    //////////////////////////////
    e01: function () {
        this.obj.E1++;
        this.d04();
    },
    e02: function () {
        this.obj.D1++;
        this.obj.E1 = 1; this.obj.E2 = 0; this.obj.Earr = [];
        $("#E1").css("width", "0%")
        $("#E1,#E2").html("");
        this.d01();
    },
    ////////////////////////////////////////
    f01: function (preview_no, nomination_ids) {
        let data = {
            "session_id": this.obj.Earr[this.obj.E1 - 1].session_id,
            "preview_no": preview_no,
            "nomination_ids": nomination_ids
        }
        $("#state").html("正在删除【尚未提交的商品】。");
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[o.params.site][Tool.int(o.params.num) - 1].shopId,
            "cbsc_shop_region=" + o.params.site
        ]
        let url = "https://seller.shopee.cn/api/mkt/cmt/preview/delete?" + arr.join("&")
        gg.postFetch(url, JSON.stringify(data), this.f02, this);
    },
    f02: function (t) {
        /*
        {
          "code": 0,
          "data": null,
          "msg": null
        }
        */
        if (t.code == 0) {
            this.e01();
        }
        else {
            Tool.pre(["出错06", t])
        }
    },
}
fun.a01();