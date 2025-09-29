'use strict';
Object.assign(Tool, {
    common1:
    {
        //获取商品信息
        a01: function (A2, seller, next, This, t) {
            let oo = {
                seller: seller,
                next: next,
                This: This,
                t: t,
                //////////////////////
                shopee: {
                    GlobalPro: {},//一条全球商品表的信息
                    A2: A2,
                },
                _1688: {
                    _1688_proList: {},//一条1688列表信息
                    _1688_prodes: {},//一条1688详情信息
                    _1688_category: {},//一条1688类目信息
                },
            }
            this.a02(oo);
        },
        a02: function (oo) {
            $("#state").html("正在获取商品信息。。。");
            let where = " where @.isup=1 and @.BeforeReview=0 and @.ManualReview_1688_status=1"
            // and @.ManualReview_1688_state=0
            //where=" where @.isup=1 and @.proid='R600284'"
            $("#where").html(where);
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select " + Tool.fieldAs("ManualReview_1688_video_status,proid,pic,manualreview_1688_unitweight,manualreview_1688_subject,fromid,manualreview_1688_fromid") + " FROM @.table" + where + " limit 1",
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品/${proid_100:proid}",
                    sql: "select " + Tool.fieldAs("video,ExplanationVideo,shopee_8pic,manualreview_1688_description") + " FROM @.table where @.proid='${proid}' limit 1",
                }]
            }]
            if (oo.shopee.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select count(1) as total FROM @.table" + where
                })
            }
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (t[0].length == 0) {
                $("#state").html("全部完成");
            }
            else {
                oo.shopee.GlobalPro = t[0][0]
                if (oo.shopee.A2 == 0) { oo.shopee.A2 = t[1][0].total; }
                let data = [{
                    action: "sqlite",
                    database: "1688/采集箱/商品列表/" + Tool.remainder(oo.shopee.GlobalPro.manualreview_1688_fromid, 100),
                    sql: "select " + Tool.fieldAs("categoryid,unitweight,deliverylimit,freight,subject,unit") + " FROM @.table where @.fromid=" + oo.shopee.GlobalPro.manualreview_1688_fromid
                }, {
                    action: "sqlite",
                    database: "1688/采集箱/商品列表/详情/" + Tool.remainder(oo.shopee.GlobalPro.manualreview_1688_fromid, 1000),
                    sql: "select " + Tool.fieldAs("attr,sku,attrpic_shopee") + " FROM @.table where @.fromid=" + oo.shopee.GlobalPro.manualreview_1688_fromid
                }]
                $("#state").html("正在获取1688信息。。。");
                Tool.ajax.a01(data, this.a04, this, oo);
            }
        },
        a04: function (t, oo) {
            oo._1688.proList = t[0][0];
            oo._1688.prodes = t[1][0];
            let data = [{
                action: "sqlite",
                database: "1688/类目/现货类目",
                sql: "select " + Tool.fieldAs("catnamepath,bindshopee") + " FROM @.table where @.fromid=" + t[0][0].categoryid
            }]
            Tool.ajax.a01(data, this.a05, this, oo);
        },
        a05: function (t, oo) {
            oo._1688.category = t[0][0];
            Tool.apply({
                shopee: oo.shopee,
                _1688: oo._1688,
            }, oo.next, oo.This, oo.t)
        },
    },
})