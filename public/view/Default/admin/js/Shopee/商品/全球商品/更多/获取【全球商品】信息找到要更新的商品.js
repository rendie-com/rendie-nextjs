'use strict';
var fun =
{
  obj: {
    A1: 1, A2: 1,
    seller: {},
    site: "sg",
    num: 1,
    cursor: "",//下一页的参数
  },
  a01: function () {
    let html = Tool.header(o.params.return, 'Shopee - 商品列表 - 全球商品 - 更多 - 获取【全球商品】信息找到要更新的商品') + '\
        <div class="p-2">\
          <table class="table table-hover">\
          <tbody>\
            <tr><td class="right w150">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
            <tr><td class="right">商品编码：</td><td id="proid" colspan="2"></td></tr>\
            <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
            <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
    Tool.html(this.a02, this, html);
  },
  a02: function () {
    Tool.login.a01(this.a03, this)
  },
  a03: function (t) {
    this.obj.seller = t;
    let data = [{
      action: "sqlite",
      database: "shopee/商品/全球商品",
      sql: "update @.table set @.isup=0",
    }];
    Tool.ajax.a01(data, this.a04, this);
  },
  a04: function () {
    Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d01, this, this.e01)
  },
  /////////////////////////////////////////////////////////////////////////////
  b01: function (_1688, shopee) {
    let oo = {
      isName: false,//标题是否相同
      isPic: false,//首图是澡相同
      isPrice: false,//价格是否相同
      isAttr: false,//属性和属性图是否相同
    }, MaxCurrentPrices = {}, sku = {};
    for (let i = 0; i < _1688.length; i++) {
      if (_1688[i].proid == shopee.parent_sku) {
        if (_1688[i].ManualReview_1688_subject == shopee.name) { oo.isName = true; }
        if (_1688[i].pic == shopee.cover_image) { oo.isPic = true; }
        if (_1688[i].list[0][0]) {//1688有异常商品
          sku = JSON.parse(_1688[i].list[0][0].sku); 
          MaxCurrentPrices = Tool.maxPrice.a01(sku)
          if (shopee.price_detail.origin_price_min == shopee.price_detail.origin_price_max && shopee.price_detail.origin_price_max == MaxCurrentPrices.price) { oo.isPrice = true; }
          oo.isAttr = this.b02(JSON.parse(_1688[i].list[0][0].attrPic_shopee), sku, shopee.model_list)
        }
        break;
      }
    }
    return oo;
  },
  //对比属性名和属性图是否相同
  b02: function (_1688_attrPic_shopee, _1688_sku, shopee_model_list) {
    let arr = _1688_sku.skuProps, attrArr = [], isAttr = false;//属性名和属性图是否相同
    if (_1688_attrPic_shopee && arr) {//只有一个价格就没有属性了
      if (arr.length == 1) {
        for (let i = 0; i < arr[0].value.length; i++) {
          attrArr.push({
            name: arr[0].value[i].name,
            image: this.b04(_1688_attrPic_shopee, arr[0].value[i].imageUrl),
          });
        }
      }
      else if (arr.length == 2) {
        for (let i = 0; i < arr[0].value.length; i++) {
          for (let j = 0; j < arr[1].value.length; j++) {
            attrArr.push({
              name: arr[0].value[i].name + "," + arr[1].value[j].name,
              image: this.b04(_1688_attrPic_shopee, arr[0].value[i].imageUrl),
            });
          }
        }
      }
      else {
        Tool.pre("还没有开发！！！- 2025/9/9");
      }
      if (attrArr.length == shopee_model_list.length) {
        isAttr = this.b03(attrArr, shopee_model_list)
      }
      //else {
      //编码R459361属性超过100个，需要看一上能否更新成功。
      //Tool.pre(["异常！！！", attrArr.length + "个====" + shopee_model_list.length + "个", attrArr, "=========================", shopee_model_list])
      //}
    }
    else {
      isAttr = true;
    }
    return isAttr
  },
  b03: function (attrArr, shopee_model_list) {
    let isAttr = true;//是否相同
    for (let i = 0; i < attrArr.length; i++) {
      if (attrArr[i].name != shopee_model_list[i].name || attrArr[i].image != shopee_model_list[i].image) {
        isAttr = false; break;
      }
    }
    return isAttr;
  },
  b04: function (_1688_attrPic_shopee, imageUrl) {
    let image = null;
    for (let i = 0; i < _1688_attrPic_shopee.length; i++) {
      if (_1688_attrPic_shopee[i].imageUrl == imageUrl) {
        image = _1688_attrPic_shopee[i].shopee;
      }
    }
    return image;
  },
  /////////////////////////////////////////////////////////////////////////////
  d01: function () {
    let oo = this.obj;
    let arr = [
      "SPC_CDS=" + oo.seller.SPC_CDS,
      "SPC_CDS_VER=2",
      "cursor=" + oo.cursor,
      "page_size=12",
      "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
      "cbsc_shop_region=" + oo.site
    ]
    let url = "https://seller.shopee.cn/api/v3/mtsku/list/get_product_list?" + arr.join("&")
    $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
    $("#state").html("正在获取第" + oo.A1 + "页商品。。。");
    gg.getFetch(url, "json", this.d02, this);
  },
  d02: function (oo) {
    if (this.obj.A2 == 1) { this.obj.A2 = Math.ceil(oo.data.page_info.total / 12); }
    this.obj.cursor = oo.data.page_info.cursor;//上一页要用的。
    let proidArr = [], products = oo.data.products
    for (let i = 0; i < products.length; i++) {
      proidArr.push(products[i].parent_sku);
    }
    this.d03(proidArr, products)
  },
  d03: function (proidArr, products) {
    $("#proid").html(proidArr.join(" , "));
    let data = [{
      action: "sqlite",
      database: "shopee/商品/全球商品",
      sql: "select " + Tool.fieldAs("proid,pic,ManualReview_1688_subject,manualreview_1688_fromid") + " FROM @.table where @.proid in('" + proidArr.join("','") + "')",
      list: [{
        action: "sqlite",
        database: "1688_prodes/${id_99:manualreview_1688_fromid}",
        sql: "select " + Tool.fieldAs("attrPic_shopee,sku") + " FROM @.prodes where @.fromid=${manualreview_1688_fromid}",
      },]
    }]
    $("#state").html("正在获取商品...");
    Tool.ajax.a01(data, this.d04, this, products);
  },
  d04: function (t, products) {
    let data = [], upArr = ["@.isup=1"], oo
    for (let i = 0; i < products.length; i++) {
      oo = this.b01(t[0], products[i]);
      if (!oo.isName) { upArr.push("@.BeforeReview=18"); }
      else if (!oo.isPic) { upArr.push("@.BeforeReview=19"); }
      else if (!oo.isPrice) { upArr.push("@.BeforeReview=20"); }
      else if (!oo.isAttr) { upArr.push("@.BeforeReview=21"); }
      data.push({
        action: "sqlite",
        database: "shopee/商品/全球商品",
        sql: "select @.id FROM @.table where @.proid='" + products[i].parent_sku + "'",
        list: [{
          action: "sqlite",
          database: "shopee/商品/全球商品",
          sql: "update @.table set " + upArr.join(",") + " where @.proid='" + products[i].parent_sku + "'",
        }],
        elselist: [{
          action: "sqlite",
          database: "shopee/商品/全球商品",
          sql: "insert into @.table(@.proid,@.isup)values('" + products[i].parent_sku + "',1)"
        }]
      });
    }
    Tool.ajax.a01(data, this.d05, this);
  },
  d05: function (t) {
    this.obj.A1++;
    this.a04();
  },
  /////////////////////////
  e01: function () {
    $("#state").html("全部完成。")
  },
}
fun.a01();