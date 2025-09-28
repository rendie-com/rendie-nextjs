Object.assign(Tool, {
    create_coupon: {
        a01: function (seller, site, num, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                next: next,
                This: This,
                t: t,
                siteNum: Tool.siteNum(site, num),
                /////////////////////////////////
                D1: 1, D2: 8,// 活动进度
                start_time: 0,
                end_time: 0,
                config: {}//全局配置
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let data = [{
                action: o.DEFAULT_DB,
                database: "main",
                sql: "select @.value as value FROM @.config where @.name='Shopee/营销中心/index.js'",
            }]
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            let config = JSON.parse(t[0][0].value)["营销中心"]
            if (!config) config = {}
            if (!config[oo.siteNum]) { config[oo.siteNum] = {} }
            if (!config[oo.siteNum]["优惠券"]) { config[oo.siteNum]["优惠券"] = [0, 0, 0, 0, 0, 0, 0, 0] }
            oo.config = config;
            this.a04(oo)
        },
        a04: function (oo) {
            Tool.x1x2("D", oo.D1, oo.D2, this.a05, this, this.g03, oo);
        },
        a05: function (oo) {
            oo.start_time = oo.config[oo.siteNum]["优惠券"][oo.D1 - 1]
            if (oo.start_time < Tool.gettime("")) {
                oo.start_time = Tool.gettime(Tool.userDate13(Date.now())) + 60 * 60 * 24 * 2
            }
            $("#timeA").html(Tool.js_date_time2(oo.start_time));
            this.a06(oo);
        },
        a06: function (oo) {
            if (Tool.create_coupon_b.b02(oo.start_time)) {
                this.a07(oo);
            }
            else {
                $("#state").html("活动不在30天以内，程序已终止。")
                this.g02("", oo);
            }
        },
        a07: function (oo) {
            if (oo.D1 == 6) {//关注礼优惠券
                oo.end_time = oo.start_time + 60 * 60 * 24 * 30 - 1;
                $("#timeB").html(Tool.js_date_time2(oo.end_time) + "（30天）")
                this.f01(oo)
            }
            else {
                oo.end_time = oo.start_time + 60 * 60 * 24 * 3 - 1;
                $("#timeB").html(Tool.js_date_time2(oo.end_time) + "（3天）")
                this.d01(oo)
            }
        },
        ////////////////////////////////
        d01: function (oo) {
            let timeStr = Tool.userDate13(oo.start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(oo.end_time * 1000 + 1000, "/").substr(5)
            let shopName = oo.seller[oo.site][Tool.int(oo.num) - 1].shopName.replace(/\_/g, "")
            let voucher_code = shopName.substring(0, 4).toUpperCase() + Tool.userDate13(oo.start_time * 1000, "").substr(4) + oo.D1;
            if (oo.D1 == 5) {
                //（5）【商品优惠券】：折扣金额10，最低消费100，可使用总数100。（3天一个活动，做3天，选100个销量大的商品）
                this.e01(timeStr, voucher_code, oo)
            }
            else {
                this.d02(timeStr, voucher_code, oo)
            }
        },
        d02: function (timeStr, voucher_code, oo) {
            let data = {}
            switch (oo.D1) {
                //（1）【店铺优惠券1】：3% Shopee币回扣，最高上限数额1，最低消费15，可使用总数100。（3天一个活动，做3天）
                case 1: data = Tool.create_coupon_b.b01(timeStr, voucher_code, oo.D1, oo.start_time, oo.end_time); break;
                //（2）【店铺优惠券2】：折扣金额1，最低消费20，可使用总数100。（3天一个活动，做3天）
                case 2: data = Tool.create_coupon_b.b05(timeStr, voucher_code, oo.D1, oo.start_time, oo.end_time); break;
                //（3）【新买家优惠券】：折扣金额2，最低消费30，可使用总数100。（3天一个活动，做3天）
                case 3: data = Tool.create_coupon_b.b06(timeStr, voucher_code, oo.D1, oo.start_time, oo.end_time); break;
                //（4）【回购买家优惠券】：折扣金额3，最低消费50，可使用总数100。（30天一个活动，做3天）
                case 4: data = Tool.create_coupon_b.b07(timeStr, voucher_code, oo.D1, oo.start_time, oo.end_time); break;
                //（7）【非公开优惠券】：折扣金额3，最低消费50，可使用总数100。（3天一个活动，做30天）
                case 7: data = Tool.create_coupon_b.b04(timeStr, voucher_code, oo.D1, oo.start_time, oo.end_time); break;
                //（8）【直播优惠券】：最低消费25，扣除百分比25%，可使用总数100。
                case 8: data = Tool.create_coupon_b.b03(timeStr, oo.D1, oo.start_time, oo.end_time); break;
            }
            if (data.name) {
                this.d03(data, oo)
            }
            else {
                Tool.pre(["post提交数数出错：", oo.D1]);
            }
        },
        d03: function (data, oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][Tool.int(oo.num) - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v3/voucher/?" + pArr.join("&");
            gg.postFetch(url, JSON.stringify(data), this.d04, this, oo)
        },
        d04: function (t, oo) {
            if (t.code == 0) {
                $("#state").html("添加优惠券-创建成功。");
                this.g01(oo)
            }
            else if (t.message == "please create a new shop welcome voucher after the existing one is expired" || t.message == "please create a new second order voucher after the existing one is expired") {
                //请在现有优惠券过期后，创建一个新的商店欢迎券（要过期后创建新的）
                this.g02("", oo)
            }
            else if (t.message == "voucher prefix already exist") {
                //请在现有的第二张订单凭证过期后创建新的第二个订单凭证
                this.g02("", oo)
            }
            else if (t.message == "price check failed") {
                //被冻结就会这样子。
                this.g02("", oo)
            }
            else if (t.message == "campaign overlap") {
                //时间重复了，就会这样子
                this.g02("", oo)
            }
            else if (t.message == "ERROR_PARAM") {
                //参数错误，我还不知道什么原因。            
                this.g02("", oo)
            }
            else {
                Tool.pre(["出错222：", t]);
                //this.g01(oo)
            }
        },
        //////////////////////////////////////////////////////////
        e01: function (timeStr, voucher_code, oo) {
            //@.status=1        表示【上架商品】
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select @.fromid as itemid from @.table where @.status=1 order by @._1688_saleNum desc limit 100",
            }]
            $("#state").html("正在获取本地商品。。。");
            let tmp = {
                timeStr: timeStr,
                voucher_code: voucher_code,
                oo: oo
            }
            Tool.ajax.a01(data, this.e02, this, tmp);
        },
        e02: function (t, tmp) {
            let data = Tool.create_coupon_b.b08(tmp.timeStr, tmp.voucher_code, tmp.oo.D1, tmp.oo.start_time, tmp.oo.end_time, t[0]);
            this.d03(data, tmp.oo);
        },
        ////////////////////////////////
        f01: function (oo) {
            //关注礼优惠券
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][Tool.int(oo.num) - 1].shopId,
                "cbsc_shop_region=" + oo.site,
                "start_time=" + oo.start_time,
                "end_time=" + oo.end_time
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/follow_prize/overlap/?" + pArr.join("&")
            gg.getFetch(url, "json", this.f02, this, oo);
        },
        f02: function (t, oo) {
            if (t.code == 0) {
                this.f03(oo)
            }
            else {
                Tool.pre(["出错333", t])
            }
        },
        f03: function (oo) {
            let data = {
                "shopid": oo.seller[oo.site][Tool.int(oo.num) - 1].shopId,
                "follow_prize_name": "【" + oo.D1 + "】关注礼优惠券",
                "start_time": oo.start_time,
                "end_time": oo.end_time,
                "quota": 100,
                "min_spend": 20,
                "reward_type": 0,
                "discount": { "value": 2 }
            }
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][Tool.int(oo.num) - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/follow_prize/create/?" + pArr.join("&");
            gg.postFetch(url, JSON.stringify(data), this.d04, this, oo)
        },
        ///////////////////////////////////////////////////
        g01: function (oo) {
            $("#state").html("正在更新活动时间。");
            oo.config[oo.siteNum]["优惠券"][oo.D1 - 1] = oo.end_time + 1;
            let data = [{
                action: o.DEFAULT_DB,
                database: "main",
                sql: "update @.config set @.value=" + Tool.rpsql(JSON.stringify({ "营销中心": oo.config })) + " where  @.name='Shopee/营销中心/index.js'",
            }]
            Tool.ajax.a01(data, this.g02, this, oo);
        },
        g02: function (t, oo) {
            $("#state").html("更新活动时间成功。")
            oo.D1++;
            this.a04(oo);
        },
        g03: function (oo) {
            $("#D1").css("width", "0%");
            $("#D1,#D2").html("");
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})