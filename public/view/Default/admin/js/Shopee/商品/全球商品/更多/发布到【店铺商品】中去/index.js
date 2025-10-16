'use strict';
var fun =
{
    obj:
    {
        ManualReview_1688_categoryId1: "54",//1688的一级类目
        site: "br",//站点
        num: "1",//第几个店铺（从1开始）
        releasesNumber: "0",//发布数量
        /////////////////////////////////////////////
        A1: 1, A2: 0,//商品页进度
        B1: 1, B2: 0, Barr: [],//商品条进度
        seller: {},
        logistics: [],
    },
    a01: function () {
        $("#state").html("正在获得配置参数");
        let data = [{
            action: "sqlite",
            database: "1688/类目/现货类目",
            sql: "select " + Tool.fieldAs("fromid,name") + " FROM @.table where @.upid=0 order by @.sort asc",
        }, {
            action: o.DEFAULT_DB,
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }]
        Tool.ajax.a01(data, this.a02, this);
    },
    a02: function (t) {
        let html = Tool.header(o.params.return, "Shopee &gt; 商品列表 &gt; 全球商品 &gt; 更多 &gt; 发布到【店铺商品】中去") + '\
        <div class="p-2">\
             <table class="table table-hover align-middle mb-0">\
                 <tbody>\
                    <tr><td class="right w200">发布站点：</td><td colspan="2">'+ Tool.common1.b01(t[1][0].config, this.obj.site, this.obj.num) + '</td></tr>\
                    <tr><td class="right">发布前1688类目：</td><td colspan="2">'+ Tool.common1.b02(t[0], this.obj.ManualReview_1688_categoryId1) + '</td></tr>\
                    <tr><td class="right">发布数量：</td><td colspan="2">'+ Tool.common1.b05(this.obj.releasesNumber) + '</td></tr>\
                    <tr><td class="right">操作：</td><td colspan="2"><button type="button" class="btn btn-outline-secondary" onclick="fun.c01($(this))">*开始执行</button></td></tr>\
                    <tr><td class="right">第几个店：</td><td id="num" colspan="2"></td></tr>\
                    <tr><td class="right">参数：</td><td colspan="2" class="p-0" id="parameter"></td></tr>\
                    <tr><td class="right">账号：</td><td colspan="2" id="username"></td></tr>\
                    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                    <tr><td class="right">商品条进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
                    <tr><td class="right">状态：</td><td id="state" colspan="2">正在准备账号...</td></tr>\
                    <tr><td class="right">物流方式：</td><td colspan="5" id="logistics" class="p-0"></td></tr>\
                    <tr><td class="right">不包邮定价：</td><td colspan="2" class="p-0">'+ Tool.common1.b03() + '</td></tr>\
                    <tr><td class="right">发布条件：</td><td colspan="2" class="p-0" id="where"></td></tr>\
                 </tbody>\
                 <tbody id="tbody"></tbody>\
             </table>\
         </div>';
        Tool.html(null, null, html);
    },
    /////////////////////////////////////////////////
    c01: function (This) {
        This.attr("disabled", "disabled");
        $("#siteNum,#ManualReview_1688_categoryId1,#releasesNumber").attr("disabled", "disabled");
        let siteNumArr = $("#siteNum").val().split("|");
        this.obj.site = siteNumArr[0];
        this.obj.num = Tool.int(siteNumArr[1]);
        $("#num").html(this.obj.num);
        this.obj.ManualReview_1688_categoryId1 = $("#ManualReview_1688_categoryId1").val()
        this.obj.releasesNumber = $("#releasesNumber").val()
        this.d01();
    },
    //////////////////////////////////////////////////////
    d01: function () {
        Tool.login.a01(this.d02, this);
    },
    d02: function (seller) {
        this.obj.seller = seller;
        $("#parameter").html(Tool.common1.b04(seller));
        Tool.logistics.a01(this.obj.site, $("#logistics"), this.d03, this);
    },
    d03: function (logistics) {
        this.obj.logistics = logistics;
        this.d04();
    },
    d04: function () {
        $("#state").html("正在获取【全球商品】信息。。。");
        let data = Tool.common1.b06(this.obj.releasesNumber,
            this.obj.ManualReview_1688_categoryId1,
            this.obj.site,
            this.obj.num,
            this.obj.A2)
        Tool.ajax.a01(data, this.d05, this);
    },
    d05: function (t) {
        if (this.obj.A2 == 0) {
            if (t[1]) { this.obj.A2 = Math.ceil(t[1][0].total / 10); } else { this.obj.A2 = 1; }
        }
        this.obj.B2 = t[0].length;
        this.obj.Barr = t[0];
        this.d06()
    },
    d06: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d07, this, this.g02);
    },
    d07: function () {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.e01, this, this.g01);
    },
    /////////////////////////////////////////////////////////////
    e01: function () {
        //在Barr中增加内容
        Tool.common2.a01(
            this.obj.Barr[this.obj.B1 - 1],
            this.obj.logistics,
            this.obj.seller[this.obj.site][this.obj.num - 1],
            $("#tbody"),
            this.e02,
            this
        )
    },
    e02: function (BarrObj) {
        Tool.common3.a01(
            BarrObj,
            this.obj.seller,
            this.obj.site,
            this.obj.num - 1,
            $("#tbody"),
            this.e03,
            this,
            BarrObj.proid
        )
    },
    e03: function (post, proid) {
        Tool.common4.a01(
            post,
            proid,
            this.obj.seller,
            this.obj.site,
            this.obj.num - 1,
            $("#tbody"),
            this.e04,
            this
        )
    },
    e04: function () {
        this.obj.B1++;
        this.d07();
    },
    /////////////////////////////////////////
    g01: function () {
        $("#state").html("该页发布完成。");
        this.obj.B1 = 1; this.obj.B2 = 0; this.obj.Barr = [];
        $("#B1").html("0%").css("width", "0%");
        $("#B2").html("");
        this.obj.A1++;
        this.d04();
    },
    g02: function () {
        this.obj.A1 = 1; this.obj.A2 = 0;
        $("#state").html("全部完成。");
    },
}
fun.a01();