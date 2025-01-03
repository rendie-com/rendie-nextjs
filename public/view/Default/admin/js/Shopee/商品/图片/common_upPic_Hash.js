'use strict';
Object.assign(Tool, {
    //上传图片_并保存
    upPic_Hash: {
        a01: function (fromid, url, domid1, domid2, seller, next, This, t) {
            let oo = {
                fromid: fromid,
                url: url,
                domid2: domid2,
                seller:seller,
                next: next,
                This: This,
                t: t
            }
            $(domid1).append(this.b02(oo.url))
            this.a02(oo)//为什么要多写一个“this.a02(oo)”？答：因为还要出错后重试。
        },
        a02: function (oo) {
            $("#state").html("正在上传图片...");
            Tool.upPic.a01(oo.url, oo.seller, "my", this.a03, this, oo);//上传图片
        },
        a03: function (src, oo) {
            oo.src = src;//返回值
            $(oo.domid2).append(this.b01(src))
            let url = "https://s-cf-sg.shopeesz.com/file/" + src;
            $("#state").html("正在新图Base64...");
            Tool.getImgBase64.a01(url, this.a04, this, oo)
        },
        a04: function (t, oo) {
            if (t) {
                oo.shopee_img = {
                    size: Tool.getBase64ImageSize(t.base64),
                    src: oo.src,
                    width: t.width,
                    height: t.height
                }
                $("#state").html("正在获取【均值哈希】...");
                Tool.GetAvgHash.a01(t.base64, this.a05, this, oo)
            }
            else {
                $("#state").html("图片403错误，延时1秒再打开。");
                //Tool.Time("name", 1000, this.e01, this)
            }
        },
        a05: function (t, oo) {
            let table = this.b03(oo.domid2)
            let data = [{
                action: "sqlite",
                database: "shopee_img",
                sql: "select @.id from @." + table + " where @.src='" + oo.shopee_img.src + "' limit 1",
                elselist: [{
                    action: "sqlite",
                    database: "shopee_img",
                    sql: "insert into @." + table + "(@.fromid,@.src,@.hash,@.addtime,@.width,@.height,@.size)values(" + oo.fromid + ",'" + oo.shopee_img.src + "','" + t + "'," + Tool.gettime("") + "," + oo.shopee_img.width + "," + oo.shopee_img.height + "," + oo.shopee_img.size + ")"
                }]
            }]
            Tool.ajax.a01(data, this.a06, this, oo);
        },
        a06: function (t, oo) {
            if (t[0][0].list) {
                if (t[0][0].list[0].length == 0) {
                    Tool.apply(oo.src, oo.next, oo.This, oo.t)
                }
                else {
                    Tool.pre(["插入图片出错001:", t])
                }
            }
            else {
                $("#state").html("添加图片出错,延时1秒再继续...");
                Tool.Time("name", 1000, this.a02, this, oo)
            }
        },
        /////////////////////////////
        b01: function (src) {//上传后图片
            let str = '\
            <figure class="figure border ml-1 mb-1 mt-1 p-1">\
                <a href="https://s-cf-sg.shopeesz.com/file/' + src + '" target="_blank">\
                    <img src="https://s-cf-sg.shopeesz.com/file/' + src + '_tn" class="figure-img img-fluid rounded w100 mb-0">\
                </a>\
            </figure>'
            return str;
        },
        b02: function (fileurl) {//上传前图片
            let str = '\
            <figure class="figure border ml-1 mb-1 mt-1 p-1">\
                <a href="'+ fileurl + '" target="_blank">\
                    <img src="'+ fileurl + '" class="figure-img img-fluid rounded w100 mb-0">\
                </a>\
            </figure>'
            return str;
        },
        b03: function (domid2) {
            let r = ""
            if (domid2 == "#pic2") {
                r = "pic_1688"
            }
            else if (domid2 == "#attr_pic2") {
                r = "attrPic_1688"
            }
            else if (domid2 == "#des_pic2") {
                r = "desPic_1688"
            }
            return r;
        },
    }
})