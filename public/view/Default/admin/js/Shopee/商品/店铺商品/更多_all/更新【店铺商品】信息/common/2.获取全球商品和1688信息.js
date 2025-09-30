'use strict';
Object.assign(Tool, {
    global_product_and_1688_product:
    {
        a01: function (proid, site, next, This, t) {
            let oo = {
                proid: proid,
                language1: this.b01(site),//为什么多出一个？答：因为台湾标提单独拿出来翻译了。
                language2: this.b02(site),
                next: next,
                This: This,
                t: t
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select " + Tool.fieldAs("pic,manualreview_1688_fromid,manualreview_1688_unitweight,fromid,discount,proid") + " FROM @.table where @.proid='" + oo.proid + "'",
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品/${proid_100:proid}",
                    sql: "select " + Tool.fieldAs("shopee_8pic," + oo.language1 + "_name," + oo.language2 + "_description") + " FROM @.table where @.proid='${proid}'"
                }]
            }]
            //获取全球商品信息
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            let global_product = t[0][0]
            let url1 = 'https://seller.shopee.cn/portal/product/mtsku/' + global_product.fromid
            let url2 = 'https://detail.1688.com/offer/' + global_product.manualreview_1688_fromid + '.html';
            ////////////////////////////////////////
            //改一下变量名
            global_product.list[0][0].name = global_product.list[0][0][oo.language1 + "_name"]; global_product.list[0][0][oo.language1 + "_name"] = null;
            global_product.list[0][0].description = global_product.list[0][0][oo.language2 + "_description"];
            global_product.list[0][0][oo.language2 + "_description"] = null;
            ////////////////////////////////////
            let html = '\
            <tr><td class="right">1688详情页地址：</td><td colspan="2"><a href="' + url2 + '" target="_blank">' + url2 + '</a></td></tr>\
            <tr><td class="right">全球商品ID：</td><td colspan="2"><a href="' + url1 + '" target="_blank">' + global_product.fromid + '</a></td></tr>\
            <tr><td class="right">标题：</td><td colspan="2">' + global_product.list[0][0].name + '</td></tr>\
            <tr><td class="right">折扣：</td><td colspan="2">-' + global_product.discount + '%</td></tr>\
            <tr><td class="right">详情：</td><td colspan="2"><textarea rows="10" class="form-control form-control-sm">' + global_product.list[0][0].description + '</textarea></td></tr>'
            $("#tbody").append(html);
            this.a04(global_product, oo)
        },
        a04: function (global_product, oo) {
            if (global_product.list[0][0].name) {
                if (global_product.list[0][0].description) {
                    this.d01(global_product, oo);
                }
                else {
                    Tool.at("没有商品详情,程序终止。");
                }
            }
            else {
                Tool.at("没有商品标题,程序终止。");
            }
        },
        ////////////////////////////////////////////////////////////
        b01: function (site) {
            let language
            switch (site) {//选择JS文件
                case "tw": language = "tw_2"; break;
                case "sg":
                case "ph":
                case "my":
                    language = "en"; break;
                case "br": language = "pt"; break;
                case "mx":
                case "cl":
                case "co":
                    language = "es_2"; break;
                case "th": language = "th"; break;
                case "vn": language = "vi"; break;
            }
            return language
        },
        b02: function (site) {
            let language
            switch (site) {
                case "tw": language = "tw"; break;
                case "sg":
                case "ph":
                case "my":
                    language = "en"; break;
                case "br": language = "pt"; break;
                case "mx":
                case "cl":
                case "co":
                    language = "es"; break;
                case "th": language = "th"; break;
                case "vn": language = "vi"; break;
            }
            return language
        },
        /////////////////////////////////////////////////////////
        d01: function (global_product, oo) {
            let data = [{
                action: "sqlite",
                database: "1688/采集箱/商品列表/" + Tool.remainder(global_product.manualreview_1688_fromid, 100),
                sql: "select " + Tool.fieldAs("freight,unit") + " FROM @.table where @.fromid=" + global_product.manualreview_1688_fromid,
            }, {
                action: "sqlite",
                database: "1688/采集箱/商品列表/详情/" + Tool.remainder(global_product.manualreview_1688_fromid, 1000),
                sql: "select @.sku as sku FROM @.table where @.fromid=" + global_product.manualreview_1688_fromid,
            }]
            $("#state").html("获取1688商品信息")
            oo.global_product = global_product;
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            let sku = JSON.parse(t[1][0].sku);
            sku.startAmount = sku.startAmount ? sku.startAmount : 1
            let unit = (sku.sellunit ? '按' + sku.sellunit + '起批1' + sku.sellunit + '=' + sku.startAmount : '')
            let html = '\
            <tr>\
                <td class="right">1688的sku：</td>\
                <td colspan="2"><textarea rows="10" class="form-control form-control-sm">' + JSON.stringify(sku, null, 2) + '</textarea></td>\
            </tr>\
            <tr>\
                <td class="right">售卖方式：</td>\
                <td colspan="2">' + unit + t[0][0].unit + '</td>\
            </tr>'
            $("#tbody").append(html);
            this.d03(sku, t[0][0].freight, oo);
        },
        d03: function (sku, freight, oo) {
            if (sku) {
                this.d04(sku, freight, oo)
            }
            else {
                Tool.pre('sku格式不对')
            }
        },
        d04: function (sku, freight, oo) {
            Tool.apply({
                sku: sku,
                freight: freight,
                global_product: oo.global_product
            }, oo.next, oo.This, oo.t)
        },
    }
})