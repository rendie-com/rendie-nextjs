'use strict';
Object.assign(Tool, {
    accounts: {
        a01: function (arr, dbnameObj, editField, siteNum, next, This, t) {
            let oo = {
                dbnameObj: dbnameObj,
                siteNum: siteNum,
                next: next,
                This: This,
                t: t
            }
            this.a02(arr, editField, oo)
        },
        a02: function (arr, editField, oo) {
            let data = [];
            for (let i = 0; i < arr.length; i++) {
                let arrL = [
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
                ]
                if (editField) arrL.push(editField)
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
                if (editField) arrR.push(1)
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
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            Tool.apply(oo.dbnameObj, oo.next, oo.This, oo.t);
        },
    }
})