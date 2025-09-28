Object.assign(Tool, {
    common1: {
        a01: function (seller, site, num, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: Tool.int(num) - 1,
                next: next,
                This: This,
                t: t,
                /////////////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                D1: 1, D2: 0, Darr: [],
                E1: 1, E2: 0, Earr: [],//子活动进度
                F1: 1, F2: 0, Farr: [],//修改折扣进度
            }
            this.a02(oo)
        },
        a02: function (oo) {
            $("#state").html("正在获取可报名活动个数。。。");
            Tool.common2.a01(oo.seller, oo.site, oo.num, this.a03, this, oo);
        },
        a03: function (t, oo) {
            oo.D2 = t.D2; oo.Darr = t.Darr;
            this.a04(oo);
        },
        a04: function (oo) {
            Tool.x1x2("D", oo.D1, oo.D2, this.a05, this, this.f03, oo);
        },
        a05: function (oo) {
            let o1 = oo.Darr[oo.D1 - 1]
            $("#name").html(o1.name)
            $("#description").html('<textarea rows="5" class="form-control" disabled>' + o1.description + "</textarea>")
            $("#time").html(Tool.js_date_time2(o1.start_time) + " 至 " + Tool.js_date_time2(o1.end_time));
            $("#RegistrationStatus").html('<span class="p-2">可报名：' + o1.session_statistics.available_session_num + '</span><span class="p-2">已报名：' + o1.session_statistics.nominated_session_num + '<span>');
            $("#state").html("正在进入子活动报名页面。。。");

            if (o1.campaign_scene_str == "CAMPAIGN_SCENE_BIG_CAMPAIGN") {
                $("#campaign_scene").html("商品活动");
                Tool.common3.a01(oo.seller, oo.site, oo.num, o1.id, this.a06, this, oo);
            }
            else if (o1.campaign_scene_str == "CAMPAIGN_SCENE_NORMAL_VOUCHER_CAMPAIGN") {
                $("#campaign_scene").html("优惠券活动 --- 跳过。");
                this.f02(oo)
            }
            else if (o1.campaign_scene_str == "CAMPAIGN_SCENE_LIVE_STREAM") {
                $("#campaign_scene").html("Shopee直播 --- 跳过。");
                this.f02(oo)
            }
            else if (o1.campaign_scene_str == "COIN_CASH_BACK") {
                $("#campaign_scene").html("金币返现活动 --- 跳过。");
                this.f02(oo)
            }
            else if (o1.campaign_scene_str == "LIVE_XTRA") {
                $("#campaign_scene").html("Voucher Xtra --- 跳过。");
                this.f02(oo)
            }
             else if (o1.campaign_scene_str == "MEGA_DISCOUNT_VOUCHER") {
                $("#campaign_scene").html("MDV优惠券 --- 跳过。");
                this.f02(oo)
            }
            else {
                $("#campaign_scene").html("未知活动类型");
                Tool.pre(["未知活动类型", o1]);
            }
        },
        a06: function (t, oo) {
            oo.E2 = t.E2; oo.Earr = t.Earr;
            this.a07(oo);
        },
        a07: function (oo) {
            Tool.x1x2("E", oo.E1, oo.E2, this.a08, this, this.f02, oo);
        },
        a08: function (oo) {
            let o1 = oo.Earr[oo.E1 - 1];
            $("#name2").html(o1.session_name);
            $("#description2").html('<textarea rows="5" class="form-control" disabled>' + o1.description + "</textarea>")
            $("#session_time").html(Tool.js_date_time2(o1.session_start_time) + " 至 " + Tool.js_date_time2(o1.session_end_time));
            $("#nomination_time").html(Tool.js_date_time2(o1.nomination_start_time) + " 至 " + Tool.js_date_time2(o1.nomination_end_time));
            if (o1.description.indexOf("Minimum 20% off Original Price") == -1) {
                this.d01(o1.session_id, oo);
            }
            else {
                //跳过
                this.f01(oo)
            }

        },
        //////////////////////////////////////////////////////////////////////////////
        b01: function (arr, Farr) {
            let isTrue = true;//是否正常
            for (let i = 0; i < arr.length; i++) {
                let models = arr[i].product.models
                for (let j = 0; j < models.length; j++) {
                    let price = this.b02(Farr, models[j].nomination_id)
                    if (price != models[j].campaign_price) {
                        isTrue = false;
                        break;
                    }
                }
                if (!isTrue) { break; }
            }
            return isTrue
        },
        b02: function (Farr, nomination_id) {
            let price = "";
            for (let i = 0; i < Farr.length; i++) {
                if (Farr[i].nomination_ids.indexOf(nomination_id) != -1) {
                    price = "" + Farr[i].campaign_price;
                    break;
                }
            }
            return price;
        },
        /////////////////////////////////////
        d01: function (session_id, oo) {
            $("#state").html("正在获取【添加商品】。。。");
            Tool.common4.a01(oo.seller, oo.site, oo.num, oo.siteNum, session_id, this.d02, this, oo);
        },
        d02: function (oo) {
            $("#state").html("找出要修改的商品并删除要删除的商品。");
            Tool.common5.a01(oo.seller, oo.site, oo.num, oo.siteNum, oo.Earr[oo.E1 - 1].session_id, this.d03, this, oo);
        },
        d03: function (t, oo) {
            oo.Earr[oo.E1 - 1].preview_no = t.preview_no;
            oo.F2 = t.discountArr.length;
            oo.Farr = t.discountArr;
            this.d04(oo)
        },
        d04: function (oo) {
            Tool.x1x2("F", oo.F1, oo.F2, this.d05, this, this.e01, oo);
        },
        d05: function (oo) {
            $("#state").html("正在修改折扣。。。");
            let Eobj = oo.Earr[oo.E1 - 1], Farr = oo.Farr[oo.F1 - 1];
            $("#item_id").html(Farr.item_id)
            Tool.common6.a01(oo.seller, oo.site, oo.num, Eobj.session_id, Eobj.preview_no, Farr, this.d06, this, oo)
        },
        d06: function (t, oo) {
            oo.F1++;
            this.d04(oo);
        },
        ////////////////////////////////////////
        e01: function (oo) {
            $("#state").html("正在获取【选中的商品】，用来确认修改折扣是否设置成功。。。");
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/mkt/cmt/preview/preview_list?" + arr.join("&")
            let data = { "session_id": oo.Earr[oo.E1 - 1].session_id, "entity_type": [2] }
            $("#state").html("正在获取选中的商品。。。");
            gg.postFetch(url, JSON.stringify(data), this.e02, this, oo);
        },
        e02: function (t, oo) {
            if (t.data.entity_list_data) {
                if (this.b01(t.data.entity_list_data.recruiting_entities, oo.Farr)) {
                    $("#state").html("正在提交。。。");
                    Tool.common7.a01(oo.seller, oo.site, oo.num, oo.Earr[oo.E1 - 1].session_id, this.f01, this, oo)
                }
                else {
                    $("#state").html("怎么还有商品要删除？我都已经删除过了。")
                }
            }
            else {
                //没数据就不用提交
                this.f01(oo);
            }
        },
        /////////////////////////////
        f01: function (oo) {
            oo.E1++;
            oo.F1 = 1; oo.F2 = 0; oo.Farr = [];
            $("#F1").css("width", "0%")
            $("#F1,#F2").html("");
            $("#state").html("提交成功")
            this.a07(oo);
        },
        f02: function (oo) {
            oo.D1++;
            oo.E1 = 1; oo.E2 = 0; oo.Earr = [];
            $("#E1").css("width", "0%")
            $("#E1,#E2").html("");
            this.a04(oo);
        },
        f03: function (oo) {
            $("#D1").css("width", "0%");
            $("#D1,#D2").html("");
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})