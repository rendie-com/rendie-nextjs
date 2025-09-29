Object.assign(Tool, {
  //加备注
  common2: {
    a01: function (obj, next, This, t) {
      let oo = {
        obj: obj,
        next: next,
        This: This,
        t: t,
        itemsIsBool: false,//是否有“未发货”
      }
      this.a02(oo);
    },
    a02: function (oo) {
      let _1688Arr = [];
      for (let i = 0; i < oo.obj._1688Arr.length; i++) {
        //去掉有【交易成功】或【交易关闭】的商品。（例如：【1688PLUS会员月卡】【退款成功】就没有运单号。）
        if (oo.obj._1688Arr[i].status != "交易成功" && oo.obj._1688Arr[i].status != "交易关闭" && oo.obj._1688Arr[i].status != "已收货未到账") {
          if (this.b01(oo.obj._1688Arr[i].items)) { oo.itemsIsBool = true; }//是否有“未发货”
          _1688Arr.push(null);
        }
      }
      oo.obj._1688Arr = _1688Arr;
      this.a03(oo);
    },
    a03: function (oo) {
      if (oo.obj._1688Arr.length > 1) {
        $("#state").html("一个shopee订单编号，而1688有多个快递单号，需要【包裹备注】。");
        this.a04(oo)
      }
      else {
        $("#state").html("去删除【0000】运单号。");
        this.d01(oo);
      }
    },
    a04: function (oo) {
      let comment = "【要来" + oo.obj._1688Arr.length + "个包裹】"
      if (oo.obj.keyouyun.packageCommentList.indexOf(comment) == -1) {
        let url = "https://api.keyouyun.com/jax/api/package/comment"
        let data = { "packageId": oo.obj.keyouyun.packageId, "comment": oo.obj.keyouyun.packageCommentList + comment, "imgs": "" }
        gg.typeFetch(url, "PUT", JSON.stringify(data), this.a05, this, oo);
      }
      else {
        $("#state").html("已经有【包裹备注】了,去删除【0000】运单号。");
        this.d01(oo);
      }
    },
    a05: function (t, oo) {
      if (t === true) {
        let packageCommentList = [{
          login: "574754058@qq.com",
          comment: oo.obj.keyouyun.packageCommentList + "【要来" + oo.obj._1688Arr.length + "个包裹】"
        }]
        let data = [{
          action: "sqlite",
          database: "shopee/客优云/包裹管理",
          sql: "update @.table set @.packageCommentList=" + Tool.rpsql(JSON.stringify(packageCommentList)) + "  where  @.nodeCode='" + oo.obj.keyouyun.nodeCode + "' and @.packageId='" + oo.obj.keyouyun.packageId + "'",
        }]
        Tool.ajax.a01(data, this.a06, this, oo);
      }
      else {
        Tool.pre("包裹备注失败。");
      }
    },
    a06: function (t, oo) {
      this.d01(oo);
    },
    /////////////////////////////////////////
    b01: function (t) {//是否有“未发货”
      let arr = JSON.parse(t);
      let isBool = false;
      for (let i = 0; i < arr.length; i++) {
        if ("未发货" == arr[i].status) {
          isBool = true; break;
        }
      }
      return isBool
    },
    //////////////////////////////////////////////////////////////////////////////////
    d01: function (oo) {
      oo.obj.keyouyun.expressInfos = JSON.parse(oo.obj.keyouyun.expressInfos);
      //客优云运单数 > 实际运单数
      if (oo.obj.keyouyun.expressInfos.length > oo.obj._1688Arr.length) {
        this.d02(oo);
      }
      else {
        $("#state").html("不用删除客优云的【0000】运单号");
        this.d05("", oo)
      }
    },
    d02: function (oo) {
      if (oo.itemsIsBool) {
        //是否有“未发货”的商品（true表示有），有的话就，备注，还不用删除【0000】运单号。
        this.e01(oo)
      }
      else {
        //找不到【部分已发货】就删除【0000】运单号。
        if (oo.obj.keyouyun.packageCommentList.indexOf('【部分已发货】') == -1) {
          //删除【0000】运单号
          this.d03(oo)
        }
        else {
          $("#state").html("不用删除客优云的【0000】运单号");
          this.d05("", oo)
        }
      }
    },
    d03: function (oo) {
      let url = "https://api.keyouyun.com/jax/api/package/express"
      let data = { "expressNum": "0000", "packageId": oo.obj.keyouyun.packageId }
      gg.typeFetch(url, "DELETE", JSON.stringify(data), this.d04, this, oo);
    },
    d04: function (t, oo) {
      if (t === true) {
        let arr = []
        for (let i = 0; i < oo.obj.keyouyun.expressInfos.length; i++) {
          if (oo.obj.keyouyun.expressInfos[i].number != "0000") {
            arr.push(oo.obj.keyouyun.expressInfos[i])
          }
        }
        let data = [{
          action: "sqlite",
          database: "shopee/客优云/包裹管理",
          sql: "update @.table set @.expressInfos=" + Tool.rpsql(JSON.stringify(arr)) + "  where  @.nodeCode='" + oo.obj.keyouyun.nodeCode + "' and @.packageId='" + oo.obj.keyouyun.packageId + "'",
        }]
        Tool.ajax.a01(data, this.d05, this, oo);
      }
      else {
        Tool.at("删除运单号【0000】失败。")
      }
    },
    d05: function (t, oo) {
      Tool.apply(oo.obj, oo.next, oo.This, oo.t);
    },
    ///////////////////有“未发货”的商品（true表示有），有的话就，备注，还不用删除【0000】运单号。////////////////////////////////////////////////////////////////
    e01: function (oo) {
      let comment = "【部分已发货】"
      if (oo.obj.keyouyun.packageCommentList.indexOf(comment) == -1) {
        let url = "https://api.keyouyun.com/jax/api/package/comment"
        let data = { "packageId": oo.obj.keyouyun.packageId, "comment": oo.obj.keyouyun.packageCommentList + comment, "imgs": "" }
        gg.typeFetch(url, "PUT", JSON.stringify(data), this.e02, this, oo)
      }
      else {
        $("#state").html("已经有【包裹备注】了。2025.2.6");
        this.d05("", oo);
      }
    },
    e02: function (t, oo) {
      if (t === true) {
        let packageCommentList = [{
          login: "574754058@qq.com",
          comment: oo.obj.keyouyun.packageCommentList + "【部分已发货】"
        }]
        let data = [{
          action: "sqlite",
          database: "shopee/客优云/包裹管理",
          sql: "update @.table set @.packageCommentList=" + Tool.rpsql(JSON.stringify(packageCommentList)) + "  where  @.nodeCode='" + oo.obj.keyouyun.nodeCode + "' and @.packageId='" + oo.obj.keyouyun.packageId + "'",
        }]
        Tool.ajax.a01(data, this.d05, this, oo);
      }
      else {
        Tool.pre("包裹备注失败。")
      }
    },
  }
})