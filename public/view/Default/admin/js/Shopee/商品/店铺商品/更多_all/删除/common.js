'use strict';
Object.assign(Tool, {
    delete_product: {
        a01: function (seller, site, num, progress, where, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                where: where,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                products: []
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let where = "where " + this.b01(oo.where);
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select @.fromid as fromid,@.proid as proid FROM @.table " + where + " limit 10",
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as count FROM @.table " + where,
                })
            }
            $("#state").html("正在获取商品信息。。。");
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = Math.ceil(t[1][0].count / 10); }
            oo.products = t[0];
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d01, this, this.e01, oo)
        },
        /////////////////////////////////////    
        b01: function (where1) {
            let where2 = "@.status<>-5 and @.saleNum=0 and @." + where1
            if (where1 == "status=0") { where2 = "@.status<>-5 and @." + where1 }
            //@.newDiscount>=56 or @.newDiscount<8 or @.isSeckill=0
            //@.newDiscount>=56     表示【最终折扣<=56】<br/>\
            //@.isSeckill=0         表示【不能做秒杀】<br/>\
            $("#where").html(where2 + "<hr/>\
            @.status<>-5          表示不要【删除失败】<br/>\
            @.saleNum=0           表示要【无销量】<br/>\
            @.status=0            表示【状态 &rArr; 0.未知】<br/>\
            @.ExceptionType=2     表示【商品异常类型 &rArr; 2.最终折扣>=56】<br/>\
            @.ExceptionType=3     表示【商品异常类型 &rArr; 3.最终折扣<8】<br/>\
            @.ExceptionType=6     表示【商品异常类型 &rArr; 6.更新后违规类型_不匹配】<br/>\
            @.ExceptionType=8     表示【商品异常类型 &rArr; 8.手动审核后1688商品状态_不匹配】<br/>\
            @.ExceptionType=9     表示【商品异常类型 &rArr; 9.修改状态_不匹配】");
            return where2;
        },
        /////////////////////////////////////    
        d01: function (oo) {
            let arr = [], products = oo.products;
            for (let i = 0; i < products.length; i++) { arr.push(products[i].fromid); }
            let nArr = { product_id_list: arr }
            let pArr = [
                "version=3.1.0",
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/product/delete_product/?" + pArr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在删除shopee商品。。。");
            gg.postFetch(url, JSON.stringify(nArr), this.d02, this, oo)
        },
        d02: function (t, oo) {
            if (t.code == 0 || t.code == 1000105005) {
                //1000105005                无法删除项目：锁定：｛项目ID:24882549804，[锁定ID:51，消息：MPSKU有促销，无法删除MPSKU]｝
                $("#state").html("正在删除本地商品。。。");
                this.d03(t.data.result, oo)
            }
            else {
                Tool.pre(["出错：", t])
            }
        },
        d03: function (arr, oo) {
            let fromidArr = [], failedArr = [], data = []
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].code == 0) {
                    fromidArr.push(arr[i].id)
                }
                else {
                    failedArr.push(arr[i].id)
                }
            }
            if (fromidArr.length != 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "delete from @.table where @.fromId in (" + fromidArr.join(",") + ")",
                })
                for (let i = 0; i < oo.products.length; i++) {
                    if (fromidArr.indexOf(oo.products[i].fromid) != -1) {
                        data.push({
                            action: "sqlite",
                            database: "shopee/商品/店铺商品/" + oo.siteNum + "/" + Tool.pronum(oo.products[i].proid, 100),
                            sql: "delete from @.table where @.proid='" + oo.products[i].proid + "'",
                        })
                    }
                }
            }
            if (failedArr.length != 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: 'update @.table set @.status=-5 where @.fromid in(' + failedArr + ')',
                })
            }
            Tool.ajax.a01(data, this.d04, this, oo);
        },
        d04: function (t, oo) {
            $("#state").html("这一页下架完成。。。");
            oo.A1++;
            oo.products = []
            this.a02(oo);
        },
        //////////////////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})