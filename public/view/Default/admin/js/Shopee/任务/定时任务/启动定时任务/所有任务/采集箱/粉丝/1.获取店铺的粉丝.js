'use strict';
Object.assign(Tool, {
    get_follower_list: {
        a01: function (progress, site, siteNum, shopid, get_follower_time, dbnameObj, next, This, t) {
            let oo = {
                progress: progress,
                site: site,
                siteNum: siteNum,
                shopid: shopid,
                get_follower_time: get_follower_time,
                dbnameObj: dbnameObj,//用到的粉丝数据库计数,关注粉丝要用。
                next: next,
                This: This,
                t: t,
                ////////////////////////////////////////
                A1: 1, A2: 1,
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a03, this, this.d03, oo)
        },
        a03: function (oo) {
            let url = "https://" + (oo.site == "tw" ? "xiapi" : oo.site) + ".xiapibuy.com/api/v4/pages/get_follower_list?limit=20&offset=" + ((oo.A1 - 1) * 20) + "&shopid=" + oo.shopid
            $("#url").html(url);
            $("#state").html("正在获取店铺的粉丝。。。【" + oo.site + "】")
            gg.getFetch(url, "json", this.a04, this, oo);

        },
        a04: function (t, oo) {
            $("#state").html("已获取店铺的粉丝。")
            if (t && t.data) {
                if (t.data.accounts) {
                    if (t.data.accounts[0].last_active_time < oo.get_follower_time) {
                        //表示活跃时间小于我的采集时间，就不用采集了。
                        this.d03(oo);
                    }
                    else {
                        if (!t.data.nomore) { oo.A2++; }
                        this.d01(t.data.accounts, oo);
                    }
                }
                else {
                    $("#state").html("店铺的粉丝隐藏了，跳过。。。")
                    this.d03(oo);
                }
            }
            else {
                $("#state").html("可能是没有粉丝，跳过。。。")
                this.d03(oo);
            }
        },
        //////////////////////////////////////////////////
        d01: function (arr, oo) {
            let data = [], arrL = [
                "@.userid",
                "@.shopid",
                "@.status",
                "@.last_active_time",
                "@.shopname",
                "@.username",
                "@.portrait",
                "@.is_preferred_plus",
                "@.is_official_shop",
                "@.is_shopee_verified",
                "@.is_seller",
            ];
            for (let i = 0; i < arr.length; i++) {
                let arrR = [
                    arr[i].userid,
                    arr[i].shopid,
                    arr[i].status,
                    arr[i].last_active_time,
                    Tool.rpsql(arr[i].shopname),
                    Tool.rpsql(arr[i].username),
                    Tool.rpsql(arr[i].portrait),
                    arr[i].is_preferred_plus ? 1 : 0,
                    arr[i].is_official_shop ? 1 : 0,
                    arr[i].is_shopee_verified ? 1 : 0,
                    arr[i].is_seller ? 1 : 0,
                ]
                /////////////////////////////////////////////////
                let arrUp = []; for (let i = 0; i < arrL.length; i++) { arrUp.push(arrL[i] + "=" + arrR[i]); }
                let dbname = Tool.remainder(arr[i].userid, 100);
                if (oo.dbnameObj[dbname]) {//这个计数是要计算这个增加了多少个，好在后面关注用户。
                    oo.dbnameObj[dbname]++;
                }
                else {
                    oo.dbnameObj[dbname] = 1;
                }
                data.push({
                    action: "sqlite",
                    database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + dbname,
                    sql: "select @.userid as userid from @.table where @.userid=" + arr[i].userid,
                    list: [{
                        action: "sqlite",
                        database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + dbname,
                        sql: "update @.table set " + arrUp.join(",") + " where @.userid=" + arr[i].userid
                    }],
                    elselist: [{
                        action: "sqlite",
                        database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + dbname,
                        sql: "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")"
                    }]
                })
            }
            $("#state").html("正在查询数据。。。")
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            $("#dbnameObj").html(JSON.stringify(oo.dbnameObj, null, 2))
            oo.A1++;
            this.a02(oo);
        },
        d03: function (oo) {
            Tool.apply(oo.dbnameObj, oo.next, oo.This, oo.t);
        },
    }
})