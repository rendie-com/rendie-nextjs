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
      sql: "select " + Tool.fieldAs("config") + " FROM @.table where @.id=" + o.params.id + " limit 1"
    }]
    Tool.ajax.a01(data, this.a02, this)
  },
  a02: function (t) {
    let oo = t[0][0]
    let html = Tool.header(o.params.return, "Shopee  -&gt; 卖家账户 -&gt; 修改") + '\
      <ul class="makeHtmlTab">\
        <li onclick="Tool.open(\'jsFile2\',null)">基本信息</li>\
        <li class="hover" onclick="Tool.open(\'jsFile2\',\'01\')">站点配置</li>\
        <li onclick="Tool.open(\'jsFile2\',\'02\')">Cookie</li>\
      </ul>\
    <div class="p-2">\
      '+ this.b01(JSON.parse(oo.config)) + '\
    </div>'
    Tool.html(null, null, html);
  },
  ////////////////////////////////////
  b01: function (oo) {
    let tr = '\
    <tr class="table-light">\
        <th class="w50">编号</th>\
        <th>站点</th>\
        <th class="w80">是否冻结</th>\
        <th>店铺ID</th>\
        <th>店铺名</th>\
        <th>货币符号</th>\
        <th>活动服务费率</th>\
        <th>佣金费率</th>\
        <th>交易手续费费率</th>\
        <th>汇率</th>\
        <th>满多少免运费</th>\
        <th>税率</th>\
        <th>保留几位小数</th>\
    </tr>', num = 0;
    for (let k in oo) {
      num++;
      tr += this.b02(num, k, oo[k])
    }
    return '<table class="table align-middle center  table-hover">' + tr + '\
      <tr>\
        <td colspan="6"><textarea rows="20" class="form-control" onblur="fun.c01($(this))">'+ JSON.stringify(oo, null, 2) + '</textarea></td>\
        <td colspan="7" class="left align-top">\
          shopId = 店铺ID<br/>\
          shopName = 店铺名<br/>\
          activityServiceRate = 活动服务费率<br/>\
          commissionRate = 佣金费率<br/>\
          transactionFees = 交易手续费费率<br/>\
          exchangeRate = 汇率: 1 RMB = 0.6591 MYR<br/>\
          fullPrice = 满RM15买家免费<br/>\
          taxRate = 税率（买家要出的税）<br/>\
          scale = 保留几位小数（例如：台湾站点就没有小数）<br/>\
        </td>\
      </tr>\
      </table>'
  },
  b02: function (num, k, arr) {
    let html1 = '', html2 = '\
    <td rowspan="' + arr.length + '">' + num + '</td>\
    <td rowspan="'+ arr.length + '" class="p-1"><input type="text" class="form-control center" value="' + k + '" disabled /></td>'
    for (let i = 0; i < arr.length; i++) {
      html1 += '\
      <tr>\
          '+ (i == 0 ? html2 : '') + '\
          <td class="p-1 form-switch"><input class="form-check-input" type="checkbox"'+ (arr[i].isLock ? ' checked' : '') + ' value="' + arr[i].isLock + '" style="margin-left: auto;" disabled/></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].shopId + '" disabled/></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].shopName + '" disabled/></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].currency_symbol + '" disabled/></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].activityServiceRate + '" disabled/></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].commissionRate + '" disabled /></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].transactionFees + '" disabled /></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].exchangeRate + '" disabled /></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].fullPrice + '" disabled /></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].taxRate + '" disabled /></td>\
          <td class="p-1"><input type="text" class="form-control center" value="'+ arr[i].scale + '" disabled /></td>\
      </tr>'
    }
    return html1
  },
  c01: function (This) {
    let val = This.val();
    if (!This.attr("disabled") && val != 0) {
      This.attr("disabled", true);
      try {
        let json = JSON.parse(val);
        let data = [{
          action: o.DEFAULT_DB,
          database: "shopee/卖家账户",
          sql: "update @.table set @.config=" + Tool.rpsql(JSON.stringify(json)) + " where @.id=" + o.params.id
        }]
        Tool.ajax.a01(data, Tool.reload, this);
      } catch (error) {
        Tool.pre(["JSON格式不对", val]);
      }
    }
  },
}
fun.a01();