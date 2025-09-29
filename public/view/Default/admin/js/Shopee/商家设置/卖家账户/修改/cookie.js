'use strict';
var fun =
{
  a01: function () {
    //o.params.jsFile         选择JS文件
    //o.params.id         
    //o.params.return         
    let data = [{
      action: o.DEFAULT_DB,
      database: "shopee/卖家账户",
      sql: "select " + Tool.fieldAs("cookies") + " FROM @.table where @.id=" + o.params.id + " limit 1"
    }]
    Tool.ajax.a01(data, this.a02, this)
  },
  a02: function (t) {
    let oo = t[0][0]
    if (!oo.note) oo.note = "";
    let html = Tool.header(o.params.return, "Shopee  -&gt; 卖家账户 -&gt; 修改") + '\
    <ul class="makeHtmlTab">\
      <li onclick="Tool.open(\'jsFile2\',null)">基本信息</li>\
      <li onclick="Tool.open(\'jsFile2\',\'01\')">站点配置</li>\
      <li class="hover" onclick="Tool.open(\'jsFile2\',\'02\')">Cookie</li>\
    </ul>\
    <div class="p-2">\
      <textarea rows="28" class="form-control" disabled>'+ JSON.stringify(JSON.parse(oo.cookies), null, 2) + '</textarea>\
    </div>'
    Tool.html(null, null, html);
  },
}
fun.a01();