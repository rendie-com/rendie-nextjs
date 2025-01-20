'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 1,
        beginTime: "",
        endDate: "",
    },
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 客优云 &gt; 问题件 &gt; 获取问题件") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
 		    <tr><td class="w200 right">获取最近问题件：</td><td colspan="2">'+ this.b02() + '</td></tr>\
		    <tr><td class="right">开始时间：</td><td id="beginTime" colspan="2"></td></tr>\
		    <tr><td class="right">结束时间：</td><td id="endDate" colspan="2"></td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(null, null, html)
    },
    ///////////////////////////////////
    b01: function (val, k) {
        if (k == "gmtCreate") {
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
    b02: function () {
        let str = '\
        <select onChange="fun.c01($(this),this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">请选择下架数量</option>\
            <option value="1">1天</option>\
            <option value="3">3天</option>\
            <option value="5">5天</option>\
            <option value="10">10天</option>\
            <option value="all">所有</option>\
        </select>';
        return str;
    },
    //////////////////////////////////
    c01: function (This, val) {
        This.attr("disabled", true);
        switch (val) {
            case "1": this.obj.beginTime = Tool.userDate13(Date.now() - 1000 * 60 * 60 * 24 * 1, "-"); break;
            case "3": this.obj.beginTime = Tool.userDate13(Date.now() - 1000 * 60 * 60 * 24 * 3, "-"); break;
            case "5": this.obj.beginTime = Tool.userDate13(Date.now() - 1000 * 60 * 60 * 24 * 5, "-"); break;
            case "10": this.obj.beginTime = Tool.userDate13(Date.now() - 1000 * 60 * 60 * 24 * 10, "-"); break;
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
        let url = "https://api.keyouyun.com/jax/api/package/express/abnormal?size=10&page=" + (this.obj.A1 - 1) + "&sellerId=&expressNum=&logisticsProvider=&expressStatus=&beginTime=" + this.obj.beginTime + "&endDate=" + this.obj.endDate
        $("#url").html(url);
        $("#state").html("正在获取第" + this.obj.A1 + "页商品。。。");
        gg.getFetch(url, "json", this.d03, this)
    },
    d03: function (arr) {
        let data = [];
        if (arr.length) { this.obj.A2++ }//有数据就给下一页。
        for (let i = 0; i < arr.length; i++) {
            let arrL = [], arrR = [], updateArr = []
            for (let k in arr[i]) {
                arrL.push("@." + k);
                arr[i][k] = this.b01(arr[i][k], k)
                arrR.push(arr[i][k]);
                if (k != "expressNum") { updateArr.push("@." + k + "=" + arr[i][k]); }
            }
            /////////////////////////////////////////////////////////////////
            let update = "update @.table set " + updateArr.join(",") + "  where @.expressNum=" + arr[i].expressNum
            let insert = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")";
            data.push({
                action: "sqlite",
                database: "shopee/客优云/问题件",
                sql: "select @.id from @.table where @.expressNum=" + arr[i].expressNum,
                list: [{
                    action: "sqlite",
                    database: "shopee/客优云/问题件",
                    sql: update,
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/客优云/问题件",
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
    //////////////////////////
    e01: function () {
        this.obj = {
            A1: 1, A2: 1,
            beginTime: "",
            endDate: "",
        }
        $("#state").html("全部完成。");
    },
}
fun.a01();