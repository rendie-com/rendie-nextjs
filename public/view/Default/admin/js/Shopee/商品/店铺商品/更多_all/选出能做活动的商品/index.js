'use strict';
var fun =
{
  obj: {
    A1: 1, A2: 0, Aarr: [],
    B1: 1, B2: 0,
    seller: [],
  },
  a01: function () {
    //o.params.site           站点
    let html = Tool.header(o.params.return, 'Shopee &gt; 商品列表 &gt; 店铺商品 &gt; 更多_all &gt; 选出能做活动的商品') + '\
        <div class="p-2">\
          <table class="table table-hover align-middle">\
          <tbody>\
            <tr>\
                <td class="right w150">说明：</td><td colspan="2">\
                (1)定价与原价相同，且不需要改价，则可以打折，否则不可以。<br/>\
                (2)【最终折扣>=80】或【最终折扣<=8】不可以做活动。<br/>\
                (3)【最低购买量_不匹配】设置不能做活动。<br/>\
                (4)【问题数据】设置不能做活动。<br/>\
                </td>\
            </tr>\
            <tr><td class="right">站点：</td><td colspan="2" id="site"></td></tr>\
            <tr><td class="right">站点进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
            <tr><td class="right">第几个店铺：</td><td colspan="2" id="num"></td></tr>\
            <tr><td class="right">店铺进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
            <tr><td class="right">物流方式：</td><td id="logistics" colspan="2"></td></tr>\
            <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
            <tr><td class="right">计算方式：</td><td id="method" colspan="2"></td></tr>\
            <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
    Tool.html(this.a02, this, html);
  },
  a02: function () {
    $("#state").html("正在获得配置参数");
    let data = [{
      action: o.DEFAULT_DB,
      database: "shopee/卖家账户",
      sql: "select " + Tool.fieldAs("config") + " FROM @.table where @.isdefault=1 limit 1",
    }];
    Tool.ajax.a01(data, this.a03, this);
  },
  a03: function (t) {
    let seller = JSON.parse(t[0][0].config), arr = this.b01(seller)
    this.obj.seller = seller;
    this.obj.Aarr = arr;
    this.obj.A2 = arr.length;
    this.a04();
  },
  a04: function () {
    Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a05, this, this.e02)
  },
  a05: function () {
    let oo = this.obj.Aarr[this.obj.A1 - 1]
    $("#site").html(Tool.site(oo.site));
    this.obj.B2 = oo.B2;
    this.d01();
  },
  ////////////////////////////////////
  b01: function (seller) {
    let arr = [];
    if (o.params.site && o.params.num) {
      this.obj.B1 = Tool.int(o.params.num)
      arr = [{
        site: o.params.site,
        B2: this.obj.B1
      }];
    }
    else {
      for (let k in seller) {
        if (k != "SPC_CDS") {
          arr.push({
            site: k,
            B2: seller[k].length
          })
        }
      }
    }
    return arr;
  },
  ////////////////////////////////////////
  d01: function () {
    Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d02, this, this.e01);
  },
  d02: function () {
    $("#num").html(this.obj.B1)//第几个店铺
    Tool.get_isDiscount.a01(this.obj.seller, this.obj.Aarr[this.obj.A1 - 1].site, this.obj.B1, "C", this.d03, this);
  },
  d03: function () {
    this.obj.B1++;
    this.d01();
  },
  ////////////////////////////////////////////////////////////////////////////////////
  e01: function () {
    $("#B1").css("width", "0%");
    $("#B1,#B2").html("");
    this.obj.B1 = 1; this.obj.B2 = 0;
    this.obj.A1++;
    this.a04();
  },
  e02: function () {
    $("#state").html("全部完成");
  },
}
fun.a01();