'use strict';
Object.assign(Tool, {
    common1:
    {
        a01: function (site, num, progress, next, This, t) {
            let oo = {
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
            this.a02(oo)
        },
        a02: function (oo) {
            let where = " where @.ismakevideo=0"
            //let where = " where @.proid='R812905'"
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("proid") + " FROM @.table" + where + Tool.limit(1, 1, "sqlite"),
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select " + Tool.fieldAs("proid,ManualReview_1688_video_status,ManualReview_1688_ExplanationVideo_status,pic") + " FROM @.table where @.proid='${proid}' limit 1",

                }, {
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee首图/${proid_100:proid}",
                    sql: "select @." + oo.siteNum + "_video as video FROM @.table where @.proid='${proid}'",
                }, {
                    action: "sqlite",
                    database: "shopee/商品/全球商品/${proid_100:proid}",
                    sql: "select " + Tool.fieldAs("video,ExplanationVideo,shopee_8pic") + " FROM @.table where @.proid='${proid}' limit 1",
                }]
            }]
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
            oo.product = t[0][0];
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a04, this, this.e01, oo);
        },
        a04: function (oo) {
            $("#proid").html(oo.product.proid)
            $("#state").html("正在生成视频。。。")


            
            Tool.pre("aaaaaaaaaaaaaaaaa")
            //Tool.common2.a01(oo.product, oo.siteNum, this.d01, this, oo)
        },
        /////////////////////////////////
        d01: function (shopeeVideo, oo) {
            if (shopeeVideo.length == 1) {
                $("#state").html("有视频不用上传视频。");
                let o1 = {
                    shopeeVideo: shopeeVideo,
                    siteNum: oo.siteNum,
                    proid: oo.product.proid,
                    next: fun.d01,
                    This: fun
                }
                Tool.common3.d06(o1);
            }
            else {
                //注：必须点击才能复制。（我也不知道什么原因。）
                let src = this.obj.sitePath + shopeeVideo.replace(/\//g, "\\")
                $("#RenDie-HID").html('<button class="btn btn-outline-secondary" onclick="fun.c01(\'' + src.replace(/\\/g, "\\\\") + '\',\'' + oo.product.proid + '\',\'' + oo.site + "\'," + oo.num + ',\'' + oo.siteNum + '\')">复制视频地址，并继续。</button>');
                this.d02();
            }
        },
        d02: function () {
            //将鼠标位置设置为[0,0]
            //注：最多移动【127】像素且要关闭【增强指针精度】。  
            hid.move.a01(-window.screen.width, -window.screen.height, -127, this.d03, this)
        },
        d03: function () {
            let rect = frameElement.getBoundingClientRect();
            let offset = $('#RenDie-HID').offset();
            let left = offset.left + rect.left + 55;
            let top = offset.top + rect.top + 85 + 30;
            hid.mouseClick.a01(left, top, 2, 1);//鼠标右单击            
        },
        //////////////////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})