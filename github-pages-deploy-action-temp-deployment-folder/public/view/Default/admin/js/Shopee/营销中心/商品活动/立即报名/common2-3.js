Object.assign(Tool, {
    common2: {
        a01: function (seller, site, num, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/mkt/cmt/get_landing_page_campaign_list?" + arr.join("&")
            let data = { "campaign_scene": [], "view_flag": 1, "pagination": { "offset": 0, "limit": 100, "sort_type": 9 } }
            $("#state").html("正在获取活动个数。。。");
            gg.postFetch(url, JSON.stringify(data), this.a03, this, oo)
        },
        a03: function (t, oo) {
            if (t.code == 0) {
                Tool.apply({
                    D2: t.data.pagination.total_cnt,
                    Darr: t.data.list
                }, oo.next, oo.This, oo.t)
            } else {
                Tool.pre(["出错01", t])
            }
        },
    },
    common3: {
        a01: function (seller, site, num, campaign_id, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                campaign_id: campaign_id,
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
            let url = "https://seller.shopee.cn/api/mkt/cmt/session/get_session_list_for_sc_v2?" + arr.join("&")
            let data = {
                "campaign_scene": "CAMPAIGN_SCENE_PRODUCT_PROMOTION_CAMPAIGN",
                "page_info": { "offset": 0, "limit": 20 },
                "view_type": 0,
                "mechanic_label_ids": [],
                "sorting": 7,
                "campaign_id": "" + oo.campaign_id,
                "recruiting_type": 2
            }
            $("#state").html("正在进入子活动报名页面。。。");
            gg.postFetch(url, JSON.stringify(data), this.a03, this, oo)
        },
        a03: function (t, oo) {
            if (t.code == 0) {
                let Earr = t.data.list, Narr = [];
                for (let i = 0; i < Earr.length; i++) {
                    //Earr[i].status=1       表示可以报名
                    if (Earr[i].status == 1) {
                        Narr.push(Earr[i])
                    }
                }
                Tool.apply({
                    E2: Narr.length,
                    Earr: Narr
                }, oo.next, oo.This, oo.t)
            } else {
                Tool.pre(["出错02", t])
            }
        },
    }
});