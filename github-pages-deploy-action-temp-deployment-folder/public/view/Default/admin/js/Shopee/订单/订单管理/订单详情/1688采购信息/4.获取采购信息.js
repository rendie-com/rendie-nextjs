Object.assign(Tool, {
    //获取1688采购信息
    get_1688_purchaseInfo: {
        a01: function (order_sn, siteNum) {
            $("#seep4").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>').attr("disabled", true);
            let oo = {
                order_sn: order_sn,//订单编号
                siteNum: siteNum,
                /////////////////////////
                _1688_orderArr: [],//第一页所有的“订单编号”
            }
            $("#state").html("正在开打【订单列表】页面...");
            Tool.login_1688.a01(this.a02, this, oo);
        },
        a02: function (t, oo) {
            let url = "https://work.1688.com/?_path_=buyer2017Base/2017buyerbase_trade/buyList&spm=a360q.8274423%2Fnew.buyer_commonTradeTool.buyList"
            $("#state").html('正在获取1688第一页【订单列表】...<a href="' + url + '" target="_blank">' + url + '</a>');
            let htmlArr = [
                {
                    url: "h5api.m.1688.com/h5/mtop.1688.trading.dataline.service/1.0/",
                    postData: '"serviceId":"OrderListDataLineService.buyerOrderList"'
                }
            ]
            gg.tabs_remove_create_devtools_indexOf(2, url, htmlArr, true, this.a03, this, oo)
        },
        a03: function (t, oo) {
            if (t) {
                let _1688_orderArr = [], orderidArr = [];
                let arr1 = JSON.parse(t[0].data.data.result).data.data
                for (let i = 0; i < arr1.length; i++) {
                    _1688_orderArr.push({
                        orderid: arr1[i].id,//订单号
                        ordertime: Tool.gettime(arr1[i].gmtCreate),//下单时间
                        corp: arr1[i].sellerInfo.companyName,//公司
                        seller_login_id: arr1[i].sellerInfo.loginId,//卖家ID
                        buyer_login_id: arr1[i].buyerInfo.loginId,//买家ID  
                        shippingFee: Tool.int(arr1[i].carriage) / 100,//运费
                        total: Tool.int(arr1[i].sumPayment) / 100,//实际付款
                        original: Tool.int(arr1[i].originalSumPayment) / 100,//合计后原价
                        status: arr1[i].statusLabel,
                        items: this.b01(arr1[i].orderEntries),//图片标题等等
                    });
                    orderidArr.push(arr1[i].id);
                }
                oo._1688_orderArr = _1688_orderArr;
                this.a04(orderidArr, oo);
            }
        },
        a04: function (orderidArr, oo) {
            let data = [{
                action: "sqlite",
                database: "1688/买家订单",
                sql: "select " + Tool.fieldAs("orderid,shopee_order_sn") + " FROM @.table where @.orderid in('" + orderidArr.join("','") + "')",
            }]
            Tool.ajax.a01(data, this.a05, this, oo);
        },
        a05: function (t, oo) {
            let Aarr = [];
            for (let i = 0; i < oo._1688_orderArr.length; i++) {
                if (this.b02(oo._1688_orderArr[i].orderid, t[0])) {//是否有新订单
                    Aarr.push(oo._1688_orderArr[i]);
                }
            }
            //////////////////////////////////////////////
            if (Aarr.length == 0) {
                Tool.Modal('网页对象提示', '1688订单第一页没有新的采购订单。', '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>', 'modal-l');
            }
            else {
                $("#state").html("获取1688信息完成。");
                this.d01(Aarr, oo);
            }
        },
        /////////////////////////////////
        b01: function (arr) {
            let nArr = [];
            for (let i = 0; i < arr.length; i++) {
                nArr.push({
                    img: arr[i].mainSummImageUrl,
                    title: arr[i].productName,
                    sourceId: arr[i].sourceId,//商品ID
                    entryId: arr[i].entryId,//快照ID----(注：在获取详情时，这个就没有了。)
                    price: Tool.int(arr[i].actualUnitPrice) / 100,
                    count: arr[i].quantity.realAmount,
                    status: arr[i].entryStatusLabel,
                    attr: arr[i].specInfo ? arr[i].specInfo.specItems : [],
                })
            }
            return nArr;
        },
        b02: function (orderid, arr) {
            //如果1688本地库没有，则说明是新的订单（也就是要填写的订单）
            let isNewOrder = true;//是否新订单
            for (let i = 0; i < arr.length; i++) {
                if (orderid == arr[i].orderid) {//表示本地有                    
                    if (arr[i].shopee_order_sn) {//有数据，则说明被关联过了
                        isNewOrder = false;
                        break;
                    }
                }
            }
            return isNewOrder;
        },
        b03: function (val) {
            if (typeof (val) == "string") {
                val = Tool.rpsql(val)
            }
            else if (typeof (val) == "number") {
            }
            else if (typeof (val) == "object") {
                val = Tool.rpsql(JSON.stringify(val))
            }
            else if (typeof (val) == "boolean") {
                val = val ? 1 : 0;
            }
            return val;
        },
        b04: function (oo, order_sn, siteNum) {
            let arrL = [], arrR = [], updateArr = []
            for (let k in oo) {
                arrL.push("@." + k);
                oo[k] = this.b03(oo[k])
                arrR.push(oo[k]);
                if (k != "orderid") { updateArr.push("@." + k + "=" + oo[k]); }
            }
            //问：“shopee_order_sn” 和 “shopee_site”是数组。为什么是第一组？
            //答：因为找的都是1688本地数据库没有的订单。比如：合并采购的以外的shopee订单就需要手动添加。
            let update = "update @.table set " + updateArr.join(",") + ",@.shopee_order_sn='[\"" + order_sn + "\"]',@.shopee_site='[\"" + siteNum + "\"]'  where  @.orderid=" + oo.orderid
            let insert = "insert into @.table(" + arrL.join(",") + ",@.shopee_order_sn,@.shopee_site)values(" + arrR.join(",") + ",'[\"" + order_sn + "\"]','[\"" + siteNum + "\"]')";
            return { update: update, insert: insert }
        },
        /////////////////////////////////////////////
        d01: function (Aarr, oo) {
            let data = [], purchaseInfo = [];
            for (let i = 0; i < Aarr.length; i++) {
                purchaseInfo.push({
                    orderid: Aarr[i].orderid,
                    total: Aarr[i].total,
                })
                let o1 = this.b04(Aarr[i], oo.order_sn, oo.siteNum)
                //////////////////////////////////////////////////
                data.push({
                    action: "sqlite",
                    database: "1688/买家订单",
                    sql: "select @.id from @.table where @.orderid=" + Aarr[i].orderid,
                    list: [{
                        action: "sqlite",
                        database: "1688/买家订单",
                        sql: o1.update,
                    }],
                    elselist: [{
                        action: "sqlite",
                        database: "1688/买家订单",
                        sql: o1.insert,
                    }]
                });
            }
            this.d02(data, purchaseInfo, oo)
        },
        d02: function (data, purchaseInfo, oo) {
            data.push({
                action: "sqlite",
                database: "shopee/订单/订单管理/" + oo.siteNum,
                sql: "update @.table set @.purchaseInfo=" + Tool.rpsql(JSON.stringify(purchaseInfo)) + ",@.purchaseAccount='tb0528449790',@.purchasePostingFee=3,@.purchaseStatus=3,@.purchaseTime=" + Tool.gettime("") + " where @.order_sn='" + oo.order_sn + "'",
            })
            Tool.ajax.a01(data, this.d03, this);
        },
        d03: function () {
            location.reload();
        },
    },
});
//a03: function (t, oo) {
//     if (t.indexOf("_____tmd_____/punish") != -1) {
//         Tool.Modal('网页对象提示', '验证码拦截', '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>', 'modal-l');
//     } else { this.a04(t, oo); }
// },

