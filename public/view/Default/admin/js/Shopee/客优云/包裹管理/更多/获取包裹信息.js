'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
    },
    a01: function () {
        //o.params.jsFile         选择JS文件       
        //o.params.return         返回URL  
        let html = Tool.header(o.params.return, "Shopee &gt; 客优云 &gt; 包裹信息 &gt; 获取包裹信息") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">说明：</td><td colspan="2">客优云也会删除以前的数据。</td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function () {
        let url = "https://api.keyouyun.com/jax/api/package/count"
        $("#url").html(url);
        gg.getFetch(url, "json", this.a04, this);
    },
    a04: function (t) {
        let totalRecord = 0
        for (let i = 0; i < t.length; i++) {
            totalRecord += t[i].totalRecord
        }
        this.obj.A2 = Math.ceil(totalRecord / 10)
        this.d01();
    },
    ///////////////////////////////////
    b01: function (val, k) {
        if (k == "gmtCreate" || k == "gmtLeaving") {
            val = Tool.gettime(val);
        }
        else if (k == "nodeCode") {
            val = Tool.rpsql(val.toLowerCase());
        } else if (typeof (val) == "string") {
            val = Tool.rpsql(val)
        }
        else if (typeof (val) == "number") {
            val = val;
        }
        else if (typeof (val) == "object") {
            val = Tool.rpsql(JSON.stringify(val))
        }
        else if (typeof (val) == "boolean") {
            val = val ? 1 : 0;
        }
        return val;
    },
    ///////////////////////////////////
    d01: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this);
    },
    d02: function () {
        let url = "https://api.keyouyun.com/jax/api/package/all/package?page=" + this.obj.A1 + "&size=10&number=&autoConfirm=true&packageId=&ordersn=&buyerName=&userId=&total=0&waybillType=&isStock=&pickNo=&logisticsProviders=&shopId="
        $("#url").html(url);
        $("#state").html("正在获取第" + this.obj.A1 + "页商品。。。");
        gg.getFetch(url, "json", this.d03, this);
    },
    d03: function (arr) {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            let arrL = [], arrR = [], updateArr = []
            for (let k in arr[i]) {
                if (k == "orderInfos") {
                    //这个客优云没有，我自己加的字段。
                    if (arr[i][k].length == 1) {
                        updateArr.push("@.trackingNos=" + Tool.rpsql(JSON.stringify(arr[i][k][0].trackingNos)));
                        updateArr.push("@.ordersn=" + Tool.rpsql(arr[i][k][0].ordersn));
                        updateArr.push("@.shipByDate=" + Tool.gettime(arr[i][k][0].shipByDate));
                        updateArr.push("@.orderCancelDay=" + Tool.gettime(arr[i][k][0].orderCancelDay));
                        arrL.push("@.trackingNos");
                        arrL.push("@.ordersn");
                        arrL.push("@.shipByDate");
                        arrL.push("@.orderCancelDay");
                        arrR.push(Tool.rpsql(JSON.stringify(arr[i][k][0].trackingNos)));
                        arrR.push(Tool.rpsql(arr[i][k][0].ordersn));
                        arrR.push(Tool.gettime(arr[i][k][0].shipByDate));
                        arrR.push(Tool.gettime(arr[i][k][0].orderCancelDay));
                    }
                    else {
                        Tool.at("不可能，一个包裹，有多个订单。")
                        aaaaaaaaaaaaaa
                    }
                }
                ///////////////////////////////////////////////////////
                arrL.push("@." + k);
                arr[i][k] = this.b01(arr[i][k], k)
                arrR.push(arr[i][k]);
                if (k != "nodeCode" && k != "packageId") {
                    updateArr.push("@." + k + "=" + arr[i][k]);
                }
            }
            /////////////////////////////////////////////////////////////////
            let update = "update @.table set " + updateArr.join(",") + "  where  @.nodeCode=" + arr[i].nodeCode + " and @.packageId=" + arr[i].packageId
            let insert = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")";
            data.push({
                action: "sqlite",
                database: "shopee/客优云/包裹管理",
                sql: "select @.id from @.table where @.nodeCode=" + arr[i].nodeCode + " and @.packageId=" + arr[i].packageId,
                list: [{
                    action: "sqlite",
                    database: "shopee/客优云/包裹管理",
                    sql: update,
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/客优云/包裹管理",
                    sql: insert,
                }]
            })
        }
        Tool.ajax.a01(data, this.d04, this);
    },
    d04: function (t) {
        this.obj.A1++;
        this.d01();
    },
}
fun.a01();