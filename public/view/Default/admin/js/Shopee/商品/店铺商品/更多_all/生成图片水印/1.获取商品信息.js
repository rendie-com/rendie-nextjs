'use strict';
Object.assign(Tool, {
    common1:
    {
        a01: function (seller, site, num, progressArr, dom, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progressArr: progressArr,
                dom: dom,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                products: {},
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("fromid,pic,proid") + " FROM @.table order by @.self_uptime desc" + Tool.limit(1, oo.A1, "sqlite"),
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
            oo.products = t[0][0];
            Tool.x1x2(oo.progressArr[0], oo.A1, oo.A2, this.a04, this, this.d01, oo);
        },
        a04: function (oo) {
            oo.dom.fromid.html('<a href="https://seller.shopee.cn/portal/product/' + oo.products.fromid + '" target="_blank">' + oo.products.fromid + '</a>')
            oo.dom.proid.html(oo.products.proid);
            let dom = {
                picA: oo.dom.picA,
                picB: oo.dom.picB
            }
            Tool.common2.a01(oo.products.proid, oo.seller, oo.site, oo.num, oo.siteNum, dom, oo.progressArr[1], this.a05, this, oo)
        },
        a05: function (oo) {
            let dom = {
                manualreview_1688_fromid: oo.dom.manualreview_1688_fromid,
                attrPicA: oo.dom.attrPicA,
                attrPicB: oo.dom.attrPicB
            }
            Tool.common3.a01(oo.products.proid, oo.seller, oo.site, oo.num, oo.siteNum, dom, oo.progressArr[2], this.a06, this, oo);
        },
        a06: function (oo) {
            oo.A1++;
            this.a02(oo);
        },
        //////////////////////////////
        d01: function (oo) {
            $("#" + oo.progressArr[0] + "1").css("width", "0%");
            $("#" + oo.progressArr[0] + "1,#" + oo.progressArr[0] + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})