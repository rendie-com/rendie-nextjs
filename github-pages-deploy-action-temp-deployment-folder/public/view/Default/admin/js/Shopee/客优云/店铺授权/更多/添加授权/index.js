'use strict';
var fun =
{
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 客优云 &gt; 店铺授权 &gt; 添加授权") + '\
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
        let url = "https://api.keyouyun.com/uaa/api/platform/auth/url"
        gg.getFetch(url, "json", this.a04, this);
    },
    a04: function (t) {
        let url = "";
        for (let i = 0; i < t.length; i++) {
            if (t[i].url.indexOf("partner_id=841391") != -1) {
                url = t[i].url; break;
            }
        }
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        gg.tabs_remove_create_indexOf(2, url, ['class="title">Select Account</div>'], false, this.a05, this)
    },
    a05: function (t) {
        gg.tabs_executeScript_indexOf(2, ["jquery"], "$('.username').click();", ['Authorize Merchant'], false, this.a06, this);
    },
    a06: function (t) {
        $("#state").html("注入_登录");
        Tool.ajax.text("/" + o.path + "admin/js/Shopee/客优云/店铺授权/更多/添加授权/注入_登录.js", this.a07, this);
    },
    a07: function (t) {
        t += "\nrendie_fun.a01()"
        gg.tabs_executeScript_indexOf(2, ["jquery"], t, ['授权正常'], true, this.a08, this);
    },
    a08: function () {
        $("#state").html("全部完成。");
    },
}
fun.a01();