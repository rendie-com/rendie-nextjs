'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "1688-买家订单",
        database: "1688/买家订单",
        action: "sqlite",
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "orderid",
            type: "varchar(25)",
            default: "",
            des: "订单号：4197010032432749218"
        }, {
            name: "ordertime",
            type: "integer",
            default: "0",
            des: "下单时间"
        }, {
            name: "corp",
            type: "varchar(25)",
            default: "100",
            des: "公司"
        }, {
            name: "seller_login_id",
            type: "varchar(50)",
            default: "",
            des: "卖家ID"
        }, {
            name: "buyer_login_id",
            type: "varchar(50)",
            default: "",
            des: "买家ID"
        }, {
            name: "shippingFee",
            type: "numeric(8,3)",
            default: "0",
            des: "运费"
        }, {
            name: "total",
            type: "numeric(8,3)",
            default: "0",
            des: "实际付款"
        }, {
            name: "original",
            type: "numeric(8,3)",
            default: "0",
            des: "合计后原价"
        }, {
            name: "status",
            type: "varchar(50)",
            default: "",
            des: "状态"
        },
        /////////////////////////////////////////
        {
            name: "alipay_orderid",
            type: "varchar(50)",
            default: "",
            des: "支付宝交易号：2025011022001899621445379276"
        },
        {
            name: "consignee",
            type: "varchar(50)",
            default: "",
            des: "收货人"
        }, {
            name: "delivery_address",
            type: "varchar(255)",
            default: "",
            des: "收货地址"
        }, {
            name: "delivery_phone",
            type: "varchar(11)",
            default: "",
            des: "收货人手机"
        }, {
            name: "delivery_telephone",
            type: "varchar(20)",
            default: "",
            des: "收货人电话"
        }, {
            name: "seller_phone",
            type: "varchar(11)",
            default: "",
            des: "卖家手机"
        }, {
            name: "seller_telephone",
            type: "varchar(20)",
            default: "",
            des: "卖家电话"
        }, {
            name: "shopurl",
            type: "varchar(255)",
            default: "",
            des: "店铺地址"
        },
        ///////////////////////////////////////////////////////////
        {
            name: "paytime",
            type: "integer",
            default: "0",
            des: "付款时间"
        }, {
            name: "deliveryTime",
            type: "integer",
            default: "0",
            des: "发货时间"
        }, {
            name: "successTime",
            type: "integer",
            default: "0",
            des: "完成时间"
        }, {
            name: "logisticsNumber",
            type: "varchar(20)",
            default: "",
            des: "物流编号：LP00706983855350"
        }, {
            name: "logisticsCompany",
            type: "varchar(20)",
            default: "",
            des: "物流公司"
        }, {
            name: "WaybillNumber",
            type: "varchar(20)",
            default: "",
            des: "运单号码：78872476432534"
        },
        {
            name: "items",
            type: "text",
            default: "",
            des: "商品列表"
        },
        ]
    },
]);