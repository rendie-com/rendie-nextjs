'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "采集箱-店铺-新加坡SG",
        database: "shopee/采集箱/店铺/sg",
        action: "sqlite",
        sql: [
            "create index shopid ON @.table(@.shopid)"
        ],
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "shop_location",
                type: "varchar(100)",
                default: "",
                des: "店铺位置（如：中国大陆）"
            },
            {
                name: "status",
                type: "tinyint",
                default: "0",
                des: "状态（如：1）----还不知道有什么用"
            },
            {
                name: "shopname",
                type: "varchar(100)",
                default: "",
                des: "店铺名称（如：Skullreaper Digital）"
            },
            {
                name: "get_follower_time",
                type: "integer",
                default: "0",
                des: "获取粉丝时间"
            },
            {
                name: "follower_count",
                type: "integer",
                default: "0",
                des: "粉丝数量"
            },
            {
                name: "following_count",
                type: "integer",
                default: "0",
                des: "关注中"
            },
            {
                name: "is_official_shop",
                type: "bit",
                default: "0",
                des: "是否为官方店"
            },
            {
                name: "last_login_time",
                type: "integer",
                default: "0",
                des: "最后登陆时间"
            },
            {
                name: "nickname",
                type: "varchar(100)",
                default: "",
                des: "昵称（如：Skullreaper Digital）"
            },
            {
                name: "portrait",
                type: "varchar(50)",
                default: "",
                des: "肖像（如：595170becdb25bccda3e19a3840e6e8d）"
            },
            {
                name: "products",
                type: "integer",
                default: "0",
                des: "商品数量"
            },
            {
                name: "response_rate",
                type: "tinyint",
                default: "0",
                des: "聊天回应率（如：47）"
            },
            {
                name: "response_time",
                type: "integer",
                default: "0",
                des: "聊天回应时间（如：8501（几小时内））"
            },
            {
                name: "shop_rating",
                type: "numeric(8,7)",
                default: "0",
                des: "评分（如：4.90206）"
            },
            {
                name: "shopee_verified_flag",
                type: "tinyint",
                default: "0",
                des: "评级标志"
            },
            {
                name: "show_official_shop_label",
                type: "bit",
                default: "0",
                des: "是否显示官方标志"
            },
            {
                name: "show_shopee_verified_label",
                type: "bit",
                default: "0",
                des: "未知---还不知道做用"
            },
            {
                name: "userid",
                type: "integer",
                default: "0",
                des: "用户ID"
            },
            {
                name: "shopid",
                type: "integer",
                default: "0",
                des: "店铺ID"
            },
            {
                name: "username",
                type: "varchar(100)",
                default: "",
                des: "用户名（如：jianshao.my）"
            },
            {
                name: "is_in_fss",
                type: "bit",
                default: "0",
                des: "是否报了免运活动"
            },
            {
                name: "ps_plus",
                type: "bit",
                default: "0",
                des: "是否为【Preferred+】"
            },
            {
                name: "rating_good",
                type: "integer",
                default: "0",
                des: "好评数量（如：136372）"
            },
            {
                name: "rating_normal",
                type: "integer",
                default: "0",
                des: "中评数量（如：5001）"
            },
            {
                name: "rating_bad",
                type: "integer",
                default: "0",
                des: "差评数量（如：2040）"
            },
            {
                name: "is_shopee_choice",
                type: "bit",
                default: "0",
                des: "是否为choice标志"
            },
        ]
    }, {
        name: "table",
        des: "采集箱-店铺",
        database: "shopee/采集箱/店铺/tw",
        action: "sqlite",
        sql: [
            "create index shopid ON @.table(@.shopid)"
        ],
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "shop_location",
                type: "varchar(100)",
                default: "",
                des: "店铺位置（如：中国大陆）"
            },
            {
                name: "status",
                type: "tinyint",
                default: "0",
                des: "状态（如：1）----还不知道有什么用"
            },
            {
                name: "shopname",
                type: "varchar(100)",
                default: "",
                des: "店铺名称（如：Skullreaper Digital）"
            },
            {
                name: "get_follower_time",
                type: "integer",
                default: "0",
                des: "获取粉丝时间"
            },
            {
                name: "follower_count",
                type: "integer",
                default: "0",
                des: "粉丝数量"
            },
            {
                name: "following_count",
                type: "integer",
                default: "0",
                des: "关注中"
            },
            {
                name: "is_official_shop",
                type: "bit",
                default: "0",
                des: "是否为官方店"
            },
            {
                name: "last_login_time",
                type: "integer",
                default: "0",
                des: "最后登陆时间"
            },
            {
                name: "nickname",
                type: "varchar(100)",
                default: "",
                des: "昵称（如：Skullreaper Digital）"
            },
            {
                name: "portrait",
                type: "varchar(50)",
                default: "",
                des: "肖像（如：595170becdb25bccda3e19a3840e6e8d）"
            },
            {
                name: "products",
                type: "integer",
                default: "0",
                des: "商品数量"
            },
            {
                name: "response_rate",
                type: "tinyint",
                default: "0",
                des: "聊天回应率（如：47）"
            },
            {
                name: "response_time",
                type: "integer",
                default: "0",
                des: "聊天回应时间（如：8501（几小时内））"
            },
            {
                name: "shop_rating",
                type: "numeric(8,7)",
                default: "0",
                des: "评分（如：4.90206）"
            },
            {
                name: "shopee_verified_flag",
                type: "tinyint",
                default: "0",
                des: "评级标志"
            },
            {
                name: "show_official_shop_label",
                type: "bit",
                default: "0",
                des: "是否显示官方标志"
            },
            {
                name: "show_shopee_verified_label",
                type: "bit",
                default: "0",
                des: "未知---还不知道做用"
            },
            {
                name: "userid",
                type: "integer",
                default: "0",
                des: "用户ID"
            },
            {
                name: "shopid",
                type: "integer",
                default: "0",
                des: "店铺ID"
            },
            {
                name: "username",
                type: "varchar(100)",
                default: "",
                des: "用户名（如：jianshao.my）"
            },
            {
                name: "is_in_fss",
                type: "bit",
                default: "0",
                des: "是否报了免运活动"
            },
            {
                name: "ps_plus",
                type: "bit",
                default: "0",
                des: "是否为【Preferred+】"
            },
            {
                name: "rating_good",
                type: "integer",
                default: "0",
                des: "好评数量（如：136372）"
            },
            {
                name: "rating_normal",
                type: "integer",
                default: "0",
                des: "中评数量（如：5001）"
            },
            {
                name: "rating_bad",
                type: "integer",
                default: "0",
                des: "差评数量（如：2040）"
            },
            {
                name: "is_shopee_choice",
                type: "bit",
                default: "0",
                des: "是否为choice标志"
            },
        ]
    }, {
        name: "table",
        des: "采集箱-店铺",
        database: "shopee/采集箱/店铺/my",
        action: "sqlite",
        sql: [
            "create index shopid ON @.table(@.shopid)"
        ],
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "shop_location",
                type: "varchar(100)",
                default: "",
                des: "店铺位置（如：中国大陆）"
            },
            {
                name: "status",
                type: "tinyint",
                default: "0",
                des: "状态（如：1）----还不知道有什么用"
            },
            {
                name: "shopname",
                type: "varchar(100)",
                default: "",
                des: "店铺名称（如：Skullreaper Digital）"
            },
            {
                name: "get_follower_time",
                type: "integer",
                default: "0",
                des: "获取粉丝时间"
            },
            {
                name: "follower_count",
                type: "integer",
                default: "0",
                des: "粉丝数量"
            },
            {
                name: "following_count",
                type: "integer",
                default: "0",
                des: "关注中"
            },
            {
                name: "is_official_shop",
                type: "bit",
                default: "0",
                des: "是否为官方店"
            },
            {
                name: "last_login_time",
                type: "integer",
                default: "0",
                des: "最后登陆时间"
            },
            {
                name: "nickname",
                type: "varchar(100)",
                default: "",
                des: "昵称（如：Skullreaper Digital）"
            },
            {
                name: "portrait",
                type: "varchar(50)",
                default: "",
                des: "肖像（如：595170becdb25bccda3e19a3840e6e8d）"
            },
            {
                name: "products",
                type: "integer",
                default: "0",
                des: "商品数量"
            },
            {
                name: "response_rate",
                type: "tinyint",
                default: "0",
                des: "聊天回应率（如：47）"
            },
            {
                name: "response_time",
                type: "integer",
                default: "0",
                des: "聊天回应时间（如：8501（几小时内））"
            },
            {
                name: "shop_rating",
                type: "numeric(8,7)",
                default: "0",
                des: "评分（如：4.90206）"
            },
            {
                name: "shopee_verified_flag",
                type: "tinyint",
                default: "0",
                des: "评级标志"
            },
            {
                name: "show_official_shop_label",
                type: "bit",
                default: "0",
                des: "是否显示官方标志"
            },
            {
                name: "show_shopee_verified_label",
                type: "bit",
                default: "0",
                des: "未知---还不知道做用"
            },
            {
                name: "userid",
                type: "integer",
                default: "0",
                des: "用户ID"
            },
            {
                name: "shopid",
                type: "integer",
                default: "0",
                des: "店铺ID"
            },
            {
                name: "username",
                type: "varchar(100)",
                default: "",
                des: "用户名（如：jianshao.my）"
            },
            {
                name: "is_in_fss",
                type: "bit",
                default: "0",
                des: "是否报了免运活动"
            },
            {
                name: "ps_plus",
                type: "bit",
                default: "0",
                des: "是否为【Preferred+】"
            },
            {
                name: "rating_good",
                type: "integer",
                default: "0",
                des: "好评数量（如：136372）"
            },
            {
                name: "rating_normal",
                type: "integer",
                default: "0",
                des: "中评数量（如：5001）"
            },
            {
                name: "rating_bad",
                type: "integer",
                default: "0",
                des: "差评数量（如：2040）"
            },
            {
                name: "is_shopee_choice",
                type: "bit",
                default: "0",
                des: "是否为choice标志"
            },
        ]
    }, {
        name: "table",
        des: "采集箱-店铺",
        database: "shopee/采集箱/店铺/br",
        action: "sqlite",
        sql: [
            "create index shopid ON @.table(@.shopid)"
        ],
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "shop_location",
                type: "varchar(100)",
                default: "",
                des: "店铺位置（如：中国大陆）"
            },
            {
                name: "status",
                type: "tinyint",
                default: "0",
                des: "状态（如：1）----还不知道有什么用"
            },
            {
                name: "shopname",
                type: "varchar(100)",
                default: "",
                des: "店铺名称（如：Skullreaper Digital）"
            },
            {
                name: "get_follower_time",
                type: "integer",
                default: "0",
                des: "获取粉丝时间"
            },
            {
                name: "follower_count",
                type: "integer",
                default: "0",
                des: "粉丝数量"
            },
            {
                name: "following_count",
                type: "integer",
                default: "0",
                des: "关注中"
            },
            {
                name: "is_official_shop",
                type: "bit",
                default: "0",
                des: "是否为官方店"
            },
            {
                name: "last_login_time",
                type: "integer",
                default: "0",
                des: "最后登陆时间"
            },
            {
                name: "nickname",
                type: "varchar(100)",
                default: "",
                des: "昵称（如：Skullreaper Digital）"
            },
            {
                name: "portrait",
                type: "varchar(50)",
                default: "",
                des: "肖像（如：595170becdb25bccda3e19a3840e6e8d）"
            },
            {
                name: "products",
                type: "integer",
                default: "0",
                des: "商品数量"
            },
            {
                name: "response_rate",
                type: "tinyint",
                default: "0",
                des: "聊天回应率（如：47）"
            },
            {
                name: "response_time",
                type: "integer",
                default: "0",
                des: "聊天回应时间（如：8501（几小时内））"
            },
            {
                name: "shop_rating",
                type: "numeric(8,7)",
                default: "0",
                des: "评分（如：4.90206）"
            },
            {
                name: "shopee_verified_flag",
                type: "tinyint",
                default: "0",
                des: "评级标志"
            },
            {
                name: "show_official_shop_label",
                type: "bit",
                default: "0",
                des: "是否显示官方标志"
            },
            {
                name: "show_shopee_verified_label",
                type: "bit",
                default: "0",
                des: "未知---还不知道做用"
            },
            {
                name: "userid",
                type: "integer",
                default: "0",
                des: "用户ID"
            },
            {
                name: "shopid",
                type: "integer",
                default: "0",
                des: "店铺ID"
            },
            {
                name: "username",
                type: "varchar(100)",
                default: "",
                des: "用户名（如：jianshao.my）"
            },
            {
                name: "is_in_fss",
                type: "bit",
                default: "0",
                des: "是否报了免运活动"
            },
            {
                name: "ps_plus",
                type: "bit",
                default: "0",
                des: "是否为【Preferred+】"
            },
            {
                name: "rating_good",
                type: "integer",
                default: "0",
                des: "好评数量（如：136372）"
            },
            {
                name: "rating_normal",
                type: "integer",
                default: "0",
                des: "中评数量（如：5001）"
            },
            {
                name: "rating_bad",
                type: "integer",
                default: "0",
                des: "差评数量（如：2040）"
            },
            {
                name: "is_shopee_choice",
                type: "bit",
                default: "0",
                des: "是否为choice标志"
            },
        ]
    }, {
        name: "table",
        des: "采集箱-店铺-墨西哥",
        database: "shopee/采集箱/店铺/mx",
        action: "sqlite",
        sql: [
            "create index shopid ON @.table(@.shopid)"
        ],
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "shop_location",
                type: "varchar(100)",
                default: "",
                des: "店铺位置（如：中国大陆）"
            },
            {
                name: "status",
                type: "tinyint",
                default: "0",
                des: "状态（如：1）----还不知道有什么用"
            },
            {
                name: "shopname",
                type: "varchar(100)",
                default: "",
                des: "店铺名称（如：Skullreaper Digital）"
            },
            {
                name: "get_follower_time",
                type: "integer",
                default: "0",
                des: "获取粉丝时间"
            },
            {
                name: "follower_count",
                type: "integer",
                default: "0",
                des: "粉丝数量"
            },
            {
                name: "following_count",
                type: "integer",
                default: "0",
                des: "关注中"
            },
            {
                name: "is_official_shop",
                type: "bit",
                default: "0",
                des: "是否为官方店"
            },
            {
                name: "last_login_time",
                type: "integer",
                default: "0",
                des: "最后登陆时间"
            },
            {
                name: "nickname",
                type: "varchar(100)",
                default: "",
                des: "昵称（如：Skullreaper Digital）"
            },
            {
                name: "portrait",
                type: "varchar(50)",
                default: "",
                des: "肖像（如：595170becdb25bccda3e19a3840e6e8d）"
            },
            {
                name: "products",
                type: "integer",
                default: "0",
                des: "商品数量"
            },
            {
                name: "response_rate",
                type: "tinyint",
                default: "0",
                des: "聊天回应率（如：47）"
            },
            {
                name: "response_time",
                type: "integer",
                default: "0",
                des: "聊天回应时间（如：8501（几小时内））"
            },
            {
                name: "shop_rating",
                type: "numeric(8,7)",
                default: "0",
                des: "评分（如：4.90206）"
            },
            {
                name: "shopee_verified_flag",
                type: "tinyint",
                default: "0",
                des: "评级标志"
            },
            {
                name: "show_official_shop_label",
                type: "bit",
                default: "0",
                des: "是否显示官方标志"
            },
            {
                name: "show_shopee_verified_label",
                type: "bit",
                default: "0",
                des: "未知---还不知道做用"
            },
            {
                name: "userid",
                type: "integer",
                default: "0",
                des: "用户ID"
            },
            {
                name: "shopid",
                type: "integer",
                default: "0",
                des: "店铺ID"
            },
            {
                name: "username",
                type: "varchar(100)",
                default: "",
                des: "用户名（如：jianshao.my）"
            },
            {
                name: "is_in_fss",
                type: "bit",
                default: "0",
                des: "是否报了免运活动"
            },
            {
                name: "ps_plus",
                type: "bit",
                default: "0",
                des: "是否为【Preferred+】"
            },
            {
                name: "rating_good",
                type: "integer",
                default: "0",
                des: "好评数量（如：136372）"
            },
            {
                name: "rating_normal",
                type: "integer",
                default: "0",
                des: "中评数量（如：5001）"
            },
            {
                name: "rating_bad",
                type: "integer",
                default: "0",
                des: "差评数量（如：2040）"
            },
            {
                name: "is_shopee_choice",
                type: "bit",
                default: "0",
                des: "是否为choice标志"
            },
        ]
    },
]);