Object.assign(Tool, {
    common4: {
        //添加商品
        a01: function (seller, site, num, siteNum, session_id, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                siteNum: siteNum,
                session_id: session_id,
                next: next,
                This: This,
                t: t,
                //////////////////
                ProductArr: [],
                item_ids: []//更新时要用
            }
            this.a02(oo)
        },
        a02: function (oo) {
            $("#state").html("正在获取【商品】信息。。。");
            //@.isSignUp=1          表示【能报名】
            //@.isTrueSignUp=0      表示【未报名】  and @.isTrueSignUp=0 and @.fromid in(28382205160) 
            //@.status=1            表示【上架商品】
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("MinimumOrder,fromid,model_list") + " FROM @.table where @.status=1 and @.isSignUp=1 order by @._1688_saleNum desc limit 200",
            }]
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            $("#state").html("去掉不能报名的商品。。。");
            let item_ids = [];
            for (let i = 0; i < t[0].length; i++) {
                item_ids.push("" + t[0][i].fromid)
            }
            oo.ProductArr = t[0];
            this.a04(item_ids, oo)
        },
        a04: function (item_ids, oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/mkt/cmt/product/online/selector/verify?" + arr.join("&")
            $("#state").html("正在验证商品是否能添加进来。。。");
            let data = { "session_id": oo.session_id, "item_ids": item_ids }
            gg.postFetch(url, JSON.stringify(data), this.a05, this, oo)
        },
        a05: function (t, oo) {
            let ids = [];
            for (let i = 0; i < t.data.verified_products.length; i++) {
                if (t.data.verified_products[i].verified_models[0].check_result == 0) {
                    ids.push(t.data.verified_products[i].item_id)
                }
            }
            if (ids.length != 0) {
                $("#state").html("正在添加商品。。。");
                this.d01(ids, oo);
            }
            else {
                $("#state").html("没有可添加的商品，程序终止。");
                this.d05("", oo);
            }
        },
        /////////////////////////////////////////////////
        b01: function (fromid, arr, MinimumOrder) {
            let models = []
            for (let j = 0; j < arr.length; j++) {
                //库存要是【起订量】的20倍才能进来。因为这个要扣库存。
                if (arr[j].stock_detail.total_available_stock >= MinimumOrder * 20) {
                    models.push({
                        item_id: "" + fromid,
                        model_id: "" + arr[j].id,
                    })
                }
            }
            return models;
        },
        //////////////////////////////////////////////
        d01: function (ids, oo) {
            let arr = oo.ProductArr, recruiting_entities = [];
            for (let i = 0; i < arr.length; i++) {
                if (ids.indexOf("" + arr[i].fromid) != -1) {
                    let models = this.b01(arr[i].fromid, JSON.parse(arr[i].model_list), arr[i].MinimumOrder)
                    if (models.length) {
                        recruiting_entities.push({
                            "entity_type": 2,
                            "product": {
                                "item_id": "" + arr[i].fromid,
                                "models": models
                            }
                        })
                    }
                }
            }
            oo.item_ids = ids;//更新时要用
            this.d02(recruiting_entities, oo)
        },
        d02: function (recruiting_entities, oo) {
            let data = {
                "session_id": oo.session_id,
                "preview_no": "",
                "entity_list_data": {
                    "recruiting_entities": recruiting_entities
                },
                "fill_recommend_price": true,
                "operate_start_time": Tool.gettime("")
            }
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/mkt/cmt/preview/add?" + arr.join("&")
            $("#state").html("正在添加商品。。。");
            gg.postFetch(url, JSON.stringify(data), this.d03, this, oo)
        },
        d03: function (t, oo) {
            /*
            {
              "code": 0,
              "data": {
                "preview_no": "1797183504226050048",
                "product_failed_num": 0,
                "product_success_num": 3,
                "voucher_failed_num": null,
                "voucher_success_num": null
              },
              "msg": "OK"
            }
            */
            if (t.code == 0) {
                this.d04(oo)
            }
            else if (t.code == 329400028) {
                //添加的产品数量超过限制，可以再添加3个产品
                this.d05("", oo);
            }
            else {
                Tool.pre(["出错04", t])
            }
        },
        d04: function (oo) {
            //为什么还要更新一下？答：每次最多提交200个，而我需要更多，所以更新一下，下次提交就不会重复了
            // let data = [{
            //     action: "sqlite",
            //     database: "shopee/商品/店铺商品/" + oo.siteNum,
            //     sql: "update @.table set @.isTrueSignUp=1 where @.fromid in(" + oo.item_ids.join(",") + ")",
            // }]
            // $("#state").html("正在更新本地报名状态。。。");
            // Tool.ajax.a01(data, this.d05, this, oo)
            this.d05("", oo);
        },
        d05: function (t, oo) {
            oo.next.apply(oo.This, [oo.t])
        },
    },
})