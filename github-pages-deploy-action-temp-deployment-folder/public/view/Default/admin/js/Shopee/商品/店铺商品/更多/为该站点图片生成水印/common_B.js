'use strict';
Object.assign(Tool, {
    common_B:
    {
        obj: {
            temp: {},
            B1: 1, B2: 0, Barr: []
        },
        a01: function (proid, seller, site, num, dom, next, This, t) {
            let oo = {
                proid: proid,
                seller: seller,
                site: site,
                num: num,
                dom: dom,
                next: next,
                This: This,
                t: t,
                siteNum: Tool.siteNum(site, num)
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select " + Tool.fieldAs("shopee_8pic") + " FROM @.table where @.proid='" + oo.proid + "'",
            }]
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            let shopee_8pic = t[0][0].shopee_8pic;
            if (shopee_8pic) {
                let arr = JSON.parse(shopee_8pic);
                this.obj.B2 = arr.length;
                this.obj.Barr = arr;
                this.a04(oo);
            }
            else {
                Tool.pre("【shopee_放大镜图】必须要有图片。");
            }
        },
        a04: function (oo) {
            Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d01, this, this.f01, oo);
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
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/shopee放大镜图",
                sql: "select " + Tool.fieldAs("width,height," + oo.siteNum + "_watermark") + " FROM @.table where @.src='" + this.obj.Barr[this.obj.B1 - 1] + "'",
                elselist: [{
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee放大镜图",
                    sql: "INSERT INTO @.table(@.src,@.proid,@.addtime) VALUES ('" + this.obj.Barr[this.obj.B1 - 1] + "','" + oo.proid + "'," + Tool.gettime("") + ")"
                }]
            }];
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (t[0][0][oo.siteNum + "_watermark"] == null) {
                oo.dom.picA.append(this.b01(this.obj.Barr[this.obj.B1 - 1]));
                this.d03(t[0][0], oo);
            }
            else if (t[0][0][oo.siteNum + "_watermark"]) {
                oo.dom.picA.append('<figure class="figure border mb-1 m-1 p-1 w100 center">已上传跳过</figure>');
                oo.dom.picB.append('<figure class="figure border mb-1 m-1 p-1 w100 center">已上传跳过</figure>');
                this.e04([[]], oo);
            }
            else {
                Tool.pre(["出错001", t]);
            }
        },
        d03: function (o1, o2) {
            let url = "https://s-cf-sg.shopeesz.com/file/" + this.obj.Barr[this.obj.B1 - 1];
            if (o1.width) {
                o1.base64 = url;
                this.e01(o1, o2)
            }
            else {
                Tool.getImgBase64.a01(url, this.d04, this, o2)
            }
        },
        d04: function (t, oo) {
            t.size = Tool.getBase64ImageSize(t.base64)
            this.obj.temp = t;
            $("#state").html("正在获取【均值哈希】...");
            Tool.GetAvgHash.a01(t.base64, this.d05, this, oo)
        },
        d05: function (t, oo) {
            this.obj.temp.hash = t
            this.e01(this.obj.temp, oo);
        },
        ////////////////////////////////////////////////////////////////////
        e01: function (t, oo) {
            $("#state").html('正在生成水印图...');
            let objmsg = {
                width: t.width,
                height: t.height,
                rotate: 20,//旋转角度       int类型       默认20
                fontsize: 12,//字体大小                   默认20
                fontcolor: "255, 255, 255, 0.3",        //字体颜色  rgba类型  默认 255, 255, 255, 0.2
                density: 4,//稠密度                       数值越大，水印越多
                str: [] //水印文字           数组类型      最大三行（即lingth<=3）[必传]
            }
            if (oo.siteNum == "my") {
                objmsg.str = ["https://shopee.com.my/choice.my"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "th") {
                objmsg.str = ["https://shopee.co.th/sale.th"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "vn") {
                objmsg.str = ["https://shopee.vn/1688.vn"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            } else if (oo.siteNum == "co") {
                objmsg.str = ["https://shopee.com.co/cuponsjl.co"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "cl") {
                objmsg.str = ["https://shopee.cl/accessory.cl"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "ph") {
                objmsg.str = ["https://shopee.ph/accessory.ph"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "br") {
                objmsg.str = ["https://shopee.com.br/cupons.br"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "tw") {
                objmsg.str = ["https://shopee.tw/discount.tw"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "sg") {
                objmsg.str = ["https://shopee.sg/accessory.sg"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "sg2") {
                objmsg.str = ["https://shopee.sg/jewelry..sg"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "mx") {
                objmsg.str = ["https://shopee.com.mx/accessory.mx"];
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else if (oo.siteNum == "mx2") {
                objmsg.str = ["https://shopee.com.mx/coupons.mx"];
                alert("ffffffffffffffffffffffffff")
                //Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo);
            }
            else {
                Tool.pre("还没开发2025-3-7。。。");
            }
        },
        e02: function (blob, oo) {
            this.obj.temp.pic = URL.createObjectURL(blob)
            $("#state").html("正在上传图片...");
            Tool.upPic.a01(this.obj.temp.pic, oo.seller, oo.site, oo.num, this.e03, this, oo);//上传图片
        },
        e03: function (src, oo) {
            let temp = this.obj.temp;
            URL.revokeObjectURL(temp.pic);//方法释放使用URL
            oo.dom.picB.append(this.b01(src));
            $("#state").html("正在更新数据...");
            let sqlstr = ""
            if (temp.size) {
                sqlstr = ",@.width=" + temp.width + ",@.height=" + temp.height + ",@.size=" + temp.size + ",@.hash='" + temp.hash + "'"
            }
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/shopee放大镜图",
                sql: "update @.table set @." + oo.siteNum + "_watermark='" + src + "'" + sqlstr + " where @.src='" + this.obj.Barr[this.obj.B1 - 1] + "'",
            }]
            Tool.ajax.a01(data, this.e04, this, oo)
        },
        e04: function (t, oo) {
            this.obj.temp = {}
            $("#state").html("下一步...");
            this.obj.B1++;
            this.a04(oo);
        },
        ////////////////////////////
        f01: function (oo) {
            oo.dom.picA.html('');
            oo.dom.picB.html('');
            this.obj = { B1: 1, B2: 0, Barr: [], temp: {} }
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})