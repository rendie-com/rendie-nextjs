'use strict';
Object.assign(Tool, {
    common_following: {
        a01: function (progressArr, dbnameObj, siteNum, site, num, seller, next, This, t) {
            let Aarr = [];
            for (let k in dbnameObj) {
                Aarr.push(k)
            }
            let oo = {
                progressArr: progressArr,
                dbnameObj: dbnameObj,
                siteNum: siteNum,
                site: site,
                num: num,
                seller: seller,
                next: next,
                This: This,
                t: t,
                /////////////////////////////////
                A1: 1, A2: Aarr.length, Aarr: Aarr,
                B1: 1, B2: 0,
                C1: 0, C2: 40,
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.x1x2(oo.progressArr[0], oo.A1, oo.A2, this.a03, this, this.f02, oo)
        },
        a03: function (oo) {
            let dbname = oo.Aarr[oo.A1 - 1]
            $("#dbname").html(dbname)
            //@.is_my_following=1      表示[被我关注]的用户
            let data = [{
                action: "sqlite",
                database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + dbname,
                sql: "select count(1) as count FROM @.table where @.is_my_following=1"
            }]
            $("#state").html("正在获取[被我关注]的用户。。。")
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            oo.B2 = t[0][0].count
            oo.B1 = oo.B2;
            this.d01(oo)
        },
        //////////////////////////////////////////////////////
        d01: function (oo) {
            Tool.x1x2(oo.progressArr[1], oo.B1, oo.B2, this.d02, this, null, oo)
        },
        d02: function (oo) {
            if (oo.B1 <= oo.C2 - 1) {
                $("#state").html("不用取关了")
                this.e01(oo)
            }
            else {
                //去取关
                //@.is_my_following     表示是否被我关注
                //@.isLock              表示是否锁定（排序的目的是想优先取消关注）
                let data = [{
                    action: "sqlite",
                    database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + oo.Aarr[oo.A1 - 1],
                    sql: "select @.userid as userid FROM @.table where @.is_my_following=1 order by @.isLock desc,@.follow_time asc limit 1",
                }]
                Tool.ajax.a01(data, this.d03, this, oo);
            }
        },
        d03: function (t, oo) {
            $("#userid").html(t[0][0].userid)
            //false     表示取关
            Tool.follow_user.a01(t[0][0].userid, oo.Aarr[oo.A1 - 1], false, oo.seller, oo.site, oo.num, oo.siteNum, this.d04, this, oo)
        },
        d04: function (oo) {
            oo.B1--;
            this.d01(oo);
        },
        ///////////////////////////////////////////////////////////////////
        e01: function (oo) {
            oo.C1 = oo.B1 + 1
            this.e02(oo)
        },
        e02: function (oo) {
            Tool.x1x2(oo.progressArr[2], oo.C1, oo.C2, this.e03, this, this.f01, oo)
        },
        e03: function (oo) {
            //@.is_my_following=0      表示没被我关注的用户
            //@.follow_count           关注次数
            //@.is_following           是否关注我  
            //@.last_active_time       最后活跃时间
            //@.isLock=0               表示不用锁定的用户
            let data = [{
                action: "sqlite",
                database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + oo.Aarr[oo.A1 - 1],
                sql: "select @.userid as userid FROM @.table where @.is_my_following=0 and @.isLock=0 order by @.follow_count asc,@.last_active_time desc limit 1"
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
                Tool.follow_user.a01(t[0][0].userid, oo.Aarr[oo.A1 - 1], true, oo.seller, oo.site, oo.num, oo.siteNum, this.e05, this, oo)
            }
        },
        e05: function (oo) {
            oo.C1++;
            this.e02(oo);
        },
        ////////////////////////////////////////
        f01: function (oo) {
            oo.A1++;
            oo.B1 = 0; oo.B2 = 0
            oo.C1 = 0
            $("#" + oo.progressArr[1] + "1,#" + oo.progressArr[2] + "1").css("width", "0%");
            $("#" + oo.progressArr[1] + "1,#" + oo.progressArr[1] + "2,#" + oo.progressArr[2] + "1,#" + oo.progressArr[2] + "2,#userid,#dbname").html("")
            $("#state").html("更新成功，正准备下一个数库库。。。")
            this.a02(oo);
        },
        f02: function (oo) {
            oo.next.apply(oo.This, [oo.t])
        },
    }
})