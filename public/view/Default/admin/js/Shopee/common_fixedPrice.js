Object.assign(Tool, {
    fixedPrice: {
        //已知1688的信息开始定价
        a01: function (_1688_maxPrice, scale, _1688_MinimumOrder, _1688_freight, siteObj, unitWeight, logistics, discount) {
            let r = {}
            if (unitWeight) {
                let oo = {
                    _1688_maxPrice: _1688_maxPrice,//1688最高单价
                    scale: scale,//件倍数
                    _1688_MinimumOrder: _1688_MinimumOrder,//1688最小够买量
                    _1688_freight: _1688_freight,//1688运费
                    siteObj: siteObj,//站点配置
                    unitWeight: unitWeight,//重量
                    logistics: logistics,//物流模板
                    discount: discount,//计划折扣                      
                }
                r = this.b01(_1688_maxPrice * 0.1, oo);
            }
            return r;
        },
        //满多少还有10%利润定价
        b01: function (upPrice, oo) {
            //要记得：免费活动，只免了买家运费，没有免卖家运费，所以要在包邮门槛，把运费加进去，别亏本。
            //在满多少包邮的情况下,还有10%的利润，如果没有就【上调价格】，直到有为止。
            ////////////////////////////////////////////////////////////
            //打折后[不含平台费] = (1688最高单价 + 上调价格) * 件倍数 * 汇率 
            let price01 = (oo._1688_maxPrice + upPrice) * oo.scale * oo.siteObj.exchangeRate
            //打折后[含平台费]
            let discountPrice = this.b02(price01, oo.siteObj);
            //算计买家满多少的【最低购买量】
            let MinimumOrder = this.b03(oo._1688_MinimumOrder, discountPrice, oo.siteObj.fullPrice, oo.siteObj.taxRate);
            return this.b04(upPrice, MinimumOrder, discountPrice, oo)
        },
        //打折后[含平台费]
        b02: function (price2, siteObj) {
            //price2            打折后[不含平台费] = 1688最高单价 + 上调价格 * 汇率 
            //打折后[含平台费] = 打折后[不含平台费] / (1 - 佣金费率 - 活动服务费率 - 交易手续费率)
            let Rate = 1 - siteObj.commissionRate / 100 - siteObj.activityServiceRate / 100 - siteObj.transactionFees / 100
            let discountPrice = price2 / Rate//店铺商品价格
            return discountPrice
        },
        //算计买家满多少的【最低购买量】
        b03: function (MinimumOrder, price1, fullPrice, taxRate) {
            let price2 = price1 + price1 * (taxRate / 100)//税后
            while (price2 * MinimumOrder < fullPrice) {
                MinimumOrder++;
            }
            return MinimumOrder;
        },
        b04: function (upPrice, MinimumOrder, discountPrice, oo) {
            //为什么要“*1000”？因为是按克算的，我的是千克，所以要“*1000”。
            let Weight = oo.unitWeight * 1000 * MinimumOrder * oo.scale//重量
            //跨境物流成本[藏价]
            let freight2 = Tool.logistics.b03(Weight, oo.logistics, "Seller")
            //免运价[不含平台费] = (1688最高单价 + 上调价格) * 汇率 * 件数 * 件倍数 
            let price01 = (oo._1688_maxPrice + upPrice) * oo.siteObj.exchangeRate * MinimumOrder * oo.scale
            //采购成本 = (采购价 * 件数 * 件倍数 + 运费 + 贴单费) * 汇率
            let price02 = (oo._1688_maxPrice * MinimumOrder * oo.scale + oo._1688_freight + 3) * oo.siteObj.exchangeRate
            //利润 = 免运价[不含平台费] - 跨境物流成本[藏价]  - 采购成本
            let price03 = price01 - parseFloat(freight2[1]) - price02
            //采购利润率 = 利润 / 采购成本 * 100
            let price05 = price03 / price02 * 100;
            return this.b05(upPrice, price01, price02, price03, price05, MinimumOrder, discountPrice, freight2, oo)
        },
        b05: function (upPrice, price01, price02, price03, price05, MinimumOrder, discountPrice, freight2, oo) {
            $("#state").html("采购利润率：" + price05 + "%;上调价格：" + upPrice)
            if (price05 < -100) {
                $("#state").html("上调100%价格：" + upPrice)
                return this.b01(upPrice * 2, oo)
            }
            else if (price05 < 0) {
                $("#state").html("上调1%价格：" + upPrice)
                return this.b01(upPrice + upPrice * 0.1, oo)
            }
            else if (price05 < 10) {
                $("#state").html("上调1%价格：" + upPrice)
                return this.b01(upPrice + upPrice * 0.01, oo)
            }
            else if (price05 > 10.1 && price05 < 10.5) {
                $("#state").html("下调0.1%价格：" + upPrice);
                return this.b01(upPrice - upPrice * 0.001, oo)
            }
            else {
                $("#state").html("采购利润率：" + price05 + "%");
                return this.b06(upPrice, price01, price02, price03, price05, MinimumOrder, discountPrice, freight2, oo)
            }
        },
        b06: function (upPrice, price01, price02, price03, price05, MinimumOrder, discountPrice, freight2, oo) {
            let price1 = (oo._1688_maxPrice + upPrice) * oo.scale * oo.siteObj.exchangeRate
            let Rate = 1 - (oo.siteObj.commissionRate / 100) - (oo.siteObj.activityServiceRate / 100) - oo.siteObj.transactionFees / 100
            let price2 = (price1 / (1 - oo.discount / 100) / Rate)
            return {
                min_purchase_limit: MinimumOrder,//要运费最低购买量
                discountPrice: discountPrice,//打折后[含平台费]
                price: price2.toFixed(4),//shopee定价[折扣前]
                str: this.b07(price1, price2, price01, price02, price03, price05, upPrice, Rate, discountPrice, MinimumOrder, freight2, oo)
            }
        },
        b07: function (price1, price2, price01, price02, price03, price05, upPrice, Rate, discountPrice, MinimumOrder, freight2, oo) {
            let arr = [
                "1688最高单价 = " + oo._1688_maxPrice + "（人民币）",
                "1688单件够买量 = " + oo.scale + "（件倍数）",
                "1688最小够买量 = " + oo._1688_MinimumOrder,
                "运费 = " + oo._1688_freight + "（人民币）",
                "满" + oo.siteObj.fullPrice + "金额【最低购买量】 = " + MinimumOrder,
                "上调价格 = " + upPrice.toFixed(4) + "（人民币）",
                "",
                "折后价[不含平台费] = (1688最高单价 + 上调价格) * 件倍数 * 汇率",
                " = (" + oo._1688_maxPrice + " + " + upPrice.toFixed(4) + ") * " + oo.scale + " * " + oo.siteObj.exchangeRate + "",
                " = " + ((oo._1688_maxPrice + upPrice) * oo.scale).toFixed(4) + " * " + oo.siteObj.exchangeRate,
                " = " + price1.toFixed(4) + "（当地币）",
                "",
                " 打折后[含平台费] =  折后价[不含平台费] / (1 - 佣金费率 - 活动服务费率 - 交易手续费率)",
                " = " + price1.toFixed(4) + " / (1 - " + (oo.siteObj.commissionRate / 100) + " - " + (oo.siteObj.activityServiceRate / 100) + " - " + (oo.siteObj.transactionFees / 100) + ")",
                " = " + price1.toFixed(4) + " / " + Rate.toFixed(4) + "",
                " = " + discountPrice.toFixed(4),
                "",
                "税后折扣价 = 打折后[含平台费] * (1 + 税率)",
                " = " + discountPrice.toFixed(4) + " * (1 + " + (oo.siteObj.taxRate / 100) + " )",
                " = " + (discountPrice * (1 + (oo.siteObj.taxRate / 100))).toFixed(4) + "（当地币）",
                "",
                "免运价[不含平台费] = 折后价[不含平台费] * 件数 = " + price1.toFixed(4) + " * " + MinimumOrder + " = " + price01.toFixed(2) + "（当地币）",
                "",
                "单位重量 = " + (oo.unitWeight * 1000) + "（克）",
                "跨境物流成本[藏价] = " + freight2[0] + "（当地币）",
                "",
                "采购成本 = (采购价  * 件数 * 件倍数 + 运费 + 贴单费) * 汇率",
                " = (" + oo._1688_maxPrice + " * " + MinimumOrder + " * " + oo.scale + " + " + oo._1688_freight + " + 3) * " + oo.siteObj.exchangeRate,
                " = " + (oo._1688_maxPrice * MinimumOrder * oo.scale + oo._1688_freight + 3).toFixed(4) + " * " + oo.siteObj.exchangeRate + "",
                " = " + price02.toFixed(4) + "（当地币）",
                "",
                "利润 = 免运价[不含平台费] - 跨境物流成本[藏价] - 采购成本",
                " = " + price01.toFixed(4) + " - " + freight2[1] + " - " + price02.toFixed(4),
                " = " + price03.toFixed(4) + "（当地币）",
                "",
                "采购利润率 = 利润 / 采购成本 * 100",
                " = " + price03.toFixed(4) + " / " + price02.toFixed(4) + " * 100",
                " = " + price05.toFixed(4) + "%",
                "",
                "最终定价 = 折后价[不含平台费]  / (1-折扣) / (1 - 佣金费率 - 活动服务费率 - 交易手续费率)",
                " = " + price1.toFixed(4) + "  / " + (1 - oo.discount / 100).toFixed(4) + " / (1 - " + (oo.siteObj.commissionRate / 100) + " - " + (oo.siteObj.activityServiceRate / 100) + " - " + (oo.siteObj.transactionFees / 100) + ")",
                " = " + price1.toFixed(4) + "  / " + (1 - oo.discount / 100).toFixed(4) + " / " + Rate.toFixed(4) + "",
                " = " + price2.toFixed(2),
            ]
            return arr.join("\n")
        },
    },
})