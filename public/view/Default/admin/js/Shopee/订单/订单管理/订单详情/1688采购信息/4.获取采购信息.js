Object.assign(Tool, {
    //获取1688采购信息
    get_1688_purchaseInfo: {
        a01: function () {
            //obj.params.order_sn   订单编号    
            $("#seep4").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>').attr("disabled", true);
            $("#state").html("正在开打【订单列表】页面...");
            Tool.login_1688.a01(this.a02, this);
        },
        a02: function () {
            let url = "https://trade.1688.com/order/buyer_order_list.htm?spm=a360q.8274423.0.0.47164c9anZ0dmv&scene_type=&source=&purchase_company_name=null&product_name=&start_date=&end_date=&seller_login_id=&trade_status=&trade_type_search=&biz_type_search=&order_id_search=&is_his=&is_hidden_canceled_offer=&apt=&related_code=&order_settle_flag=&company_name=&keywords=&receiver_tel=&receiver_name=&buyer_name=&down_stream_order_id=&batch_number=&total_fee=&page=1&page_size=10"
            $("#state").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            gg.getFetch(url, "gbk", this.a03, this)
        },
        a03: function (t) {
            if (t.indexOf("_____tmd_____/punish") != -1) {
                Tool.at("验证码拦截");
            }
            else {
                let liArr = Tool.StrSplits(t, 'data-is-plus-order="false">', '</li>');
                let arr = [], orderidArr = [];
                for (let i = 0; i < liArr.length; i++) {
                    let total = Tool.StrSlice(liArr[i], '<div class="total" data-role="buyer" title="', '"')
                    let orderid = Tool.StrSlice(liArr[i], ' <order-comment data-orderid="', '"')//订单号
                    arr.push({
                        orderid: orderid,//订单号
                        total: total,//实际付款
                    })
                    orderidArr.push(orderid);
                }
                this.a04(orderidArr, arr);
            }
        },
        a04: function (orderidArr, _1688_orderArr) {
            let data = [{
                action: "sqlite",
                database: "1688/买家订单",
                sql: "select " + Tool.fieldAs("orderid,shopee_order_sn") + " FROM @.table where @.orderid in('" + orderidArr.join("','") + "')",
            }]
            Tool.ajax.a01(data, this.a05, this, _1688_orderArr);
        },
        a05: function (t, _1688_orderArr) {
            let Narr = [];
            for (let i = 0; i < _1688_orderArr.length; i++) {
                if (this.b02(_1688_orderArr[i].orderid, t[0])) {//是否在新订单
                    Narr.push(_1688_orderArr[i])
                }
            }
            //////////////////////////////////////////////
            if (Narr.length == 0) {
                Tool.at("1688订单第一页没有新的采购订单。");
            }
            else {
                this.d01(Narr);
            }
        },
        ///////////////////////////////////////////////////
        b01: function (orderid, _1688_orderArr) {
            let total = 0;
            for (let i = 0; i < _1688_orderArr.length; i++) {
                if (orderid == _1688_orderArr[i].orderid) {
                    total = parseFloat(_1688_orderArr[i].total);
                    break;
                }
            }
            return total;
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
        /////////////////////////////////////////////
        d01: function (Narr) {
            let data = [{
                action: "sqlite",
                database: "shopee/订单/订单管理/" + obj.params.site,
                sql: "update @.table set @.purchaseInfo=" + Tool.rpsql(JSON.stringify(Narr)) + ",@.purchaseAccount='tb0528449790',@.purchasePostingFee=3,@.purchaseStatus=3,@.purchaseTime=" + Tool.gettime("") + " where @.order_sn='" + obj.params.order_sn + "'",
            }]
            for (let i = 0; i < Narr.length; i++) {
                //问：“shopee_order_sn”和“shopee_site”是数组。那为什么是第一组？
                //答：因为找的都是1688本地数据库没有的订单。比如：合并采购的以外的shopee订单就需要手动添加。
                //更新@.ordertime字段的目的是为了排名到前面。
                data.push({
                    action: "sqlite",
                    database: "1688/买家订单",
                    sql: "select @.id from @.table where @.orderid='" + Narr[i].orderid + "'",
                    list: [{
                        action: "sqlite",
                        database: "1688/买家订单",
                        sql: "update @.table set @.ordertime=" + Tool.gettime("") + ",@.shopee_order_sn='[\"" + obj.params.order_sn + "\"]',@.shopee_site='[\"" + obj.params.site + "\"]' where @.orderid='" + Narr[i].orderid + "'"
                    }],
                    elselist: [{
                        action: "sqlite",
                        database: "1688/买家订单",
                        sql: "insert into @.table(@.ordertime,@.shopee_order_sn,@.shopee_site,@.orderid)values(" + Tool.gettime("") + ",'[\"" + obj.params.order_sn + "\"]','[\"" + obj.params.site + "\"]','" + Narr[i].orderid + "')"
                    }]
                });
            }
            Tool.ajax.a01(data, this.d02, this);
        },
        d02: function () {
            location.reload();
        },
    },
});



//update rd_table set rd_purchasePostingFee=0 where rd_purchasePostingFee is null


//  if (!t[0][i].shopee_order_sn) {
//     Narr.push(t[0][i].orderid);
// }
// let total = 0;
// for (let i = 0; i < _1688_orderArr.length; i++) {
//     if (orderid == _1688_orderArr[i].orderid) {
//         total = parseFloat(_1688_orderArr[i].total);
//         break;
//     }
// }
////////////////////////////////////////////////////////
// data.push({
//     action: "sqlite",
//     database: "shopee/订单/订单管理/" + obj.params.site,
//     sql: "select @.purchaseInfo as purchaseInfo from @.table where @.purchaseInfo like '%\"" + orderid + "\"%' limit 1",
// })
//Tool.ajax.a01(data, this.d01, this, arr);

