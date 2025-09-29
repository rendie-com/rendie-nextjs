Object.assign(Tool, {
    site: function (val) {
        let name = "未知站点：" + val
        switch (val) {
            case "sg":
            case "sg2":
                name = "新加坡"; break;
            case "tw": name = "台湾虾皮"; break;
            case "th": name = "泰国"; break;
            case "my": name = "马来西亚"; break;
            case "vn": name = "越南"; break;
            case "ph": name = "菲律宾"; break;
            case "br": name = "巴西"; break;
            case "mx":
            case "mx2":
                name = "墨西哥"; break;
            case "co": name = "哥伦比亚"; break;
            case "cl": name = "智利"; break;
        }
        return name + "（" + val + "）"
    },
    siteArr: function () {
        return [
            ["sg", "新加坡"],
            ["sg2", "新加坡"],
            ["tw", "台湾虾皮"],
            ["th", "泰国"],
            ["my", "马来西亚"],
            ["vn", "越南"],
            ["ph", "菲律宾"],
            ["br", "巴西"],
            ["mx", "墨西哥"],
            ["mx2", "墨西哥"],
            ["co", "哥伦比亚"],
            ["cl", "智利"],
        ]
    },
    siteNum: function (site, num) {
        return site + ("" + num == "1" ? "" : num)
    },
    siteLanguage: function (site) {
        let language
        switch (site) {
            case "tw": language = "zh-TW"; break;
            case "ph":
            case "sg":
            case "my":
                language = "en"; break;
            case "br": language = "pt"; break;
            case "cl":
            case "co":
            case "mx":
                language = "es"; break;
            case "vn": language = "vi"; break;
            case "th": language = "th"; break;
        }
        return language
    },
    tab: function (jsFile, site, arr, num) {
        let li = [];
        for (let i = 0; i < arr.length; i++) {
            li.push('<li' + (num - 1 == i ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=' + site + '&num=' + (i + 1) + '\')">' + arr[i].shopName + '</li>')
        }
        let html = '\
        <ul class="makeHtmlTab" style="padding-left:25px;">\
            <li'+ (site == "sg" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=sg\')">新加坡</li>\
            <li'+ (site == "tw" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=tw\')">台湾虾皮</li>\
            <li'+ (site == "th" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=th\')">泰国</li>\
            <li'+ (site == "my" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=my\')">马来西亚</li>\
            <li'+ (site == "vn" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=vn\')">越南</li>\
            <li'+ (site == "ph" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=ph\')">菲律宾</li>\
            <li'+ (site == "br" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=br\')">巴西</li>\
            <li'+ (site == "mx" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=mx\')">墨西哥</li>\
            <li'+ (site == "co" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=co\')">哥伦比亚</li>\
            <li'+ (site == "cl" ? ' class="hover"' : '') + ' onclick="Tool.main(\'jsFile=' + jsFile + '&site=cl\')">智利</li>\
        </ul><ul class="makeHtmlTab">'+ li.join("") + '</ul>'
        return html;
    },
    profitRate: {
        //已知shopee的信息算利润率
        a01: function (discountNum, input_normal_price, scale, MinimumOrder, _1688_maxPrice, _1688_freight, unitWeight, logistics, siteObj, num) {
            let discountPrice = (input_normal_price * (1 - discountNum / 100))//折后价
            let discountPricetaxRate = discountPrice + discountPrice * (siteObj.taxRate / 100)
            let discountMinimumOrder = this.b01(MinimumOrder, discountPrice, siteObj.fullPrice * num, siteObj.taxRate)//满15的购买量
            //平台费 = 折后价 * (佣金费率 + 活动服务费率 + 交易手续费率)
            let PlatformFees = discountPrice * (siteObj.commissionRate / 100 + siteObj.activityServiceRate / 100 + siteObj.transactionFees / 100)
            let PlatformFeesStr = "-" + discountNum.toFixed(4) + "%\n\
满件数 = " + discountMinimumOrder + "件（订单满" + siteObj.currency_symbol + (siteObj.fullPrice * num) + "应该买的件数）\n\
折后价 = 原价  * (1 - 折扣 / 100)\n\
       = "+ input_normal_price + " * (1 - " + discountNum.toFixed(4) + " / 100)\n\
       = "+ input_normal_price + " * " + (1 - discountNum / 100).toFixed(4) + "\n\
       = "+ discountPrice.toFixed(4) + "\n\n\
税率 = " + siteObj.taxRate + "%\n\
税后折扣价 = 折扣价 + 折扣价 * 税率\n\
           = "+ discountPrice.toFixed(4) + " + " + discountPrice.toFixed(4) + " * " + (siteObj.taxRate / 100) + "\n\
           = "+ discountPricetaxRate.toFixed(2) + "\n\
\n\
平台费 = 折后价 * (佣金费率 + 活动服务费率 + 交易手续费率)\n\
       = "+ discountPrice.toFixed(4) + " * (" + (siteObj.commissionRate / 100) + " + " + (siteObj.activityServiceRate / 100) + " + " + (siteObj.transactionFees / 100) + ")\n\
       = "+ discountPrice.toFixed(4) + " * " + (((siteObj.commissionRate / 100) + (siteObj.activityServiceRate / 100) + (siteObj.transactionFees / 100))).toFixed(4) + "\n\
       = "+ PlatformFees.toFixed(4)
            //////////////////////////////////////////////
            //满价格 = (折后价 - 平台费) * 满件数
            let amountReceived = (discountPrice - PlatformFees) * discountMinimumOrder;
            let amountReceivedStr = "\
满价格 = (折后价 - 平台费) * 满件数\n\
     = ("+ discountPrice.toFixed(4) + " - " + PlatformFees.toFixed(4) + ") * " + discountMinimumOrder + "\n\
     = "+ (discountPrice - PlatformFees).toFixed(4) + " * " + discountMinimumOrder + "\n\
     = "+ amountReceived.toFixed(4) + "\n\n\
满总额 = 税后折扣价 * 满件数\n\
         = "+ discountPricetaxRate.toFixed(4) + " * " + discountMinimumOrder + "\n\
         = "+ (discountPricetaxRate * discountMinimumOrder).toFixed(2)
            ///////////////////////////////////////////////////////////////
            //成本 = (采购价 * 件倍数 * 满件数 + 运费 + 贴单费) * 汇率
            let cost = (_1688_maxPrice * scale * discountMinimumOrder + _1688_freight + 3) * siteObj.exchangeRate
            let costStr = "运费 = " + _1688_freight + "元\n\
成本 = (采购价 * 件倍数 * 满件数 + 运费 + 贴单费) * 汇率\n\
     = ("+ _1688_maxPrice + " * " + scale + " * " + discountMinimumOrder + " + " + _1688_freight + " + 3) * " + siteObj.exchangeRate + "\n\
     = ("+ (_1688_maxPrice * scale * discountMinimumOrder).toFixed(4) + " + " + _1688_freight + " + 3) * " + siteObj.exchangeRate + "\n\
     = "+ (_1688_maxPrice * scale * discountMinimumOrder + _1688_freight + 3).toFixed(4) + " * " + siteObj.exchangeRate + "\n\
     = "+ cost.toFixed(2)
            //////////////////////////////////////////
            let freight = Tool.logistics.b03(unitWeight * 1000 * discountMinimumOrder * scale, logistics, "Seller")//跨境物流成本（藏价）
            let freightStr = "单位重量 = " + (unitWeight * 1000) + "克\n\
跨境物流成本（藏价） = " + freight[0]
            //////////////////////////////////////////
            let profit = amountReceived - cost - parseFloat(freight[1])
            let profitStr = "\
利润 = 实收 - 成本 - 跨境物流成本（藏价） \n\
     = " + amountReceived.toFixed(4) + " - " + cost.toFixed(2) + " - " + freight[1] + "\n\
     = " + profit.toFixed(4)
            ////////////////////////////////////////////////////
            let profitRate = profit / cost * 100
            let profitRateStr = "利润率 = 利润 / 成本 * 100 = " + profit.toFixed(2) + " / " + cost.toFixed(2) + " * 100 = " + profitRate.toFixed(2) + "%"
            /////////////////////////////////////
            let oo = {
                txt: PlatformFeesStr + "\n\n" + amountReceivedStr + "\n\n" + costStr + "\n\n" + freightStr + "\n\n" + profitStr + "\n\n" + profitRateStr,
                profit: profit.toFixed(2),
                profitRate: Number(profitRate.toFixed(0)),
            }
            return oo
        },
        //算计买家满15的【最低购买量】
        b01: function (MinimumOrder, price1, fullPrice, taxRate) {
            let price2 = price1 + price1 * (taxRate / 100)//税后
            while (price2 * MinimumOrder < fullPrice) {
                MinimumOrder++;
            }
            return MinimumOrder;
        },
    },
    maxPrice: {
        //取最高价，和起订量，和件倍数
        a01: function (sku) {
            let arr = sku.currentPrices
            let maxPriceObj = arr[0];
            for (let i = 1; i < arr.length; i++) {
                if (parseFloat(arr[i].price) > parseFloat(maxPriceObj.price)) {//取最高价的起订量（因为批发价的价格只会越来越小。）
                    maxPriceObj = arr[i];
                }
            }
            //说明：【currentPrices】里面的价格是批发价格，会比【skuMap】的价格要低。
            return {
                price: this.b01(sku),//取最高价
                beginAmount: maxPriceObj.beginAmount,//起订量
                scale: (sku.scale ? sku.scale : 1),//1688单件够买量（件倍数）
            }
        },
        b01: function (sku_1688)//统一价格（选最高价格）
        {
            let arr = sku_1688.skuMap, maxPrice = 0
            if (arr) {//如果没有价格，那就是统一价格
                for (let i = 0; i < arr.length; i++) {
                    if (parseFloat(arr[i].price) > maxPrice) {//取最大
                        maxPrice = parseFloat(arr[i].price);
                    }
                }
            }
            if (maxPrice == 0) {
                for (let i = 0; i < sku_1688.currentPrices.length; i++) {
                    if (parseFloat(sku_1688.currentPrices[i].price) > maxPrice) {//取最大
                        maxPrice = parseFloat(sku_1688.currentPrices[i].price);
                    }
                }
            }
            return maxPrice;
        },
    },    
})