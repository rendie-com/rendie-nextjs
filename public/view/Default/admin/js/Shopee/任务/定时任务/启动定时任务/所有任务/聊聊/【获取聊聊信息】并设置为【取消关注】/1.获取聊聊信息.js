'use strict';
Object.assign(Tool, {
    common1: {
        token: "",
        a01: function (progress, seller, next, This, t) {
            let oo = {
                progress: progress,
                seller: seller,
                next: next,
                This: This,
                t: t,
                ////////////////////////////////////////////
                A1: 1, A2: 1,
                last_message_region: "",//翻页要用
                latest_message_id: "",//翻页要用
                conversations: ""//内容
            }
            if (this.token) {
                //跳出。只执行一次就行了，因为已获得所有站点的聊聊。
                this.d04(oo);
            }
            else {
                this.a02(oo);
            }
        },
        a02: function (oo) {
            gg.postFetch("https://seller.shopee.cn/webchat/api/coreapi/v1.2/login?&csrf_token=", "{}", this.a03, this, oo)
        },
        a03: function (t, oo) {
            this.token = t.token
            this.a04(oo)
        },
        a04: function (oo) {
            let arr = [
                "direction=older",
                "biz_id=2",
                "on_message_received=true",
                "last_message_region=" + oo.last_message_region,
                "last_received_message_id=" + oo.latest_message_id,
                "next_timestamp_nano=0",
                "_uid=1-1649154",
                "_v=8.8.9",
                "SPC_CDS_CHAT=" + oo.seller.SPC_CDS,
                "x-shop-region=GLOBAL",
                "_api_source=sc",
            ]
            let url = "https://seller.shopee.cn/webchat/api/v1.2/mini/subaccount/conversations?" + arr.join("&")
            $("#url").html(url);
            $("#state").html("正在获取第" + oo.A1 + "页商品。。。");
            let headersObj = { "Authorization": "Bearer " + this.token }
            gg.getHeadersFetch(url, headersObj, "json", this.a05, this, oo)
        },
        a05: function (t, oo) {
            oo.conversations = t;
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d01, this, this.d04, oo);
        },
        ///////////////////////////
        b01: function (val, k) {
            if (k == "last_message_time") {
                val = Tool.gettime(val);
            }
            else if (typeof (val) == "string") {
                val = Tool.rpsql(val)
            }
            else if (typeof (val) == "number") {

            }
            else if (typeof (val) == "object") {
                val = Tool.rpsql(JSON.stringify(val))
            }
            else if (typeof (val) == "boolean") {
                val = val ? 1 : 0;
            }
            return val;
        },
        b02: function (site, shop_id, seller) {
            site = site.toLowerCase();
            let arr = seller[site];
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].shopId == shop_id) {
                    site += (i + 1)
                }
            }
            return site
        },
        b03: function (arr) {
            let arrL = [], arrR = [], updateArr = []
            for (let k in arr) {
                let val = this.b01(arr[k], k)
                arrR.push(val);
                if (k != "fromid") {
                    updateArr.push("@." + (k == "to_id" ? "to_fromid" : k) + "=" + val);
                }
                if (k == "id") { k = "fromid" }
                else if (k == "to_id") { k = "to_fromid" }
                arrL.push("@." + k);
            }
            return [arrL, arrR, updateArr]
        },
        /////////////////////////////////////
        d01: function (oo) {
            if (oo.conversations.length == 0) {
                $("#state").html("当第一页没内容的时后会到这里。");
                this.d04(oo);
            }
            else {
                if (oo.conversations.length == 50) { oo.A2++; }
                oo.latest_message_id = oo.conversations[oo.conversations.length - 1].latest_message_id//翻页要用
                oo.last_message_region = oo.conversations[oo.conversations.length - 1].last_message_region//翻页要用
                this.d02(oo)
            }
        },
        d02: function (oo) {
            let data = [], arr = oo.conversations
            for (let i = 0; i < arr.length; i++) {
                let arrLRU = this.b03(arr[i]), siteNum = this.b02(arr[i].last_message_region, arr[i].shop_id, oo.seller)
                data.push({
                    action: "sqlite",
                    database: "shopee/聊聊/" + siteNum,
                    sql: "select @.id from @.table where @.fromid=" + arr[i].id,
                    list: [{
                        action: "sqlite",
                        database: "shopee/聊聊/" + siteNum,
                        sql: "update @.table set " + arrLRU[2].join(",") + " where @.fromid=" + arr[i].id,
                    }],
                    elselist: [{
                        action: "sqlite",
                        database: "shopee/聊聊/" + siteNum,
                        sql: "insert into @.table(" + arrLRU[0].join(",") + ")values(" + arrLRU[1].join(",") + ")",
                    }]
                })
            }
            Tool.ajax.a01(data, this.d03, this, oo);
        },
        d03: function (t, oo) {
            oo.A1++;
            this.a04(oo)
        },
        d04: function (oo) {
            Tool.apply(oo.t, oo.next, oo.This);
        },
    },
})