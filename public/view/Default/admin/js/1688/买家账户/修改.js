'use strict';
var fun =
{
  a01: function () {
    //obj.params.jsFile       选择JS文件
    //obj.params.id           ID 
    this.a02()
  },
  a02: function () {
    let data = [{
      action: "sqlite",
      database: "1688/买家账户",
      sql: "select " + Tool.fieldAs("id,note,password,username,phone,sort") + " FROM @.table where @.id=" + obj.params.id,
    }]
    Tool.ajax.a01(data, this.a03, this)
  },
  a03: function (t) {
    let oo = t[0][0]
    let html = Tool.header(obj.params.return, "1688 &gt; 买家账户 &gt; 修改") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle" id="div1">\
            <tbody>\
            <tr>\
              <td class="w150 right">登录用户名：</td>\
              <td><input type="text" class="form-control" value="'+ oo.username + '" onblur="fun.c01($(this),\'username\',\'' + oo.username + '\')"></td>\
              <td></td>\
            </tr>\
            <tr>\
              <td class="right">密码：</td>\
              <td><input type="text" class="form-control" value="'+ oo.password + '" onblur="fun.c01($(this),\'password\',\'' + oo.password + '\')"></td>\
              <td></td>\
            </tr>\
            <tr>\
              <td class="right">排序：</td>\
              <td><input type="text" class="form-control" value="'+ oo.sort + '" onblur="fun.c01($(this),\'sort\',\'' + oo.sort + '\')"></td>\
              <td></td>\
            </tr>\
            <tr>\
              <td class="right">手机号：</td>\
              <td><input type="text" class="form-control" value="'+ oo.phone + '" onblur="fun.c01($(this),\'phone\',\'' + oo.phone + '\')"></td>\
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
  c01: function (This, L, V) {
    let val = This.val();
    if (val != V && !This.attr("disabled")) {
      This.attr("disabled", true);
      let data = [{
        action: "sqlite",
        database: "1688/买家账户",
        sql: "update @.table set @." + L + "='" + val + "' where @.id=" + obj.params.id
      }]
      Tool.ajax.a01(data, this.c02, this, This);
    }
  },
  c02: function (t, This) {
    This.attr("disabled", false);
  },
}
fun.a01();