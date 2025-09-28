'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 1,
    },
    a01: function () {
        //o.params.jsFile         选择JS文件       
        //o.params.return         返回URL  
        let html = Tool.header(o.params.return, "Shopee &gt; 客优云 &gt; 问题件 &gt; 获取问题件") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        Tool.login.a01(this.d01, this);
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
    ///////////////////////////////////
    d01: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this);
    },
    d02: function () {
        let url = "https://api.keyouyun.com/jax/api/system/message?mode=1&size=10&page=" + (this.obj.A1 - 1)
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
                if (k != "messageId") { updateArr.push("@." + k + "=" + arr[i][k]); }
            }
            /////////////////////////////////////////////////////////////////
            let update = "update @.table set " + updateArr.join(",") + "  where @.messageId=" + arr[i].messageId
            let insert = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")";
            data.push({
                action: "sqlite",
                database: "shopee/客优云/系统消息",
                sql: "select @.id from @.table where @.messageId=" + arr[i].messageId,
                list: [{
                    action: "sqlite",
                    database: "shopee/客优云/系统消息",
                    sql: update,
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/客优云/系统消息",
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