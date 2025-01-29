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
            database: "shopee/订单/" + obj.params.site,
            sql: "select " + Tool.fieldAs("id,status,escrow_release_time,order_sn,buyer_address_name,buyer_address_phone,shipping_address,buyer_user,order_items") + " FROM @.table where @.order_sn='" + obj.params.order_sn + "'",
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let oo = t[0][0]
        let buyer_user = JSON.parse(oo.buyer_user)
        let html = Tool.header(obj.params.return, "Shopee &gt; 订单  &gt; 订单详情") + '\
    	<div class="p-2">\
          <table class="table table-hover align-middle">\
            <thead class="table-light"><tr><th colspan="2">基本信息</th></tr></thead>\
            <tr><td class="right">状态 | 发货时限：</td><td>'+ this.b02(oo.status, oo.escrow_release_time) + '</td></tr>\
            <tr><td class="right">订单编号：</td><td>'+ oo.order_sn + '</td></tr>\
            <tr><td class="right">买家收件地址：</td><td>'+ oo.buyer_address_name + ' , ' + oo.buyer_address_phone + '<br/>' + oo.shipping_address + '</td></tr>\
            <thead class="table-light"><tr><th colspan="2">买家取货记录</th></tr></thead>\
            <tr><td class="right w150">评级计数：</td><td>'+ buyer_user.rating_count + '</td></tr>\
            <tr><td class="right">交货订单计数：</td><td>'+ buyer_user.delivery_order_count + '</td></tr>\
            <tr><td class="right">评级星级：</td><td>'+ buyer_user.rating_star + '</td></tr>\
          </table>'+ this.b03(JSON.parse(oo.order_items)) + '\
        </div>'
        //<tr><td class="right">性别：</td><td>'+ this.b01(buyer_user.ext_info.gender) + '</td></tr>\
        //<tr><td class="right">账号创建时间：</td><td>'+ Tool.js_date_time2(buyer_user.ext_info.address_info.mcount_create_time) + '</td></tr>\
        //<tr><td class="right">生日：</td><td>'+ (t.buyer_user.ext_info.address_info.mcount_create_time + t.buyer_user.ext_info.birth_timestamp) + '</td></tr>\
        Tool.html(null, null, html)
    },
    b01: function (gender) {
        let str = "未开发:" + gender
        switch (gender) {
            case 0: str = "未填写"; break;
            case 1: str = "男"; break;
            case 2: str = "女"; break;
        }
        return str;
    },
    //状态 | 发货时限
    b02: function (status, auto_cancel_arrange_ship_date, escrow_release_time, payby_date) {
        let str = "未开发" + status
        switch (status) {
            case 1:
                str = '待付款<br/><font color="#8c8c8c">在' + Tool.js_date_time2(payby_date) + '前完成付款</font>';
                break;
            case 2:
                str = '待出货<br/><font color="#8c8c8c">为了避免延迟出货，请在' + Tool.js_date_time2(auto_cancel_arrange_ship_date) + '之前运送</font>';
                break;
            case 4: str = '已完成'; break;
            case 5:
                str = '已取消';
                break;
        }
        //case 2:
        //    str = '已出货<br/><font color="#8c8c8c">等待买家在' + Tool.js_date_time2(escrow_release_time) + '前点选完成订单</font>';
        //    break;
        return str;
    },
    b03: function (arr) {
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
                <td class="w120">' + arr[i].item_model.sku + '</td>\
                <td class="right w50">数量:</td>\
                <td class="w50">' + arr[i].amount + '</td>\
                <td class="right w50">价格:</td>\
                <td class="w70">' + arr[i].order_price + ' </td>\
                <td class="right w50">规格:</td>\
                <td>' + arr[i].item_model.name + '</td>\
            </tr>')
        }
        return '<table class="table table-bordered align-middle mb-0">' + rArr.join("") + '</table>'
    },
}
fun.a01();