'use strict';
Object.assign(Tool, {
    common3:
    {
        a01: function (proid, seller, site, num, siteNum, dom, progress, next, This, t) {
            let oo = {
                proid: proid,
                seller: seller,
                site: site,
                num: num,
                siteNum: siteNum,
                dom: dom,
                progress: progress,
                next: next,
                This: This,
                t: t,
                ////////////////////////////////
                temp: {},
                A1: 1, A2: 0, Aarr: [],
                fromid: 0,
            }
            this.a02(oo);
        },
        a02: function (oo) {
            // sql:"update @.attrpic_1688 set @." + oo.site + "_watermark=null"
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select " + Tool.fieldAs("manualreview_1688_fromid") + " FROM @.table where @.proid='" + oo.proid + "'",
            }]
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            let fromid = t[0][0].manualreview_1688_fromid
            oo.dom.manualreview_1688_fromid.html('<a href="https://detail.1688.com/offer/' + fromid + '.html" target="_blank">' + fromid + '</a>')
            let data = [{
                action: "sqlite",
                database: "1688/采集箱/商品列表/详情/" + Tool.remainder(fromid, 1000),
                sql: "select " + Tool.fieldAs("attrpic_shopee") + " FROM @.table where @.fromid=" + fromid,
            }]
            oo.fromid = fromid;
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            let attrpic_shopee = t[0][0].attrpic_shopee
            if (attrpic_shopee) {
                let arr = JSON.parse(attrpic_shopee)
                oo.A2 = arr.length;
                oo.Aarr = arr;
                this.a05(oo)
            }
            else {
                $("#state").html('没有属性图...');
                this.e05(oo);
            }
        },
        a05: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d01, this, this.e05, oo)
        },
        ////////////////////////////////////////////////
        b01: function (pic) {
            let html = "\
            <a href=\"https://s-cf-sg.shopeesz.com/file/" + pic + "\" target=\"_blank\">\
                <img src=\"https://s-cf-sg.shopeesz.com/file/"+ pic + "_tn\" class=\"img-fluid rounded w100\">\
            </a>"
            return html;
        },
        ////////////////////////////////////////////////////
        d01: function (oo) {
            if (oo.Aarr[oo.A1 - 1].shopee) {
                let data = [{
                    action: "sqlite",
                    database: "shopee/商品/图片/1688属性图/" + Tool.remainder(oo.fromid, 100),
                    sql: "select " + Tool.fieldAs("width,height," + oo.siteNum + "_watermark") + " FROM @.table where @.src='" + oo.Aarr[oo.A1 - 1].shopee + "'",
                    elselist: [{
                        action: "sqlite",
                        database: "shopee/商品/图片/1688属性图/" + Tool.remainder(oo.fromid, 100),
                        sql: "INSERT INTO @.table(@.src,@.fromid,@.addtime) VALUES ('" + oo.Aarr[oo.A1 - 1].shopee + "'," + oo.fromid + "," + Tool.gettime("") + ")"
                    }]
                }]
                Tool.ajax.a01(data, this.d02, this, oo);
            }
            else {
                oo.dom.attrPicA.append('<figure class="figure border mb-1 m-1 p-1 w100 center">空位置跳过</figure>');
                oo.dom.attrPicB.append('<figure class="figure border mb-1 m-1 p-1 w100 center">空位置跳过</figure>');
                this.e04(null, oo)
            }
        },
        d02: function (t, oo) {
            if (t[0][0][oo.siteNum + "_watermark"] == null) {
                oo.dom.attrPicA.append(this.b01(oo.Aarr[oo.A1 - 1].shopee));
                this.d03(t[0][0], oo);
            }
            else if (t[0][0][oo.siteNum + "_watermark"]) {
                oo.dom.attrPicA.append('<figure class="figure border mb-1 m-1 p-1 w100 center">已上传跳过</figure>');
                oo.dom.attrPicB.append('<figure class="figure border mb-1 m-1 p-1 w100 center">已上传跳过</figure>');
                this.e04(null, oo);
            }
            else {
                Tool.pre(["出错001", t]);
            }
        },
        d03: function (t, oo) {
            let url = "https://s-cf-sg.shopeesz.com/file/" + oo.Aarr[oo.A1 - 1].shopee;
            $("#state").html('正在生成水印图...');
            if (t.width) {
                t.base64 = url
                this.e01(t, oo)
            }
            else {
                Tool.getImgBase64.a01(url, this.d04, this, oo)
            }
        },
        d04: function (t, oo) {
            t.size = Tool.getBase64ImageSize(t.base64)
            oo.temp = t;
            $("#state").html("正在获取【均值哈希】...");
            Tool.GetAvgHash.a01(t.base64, this.d05, this, oo)
        },
        d05: function (t, oo) {
            oo.temp.hash = t
            this.e01(oo.temp, oo);
        },
        //////////////////////////////////////
        e01: function (t, oo) {
            let objmsg = {
                width: t.width,
                height: t.height,
                rotate: 20,//旋转角度       int类型       默认20
                fontsize: 12,//字体大小                   默认20
                fontcolor: "255, 255, 255, 0.3",        //字体颜色  rgba类型  默认 255, 255, 255, 0.2
                density: 4,//稠密度                       数值越大，水印越多
                str: [] //水印文字           数组类型      最大三行（即lingth<=3）[必传]
            }
            switch (oo.siteNum) {
                case "my": objmsg.str = ["https://shopee.com.my/choice.my"]; break;
                case "th": objmsg.str = ["https://shopee.co.th/sale.th"]; break;
                case "vn": objmsg.str = ["https://shopee.vn/khung.vn"]; break;
                case "vn2": objmsg.str = ["https://shopee.vn/1688.vn"]; break;
                case "co": objmsg.str = ["https://shopee.com.co/cuponsjl.co"]; break;
                case "cl": objmsg.str = ["https://shopee.cl/accessory.cl"]; break;
                case "ph": objmsg.str = ["https://shopee.ph/accessory.ph"]; break;
                case "br": objmsg.str = ["https://shopee.com.br/cupons.br"]; break;
                case "tw": objmsg.str = ["https://shopee.tw/discount.tw"]; break;
                case "sg": objmsg.str = ["https://shopee.sg/accessory.sg"]; break;
                case "sg2": objmsg.str = ["https://shopee.sg/jewelry..sg"]; break;
                case "mx": objmsg.str = ["https://shopee.com.mx/accessory.mx"]; break;
                case "mx2": objmsg.str = ["https://shopee.com.mx/coupons.mx"]; break;
            }
            if (objmsg.str.length == 1) {
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else {
                Tool.pre("还没开发2025-3-7。。。");
            }
        },
        e02: function (blob, oo) {
            oo.temp.pic = URL.createObjectURL(blob)
            $("#state").html("正在上传图片...");
            Tool.upPic.a01(oo.temp.pic, oo.seller, oo.site, oo.num, this.e03, this, oo);//上传图片
        },
        e03: function (src, oo) {
            let temp = oo.temp
            URL.revokeObjectURL(temp.pic);//方法释放使用URL
            oo.dom.attrPicB.append(this.b01(src))
            $("#state").html("正在更新数据...");
            let sqlstr = ""
            if (temp.size) {
                sqlstr = ",@.width=" + temp.width + ",@.height=" + temp.height + ",@.size=" + temp.size + ",@.hash='" + temp.hash + "'"
            }
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/1688属性图/" + Tool.remainder(oo.fromid, 100),
                sql: "update @.table set @." + oo.siteNum + "_watermark='" + src + "'" + sqlstr + " where @.src='" + oo.Aarr[oo.A1 - 1].shopee + "'",
            }]
            Tool.ajax.a01(data, this.e04, this, oo)
        },
        e04: function (t, oo) {
            $("#state").html("下一步...");
            oo.A1++;
            this.a05(oo);
        },
        e05: function (oo) {
            oo.dom.attrPicA.html('');
            oo.dom.attrPicB.html('');
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})