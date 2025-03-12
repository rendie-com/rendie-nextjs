'use strict';
Object.assign(Tool, {
    edit_watermark:
    {
        //pic1                          原始首图
        //proid                         商品编码
        //manualreview_1688_fromid      1688商品ID
        //seller                        店铺参数信息
        //siteNum                          站点
        a01: function (pic1, shopee_8pic, manualreview_1688_fromid, proid, seller, siteNum, next, This, t) {
            let oo = {
                pic1: pic1,
                manualreview_1688_fromid: manualreview_1688_fromid,
                seller: seller,
                siteNum: siteNum,
                next: next,
                This: This,
                t: t
            }
            if (shopee_8pic.length == 8) {
                this.a02(proid, shopee_8pic, oo)
            }
            else {
                Tool.at("放大镜图片必须是9个图片。")
            }
        },
        a02: function (proid, shopee_8pic, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/shopee首图",
                sql: "select @." + oo.siteNum + "_watermark as watermark,@." + oo.siteNum + "_video as video FROM @.table where @.proid='" + proid + "'",
            }]
            for (let i = 0; i < shopee_8pic.length; i++) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee放大镜图",
                    sql: "select @." + oo.siteNum + "_watermark as watermark FROM @.table where @.src='" + shopee_8pic[i] + "'",
                })
            }
            $("#state").html("正在获取商品水印图片...");
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            let arr = []
            if (t[0].length == 0) {
                Tool.at("该商品没有首图水印...")
            }
            else if (t[0][0].watermark) {
                arr.push(t[0][0].watermark);
                for (let i = 1; i < t.length; i++) {
                    arr.push(t[i][0].watermark)
                }
                oo.video = JSON.parse(t[0][0].video)//临时放一下
                if (oo.video) {
                    oo.temp_images = arr;//临时放一下
                    let html = '<tr><td class="right">视频：</td><td colspan="2"><textarea rows="10" class="form-control form-control-sm">' + JSON.stringify(oo.video, null, 2) + '</textarea></td></tr>'
                    $("#tbody").append(html);
                    this.a04(oo);
                }
                else {
                    Tool.pre(["请生成视频后，再来更新。" + oo.video]);
                }
            }
            else {
                Tool.pre(["该商品没有首图水印", t])
            }
        },
        a04: function (oo) {
            let data = [{
                action: "sqlite",
                database: "1688_prodes/" + Tool.remainder(oo.manualreview_1688_fromid, 99),
                sql: "select @.attrpic_shopee as attrpic_shopee FROM @.prodes where @.fromid=" + oo.manualreview_1688_fromid,
            }]
            //思路：拿1688的水印图片覆盖更新。
            //已知信息1：【全球商品】增加了价格属性，那【店铺商品】也会增加。
            //已知信息2：在【店铺商品】是不能增加价格属性，也不能删除属性，只能改。
            //已知信息3：一组【属性图片】中，要么全部有图片，要么全部没有图片。（所以：当出现只有部分图片时后，用空图片填进去。）
            Tool.ajax.a01(data, this.a05, this, oo);
        },
        a05: function (t, oo) {
            let arr = [], attrPic = [], attrpic_shopee = JSON.parse(t[0][0].attrpic_shopee);
            if (attrpic_shopee) {
                for (let i = 0; i < attrpic_shopee.length; i++) {
                    if (attrpic_shopee[i].shopee) { arr.push(attrpic_shopee[i].shopee) }
                    attrPic.push(attrpic_shopee[i])
                }
            }
            if (arr.length == 0) {
                $("#state").html("没有属性图片...");
                this.d01(attrPic, oo);
            }
            else {
                let data = [{
                    action: "sqlite",
                    database: "shopee/商品/图片/1688属性图",
                    sql: "select " + Tool.fieldAs("src," + oo.siteNum + "_watermark") + " FROM @.table where @.src in('" + arr.join("','") + "')",
                }]
                oo.temp_attrPic = attrPic;//临时放一下
                $("#state").html("正在获取水印图片...");
                Tool.ajax.a01(data, this.a06, this, oo);
            }
        },
        a06: function (t, oo) {
            let arr = oo.temp_attrPic, isErr = false;
            //说明一下：这里只会出现一组，因为1688不可能有俩组属性有图片,没有图片的属性不会来。
            for (let i = 0; i < arr.length; i++) {
                //替换成水印图
                if (arr[i].shopee) {
                    let pic = this.b01(arr[i].shopee, t[0], oo.siteNum)
                    if (pic) {
                        arr[i].shopee = pic;
                    }
                    else {
                        isErr = true;
                        break;
                    }
                }
                else {
                    arr[i].shopee = "cn-11134207-7r98o-lulrd4y2kboe7c"//表示空图片。因为当有图片时就必须全部都要有。
                }
            }
            if (isErr) {
                Tool.pre(["有水印图找不到了", t, arr])
            }
            else {
                this.d01(arr, oo)
            }
        },
        //能否找得到水印图
        b01: function (pic, arr, siteNum) {
            let rPic = "";
            for (let i = 0; i < arr.length; i++) {
                if (pic == arr[i].src) {
                    rPic = arr[i][siteNum + "_watermark"];
                    break;
                }
            }
            return rPic;
        },
        d01: function (attrPic, oo) {
            Tool.apply({
                images: oo.temp_images,
                attrPic: attrPic,
                video: oo.video
            }, oo.next, oo.This, oo.t)
        }
    }
})