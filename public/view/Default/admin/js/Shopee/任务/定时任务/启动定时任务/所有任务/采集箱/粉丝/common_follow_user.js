Object.assign(Tool, {
    follow_user: {
        a01: function (target_user_id, dbname, is_follow, seller, site, next, This, t) {
            let oo = {
                target_user_id: target_user_id,
                dbname: dbname,
                is_follow: is_follow,
                seller: seller,
                site: site,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/order/follow_user?" + pArr.join("&")
            let data = {
                "target_user_id": oo.target_user_id,
                "is_follow": oo.is_follow
            }
            this.a03(url, data, oo)
        },
        a03: function (url, data, oo) {
            $("#state").html("正在" + (oo.is_follow ? '' : '取消') + "关注粉丝。。。")
            gg.postFetch(url, JSON.stringify(data), this.a04, this, oo)
        },
        a04: function (t, oo) {
            if (t.message == "success") {
                this.d01(oo);
            }
            else if (t.error == "error_bad_gateway") {
                Tool.Time("name", 200, this.a02, this, oo)
            }
            else if (t.message == "current shop can not access the current api") {
                Tool.Time("name", 200, this.a02, this, oo)
            }
            else if (t.message == "dependency error") {
                Tool.Time("name", 200, this.a02, this, oo)
            }
            else {
                Tool.pre(["出错2025.2.2", t])
            }
        },
        //////////////////////////////////////
        d01: function (oo) {
            let setField
            if (oo.is_follow) {
                //o.is_follow=true          表示要关注用户
                //@.follow_count            表示关注次数
                //@.follow_time             表示关注时的时间
                setField = "@.follow_count=@.follow_count+1,@.is_my_following=1,@.follow_time=" + Tool.gettime("");
            }
            else {
                //o.is_follow=false             表示要取消关注用户
                //@.notFollow_count             表示取关次数
                //@.is_my_following=0           表示没被我关注的用户
                setField = "@.notFollow_count=@.notFollow_count+1,@.is_my_following=0"
            }
            this.d02(setField, oo)
        },
        d02: function (setField, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/采集箱/粉丝/" + oo.site + "/" + oo.dbname,
                sql: "update @.table set " + setField + ' where @.userid=' + oo.target_user_id,
            }]
            $("#state").html("正在更新数据。。。")
            Tool.ajax.a01(data, this.d03, this, oo);
        },
        d03: function (t, oo) {
            if (t[0].length == 0) {
                oo.next.apply(oo.This, [oo.t])
            }
            else {
                Tool.pre(["有错误", t])
            }
        },
    },
})