'use strict';
var fun =
{
  a01: function () {
    //o.params.jsFile         选择JS文件
    //o.params.id             ID
    //o.params.return         返回
    this.a02();
  },
  a02: function () {
    let data = [{
      action: o.DEFAULT_DB,
      database: "main",
      sql: "select " + Tool.fieldAs("id,name,value") + " FROM @.config where @.id=" + o.params.id,
    }]
    Tool.ajax.a01(data, this.a03, this);
  },
  a03: function (t) {
    let optionArr = ['<option>===请选择分类配置信息===</option>'];
    for (let i = 0; i < menuList.length; i++) {
      optionArr.push('<option disabled>' + (i + 1) + '. ' + menuList[i].name + '</option>')
      for (let j = 0; j < menuList[i].list.length; j++) {
        if (menuList[i].list[j]) {
          let val = menuList[i].list[j].template
          optionArr.push('<option value="' + val + '" ' + (t[0][0].name == val ? 'selected="selected"' : '') + '>(' + (i + 1) + '-' + (j + 1) + ') ' + val + '</option>');
        }
      }
    }
    let html = Tool.header(o.params.return, "系统  &gt; 分类配置信息 &gt; 修改") + '\
    <div class="p-2">\
      <table class="table table-hover align-middle">\
        <tbody>\
          <tr>\
            <td class="w100 right">名称：</td>\
            <td><select onchange="fun.c01($(this),this.options[this.selectedIndex].value)" class="form-select">'+ optionArr.join("") + '</select></td>\
          </tr>\
          <tr>\
          <td class="right">值：</td>\
            <td><textarea rows="25" class="form-control" onblur="fun.c03($(this))">'+ (t[0][0].value ? JSON.stringify(JSON.parse(t[0][0].value), null, 2) : "") + '</textarea></td>\
          </tr>\
        </tbody>\
      </table>\
    </div>'
    Tool.html(null, null, html);
  },
  //////////////////////////////////////////////
  c01: function (This, V) {
    if (!This.attr("disabled")) {
      This.attr("disabled", true);
      let data = [{
        action: o.DEFAULT_DB,
        database: "main",
        sql: "update @.config set @.name='" + V + "' where @.id=" + o.params.id,
      }]
      Tool.ajax.a01(data, this.c02, this, This);
    }
  },
  c02: function (t, This) {
    This.attr("disabled", false);
  },
  c03: function (This) {
    let val = This.val();
    if (!This.attr("disabled")) {
      This.attr("disabled", true);
      try {
        let json = JSON.parse(val);
        let data = [{
          action: o.DEFAULT_DB,
          database: "main",
          sql: "update @.config set @.value=" + Tool.rpsql(JSON.stringify(json)) + " where @.id=" + o.params.id,
        }]
        Tool.ajax.a01(data, this.c02, this, This);
      } catch (error) {
        Tool.pre(["JSON格式不对", val]);
      }
    }
  },
}
fun.a01();