Object.assign(Tool, {
    check_product_common1: {
        a01: function (o1, next, This, t) {
            let oo = {
                o1: o1,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/订单/订单管理/" + oo.o1.siteNum,
                sql: "select " + Tool.fieldAs("list_type,status,status_ext,logistics_status,cancel_reason_ext,rate_by_date,auto_cancel_arrange_ship_date,escrow_release_time,payby_date,purchaseAccount,purchaseInfo,purchaseStatus,purchaseNotes,PurchaseRefund,order_items") + " FROM @.table where @.order_sn='" + oo.o1.order_sn + "'",
            }];
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            let order = t[0][0];
            let isStatusErr = this.b01(order.status, order.status_ext, order.logistics_status)//是否为待出货
            let isPurchaseStatusErr = this.b02(order.purchaseStatus) != "待处理"
            if (isStatusErr || isPurchaseStatusErr || order.purchaseNotes || order.PurchaseRefund) {//是否异常
                //核对商品前，检测到该订单【异常】
                this.a04(order, isStatusErr, isPurchaseStatusErr, oo);
            }
            else {
                Tool.apply({ order: order }, oo.next, oo.This, oo.t);
            }
        },
        //核对商品前，检测到该订单【异常】
        a04: function (order, isStatusErr, isPurchaseStatusErr, oo) {
            let txt = '\
            <table class="table table-hover center mb-0 align-middle">\
            <thead class="table-light center">\
                <tr>\
                    <th class="w130"></th>\
                    <th>检测值</th>\
                    <th class="w100">正常值</th>\
                    <th class="w100">检测结果</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr>\
                    <td class="right">订单状态：</td>\
                    <td>'+ Tool.status.a01(
                order.list_type,
                order.status + "-" + order.status_ext + "-" + order.logistics_status,
                order.cancel_reason_ext,
                order.auto_cancel_arrange_ship_date,
                order.payby_date,
                order.rate_by_date,
                order.escrow_release_time) + '</td>\
                    <td>待出货</td>\
                    <td>'+ (isStatusErr ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
                <tr>\
                    <td class="right">采购信息：</td>\
                    <td>'+ order.purchaseInfo + '</td>\
                    <td>null</td>\
                    <td>'+ (order.purchaseInfo ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
                <tr>\
                    <td class="right">采购状态：</td>\
                    <td>'+ this.b02(order.purchaseStatus) + '</td>\
                    <td>待处理</td>\
                    <td>'+ (isPurchaseStatusErr ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
                <tr>\
                    <td class="right">采购备注：</td>\
                    <td>'+ order.purchaseNotes + '</td>\
                    <td>null</td>\
                    <td>'+ (order.purchaseNotes ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
                <tr>\
                    <td class="right">采购退款金额：</td>\
                    <td>'+ order.PurchaseRefund + '</td>\
                    <td>0</td>\
                    <td>'+ (order.PurchaseRefund ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
            </tbody>\
            </table>'
            $("#seep1").attr("class", "btn btn-danger");
            let data = {
                error: txt,
                order: order
            }
            Tool.apply(data, oo.next, oo.This, oo.t);
        },
        //////////////////////////////////////////////////////////
        b01: function (status, status_ext, logistics_status) {
            let iserr = true;
            let val = status + "-" + status_ext + "-" + logistics_status
            if ("1-1-9" == val || "2-2-9" == val) {
                iserr = false;
            }
            return iserr;
        },
        b02: function (purchaseStatus) {
            let arr = Tool.purchaseStatusArr, val = "";
            for (let i = 0; i < arr.length; i++) {
                if (purchaseStatus == arr[i][0]) { val = arr[i][1]; break; }
            }
            return val;
        },
    },
});