'use strict';
Object.assign(Tool, {
    get_isDiscount: {
        a01: function (seller, site, num, progress, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                logistics: [],
                products: []
            }
            this.a02(oo);
        },
        a02: function (oo) {
            //【Shopee > 物流方式】地区费用（* 当地货币）
            Tool.logistics.a01(oo.site, $("#logistics"), this.a03, this, oo);
        },
        a03: function (logistics, oo) {
            oo.logistics = logistics;
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "update @.table set @.ExceptionType=0"
            }]
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            this.d01(oo);
        },
        //////////////////////////////
        b01: function (o1) {
            ////"@.BeforeReview<>1",//更新前本地状态 <> 1.更新成功       
            ////"@.ManualReview_1688_video_status<>7",//人工审核1688视频状态 <> 7.审核通过
            let o2 = o1.list[0][0], o3 = { iserr: false, note: "非异常", ExceptionType: 0 };
            if (o1.minimumorder != o1.min_purchase_limit) {
                o3 = { iserr: true, note: "最低购买量_不匹配", ExceptionType: 1 }
            } else if (o1.newdiscount >= 80) {
                o3 = { iserr: true, note: "最终折扣>=80", ExceptionType: 2 }
            } else if (o1.newdiscount <= 8) {
                o3 = { iserr: true, note: "最终折扣<=8", ExceptionType: 3 }
            } else if (o2.ManualReview != 9) {
                //9         表示【图片且详情审核通过】
                o3 = { iserr: true, note: "敦煌手动审核状态_不匹配", ExceptionType: 4 }
            } else if (o2.DHAfterReview != 0) {
                //0         表示【正常】
                o3 = { iserr: true, note: "敦煌审核后本地状态_不匹配", ExceptionType: 5 }
            } else if (o2.penalty_type != 0) {
                //0         表示【未违规】
                o3 = { iserr: true, note: "更新后违规类型_不匹配", ExceptionType: 6 }
            } else if (o2.ManualReview_1688_status != 1) {
                //1         表示【使用1688属性图】
                o3 = { iserr: true, note: "手动审核1688状态_不匹配", ExceptionType: 7 }
            } else if (o2.ManualReview_1688_state != 0) {
                //0         表示【正常】
                o3 = { iserr: true, note: "手动审核后1688商品状态_不匹配", ExceptionType: 8 }
            } else if (o2.editStatus > 2) {
                //0：未修改 1：第一次修改 2：第二次修改 3：货源不对
                o3 = { iserr: true, note: "修改状态_不匹配", ExceptionType: 9 }
            }
            return o3;
        },
        //////////////////////////////
        d01: function (oo) {
            //let where = " where @.proid='R406263'";
            let where = "";
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("proid,fromid,price_uptime,unitweight,scale,newdiscount,minimumorder,_1688_maxprice,_1688_freight,input_normal_price,min_purchase_limit") + " FROM @.table" + where + Tool.limit(10, oo.A1, "sqlite"),
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select " + Tool.fieldAs("ManualReview,DHAfterReview,penalty_type,ManualReview_1688_status,ManualReview_1688_state,editStatus") + " FROM @.table where @.proid='${proid}' limit 1",
                }]
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as total FROM @.table" + where,
                })
            }
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = Math.ceil(t[1][0].total / 10); }
            oo.products = t[0]
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d03, this, this.e01, oo)
        },
        d03: function (oo) {
            let data = [], day7 = Tool.gettime("") - 60 * 60 * 24 * 7;
            let isDiscount, isSignUp, isSeckill, seller = oo.seller[oo.site][oo.num - 1]
            let products = oo.products;
            for (let i = 0; i < products.length; i++) {
                let o1 = this.b01(products[i])
                if (o1.iserr) {
                    isDiscount = 0;
                    isSignUp = 0;
                    isSeckill = 0;
                }
                else {
                    //为什么要减6？答：当我在报名活动的时候平台要在我的折扣上减5，所以我就减6了。                 
                    let discount1 = Tool.profitRate.a01(products[i].newdiscount - 6, products[i].input_normal_price, products[i].scale, products[i].minimumorder, products[i]._1688_maxprice, products[i]._1688_freight, products[i].unitweight, oo.logistics, seller, 1);
                    let discount2 = Tool.profitRate.a01(products[i].newdiscount - 1, products[i].input_normal_price, products[i].scale, products[i].minimumorder, products[i]._1688_maxprice, products[i]._1688_freight, products[i].unitweight, oo.logistics, seller, 1);
                    let discount3 = Tool.profitRate.a01(products[i].newdiscount, products[i].input_normal_price, products[i].scale, products[i].minimumorder, products[i]._1688_maxprice, products[i]._1688_freight, products[i].unitweight, oo.logistics, seller, 1);
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////
                    isDiscount = discount1.profitRate >= 10 && products[i].price_uptime < day7 ? 1 : 0//改过价的不能打折，否则提示：【此页面上的11个规格在过去的7天内曾调涨价格。这将违反不实/误导性折扣政策，您将因此而被计分】
                    isSignUp = discount2.profitRate >= 10 && products[i].price_uptime < day7 ? 1 : 0
                    isSeckill = discount3.profitRate >= 10 && products[i].price_uptime < day7 ? 1 : 0
                }
                //isDiscount       表示【能否打折】
                //isSignUp         表示【能否报名】
                //isSeckill        表示【能否做秒杀】
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "update @.table set @.isDiscount=" + isDiscount + ",@.isSignUp=" + isSignUp + ",@.isSeckill=" + isSeckill + ",@.ExceptionType=" + o1.ExceptionType + " where @.fromid=" + products[i].fromid
                })
            }
            $("#state").html("正在更新。。。");
            Tool.ajax.a01(data, this.d04, this, oo)
        },
        d04: function (t, oo) {
            oo.A1++;
            oo.product = []
            this.d01(oo);
        },
        //////////////////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
});

//let oo = Tool.fixedPrice.a01(products[i]._1688_maxprice,
//    products[i].scale,
//    products[i]._1688_minimumorder,
//    products[i]._1688_freight,
//   oo.config[oo.siteNum],
//    products[i].unitweight,
//   oo.logistics,
//    products[i].newdiscount)
//$("#method").html("指定折扣 = " + oo.str.split("\n").join("<br/>"))
//let isDiscount = 0;
////定价正确且不需要改价，就可以打折
//if (oo.price == products[i].input_normal_price && products[i].price_uptime == 0) {
//    isDiscount = 1;
//}