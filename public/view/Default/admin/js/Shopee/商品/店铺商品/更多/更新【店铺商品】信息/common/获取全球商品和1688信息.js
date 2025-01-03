'use strict';
Object.assign(Tool, {
    global_product_and_1688_product:
    {
        a01: function (proid, next, This, t) {
            let oo = {
                proid: proid,
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
                sql: "select " + Tool.fieldAs("pic,shopee_8pic,manualreview_1688_fromid,manualreview_1688_unitweight,tw_2_name,ms_name,en_name,pt_name,tw_description,ms_description,en_description,pt_description,fromid,discount,proid") + " FROM @.table where @.proid='" + oo.proid + "'",
            }]
            //获取全球商品信息
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            let global_product = t[0][0]
            let url1 = 'https://seller.shopee.cn/portal/product/mtsku/' + global_product.fromid
            let url2 = 'https://detail.1688.com/offer/' + global_product.manualreview_1688_fromid + '.html';
            ////////////////////////////////////////
            global_product.name = this.b01(global_product.tw_2_name, global_product.ms_name, global_product.en_name, global_product.pt_name)
            global_product.tw_2_name = null; global_product.ms_name = null; global_product.en_name = null; global_product.pt_name = null;
            global_product.description = this.b01(global_product.tw_description, global_product.ms_description, global_product.en_description, global_product.pt_description)
            global_product.tw_description = null; global_product.ms_description = null; global_product.en_description = null; global_product.pt_description = null;
            ////////////////////////////////////
            let html = '\
            <tr><td class="right">1688详情页地址：</td><td colspan="2"><a href="' + url2 + '" target="_blank">' + url2 + '</a></td></tr>\
            <tr><td class="right">全球商品ID：</td><td colspan="2"><a href="' + url1 + '" target="_blank">' + global_product.fromid + '</a></td></tr>\
            <tr><td class="right">标题：</td><td colspan="2">' + name + '</td></tr>\
            <tr><td class="right">折扣：</td><td colspan="2">-' + global_product.discount + '%</td></tr>\
            <tr><td class="right">详情：</td><td colspan="2"><textarea rows="10" class="form-control form-control-sm">' + global_product.description + '</textarea></td></tr>'
            $("#tbody").append(html);
            this.a04(global_product, oo)
        },
        a04: function (global_product, oo) {
            if (global_product.name) {
                if (global_product.description) {
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
        b01: function (tw, ms, en, pt) {
            let name = "";
            if (obj.params.site == "my"||obj.params.site == "sg") {
                name = en;
            }
            else if (obj.params.site == "br") {
                name = pt;
            }
            else if (obj.params.site == "tw") {
                name = tw;
            }
            return name;
        },
        /////////////////////////////////////////////////////////
        d01: function (global_product, oo) {
            let data = [{
                action: "sqlite",
                database: "1688",
                sql: "select " + Tool.fieldAs("freight,unit") + " FROM @.proList where @.fromid=" + global_product.manualreview_1688_fromid,
            }, {
                action: "sqlite",
                database: "1688_prodes/" + Tool.remainder(global_product.manualreview_1688_fromid, 99),
                sql: "select @.sku as sku FROM @.prodes where @.fromid=" + global_product.manualreview_1688_fromid,
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
            this.d03(sku, t[0][0].freight, oo)
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