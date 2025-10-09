'use strict';
Object.assign(Tool, {
    flash_sale_list: {
        a01: function (seller, site, num, progress, endTime, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                endTime: endTime,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                flash_sale_list: [],
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.download_sqlite.a01(["shopee/营销中心/店内秒杀/" + oo.siteNum], this.a03, this, oo);
        },
        a03: function (t, oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "offset=" + ((oo.A1 - 1) * 10),//第一页为“0”    第二页为“10”        第三页为：“20”
                "limit=10",
                "type=0",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/shop_flash_sale/list/?" + arr.join("&")
            $("#url").html(url);
            $("#state").html("正在获取第" + oo.A1 + "页【店内秒杀】信息。。。");
            gg.getFetch(url, "json", this.a04, this, oo);
        },
        a04: function (t, oo) {
            if (t.message == "success") {
                if (oo.A2 == 0) { oo.A2 = Math.ceil(t.data.total_count / 10) }
                oo.flash_sale_list = t.data.flash_sale_list
                this.d01(oo);
            }
            else if (t.message == "param err") {
                $("#state").html("shopee自己也报错（可能是只给翻100页）。。。");
                this.d04(oo);
            }
            else {
                Tool.pre(["出错2025/10/9", t])
            }
        },
        //////////////////////////////////////////////////
        d01: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d02, this, this.d04, oo)
        },
        d02: function (oo) {
            let arr = oo.flash_sale_list
            if (oo.endTime != 0 && arr[0].end_time < oo.endTime) {
                this.d04(oo);//获取范围
            } else {
                let data = [];
                for (let i = 0; i < arr.length; i++) {
                    data.push({
                        action: "sqlite",
                        database: "shopee/营销中心/店内秒杀/" + oo.siteNum,
                        sql: "select @.flash_sale_id from @.table where @.flash_sale_id =" + arr[i].flash_sale_id,
                        list: [{
                            action: "sqlite",
                            database: "shopee/营销中心/店内秒杀/" + oo.siteNum,
                            sql: "update @.table set @.uptime=" + arr[i].mtime + ", @.status=" + arr[i].status + ", @.type=" + arr[i].type + "  where @.flash_sale_id=" + arr[i].flash_sale_id,
                        }],
                        elselist: [{
                            action: "sqlite",
                            database: "shopee/营销中心/店内秒杀/" + oo.siteNum,
                            sql: "insert into @.table(@.flash_sale_id,@.addtime,@.start_time,@.end_time,@.item_count,@.uptime,@.status,@.timeslot_id,@.type)values(" + arr[i].flash_sale_id + "," + arr[i].ctime + "," + arr[i].start_time + "," + arr[i].end_time + "," + arr[i].item_count + "," + arr[i].mtime + "," + arr[i].status + "," + arr[i].timeslot_id + "," + arr[i].type + ")",
                        }]
                    })
                }
                $("#state").html("正在更新本地商品状态。。。");
                Tool.ajax.a01(data, this.d03, this, oo);
            }
        },
        d03: function (t, oo) {
            oo.A1++;
            $("#state").html("正在进入第" + oo.A1 + "页。。。");
            this.a03(null, oo)
        },
        d04: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})