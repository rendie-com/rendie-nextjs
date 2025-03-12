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
                this.a04(t)
            }
        },
        a04: function (t) {
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
            this.a05(orderidArr, arr);
        },
        a05: function (orderidArr, _1688_orderArr) {
            let data = [{
                action: "sqlite",
                database: "1688/买家订单",
                sql: "select " + Tool.fieldAs("orderid,shopee_order_sn") + " FROM @.table where @.orderid in('" + orderidArr.join("','") + "')",
            }]
            Tool.ajax.a01(data, this.a06, this, _1688_orderArr);
        },
        a06: function (t, _1688_orderArr) {
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

/*
 str += '\
            <tr class="table-light center"><th colspan="4">合计</th></tr>\
            <tr class="table-light">\
                <th></th>\
                <th>敦煌网</th>\
                <th class="center">对比</th>\
                <th>速卖通</th>\
            </tr>\
            <tr>\
                <td class="right">运费：</td>\
                <td>$'+ oo.dhgate.shipping + '</td>\
                <td class="center" title="超出±3会提示，否则不会提示。">'+ this.b07(oo.dhgate.shipping, oo.aliexpress.total.shipping, oo) + '</td>\
                <td>$'+ oo.aliexpress.total.shipping.toFixed(2) + '</td>\
            </tr>\
            <tr>\
                <td class="right">订单实收：</td>\
                <td>$'+ oo.dhgate.total + '</td>\
                <td class="center" title="30%>利润率>90%会提示，否则不会提示。">'+ this.b08(total100, oo) + '</td>\
                <td>$' + oo.aliexpress.total.total.toFixed(2) + '（' + total100 + '%）</td>\
            </tr>\
            <tr>\
                <td class="right">商品件数：</td>\
                <td>'+ dhgate_quantity + '</td>\
                <td class="center">'+ this.b09(dhgate_quantity, oo.aliexpress.total.quantity, oo) + '</td>\
                <td>'+ oo.aliexpress.total.quantity + '</td>\
            </tr>'

            str += '\
                <tr class="table-light">\
                    <th colspan="2"></th>\
                    <th colspan="2">\
                        【' + (i + 1) + '/' + arr.length + '】\
                        采购单号：<a href="https://www.aliexpress.com/p/order/detail.html?orderId=' + arr[i].orderId + '" target="_blank">' + arr[i].orderId + '</a>\
                    </th>\
                </tr>'
                str += '\
                <tr>\
                    <th></th>\
                    <th>敦煌网地址</th>\
                    <th class="center">对比</th>\
                    <th>通卖通地址</th>\
                </tr>'+ this.b01(oo.dhgate, arr[i]) + '\
                <tr>\
                    <td class="right">Vat Number：</td>\
                    <td colspan="3">'+ oo.dhgate.vatNumber + '</td>\
                </tr>\
                <tr class="table-light">\
                    <td colspan="2">敦煌网</td>\
                    <td colspan="2">速卖通</td>\
                </tr>\
                <tr>\
                    <td colspan="2" class="p-0 w-50">'+ orderitemObj.html + '</td>\
                    <td colspan="2" class="p-0 w-50">' + this.b05(arr[i].productVOList, arr[i].order_price, oo.aliexpress.total, orderitemObj.AttributeCartArr, oo) + '</td>\
                </tr>'

                 str += '\
                <tr>\
                    <td class="w100" rowspan="3">\
                        <a href="'+ orderitem[i].pic + '" target="_blank">\
                            <img src="' + orderitem[i].pic.replace('image.dhgate.com/f3/', 'image.dhgate.com/100x100/f3/') + '" title="点击预览" class="border" height="100">\
                        </a>\
                    </td>\
                    <td><a href="https://www.dhgate.com/product/-/'+ orderitem[i].fromid + '.html" target="_blank">' + orderitem[i].name + '</a></td>\
                </tr>\
                <tr><td title="属性">'+ orderitem[i].AttributeCart + '</td></tr>\
                <tr><td title="价格">'+ orderitem[i].RealPrice + ' x ' + orderitem[i].Amount + '（' + orderitem[i].Unit + '）</td></tr>\
                <tr><td class="right">编码：</td><td>'+ orderitem[i].proid + '</td></tr>\
                <tr><td class="right">产品备注：</td><td>' + orderitem[i].Remark + '</td></tr>'
*/

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

