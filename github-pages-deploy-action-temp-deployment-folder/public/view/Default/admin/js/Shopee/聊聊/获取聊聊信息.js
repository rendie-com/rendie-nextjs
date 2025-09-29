'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 1,
        seller: {},
        page: null,
    },
    a01: function () {
        //o.params.jsFile         选择JS文件       
        //o.params.return         返回URL  
        let html = Tool.header(o.params.return, "Shopee &gt; 聊聊 &gt; 获取聊聊信息") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="right w150">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function (t) {
        this.obj.seller = t;
        this.a04();
    },
    a04: function () {
        gg.postFetch("https://seller.shopee.cn/webchat/api/coreapi/v1.2/login?&csrf_token=", "{}", this.d01, this)
    },
    ///////////////////////////////////
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
    b02: function (site, shop_id) {
        site = site.toLowerCase();
        let arr = this.obj.seller[site];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].shopId == shop_id) {
                site += (i + 1)
            }
        }
        return site
    },
    ////////////////////////////////////////
    d01: function (t) {
        let arr = [
            "direction=older",
            "biz_id=0",
            "on_message_received=true",
            "next_timestamp_nano=0",
            "_s=12",
            "_uid=1-1649154",
            "_v=8.8.4",
            "SPC_CDS_CHAT=" + this.obj.seller.SPC_CDS,
            "x-shop-region=GLOBAL",
        ]
        if (this.obj.page) {
            arr.push("last_message_region=" + this.obj.page.last_message_region)
            arr.push("last_received_message_id=" + this.obj.page.latest_message_id)
        }
        let url = "https://seller.shopee.cn/webchat/api/v1.2/subaccount/conversation/list?" + arr.join("&")
        $("#url").html(url);
        $("#state").html("正在获取第" + this.obj.A1 + "页商品。。。");
        let headersObj = { "Authorization": "Bearer " + t.token }
        gg.getHeadersFetch(url, headersObj, "json", this.d02, this)
    },
    d02: function (t) {
        let arr = t.conversations;
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d03, this, null, arr);
    },
    d03: function (arr) {
        if (arr.length == 0) {
            this.d04()
        }
        else {
            if (arr.length == 50) { this.obj.A2++; }
            let data = []
            this.obj.page = {
                latest_message_id: arr[arr.length - 1].latest_message_id,//翻页要用
                last_message_region: arr[arr.length - 1].last_message_region//翻页要用
            }
            for (let i = 0; i < arr.length; i++) {
                let arrL = [], arrR = [], updateArr = [], siteNum = this.b02(arr[i].last_message_region, arr[i].shop_id)
                for (let k in arr[i]) {
                    arr[i][k] = this.b01(arr[i][k], k)
                    arrR.push(arr[i][k]);
                    if (k != "fromid") {
                        updateArr.push("@." + (k == "to_id" ? "to_fromid" : k) + "=" + arr[i][k]);
                    }
                    if (k == "id") { k = "fromid" }
                    else if (k == "to_id") { k = "to_fromid" }
                    arrL.push("@." + k);
                }
                /////////////////////////////////////////////////////////////////
                let update = "update @.table set " + updateArr.join(",") + " where @.fromid=" + arr[i].id
                let insert = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")";
                data.push({
                    action: "sqlite",
                    database: "shopee/聊聊/" + siteNum,
                    sql: "select @.id from @.table where @.fromid=" + arr[i].id,
                    list: [{
                        action: "sqlite",
                        database: "shopee/聊聊/" + siteNum,
                        sql: update,
                    }],
                    elselist: [{
                        action: "sqlite",
                        database: "shopee/聊聊/" + siteNum,
                        sql: insert,
                    }]
                })
            }
            Tool.ajax.a01(data, this.d04, this);
        }
    },
    d04: function () {
        this.obj.A1++;
        this.a04()
    },
}
fun.a01();