'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 1,
        beginTime: "",
        endDate: "",
        This: null,
    },
    a01: function () {
        //o.params.jsFile         选择JS文件       
        //o.params.return         返回URL  
        let html = Tool.header(o.params.return, "Shopee &gt; 客优云 &gt; 充值日志 &gt; 获取充值日志") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">说明：</td><td colspan="2">客优云会删除以前的数据。</td></tr>\
 		    <tr><td class="right">获取最近日志：</td><td colspan="2">'+ this.b02() + '</td></tr>\
		    <tr><td class="right">开始时间：</td><td id="beginTime" colspan="2"></td></tr>\
		    <tr><td class="right">结束时间：</td><td id="endDate" colspan="2"></td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        let This = $(".form-select")
        This.attr("disabled", true);
        This.find("option:contains('30')").attr("selected", true);
        this.c01(This, "30");
    },
    ///////////////////////////////////
    b01: function (val, k) {
        if (k == "transTime" || k == "showTransTime") { val = Tool.gettime(val); }
        else if (k == "tradeAmount") { val = val ? val : 0; }
        else if (typeof (val) == "string") { val = Tool.rpsql(val); }
        else if (typeof (val) == "number") { }
        else if (typeof (val) == "object") { val = Tool.rpsql(JSON.stringify(val)); }
        else if (typeof (val) == "boolean") { val = val ? 1 : 0; }
        return val;
    },
    b02: function () {
        let str = '\
        <select onChange="fun.c01($(this),this.options[this.selectedIndex].value)" class="form-select">\
            <option value="15">15天</option>\
            <option value="30">30天</option>\
            <option value="50">50天</option>\
            <option value="100">100天</option>\
            <option value="all">所有</option>\
        </select>';
        return str;
    },
    c01: function (This, val) {
        This.attr("disabled", true);
        this.obj.This = This;
        switch (val) {
            case "15": this.obj.beginTime = Tool.userDate13(Date.now() - 1000 * 60 * 60 * 24 * 15, "-"); break;
            case "30": this.obj.beginTime = Tool.userDate13(Date.now() - 1000 * 60 * 60 * 24 * 30, "-"); break;
            case "50": this.obj.beginTime = Tool.userDate13(Date.now() - 1000 * 60 * 60 * 24 * 50, "-"); break;
            case "100": this.obj.beginTime = Tool.userDate13(Date.now() - 1000 * 60 * 60 * 24 * 100, "-"); break;
            default: ;
        }
        if (val != "all") this.obj.endDate = Tool.userDate13(Date.now(), "-");
        $("#beginTime").html(this.obj.beginTime);
        $("#endDate").html(this.obj.endDate);
        Tool.login.a01(this.d01, this);
    },
    ///////////////////////////////////
    d01: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this, this.e01);
    },
    d02: function () {
        let url = "https://api.keyouyun.com/darius/api/credits/all/credits/flow/record?page=" + this.obj.A1 + "&size=20&transDateBegin=" + this.obj.beginTime + "&transDateEnd=" + this.obj.endDate + "&transType=&kyyTradeNo=&ordersn=&packageId="
        $("#url").html(url);
        $("#state").html("正在获取第" + this.obj.A1 + "页商品。。。");
        gg.getFetch(url, "json", this.d03, this)
    },
    d03: function (arr) {
        if (arr.length == 20) { this.obj.A2++; }
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            let arrL = [], arrR = [], updateArr = []
            for (let k in arr[i]) {
                arrL.push("@." + (k == "id" ? "fromid" : k));
                arr[i][k] = this.b01(arr[i][k], k)
                arrR.push(arr[i][k]);
                if (k != "id") { updateArr.push("@." + k + "=" + arr[i][k]); }
            }
            /////////////////////////////////////////////////////////////////
            let update = "update @.table set " + updateArr.join(",") + "  where @.fromid=" + arr[i].id
            let insert = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")";
            data.push({
                action: "sqlite",
                database: "shopee/客优云/充值日志",
                sql: "select @.id from @.table where @.fromid=" + arr[i].id,
                list: [{
                    action: "sqlite",
                    database: "shopee/客优云/充值日志",
                    sql: update,
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/客优云/充值日志",
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
    ///////////////////////////////////
    e01: function () {
        let url = "https://api.keyouyun.com/darius/api/credits/balance"//这个是我还有多少积分
        $("#url").html(url);
        gg.getFetch(url, "json", this.e02, this);
    },
    e02: function (t) {
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/账户",
            sql: "update @.table set @.points=" + t.totalAmount
        }]
        Tool.ajax.a01(data, this.e03, this);
    },
    e03: function () {
        $("#state").html("全部完成");
        this.obj.This.attr("disabled", false);
    },
}
fun.a01();