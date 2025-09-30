'use strict';
Object.assign(Tool, {
    C:
    {
        a01: function (seller, site, num, progress, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                logistics: [],
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                products: {},
                global_product_and_1688_product: {},
                common_price: {},
                edit_watermark: {},
            }
            this.a02(oo);
        },
        a02: function (oo) {
            $("#state").html("正在获取物流方式。。。");
            Tool.logistics.a01(oo.site, $("#logistics"), this.a03, this, oo);
        },
        a03: function (logistics, oo) {
            oo.logistics = logistics;
            this.d01(oo);
        },
        ////////////////////////////////////////////////////////////
        b01: function () {
            //本地更新时间大于平台更新时间，就说明要更新该商品
            let where = " where @.self_uptime>=@.uptime and @.status<>6 and @.status<>-6"
            //where = " where @.proid='R235194'"
            //where =" order by @.self_uptime desc"
            //where = " where @.price_uptime=1"
            //where =" where @.price_uptime=0"
            //where =" where @.status=8"
            $("#where").html(where);
            return where;
        },
        /////////////////////////////////////////////
        d01: function (oo) {
            let where = this.b01()
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("fromid,proid,name,MinimumOrder") + " FROM @.table" + where + "  order by @.self_uptime desc limit 1",
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum + "/${proid_100:proid}",
                    sql: "select " + Tool.fieldAs("model_list,description,images,std_tier_variation_list,wholesale_list,video_list") + " FROM @.table  where @.proid='${proid}'"
                }]
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as total FROM @.table" + where,
                })
            }
            $("#state").html("获取店铺信息");
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = t[1][0].total; }
            oo.products = t[0][0];
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d03, this, this.e01, oo);
        },
        d03: function (oo) {
            let url = 'https://seller.shopee.cn/portal/product/' + oo.products.fromid + '?cnsc_shop_id=' + oo.seller[oo.site][oo.num - 1].shopId
            let html = '\
            <tr><td class="right">店铺商品URL：</td><td colspan="2"><a href="' + url + '" target="_blank">' + url + '</a></td></tr>\
            <tr><td class="right">商品编码：</td><td colspan="2">' + oo.products.proid + '</td></tr>'
            $("#tbody").html(html);
            //获取全球商品和1688信息
            Tool.global_product_and_1688_product.a01(oo.products.proid, oo.site, this.d04, this, oo);
        },
        d04: function (t, oo) {
            oo.global_product_and_1688_product = t;
            Tool.common_price.a01(
                oo.logistics,
                oo.seller[oo.site][oo.num - 1],
                t.sku,
                t.freight,
                t.global_product.discount,
                t.global_product.manualreview_1688_unitweight,
                $("#tbody"),
                this.d05,
                this,
                oo);
        },
        d05: function (t, oo) {
            oo.common_price = t;
            let o2 = oo.global_product_and_1688_product.global_product
            Tool.edit_watermark.a01(
                o2.pic,
                JSON.parse(o2.list[0][0].shopee_8pic),
                o2.manualreview_1688_fromid,
                o2.proid,
                oo.seller,
                oo.siteNum,
                this.d06,
                this,
                oo)
        },
        d06: function (t, oo) {
            oo.edit_watermark = t;
            //修改sku图为水印图
            Tool.edit_model_list.a01(null, t.attrPic, oo.seller, oo.site, oo.num, oo.global_product_and_1688_product.global_product.fromid, oo.products.fromid, this.d07, this, oo)
        },
        d07: function (t, oo) {
            if (t) {
                $("#tbody").append('\
                <tr><td class="right">shopee的属性和属性图：</td><td colspan="2"><textarea rows="10" class="form-control form-control-sm">' + JSON.stringify(t.std_tier_variation_list, null, 2) + '</textarea></td></tr>\
                <tr><td class="right">shopee的SKU：</td><td colspan="2"><textarea rows="10" class="form-control form-control-sm">' + JSON.stringify(t.model_list, null, 2) + '</textarea></td></tr>\
                ');
                let global_product = oo.global_product_and_1688_product.global_product;
                Tool.update_product.a01(
                    oo.seller,
                    oo.site,
                    oo.num,
                    oo.siteNum,
                    t.std_tier_variation_list,//shopee的属性和属性图
                    t.model_list,//shopee的SKU
                    oo.products,
                    global_product.list[0][0].name,
                    global_product.list[0][0].description,
                    oo.common_price.MinimumOrder,
                    oo.common_price.wholesale_list,
                    oo.edit_watermark.video,
                    global_product.discount,
                    global_product.manualreview_1688_unitweight,
                    oo.global_product_and_1688_product.sku.startAmount,
                    oo.edit_watermark.images,
                    this.d08, this, oo);
            }
            else {
                //例如：图片属性个数不一样。
                Tool.update_product.d01(-6, "图片属性个数不一样", oo.products.fromid, { siteNum: oo.siteNum, next: this.d08, This: this, t: oo })
            }
        },
        d08: function (oo) {
            oo.products = {}
            oo.global_product_and_1688_product = {}
            oo.common_price = {}
            oo.edit_watermark = {}
            oo.A1++;
            this.d01(oo);
        },
        //////////////////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})