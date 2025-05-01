'use strict';
var fun =
{
    obj: {}, token: "",
    a01: function () {
        //obj.params.return     返回URL
        //obj.params.site       站点
        //obj.params.order_sn   订单编号       
        this.a02();
    },
    a02: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/订单/订单管理/" + obj.params.site,
            sql: "select " + Tool.fieldAs("id,status,escrow_release_time,order_sn,buyer_address_name,buyer_address_phone,shipping_address,buyer_user,order_items,purchaseInfo,purchasePostingFee,purchaseAccount,purchaseStatus,purchaseNotes,PurchaseRefund,list_type,status_ext,logistics_status,cancel_reason_ext,rate_by_date,auto_cancel_arrange_ship_date,escrow_release_time,payby_date,PurchaseTime") + " FROM @.table where @.order_sn='" + obj.params.order_sn + "'",
        }];
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let oo = t[0][0];
        oo.order_items = JSON.parse(oo.order_items)
        let sku = [];
        for (let i = 0; i < oo.order_items.length; i++) {
            sku.push(oo.order_items[i].product.sku);
        }
        ////////////////////////////////////////////////////
        let data = [{
            action: "sqlite",
            database: "shopee/商品/店铺商品/" + Tool.sip(obj.params.site),
            sql: "select " + Tool.fieldAs("_1688_fromid,proid") + " FROM @.table where @.proid in('" + sku.join("','") + "')",
        }]
        Tool.ajax.a01(data, this.a04, this, oo);
    },
    a04: function (t, oo) {
        let buyer_user = JSON.parse(oo.buyer_user);
        let html = Tool.header(obj.params.return, "Shopee &gt; 订单  &gt; 订单详情") + '\
    	<div class="p-2">\
          <table class="table align-top">\
            <tr>\
                <td class="w-50 p-0">'+ this.b04(oo, buyer_user) + '</td>\
                <td class="p-0">'+ this.b05(oo) + '</td>\
            </tr>\
            <tr><td colspan="2" class="p-0">'+ this.b03(oo.order_items, t[0]) + '</td></tr>\
          </table>\
        </div>';
        Tool.html(null, null, html);
    },
    b01: function (gender) {
        let str = "未开发:" + gender;
        switch (gender) {
            case 0: str = "未填写"; break;
            case 1: str = "男"; break;
            case 2: str = "女"; break;
        }
        return str;
    },
    b03: function (arr, arr2) {
        //[0]._1688_fromid
        let rArr = []
        for (let i = 0; i < arr.length; i++) {
            let td1 = '\
            <a href="https://s-cf-sg.shopeesz.com/file/' + arr[i].product.images[0] + '" target="_blank">\
                <img src="https://s-cf-sg.shopeesz.com/file/' + arr[i].product.images[0] + '_tn" class="img-fluid rounded">\
            </a>'
            rArr.push('\
            <tr>\
                <td class="w70 p-0" rowspan="2">' + td1 + '</td>\
                <td colspan="8">' + arr[i].product.name + '</td>\
            </tr>\
            <tr>\
                <td class="right w50">编码:</td>\
                <td class="w170">' + arr[i].item_model.sku + this.b07(arr[i].product.sku, arr2) + '</td>\
                <td class="right w50">数量:</td>\
                <td class="w50">' + arr[i].amount + '</td>\
                <td class="right w50">价格:</td>\
                <td class="w70">' + arr[i].order_price + ' </td>\
                <td class="right w50">规格:</td>\
                <td>' + arr[i].item_model.name + '</td>\
            </tr>');
        }
        return '<table class="table table-bordered align-middle mb-0">' + rArr.join("") + '</table>'
    },
    b04: function (oo, buyer_user) {
        return '\
        <table class="table table-hover align-middle mb-0">\
            <thead class="table-light"><tr><th colspan="2">基本信息</th></tr></thead>\
            <tr><td class="right">站点：</td><td>'+ Tool.site(obj.params.site) + '</td></tr>\
            <tr><td class="right">状态 | 发货时限：</td><td>'+ Tool.status.a01(oo.list_type,
            oo.status + "-" + oo.status_ext + "-" + oo.logistics_status,
            oo.cancel_reason_ext,
            oo.rate_by_date,
            oo.auto_cancel_arrange_ship_date,//超过这个时间没填国内运单算迟发货
            oo.escrow_release_time,//等待买家在2024/06/27前点选完成订单
            oo.payby_date//买家付款的超时时间，就是买家的最晚付款时间
        ) + '</td></tr>\
            <tr><td class="right">订单编号：</td><td>'+ oo.order_sn + '</td></tr>\
            <tr><td class="right">买家收件地址：</td><td>'+ oo.buyer_address_name + ' , ' + oo.buyer_address_phone + '<br/>' + oo.shipping_address + '</td></tr>\
            <thead class="table-light"><tr><th colspan="2">买家取货记录</th></tr></thead>\
            <tr><td class="right w150">评级计数：</td><td>'+ buyer_user.rating_count + '</td></tr>\
            <tr><td class="right">交货订单计数：</td><td>'+ buyer_user.delivery_order_count + '</td></tr>\
            <tr><td class="right">评级星级：</td><td>'+ buyer_user.rating_star + '</td></tr>\
        </table>'
    },
    b05: function (oo) {
        let purchaseInfo = [{ total: 0, orderid: "" }]
        if (oo.purchaseInfo && oo.purchaseInfo != "[]") { purchaseInfo = JSON.parse(oo.purchaseInfo); }
        let purchaseOrderArr = this.b08(purchaseInfo);
        let purchaseNotes = oo.purchaseNotes;
        if (purchaseNotes) { purchaseNotes = oo.purchaseNotes.replace(/\n/ig, '\\n'); } else { purchaseNotes = ""; }
        return '\
        <table class="table table-hover align-middle mb-0">\
            <thead class="table-light"><tr><th colspan="2">1688采购信息</th></tr></thead>\
            <tr><td class="right w150">采购账号：</td><td>'+ oo.purchaseAccount + '</td></tr>\
            <tr><td class="right">采购信息：</td><td><textarea class="form-control" rows=11 onblur="fun.c04($(this))">' + JSON.stringify(purchaseInfo, null, 2) + '</textarea>' + purchaseOrderArr.join("") + '</td></tr>\
            <tr><td class="right">采购贴单费：</td><td>'+ oo.purchasePostingFee + '（元）</td></tr>\
            <tr><td class="right">采购状态：</td><td>'+ this.b06(oo.purchaseStatus) + '</td></tr>\
            <tr><td class="right">采购备注：</td><td><textarea class="form-control h-100" onblur="fun.c01($(this),\'purchaseNotes\',\''+ purchaseNotes + '\')">' + purchaseNotes + '</textarea></td></tr>\
            <tr><td class="right">采购退款金额：</td><td><div class="input-group"><input type="text" class="form-control" value="'+ oo.PurchaseRefund + '" onblur="fun.c01($(this),\'PurchaseRefund\',' + oo.PurchaseRefund + ')"><span class="input-group-text" id="inputGroup-sizing-sm">当地币</span></div></td></tr>\
            <tr><td class="right">采购时间：</td><td>' + Tool.js_date_time2(oo.PurchaseTime) + '</td></tr>\
            <tr>\
                <td colspan="2">\
                <div class="btn-group">\
                    <button id="seep1" type="button" class="btn btn-outline-secondary" onclick="Tool.check_product.a01()" title="核对商品">*(1)核对商品</button>\
                    <button id="seep2" type="button" class="btn btn-outline-secondary" onclick="Tool.addCart.a01()" title="加入购物车">*(2)加入购物车</button>\
                    <button id="seep3" type="button" class="btn btn-outline-secondary" onclick="Tool.SubmitPayment.a01()" title="提交待付">*(3)提交待付</button>\
                    <button id="seep4" type="button" class="btn btn-outline-secondary" onclick="Tool.get_1688_purchaseInfo.a01()" title="获取采购信息">*(4)获取采购信息</button>\
                </div>\
                </td>\
            </tr>\
            <tr><td class="right">运行状态：</td><td id="state"></td></tr>\
       </table>'
    },
    b06: function (purchaseStatus) {
        let optionArr = [], arr = Tool.purchaseStatusArr;
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i][0] + '"' + (arr[i][0] == purchaseStatus ? 'selected="selected"' : '') + '>' + arr[i][0] + '.' + arr[i][1] + '</option>')
        }
        return '\
        <select onChange="fun.c03($(this),\'purchaseStatus\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">请选择采购状态</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
    b07: function (proid, arr) {
        let str = "无来源"
        for (let i = 0; i < arr.length; i++) {
            if (proid == arr[i].proid) {
                str = '<a href="https://detail.1688.com/offer/' + arr[i]._1688_fromid + '.html" target="_blank">来源</a>'; break;
            }
        }
        return "（" + str + "）";
    },
    b08: function (purchaseInfo) {
        let purchaseOrderArr = []
        for (let i = 0; i < purchaseInfo.length; i++) {
            purchaseOrderArr.push('<a href="https://trade.1688.com/order/new_step_order_detail.htm?orderId=' + purchaseInfo[i].orderid + '" target="_blank" class="p-1">' + purchaseInfo[i].orderid + '</a>');
        }
        return purchaseOrderArr;
    },
    /////////////////////////////////////////////////////////////////////////////////////
    c01: function (This, L, V) {
        let val = Tool.Trim(This.val());
        if (val != V && !This.attr("disabled")) {
            This.attr("disabled", true);
            let data = [{
                action: "sqlite",
                database: "shopee/订单/订单管理/" + obj.params.site,
                sql: "update @.table set @." + L + "=" + Tool.rpsql(val) + " where @.order_sn='" + obj.params.order_sn + "'",
            }]
            Tool.ajax.a01(data, this.c02, this, This);
        }
    },
    c02: function (t, This) {
        This.attr("disabled", false);
    },
    c03: function (This, L, V) {
        This.attr("disabled", true);
        let data = [{
            action: "sqlite",
            database: "shopee/订单/订单管理/" + obj.params.site,
            sql: "update @.table set @." + L + "=" + V + " where @.order_sn='" + obj.params.order_sn + "'",
        }]
        Tool.ajax.a01(data, this.c02, this, This);
    },
    c04: function (This) {
        let val = Tool.Trim(This.val());
        if (!This.attr("disabled")) {
            This.attr("disabled", true);
            try {
                let purchaseInfo = JSON.parse(val)
                let data = [{
                    action: "sqlite",
                    database: "shopee/订单/订单管理/" + obj.params.site,
                    sql: "update @.table set @.purchaseInfo=" + Tool.rpsql(JSON.stringify(purchaseInfo)) + " where @.order_sn='" + obj.params.order_sn + "'",
                }]
                Tool.ajax.a01(data, this.c02, this, This);
            } catch (error) {
                Tool.at("JSON格式不对。")
            }
        }
    },
}
fun.a01();
//<tr><td class="right">性别：</td><td>'+ this.b01(buyer_user.ext_info.gender) + '</td></tr>\
//<tr><td class="right">账号创建时间：</td><td>'+ Tool.js_date_time2(buyer_user.ext_info.address_info.mcount_create_time) + '</td></tr>\
//<tr><td class="right">生日：</td><td>'+ (t.buyer_user.ext_info.address_info.mcount_create_time + t.buyer_user.ext_info.birth_timestamp) + '</td></tr>\