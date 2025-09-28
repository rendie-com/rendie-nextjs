Object.assign(Tool, {
    create_coupon_b: {
        b01: function (timeStr, voucher_code, C1, start_time, end_time) {
            // （1）【店铺优惠券1】：3% Shopee币回扣，最高上限数额1，最低消费15，可使用总数100。（3天一个活动，做30天）
            let oo = {
                "name": "【" + C1 + "】店铺优惠券1 —— " + timeStr,
                "start_time": start_time,
                "end_time": end_time,
                "voucher_code": voucher_code,
                "value": null,
                "max_value": null,
                "discount": null,
                "min_price": 15,//最低消费金额
                "usage_quantity": 100,//100张---可使用总数
                "rule": {
                    "usage_limit_per_user": 1,
                    "items": [],
                    "coin_cashback_voucher": {
                        "coin_percentage_real": 3,//15% Shopee币回扣
                        "max_coin": 1//最高上限数额
                    },
                    "voucher_landing_page": 0,
                    "display_from": Tool.gettime(""),//提前显示优惠券  时间
                    "exclusive_channel_type": null,
                    "hide": 0,
                    "reward_type": 1,//奖励类型：0:折扣；1:Shopee币回扣
                    "backend_created": 0,
                    "display_voucher_early": false,//提前显示优惠券
                    "choose_users": {
                        "shop_order_count": 0,
                        "shop_order_count_period": 0
                    }
                }
            }
            return oo;
        },
        b02: function (time) {
            let isbool = false, newTime = Tool.gettime(Tool.userDate13(Date.now())) + 60 * 60 * 24;//因为每个活动都是从00:0:00到23:59:59
            if (time < newTime) {
                time = newTime; isbool = true;
            }
            else if (time <= newTime + 60 * 60 * 24 * 3)//3天
            {
                isbool = true;
            }
            return isbool;
        },
        b03: function (timeStr, C1, start_time, end_time) {
            let oo = {
                "name": "【" + C1 + "】直播优惠券 —— " + timeStr,
                "start_time": start_time,
                "end_time": end_time,
                "voucher_code": null,
                "value": 3,//折扣金额
                "max_value": null,
                "discount": null,
                "min_price": 50,//最低消费金额
                "usage_quantity": 100,//100张---可使用总数
                "rule": {
                    "coin_cashback_voucher": {
                        "coin_percentage_real": null,
                        "max_coin": null
                    },
                    "voucher_landing_page": 0,
                    "display_from": Tool.gettime(""),//提前显示优惠券  时间
                    "exclusive_channel_type": 1,
                    "hide": 0,
                    "reward_type": 0,//奖励类型：0:折扣；1:Shopee币回扣
                    "backend_created": 0,
                    "display_voucher_early": false,//提前显示优惠券
                    "choose_users": {
                        "shop_order_count": 0,
                        "shop_order_count_period": 0
                    }
                }
            }
            return oo;
        },
        b04: function (timeStr, voucher_code, C1, start_time, end_time) {
            let oo = {
                "name": "【" + C1 + "】非公开优惠券 —— " + timeStr,
                "start_time": start_time,
                "end_time": end_time,
                "voucher_code": voucher_code,
                "value": 3,//折扣金额
                "max_value": null,
                "discount": null,
                "min_price": 50,//最低消费金额
                "usage_quantity": 100,//100张---可使用总数
                "rule": {
                    "usage_limit_per_user": 1,
                    "coin_cashback_voucher": {
                        "coin_percentage_real": null,
                        "max_coin": null
                    },
                    "voucher_landing_page": 0,
                    "display_from": null,
                    "exclusive_channel_type": null,
                    "hide": 1,//隐藏
                    "reward_type": 0,//奖励类型：0:折扣；1:Shopee币回扣
                    "backend_created": 0,
                    "choose_users": {
                        "shop_order_count": 0,
                        "shop_order_count_period": 0
                    }
                }
            }
            return oo;
        },
        b05: function (timeStr, voucher_code, C1, start_time, end_time) {
            let oo = {
                "name": "【" + C1 + "】店铺优惠券2 —— " + timeStr,
                "start_time": start_time,
                "end_time": end_time,
                "voucher_code": voucher_code,
                "value": 1, //折扣金额
                "max_value": null,
                "discount": null,
                "min_price": 20,//最低消费金额
                "usage_quantity": 100,//100张---可使用总数
                "rule": {
                    "usage_limit_per_user": 1,
                    "items": [],
                    "coin_cashback_voucher": {
                        "coin_percentage_real": null,
                        "max_coin": null
                    },
                    "voucher_landing_page": 0,
                    "display_from": Tool.gettime(""),//提前显示优惠券  时间
                    "exclusive_channel_type": null,
                    "hide": 0,
                    "reward_type": 0,//奖励类型：0:折扣；1:Shopee币回扣
                    "backend_created": 0,
                    "display_voucher_early": false,//提前显示优惠券
                    "choose_users": {
                        "shop_order_count": 0,
                        "shop_order_count_period": 0
                    }
                }
            }
            return oo;
        },
        b06: function (timeStr, voucher_code, C1, start_time, end_time) {
            let oo = {
                "name": "【" + C1 + "】新买家优惠券 —— " + timeStr,
                "start_time": start_time,
                "end_time": end_time,
                "voucher_code": voucher_code,
                "value": 2,//折扣金额
                "max_value": null,
                "discount": null,
                "min_price": 30,//最低消费金额
                "usage_quantity": 100,//100张---可使用总数
                "rule": {
                    "usage_limit_per_user": 1,
                    "coin_cashback_voucher": {
                        "coin_percentage_real": null,
                        "max_coin": null
                    },
                    "voucher_landing_page": 0,
                    "display_from": Tool.gettime(""),//提前显示优惠券  时间
                    "exclusive_channel_type": null,
                    "hide": 0,
                    "reward_type": 0,
                    "backend_created": 0,
                    "display_voucher_early": false,//提前显示优惠券
                    "choose_users": {
                        "shop_order_count": 1,//0:表示【店铺优惠券】；1:表示【新买家优惠券】；2:表示【回购买家优惠券】3:表示【回购买家优惠券】二次；
                        "shop_order_count_period": 0
                    }
                }
            }
            return oo
        },
        b07: function (timeStr, voucher_code, C1, start_time, end_time) {
            let oo = {
                "name": "【" + C1 + "】回购买家优惠券 —— " + timeStr,
                "start_time": start_time,
                "end_time": end_time,
                "voucher_code": voucher_code,
                "value": 3,//折扣金额
                "max_value": null,
                "discount": null,
                "min_price": 50,//最低消费金额
                "usage_quantity": 100,//100张---可使用总数
                "rule": {
                    "usage_limit_per_user": 1,
                    "coin_cashback_voucher": {
                        "coin_percentage_real": null,
                        "max_coin": null
                    },
                    "voucher_landing_page": 0,
                    "display_from": Tool.gettime(""),//提前显示优惠券  时间
                    "exclusive_channel_type": null,
                    "hide": 0,
                    "reward_type": 0,
                    "backend_created": 0,
                    "display_voucher_early": false,//提前显示优惠券
                    "choose_users": {
                        "shop_order_count": 2,//0:表示【店铺优惠券】；1:表示【新买家优惠券】；2:表示【回购买家优惠券】3:表示【回购买家优惠券】二次；
                        "shop_order_count_period": 1//在过去多少天购买过的买家。1:30天；2:90天；3:180天；4:365天；
                    }
                }
            }
            return oo;
        },
        b08: function (timeStr, voucher_code, C1, start_time, end_time, items) {
            let oo = {
                "name": "【" + C1 + "】商品优惠券 —— " + timeStr,
                "start_time": start_time,
                "end_time": end_time,
                "voucher_code": voucher_code,
                "value": 10,//折扣金额
                "max_value": null,
                "discount": null,
                "min_price": 100,//最低消费金额
                "usage_quantity": 100,//100张---可使用总数
                "rule": {
                    "usage_limit_per_user": 1,
                    "items": items,//商品
                    "coin_cashback_voucher": {
                        "coin_percentage_real": null,
                        "max_coin": null
                    },
                    "voucher_landing_page": 1,
                    "display_from": Tool.gettime(""),//提前显示优惠券  时间
                    "exclusive_channel_type": null,
                    "hide": 0,
                    "reward_type": 0,
                    "backend_created": 0,
                    "display_voucher_early": false,//提前显示优惠券
                    "choose_users": {
                        "shop_order_count": 0,
                        "shop_order_count_period": 0
                    }
                }
            }
            return oo;
        },
    }
})