'use strict';
Object.assign(Tool, {
    common_following: {
        obj: {
            F1: 1, F2: 0, Farr: [],
            G1: 0, G2: 0,
            H1: 0, H2: 40,
        },
        a01: function (dbnameObj, oo) {
            let Farr = [];
            for (let k in dbnameObj) {
                Farr.push(k)
            }
            this.obj.Farr = Farr; this.obj.F2 = Farr.length;
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.x1x2("F", this.obj.F1, this.obj.F2, this.a03, this, this.f02, oo)
        },
        a03: function (oo) {
            let dbname = this.obj.Farr[this.obj.F1 - 1]
            $("#dbname").html(dbname)
            //@.is_my_following=1      表示被我关注的用户
            let data = [{
                action: "sqlite",
                database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + dbname,
                sql: "select count(1) as total FROM @.table where @.is_my_following=1"
            }]
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            this.obj.G2 = t[0][0].total
            this.obj.G1 = this.obj.G2
            this.a05(oo)
        },
        a05: function (oo) {
            Tool.x1x2("G", this.obj.G1, this.obj.G2, this.d01, this, null, oo)
        },
        ////////////////////
        d01: function (oo) {
            if (this.obj.G1 <= this.obj.H2 - 1) {
                $("#state").html("不用取关了")
                this.e01(oo)
            }
            else {
                //去取关
                //@.is_following=0      表示不是我的粉丝
                //@.is_my_following     表示是否被我关注
                let data = [{
                    action: "sqlite",
                    database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + this.obj.Farr[this.obj.F1 - 1],
                    sql: "select @.userid as userid FROM @.table where @.is_my_following=1 order by @.follow_time asc limit 1",
                }]
                Tool.ajax.a01(data, this.d02, this, oo);
            }
        },
        d02: function (t, oo) {
            $("#userid").html(t[0][0].userid)
            Tool.follow_user.a01(t[0][0].userid, this.obj.Farr[this.obj.F1 - 1], false, oo.seller, oo.site, oo.num, oo.siteNum, this.d03, this, oo)
        },
        d03: function (oo) {
            this.obj.G1--;
            this.a05(oo);
        },
        ///////////////////////////////////////////////////////////////////
        e01: function (oo) {
            this.obj.H1 = this.obj.G1 + 1
            this.e02(oo)
        },
        e02: function (oo) {
            Tool.x1x2("H", this.obj.H1, this.obj.H2, this.e03, this, this.f01, oo)
        },
        e03: function (oo) {
            //@.is_my_following=0      表示没被我关注的用户
            //@.follow_count           关注次数
            //@.is_following           是否关注我  
            //@.last_active_time       最后活跃时间
            let data = [{
                action: "sqlite",
                database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + this.obj.Farr[this.obj.F1 - 1],
                sql: "select @.userid as userid FROM @.table where @.is_my_following=0 and @.follow_count=0 order by @.follow_count asc,@.last_active_time desc limit 1"
            }]
            Tool.ajax.a01(data, this.e04, this, oo);
        },
        e04: function (t, oo) {
            if (t[0].length == 0) {
                $("#state").html("没有用户可以关注了")
                this.f01(oo)
            }
            else {
                $("#userid").html(t[0][0].userid)
                Tool.follow_user.a01(t[0][0].userid, this.obj.Farr[this.obj.F1 - 1], true, oo.seller, oo.site, oo.num, oo.siteNum, this.e05, this, oo)
            }
        },
        e05: function (oo) {
            this.obj.H1++;
            this.e02(oo);
        },
        ////////////////////////////////////////
        f01: function (oo) {
            this.obj.F1++;
            this.obj.G1 = 0
            this.obj.G2 = 0
            this.obj.H1 = 0
            $("#G1,#H1").css("width", "0%");
            $("#G1,#G2,#H1,#H2,#userid,#dbname").html("")
            $("#state").html("更新成功，正准备下一个数库库。。。")
            this.a02(oo);
        },
        f02: function (oo) {
            this.obj.F1 = 1; this.obj.F2 = 0; this.obj.Farr = [];
            oo.next.apply(oo.This, [oo.t])
        },
    }
})