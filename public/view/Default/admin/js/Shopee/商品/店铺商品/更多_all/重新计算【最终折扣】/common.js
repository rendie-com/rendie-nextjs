'use strict';
Object.assign(Tool, {
   get_discount: {
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
         this.d01(oo);
      },
      ////////////////////////////////////////////////////////
      b01: function (discountPrice, input_normal_price, fromid, siteNum, min_purchase_limit) {
         let newDiscount = (1 - discountPrice / input_normal_price) * 100
         return {
            newDiscountStr: " = (1 - 打折后[含平台费] / 原价) * 100<br/>\
                = (1 - "+ discountPrice + " / " + input_normal_price + ") * 100<br/>\
                = (1 - "+ discountPrice / input_normal_price + ") * 100<br/>\
                = " + newDiscount,
            data: {
               action: "sqlite",
               database: "shopee/商品/店铺商品/" + siteNum,
               sql: "update @.table set @.newDiscount=" + newDiscount.toFixed(4) + ",@.min_purchase_limit=" + min_purchase_limit + " where @.fromid=" + fromid
            }
         }

      },
      ////////////////////////////////////////////////////////
      d01: function (oo) {
         let where = " where @.status<>6 "//表示不等于【审查中】
         //where=" where @.proid='R235194'"
         let data = [{
            action: "sqlite",
            database: "shopee/商品/店铺商品/" + oo.siteNum,
            sql: "select " + Tool.fieldAs("fromid,unitweight,scale,discount,_1688_minimumorder,_1688_maxprice,_1688_freight,input_normal_price") + " FROM @.table" + where + Tool.limit(1, oo.A1, "sqlite"),
         }]
         if (oo.A2 == 0) {
            data.push({
               action: "sqlite",
               database: "shopee/商品/店铺商品/" + oo.siteNum,
               sql: "select count(1) as count FROM @.table" + where,
            })
         }
         $("#state").html("正在获取商品信息。。。");
         Tool.ajax.a01(data, this.d02, this, oo);
      },
      d02: function (t, oo) {
         if (oo.A2 == 0) { oo.A2 = Math.ceil(t[1][0].count / 1); }
         oo.products = t[0]
         Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d03, this, this.e01, oo)
      },
      d03: function (oo) {
         let data = [], isErr = false, products = oo.products, newDiscountArr = [], fromidArr = [], fixedPriceArr = [];

         for (let i = 0; i < products.length; i++) {
            let o1 = Tool.fixedPrice.a01(products[i]._1688_maxprice, products[i].scale, products[i]._1688_minimumorder, products[i]._1688_freight, oo.seller[oo.site][oo.num - 1], products[i].unitweight, oo.logistics, products[i].discount);
            if (o1.str) {
               let o2 = this.b01(o1.discountPrice, products[i].input_normal_price, products[i].fromid, oo.siteNum, o1.min_purchase_limit)
               data.push(o2.data);
               newDiscountArr.push(o2.newDiscountStr);
               fromidArr.push(products[i].fromid);
               fixedPriceArr.push(o1.str.split("\n").join("<br/>"))
            }
            else {
               isErr = true;
               break;
            }
         }
         $("#fromid").html(fromidArr.join("<hr/>"));
         $("#fixedPriceArr").html(fixedPriceArr.join("<hr/>"));
         $("#newDiscountArr").html(newDiscountArr.join("<hr/>"));
         this.d04(isErr, data, oo)
      },
      d04: function (isErr, data, oo) {
         $("#state").html("正在更新。。。");
         if (isErr) {
            $("#state").html("获取最终折扣失败，可能是没有来源数据,也可以是单位重量不对！！！");
            //this.d05();
         }
         else {
            Tool.ajax.a01(data, this.d05, this, oo);
         }
      },
      d05: function (t, oo) {
         oo.A1++;
         oo.product = [];
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






