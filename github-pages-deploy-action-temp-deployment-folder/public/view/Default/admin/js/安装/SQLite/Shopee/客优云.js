'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "客优云-订单管理",
        database: "shopee/客优云/订单管理",
        action: "sqlite",
        // run: [
        //     "alter table @.table add @.supplyType varchar(30)",
        // ],
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "statusDescription",
            type: "varchar(10)",
            default: "",
            des: "如：待发货"
        }, {
            name: "orderStatus",
            type: "varchar(50)",
            default: "",
            des: "如：READY_TO_SHIP"
        }, {
            name: "messageToSeller",
            type: "varchar(255)",
            default: "",
            des: "如：买家留言"
        }, {
            name: "ordersn",
            type: "varchar(20)",
            default: "",
            des: "如：250105MS05NJN2"
        }, {
            name: "kyyShopId",
            type: "varchar(32)",
            default: "",
            des: "如：0fa7632b27614ccda4ed724a7a405302"
        }, {
            name: "shopeeShopId",
            type: "integer",
            default: "0",
            des: "如：1429387488"
        }, {
            name: "shopId",
            type: "integer",
            default: "0",
            des: "如：1429387488"
        },
        {
            name: "shopName",
            type: "varchar(50)",
            default: "",
            des: "如：accessory.sg"
        }, {
            name: "login",
            type: "varchar(30)",
            default: "",
            des: "如：574754058@qq.com"
        }, {
            name: "note",
            type: "varchar(255)",
            default: "",
            des: ""
        }, {
            name: "estimatedShippingFee",
            type: "integer",
            default: "0",
            des: "如：1.49"
        }, {
            name: "actualShippingFee",
            type: "integer",
            default: "0",
            des: "如：0.0"
        }, {
            name: "actualShippingCost",
            type: "integer",
            default: "0",
            des: "如：0"
        }, {
            name: "paymentMethod",
            type: "varchar(20)",
            default: "",
            des: "Credit Card/Debit Card"
        }, {
            name: "totalAmount",
            type: "numeric(8,3)",
            default: "0",
            des: "如：15.66"
        }, {
            name: "escrowAmount",
            type: "numeric(8,3)",
            default: "0",
            des: "如：11.72"
        }, {
            name: "payAmount",
            type: "numeric(8,3)",
            default: "0",
            des: "如：15.66"
        }, {
            name: "shippingCarrier",
            type: "varchar(30)",
            default: "",
            des: "如：Doorstep Delivery (Overseas)"
        }, {
            name: "sellerShippingCarrier",
            type: "varchar(10)",
            default: "",
            des: "如：默认"
        }, {
            name: "currency",
            type: "varchar(5)",
            default: "",
            des: "如：SGD"
        }, {
            name: "createTime",
            type: "integer",
            default: "0",
            des: "如：2025-01-04T18:20:44Z（我要转时间戳）"
        }, {
            name: "updateTime",
            type: "integer",
            default: "0",
            des: "如：2025-01-05T01:57:59Z（我要转时间戳）"
        }, {
            name: "payTime",
            type: "integer",
            default: "0",
            des: "如：2025-01-04T18:21:44Z（我要转时间戳）"
        }, {
            name: "daysToShip",
            type: "tinyint",
            default: "0",
            des: "发货天数。如：2"
        }, {
            name: "deadlineDay",
            type: "integer",
            default: "",
            des: "如：2025-01-09T18:21:44Z（我要转时间戳）"
        }, {
            name: "cancelDay",
            type: "integer",
            default: "0",
            des: "如：2025-01-09T18:21:44Z（我要转时间戳）"
        }, {
            name: "orderCancelDay",
            type: "integer",
            default: "0",
            des: "如：2025-01-10T15:30:00Z（我要转时间戳）"
        }, {
            name: "trackingNo",
            type: "varchar(20)",
            default: "",
            des: "如：SG257258239100G"
        }, {
            name: "trackingNos",
            type: "varchar(255)",
            default: "",
            des: "如：[\"SG257258239100G\"]"
        }, {
            name: "kyyOrderStatus",
            type: "varchar(20)",
            default: "",
            des: "如：PENDED_ORDER"
        }, {
            name: "goodsToDeclare",
            type: "bit",
            default: "0",
            des: "如：false（我要转0和1）"
        }, {
            name: "country",
            type: "varchar(5)",
            default: "",
            des: "如：SG"
        }, {
            name: "count",
            type: "integer",
            default: "0",
            des: "如：9"
        }, {
            name: "cod",
            type: "bit",
            default: "0",
            des: "如：false（我要转0和1）"
        }, {
            name: "buyerUsername",
            type: "varchar(30)",
            default: "",
            des: "如：0tajbvlkv_"
        }, {
            name: "packageId",
            type: "varchar(20)",
            default: "",
            des: "如：PG250105INRNJWEX"
        }, {
            name: "gmtCreate",
            type: "integer",
            default: "0",
            des: "如：2025-01-05T01:56:49Z（我要转时间戳）"
        }, {
            name: "gmtModified",
            type: "integer",
            default: "0",
            des: "如：2025-01-05T01:58:01Z（我要转时间戳）"
        }, {
            name: "deleted",
            type: "bit",
            default: "0",
            des: "如：0"
        }, {
            name: "discounts",
            type: "numeric(8,3)",
            default: "0",
            des: "如：0.0"
        }, {
            name: "crossBorderTax",
            type: "numeric(8,3)",
            default: "0",
            des: "如：0.0"
        }, {
            name: "kyyOrderStatusName",
            type: "varchar(255)",
            default: "",
            des: "如：json"
        }, {
            name: "recipientAddress",
            type: "varchar(255)",
            default: "",
            des: "如：json"
        }, {
            name: "items",
            type: "text",
            default: "",
            des: "如：json"
        }, {
            name: "isPackage",
            type: "bit",
            default: "0",
            des: "如：true（我要转0和1）"
        }, {
            name: "platform",
            type: "tinyint",
            default: "0",
            des: "如：10"
        }, {
            name: "shipLast",
            type: "varchar(255)",
            default: "",
            des: "如：json"
        }, {
            name: "tagList",
            type: "varchar(255)",
            default: "",
            des: "如：json"
        }, {
            name: "shipByDate",
            type: "integer",
            default: "0",
            des: "如：2025-01-07T15:30:00Z（我要转时间戳）"
        }, {
            name: "tagIds",
            type: "varchar(100)",
            default: "",
            des: "如： [\"proxyPackage\"]"
        }, {
            name: "orderFlag",
            type: "varchar(30)",
            default: "",
            des: "如：fulfilled_by_cb_seller"
        }, {
            name: "warehouseId",
            type: "varchar(30)",
            default: "",
            des: "如：1598603478041346048"
        }, {
            name: "sellerTransactionFee",
            type: "numeric(8,3)",
            default: "0",
            des: "如：0.31"
        }, {
            name: "commissionFee",
            type: "numeric(8,3)",
            default: "0",
            des: "如：1.87"
        }, {
            name: "serviceFee",
            type: "numeric(8,3)",
            default: "0",
            des: "如：0.0"
        }, {
            name: "voucherFromSeller",
            type: "numeric(8,3)",
            default: "0",
            des: "如：3.89"
        }, {
            name: "voucherFromShopee",
            type: "numeric(8,3)",
            default: "0",
            des: "如：0.0"
        }, {
            name: "coins",
            type: "numeric(8,3)",
            default: "0",
            des: "如：0.0"
        }, {
            name: "logisticProviderCost",
            type: "numeric(8,3)",
            default: "0",
            des: "如：0.0"
        }, {
            name: "purchaseCost",
            type: "numeric(8,3)",
            default: "0",
            des: "如：0.0"
        }, {
            name: "otherCost",
            type: "numeric(8,3)",
            default: "0",
            des: "如：0.0"
        }, {
            name: "supplyType",
            type: "varchar(30)",
            default: "",
            des: "未知"
        }]
    },
    {
        name: "table",
        des: "客优云-包裹管理",
        database: "shopee/客优云/包裹管理",
        action: "sqlite",
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "statusName",
            type: "varchar(10)",
            default: "",
            des: "如：已入平台仓库"
        }, {
            name: "packageStatus",
            type: "varchar(20)",
            default: "",
            des: "如：LEAVING_WAREHOUSE"
        }, {
            name: "logisticsProvider",
            type: "varchar(100)",
            default: "",
            des: "如：[推荐] 全驰货运(Quanchi Logistic)（东莞仓，加我微信)"
        }, {
            name: "localLogisticsProviderSign",
            type: "bit",
            default: "0",
            des: "如：false（我要转0和1）"
        }, {
            name: "logisticsLogin",
            type: "varchar(30)",
            default: "",
            des: "如：271484474@qq.com"
        }, {
            name: "sellerLogin",
            type: "varchar(30)",
            default: "",
            des: "574754058@qq.com(429511)",
        }, {
            name: "providerMobile",
            type: "varchar(11)",
            default: "",
            des: "如：13316513542"
        }, {
            name: "sellerMobile",
            type: "varchar(11)",
            default: "",
            des: "如：19947341683"
        }, {
            name: "packageId",
            type: "varchar(20)",
            default: "",
            des: "如：PG250103XOXAXLBK"
        }, {
            name: "ordersn",
            type: "varchar(20)",
            default: "",
            des: "订单号（客优云没有我加的）"
        }, {
            name: "shipByDate",
            type: "integer",
            default: "0",
            des: "如：2025-01-03T02:32:39Z（我要转时间戳---客优云没有我加的）"
        }, {
            name: "orderCancelDay",
            type: "integer",
            default: "0",
            des: "如：2025-01-03T02:32:39Z（我要转时间戳---客优云没有我加的）"
        }, {
            name: "gmtCreate",
            type: "integer",
            default: "0",
            des: "如：2025-01-03T02:32:39Z（我要转时间戳）"
        }, {
            name: "comment",
            type: "varchar(255)",
            default: "",
            des: "如：有俩个订单要来"
        }, {
            name: "packageComment",
            type: "text",
            default: "",
            des: "如：json"
        }, {
            name: "packageCommentList",
            type: "varchar(255)",
            default: "",
            des: "如：[]"
        }, {
            name: "totalCount",
            type: "integer",
            default: "0",
            des: "如：1"
        }, {
            name: "fullAddress",
            type: "varchar(30)",
            default: "",
            des: "如：R ******"
        }, {
            name: "received",
            type: "bit",
            default: "0",
            des: "如：false（我要转0和1）"
        }, {
            name: "orderInfos",
            type: "text",
            default: "",
            des: "如：json"
        }, {
            name: "expressInfos",
            type: "varchar(255)",
            default: "",
            des: "如：json"
        }, {
            name: "orderNotes",
            type: "varchar(255)",
            default: "",
            des: "如：json"
        }, {
            name: "trackingNos",
            type: "varchar(100)",
            default: "",
            des: "物流单号。如：数组"
        }, {
            name: "gmtLeaving",
            type: "integer",
            default: "0",
            des: "如：2025-01-05T20:02:11Z（我要转时间戳）"
        }, {
            name: "packageType",
            type: "varchar(255)",
            default: "",
            des: "如：json"
        }, {
            name: "platformType",
            type: "varchar(20)",
            default: "",
            des: "如：shopee_cross"
        }, {
            name: "platformName",
            type: "varchar(20)",
            default: "",
            des: "如：shopee跨境店"
        }, {
            name: "nodeCode",
            type: "varchar(5)",
            default: "",
            des: "如：BR"
        }, {
            name: "kyyPackageStatus",
            type: "varchar(20)",
            default: "",
            des: "如：PENDING"
        }, {
            name: "warehouseNumber",
            type: "varchar(20)",
            default: "",
            des: "【仓库编号】如：35"
        }, {
            name: "wiseAccount",
            type: "varchar(20)",
            default: "",
            des: "如："
        }]
    }, {
        name: "table",
        des: "客优云-充值日志",
        database: "shopee/客优云/充值日志",
        action: "sqlite",
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "fromid",
            type: "integer",
            default: "0",
            des: "如：13593905"
        }, {
            name: "tradeNo",
            type: "varchar(20)",
            default: "",
            des: "如：1876422126140993536"
        }, {
            name: "kyyTradeNo",
            type: "varchar(20)",
            default: "",
            des: "如：1876268483388289024"
        }, {
            name: "transTime",
            type: "integer",
            default: "0",
            des: "如：2025-01-07T00:14:32Z（我要转时间戳）"
        }, {
            name: "transType",
            type: "varchar(20)",
            default: "",
            des: "如：代打包扣费"
        }, {
            name: "operateType",
            type: "varchar(20)",
            default: "",
            des: "如：-"
        }, {
            name: "tradeAmount",
            type: "numeric(5,2)",
            default: "0",
            des: "如：3.0"
        }, {
            name: "transStatus",
            type: "varchar(5)",
            default: "",
            des: "如：成功"
        }, {
            name: "transStateCode",
            type: "varchar(20)",
            default: "",
            des: "如：PROCESSED"
        }, {
            name: "comment",
            type: "varchar(100)",
            default: "",
            des: "如：base fee:3.0,sku fee:0.0"
        }, {
            name: "ordersn",
            type: "varchar(20)",
            default: "",
            des: "如：250106SG5PXS5G"
        }, {
            name: "trackingNos",
            type: "varchar(100)",
            default: "",
            des: "物流单号。如：数组格式"
        }, {
            name: "packageId",
            type: "varchar(30)",
            default: "",
            des: "如：PG250107VLJZVKRR"
        }, {
            name: "showTransTime",
            type: "integer",
            default: "0",
            des: "如：2025-01-07 08:14:32（我要转时间戳）"
        }]
    }, {
        name: "table",
        des: "客优云-系统消息",
        database: "shopee/客优云/系统消息",
        action: "sqlite",
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "messageId",
            type: "varchar(30)",
            default: "",
            des: "如：BS1875031182378176512"
        }, {
            name: "title",
            type: "varchar(100)",
            default: "",
            des: "如：【包裹】PG250101HTPKXQZC 有新备注"
        }, {
            name: "senderLogin",
            type: "varchar(30)",
            default: "",
            des: "如：271484474@qq.com"
        }, {
            name: "recipientLogin",
            type: "varchar(30)",
            default: "",
            des: "如：574754058@qq.com"
        }, {
            name: "messageStatus",
            type: "varchar(10)",
            default: "",
            des: "如：read"
        }, {
            name: "messageStatusName",
            type: "varchar(10)",
            default: "",
            des: "如：已读"
        }, {
            name: "messageType",
            type: "varchar(255)",
            default: "",
            des: "如：json"
        }, {
            name: "gmtCreate",
            type: "integer",
            default: "0",
            des: "如：2025-01-03T04:07:24Z（我要转时间戳）"
        }]
    }, {
        name: "table",
        des: "客优云-问题件",
        database: "shopee/客优云/问题件",
        action: "sqlite",
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "sellerId",
            type: "integer",
            default: "0",
            des: "如：429511"
        }, {
            name: "sellerLogin",
            type: "varchar(30)",
            default: "",
            des: "如：574754058@qq.com"
        }, {
            name: "sellerPhone",
            type: "varchar(15)",
            default: "",
            des: "如：19947341683"
        }, {
            name: "expressNum",
            type: "varchar(20)",
            default: "",
            des: "如：777273996651127"
        }, {
            name: "logisticsProvider",
            type: "varchar(30)",
            default: "",
            des: "如：1316635097@qq.com"
        }, {
            name: "logisticsName",
            type: "varchar(100)",
            default: "",
            des: "如：富盛物流（义乌仓，加我微信)"
        }, {
            name: "logisticsPhone",
            type: "varchar(11)",
            default: "",
            des: "如：17855895502"
        }, {
            name: "shelfCode",
            type: "varchar(20)",
            default: "",
            des: "如：货架"
        }, {
            name: "expressStatus",
            type: "varchar(10)",
            default: "",
            des: "如：未录单"
        }, {
            name: "expressStatusCode",
            type: "varchar(20)",
            default: "",
            des: "如：no_express_package"
        }, {
            name: "gmtCreate",
            type: "integer",
            default: "0",
            des: "如：2025-01-07T07:51:34Z（我要转时间戳）"
        }]
    },
    {
        name: "table",
        des: " 黑名单",
        database: "shopee/客优云/黑名单",
        action: "sqlite",
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "fromid",
                type: "integer",
                default: "0 unique",
                des: "来源ID"
            },
            {
                name: "userAccount",
                type: "varchar(100)",
                default: "0",
                des: "买家ID"
            },
            {
                name: "addtime",
                type: "integer",
                default: "0",
                des: "添加时间"
            },
            {
                name: "uptime",
                type: "integer",
                default: "0",
                des: "更新时间"
            },
            {
                name: "reason",
                type: "varchar(255)",
                default: "",
                des: "被标记的原因"
            }
        ]
    },
    {
        name: "table",
        des: "客优云-违禁词",
        database: "shopee/客优云/违禁词",
        action: "sqlite",
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "name",
                type: "varchar(150)",
                default: "0 unique",
                des: "违禁词名称"
            },
            {
                name: "isWhitelist",
                type: "bit",
                default: "0",
                des: "是否白名单"
            },
            {
                name: "addtime",
                type: "integer",
                default: "0",
                des: "添加时间"
            }
        ]
    },
    {
        name: "table",
        des: "客优云-账户",
        database: "shopee/客优云/账户",
        action: "sqlite",
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "sort",
                type: "integer",
                default: "0",
                des: "排序"
            },
            {
                name: "username",
                type: "varchar(100)",
                default: "",
                des: "用户名"
            },
            {
                name: "password",
                type: "varchar(255)",
                default: "",
                des: "密码"
            },
            {
                name: "cookies",
                type: "text",
                default: "",
                des: "登录用的cookies信息"
            },
            {
                name: "localstorage",
                type: "text",
                default: "",
                des: "登录用的localStorage信息"
            },
            {
                name: "authInfo",
                type: "text",
                default: "",
                des: "授权信息"
            },
            {
                name: "isDefault",
                type: "bit",
                default: "0",
                des: "是否默认"
            },
            {
                name: "phone",
                type: "varchar(11)",
                default: "",
                des: "手机"
            },
            {
                name: "note",
                type: "varchar(255)",
                default: "",
                des: "备注"
            },
            {
                name: "email",
                type: "varchar(30)",
                default: "",
                des: "邮件"
            },
            {
                name: "fromid",
                type: "integer",
                default: "0",
                des: "来源ID"
            },
            {
                name: "points",
                type: "numeric(8,3)",
                default: "0",
                des: "积分"
            },
            {
                name: "addtime",
                type: "integer",
                default: "0",
                des: "添加时间"
            }
        ]
    }
]);