'use strict';
var fun =
{
  obj: {
    A1: 1, A2: 99,
    B1: 1, B2: 0,
    fieldAs: "fromid,isHash,des,attr,sku,videoUrl,uptime,addtime,pic,attrPic,attrPic_shopee,ExplanationVideo,pic_shopee,desPic_shopee",
    pagesize: 100,
  },
  a01: function () {
    let html = Tool.header(o.params.return, 'Shopee - 商品列表 - 全球商品 - 更多 - 把【shopee放大镜图-已弃用.db】同步过来') + '\
        <div class="p-2">\
          <table class="table table-hover">\
          <tbody>\
            <tr><td class="right w150">数数库进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
            <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
            <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
    Tool.html(this.a02, this, html);
  },
  a02: function () {
    Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a03, this, this.d05);
  },
  a03: function () {
    Tool.at("需要已弃用，数据库。")
    // let where = " "
    // let data = [{
    //   action: "sqlite",
    //   database: "1688_prodes-已弃用/" + ("" + this.obj.A1).padStart(("" + this.obj.A2).length, '0'),
    //   sql: "select " + Tool.fieldAs(this.obj.fieldAs) + " FROM @.prodes" + where + Tool.limit(this.obj.pagesize, this.obj.B1),
    // }]
    // if (this.obj.B2 == 0) {
    //   data.push({
    //     action: "sqlite",
    //     database: "1688_prodes-已弃用/" + ("" + this.obj.A1).padStart(("" + this.obj.A2).length, '0'),
    //     sql: "select count(1) as count FROM @.prodes" + where,
    //   })
    // }
    // $("#state").html("正在获取商品...");
    // Tool.ajax.a01(data, this.d01, this);
  },
  //////////////////////////////////////////////////
  d01: function (t) {
    if (this.obj.B2 == 0) { this.obj.B2 = Math.ceil(t[1][0].count / this.obj.pagesize); }
    Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d02, this, this.d04, t[0]);
  },
  d02: function (arr) {
    let data = [], arrL = this.b01(), arrR = [];
    for (let i = 0; i < arr.length; i++) {
      arrR = this.b02(arr[i]);
      data.push({
        action: "sqlite",
        database: "1688/采集箱/商品列表/详情/" + Tool.remainder(arr[i].fromid, 1000),
        sql: "select @.fromid FROM @.table where @.fromid=" + arr[i].fromid,
        list: [{
          action: "sqlite",
          database: "1688/采集箱/商品列表/详情/" + Tool.remainder(arr[i].fromid, 1000),
          sql: "update @.table set @." + this.b03(arrL, arrR).join(",") + " where @.fromid=" + arr[i].fromid
        }],
        elselist: [{
          action: "sqlite",
          database: "1688/采集箱/商品列表/详情/" + Tool.remainder(arr[i].fromid, 1000),
          sql: "insert into @.table(@." + arrL.join(",") + ")values(" + arrR.join(",") + ")"
        }]
      })
    }
    Tool.ajax.a01(data, this.d03, this)
  },
  d03: function () {
    this.obj.B1++;
    this.a03();
  },
  d04: function () {
    this.obj.A1++;
    this.obj.B1 = 1;
    this.obj.B2 = 0;
    this.a02();
  },
  d05: function () {
    $("#state").html("全部守成");;
  },
  /////////////////////////////////////////////////////
  b01: function () {
    return this.obj.fieldAs.split(",").join(",@.").split(",");
  },
  b02: function (oo) {
    let arr = [];
    for (let k in oo) {
      arr.push(Tool.rpsql(oo[k]));
    }
    return arr
  },
  b03: function (arrL, arrR) {
    let arr = []
    for (let i = 0; i < arrL.length; i++) {
      arr.push(arrL[i] + "=" + arrR[i]);
    };
    return arr;
  },
}
fun.a01();