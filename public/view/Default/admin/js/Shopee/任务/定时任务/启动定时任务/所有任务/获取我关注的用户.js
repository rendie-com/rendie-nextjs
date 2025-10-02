'use strict';
var task = {
    obj:
    {
        D1: 1, D2: 100,
        E1: 1, E2: 1,
    },
    a01: function (seller, site, num, next, This, t) {
        let oo = {
            seller: seller,
            site: site,
            num: num,
            next: next,
            This: This,
            t: t,
            siteNum: Tool.siteNum(site, num),
        }
        $("#tbody").html('\
        <tr><td class="right">数据库进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
        <tr><td class="right">粉丝页进度：</td>'+ Tool.htmlProgress('E') + '</tr>')
        this.a02(oo);
    },
    a02: function (oo) {
        Tool.x1x2("D", this.obj.D1, this.obj.D2, this.a03, this, this.d01, oo)
    },
    a03: function (oo) {
        Tool.download_sqlite.a01(["shopee/采集箱/粉丝/" + oo.siteNum + "/" + (this.obj.D1.toString().padStart(3, '0'))], this.a04, this, oo)
    },
    a04: function (t, oo) {
        let data = [{
            action: "sqlite",
            database: "shopee/采集箱/粉丝/" + oo.siteNum + "/" + (this.obj.D1.toString().padStart(3, '0')),
            sql: "update @.table set @.is_my_following=0 where @.is_my_following=1",
        }]
        Tool.ajax.a01(data, this.a05, this, oo);
    },
    a05: function (t, oo) {
        this.obj.D1++;
        this.a02(oo);
    },
    ///////////////////////////////////////////////////////
    d01: function (oo) {
        Tool.x1x2("E", this.obj.E1, this.obj.E2, this.d02, this, this.e01, oo)
    },
    d02: function (oo) {
        //【我关注的】来源：https://my.xiapibuy.com/shop/896010703/following/?__classic__=1
        let url = "https://" + (oo.site == "tw" ? "xiapi" : oo.site) + ".xiapibuy.com/api/v4/pages/get_followee_list?limit=20&offset=" + ((this.obj.E1 - 1) * 20) + "&shopid=" + oo.seller[oo.site][oo.num - 1].shopId;
        $("#state").html("正在获取店铺的粉丝。。。" + url)
        gg.getFetch(url, "json", this.d03, this, oo)
    },
    d03: function (t, oo) {
        if (t.data) {
            if (!t.data.nomore) { this.obj.E2++; }
            if (t.data.accounts) {
                Tool.accounts.a01(t.data.accounts, {}, "@.is_my_following", oo.siteNum, this.d04, this, oo)
            }
            else {
                $("#state").html("店铺的粉丝隐藏了，跳过。。。")
                this.e01(oo)
            }
        }
        else {
            Tool.pre(["出错", t])
        }
    },
    d04: function (dbnameObj, oo) {
        this.obj.E1++;
        this.d01(oo)
    },
    ///////////////////////////////////
    e01: function (oo) {
        this.obj = {
            D1: 1, D2: 100,
            E1: 1, E2: 1,
        }
        $("#D1,#E1").css("width", "0%");
        $("#D1,#D2,#E1,#E2").html("");
        oo.next.apply(oo.This, [oo.t])
    },
}