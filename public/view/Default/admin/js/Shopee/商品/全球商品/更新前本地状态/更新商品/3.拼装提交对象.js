'use strict';
Object.assign(Tool, {
    common3:
    {
        a01: function (obj, seller, next, This, t) {
            let oo = {
                obj: obj,
                seller: seller,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let unitweight
            if (oo.obj.shopee.GlobalPro.manualreview_1688_unitweight) {
                unitweight = oo.obj.shopee.GlobalPro.manualreview_1688_unitweight;
            }
            else {
                unitweight = oo.obj._1688.proList.unitweight;//说明：1688的重量，可以填4位小数。
            }
            ////////////////////////////////
            let name
            if (oo.obj.shopee.GlobalPro.manualreview_1688_subject) {
                name = oo.obj.shopee.GlobalPro.manualreview_1688_subject
            }
            else {
                name = this.b03(oo.obj._1688.proList.subject, oo.obj._1688.prodes.attr)
            }
            this.a03(unitweight, name, oo)
        },
        a03: function (unitweight, name, oo) {
            let _1688_sku = JSON.parse(oo.obj._1688.prodes.sku);
           
            let descriptionArr = this.b04(
                oo.obj.shopee.GlobalPro.list[0][0].manualreview_1688_description,
                oo.obj.post.description,
                oo.obj._1688.proList.unit,
                _1688_sku.startAmount,
                _1688_sku.sellUnit
            )
            ////////////////////////////////////
            let images = this.b02(oo.obj.shopee.GlobalPro.pic, JSON.parse(oo.obj.shopee.GlobalPro.list[0][0].shopee_8pic))
            if (images.length == 9) {//9个放大镜图
                oo.obj.post.name = name;
                oo.obj.post.unitweight = unitweight;
                oo.obj.post.images = images;
                oo.obj.post.descriptionArr = descriptionArr;
                Tool.apply(oo.obj, oo.next, oo.This, oo.t)
            }
            else {
                Tool.pre("必须要9个放大镜图.")
            }
        },
        //////////////////////////////////////////////////////////////////
        b01: function (title, value) {
            //例如：https://detail.1688.com/offer/667240254545.html     R640734           品牌        e－Manco / 壹门阔
            title = title.replace("&amp;", "&")
            value = value.replace("－", "")
            let arr = value.split("/")
            title = title.replace(arr[0], "");
            if (arr.length == 2) title = title.replace(arr[1], "");
            return title;
        },
        b02: function (pic, shopee_8pic)//要9张图片
        {
            if (shopee_8pic) {
                shopee_8pic.unshift(pic)//数组向前添加
                return shopee_8pic;
            }
            else {
                Tool.pre("必须先选放大镜图片")
                aaaaaaaaaaaaaaa
            }
        },
        b03: function (title, attr) {
            title = title.toLowerCase().replace(/亚马逊|批发|速卖通|跨境|外贸|现货|厂家直销|工厂|wish|直销|pdd|专供|供应|厂家直供|ebay|代发|厂家|混批|logo/g, "")
            for (let i = 0; i < attr.length; i++) {
                if (attr[i].name == "品牌") {
                    title = this.b01(title, attr[i].value.toLowerCase())
                }
            }
            return Tool.Trim(title);
        },
        b04: function (manualreview_1688_description, description, unit, startAmount, sellunit) {
            //manualreview_1688_description         表示最终拼好的内容
            //description                           表示1688接好的属性
            //unit                                  单位：如：包
            //startAmount                           起订量：如【按包起批1包=100个】，则表示：100个。
            //sellunit                              如：个
            let des1 = this.b05(startAmount, sellunit, unit);//验证并修改单位。
            let unitStr = "";
            if (manualreview_1688_description) {
                let arr = manualreview_1688_description.split("\n")
                if (arr[0] + "\n" == des1) {
                    unitStr = manualreview_1688_description
                }
                else {
                    //有数据时，单位还不一样。
                    //Tool.pre(["有数据时，单位还不一样", manualreview_1688_description, des1, startAmount])
                    arr.shift();
                    unitStr = des1 + arr.join("\n")
                }
            }
            else {
                unitStr = des1 + description
            }
            let html = '<tr><td class="right">商品描述：</td><td colspan="2">' + unitStr.split("\n").join("<br/>") + '</td></tr>'
            $("#tbody").append(html);
            let des2 = unitStr + '\
        \n\
        你好，谢谢你光临我们的商店！\n\
        我们确保我们的服务和产品质量良好，值得信赖。\n\
        如果您对该产品有任何疑问，请随时给我们留言！🥰 ❤️\n\
        \n\
        ♥️1.当我们收到你的订单时，我们会尽快把包裹寄出去。\n\
        ♥️2.当你拿到包裹时，以及你对物品和服务是否满意。请给我们留下五星反馈和精美的图片。我们将不胜感激。\n\
        ♥️3.如有任何问题，请在提出争议或给我们留下负面反馈之前与我们联系。我们将尽力解决问题。\n\
        ♥️4.您可以在Shopee上留言与我们联系\n\
        \n\
        ✨ 如果你喜欢我们的产品，请记得关注我们❤️'
            //向我们展示，赢得秘密礼物！
            return [des2, unitStr];
        },
        b05: function (startAmount, sellunit, unit) {
            let des1 = ""
            //注：在1688中看到如【按包起批1包=100个】的内容时，那在个单时只能填100的倍数。
            if (startAmount > 1) {
                des1 = "✅ 单位:" + sellunit + " (1件=1" + sellunit + ",1" + sellunit + "=" + startAmount + unit + ") \n"
            }
            else {
                des1 = "✅ 单位:" + unit + (unit == "件" ? "" : "(1件=1" + unit + ")") + " \n"
            }
            return des1;
        },
    },
})