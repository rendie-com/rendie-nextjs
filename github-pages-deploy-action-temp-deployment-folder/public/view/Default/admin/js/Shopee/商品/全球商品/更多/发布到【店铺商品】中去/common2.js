'use strict';
Object.assign(Tool, {
    common2:
    {
        //在GlobalPro中增加内容
        a01: function (GlobalPro, logistics, sellerSite, dom, next, This, t) {
            let oo = {
                GlobalPro: GlobalPro,
                logistics: logistics,//物流方式
                sellerSite: sellerSite,
                dom: dom,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo);
        },
        a02: function (oo) {
            oo.dom.html('<tr><td class="right">商品编码：</td><td colspan="2">' + oo.GlobalPro.proid + '</td></tr>');
            let data = [{
                action: "sqlite",
                database: "1688/采集箱/商品列表/" + Tool.remainder(oo.GlobalPro.manualreview_1688_fromid, 100),
                sql: "select @.freight as freight FROM @.table where @.fromid=" + oo.GlobalPro.manualreview_1688_fromid,
            }, {
                action: "sqlite",
                database: "1688/采集箱/商品列表/详情/" + Tool.remainder(oo.GlobalPro.manualreview_1688_fromid, 1000),
                sql: "select @.sku as sku FROM @.table where @.fromid=" + oo.GlobalPro.manualreview_1688_fromid,
            }]
            $("#state").html("正在获取【1688】信息。。。");
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            oo.GlobalPro._1688_prodes_sku = JSON.parse(t[1][0].sku);//后面要用
            oo.GlobalPro._1688_prodes_sku.startAmount = oo.GlobalPro._1688_prodes_sku.startAmount ? oo.GlobalPro._1688_prodes_sku.startAmount : 1
            if (oo.GlobalPro.manualreview_1688_unitweight <= 0) {
                Tool.pre(["重量小于0，程序终止。", oo.GlobalPro])
            }
            else {
                //说明：在这里用“Tool.common_price.a01”，的批发价是没什么用的，主要是要用到他的“上调价格”,“定原价”,“起订量”。
                Tool.common_price.a01(
                    oo.logistics,
                    oo.sellerSite,
                    oo.GlobalPro._1688_prodes_sku,
                    t[0][0].freight,
                    oo.GlobalPro.discount,
                    oo.GlobalPro.manualreview_1688_unitweight,
                    oo.dom,
                    this.a04,
                    this,
                    oo
                )
            }
        },
        a04: function (t, oo) {
            oo.GlobalPro.common_price = t;
            //打折前定价不能小于0.1，shopee平台有这个限制。
            if (t.discount_normal_price < 0.1) {
                //说明：加大折扣，好让定价高于0.1。
                let price1 = t.discount_normal_price * (1 - oo.GlobalPro.discount / 100)//退回打折前的价格
                let newDiscount = 0;//重新打折。
                for (let i = oo.GlobalPro.discount; i < 100; i++) {
                    let price2 = price1 / (1 - i / 100)
                    if (price2 >= 0.1) {
                        newDiscount = i;
                        break;
                    }
                }
                /////////////////////////
                if (newDiscount) {
                    //说明：这里只是在发布时改折扣。（如果是调价，应该改店铺折扣。）
                    oo.GlobalPro.discount = newDiscount;//说明：这个会改“oo.GlobalPro”内的值 。
                    let data = [{
                        action: "sqlite",
                        database: "shopee/商品/全球商品",
                        sql: "update @.table set @.discount=" + newDiscount + " where @.proid='" + oo.GlobalPro.proid + "'",
                    }]
                    Tool.ajax.a01(data, this.a05, this, oo)
                }
                else {
                    Tool.pre(["打99%的折扣，都没到0.1，说明有问题。"])
                }
            }
            else {
                //说明大于0.1
                this.a05("", oo)
            }
        },
        a05: function (t, oo) {
            Tool.apply(oo.GlobalPro, oo.next, oo.This, oo.t);
        },
    },
})