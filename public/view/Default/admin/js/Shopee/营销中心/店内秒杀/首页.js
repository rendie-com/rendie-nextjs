'use strict';
var fun =
{
    a01: function () {
        //o.params.jsFile        选择JS文件
        o.params.site = o.params.site ? o.params.site : "sg";//站点
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页
        o.params.status = o.params.status ? o.params.status : "";//状态
        o.params.num = o.params.num ? o.params.num : "1"//该站点的第几个店
        this.a02();
    },
    a02: function () {
        let siteNum = Tool.siteNum(o.params.site, o.params.num);
        Tool.download_sqlite.a01(["shopee/营销中心/店内秒杀/" + siteNum], this.a03, this, siteNum)
    },
    a03: function (t, siteNum) {
        let where = this.b03();
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/店内秒杀/" + siteNum,
            sql: "select count(1) as total FROM @.table" + where,
        }, {
            action: "sqlite",
            database: "shopee/营销中心/店内秒杀/" + siteNum,
            sql: "select " + Tool.fieldAs("type,item_count,status,start_time,end_time,addtime,uptime") + " FROM @.table" + where + " order by @.addtime desc " + Tool.limit(10, o.params.page),
        }, {
            action: o.DEFAULT_DB,
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let siteArr = JSON.parse(t[2][0].config)[o.params.site]
        let html1 = "", arr = t[1]
        for (let i = 0; i < arr.length; i++) {
            html1 += '\
            <tr>\
                <td class="p-0">'+ this.b05(arr[i].start_time, arr[i].end_time) + '</td>\
                <td class="left">为限时选购开启：'+ arr[i].item_count + '<br/><font color="#999">剩余限额： ' + this.b08(arr[i].item_count) + '</font></td>\
                <td class="center">'+ this.b07(arr[i].type) + '</td>\
                <td>'+ this.b04(arr[i].status) + '</td>\
                <td class="p-0">'+ this.b06(arr[i].addtime, arr[i].uptime) + '</td>\
           </tr>'
        }
        let html = Tool.header(o.params.jsFile, o.params.site) + '\
        <div class="p-2">\
            <div style="top:6px;position:relative;">'+ this.b09() + '</div>\
            '+ Tool.tab(o.params.jsFile, o.params.site, siteArr, o.params.num) + '\
            <table class="table align-middle table-hover center">\
                    <thead class="table-light">'+ this.b01() + '</thead>\
                    <tbody>'+ html1 + '</tbody>\
                </table>' + Tool.page(t[0][0].total, 10, o.params.page) + '\
        </div>'
        Tool.html(null, null, html);
    },
    //////////////////////////////////////
    b01: function () {
        let html = '\
        <tr>\
            <th class="w160 center" style="padding-left: 30px;position: relative;">'+ this.b02() + '活动开始/结束时间</th>\
            <th class="left">商品</th>\
            <th class="p-0 w160">\
                <select onChange="Tool.open(\'status\',this.options[this.selectedIndex].value)" class="form-select">\
                    <option value="">状态</option>\
                    <option value="1" '+ (o.params.status == "1" ? 'selected="selected"' : '') + '>接下来的活动</option>\
                    <option value="2" '+ (o.params.status == "2" ? 'selected="selected"' : '') + '>进行中的活动</option>\
                    <option value="3" '+ (o.params.status == "3" ? 'selected="selected"' : '') + '>已过期</option>\
                </select>\
            </th>\
            <th>开启/关闭</th>\
            <th class="w160 center">添加/更新时间</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + '&num=' + o.params.num + '&day=all\');"><a class="dropdown-item pointer">*获取【店内秒杀】信息（所有）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + '&num=' + o.params.num + '&day=3\');"><a class="dropdown-item pointer">*获取【店内秒杀】信息（近3天）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + '&num=' + o.params.num + '&day=30\');"><a class="dropdown-item pointer">*获取【店内秒杀】信息（近30天）</a></li>\
        </ul>'
    },
    b03: function () {
        let arr = [];
        if (o.params.status) { arr.push("@.type=" + o.params.status); }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    b04: function (val) {
        let str = "未知:" + val
        if (val == 1) {
            str = "开启"
        }
        else if (val == 2) {
            str = "<font color=red>关闭</font>"
        }
        else if (val == 3) {
            str = "不符合条件"
        }
        return str;
    },
    b05: function (start_time, end_time) {
        return '\
        <table class="table mb-0">\
            <tr><td title="活动开始时间">'+ Tool.js_date_time2(start_time, "-") + '</td></tr>\
            <tr><td title="活动结束时间">'+ Tool.js_date_time2(end_time, "-") + '</td></tr>\
        </table>'
    },
    b06: function (addtime, uptime) {
        return '\
        <table class="table mb-0">\
            <tr><td title="添加时间">'+ Tool.js_date_time2(addtime) + '</td></tr>\
            <tr><td title="更新时间">'+ Tool.js_date_time2(uptime) + '</td></tr>\
        </table>'
    },
    b07: function (type) {
        let str = ""
        if (type == 1) {
            str = '\
            <div style="position: relative;top: -8px;left: 0px;">\
                <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
                <ul class="dropdown-menu">\
                    <li onclick="Tool.openR(\'jsFile=js12&site='+ o.params.site + '&num=' + o.params.num + '&type=' + type + '\')"  title="为什么要删除？答：不删除，商品就不能下架。"><a class="dropdown-item pointer">*删除</a></li>\
                </ul>\
            </div>\
            <span class="p-1" style="color:#ee4d2d;background-color:#fff1f0;">接下来的活动</span>'
        }
        else if (type == 2) {
            str = '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">进行中的活动</span>'
        }
        else if (type == 3) {
            str = '<span class="p-1" style="color: #666;background-color:#eee;">已过期</span>'
        }
        else {
            str = "未知：" + type
        }
        return str;
    },
    b08: function (val) {
        if (o.params.site == "my" || o.params.site == "th") {
            return 10 - val;
        } else if (o.params.site == "br" || o.params.site == "sg" || o.params.site == "tw") {
            return 20 - val;
        } else if (o.params.site == "mx" || o.params.site == "co") {
            return 50 - val;
        } else if (o.params.site == "cl") {
            return 5 - val;
        }
    },
    b09: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=all\');"><a class="dropdown-item pointer">*获取【店内秒杀】信息（所有）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=3\');"><a class="dropdown-item pointer">*获取【店内秒杀】信息（近3天）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=30\');"><a class="dropdown-item pointer">*获取【店内秒杀】信息（近30天）</a></li>\
        </ul>'
    },
}
fun.a01();