'use strict';
Object.assign(Tool, {
    common_C:
    {
        obj: {
            temp: {},
            C1: 1, C2: 0, Carr: []
        },
        a01: function (proid, seller, site, dom, next, This, t) {
            let oo = {
                proid: proid,
                seller: seller,
                site: site,
                dom: dom,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo)
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
                database: "1688_prodes/" + Tool.remainder(fromid, 99),
                sql: "select " + Tool.fieldAs("attrpic_shopee") + " FROM @.prodes where @.fromid=" + fromid,
            }]
            oo.fromid = fromid
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            let attrpic_shopee = t[0][0].attrpic_shopee
            if (attrpic_shopee) {
                let arr = JSON.parse(attrpic_shopee)
                this.obj.C2 = arr.length;
                this.obj.Carr = arr;
                this.a05(oo)
            }
            else {
                $("#state").html('没有属性图...');
                this.f01(oo)
            }
        },
        a05: function (oo) {
            Tool.x1x2("C", this.obj.C1, this.obj.C2, this.d01, this, this.f01, oo)
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
            if (this.obj.Carr[this.obj.C1 - 1].shopee) {
                let data = [{
                    action: "sqlite",
                    database: "shopee/商品/图片/1688属性图",
                    sql: "select " + Tool.fieldAs("width,height," + oo.site + "_watermark") + " FROM @.table where @.src='" + this.obj.Carr[this.obj.C1 - 1].shopee + "'",
                    elselist: [{
                        action: "sqlite",
                        database: "shopee/商品/图片/1688属性图",
                        sql: "INSERT INTO @.table(@.src,@.fromid,@.addtime) VALUES ('" + this.obj.Carr[this.obj.C1 - 1].shopee + "'," + oo.fromid + "," + Tool.gettime("") + ")"
                    }]
                }]
                Tool.ajax.a01(data, this.d02, this, oo);
            }
            else {
                oo.dom.picA.append('<figure class="figure border mb-1 m-1 p-1 w100 center">空位置跳过</figure>');
                oo.dom.picB.append('<figure class="figure border mb-1 m-1 p-1 w100 center">空位置跳过</figure>');
                this.e04([[]], oo)
            }
        },
        d02: function (t, oo) {
            if (t[0][0][oo.site + "_watermark"] == null) {
                oo.dom.picA.append(this.b01(this.obj.Carr[this.obj.C1 - 1].shopee));
                this.d03(t[0][0], oo);
            }
            else if (t[0][0][oo.site + "_watermark"]) {
                oo.dom.picA.append('<figure class="figure border mb-1 m-1 p-1 w100 center">已上传跳过</figure>');
                oo.dom.picB.append('<figure class="figure border mb-1 m-1 p-1 w100 center">已上传跳过</figure>');
                this.e04([[]], oo)
            }
            else {
                Tool.pre(["出错001", t]);
            }
        },
        d03: function (t, oo) {
            let url = "https://s-cf-sg.shopeesz.com/file/" + this.obj.Carr[this.obj.C1 - 1].shopee;
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
            this.obj.temp = t;
            $("#state").html("正在获取【均值哈希】...");
            Tool.GetAvgHash.a01(t.base64, this.d05, this, oo)
        },
        d05: function (t, oo) {
            this.obj.temp.hash = t
            this.e01(this.obj.temp, oo);
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
            if (oo.site == "my") {
                objmsg.str = ["https://shopee.com.my/choice.my"]
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo)
            }
            else if (oo.site == "br") {
                objmsg.str = ["https://shopee.com.br/cupons.br"]
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo)
            }
            else if (oo.site == "tw") {
                objmsg.str = ["https://shopee.tw/discount.tw"]
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo)
            }
            else if (oo.site == "sg") {
                objmsg.str = ["https://shopee.sg/accessory.sg"]
                Tool.drawWaterMark.a01(t.base64, objmsg, this.e02, this, oo)
            }
            else {
                Tool.pre("还没开发。。。")
            }
        },
        e02: function (blob, oo) {
            this.obj.temp.pic = URL.createObjectURL(blob)
            $("#state").html("正在上传图片...");
            Tool.upPic.a01(this.obj.temp.pic, oo.seller, oo.site, this.e03, this, oo);//上传图片
        },
        e03: function (src, oo) {
            let temp = this.obj.temp
            URL.revokeObjectURL(temp.pic);//方法释放使用URL
            oo.dom.picB.append(this.b01(src))
            $("#state").html("正在更新数据...");
            let sqlstr = ""
            if (temp.size) {
                sqlstr = ",@.width=" + temp.width + ",@.height=" + temp.height + ",@.size=" + temp.size + ",@.hash='" + temp.hash + "'"
            }
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/1688属性图",
                sql: "update @.table set @." + oo.site + "_watermark='" + src + "'" + sqlstr + " where @.src='" + this.obj.Carr[this.obj.C1 - 1].shopee + "'",
            }]
            Tool.ajax.a01(data, this.e04, this, oo)
        },
        e04: function (t, oo) {
            this.obj.temp = {}
            $("#state").html("下一步...");
            this.obj.C1++;
            this.a05(oo);
        },
        ////////////////////////////
        f01: function (oo) {
            oo.dom.picA.html('');
            oo.dom.picB.html('');
            this.obj = { C1: 1, C2: 0, Carr: [], temp: {} }
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})