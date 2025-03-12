'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0, Aarr: [],
        B1: 1, B2: 2, Barr: [
            "banned",//已禁卖
            "deleted",//Shopee删除
        ],
        C1: 1, C2: 0,
    },
    a01: function () {
        //obj.params.return         返回URL
        let html = Tool.header(obj.params.return, "Shopee &gt; 商品 &gt; 违规或删除 &gt; 获取【违规或删除】信息") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle mb-0">\
                <tbody>\
                <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
                <tr><td class="right">站点+店铺ID：</td><td id="site"></td><td></td></tr>\
                <tr><td class="right">站点+店铺ID进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                <tr><td class="right">类进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
                <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
                <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
                <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
                </tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let config = JSON.parse(t[0][0].config), Aarr = [];
        for (let k in config) {
            for (let i = 0; i < config[k].length; i++) {
                Aarr.push([k, config[k][i].shopId, i + 1]);
            }
        }
        this.obj.Aarr = Aarr;
        this.obj.A2 = Aarr.length;
        Tool.login.a01(this.a04, this)
    },
    a04: function (t) {
        this.obj.seller = t;
        this.d01();
    },
    ///////////////////////////////////
    b01: function (id, arr) {
        let isNull = true;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].productId == id) {
                isNull = false;
                break;
            }
        }
        return isNull;
    },
    b02: function (id, arr) {
        let proid = "'【proid】丢失'"
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].fromid == id) {
                proid = "'" + arr[i].proid + "'"
                break;
            }
        }
        return proid;
    },
    /////////////////////////////////////////////////////////////////
    d01: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this, null)
    },
    d02: function () {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d03, this, this.f02)
    },
    d03: function () {
        let Aarr = this.obj.Aarr[this.obj.A1 - 1];
        $("#site").html("【" + Aarr[2] + "】" + Tool.site(Aarr[0]) + " + " + Aarr[1]);
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "page_number=" + this.obj.C1,
            "page_size=12",
            "list_type=" + this.obj.Barr[this.obj.B1 - 1],
            "count_list_types=sold_out,banned,deboosted,deleted,unlisted,reviewing,unpublished",
            "cnsc_shop_id=" + Aarr[1],
            "cbsc_shop_region=" + Aarr[0]
        ]
        let url = "https://seller.shopee.cn/api/v3/mpsku/list/"
        url += "get_banned_product_list"
        url += "?" + arr.join("&");
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在获取第" + this.obj.C1 + "页商品。。。");
        gg.getFetch(url, "json", this.d04, this);
    },
    d04: function (oo) {
        if (oo.code == 0) {
            this.obj.C2 = Math.ceil(oo.data.page_info.total / oo.data.page_info.page_size)
            this.e01(oo.data.products)
        }
        else if (oo.code == 429) {
            $("#state").html("请不要要求太频繁");
            //Tool.Time("1" 500,,this.a07, this,);
        }
        else {
            Tool.pre(["出错", oo])
        }
    },
    ////////////////////////////////////////////
    e01: function (products) {
        Tool.x1x2("C", this.obj.C1, this.obj.C2, this.e02, this, this.f01, products)
    },
    e02: function (products) {
        let arr = []
        for (let i = 0; i < products.length; i++) {
            arr.push(products[i].id);
        }
        //为什么是12？答：因为在获取时要的是12条。
        let shopArr = this.obj.Aarr[this.obj.A1 - 1];
        let data = [{
            action: "sqlite",
            database: "shopee/商品/店铺商品/" + Tool.siteNum(shopArr[0], shopArr[2]),
            sql: "select @.fromid as fromid, @.proid as proid from @.table where @.fromid in(" + arr.join(",") + ")",
        }, {
            action: "sqlite",
            database: "shopee/商品/违规或删除",
            sql: "select @.productId from @.table where @.productId in(" + arr.join(",") + ")",
        }]
        $("#state").html("获取【proid】和查询id是否存在。");
        Tool.ajax.a01(data, this.e03, this, products)
    },
    e03: function (t, products) {
        let data = [];
        let shopArr = this.obj.Aarr[this.obj.A1 - 1];
        let site = Tool.siteNum(shopArr[0], shopArr[2])
        for (let i = 0; i < products.length; i++) {
            let proid = this.b02(products[i].id, t[0])
            if (proid == "'【proid】丢失'") {
                //放商商品那边删除用的
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + site,
                    sql: "insert into @.table(@.fromid,@.proid)values(" + products[i].id + "," + proid + ")",
                })
            }
            if (this.b01(products[i].id, t[1])) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/违规或删除",
                    sql: "insert into @.table(@.productId,@.proid,@.name,@.status,@.pic,@.addtime,@.uptime,@.banned_time,@.penalty_type,@.description,@.explanation,@.site)values(" + products[i].id + "," + proid + "," + Tool.rpsql(products[i].name) + "," + products[i].status + "," + Tool.rpsql(products[i].cover_image) + "," + products[i].create_time + "," + products[i].modify_time + "," + products[i].banned_info.banned_time + "," + products[i].banned_info.reasons[0].penalty_type + "," + Tool.rpsql(products[i].banned_info.reasons[0].description) + "," + Tool.rpsql(products[i].banned_info.reasons[0].explanation) + ",'" + site + "')",
                })
            }
            else {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/违规或删除",
                    sql: "update @.table set @.proid='" + proid + "', @.site='" + site + "' where @.productId=" + products[i].id,
                })
            }
        }
        $("#state").html("正在更新本地商品状态。。。");
        Tool.ajax.a01(data, this.e04, this)
    },
    e04: function () {
        this.obj.C1++;
        $("#state").html("正在进入第" + this.obj.C1 + "页。。。");
        this.d03()
    },
    //////////////////////////////
    f01: function () {
        this.obj.C1 = 1; this.obj.C2 = 0;
        $("#C1").css("width", "0%");
        $("#C1,#C2").html("");
        this.obj.B1++;
        this.d02();
    },
    f02: function () {
        this.obj.B1 = 1;
        $("#B1").css("width", "0%");
        $("#B1,#B2").html("");
        this.obj.A1++;
        this.d01();
    },
}
fun.a01();

