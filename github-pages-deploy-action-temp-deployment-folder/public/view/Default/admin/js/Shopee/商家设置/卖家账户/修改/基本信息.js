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
      sql: "select " + Tool.fieldAs("username,password,phone,company,note,sort,withdrawee") + " FROM @.table where @.id=" + o.params.id + " limit 1"
    }]
    Tool.ajax.a01(data, this.a02, this)
  },
  a02: function (t) {
    let oo = t[0][0]
    if (!oo.note) oo.note = "";
    let html = Tool.header(o.params.return, "Shopee  -&gt; 卖家账户 -&gt; 修改") + '\
    <ul class="makeHtmlTab">\
      <li class="hover" onclick="Tool.open(\'jsFile2\',null)">基本信息</li>\
      <li onclick="Tool.open(\'jsFile2\',\'01\')">站点配置</li>\
      <li onclick="Tool.open(\'jsFile2\',\'02\')">Cookie</li>\
    </ul>\
    <div class="p-2">\
      <table class="table table-hover align-middle">\
        <tbody>\
        <tr>\
          <td class="w100 right">用户名：</td>\
          <td class="w-50"><input type="text" class="form-control" value="'+ oo.username + '" onblur="fun.c01($(this),\'username\',\'' + oo.username + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">密码：</td>\
          <td><input type="text" class="form-control" value="'+ oo.password + '" onblur="fun.c01($(this),\'password\',\'' + oo.password + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">提现人：</td>\
          <td><input class="form-control" type="text" value="'+ oo.withdrawee + '" onblur="fun.c01($(this),\'withdrawee\',\'' + oo.withdrawee + '\')"></td>\
          <td></td>\
        </tr>\
          <tr>\
          <td class="right">排序：</td>\
          <td><input type="number" class="form-control w100 center" value="'+ oo.sort + '" onblur="fun.c01($(this),\'sort\',\'' + oo.sort + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">手机号：</td>\
          <td><input type="text" class="form-control" value="'+ oo.phone + '" onblur="fun.c01($(this),\'phone\',\'' + oo.phone + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">公司：</td>\
          <td><input type="text" class="form-control" value="'+ oo.company + '" onblur="fun.c01($(this),\'company\',\'' + oo.company + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">备注：</td>\
          <td><input type="text" class="form-control" value="'+ oo.note + '" onblur="fun.c01($(this),\'note\',\'' + oo.note + '\')"></td>\
          <td></td>\
        </tr>\
      </tbody>\
    </table>\
    </div>'
    Tool.html(null, null, html);
  },
  //////////////////////////////////////////
  c01: function (This, L, V) {
    let val = This.val();
    if (val != V && !This.attr("disabled")) {
      This.attr("disabled", true);
      let data = [{
        action: o.DEFAULT_DB,
        database: "shopee/卖家账户",
        sql: "update @.table set @." + L + " =" + Tool.rpsql(val) + " where @.id=" + o.params.id
      }]
      Tool.ajax.a01(data, this.c02, this, This);
    }
  },
  c02: function (t, This) {
    This.attr("disabled", false);
  },
}
fun.a01();