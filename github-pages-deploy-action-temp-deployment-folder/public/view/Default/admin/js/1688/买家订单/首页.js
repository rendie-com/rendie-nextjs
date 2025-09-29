'use strict';
var fun =
{
    a01: function () {
        obj.params.jsFile = obj.params.jsFile ? obj.params.jsFile : ""//选择JS文件
        obj.params.page = obj.params.page ? parseInt(obj.params.page) : 1;//翻页  
        this.a02();
    },
    a02: function () {
        let data = [{
            action: "sqlite",
            database: "1688/买家订单",
            sql: "select count(1) as total FROM @.table",
        }, {
            action: "sqlite",
            database: "1688/买家订单",
            sql: "select " + Tool.fieldAs("id,orderid,ordertime,corp,seller_login_id,buyer_login_id,shippingFee,total,original,status,items") + " FROM @.table order by @.ordertime desc" + Tool.limit(10, obj.params.page),
        }]
        Tool.ajax.a01(data, this.a03, this)
    },
    a03: function (t) {
        let html = "", arr = t[1]
        for (let i = 0; i < arr.length; i++) {
            html += '\
            <tr>\
                <td><a href="https://trade.1688.com/order/new_step_order_detail.htm?orderId='+ arr[i].orderid + '" target="_blank">' + arr[i].orderid + '</a><hr/>' + arr[i].status + '</td>\
                <td class="left p-0">'+ this.b03(arr[i].items) + '</td>\
                <td class="p-0">'+ this.b04(arr[i].original, arr[i].total, arr[i].shippingFee) + '</td>\
                <td class="p-0">'+ this.b05(arr[i].corp, arr[i].seller_login_id, arr[i].buyer_login_id) + '</td>\
                <td>'+ Tool.js_date_time2(arr[i].ordertime) + '</td>\
            </tr>'
        }
        html = '\
        <header class="panel-heading">1688 &gt; 买家订单</header>\
        <div class="p-2">\
          <table class="table table-hover center">\
            <thead class="table-light">'+ this.b01() + '</thead>\
            <tbody>'+ html + '</tbody>\
          </table>' + Tool.page(t[0][0].total, 10, obj.params.page) + '\
        </div>'
        Tool.html(null, null, html)
    },
    b01: function () {
        return '\
        <tr>\
            <th class="w200" style="position: relative;">'+ this.b02() + '订单号 / 状态</th>\
            <th class="left">商品信息</th>\
            <th>价格</th>\
            <th>公司名称 / 卖家ID / 买家ID</th>\
            <th>下单时间</th>\
        </tr>'
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false" id="dropdown0"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu" aria-labelledby="dropdown0">\
            <li><a class="dropdown-item pointer" onClick="Tool.openR(\'?jsFile=js01\');">*获取买家【近三个月订单】</a></li>\
            <li><a class="dropdown-item pointer" onClick="Tool.openR(\'?jsFile=js02\');">*获取买家【三个月前订单】</a></li>\
            <li><a class="dropdown-item pointer" onClick="Tool.openR(\'?jsFile=js03\');">*获取【订单详情】</a></li>\
        </ul>'
    },
    b03: function (items) {
        let trArr = []
        if(items){
            let arr = JSON.parse(items);
            for (let i = 0; i < arr.length; i++) {
                trArr.push('\
                <tr>\
                    <td rowspan="3">\
                        <a href="'+ arr[i].img.replace(".80x80", "") + '" target="_blank">\
                            <img src="'+ arr[i].img.replace(".80x80", ".100x100") + '" class="img-fluid rounded w100">\
                        </a>\
                    </td>\
                    <td colspan="3"><a href="'+ arr[i].snapshot + '" target="_blank">' + arr[i].title + '</a></td>\
                </tr>\
                <tr>\
                    <td>'+ arr[i].attr + '</td>\
                    <td>发布价：'+ arr[i].price + '</td>\
                    <td>数量：'+ arr[i].count + '</td>\
                </tr>\
                <tr>\
                    <td>货号：'+ arr[i].ItemNumber + '</td>\
                    <td>优惠：'+ (arr[i].PLUS_price == "<div></div>" ? arr[i].PLUS_price : '-') + '</td>\
                    <td>状态：'+ arr[i].status + '</td>\
                </tr>')
            }
        }        
        return '<table class="table mb-0 table-bordered"><tbody>' + trArr.join("") + '</tbody></table>'
    },
    b04: function (original, total, shippingFee) {
        return '<table class="table mb-0 table-bordered">\
        <tbody>\
            <tr><td title="合计后原价 / 实际付款">'+ (original == total ? total.toFixed(2) : '<s style="color:#666">' + original.toFixed(2) + '</s> <b>' + total.toFixed(2)) + '</b></td></tr>\
            <tr><td>含运费 '+ shippingFee.toFixed(2) + '</td></tr>\
        </tbody>\
        </table>'
    },
    b05: function (corp, seller_login_id, buyer_login_id) {
        return '<table class="table mb-0 table-bordered">\
        <tbody>\
            <tr><td title="公司名称">'+ corp + '</td></tr>\
            <tr><td title="卖家ID">'+ seller_login_id + '</td></tr>\
            <tr><td title="买家ID">'+ buyer_login_id + '</td></tr>\
        </tbody>\
        </table>'
    },
}
fun.a01();