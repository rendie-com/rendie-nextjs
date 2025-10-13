Object.assign(Tool, {
    common3: {
        b01: function (A1, shopName, start_time) {
            // （1）【店铺优惠券1】：3% Shopee币回扣，最高上限数额1，最低消费15，可使用总数100。（3天一个活动，做30天）
            if (start_time < Tool.gettime("")) { start_time = Tool.gettime("") + 60 * 10; }//加10分钟
            $("#timeA").html(Tool.js_date_time2(start_time));
            let end_time = start_time + 60 * 60 * 24 * 3;
            $("#timeB").html(Tool.js_date_time2(end_time) + "（3天）")
            if (this.b02(start_time)) {//活动开始时间不能在3天后
                let voucher_code = shopName.substring(0, 4).toUpperCase() + Tool.randomRange(10000, 99999);
                let timeStr = Tool.userDate13(start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(end_time * 1000 + 1000, "/").substr(5);
                let data = {
                    "name": "【" + A1 + "】店铺优惠券1 —— " + timeStr,
                    "start_time": start_time,
                    "end_time": end_time,
                    "voucher_code": voucher_code,
                    "value": null,
                    "max_value": null,
                    "discount": 0,
                    "min_price": 15,//最低消费金额
                    "usage_quantity": 100,//100张---可使用总数
                    "rule": {
                        "usage_limit_per_user": 1,
                        "items": [],
                        "coin_cashback_voucher": {
                            "coin_percentage_real": 3,//Shopee币回扣
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
                            "shop_order_count": 0,//0:表示【店铺优惠券】；1:表示【新买家优惠券】；2:表示【回购买家优惠券】3:表示【回购买家优惠券】二次；
                            "shop_order_count_period": 0
                        }
                    }
                }
                let arrLR = this.b10(data);
                return {
                    insert: "insert into @.table(@.voucher_id,@.fe_status,@.mtime,@.ctime," + arrLR[0].join(",") + ")values(${voucher_id},1," + Tool.gettime("") + "," + Tool.gettime("") + "," + arrLR[1].join(",") + ")",
                    data: data
                }
            }
            else {
                return null;
            }
        },
        //活动开始时间不能在2天后
        b02: function (time) {
            let isbool = false, newTime = Tool.gettime("");
            if (time < newTime) {
                time = newTime; isbool = true;
            }
            else if (time < newTime + 60 * 60 * 24 * 2)//2天
            {
                isbool = true;
            }
            return isbool;
        },
        b03: function (A1, start_time) {
            //8）【直播优惠券】：折扣金额3，最低消费50，可使用总数100。（3天一个活动，做3天）
            if (start_time < Tool.gettime("")) { start_time = Tool.gettime("") + 60 * 10; }//加10分钟
            $("#timeA").html(Tool.js_date_time2(start_time));
            let end_time = start_time + 60 * 60 * 24 * 30;
            $("#timeB").html(Tool.js_date_time2(end_time) + "（30天）")
            if (this.b02(start_time)) {//活动开始时间不能在3天后
                let timeStr = Tool.userDate13(start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(end_time * 1000 + 1000, "/").substr(5);
                let data = {
                    "name": "【" + A1 + "】直播优惠券 —— " + timeStr,
                    "start_time": start_time,
                    "end_time": end_time,
                    "voucher_code": null,
                    "value": 3,//折扣金额
                    "max_value": null,
                    "discount": 0,
                    "min_price": 50,//最低消费金额
                    "usage_quantity": 100,//100张---可使用总数
                    "rule": {
                        "coin_cashback_voucher": {
                            "coin_percentage_real": null,//Shopee币回扣
                            "max_coin": null//最高上限数额
                        },
                        "voucher_landing_page": 0,
                        "display_from": Tool.gettime(""),//提前显示优惠券  时间
                        "exclusive_channel_type": 1,
                        "hide": 0,
                        "reward_type": 0,//奖励类型：0:折扣；1:Shopee币回扣
                        "backend_created": 0,
                        "display_voucher_early": false,//提前显示优惠券
                        "choose_users": {
                            "shop_order_count": 0,//0:表示【店铺优惠券】；1:表示【新买家优惠券】；2:表示【回购买家优惠券】3:表示【回购买家优惠券】二次；
                            "shop_order_count_period": 0
                        }
                    }
                }
                let arrLR = this.b10(data);
                return {
                    insert: "insert into @.table(@.voucher_id,@.fe_status,@.mtime,@.ctime," + arrLR[0].join(",") + ")values(${voucher_id},1," + Tool.gettime("") + "," + Tool.gettime("") + "," + arrLR[1].join(",") + ")",
                    data: data
                }
            }
            else {
                return null;
            }
        },
        b04: function (A1, shopName, start_time) {
            if (start_time < Tool.gettime("")) { start_time = Tool.gettime("") + 60 * 10; }//加10分钟
            $("#timeA").html(Tool.js_date_time2(start_time));
            let end_time = start_time + 60 * 60 * 24 * 30;
            $("#timeB").html(Tool.js_date_time2(end_time) + "（30天）")
            if (this.b02(start_time)) {//活动开始时间不能在3天后
                let voucher_code = shopName.substring(0, 4).toUpperCase() + Tool.randomRange(10000, 99999);
                let timeStr = Tool.userDate13(start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(end_time * 1000 + 1000, "/").substr(5);
                let data = {
                    "name": "【" + A1 + "】非公开优惠券 —— " + timeStr,
                    "start_time": start_time,
                    "end_time": end_time,
                    "voucher_code": voucher_code,
                    "value": 3,//折扣金额
                    "max_value": null,
                    "discount": 0,
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
                            "shop_order_count": 0,//0:表示【店铺优惠券】；1:表示【新买家优惠券】；2:表示【回购买家优惠券】3:表示【回购买家优惠券】二次；
                            "shop_order_count_period": 0
                        }
                    }
                }
                let arrLR = this.b10(data);
                return {
                    insert: "insert into @.table(@.voucher_id,@.fe_status,@.mtime,@.ctime," + arrLR[0].join(",") + ")values(${voucher_id},1," + Tool.gettime("") + "," + Tool.gettime("") + "," + arrLR[1].join(",") + ")",
                    data: data
                }
            }
            else {
                return null;
            }
        },
        b05: function (A1, shopName, start_time) {
            //（2）【店铺优惠券2】：折扣金额1，最低消费20，可使用总数100。（3天一个活动，做3天）
            if (start_time < Tool.gettime("")) { start_time = Tool.gettime("") + 60 * 10; }//加10分钟
            $("#timeA").html(Tool.js_date_time2(start_time));
            let end_time = start_time + 60 * 60 * 24 * 3;
            $("#timeB").html(Tool.js_date_time2(end_time) + "（3天）")
            if (this.b02(start_time)) {//活动开始时间不能在3天后
                let voucher_code = shopName.substring(0, 4).toUpperCase() + Tool.randomRange(10000, 99999);
                let timeStr = Tool.userDate13(start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(end_time * 1000 + 1000, "/").substr(5);
                let data = {
                    "name": "【" + A1 + "】店铺优惠券2 —— " + timeStr,
                    "start_time": start_time,
                    "end_time": end_time,
                    "voucher_code": voucher_code,
                    "value": 1, //折扣金额
                    "max_value": null,
                    "discount": 0,
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
                            "shop_order_count": 0,//0:表示【店铺优惠券】；1:表示【新买家优惠券】；2:表示【回购买家优惠券】3:表示【回购买家优惠券】二次；
                            "shop_order_count_period": 0
                        }
                    }
                }
                let arrLR = this.b10(data);
                return {
                    insert: "insert into @.table(@.voucher_id,@.fe_status,@.mtime,@.ctime," + arrLR[0].join(",") + ")values(${voucher_id},1," + Tool.gettime("") + "," + Tool.gettime("") + "," + arrLR[1].join(",") + ")",
                    data: data
                }
            }
            else {
                return null;
            }
        },
        b06: function (A1, shopName, start_time) {
            //（3）【新买家优惠券】：折扣金额2，最低消费30，可使用总数100。（3天一个活动，做3天）
            if (start_time < Tool.gettime("")) { start_time = Tool.gettime("") + 60 * 10; }//加10分钟
            $("#timeA").html(Tool.js_date_time2(start_time));
            let end_time = start_time + 60 * 60 * 24 * 3;
            $("#timeB").html(Tool.js_date_time2(end_time) + "（3天）")
            if (this.b02(start_time)) {//活动开始时间不能在3天后
                let voucher_code = shopName.substring(0, 4).toUpperCase() + Tool.randomRange(10000, 99999);
                let timeStr = Tool.userDate13(start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(end_time * 1000 + 1000, "/").substr(5);
                let data = {
                    "name": "【" + A1 + "】新买家优惠券 —— " + timeStr,
                    "start_time": start_time,
                    "end_time": end_time,
                    "voucher_code": voucher_code,
                    "value": 2,//折扣金额
                    "max_value": null,
                    "discount": 0,
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
                let arrLR = this.b10(data);
                return {
                    insert: "insert into @.table(@.voucher_id,@.fe_status,@.mtime,@.ctime," + arrLR[0].join(",") + ")values(${voucher_id},1," + Tool.gettime("") + "," + Tool.gettime("") + "," + arrLR[1].join(",") + ")",
                    data: data
                }
            }
            else {
                return null;
            }
        },
        b07: function (A1, shopName, start_time) {
            //（4）【回购买家优惠券】：折扣金额3，最低消费50，可使用总数100。（30天一个活动，做3天）
            if (start_time < Tool.gettime("")) { start_time = Tool.gettime("") + 60 * 10; }//加10分钟
            $("#timeA").html(Tool.js_date_time2(start_time));
            let end_time = start_time + 60 * 60 * 24 * 3;
            $("#timeB").html(Tool.js_date_time2(end_time) + "（3天）")
            if (this.b02(start_time)) {//活动开始时间不能在3天后
                let voucher_code = shopName.substring(0, 4).toUpperCase() + Tool.randomRange(10000, 99999);
                let timeStr = Tool.userDate13(start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(end_time * 1000 + 1000, "/").substr(5);
                let data = {
                    "name": "【" + A1 + "】回购买家优惠券 —— " + timeStr,
                    "start_time": start_time,
                    "end_time": end_time,
                    "voucher_code": voucher_code,
                    "value": 3,//折扣金额
                    "max_value": null,
                    "discount": 0,
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
                let arrLR = this.b10(data);
                return {
                    insert: "insert into @.table(@.voucher_id,@.fe_status,@.mtime,@.ctime," + arrLR[0].join(",") + ")values(${voucher_id},1," + Tool.gettime("") + "," + Tool.gettime("") + "," + arrLR[1].join(",") + ")",
                    data: data
                }
            }
            else {
                return null;
            }
        },
        b08: function (A1, shopName, start_time, items) {
            if (start_time < Tool.gettime("")) { start_time = Tool.gettime("") + 60 * 10; }//加10分钟
            $("#timeA").html(Tool.js_date_time2(start_time));
            let end_time = start_time + 60 * 60 * 24 * 3;
            $("#timeB").html(Tool.js_date_time2(end_time) + "（3天）")
            if (this.b02(start_time)) {//活动开始时间不能在3天后
                let voucher_code = shopName.substring(0, 4).toUpperCase() + Tool.randomRange(10000, 99999);
                let timeStr = Tool.userDate13(start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(end_time * 1000 + 1000, "/").substr(5);
                let data = {
                    "name": "【" + A1 + "】商品优惠券 —— " + timeStr,
                    "start_time": start_time,
                    "end_time": end_time,
                    "voucher_code": voucher_code,
                    "value": 10,//折扣金额
                    "max_value": null,
                    "discount": 0,
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
                            "shop_order_count": 0,//0:表示【店铺优惠券】；1:表示【新买家优惠券】；2:表示【回购买家优惠券】3:表示【回购买家优惠券】二次；
                            "shop_order_count_period": 0
                        }
                    }
                }
                let arrLR = this.b10(data);
                return {
                    insert: "insert into @.table(@.voucher_id,@.fe_status,@.mtime,@.ctime," + arrLR[0].join(",") + ")values(${voucher_id},1," + Tool.gettime("") + "," + Tool.gettime("") + "," + arrLR[1].join(",") + ")",
                    data: data
                }
            }
            else { return null; }
        },
        b09: function (val) {
            if (val === null) {
                val = 'null';
            }
            else if (typeof (val) == "string") {
                val = Tool.rpsql(val)
            }
            else if (typeof (val) == "number") {
                val = val;
            }
            else if (typeof (val) == "object") {
                val = Tool.rpsql(JSON.stringify(val))
            }
            else if (typeof (val) == "boolean") {
                val = val ? 1 : 0;
            }
            return val;
        },
        b10: function (oo) {
            let arrL = [], arrR = []
            for (let k in oo) {
                arrL.push("@." + k);
                arrR.push(this.b09(oo[k]));
            }
            return [arrL, arrR]
        },
    }
})