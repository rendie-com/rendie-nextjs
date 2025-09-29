'use strict';
Object.assign(Tool, {
    createFlashSale2://启用
    {
        a01: function (item_stock_price_infos, fromidArr, size, flash_sale_id, seller, site, num, next, This, t) {
            let oo = {
                item_stock_price_infos: item_stock_price_infos,//价格信息
                fromidArr: fromidArr,//本地来源ID
                size: size,
                flash_sale_id: flash_sale_id,
                /////////////////////////////////////////////////
                seller: seller,
                site: site,
                num: num,
                next: next,
                This: This,
                t: t,
                //////////////////////
                item_list: [],
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let arr1 = oo.item_stock_price_infos;//价格信息	
            let items1 = [], item_list = [], arr2 = []//限商品ID个数
            for (let i = 0; i < arr1.length; i++) {
                let Tarr = arr1[i].sku_stock_price_list
                for (let j = 0; j < Tarr.length; j++) {
                    //////////////////////////////////////////
                    let items2 = this.b02(arr1[i], Tarr[j], oo.fromidArr)
                    if (Tarr[j].seller_stock_info.normal_stock > items2.stock & items2.input_promo_price > 1)//库存要大于20才能做秒杀活动
                    {
                        if (arr2.indexOf(arr1[i].item_id) == -1 && arr2.length < oo.size) {//限商品ID个数
                            arr2.push(arr1[i].item_id)
                            items1.push(items2)
                            /////////////为什么要【item_list】变量?答：搜索出来的结果到最后必须关闭，否则报错。////////////////////////////////
                            item_list.push({
                                "itemid": arr1[i].item_id,
                                "modelid": Tarr[j].model_id
                            })
                        }
                        else {
                            break;
                        }
                    }
                    if (arr2.length >= oo.size) { break; }
                }
            }
            oo.item_list = item_list;//后面要用
            this.a03(items1, oo)
        },
        a03: function (items, oo) {
            //说明：首次添加的【启用】，是这个样子。
            $("#state").html("正在【启用】。。。");
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            /*
            {
                "flash_sale_id":12724742721536,
                "items":[
                    {"item_id":26950594715,"status":0,"model_id":215117634136,"input_promo_price":0.35,"stock":100,"purchase_limit":200},
                    {"item_id":26950594715,"status":0,"model_id":215117634137,"input_promo_price":0.35,"stock":100,"purchase_limit":200},
                    {"item_id":26950594715,"status":0,"model_id":215117634138,"input_promo_price":0.35,"stock":100,"purchase_limit":200},
                    {"item_id":26950594715,"status":1,"model_id":215117634135,"input_promo_price":0.35,"stock":100,"purchase_limit":200}
                ],
                "use_global_category":true
            }
            */
            let url = "https://seller.shopee.cn/api/marketing/v4/shop_flash_sale/batch_items/set/?" + pArr.join("&")
            let data = {
                flash_sale_id: oo.flash_sale_id,
                items: items,
                use_global_category: true
            }
            gg.postFetch(url, JSON.stringify(data), this.a04, this, oo)
        },
        a04: function (t, oo) {
            if (t.code == 0) {
                $("#state").html("正在【确认】。。。");
                this.d01(oo)//说明：下面这个请求必须要做，否则提示错误【"err_msg": "ERROR_FLASH_SALE_ITEM_NOT_ENOUGH_STOCK",】----错误快闪销售项目库存不足
                // if (t.data.failed_items.length == 0) {
                // }
                // else {
                //     $("#state").html("有出错的，删除出错的，添加新的，再来。");
                //     Tool.pre(["出错01", t])
                // }
            }
            else {
                $("#state").html("不可能到这里");
                Tool.pre(["出错001", t])
            }
        },
        ////////////////////////////////
        b01: function (itemId, price, arr) {
            let oo = {};
            for (let i = 0; i < arr.length; i++) {
                if (itemId == arr[i].fromid) {
                    oo = {
                        price: Tool.fomatFloat(price * (1 - arr[i].newDiscount / 100) - 0.01, 2),
                        MinimumOrder: arr[i].MinimumOrder//最低购买量
                    }
                    break;
                }
            }
            return oo;
        },
        b02: function (o1, o2, arr2) {
            let o3 = this.b01(o1.item_id, o2.price_info.input_normal_price, arr2)
            if (o3.MinimumOrder) {
                return {
                    "item_id": o1.item_id,
                    "status": 1,
                    "model_id": o2.model_id,
                    "input_promo_price": o3.price,
                    "stock": o3.MinimumOrder * 3,
                    "purchase_limit": o3.MinimumOrder * 3//买家在限时选购期间，每件商品可购买的最多次数。
                }
            }
            else {
                Tool.pre(["有问题，没有找到商品ID.", o1, o2, arr2]);
            }
        },
        ///////////////////////////////////////////////////////
        d01: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/public/misleading_discount/?" + pArr.join("&")
            let data = { item_list: oo.item_list }
            /*
            {
              "item_list": [
                {
                  "itemid": 26950594715,
                  "modelid": 215117634138
                },
                {
                  "itemid": 26950594715,
                  "modelid": 215117634135
                },
                {
                  "itemid": 26950594715,
                  "modelid": 215117634136
                },
                {
                  "itemid": 26950594715,
                  "modelid": 215117634137
                }
              ]
            }
            */
            gg.postFetch(url, JSON.stringify(data), this.d02, this, oo)
        },
        d02: function (t, oo) {
            if (t.message == "success") {
                oo.next.apply(oo.This, [oo.t])
            }
            else {
                Tool.pre(["解除锁定出错", t])
            }
        },
    }
});