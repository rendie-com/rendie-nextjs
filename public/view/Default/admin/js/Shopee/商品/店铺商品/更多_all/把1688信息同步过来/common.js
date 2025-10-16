'use strict';
Object.assign(Tool, {
    get_1688Info: {
        a01: function (site, num, progress, next, This, t) {
            let oo = {
                site: site,
                num: num,
                progress: progress,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                product: {}
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("proid") + " FROM @.table " + Tool.limit(1, oo.A1, "sqlite"),
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select " + Tool.fieldAs("proid,manualreview_1688_fromid,ManualReview_1688_unitWeight,discount") + " FROM @.table where @.proid='${proid}'",
                }]
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as count FROM @.table",
                })
            }
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = t[1][0].count; }
            oo.product = t[0];
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a04, this, this.d01, oo)
        },
        a04: function (oo) {
            $("#proid").html(oo.product[0].proid)
            if (oo.product[0].proid == "【proid】丢失") {
                $("#state").html("程序已终止。。。");
            }
            else {
                let data = [{
                    action: "sqlite",
                    database: "1688/采集箱/商品列表/" + Tool.remainder(oo.product[0].list[0][0].manualreview_1688_fromid, 100),
                    sql: "select " + Tool.fieldAs("freight,salenum,fromid") + " FROM @.table where @.fromid=" + oo.product[0].list[0][0].manualreview_1688_fromid,
                }, {
                    action: "sqlite",
                    database: "1688/采集箱/商品列表/详情/" + Tool.remainder(oo.product[0].list[0][0].manualreview_1688_fromid, 1000),
                    sql: "select @.sku as sku FROM @.table where @.fromid=" + oo.product[0].list[0][0].manualreview_1688_fromid,
                }]
                Tool.ajax.a01(data, this.a05, this, oo);
            }
        },
        a05: function (t, oo) {
            let url = "https://detail.1688.com/offer/" + t[0][0].fromid + ".html"
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>')
            let o1 = Tool.maxPrice.a01(JSON.parse(t[1][0].sku))
            let updateArr = [
                "@._1688_fromid=" + t[0][0].fromid,
                "@._1688_freight=" + t[0][0].freight,
                "@._1688_saleNum=" + t[0][0].salenum,
                "@._1688_maxprice=" + o1.price,
                "@._1688_MinimumOrder=" + o1.beginAmount,
                "@.unitWeight=" + oo.product[0].list[0][0].ManualReview_1688_unitWeight,
                "@.scale=" + o1.scale,
                "@.discount=" + oo.product[0].list[0][0].discount,
            ]
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "update @.table set " + updateArr.join(",") + " where @.proid='" + oo.product[0].list[0][0].proid + "'",
            }]
            $("#state").html("正在更新。。。");
            Tool.ajax.a01(data, this.a06, this, oo);
        },
        a06: function (t, oo) {
            oo.A1++;
            oo.product = {}
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