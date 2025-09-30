'use strict';
Object.assign(Tool, {
    get_product_info: {
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
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                products: {}
            }
            this.a02(oo);
        },
        a02: function (oo) {
            $("#state").html("正在初始化。。。");
            let where = ""
            //where = " where @.proid='R542765'"
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("fromid") + " FROM @.table " + where + Tool.limit(1, oo.A1, "sqlite"),
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as total FROM @.table" + where,
                })
            }
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = t[1][0].total; }
            oo.products = t[0][0];
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a04, this, this.d01, oo);
        },
        a04: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "product_id=" + oo.products.fromid,
                "is_draft=false",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/product/get_product_info?" + arr.join("&")
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            $("#state").html("正在获取第" + oo.A1 + "页商品。。。");
            gg.getFetch(url, "json", this.a05, this, oo);
        },
        a05: function (o1, o2) {
            if (o1.msg == "success") {
                this.a06(o1.data.product_info, o2)
            }
            else {
                Tool.pre(["出错001", o1])
            }
        },
        a06: function (products, oo) {
            let fideArr = [
                "@.MinimumOrder==最小购买量",
                ////////////////////////////////////////
                "@.description==详情",
                "@.images==放大镜图片",
                "@.std_tier_variation_list=价格属性和属性图",
                "@.model_list=销售资料-规格表",
                "@.wholesale_list==批发",
                "@.video_list==视频",
            ]
            $("#updateFields").html(fideArr.join("<br/>"))
            let updateArr = [
                "@.description = " + Tool.rpsql(products.description_info.description),
                "@.images=" + Tool.rpsql(JSON.stringify(products.images)),
                "@.std_tier_variation_list = " + Tool.rpsql(JSON.stringify(products.std_tier_variation_list)),
                "@.model_list = " + Tool.rpsql(JSON.stringify(products.model_list)),
                "@.wholesale_list = " + Tool.rpsql(JSON.stringify(products.wholesale_list)),
                "@.video_list = " + Tool.rpsql(JSON.stringify(products.video_list))
            ]
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "update @.table set @.MinimumOrder=" + products.min_purchase_limit + " where @.fromid=" + products.id,
            }, {
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum + "/" + Tool.pronum(products.parent_sku, 100),
                sql: "update @.table set " + updateArr.join(",") + " where @.proid = '" + products.parent_sku + "'",
            }]
            $("#state").html("正在更新本地商品状态。。。");
            Tool.ajax.a01(data, this.a07, this, oo);
        },
        a07: function (t, oo) {
            oo.A1++;
            $("#state").html("正在进入第" + oo.A1 + "页。。。");
            this.a02(oo);
        },
        //////////////////////////////
        d01: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})





