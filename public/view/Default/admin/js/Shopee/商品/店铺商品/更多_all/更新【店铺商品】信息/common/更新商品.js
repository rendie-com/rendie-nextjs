'use strict';
Object.assign(Tool, {
    update_product:
    {
        a01: function (seller, site, num, siteNum, std_tier_variation_list, model_list, products, name, description, min_purchase_limit, wholesale_list, video_list, discount, manualreview_1688_unitweight, startAmount, images, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: Tool.int(num) - 1,
                siteNum: siteNum,
                std_tier_variation_list: std_tier_variation_list,
                model_list: model_list,
                products: products,
                name: name,
                description: (description + this.b01(site)).substring(0, 3000),
                min_purchase_limit: min_purchase_limit,
                wholesale_list: wholesale_list,
                video_list: video_list,
                images: images,
                ///////下面的内容保存要用////////////////////////////
                discount: discount,
                manualreview_1688_unitweight: manualreview_1688_unitweight,
                startAmount: startAmount,
                //////////////////////////////////
                next: next,
                This: This,
                t: t,
            }
            this.a02(oo);
        },
        a02: function (oo) {
            //总结经验：修改价格，容易被冻结店铺。
            //修改商品都会被审核，要少修改。
            let isupdata = false,//是否要更新
                data = {
                    product_id: oo.products.fromid,//店铺商品ID
                    product_info: {},
                    is_draft: false
                }
            if (oo.name != oo.products.name) { isupdata = true; data.product_info.name = oo.name; }
            if (oo.description != oo.products.list[0][0].description) {
                isupdata = true;
                data.product_info.description_info = {
                    description: oo.description,//详情
                    description_type: "normal"
                };
            }
            if (oo.products.MinimumOrder != oo.min_purchase_limit) {
                isupdata = true;
                data.product_info.min_purchase_limit = oo.min_purchase_limit//最低购买数量
                data.product_info.max_purchase_limit = {//最高购买数量
                    type: 1,//依订单
                    purchase_limit: oo.min_purchase_limit * 100//最低购买数量 * 100
                }
            }
            //放大镜
            if (JSON.stringify(oo.images) != oo.products.list[0][0].images) { isupdata = true; data.product_info.images = oo.images; }
            if (JSON.stringify(oo.std_tier_variation_list) != oo.products.list[0][0].std_tier_variation_list) {
                isupdata = true;
                data.product_info.std_tier_variation_list = oo.std_tier_variation_list;//价格属性和属性图
                data.product_info.model_list = oo.model_list;//价格
            }
            //批发
            if (JSON.stringify(oo.wholesale_list) != oo.products.list[0][0].wholesale_list) { isupdata = true; data.product_info.wholesale_list = oo.wholesale_list; }
            //视频
            let video_list = JSON.parse(oo.products.list[0][0].video_list)
            if (video_list && video_list[0] && oo.video_list[0].video_id != video_list[0].video_id) { isupdata = true; data.product_info.video_list = oo.video_list; }
            if (isupdata) {
                this.a03(data, oo);
            }
            else {
                $("#state").html("完全一样，不用更新。。。");
                this.d03(oo);
            }
        },
        a03: function (data, oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/product/update_product_info?" + pArr.join("&")
            $("#state").html("正在更新。。。");
            gg.postFetch(url, JSON.stringify(data), this.a04, this, oo);
        },
        a04: function (t, oo) {
            if (t.msg == "success") {
                this.d03(oo);
            }
            // else if (t.user_message == "You cannot edit this field as the item is under Shopee review.") {
            //     Tool.at("您无法编辑此字段，因为该商品正在接受Shopee审核。");
            // }
            // else if (t.user_message == "Product is duplicate with another product in the same shop") {
            //     Tool.at("商品重复，请修改首图，再继续。");
            // }
            else if (t.code == 1000100252) {
                //由于产品有促销活动，无法更新变量C Anel de Letrab的价格。
                //标题太长也不行
                this.d01(-6, "由于产品有促销活动，无法更新变量", oo.products.fromid, oo)
            }
            else if (t.code == 252 || t.code == 1000300025) {
                Tool.Time("name", 1000, this.a02, this, oo)
            }
            // else if (t.user_message = "Cannot update price for variationN Anel de Letrabecause the product has promotion") {
            //     //参加“折扣活动”，就会出现这个错误，删除活动就可以修改了。
            //     $("#state").html("由于产品有促销活动，无法更新变量C Anel de Letrab的价格。");
            //     Tool.pre(["aaaaaaaaa", t])
            //     //this.obj.A1++;
            //     //this.d01();
            // }
            else { Tool.pre(["出错001", t]); }
        },
        /////////////////////////////////////////////////
        d01: function (status, note, fromid, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "update @.table set @.self_uptime=@.uptime-1,@.status=" + status + ",@.note=" + Tool.rpsql(note) + " where @.fromid=" + fromid,
            }]
            $("#state").html("正在更新本地商品状态[001]。。。");
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            $("#state").html("更新成功。");
            oo.next.apply(oo.This, [oo.t]);
        },
        d03: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: 'update @.table set @.self_uptime=@.uptime-1,@.note=null,@.name=' + Tool.rpsql(oo.name) + ',@.MinimumOrder=' + oo.min_purchase_limit + ' where @.fromid=' + oo.products.fromid,
            }, {
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum + "/" + Tool.pronum(oo.products.proid, 100),
                sql: "update @.table set @.description=" + Tool.rpsql(oo.description) + ",@.images=" + Tool.rpsql(JSON.stringify(oo.images)) + ",@.std_tier_variation_list=" + Tool.rpsql(JSON.stringify(oo.std_tier_variation_list)) + ",@.wholesale_list=" + Tool.rpsql(JSON.stringify(oo.wholesale_list)) + ",@.video_list=" + Tool.rpsql(JSON.stringify(oo.video_list)) + " where @.proid='" + oo.products.proid + "'",
            }]
            $("#state").html("正在更新本地商品状态。。。");
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        ////////////////////////////////   
        b01: function (site) {
            let oo = {
                //马来语
                ms: '\n\n\
Hello dan terima kasih kerana melawat kedai kami!\n\
Kami memastikan perkhidmatan dan produk kami adalah berkualiti dan boleh dipercayai.\n\
Jika anda mempunyai sebarang pertanyaan tentang produk ini, sila tinggalkan mesej kepada kami! 🥰 ❤️\n\
\n\
♥️1. Apabila kami menerima tempahan anda, kami akan menghantar bungkusan itu secepat mungkin.\n\
♥️2 Apabila anda mendapat pakej, dan sama ada anda berpuas hati dengan barangan dan perkhidmatan. Sila tinggalkan kami maklum balas lima bintang dan gambar yang hebat. Sebarang bantuan amatlah dihargai. \n\
♥️3 Jika anda mempunyai sebarang pertanyaan, sila hubungi kami sebelum membangkitkan pertikaian atau meninggalkan maklum balas negatif kepada kami. Kami akan cuba sedaya upaya untuk menyelesaikan masalah tersebut.\n\
♥️4 Anda boleh tinggalkan mesej di Shopee untuk menghubungi kami\n\
\n\
 ✨ Jika anda menyukai produk kami, sila ingat untuk mengikuti kami❤️',
                //台湾
                tw: '\n\n\
你好，謝謝你光臨我們的商店！\n\
我們確保我們的服務和產品品質良好，值得信賴。\n\
如果您對該產品有任何疑問，請隨時給我們留言！ 🥰 ❤️\n\
\n\
♥️1.當我們收到你的訂單時，我們會盡快把包裹寄出去。\n\
♥️2.當你拿到包裹時，以及你對物品和服務是否滿意。請給我們留下五星反饋和精美的圖片。我們將不勝感激。\n\
♥️3.如有任何問題，請在提出爭議或給我們留下負面反饋之前與我們聯繫。我們將盡力解決問題。\n\
♥️4.您可以在Shopee上留言與我們聯繫\n\
\n\
✨ 如果你喜歡我們的產品，請記得關注我們❤️',
                //英语
                en: '\n\n\
Hello and thank you for visiting our store!\n\
We ensure that our services and products are of good quality and trustworthy.\n\
If you have any questions about this product, please feel free to leave us a message! 🥰 ❤️\n\
\n\
♥️1. When we receive your order, we will send the package out as soon as possible.\n\
♥️2. When you get the package, and whether you are satisfied with the items and services.Please leave us five - star feedback and great pictures.Any help would be greatly appreciated.\n\
♥️3. If you have any questions, please contact us before raising a dispute or leaving us negative feedback.We will try our best to solve the problem.\n\
♥️4. You can leave a message on Shopee to contact us\n\
\n﻿\
✨ If you like our products, please remember to follow us❤️',
                //巴西站点，不可以说“礼物”。
                pt: '\n\n\
Olá e obrigado por visitar nossa loja!\n\
Garantimos que nossos serviços e produtos sejam de boa qualidade e confiáveis.\n\
Se você tiver alguma dúvida sobre este produto, sinta - se à vontade para nos deixar uma mensagem! 🥰 ❤️\n\
\n\
✨ Se você gosta de nossos produtos, lembre - se de nos seguir❤️',
                es: 'Hola, ¡gracias por visitar nuestra tienda!\n\
Aseguramos que nuestros servicios y productos sean de alta calidad y confiables.\n\
Si tiene alguna pregunta sobre este producto, ¡no dude en enviarnos un mensaje! 🥰❤️\n\
\n\
♥️1. Cuando recibamos tu pedido, te enviaremos el paquete lo antes posible.\n\
♥️2. Cuando recibas el paquete, si estás satisfecho con los artículos y el servicio. Déjanos una reseña de cinco estrellas y excelentes fotografías. Cualquier ayuda sería muy apreciada.\n\
♥️3. Si tiene alguna pregunta, comuníquese con nosotros antes de abrir una disputa o dejarnos un comentario negativo. Haremos todo lo posible para resolver este problema.\n\
♥️4. Puedes contactarnos a través del mensaje de Shopee.\n\
\n\
✨Si te gustan nuestros productos, recuerda seguirnos❤️',
                vi: 'Xin chào, cảm ơn bạn đã ghé thăm cửa hàng của chúng tôi! \n\
Chúng tôi đảm bảo rằng các dịch vụ và sản phẩm của chúng tôi có chất lượng tốt và đáng tin cậy. \n\
Nếu bạn có bất kỳ câu hỏi nào về sản phẩm này, vui lòng nhắn tin cho chúng tôi! 🥰 ❤️\n\
\n\
♥️1. Khi nhận được đơn hàng của bạn, chúng tôi sẽ gửi hàng sớm nhất có thể. \n\
♥️2. Khi bạn nhận được gói hàng và bạn có hài lòng với sản phẩm và dịch vụ hay không. Hãy để lại cho chúng tôi phản hồi năm sao và những bức ảnh đẹp. Bất kỳ sự giúp đỡ nào cũng sẽ được đánh giá cao. \n\
♥️3. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi trước khi mở tranh chấp hoặc để lại phản hồi tiêu cực. Chúng tôi sẽ cố gắng hết sức để giải quyết vấn đề. \n\
♥️4. Bạn có thể liên hệ với chúng tôi bằng cách để lại tin nhắn trên Shopee\n\
\n\
✨ Nếu bạn thích sản phẩm của chúng tôi, hãy nhớ theo dõi chúng tôi❤️',
                th: 'สวัสดีขอขอบคุณที่มาเยี่ยมชมร้านค้าของเรา! \n\
เรารับประกันว่าบริการและผลิตภัณฑ์ของเราเป็นคุณภาพดีและเชื่อถือได้ \n\
หากคุณมีคำถามใด ๆ เกี่ยวกับผลิตภัณฑ์นี้ โปรดอย่าลังเลที่จะส่งข้อความถึงเรา! 🥰 ❤️\n\
\n\
♥️1. เมื่อเราได้รับคำสั่งซื้อของคุณแล้ว เราจะส่งพัสดุออกไปโดยเร็วที่สุด \n\
♥️2. เมื่อคุณได้รับแพคเกจแล้ว และคุณพอใจกับสินค้าและบริการหรือไม่ กรุณาให้ข้อเสนอแนะระดับ 5 ดาวและรูปภาพสวยๆ แก่เรา ความช่วยเหลือใด ๆ จะได้รับการชื่นชมอย่างมาก \n\
♥️3. หากมีคำถามใดๆ โปรดติดต่อเราก่อนที่จะเปิดข้อโต้แย้งหรือแสดงความคิดเห็นเชิงลบ เราจะพยายามอย่างดีที่สุดเพื่อแก้ไขปัญหานี้ \n\
♥️4.สามารถติดต่อเราได้โดยการฝากข้อความไว้ที่ Shopee\n\
\n\
✨ หากคุณชอบผลิตภัณฑ์ของเรา โปรดอย่าลืมติดตามเรา ❤️'
            }
            let language
            switch (site) {//选择JS文件
                case "tw": language = "tw"; break;
                case "ph":
                case "sg":
                case "my":
                    language = "en"; break;
                case "br": language = "pt"; break;
                case "mx": language = "es"; break;
                case "vn": language = "vi"; break;
                case "th": language = "th"; break;
            }
            return oo[language];
        },
    }
})




