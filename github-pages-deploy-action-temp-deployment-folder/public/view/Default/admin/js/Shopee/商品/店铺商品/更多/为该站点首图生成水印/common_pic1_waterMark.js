'use strict';
Object.assign(Tool, {
    common_pic1_waterMark:
    {
        a01: function (proid, pic1, key, seller, site, num, siteNum, dom, next, This, t) {
            let oo = {
                proid: proid,
                pic1: pic1,//这个是“全球商品”中的图片，所以一定是没有水印的。
                key: key,
                seller: seller,
                site: site,
                num: num,
                siteNum: siteNum,
                dom: dom,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo)
        },
        a02: function (oo) {
            //为什么要用“or”?答：因为这个店铺图片，有可能是有没水印的，也有可能是有水印的。
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/shopee首图",
                sql: "select " + Tool.fieldAs("width,height,src," + oo.siteNum + "_watermark") + " FROM @.table where @.proid='" + oo.proid + "' limit 1",
            }]
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (t[0].length == 0 || t[0][0].width == 0) {
                //修复首图
                //首图表内没有，该图片。可能在详情或属性图里面。
                this.d01(oo)
            }
            else {
                //说明是有数据没水印。
                oo.dom.pic1A.html(this.b01(t[0][0].src));
                if (t[0][0][oo.siteNum + "_watermark"]) {
                    //跳过
                    //Tool.pre(["有水印要跳过吗？", t[0][0][oo.siteNum + "_watermark"]])
                    this.a07("", oo)
                }
                else {
                    this.a04(t[0][0], oo);
                }
            }
        },
        a04: function (t, oo) {
            oo.src = t.src;//保存还要用到这个。
            let url = "https://s-cf-sg.shopeesz.com/file/" + oo.src;
            $("#state").html('正在生成水印图...');
            if (oo.siteNum == "my") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.com.my/choice.my", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "co") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.com.co/cuponsjl.co", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "cl") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.cl/accessory.cl", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "th") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.co.th/sale.th", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "vn") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.vn/1688.vn", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "ph") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.ph/accessory.ph", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "br") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.com.br/cupons.br", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "tw") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.tw/discount.tw", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "sg") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.sg/accessory.sg", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "sg2") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.sg/jewelry..sg", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "mx") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.com.mx/accessory.mx", oo.key, this.a05, this, oo)
            } else if (oo.siteNum == "mx2") {
                Tool.drawPic1WaterMark.a01(url, t.width, t.height, "https://shopee.com.mx/coupons.mx", oo.key, this.a05, this, oo)
            }
            else {
                Tool.pre("还没开发2025.1.13。。。" + oo.siteNum)
            }
        },
        a05: function (blob, oo) {
            oo.temp_pic = URL.createObjectURL(blob)
            oo.dom.pic1B.html('<img src="' + oo.temp_pic + '" width="500">')
            $("#state").html("正在上传图片...");
            Tool.upPic.a01(oo.temp_pic, oo.seller, oo.site, oo.num, this.a06, this, oo);//上传图片
        },
        a06: function (src, oo) {
            URL.revokeObjectURL(oo.temp_pic);//方法释放使用URL
            oo.temp_pic = null;
            oo.dom.pic1B.html(this.b01(src))
            $("#state").html("正在更新数据...");
            if (oo.site) {
                //说明：这里要用“@.src”，不能用“@.pic1”。因为“@.pic1”有可能是水印图。
                //@.isPic1WaterMark=1      表示【已生成首图水印】
                let data = [{
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee首图",
                    sql: "update @.table set @." + oo.siteNum + "_watermark='" + src + "' where @.proid='" + oo.proid + "'",
                }]
                Tool.ajax.a01(data, this.a07, this, oo)
            }
            else {
                Tool.pre(["出错", oo])
            }
        },
        a07: function (t, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "update @.table set @.isPic1WaterMark=1 where @.proid='" + oo.proid + "'",
            }]
            Tool.ajax.a01(data, this.a08, this, oo)
        },
        a08: function (t, oo) {
            $("#state").html("下一步...");
            oo.next.apply(oo.This, [oo.t]);
        },
        ////////////////////////////////////////////////
        b01: function (pic) {
            let html = "\
             <a href=\"https://s-cf-sg.shopeesz.com/file/" + pic + "\" target=\"_blank\">\
                 <img src=\"https://s-cf-sg.shopeesz.com/file/"+ pic + "_tn\" class=\"img-fluid rounded w100\">\
             </a>"
            return html;
        },
        ////////////////////////////////////////////////////////////////////////////
        d01: function (oo) {
            //修复首图
            //注：这里不用填写"or",因为在重新设置首图的时后，不可能把水印图传过来。
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/shopee放大镜图",
                sql: "select " + Tool.fieldAs("width,height,hash,size,addtime") + " FROM @.table where @.src='" + oo.pic1 + "' limit 1",
            }, {
                action: "sqlite",
                database: "shopee/商品/图片/1688属性图",
                sql: "select " + Tool.fieldAs("width,height,hash,size,addtime") + " FROM @.table where @.src='" + oo.pic1 + "' limit 1",
            }]
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (t[0].length != 0) {
                this.e01(t[0][0], oo)
            }
            else if (t[1].length != 0) {
                this.e01(t[1][0], oo)
            }
            else {
                $("#state").html("都没没有，那就添加一个...");
                this.d03(oo)
            }
        },
        d03: function (oo) {
            let pic = "https://s-cf-sg.shopeesz.com/file/" + oo.pic1
            Tool.getImgBase64.a01(pic, this.d04, this, oo)
        },
        d04: function (t, oo) {
            oo.pic = {
                addtime: Tool.gettime(""),
                size: Tool.getBase64ImageSize(t.base64),
                src: oo.pic1,
                width: t.width,
                height: t.height
            }
            Tool.GetAvgHash.a01(t.base64, this.d05, this, oo)
        },
        d05: function (t, oo) {
            oo.pic.hash = t
            this.e01(oo.pic, oo)
        },
        ///////////////////////////////////////////////////
        e01: function (pic, oo) {
            $("#state").html("正在更新数据...");
            let updateArr = [
                '@.tw_watermark=null',
                '@.my_watermark=null',
                '@.br_watermark=null',
                '@.width=' + pic.width,
                '@.height=' + pic.height,
                '@.size=' + pic.size,
                '@.addtime=' + pic.addtime,
                "@.hash='" + pic.hash + "'",
                "@.src='" + oo.pic1 + "'",
            ]
            let data = [
                {
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee首图",
                    sql: "select @.proid FROM @.table where @.proid='" + oo.proid + "'",
                    list: [{
                        action: "sqlite",
                        database: "shopee/商品/图片/shopee首图",
                        sql: "update @.table set " + updateArr.join(",") + " where @.proid='" + oo.proid + "'"
                    }],
                    elselist: [{
                        action: "sqlite",
                        database: "shopee/商品/图片/shopee首图",
                        sql: "insert into @.table(@.proid,@.src,@.hash,@.addtime,@.width,@.height,@.size)values('" + oo.proid + "','" + oo.pic1 + "','" + pic.hash + "'," + pic.addtime + "," + pic.width + "," + pic.height + "," + pic.size + ")",
                    }]
                },
            ]
            Tool.ajax.a01(data, this.e02, this, oo)
        },
        e02: function (t, oo) {
            if (t[0][0].list[0].length == 0) {
                $("#state").html("修复好了...");
                this.a02(oo)
            }
            else {
                Tool.pre(["更新出错：", t])
            }
        },
    }
})