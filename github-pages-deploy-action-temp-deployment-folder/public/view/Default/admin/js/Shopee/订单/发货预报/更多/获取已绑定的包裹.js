'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        seller: {},
    },
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.site           站点
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 订单 &gt; 发货预报 &gt; 更多 &gt; 获取已绑定的包裹") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">获取站点：</td><td colspan="2">'+ Tool.site(obj.params.site) + '</td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">开始时间：</td><td id="create_time" colspan="2"></td></tr>\
		    <tr><td class="right">结束时间：</td><td id="end_time" colspan="2"></td></tr>\
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
        //获取绑定记录。
        let end_time = Tool.gettime(Tool.userDate13(Date.now())) + (60 * 60 * 24 * 1) - 1;
        $("#end_time").html(Tool.js_date_time2(end_time))
        let create_time = end_time - (60 * 60 * 24 * 90) + 1;
        $("#create_time").html(Tool.js_date_time2(create_time))
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[obj.params.site][0].shopId,
            "cbsc_shop_region=" + obj.params.site,
            "create_time=" + create_time,
            "end_time=" + end_time,
            "is_only_contain_alarm=false",
            "page_number=" + this.obj.A1,
            "page_size=100",
        ]
        let url = "https://seller.shopee.cn/api/v3/shipment/get_first_mile_operation_result_list?" + arr.join("&")
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在获取第" + this.obj.A1 + "页绑定记录。。。");
        gg.getFetch(url, "json", this.a05, this)
    },
    a05: function (oo) {
        if (oo.message == "success") {
            this.obj.A2 = Math.ceil(oo.data.page_info.total / oo.data.page_info.page_size)
            this.d01(oo.data.list);
        }
        else {
            Tool.pre(["出错11", oo])
        }
    },
    b01: function (val, k) {
        if (typeof (val) == "string") {
            val = Tool.rpsql(val)
        }
        else if (typeof (val) == "number") {
            val = val;
        }
        else if (typeof (val) == "boolean") {
            val = val ? 1 : 0;
        }
        return val;
    },
    /////////////////////////////////////
    d01: function (list) {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this, null, list);
    },
    d02: function (arr) {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            let arrL = [], arrR = [], updateArr = []
            for (let k in arr[i]) {
                arrL.push("@." + k);
                arr[i][k] = this.b01(arr[i][k], k)
                arrR.push(arr[i][k]);
                if (k != "region_id" && k != "order_id") {
                    updateArr.push("@." + k + "=" + arr[i][k]);
                }
            }
            /////////////////////////////////////////////////////////////////
            let update = "update @.table set " + updateArr.join(",") + "  where  @.region_id=" + arr[i].region_id + " and @.order_id='" + arr[i].order_id + "'"
            let insert = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")";
            data.push({
                action: "sqlite",
                database: "shopee/订单/发货预报/" + obj.params.site,
                sql: "select @.id from @.table where @.region_id=" + arr[i].region_id + " and @.order_id='" + arr[i].order_id + "'",
                list: [{
                    action: "sqlite",
                    database: "shopee/订单/发货预报/" + obj.params.site,
                    sql: update,
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/订单/发货预报/" + obj.params.site,
                    sql: insert,
                }]
            })
        }
        Tool.ajax.a01(data, this.e03, this);
    },
    e03: function () {
        this.obj.A1++;
        this.a04();
    },
}
fun.a01();



