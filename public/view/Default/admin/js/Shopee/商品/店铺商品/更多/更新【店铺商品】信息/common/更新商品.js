'use strict';
Object.assign(Tool, {
    update_product:
    {
        a01: function (seller, site, std_tier_variation_list, model_list, shop_product_fromid, name, description, min_purchase_limit, wholesale_list, video, discount, manualreview_1688_unitweight, startAmount, images, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                std_tier_variation_list: std_tier_variation_list,
                model_list: model_list,
                shop_product_fromid: shop_product_fromid,
                name: name,
                description: description,
                min_purchase_limit: min_purchase_limit,
                wholesale_list: wholesale_list,
                video,
                images: images,
                ///////下面的内容保存要用////////////////////////////
                discount: discount,
                manualreview_1688_unitweight: manualreview_1688_unitweight,
                startAmount: startAmount,
                //////////////////////////////////
                next: next,
                This: This,
                t: t
            }
            let logistics_channels = this.b01(site)//shopee的物流方式
            if (logistics_channels) {
                this.a02(oo)
            }
            else {
                Tool.pre(["运费出错", logistics_channels])
            }
        },
        a02: function (oo) {
            //总结经验：修改价格，容易被冻结店铺。
            //修改商品都会被审核，要少修改。
            let data = {
                "product_id": oo.shop_product_fromid,//店铺商品ID
                "product_info": {
                    "logistics_channels": oo.logistics_channels,//运费
                    "name": oo.name,//标题
                    "description_info": {
                        "description": (oo.description + this.b02(oo.site)).substring(0, 3000),//详情
                        "description_type": "normal"
                    },
                    "min_purchase_limit": oo.min_purchase_limit,//最低购买数量
                    "max_purchase_limit": {//最高购买数量
                        "type": 1,//依订单
                        "purchase_limit": oo.min_purchase_limit * 100//最低购买数量 * 100
                    },
                    "images": oo.images,//放大镜
                    "std_tier_variation_list": oo.std_tier_variation_list,//属性和属性图
                    "model_list": oo.model_list,//价格
                    "wholesale_list": oo.wholesale_list,//批发
                    "video_list": oo.video//视频
                },
                "is_draft": false
            }
            this.a03(data, oo)
        },
        a03: function (data, oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[obj.params.site].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/product/update_product_info?" + pArr.join("&")
            $("#state").html("正在更新。。。");
            gg.postFetch(url, JSON.stringify(data), this.a04, this, oo)
        },
        a04: function (t, oo) {
            if (t.msg == "success") {
                //@.price_uptime=' + Tool.gettime("")+ ',
                let data = [{
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + obj.params.site,
                    sql: 'update @.table set @.self_uptime=@.uptime-1,@.scale=' + oo.startAmount + ',@.unitWeight=' + oo.manualreview_1688_unitweight + ',@.MinimumOrder=' + oo.min_purchase_limit + ',@.min_purchase_limit=' + oo.min_purchase_limit + ',@.discount=' + oo.discount + ' where @.fromid=' + oo.shop_product_fromid,
                }]
                $("#state").html("正在更新本地商品状态。。。");
                Tool.ajax.a01(data, this.a05, this, oo);
            }
            else if (t.user_message == "You cannot edit this field as the item is under Shopee review.") {
                Tool.at("您无法编辑此字段，因为该商品正在接受Shopee审核。");
            }
            else if (t.user_message == "Product is duplicate with another product in the same shop") {
                Tool.at("商品重复，请修改首图，再继续。");
            }
            else if (t.code == 1000100252) {
                //由于产品有促销活动，无法更新变量C Anel de Letrab的价格。
                //标题太长也不行
                Tool.pre(t)
                $("#state").html("正在更新本地商品状态[001]。。。");
                //Tool.ajax.a01(data, this.a05, this, oo);
            }
            else if (t.user_message = "Cannot update price for variationN Anel de Letrabecause the product has promotion") {
                //参加“折扣活动”，就会出现这个错误，删除活动就可以修改了。
                $("#state").html("由于产品有促销活动，无法更新变量C Anel de Letrab的价格。");
                Tool.pre(["aaaaaaaaa", t])
                //this.obj.A1++;
                //this.d01();
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        a05: function (t, oo) {
            $("#state").html("更新成功。");
            oo.next.apply(oo.This, [oo.t]);
        },
        ////////////////////////////////   
        b01: function (site) {
            let logistics_channels = false;
            if (site == "my") {
                logistics_channels = [
                    { "size": 0, "price": "4.90", "cover_shipping_fee": false, "enabled": true, "channelid": 28016, "sizeid": 0 },//Standard Delivery (最大 30公斤)
                    { "size": 0, "price": "0.00", "cover_shipping_fee": false, "enabled": false, "channelid": 28052, "sizeid": 0 },//Economy Delivery (Sea Shipping)(最大 100公斤)
                    { "size": 0, "price": "3.50", "cover_shipping_fee": false, "enabled": false, "channelid": 28056, "sizeid": 0 }//Self Collection (Shopee Xpress)(最大 12公斤)
                ]
            }
            else if (site == "tw") {
                logistics_channels = [
                    { "channelid": 38066, "sizeid": 0, "size": 0, "price": "45", "cover_shipping_fee": false, "enabled": false },//蝦皮海外 - 蝦皮店到店
                    { "channelid": 38017, "sizeid": 0, "size": 0, "price": "0", "cover_shipping_fee": false, "enabled": false },//蝦皮海外 - OK MART（海運）
                    { "channelid": 38010, "sizeid": 0, "size": 0, "price": "20", "cover_shipping_fee": false, "enabled": false },//蝦皮海外 - 宅配（海運）
                    { "channelid": 38025, "sizeid": 0, "size": 0, "price": "10", "cover_shipping_fee": false, "enabled": false },//蝦皮海外 - 萊爾富（海運）
                    { "channelid": 38018, "sizeid": 0, "size": 0, "price": "10", "cover_shipping_fee": false, "enabled": true }//蝦皮海外 - 7-11（海運）
                ]
            }
            else if (site == "br") {
                logistics_channels = [
                    { "size": 0, "price": "13.00", "cover_shipping_fee": false, "enabled": true, "channelid": 90001, "sizeid": 0 }//Expresso padrão (最大 30公斤)
                ]
            }
            else if (site == "sg") {
                logistics_channels = [
                    { "size": 0, "price": "0.00", "cover_shipping_fee": false, "enabled": true, "channelid": 18098, "sizeid": 0 },//Pick Locker (Overseas)(最大 3公斤)                    
                    { "size": 0, "price": "0.00", "cover_shipping_fee": false, "enabled": true, "channelid": 18099, "sizeid": 0 },//Shopee Collection Point (Overseas)(最大 5公斤)
                    { "size": 0, "price": "1.49", "cover_shipping_fee": false, "enabled": true, "channelid": 18025, "sizeid": 0 }//Doorstep Delivery (Overseas)(最大 20公斤)    
                ]
            }
            return logistics_channels;
        },
        b02: function () {
            //马来语
            let ms = '\n\n\
Hello dan terima kasih kerana melawat kedai kami!\n\
Kami memastikan perkhidmatan dan produk kami adalah berkualiti dan boleh dipercayai.\n\
Jika anda mempunyai sebarang pertanyaan tentang produk ini, sila tinggalkan mesej kepada kami! 🥰 ❤️\n\
\n\
♥️1. Apabila kami menerima tempahan anda, kami akan menghantar bungkusan itu secepat mungkin.\n\
♥️2 Apabila anda mendapat pakej, dan sama ada anda berpuas hati dengan barangan dan perkhidmatan. Sila tinggalkan kami maklum balas lima bintang dan gambar yang hebat. Sebarang bantuan amatlah dihargai. \n\
♥️3 Jika anda mempunyai sebarang pertanyaan, sila hubungi kami sebelum membangkitkan pertikaian atau meninggalkan maklum balas negatif kepada kami. Kami akan cuba sedaya upaya untuk menyelesaikan masalah tersebut.\n\
♥️4 Anda boleh tinggalkan mesej di Shopee untuk menghubungi kami\n\
\n\
        ✨ Jika anda menyukai produk kami, sila ingat untuk mengikuti kami❤️'
            //台湾
            let tw = '\n\n\
你好，謝謝你光臨我們的商店！\n\
我們確保我們的服務和產品品質良好，值得信賴。\n\
如果您對該產品有任何疑問，請隨時給我們留言！ 🥰 ❤️\n\
\n\
♥️1.當我們收到你的訂單時，我們會盡快把包裹寄出去。\n\
♥️2.當你拿到包裹時，以及你對物品和服務是否滿意。請給我們留下五星反饋和精美的圖片。我們將不勝感激。\n\
♥️3.如有任何問題，請在提出爭議或給我們留下負面反饋之前與我們聯繫。我們將盡力解決問題。\n\
♥️4.您可以在Shopee上留言與我們聯繫\n\
\n\
✨ 如果你喜歡我們的產品，請記得關注我們❤️'
            //英语
            let en = '\n\n\
Hello and thank you for visiting our store!\n\
We ensure that our services and products are of good quality and trustworthy.\n\
If you have any questions about this product, please feel free to leave us a message! 🥰 ❤️\n\
\n\
♥️1. When we receive your order, we will send the package out as soon as possible.\n\
♥️2. When you get the package, and whether you are satisfied with the items and services.Please leave us five - star feedback and great pictures.Any help would be greatly appreciated.\n\
♥️3. If you have any questions, please contact us before raising a dispute or leaving us negative feedback.We will try our best to solve the problem.\n\
♥️4. You can leave a message on Shopee to contact us\n\
\n﻿\
✨ If you like our products, please remember to follow us❤️';
            //巴西站点，不可以说“礼物”。
            let pt = '\n\n\
Olá e obrigado por visitar nossa loja!\n\
Garantimos que nossos serviços e produtos sejam de boa qualidade e confiáveis.\n\
Se você tiver alguma dúvida sobre este produto, sinta - se à vontade para nos deixar uma mensagem! 🥰 ❤️\n\
\n\
✨ Se você gosta de nossos produtos, lembre - se de nos seguir❤️'
            return this.b03(tw, ms, en, pt);
        },
        b03: function (tw, ms, en, pt) {
            let name = "";
            if (obj.params.site == "my") {
                name = en;
            }
            else if (obj.params.site == "br") {
                name = pt;
            }
            else if (obj.params.site == "tw") {
                name = tw;
            }
            return name;
        },
    }
})
// e02: function (sku, freight, oo) {
//     let o2 = {
//         shopPro_fromid: oo.tmpObj.shopPro_fromid,//店铺商品ID
//         proid: oo.proid,//商品编码
//         pic: oo.pic,//原始首图
//         manualreview_1688_fromid: oo.manualreview_1688_fromid,//1688的来源ID
//         GlobalPro_fromid: oo.fromid,
//         GlobalPro_video: oo.video,//视频
//         startAmount: sku.startAmount,//件倍数
//         name: oo.tmpObj.name,//标题
//         description: oo.tmpObj.description + this.b02(),//详情
//         discount: oo.discount,//准备好的折扣
//         unitWeight: oo.manualreview_1688_unitweight,//重量
//     }
//     if (o2.description.length > 3000) {
//         o2.description = oo.tmpObj.description;
//     }
// },

