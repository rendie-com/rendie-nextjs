Object.assign(Tool, {
  common1: {
    a01: function (_1688Arr, keyouyun, next, This, t) {
      let oo = {
        _1688Arr: _1688Arr,
        B1: 1, B2: _1688Arr.length,
        keyouyun: keyouyun,
        next: next,
        This: This,
        t: t
      }
      this.a02(oo);
    },
    a02: function (oo) {
      Tool.x1x2("B", oo.B1, oo.B2, this.a03, this, this.e02, oo);
    },
    a03: function (oo) {
      let siteNum = ""
      let shopee_site = JSON.parse(oo._1688Arr[oo.B1 - 1].shopee_site)
      let shopee_order_sn = JSON.parse(oo._1688Arr[oo.B1 - 1].shopee_order_sn)
      //为什么还要这个for语句?答：一个1688订单可能有多个shopee订单。
      for (let i = 0; i < shopee_order_sn.length; i++) {
        if (shopee_order_sn[i] == oo.keyouyun.ordersn) {
          siteNum = shopee_site[i];
          break;
        }
      }
      if (siteNum) {
        $("#siteNum").html(siteNum);
        this.d01(siteNum, oo);
      }
      else {
        Tool.at("找不找订单对应的站点。")
      }
    },
    /////////////////////////////////////////
    d01: function (siteNum, oo) {
      let data = [{
        action: "sqlite",
        database: "shopee/订单/订单管理/" + siteNum,
        sql: "select " + Tool.fieldAs("purchaseInfo") + " FROM @.table where @.order_sn='" + oo.keyouyun.ordersn + "' limit 1",
      }]
      $("#state").html("正在获取【shopee/订单/订单管理】信息。");
      Tool.ajax.a01(data, this.d02, this, oo);
    },
    d02: function (t, oo) {
      if (t[0][0].purchaseInfo) {
        this.d03(oo);
      }
      else {
        Tool.at("这个订单的采购信息没有填写。");
      }
    },
    d03: function (oo) {
      let url = "https://air.1688.com/app/ctf-page/trade-order-detail/index.html?orderId=" + oo._1688Arr[oo.B1 - 1].orderid
      $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
      if (oo._1688Arr[oo.B1 - 1].WaybillNumber) {//运单号码
        this.d04(oo)
      }
      else {
        $("#state").html("1688还没发货...................");
        this.e01("", oo)
      }
    },
    d04: function (oo) {
      if (oo.keyouyun.expressInfos.indexOf('"' + oo._1688Arr[oo.B1 - 1].WaybillNumber + '"') != -1) {
        $("#state").html("1688还发货了，且客优云也发货了。");
        this.e01("", oo);
      }
      else {
        this.d05(oo)
      }
    },
    d05: function (oo) {
      let url = "https://api.keyouyun.com/jax/api/package/add/package/express"
      let data = {
        "packageId": oo.keyouyun.packageId,
        "ordersn": oo.keyouyun.ordersn,
        "newNo": oo._1688Arr[oo.B1 - 1].WaybillNumber
      }
      //////////保存要用///////////////////
      oo.keyouyun.expressInfos = JSON.parse(oo.keyouyun.expressInfos);
      oo.keyouyun.expressInfos.push({ "number": oo._1688Arr[oo.B1 - 1].WaybillNumber, "received": false })
      gg.postFetch(url, JSON.stringify(data), this.d06, this, oo)
    },
    d06: function (t, oo) {
      if (t === true) {
        oo.keyouyun.expressInfos = JSON.stringify(oo.keyouyun.expressInfos);//oo.keyouyun.expressInfos下次还要用
        let data = [{
          action: "sqlite",
          database: "shopee/客优云/包裹管理",
          sql: "update @.table set @.expressInfos=" + Tool.rpsql(oo.keyouyun.expressInfos) + "  where  @.nodeCode='" + oo.keyouyun.nodeCode + "' and @.packageId='" + oo.keyouyun.packageId + "'",
        }]
        Tool.ajax.a01(data, this.e01, this, oo);
      }
      else {
        Tool.at("在客优云添加运单号失败。")
      }
    },
    //////////////////////////////////////////////
    e01: function (t, oo) {
      if (t) {
        Tool.pre("可以停一下。")
      }
      else {
        oo.B1++
        this.a02(oo);
      }
    },
    e02: function (oo) {
      Tool.apply({
        _1688Arr: oo._1688Arr,
        keyouyun: oo.keyouyun,
      }, oo.next, oo.This, oo.t);
    },
  }
})