'use strict';
var task = {
    a01: function (seller, site, num, next, This, t) {
        let oo = {
            seller: seller,
            site: site,
            num: num,
            next: next,
            This: This,
            t: t,
            siteNum: Tool.siteNum(site, num),
            ///////////////////////////////////////////////////////////////
            D1: 1, D2: 0,
            Dobj: {
                shopid: 0,//店铺ID
                get_follower_time: 0,//上次的获取粉丝时间
                new_get_follower_time: 0,//这次的获取粉丝时间            
            },
            dbnameObj: {},//用到的粉丝数据库计数,关注粉丝要用。           
        }
        $("#tbody").html('\
        <tr class="table-light"><td colspan="3"><b>采集箱/粉丝/从店铺中获取粉丝</b></td></tr>\
        <tr><td class="right">店铺ID：</td><td id="shopid" colspan="2"></td></tr>\
        <tr><td class="right">店铺ID进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
        <tr><td class="right">粉丝页进度：</td>'+ Tool.htmlProgress('E') + '</tr>\
        <tr><td class="right">上次的获取粉丝时间：</td><td id="get_follower_time" colspan="2"></td></tr>\
        <tr><td class="right">这次的获取粉丝时间：</td><td id="new_get_follower_time" colspan="2"></td></tr>\
        <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
        <tr class="table-light"><td colspan="3"><b>采集箱/粉丝/取消关注和关注</b></td></tr>\
        <tr><td class="right">粉丝数据库名：</td><td id="dbname" colspan="2"></td></tr>\
        <tr><td class="right">粉丝数据库进度：</td>'+ Tool.htmlProgress('F') + '</tr>\
        <tr><td class="right">取消关注进度：</td>'+ Tool.htmlProgress('G') + '</tr>\
        <tr><td class="right">关注进度：</td>'+ Tool.htmlProgress('H') + '</tr>\
        <tr><td class="right">用户ID：</td><td id="userid" colspan="2"></td></tr>\
        <tr><td class="right">用到的粉丝数据库：</td><td colspan="2"><textarea id="dbnameObj" rows="100" class="form-control form-control"></textarea></td></tr>\
        ')
        this.a02(oo);
    },
    a02: function (oo) {
        Tool.download_sqlite.a01(["shopee/采集箱/店铺/" + oo.siteNum], this.a03, this, oo)
    },
    a03: function (t, oo) {
        $("#state").html("正在获取店铺信息。。。");
        let where = this.b01()
        let data = [{
            action: "sqlite",
            database: "shopee/采集箱/店铺/" + oo.siteNum,
            sql: "select " + Tool.fieldAs("shopid,get_follower_time") + " from @.table" + where + " order by @.get_follower_time asc limit 1",
        }]
        if (oo.D2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/采集箱/店铺/" + oo.siteNum,
                sql: "select count(1) as count FROM @.table" + where,
            })
        }
        Tool.ajax.a01(data, this.a04, this, oo);
    },
    a04: function (t, oo) {
        //一次执行只获取前5个店铺的粉丝
        if (oo.D2 == 0) { oo.D2 = t[1][0].count > 5 ? 5 : t[1][0].count; }
        oo.Dobj = t[0][0];
        Tool.x1x2("D", oo.D1, oo.D2, this.d01, this, this.d04, oo)
    },
    ////////////////////////////////
    b01: function () {
        let time24H = Tool.gettime("") - 60 * 60 * 24
        //@.get_follower_time           获取粉丝时间
        return " where  @.get_follower_time<" + time24H
    },
    ////////////////////////////////////////
    d01: function (oo) {
        oo.Dobj.new_get_follower_time = Tool.gettime("")
        $("#shopid").html(oo.Dobj.shopid)
        $("#get_follower_time").html(Tool.js_date_time2(oo.Dobj.get_follower_time))
        $("#new_get_follower_time").html(Tool.js_date_time2(oo.Dobj.new_get_follower_time))
        Tool.get_follower_list.a01("E", oo.site, oo.siteNum, oo.Dobj.shopid, oo.Dobj.get_follower_time, oo.dbnameObj, this.d02, this, oo);
    },
    d02: function (dbnameObj, oo) {
        oo.dbnameObj = dbnameObj;
        //@.get_follower_time       获取粉丝时间
        let data = [{
            action: "sqlite",
            database: "shopee/采集箱/店铺/" + oo.siteNum,
            sql: "update @.table set @.get_follower_time=" + oo.Dobj.new_get_follower_time + " where @.shopid=" + oo.Dobj.shopid,
        }]
        $("#state").html("正在更新数据。。。")
        Tool.ajax.a01(data, this.d03, this, oo);
    },
    d03: function (t, oo) {
        oo.D1++; oo.Dobj = {};
        this.a03("", oo);
    },
    d04: function (oo) {
        Tool.common_following.a01(["F", "G", "H"], oo.dbnameObj, oo.siteNum, oo.site, oo.num, oo.seller, this.d05, this, oo);
    },
    d05: function (oo) {
        oo.next.apply(oo.This, [oo.t]);
    },
}