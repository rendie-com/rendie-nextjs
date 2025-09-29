'use strict';
Object.assign(Tool, {
    common3:
    {
        a01: function (GlobalPro, seller, site, num, dom, next, This, t) {
            let oo = {
                GlobalPro: GlobalPro,
                seller: seller,
                site: site,
                num: num,
                dom: dom,
                next: next,
                This: This,
                t: t,
                post: {},//返回值 
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "page_size=12",
                "search_type=sku",
                "keyword=" + oo.GlobalPro.proid,
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/mtsku/list/search_product_list?" + pArr.join("&")
            let _1688Url = "https://detail.1688.com/offer/" + oo.GlobalPro.manualreview_1688_fromid + ".html"
            oo.dom.append('\
            <tr><td class="right">1688详情页地址：</td><td colspan="2"><a href="' + _1688Url + '" target="_blank">' + _1688Url + '</a></td></tr>\
            <tr><td class="right">请求地址：</td><td colspan="2"><a href="' + url + '" target="_blank">' + url + '</a></td></tr>\
            ');
            $("#state").html("正在【全球商品】中搜索，获取商品SKU。。。");
            gg.getFetch(url, "json", this.a03, this, oo)
        },
        a03: function (o1, oo) {
            if (o1.code == 0) {
                if (o1.data.page_info.total == 0) {
                    //就是没有搜索到结果，会来到这里。
                    //当商品已售完，会来到这里
                    //当商品中已发布，会来到这里
                    Tool.pre(["就是没有搜索到结果，会来到这里：", o1])
                }
                else {
                    let search_data = o1.data.products[0];//为什么是“list[0]”？答：因为只搜索一个，所以就是第一个。
                    if (search_data.model_list[0].stock_detail) {
                        this.a04(search_data, oo);
                    }
                    else {
                        $("#state").html("延时1秒再找【search_data.model_list[0].stock_detail】。。。");
                        Tool.Time("name", 1000, this.a02, this, oo)
                    }
                }
            }
            else {
                Tool.pre(["出错0001：", o1, oo])
            }
        },
        a04: function (search_data, oo) {
            let model_price_list = [], model_info_list = [];
            let MaxCurrentPrices = Tool.maxPrice.a01(oo.GlobalPro._1688_prodes_sku)
            for (let i = 0; i < search_data.model_list.length; i++) {
                let price1 = MaxCurrentPrices.price + oo.GlobalPro.common_price.upPrice
                let price2 = price1 * MaxCurrentPrices.scale
                let mpsku_model_price = Tool.common_price.b03(price2, oo.seller[oo.site][oo.num], oo.GlobalPro.discount)
                model_price_list.push({
                    mtsku_model_id: search_data.model_list[i].id,
                    mpsku_model_price: mpsku_model_price.toFixed(oo.seller[oo.site][oo.num].scale),
                });
                model_info_list.push({
                    "mtsku_model_id": search_data.model_list[i].id,
                    //库存必须大于【最小购买量】，否则不可销售。
                    "mpsku_status": (search_data.model_list[i].stock_detail.total_seller_stock < oo.GlobalPro.common_price.min_purchase_limit ? 2 : 1) //1:正常销售；2：不可销售；
                })
            }
            oo.dom.append('<tr><td class="right">【全球商品】价格：</td><td colspan="2"><textarea id="sql" rows="10" class="form-control form-control-sm">' + JSON.stringify(search_data.model_list, null, 2) + '</textarea></td></tr>');
            this.a05(search_data.id, model_price_list, model_info_list, oo)

        },
        a05: function (id, model_price_list, model_info_list, oo) {
            let data = {
                "mtsku_item_id": id,
                "publish_shop_list": [
                    {
                        "shop_id": oo.seller[oo.site][oo.num].shopId,
                        "user_name": oo.seller[oo.site][oo.num].shopName,
                        "region": oo.site.toUpperCase(),
                        "model_price_list": model_price_list,
                        "model_info_list": model_info_list
                    }],
                "scene_token": "在下面的代码中获取该信息"
            }
            oo.dom.append('<tr><td class="right">修改后价格：</td><td colspan="2"><textarea id="sql" rows="10" class="form-control form-control-sm">' + JSON.stringify(data, null, 2) + '</textarea></td></tr>');
            oo.post = data;
            this.a06(oo)
        },
        a06: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/mtsku/get_scene_token?" + pArr.join("&")
            let data = {
                shop_id: oo.seller[oo.site][oo.num].shopId,
                region: oo.site.toUpperCase(),
                user_name: oo.seller[oo.site][oo.num].shopName,
                scene: "create_mpsku_by_mtsku"
            }
            $("#state").html("正在获取token");
            gg.postFetch(url, JSON.stringify(data), this.a07, this, oo)
        },
        a07: function (o1, oo) {
            oo.post.scene_token = o1.data.token
            Tool.apply(oo.post, oo.next, oo.This, oo.t);
        },
    }
})