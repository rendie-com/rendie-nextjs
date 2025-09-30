'use strict';
Object.assign(Tool, {
    get_product_list: {
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
                products: {}
            }
            this.a02(oo);
        },
        a02: function (oo) {
            //@.ispic1watermark=0      表示【没有生成首图水印】
            //let where = " where @.proid='R154110'"
            let where = " where @.ispic1watermark=0"
            let data = [
                ///////////修复数据要用下面的代码//////////////////////////////////////////
                //{
                //     action: "sqlite",
                //     database: "shopee/商品/图片/shopee首图",
                //     sql: "update @.table set @." + oo.siteNum + "_watermark=null",
                //},
                //{
                //     action: "sqlite",
                //     database: "shopee/商品/店铺商品/" + oo.siteNum,
                //     sql: "update @.table set @.ispic1watermark=0",
                //},
                ////////////////////////////////////////////////////////////////////////
                {
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select " + Tool.fieldAs("fromid,ispic1watermark,proid,_1688_fromid") + " FROM @.table" + where + " limit 1",
                    list: [{
                        action: "sqlite",
                        database: "shopee/商品/全球商品",
                        sql: "select " + Tool.fieldAs("pic,ManualReview_1688_categoryId") + " FROM @.table where @.manualreview_1688_fromid=${_1688_fromid} limit 1",
                        list: [{
                            action: "sqlite",
                            database: "1688/类目/现货类目",
                            sql: "select @.catNamePath as catNamePath FROM @.table where @.fromid=${ManualReview_1688_categoryId} limit 1",
                        }]
                    }]
                }
            ]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as count FROM @.table" + where,
                })
            }
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = t[1][0].count; }
            oo.products = t[0][0];
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d01, this, this.e01, oo)
        },
        ///////////////////////////////////////////////////////////////
        d01: function (oo) {
            $("#proid").html(oo.products.proid);
            if (oo.products._1688_fromid == 0) {
                Tool.pre("请先操作【Shopee > 商品列表 > 店铺商品 > 1688信息_把1688信息同步过来】")
            } else {
                $("#fromid").html('<a href="https://seller.shopee.cn/portal/product/' + oo.products.fromid + '" target="_blank">' + oo.products.fromid + '</a>')
                if (oo.products.ispic1watermark) {
                    $("#state").html("已经有水印了。")
                    this.d04(oo);
                }
                else {
                    this.d02(oo)
                }
            }
        },
        d02: function (oo) {
            let typeName = oo.products.list[0][0].list[0][0].catNamePath.split(">").pop()
            if (typeName) {
                switch (oo.site) {//选择JS文件
                    case "tw":
                        $("#state").html("正在翻译成【台湾语】。。。（需要开代理）");
                        Tool.translate_name.a01(typeName, "zh-CN", "zh-TW", this.d03, this, oo);
                        break;
                    case "my":
                    case "sg":
                    case "ph":
                        $("#state").html("正在翻译成【英语】。。。（需要开代理）");
                        Tool.translate_name.a01(typeName, "zh-CN", "en", this.d03, this, oo);
                        break;
                    case "br":
                        $("#state").html("正在翻译成【葡萄牙语】。。。（需要开代理）");
                        Tool.translate_name.a01(typeName, "zh-CN", "pt", this.d03, this, oo);
                        break;
                    case "mx":
                    case "co":
                    case "cl":
                        $("#state").html("正在翻译成【西班牙语】。。。（需要开代理）");
                        Tool.translate_name.a01(typeName, "zh-CN", "es", this.d03, this, oo);
                        break;
                    case "th":
                        $("#state").html("正在翻译成【泰语】。。。（需要开代理）");
                        Tool.translate_name.a01(typeName, "zh-CN", "th", this.d03, this, oo);
                        break;
                    case "vn":
                        $("#state").html("正在翻译成【越南语】。。。（需要开代理）");
                        Tool.translate_name.a01(typeName, "zh-CN", "vi", this.d03, this, oo);
                        break;
                    default: Tool.pre("还没开发2025.1.13:20:52。。。。"); break;
                }
            }
            else {
                let str = "程序终止：   " + typeName;
                $("#state").html(str);
            }
        },
        d03: function (typeName, oo) {
            let dom = {
                pic1A: $("#pic1A"),
                pic1B: $("#pic1B"),
            }
            Tool.pic1_waterMark.a01(oo.products.proid,oo.products._1688_fromid, oo.products.list[0][0].pic, typeName, oo.seller, oo.site, oo.num, oo.siteNum, dom, this.d04, this, oo)
        },
        d04: function (oo) {
            oo.A1++;
            $("#pic1A,#pic1B").html("")
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