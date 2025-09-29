'use strict';
let menuList =
    [
        {
            "name": "Shopee",
            "list": [
                {
                    "name": "类目",
                    "template": "Shopee/类目/index.js"
                },
                {
                    "name": "物流方式",
                    "template": "Shopee/物流方式/index.js"
                },
                {
                    "name": "违禁词",
                    "template": "Shopee/违禁词/index.js"
                },
                {
                    "name": "品牌",
                    "template": "Shopee/品牌/index.js"
                },
                null,
                {
                    "name": "商品",
                    "template": "Shopee/商品/index.js"
                },
                {
                    "name": "营销中心",
                    "template": "Shopee/营销中心/index.js"
                },
                {
                    "name": "Shopee广告",
                    "template": "Shopee/Shopee广告/index.js"
                },
                {
                    "name": "商业分析",
                    "template": "Shopee/商业分析/index.js"
                },
                {
                    "name": "销售辅导",
                    "template": "Shopee/销售辅导/index.js"
                },
                null,
                {
                    "name": "商家设置",
                    "template": "Shopee/商家设置/index.js"
                },
                {
                    "name": "订单",
                    "template": "Shopee/订单/index.js"
                },
                {
                    "name": "客优云",
                    "template": "Shopee/客优云/index.js"
                },
                {
                    "name": "聊聊",
                    "template": "Shopee/聊聊/index.js"
                },
                null,
                {
                    "name": "开放平台",
                    "template": "Shopee/开放平台.js"
                },
                {
                    "name": "任务",
                    "template": "Shopee/任务/index.js"
                },
                {
                    "name": "买家账户",
                    "template": "Shopee/买家账户/index.js"
                },
                {
                    "name": "采集箱",
                    "template": "Shopee/采集箱/index.js"
                },
            ]
        },
        {
            "name": "1688",
            "list": [
                {
                    "name": "类目",
                    "template": "1688/类目/index.js"
                },
                {
                    "name": "采集箱",
                    "template": "1688/采集箱/index.js"
                },
                {
                    "name": "买家账户",
                    "template": "1688/买家账户/index.js"
                },
                {
                    "name": "买家订单",
                    "template": "1688/买家订单/index.js"
                },
            ]
        },
        {
            "name": "TikTok",
            "list": [
                {
                    "name": "类目",
                    "template": "TikTok/类目/index.js"
                },
                {
                    "name": "商品",
                    "template": "TikTok/商品.js"
                },
                {
                    "name": "卖家账户",
                    "template": "TikTok/卖家账户/index.js"
                },
            ]
        },
        // {
        //     "name": "Lazada",
        //     "list": [
        //         {
        //             "name": "商品列表",
        //             "template": "Lazada/商品列表.js"
        //         },
        //         {
        //             "name": "卖家账户",
        //             "template": "Lazada/卖家账户/index.js"
        //         },
        //     ]
        // },
        // {
        //     "name": "Shein",
        //     "list": [
        //         {
        //             "name": "商品列表",
        //             "template": "Shein/商品列表.js"
        //         },
        //         {
        //             "name": "卖家账户",
        //             "template": "Shein/卖家账户.js"
        //         },
        //     ]
        // },
        // {
        //     "name": "Temu",
        //     "list": [
        //         {
        //             "name": "商品类目",
        //             "template": "Temu/商品类目.js"
        //         },
        //         {
        //             "name": "商品列表",
        //             "template": "Temu/商品列表.js"
        //         },
        //         {
        //             "name": "卖家账户",
        //             "template": "Temu/卖家账户.js"
        //         },
        //     ]
        // },
        {
            "name": "敦煌网",
            "list": [{
                "name": "国家",
                "template": "敦煌网/国家.js"
            }, {
                "name": "品牌",
                "template": "敦煌网/品牌/index.js"
            }, {
                "name": "类目",
                "template": "敦煌网/类目/index.js"
            }, {
                "name": "物流公司",
                "template": "敦煌网/物流公司.js"
            }, {
                "name": "已上传商品",
                "template": "敦煌网/已上传商品/index.js"
            }, {
                "name": "知识产权投诉",
                "template": "敦煌网/知识产权投诉/index.js"
            }, {
                "name": "搜索词追踪",
                "template": "敦煌网/搜索词追踪/无排名/index.js"
            }, null, {
                "name": "卖家账户",
                "template": "敦煌网/卖家账户/index.js"
            }, {
                "name": "订单",
                "template": "敦煌网/订单/index.js"
            }, {
                "name": "站内信",
                "template": "敦煌网/站内信/index.js"
            }, null, {
                "name": "日常任务",
                "template": "敦煌网/日常任务/index.js",
                "default": "default"
            }, {
                "name": "店铺统计",
                "template": "敦煌网/店铺统计/单个店铺统计.js"
            }, {
                "name": "产品分析",
                "template": "敦煌网/产品分析/index.js"
            }, {
                "name": "提现",
                "template": "敦煌网/提现/index.js"
            }, {
                "name": "订单统计",
                "template": "敦煌网/订单统计/index.js"
            }, null, {
                "name": "开放平台",
                "template": "敦煌网/开放平台/index.js"
            }, null, {
                "name": "采集",
                "template": "敦煌网/采集/index.js"
            }, {
                "name": "采集箱",
                "template": "敦煌网/采集箱/index.js"
            }, {
                "name": "采购账户",
                "template": "敦煌网/采购账户.js"
            }]
        },
        {
            "name": "速卖通",
            "list": [{
                "name": "国家",
                "template": "速卖通/国家/index.js"
            }, {
                "name": "品牌",
                "template": "速卖通/品牌/index.js"
            }, {
                "name": "类目",
                "template": "速卖通/类目/index.js"
            }, {
                "name": "物流公司",
                "template": "速卖通/物流公司.js"
            }, {
                "name": "运费模板",
                "template": "速卖通/运费模板/index.js"
            }, null, {
                "name": "采集",
                "template": "速卖通/采集/index.js"
            }, {
                "name": "采集箱",
                "template": "速卖通/采集箱/index.js"
            }, {
                "name": "采购账户",
                "template": "速卖通/采购账户/index.js"
            }, {
                "name": "卖家账户",
                "template": "速卖通/卖家账户/index.js"
            }, null, {
                "name": "开放平台",
                "template": "速卖通/开放平台/配置.js"
            }]
        },
        // {
        //     "name": "拼多多",
        //     "list": [{
        //         "name": "采集箱",
        //         "template": "拼多多/采集箱/index.js"
        //     }, {
        //         "name": "卖家账户",
        //         "template": "拼多多/卖家账户/index.js"
        //     }, {
        //         "name": "采购订单",
        //         "template": "拼多多/采购订单.js"
        //     }]
        // },
        // {
        //     "name": "淘宝",
        //     "list": [{
        //         "name": "采集箱",
        //         "template": "淘宝/采集箱/index.js"
        //     }, {
        //         "name": "买家账户",
        //         "template": "淘宝/买家账户/index.js"
        //     }, {
        //         "name": "买家订单",
        //         "template": "淘宝/买家订单/index.js"
        //     }]
        // },
        // {
        //     "name": "Ozon",
        //     "list": [{
        //         "name": "商品类目",
        //         "template": "Ozon/商品类目/index.js"
        //     }, {
        //         "name": "商品列表",
        //         "template": "Ozon/商品列表/index.js"
        //     }, {
        //         "name": "卖家账户",
        //         "template": "Ozon/卖家账户/index.js"
        //     }]
        // },
        // {
        //     "name": "Joom",
        //     "list": [
        //         {
        //             "name": "商品列表",
        //             "template": "Joom/商品列表.js"
        //         },
        //         {
        //             "name": "卖家账户",
        //             "template": "Joom/卖家账户.js"
        //         },
        //     ]
        // },
        // {
        //     "name": "eBay",
        //     "list": [{
        //         "name": "国家列表",
        //         "template": "eBay/国家列表.js"
        //     }, {
        //         "name": "物流公司",
        //         "template": "eBay/物流公司.js"
        //     }, {
        //         "name": "类目列表",
        //         "template": "eBay/类目列表.js"
        //     }, {
        //         "name": "已上传商品",
        //         "template": "eBay/已上传商品.js"
        //     }, null, {
        //         "name": "eBay账户",
        //         "template": "eBay/eBay账户/index.js"
        //     }, null, {
        //         "name": "开放开台",
        //         "template": "eBay/开放开台/index.js"
        //     }]
        // },
        // {
        //     "name": "Amazon",
        //     "list": [{
        //         "name": "已上传商品",
        //         "template": "Amazon/已上传商品.js"
        //     }, {
        //         "name": "Amazon账户",
        //         "template": "Amazon/Amazon账户/index.js"
        //     }]
        // },
        // {
        //     "name": "商品",
        //     "list": [{
        //         "name": "搜索关键词维护",
        //         "template": "商品/搜索关键词维护/index.js"
        //     }, {
        //         "name": "商品管理",
        //         "template": "商品/商品管理/index.js"
        //     }, {
        //         "name": "地区管理",
        //         "template": "工具/地区管理.js"
        //     }, null, {
        //         "name": "商品配置",
        //         "template": "商品/商品配置.js"
        //     }, {
        //         "name": "商品订单",
        //         "template": "商品/商品订单.js"
        //     }, {
        //         "name": "发退货查询",
        //         "template": "商品/发退货查询.js"
        //     }, {
        //         "name": "开发票查询",
        //         "template": "商品/开发票查询.js"
        //     }, {
        //         "name": "销售数据统计",
        //         "template": "商品/销售数据统计.js"
        //     }, null, {
        //         "name": "付款方式",
        //         "template": "商品/付款方式.js"
        //     }, {
        //         "name": "优惠券管理",
        //         "template": "商品/优惠券管理.js"
        //     }, {
        //         "name": "捆绑商品管理",
        //         "template": "商品/捆绑商品管理.js"
        //     }, {
        //         "name": "抢购管理",
        //         "template": "商品/抢购管理/index.js"
        //     }, {
        //         "name": "收货人地址",
        //         "template": "商品/收货人地址.js"
        //     }, {
        //         "name": "购物车",
        //         "template": "商品/购物车.js"
        //     }, {
        //         "name": "商品属性管理",
        //         "template": "商品/商品属性管理/index.js"
        //     }, null, {
        //         "name": "线下充值卡管理",
        //         "template": "商品/线下充值卡管理.js"
        //     }, {
        //         "name": "线上充值卡管理",
        //         "template": "商品/线上充值卡管理/index.js"
        //     }, {
        //         "name": "站内信管理",
        //         "template": "商品/站内信管理/index.js"
        //     }, {
        //         "name": "会员签到管理",
        //         "template": "商品/会员签到管理/index.js"
        //     }, {
        //         "name": "客户管理",
        //         "template": "商品/客户管理/index.js"
        //     }, {
        //         "name": "发送邮件管理",
        //         "template": "商品/发送邮件管理/index.js"
        //     }, null, {
        //         "name": "有效期明细",
        //         "template": "商品/有效期明细/index.js"
        //     }, {
        //         "name": "积分明细",
        //         "template": "商品/积分明细/index.js"
        //     }, {
        //         "name": "资金明细",
        //         "template": "商品/资金明细/index.js"
        //     }, {
        //         "name": "点券明细",
        //         "template": "商品/点券明细/index.js"
        //     }, {
        //         "name": "商品评论管理",
        //         "template": "商品/商品评论管理/index.js"
        //     }, null, {
        //         "name": "来源分类",
        //         "template": "商品/来源分类/index.js"
        //     }, {
        //         "name": "会员配置",
        //         "template": "商品/会员配置/index.js"
        //     }, {
        //         "name": "在线支付平台",
        //         "template": "商品/在线支付平台/index.js"
        //     }, {
        //         "name": "多系统接口设置",
        //         "template": "商品/多系统接口设置/index.js"
        //     }, {
        //         "name": "短信平台",
        //         "template": "商品/短信平台/index.js"
        //     }, {
        //         "name": "短信推广",
        //         "template": "商品/短信推广/index.js"
        //     }, null, {
        //         "name": "微信公众平台",
        //         "template": "商品/微信公众平台/index.js"
        //     }, {
        //         "name": "alibaba开放平台",
        //         "template": "商品/alibaba开放平台/index.js"
        //     }, {
        //         "name": "Shopify账户",
        //         "template": "商品/Shopify账户/index.js"
        //     }, {
        //         "name": "Joom账户",
        //         "template": "商品/Joom账户/index.js"
        //     }, {
        //         "name": "Tophatter账户",
        //         "template": "商品/Tophatter账户/index.js"
        //     }, {
        //         "name": "Cdiscount账户",
        //         "template": "商品/Cdiscount账户/index.js"
        //     }, {
        //         "name": "MyMall账户",
        //         "template": "商品/MyMall账户/index.js"
        //     }]
        // },
        // {
        //     "name": "视频",
        //     "list": [{
        //         "name": "视频采集管理",
        //         "template": "视频/视频采集管理/index.js"
        //     }, {
        //         "name": "视频评论管理",
        //         "template": "视频/视频评论管理/index.js"
        //     }, {
        //         "name": "视频管理",
        //         "template": "视频/视频管理/index.js"
        //     }, {
        //         "name": "用户管理",
        //         "template": "工具/用户管理/index.js"
        //     }, null, {
        //         "name": "分类转换",
        //         "template": "视频/分类转换/index.js"
        //     }, {
        //         "name": "过滤字典",
        //         "template": "视频/过滤字典/index.js"
        //     }, {
        //         "name": "修复数据格式",
        //         "template": "视频/修复数据格式/index.js"
        //     }, {
        //         "name": "数据批量替换",
        //         "template": "视频/数据批量替换/index.js"
        //     }, {
        //         "name": "删除指定来源",
        //         "template": "视频/删除指定来源/index.js"
        //     }, {
        //         "name": "设置点击量",
        //         "template": "视频/设置点击量/index.js"
        //     }, {
        //         "name": "无效图片清除",
        //         "template": "视频/无效图片清除/index.js"
        //     }, {
        //         "name": "报错处理",
        //         "template": "视频/报错处理/index.js"
        //     }, {
        //         "name": "伪原创设置",
        //         "template": "视频/伪原创设置/index.js"
        //     }, {
        //         "name": "自定义标签管理",
        //         "template": "视频/自定义标签管理/index.js"
        //     }, null, {
        //         "name": "广告管理",
        //         "template": "视频/广告管理/index.js"
        //     }, {
        //         "name": "友情链接管理",
        //         "template": "视频/友情链接管理/index.js"
        //     }, {
        //         "name": "留言管理",
        //         "template": "视频/留言管理/index.js"
        //     }, {
        //         "name": "生成选项",
        //         "template": "视频/生成选项/index.js"
        //     }, {
        //         "name": "生成百度地图",
        //         "template": "视频/生成百度地图/index.js"
        //     }, {
        //         "name": "生成谷歌地图",
        //         "template": "视频/生成谷歌地图/index.js"
        //     }, {
        //         "name": "生成RSS地图",
        //         "template": "视频/生成RSS地图/index.js"
        //     }]
        // },
        {
            "name": "工具",
            "list": [{
                "name": "定时任务",
                "template": "工具/定时任务/index.js"
            }, {
                "name": "工作计划",
                "template": "工具/工作计划.js"
            }, {
                "name": "网址导航",
                "template": "工具/网址导航/index.js"
            }, null, {
                "name": "腾讯企业邮箱",
                "template": "工具/腾讯企业邮箱/index.js"
            }, {
                "name": "github.com账号",
                "template": "工具/github.com账号/index.js"
            }, {
                "name": "replit.com账号",
                "template": "工具/replit.com账号/index.js"
            }, {
                "name": "vercel.com账号",
                "template": "工具/vercel.com账号/index.js"
            }, null, {
                "name": "google.com账号",
                "template": "工具/google.com账号/index.js"
            }, {
                "name": "cloudflare.com账号",
                "template": "工具/cloudflare.com账号/index.js"
            }, {
                "name": "freenom.com账号",
                "template": "工具/freenom.com账号/index.js"
            }, {
                "name": "OneDrive账号",
                "template": "工具/OneDrive账号/index.js"
            }, {
                "name": "cpolar.com账号",
                "template": "工具/cpolar.com账号/index.js"
            }, null, {
                "name": "桌面插件",
                "template": "工具/桌面插件/index.js"
            }]
        },
        {
            "name": "扩展",
            "list": [{
                "name": "论坛配置",
                "template": "论坛/论坛配置/index.js"
            }, {
                "name": "论坛管理",
                "template": "论坛/论坛管理/index.js"
            }, {
                "name": "论坛等级头衔",
                "template": "论坛/论坛等级头衔/index.js"
            }, {
                "name": "论坛勋章管理",
                "template": "论坛/论坛勋章管理/index.js"
            }, null, {
                "name": "问答参数配置",
                "template": "论坛/问答参数配置/index.js"
            }, {
                "name": "问答等级头衔",
                "template": "论坛/问答等级头衔/index.js"
            }, {
                "name": "问答专家认证管理",
                "template": "论坛/问答专家认证管理/index.js"
            }, {
                "name": "问答管理",
                "template": "论坛/问答管理/index.js"
            }, {
                "name": "新闻评论管理",
                "template": "扩展/新闻评论管理/index.js"
            }, {
                "name": "新闻管理",
                "template": "扩展/新闻管理/index.js"
            }, {
                "name": "图片管理",
                "template": "扩展/图片管理/index.js"
            }, {
                "name": "新闻项目管理",
                "template": "扩展/新闻项目管理/index.js"
            }, {
                "name": "图片项目管理",
                "template": "扩展/图片项目管理/index.js"
            }, {
                "name": "客户项目管理",
                "template": "扩展/客户项目管理/index.js"
            }, null, {
                "name": "空间参数设置",
                "template": "扩展/空间参数设置/index.js"
            }, {
                "name": "个人空间管理",
                "template": "扩展/个人空间管理/index.js"
            }, {
                "name": "空间博文管理",
                "template": "扩展/空间博文管理/index.js"
            }, {
                "name": "微博数据管理",
                "template": "扩展/微博数据管理/index.js"
            }, {
                "name": "用户相册管理",
                "template": "扩展/用户相册管理/index.js"
            }, {
                "name": "用户圈子管理",
                "template": "扩展/用户圈子管理/index.js"
            }, {
                "name": "用户留言管理",
                "template": "扩展/用户留言管理/index.js"
            }, {
                "name": "用户歌曲管理",
                "template": "扩展/用户歌曲管理/index.js"
            }, null, {
                "name": "企业空间管理",
                "template": "扩展/企业空间管理/index.js"
            }, {
                "name": "企业新闻管理",
                "template": "扩展/企业新闻管理/index.js"
            }, {
                "name": "企业产品管理",
                "template": "扩展/企业产品管理/index.js"
            }, {
                "name": "行业广告管理",
                "template": "扩展/行业广告管理/index.js"
            }, {
                "name": "荣誉证书管理",
                "template": "扩展/荣誉证书管理/index.js"
            }]
        },
        {
            "name": "系统",
            "list": [{
                "name": "站点信息",
                "template": "系统/站点信息/index.js"
            }, {
                "name": "系统配置",
                "template": "系统/系统配置.js"
            }, {
                "name": "SQL助手",
                "template": "系统/SQL助手/index.js"
            }, {
                "name": "标签助手",
                "template": "系统/标签助手.js"
            }, null, {
                "name": "文件管理",
                "template": "系统/文件管理.js"
            }, {
                "name": "导入、导出",
                "template": "系统/导入、导出/index.js"
            }, {
                "name": "数据表",
                "template": "系统/数据表/index.js"
            }, {
                "name": "插件",
                "template": "系统/插件/index.js"
            }, null, {
                "name": "后台分类",
                "template": "系统/后台分类.js"
            }, {
                "name": "分类配置信息",
                "template": "系统/分类配置信息/index.js"
            }, {
                "name": "用户组",
                "template": "系统/用户组.js"
            }, {
                "name": "系统账号",
                "template": "系统/系统账号/index.js"
            }, null, {
                "name": "后台登陆日志",
                "template": "系统/后台登陆日志.js"
            }, {
                "name": "访问日志",
                "template": "系统/访问日志/index.js"
            }, {
                "name": "出错日志",
                "template": "系统/出错日志.js"
            }, null, {
                "name": "IP库",
                "template": "系统/IP库/index.js"
            }]
        }
    ]