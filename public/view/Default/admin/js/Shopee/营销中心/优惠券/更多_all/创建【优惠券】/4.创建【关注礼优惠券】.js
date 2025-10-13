Object.assign(Tool, {
    common4: {
        a01: function (A1, start_time, seller, site, num, siteNum, next, This, t) {
            let oo = {
                A1: A1,
                seller: seller,
                site: site,
                num: num,
                siteNum: siteNum,
                next: next,
                This: This,
                t: t,
                ///////////////////////////////////////
                start_time: 0,
                end_time: 0,
                name: "",
                numTime: 50,//计数
            }
            this.a02(start_time, oo)
        },
        a02: function (start_time, oo) {
            if (start_time < Tool.gettime("")) { start_time = Tool.gettime("") + 60 * 10; }//加1小时
            $("#timeA").html(Tool.js_date_time2(start_time));
            let end_time = start_time + 60 * 60 * 24 * 30;
            $("#timeB").html(Tool.js_date_time2(end_time) + "（30天）")
            if (Tool.common3.b02(start_time)) {//活动开始时间不能在3天后
                this.a03(start_time, end_time, oo)
            }
            else {
                $("#state").html("还没到做活动的时后。。。");
                this.d06(null, oo)
            }
        },
        a03: function (start_time, end_time, oo) {
            let timeStr = Tool.userDate13(start_time * 1000, "/").substr(5) + "-" + Tool.userDate13(end_time * 1000 + 1000, "/").substr(5);
            let data = {
                "shopid": oo.seller[oo.site][oo.num - 1].shopId,
                "follow_prize_name": "【" + oo.A1 + "】关注礼【" + timeStr + "】",
                "start_time": start_time,
                "end_time": end_time,
                "quota": 100,
                "min_spend": Tool.int(20 * oo.seller[oo.site][oo.num - 1].exchangeRate),
                "reward_type": 0,
                "discount": { "value": Tool.int(2 * oo.seller[oo.site][oo.num - 1].exchangeRate) }
            }
            oo.name = data.follow_prize_name;
            oo.start_time = data.start_time;
            oo.end_time = data.end_time;
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/follow_prize/create/?" + pArr.join("&");
            $("#state").html("正在创建【关注礼优惠券】活动。。。");
            gg.postFetch(url, JSON.stringify(data), this.a04, this, oo);
        },
        a04: function (t, oo) {
            if (t.code == 0) {
                $("#state").html("创建【关注礼优惠券】成功。。。");
                Tool.Time("name", 200, this.d01, this, oo);
            }
            else {
                Tool.pre(["出错2025/10/13", t])
            }
        },
        ///////////////////////////////////////////////////////////////
        b01: function (val) {
            if (typeof (val) == "string") {
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
        b02: function (oo) {
            let arrL = [], arrR = [], updateArr = []
            for (let k in oo) {
                arrL.push("@." + k);
                oo[k] = this.b01(oo[k], k)
                arrR.push(oo[k]);
                if (k != "voucher_id") { updateArr.push("@." + k + "=" + oo[k]); }
            }
            return [arrL, arrR, updateArr]
        },
        ///////////////////////////////////////////////////////////////
        d01: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site,
                "offset=0",
                "limit=10",
                "promotion_type=0",
                "voucher_name=" + encodeURIComponent(oo.name)
            ]
            let url = "https://seller.shopee.cn/api/marketing/v3/voucher/list/?" + pArr.join("&");
            $("#state").html("正在搜索【关注礼优惠券】。。。");
            gg.getFetch(url, "json", this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (t.code == 0) {
                this.d03(t.data.voucher_list, oo)
            } else {
                Tool.pre(["出错【2025/10/13】", t])
            }
        },
        d03: function (arr, oo) {
            oo.numTime--;
            $("#state").html("计数：" + oo.numTime);
            if (oo.numTime == 0) {
                $("#state").html("搜索不到【关注礼优惠券】，程序已终止。");
            }
            else {
                if (arr.length == 0) {
                    Tool.Time("name", 200, this.d01, this, oo);
                }
                else {
                    this.d04(arr, oo);
                }
            }
        },
        d04: function (arr, oo) {
            let data = []
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name == oo.name && arr[i].start_time == arr[i].start_time && arr[i].end_time == arr[i].end_time) {
                    let arrLRU = this.b02(arr[i]);
                    data = [{
                        action: "sqlite",
                        database: "shopee/营销中心/优惠券/" + oo.siteNum,
                        sql: "select @.voucher_id from @.table where @.voucher_id=" + arr[i].voucher_id,
                        list: [{
                            action: "sqlite",
                            database: "shopee/营销中心/优惠券/" + oo.siteNum,
                            sql: "update @.table set " + arrLRU[2].join(",") + "  where  @.voucher_id=" + arr[i].voucher_id,
                        }],
                        elselist: [{
                            action: "sqlite",
                            database: "shopee/营销中心/优惠券/" + oo.siteNum,
                            sql: "insert into @.table(" + arrLRU[0].join(",") + ")values(" + arrLRU[1].join(",") + ")",
                        }]
                    }]
                    break;
                }
            }
            this.d05(data, oo)
        },
        d05: function (data, oo) {
            if (data.length == 0) {
                Tool.Time("name", 200, this.d01, this, oo);
            }
            else {
                $("#state").html("正在更新本地商品状态。。。");
                Tool.ajax.a01(data, this.d06, this, oo)
            }
        },
        d06: function (t, oo) {
            $("#state").html("本地活动添加成功。")
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})