'use strict';
Object.assign(Tool, {
    edit_model_list:
    {
        //min_purchase_limit            最低购买量
        //discount                      折扣
        //upPrice                       上调价格
        //GlobalPro_fromid              全球商品ID
        //scale                         每包件数
        //shopPro_fromid                店铺商品ID
        a01: function (model_list, attrPic, seller, site, num, global_fromid, shop_fromid, next, This, t) {
            let oo = {
                //model_list: model_list,
                attrPic: attrPic,
                seller: seller,
                site: site,
                num: Tool.int(num) - 1,
                global_fromid: global_fromid,
                shop_fromid: shop_fromid,
                next: next,
                This: This,
                t: t
            }
            this.d01(oo)
        },
        d01: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "mtsku_item_id=" + oo.global_fromid,
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/mtsku/get_mtsku_info/?" + arr.join("&");
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            $("#state").html("正在获取【全球商品】信息的价格。。。");
            //因为这是底价，用修改站点价格。
            gg.getFetch(url, "json", this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (t.message == "success") {
                this.d03(t.data.model_list, oo);
            }
            else {
                Tool.pre(["出错2025.5.30", t]);
            }
        },
        d03: function (arr, oo) {
            let GlobalPro_price = {}
            for (let i = 0; i < arr.length; i++) {
                GlobalPro_price[arr[i].seller_sku] = arr[i].price_info.normal_price;
            }
            oo.temp_GlobalPro_price = GlobalPro_price;
            this.d04(oo);
        },
        d04: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "product_id=" + oo.shop_fromid,
                "is_draft=false",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/product/get_product_info?" + arr.join("&")
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            $("#state").html("正在获取【店铺商品】信息。。。");
            //用来获取价格的ID.
            gg.getFetch(url, "json", this.d05, this, oo);
        },
        d05: function (t, oo) {
            if (t.msg == "success") {
                this.e01(t.data.product_info.std_tier_variation_list, t.data.product_info.model_list, oo)
            }
            else {
                Tool.pre(["出错2025.5.30---01", t]);
            }
        },
        e01: function (arr, model_list, oo) {
            let iserr = false;
            for (let i = 0; i < arr.length; i++) {
                let imgArr = [];//是否有图片
                for (let j = 0; j < arr[i].value_list.length; j++) {
                    if (arr[i].value_list[j].image_id) { imgArr = arr[i].value_list; break; }
                }
                /////////////////////////////////////////////////////
                if (imgArr.length != 0) {
                    if (imgArr.length == oo.attrPic.length) {
                        for (let j = 0; j < arr[i].value_list.length; j++) {
                            arr[i].value_list[j].image_id = oo.attrPic[j].shopee;
                        }
                    }
                    else {
                        iserr = true;
                        break;
                    }
                }
                /////////////////////////////////////////////////////
            }
            if (iserr) {
                $("#state").html("图片属性个数不一样");
                Tool.apply(false, oo.next, oo.This, oo.t);
            }
            else {
                oo.product_info = { std_tier_variation_list: arr };//修改属性图片
                this.e02(model_list, oo);

            }
        },
        e02: function (arr, oo) {
            let model_list = [];
            let GlobalPro_price = 0;
            for (let i = 0; i < arr.length; i++) {
                GlobalPro_price = oo.temp_GlobalPro_price[arr[i].sku]
                if (GlobalPro_price) {
                    model_list.push({
                        "id": arr[i].id,
                        //"price": Tool.common_price.b03((parseFloat(GlobalPro_price) + oo.upPrice)*oo.scale, oo.seller[oo.site], oo.discount).toFixed(2),//-------不能在这里调价，会扣分，说我调价。
                        "tier_index": arr[i].tier_index,
                        //当属性的价格小于【最小够买量】，则不卖了。
                        "status": arr[i].stock_detail.total_seller_stock < oo.min_purchase_limit ? 2 : 1
                    })
                }
                else {
                    break;
                }
            }
            if (GlobalPro_price) {
                this.e03(model_list, oo)
            }
            else {
                $("#state").html("来源SKU发生改变");
                Tool.apply(false, oo.next, oo.This, oo.t);
            }
        },
        e03: function (model_list, oo) {
            oo.product_info.model_list = model_list;//修改价格
            Tool.apply(oo.product_info, oo.next, oo.This, oo.t);
        },
    }
})
