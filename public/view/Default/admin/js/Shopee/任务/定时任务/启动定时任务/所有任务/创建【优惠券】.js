'use strict';
var task = {
    obj:
    {
        C1: 1, C2: 8,// 活动进度
        start_time: 0,
        end_time: 0,
    },
    a01: function (seller, site, next, This, t) {
        let oo = {
            seller: seller,
            site: site,
            next: next,
            This: This,
            t: t
        }
        $("#tbody").html('\
        <tr><td class="right">活动进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
        <tr><td class="right">活动开始时间：</td><td id="timeA" colspan="2"></td></tr>\
        <tr><td class="right">活动结束时间：</td><td id="timeB" colspan="2"></td></tr>');
        this.a02(oo);
    },
    a02: function (oo) {
        Tool.x1x2("C", this.obj.C1, this.obj.C2, this.a03, this, null, oo);
    },
    a03: function (oo) {
        this.obj.start_time = config[oo.site].coupon_time[this.obj.C1 - 1]
        if (this.obj.start_time < Tool.gettime("")) {
            this.obj.start_time = Tool.gettime(Tool.userDate13(Date.now())) + 60 * 60 * 24 * 2
        }
        $("#timeA").html(Tool.js_date_time2(this.obj.start_time))
        ////////////////////////////////////////////
        if (this.b02(this.obj.start_time)) {
            this.a04(oo);
        }
        else {
            $("#state").html("活动不在30天以内，程序已终止。")
            this.g02(["写入成功"], oo);
        }
    },
    a04: function (oo) {
        if (this.obj.C1 == 6) {//关注礼优惠券
            this.obj.end_time = this.obj.start_time + 60 * 60 * 24 * 30 - 1;
            $("#timeB").html(Tool.js_date_time2(this.obj.end_time) + "（30天）")
            this.f01()
        }
        else {
            this.obj.end_time = this.obj.start_time + 60 * 60 * 24 * 3 - 1;
            $("#timeB").html(Tool.js_date_time2(this.obj.end_time) + "（3天）")
            this.d01()
        }
    },
    ////////////////////////////////////////////////
    b02: function (time) {
        let isbool = false, newTime = Tool.gettime(Tool.userDate13(Date.now())) + 60 * 60 * 24;//因为每个活动都是从00:0:00到23:59:59
        if (time < newTime) {
            time = newTime; isbool = true;
        }
        else if (time <= newTime + 60 * 60 * 24 * 3)//3天
        {
            isbool = true;
        }
        return isbool;
    },
    ///////////////////////////////////////////////
    g02: function (t, oo) {
        if (t[0] == "写入成功") {
            $("#state").html("更新活动时间成功。")
            this.obj.C1++;
            this.a02(oo);
        }
        else { Tool.pre(["出错", t]); }
    }
}