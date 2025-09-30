'use strict';
Object.assign(Tool, {
    common2:
    {
        a01: function (product, siteNum, next, This, t) {
            let oo = {
                product: product,
                siteNum: siteNum,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let o1 = oo.product.list[0][0], o2 = oo.product.list[2][0]
            if (o1.ManualReview_1688_video_status == 7) {
                if (o2.video) {
                    Tool.apply(JSON.parse(o2.video), oo.next, oo.This, oo.t);
                }
                else {
                    Tool.at("【手动审核通过】的【主视频】，还没上传到shopee，请上传后再来。")
                }
            }
            else if (o1.ManualReview_1688_ExplanationVideo_status == 7) {
                if (o2.ExplanationVideo) {
                    Tool.apply(JSON.parse(o2.ExplanationVideo), oo.next, oo.This, oo.t);
                }
                else {
                    Tool.at("【手动审核通过】的【讲解视频】，还没上传到shopee，请上传后再来。")
                }
            }
            else if (oo.product.list[1][0] && oo.product.list[1][0].video) {
                Tool.apply(JSON.parse(oo.product.list[1][0].video), oo.next, oo.This, oo.t);
            }
            else {
                this.a03(o2, o1.proid, oo)
            }
        },
        a03: function (o2, proid, oo) {
            //能到这里，就说明，都没有审核通过，说明：不应该有上传到shopee的视频。所以要清空【@.video】和【@.ExplanationVideo】字段内容
            if (o2.video || o2.ExplanationVideo) {
                let data = [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品/" + Tool.pronum(proid, 100),
                    sql: "update @.table set @.video=null,@.ExplanationVideo=null where @.proid='" + proid + "'"
                }]
                Tool.ajax.a01(data, this.a04, this, oo)
            }
            else {
                this.a04(null, oo)
            }
        },
        a04: function (t, oo) {
            let o1 = oo.product.list[2][0]
            let shopee_8pic = JSON.parse(o1.shopee_8pic)
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/shopee放大镜图/" + Tool.pronum(oo.product.list[0][0].proid, 100),
                sql: "select @." + oo.siteNum + "_watermark as watermark FROM @.table where @.src in('" + shopee_8pic.join("','") + "')",
            }]
            $("#state").html("正在获取水印图。。。")
            Tool.ajax.a01(data, this.a05, this, oo);
        },
        a05: function (t, oo) {
            let o1 = oo.product.list[0][0]
            let temp = { proid: o1.proid, images: [o1.pic] }
            let iserror = false;
            if (t[0].length == 8) {
                for (let i = 0; i < t[0].length; i++) {
                    if (t[0][i].watermark) {
                        temp.images.push(t[0][i].watermark)
                    }
                    else {
                        iserror = true;
                        break;
                    }
                }
                if (!iserror) {
                    this.a06(temp, oo);
                }
                else {
                    Tool.at("必须生成放大镜图水印，才能继续。")
                }
            }
            else {
                $("#state").html("有水印图没找到，程序终止。。。")
            }
        },
        a06: function (temp, oo) {
            let html = ""
            for (let i = 0; i < temp.images.length; i++) {
                temp.images[i] = "https://s-cf-sg.shopeesz.com/file/" + temp.images[i]
                html += '<a href="' + temp.images[i] + '" target="_blank" class="m-2"><img src="' + temp.images[i] + '_tn" class="img-fluid rounded w200"></a>'
            }
            $("#pic").html(html)
            let data = [{
                action: "fs",
                fun: "videoshow",
                mode: 2,//1:表示【覆盖】；      2:表示存在就【跳过】，否则【生成】；
                images: temp.images
            }]
            $("#state").html("正在生成视频。。。");
            Tool.ajax.a01(data, this.a07, this, oo);
        },
        a07: function (t, oo) {
            let videoUrl = location.origin + t[0].substring(6)
            $("#videoUrlA").html('<video height="400" controls=""><source src="' + videoUrl + '" type="video/mp4">您的浏览器不支持 HTML5 video 标签。</video>')
            Tool.apply(t[0], oo.next, oo.This, oo.t);
        },
    }
})