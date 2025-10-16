'use strict';
Object.assign(Tool, {
    common4:
    {
        a01: function (post, proid, seller, site, num, dom, next, This, t) {
            let oo = {
                post: post,
                proid: proid,
                seller: seller,
                site: site,
                num: num,
                dom: dom,
                next: next,
                This: This,
                t: t,
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ];
            let url = "https://seller.shopee.cn/api/v3/mtsku/create_mpsku_by_single_mtsku?" + pArr.join("&")
            $("#url").html(url + "[post]");
            $("#state").html("正在提交。。。");
            //问：为什么不用批量发布？答：如果用了，那就不知道是哪个发布失败了。
            gg.postFetch(url, JSON.stringify(oo.post), this.a03, this, oo);
        },
        a03: function (o1, oo) {
            if (o1.code == 0) {
                this.a04(oo);
            }
            else {
                Tool.pre(["出错：", o1]);
            }
        },
        a04: function (oo) {
            $("#state").html("延时1秒等发布结果。。。");
            Tool.Time("name", 1000, this.a05, this, oo)
        },
        a05: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
                "page_number=1",
                "page_size=1",
            ]
            let url = "https://seller.shopee.cn/api/v3/mtsku/get_mtsku_publish_record?" + pArr.join("&")
            $("#state").html("正在获取发布结果。。。");
            gg.getFetch(url, "json", this.a06, this, oo);
        },
        a06: function (t, oo) {
            if (t.code == 0) {
                //说明:只要是发布成功，那就一定有进度条。
                this.a07(t.data.list[0], oo);//为什么是数组的第一个？因为最新发布的在前面。
            }
            else {
                Tool.pre(["出错11：", t]);
            }
        },
        a07: function (t, oo) {
            if (t.publish_result.progress == 100) {
                this.d01(t.publish_result, oo);
            }
            else {
                this.a04(oo);
            }
        },
        //////////////////////////////////////
        d01: function (publish_result, oo) {
            if (publish_result.published_count == 1) {
                this.d02("update @.table set @.is" + oo.site + "=1 where @.proid='" + oo.proid + "'", oo);
            }
            else if (publish_result.failed_count == 1) {//||publish_result.unpublished_count == 1
                // @.penalty_type=8         更新后违规类型【8.发布商品失败】
                this.d02("update @.table set @.penalty_type=8 where @.proid='" + oo.proid + "'", oo)
            }
            else if (publish_result.unpublished_count == 1 && publish_result.status == 1) {
                /*
                {
                    "progress": 100,
                    "published_count": 0,
                    "unpublished_count": 1,
                    "failed_count": 0,
                    "status": 1
                }
                */
                $("#state").html("不能发布了...。");
                Tool.pre(publish_result)
                //this.d02("update @.table set @.penalty_type=8 where @.proid='" + oo.proid + "'", oo)
            }
            else {
                Tool.pre(["未知发布结果", publish_result]);
            }
        },
        d02: function (sql, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: sql,
            }]
            $("#state").html("正在更新本地商品状态。。。");
            Tool.ajax.a01(data, this.d03, this, oo);
        },
        d03: function (t, oo) {
            Tool.apply("ok", oo.next, oo.This, oo.t);
        },
    }
})