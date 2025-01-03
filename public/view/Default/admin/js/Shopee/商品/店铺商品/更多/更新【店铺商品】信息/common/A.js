'use strict';
Object.assign(Tool, {
    common_A:
    {
        obj:
        {
            A1: 1, A2: 0,
        },
        a01: function (seller, site) {
            let oo = {
                seller: seller,
                site: site
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let where = this.b01(oo.seller.mode)
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.site,
                sql: "select " + Tool.fieldAs("fromid,proid,model_list") + " FROM @.table" + where + "  order by @.self_uptime desc limit 1",
            }]
            if (this.obj.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.site,
                    sql: "select count(1) as total FROM @.table" + where,
                })
            }
            $("#state").html("获取店铺信息")
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].total; }
            oo.shop_product = t[0][0];
            Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a04, this, null, oo)
        },
        a04: function (oo) {
            let url = 'https://seller.shopee.cn/portal/product/' + oo.shop_product.fromid + '?cnsc_shop_id=' + oo.seller[oo.site].shopId
            let html = '\
            <tr><td class="right">店铺商品URL：</td><td colspan="2"><a href="' + url + '" target="_blank">' + url + '</a></td></tr>\
            <tr><td class="right">商品编码：</td><td colspan="2">' + oo.shop_product.proid + '</td></tr>'
            $("#tbody").html(html);
            //获取全球商品和1688信息
            Tool.global_product_and_1688_product.a01(oo.shop_product.proid, this.a05, this, oo)
        },
        a05: function (t, oo) {
            oo.global_product_and_1688_product = t;
            Tool.common_price.a01(
                oo.seller.logistics,
                oo.seller[oo.site],
                t.sku,
                t.freight,
                t.global_product.discount,
                t.global_product.manualreview_1688_unitweight,
                $("#tbody"),
                this.a06,
                this,
                oo)
        },
        a06: function (t, oo) {
            oo.common_price = t;
            let o2 = oo.global_product_and_1688_product.global_product
            Tool.edit_watermark.a01(
                o2.pic,
                JSON.parse(o2.shopee_8pic),
                o2.manualreview_1688_fromid,
                o2.proid,
                oo.seller,
                oo.site,
                this.a07,
                this,
                oo)
        },
        a07: function (t, oo) {
            oo.edit_watermark = t;
            Tool.edit_model_list.a01(JSON.parse(oo.shop_product.model_list), t.attrPic, oo.seller, oo.site, oo.global_product_and_1688_product.global_product.fromid, oo.shop_product.fromid, this.a08, this, oo)
        },
        a08: function (t, oo) {
            $("#tbody").append('\
                <tr><td class="right">shopee的属性和属性图：</td><td colspan="2"><textarea rows="10" class="form-control form-control-sm">' + JSON.stringify(t.std_tier_variation_list, null, 2) + '</textarea></td></tr>\
                <tr><td class="right">shopee的SKU：</td><td colspan="2"><textarea rows="10" class="form-control form-control-sm">' + JSON.stringify(t.model_list, null, 2) + '</textarea></td></tr>\
            ');
            let global_product = oo.global_product_and_1688_product.global_product;
            Tool.update_product.a01(
                oo.seller,
                oo.site,
                t.std_tier_variation_list,//shopee的属性和属性图
                t.model_list,//shopee的SKU
                oo.shop_product.fromid,
                global_product.name,
                global_product.description,
                oo.common_price.min_purchase_limit,
                oo.common_price.wholesale_list,
                oo.edit_watermark.video,
                global_product.discount,
                global_product.manualreview_1688_unitweight,
                oo.global_product_and_1688_product.sku.startAmount,
                oo.edit_watermark.images,
                this.a09, this, oo)
        },
        a09: function (oo) {
            this.obj.A1++;
            this.a01(oo.seller, oo.site);
        },
        ////////////////////////////////////////////////////////////
        b01: function (mode) {
            //本地更新时间大于平台更新时间，就说明要更新该商品
            let where = ""
            if (mode == "2") {
                where = " where @.MinimumOrder<>@.min_purchase_limit and @.status<>6"
            }
            else {
                where = " where @.self_uptime>=@.uptime and @.status<>6"
            }
            //where =" where @.proid='R456317'"
            //where =" order by @.self_uptime desc"
            //where = " where @.price_uptime=1"
            //where =" where @.price_uptime=0"
            //where =" where @.status=8"
            $("#where").html(where);
            return where;
        },
    }
})