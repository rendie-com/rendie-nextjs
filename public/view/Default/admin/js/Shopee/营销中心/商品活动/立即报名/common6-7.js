Object.assign(Tool, {
    common6: {
        a01: function (seller, site, num, session_id, preview_no, Farr, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                session_id: session_id,
                preview_no: preview_no,
                Farr: Farr,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/mkt/cmt/preview/edit?" + arr.join("&")
            let data = {
                "session_id": oo.session_id,
                "preview_no": oo.preview_no,
                "update_product_preview_infos": [{
                    "nomination_ids": oo.Farr.nomination_ids,
                    "campaign_price_type": 1,
                    "campaign_stock": "" + oo.Farr.campaign_stock,//库存
                    "campaign_price": "" + oo.Farr.campaign_price//价格
                }],
                "types": [2]
            }
            $("#state").html("正在开始修改折扣。。。");
            gg.postFetch(url, JSON.stringify(data), this.a03, this, oo)
        },
        a03: function (t, oo) {
            /*
            {
              "code": 0,
              "data": {
                "operate_preview_product_result_map": {【出错就有数据】},
                "operate_preview_voucher_result_map": null
              },
              "msg": "OK"
            }
            */
            if (t.code == 0) {
                //每次只修改一条，所以这么写。
                let errObj = {}, o1 = t.data.operate_preview_product_result_map
                for (let k in o1) {
                    errObj = {
                        fromid: k,
                        model_list: this.b01(o1[k].operate_preview_model_result_map)
                    }
                }
                Tool.apply(errObj, oo.next, oo.This, oo.t)
            }
            else if (t.code == 329400021) {
                //Execute call GetMetricValues failed RPCRequest failed:: command:item.spu.calc_cross_platform_rule_advice_price, code:10000
                Tool.apply({}, oo.next, oo.This, oo.t)
            }
            else {
                Tool.pre(["出错05", t])
            }
        },
        //////////////////////////////////////
        b01: function (oo) {
            let arr = []
            for (let k in oo) {
                arr.push(k)
            }
            return arr;
        },
    },
    common7: {
        a01: function (seller, site, num, session_id, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                session_id: session_id,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/mkt/cmt/preview/submit_entity_online?" + arr.join("&")
            let data = {
                "session_id": oo.session_id,
                "entity_type": 2,
                "confirm_risky": false
            }
            $("#state").html("正在提交。。。");
            gg.postFetch(url, JSON.stringify(data), this.a03, this, oo);
        },
        a03: function (t, oo) {
            /*
            {
              "code": 0,
              "data": {
                "is_async": null,
                "product_result": {
                  "failed_item_num": 0,
                  "failed_list_url": null,
                  "failed_model_num": 0,
                  "risky_model_num": 0,
                  "success_item_num": 2,
                  "success_model_num": 10
                },
                "task": null,
                "voucher_result": null
              },
              "msg": "success"
            }
            */
            if (t.code == 0) {
                oo.next.apply(oo.This, [oo.t]);
            }
            else {
                Tool.pre(["出错05", t])
            }
        },

    }
});