//,@.scale=' + oo.startAmount + ',@.unitWeight=' + oo.manualreview_1688_unitweight + ',@.min_purchase_limit=' + oo.min_purchase_limit + ',@.discount=' + oo.discount + '
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
//         description: oo.tmpObj.description + this.b01(),//详情
//         discount: oo.discount,//准备好的折扣
//         unitWeight: oo.manualreview_1688_unitweight,//重量
//     }
//     if (o2.description.length > 3000) {
//         o2.description = oo.tmpObj.description;
//     }
// },
// //@.price_uptime=' + Tool.gettime("")+ ',
//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
//为什么不要运费信息。答：用默认的就行，我本来就不用改。
// if (oo.logistics_channels) { data.product_info.logistics_channels = oo.logistics_channels; }//运费
////////////////////////////////////////
// b01: function (site) {
//     //获取物流信息      https://seller.shopee.cn/api/v3/listing-upload/component/get_shipping_status?SPC_CDS=1d42910b-7fa3-44ad-a58d-724aab10cb94&SPC_CDS_VER=2
//     //                 https://seller.shopee.cn/api/v3/listing-upload/component/get_shipping_status?SPC_CDS=1d42910b-7fa3-44ad-a58d-724aab10cb94&SPC_CDS_VER=2
//     let logistics_channels = false;
//     if (site == "my") {
//         logistics_channels = [
//             { "size": 0, "price": "2.00", "cover_shipping_fee": false, "enabled": true, "channelid": 28056, "sizeid": 0 },
//             { "size": 0, "price": "4.90", "cover_shipping_fee": false, "enabled": true, "channelid": 28016, "sizeid": 0 },
//             { "size": 0, "price": "4.90", "cover_shipping_fee": false, "enabled": true, "channelid": 28059, "sizeid": 0 }
//         ]
//     }
//     else if (site == "tw") {
//         logistics_channels = [
//             { "channelid": 38066, "sizeid": 0, "size": 0, "price": "45", "cover_shipping_fee": false, "enabled": false },//蝦皮海外 - 蝦皮店到店
//             { "channelid": 38017, "sizeid": 0, "size": 0, "price": "0", "cover_shipping_fee": false, "enabled": false },//蝦皮海外 - OK MART（海運）
//             { "channelid": 38010, "sizeid": 0, "size": 0, "price": "20", "cover_shipping_fee": false, "enabled": false },//蝦皮海外 - 宅配（海運）
//             { "channelid": 38025, "sizeid": 0, "size": 0, "price": "10", "cover_shipping_fee": false, "enabled": false },//蝦皮海外 - 萊爾富（海運）
//             { "channelid": 38018, "sizeid": 0, "size": 0, "price": "10", "cover_shipping_fee": false, "enabled": true }//蝦皮海外 - 7-11（海運）
//         ]
//     }
//     else if (site == "br") {
//         logistics_channels = [
//             { "size": 0, "price": "13.00", "cover_shipping_fee": false, "enabled": true, "channelid": 90001, "sizeid": 0 }//Expresso padrão (最大 30公斤)
//         ]
//     }
//     else if (site == "sg") {
//         logistics_channels = [
//             { "size": 0, "price": "0.00", "cover_shipping_fee": false, "enabled": true, "channelid": 18098, "sizeid": 0 },//Pick Locker (Overseas)(最大 3公斤)
//             { "size": 0, "price": "0.00", "cover_shipping_fee": false, "enabled": true, "channelid": 18099, "sizeid": 0 },//Shopee Collection Point (Overseas)(最大 5公斤)
//             { "size": 0, "price": "1.49", "cover_shipping_fee": false, "enabled": true, "channelid": 18025, "sizeid": 0 }//Doorstep Delivery (Overseas)(最大 20公斤)
//         ]
//     }
//     else if (site == "mx") {
//         logistics_channels = false;
//     }
//     return logistics_channels;
// },