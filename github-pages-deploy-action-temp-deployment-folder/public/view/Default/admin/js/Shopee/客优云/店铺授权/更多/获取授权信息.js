'use strict';
var fun =
{
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 客优云 &gt; 店铺授权 &gt; 获取授权信息") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
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
    a03: function () {
        let url = "https://api.keyouyun.com/uaa/api/platform/auth/shopee/shop/info"
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        gg.getFetch(url, "json", this.a04, this);
    },
    a04: function (t) {
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/账户",
            sql: "update @.table set @.authInfo=" + Tool.rpsql(JSON.stringify(t)) + "  where @.isDefault=1",
        }]
        Tool.ajax.a01(data, this.a05, this);
    },
    a05: function () {
        $("#state").html("全部完成。")
    },
}
fun.a01();