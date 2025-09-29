Object.assign(Tool, {
  header2: function (jsFile) {
    let html = '\
        <header class="panel-heading">\
          <div onclick="Tool.main(\'\')"'+ (!jsFile ? ' class="active"' : '') + '>账户</div>\
          <div onclick="Tool.main(\'jsFile=js19\')"'+ (jsFile == "js19" ? ' class="active"' : '') + '>店铺授权</div>\
          <div onclick="Tool.main(\'jsFile=js14\')"'+ (jsFile == "js14" ? ' class="active"' : '') + '>订单管理</div>\
          <div onclick="Tool.main(\'jsFile=js02\')"'+ (jsFile == "js02" ? ' class="active"' : '') + '>包裹管理</div>\
          <div onclick="Tool.main(\'jsFile=js04\')"'+ (jsFile == "js04" ? ' class="active"' : '') + '>充值日志</div>\
          <div onclick="Tool.main(\'jsFile=js06\')"'+ (jsFile == "js06" ? ' class="active"' : '') + '>系统消息</div>\
          <div onclick="Tool.main(\'jsFile=js08\')"'+ (jsFile == "js08" ? ' class="active"' : '') + '>问题件</div>\
          <div onclick="Tool.main(\'jsFile=js10\')"'+ (jsFile == "js10" ? ' class="active"' : '') + '>黑名单</div>\
          <div onclick="Tool.main(\'jsFile=js12\')"'+ (jsFile == "js12" ? ' class="active"' : '') + '>违禁词</div>\
        </header>'
    return html;
  },
  login: {
    a01: function (next, This, t) {
      let oo = {
        next: next,
        This: This,
        t: t
      }
      gg.isRD(this.a02, this, oo);
    },
    a02: function (t, oo) {
      $("#state").html("正在获得配置参数");
      let data = [{
        action: o.DEFAULT_DB,
        database: "shopee/客优云/账户",
        sql: "select " + Tool.fieldAs("username,password,cookies,localstorage") + " FROM @.table limit 1",
      }]
      Tool.ajax.a01(data, this.a03, this, oo)
    },
    a03: function (t, o2) {
      let o1 = t[0][0];
      $("#username").html(o1.username);
      Tool.loginKeyouyun.a01(o1.username, o1.password, JSON.parse(o1.cookies), JSON.parse(o1.localstorage), $("#state"), this.a04, this, o2)
    },
    a04: function (t, oo) {
      Tool.apply(t, oo.next, oo.This, oo.t);
    },
  }
})