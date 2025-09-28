'use strict';
var fun =
{
  a01: function () {
    //o.params.jsFile         选择JS文件
    //o.params.id         
    //o.params.return         
    let data = [{
      action: "sqlite",
      database: "shopee/客优云/账户",
      sql: "select " + Tool.fieldAs("fromid,username,password,email,phone,note,cookies,sort,points") + " FROM @.table where @.id=" + o.params.id + " limit 1"
    }]
    Tool.ajax.a01(data, this.a02, this)
  },
  a02: function (t) {
    let oo = t[0][0]
    if (!oo.username) oo.username = "";
    if (!oo.password) oo.password = "";
    if (!oo.phone) oo.phone = "";
    if (!oo.email) oo.email = "";
    if (!oo.note) oo.note = "";
    if (!oo.cookies) oo.cookies = "[]";
    let html = Tool.header(o.params.return, "Shopee &gt; 客优云 &gt; 账户 &gt; 修改") + '\
    <div class="p-2">\
      <table class="table table-hover align-middle">\
        <tbody>\
        <tr>\
          <td class="w200 right">来源ID：</td>\
          <td class="w-50"><input type="text" class="form-control" value="'+ oo.fromid + '" onblur="fun.c01($(this),\'fromid\',\'' + oo.fromid + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="w200 right">用户名：</td>\
          <td class="w-50"><input type="text" class="form-control" value="'+ oo.username + '" onblur="fun.c01($(this),\'username\',\'' + oo.username + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">密码：</td>\
          <td><input type="text" class="form-control" value="'+ oo.password + '" onblur="fun.c01($(this),\'password\',\'' + oo.password + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">积分：</td>\
          <td><input type="number" class="form-control" value="'+ oo.points + '" onblur="fun.c01($(this),\'points\',\'' + oo.points + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">排序：</td>\
          <td><input type="number" class="form-control" value="'+ oo.sort + '" onblur="fun.c01($(this),\'sort\',\'' + oo.sort + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">手机号：</td>\
          <td><input type="text" class="form-control" value="'+ oo.phone + '" onblur="fun.c01($(this),\'phone\',\'' + oo.phone + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">邮件：</td>\
          <td><input type="text" class="form-control" value="'+ oo.email + '" onblur="fun.c01($(this),\'email\',\'' + oo.email + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">备注：</td>\
          <td><input type="text" class="form-control" value="'+ oo.note + '" onblur="fun.c01($(this),\'note\',\'' + oo.note + '\')"></td>\
          <td></td>\
        </tr>\
        <tr>\
          <td class="right">Cookie：</td>\
          <td class="w-50"><textarea rows="30" class="form-control" disabled>'+ JSON.stringify(JSON.parse(oo.cookies), null, 2) + '</textarea></td>\
          <td></td>\
        </tr>\
      </tbody>\
    </table>\
    </div>'
    Tool.html(null, null, html);
  },
  /////////////////////////////////////////////////////////
  c01: function (This, L, V) {
    let val = This.val();
    if (val != V && !This.attr("disabled")) {
      This.attr("disabled", true);
      let data = [{
        action: "sqlite",
        database: "shopee/客优云/账户",
        sql: "update @.table set @." + L + "='" + val + "' where @.id=" + o.params.id
      }]
      Tool.ajax.a01(data, this.c02, this, This);
    }
  },
  c02: function (t, This) {
      This.attr("disabled", false);   
  },
}
fun.a01()