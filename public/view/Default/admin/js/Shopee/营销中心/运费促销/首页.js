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
        Tool.download_sqlite.a01(["shopee/营销中心/运费促销/" + siteNum], this.a03, this, siteNum)
    },
    a03: function (t, siteNum) {
        let where = this.b03();
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/运费促销/" + siteNum,
            sql: "select count(1) as total FROM @.table" + where,
        }, {
            action: "sqlite",
            database: "shopee/营销中心/运费促销/" + siteNum,
            sql: "select " + Tool.fieldAs("start_time,end_time,status,seller_budget,promotion_name,channel_ids,tiers") + " FROM @.table" + where + " order by @.start_time desc " + Tool.limit(10, o.params.page),
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
                <td>'+ arr[i].promotion_name + '</td>\
                <td>'+ this.b07(arr[i].channel_ids) + '</td>\
                <td>'+ this.b10(arr[i].tiers) + '</td>\
                <td>'+ this.b08(arr[i].seller_budget) + '</td>\
                <td class="center">'+ this.b04(arr[i].status) + '</td>\
                <td class="p-0">'+ this.b05(arr[i].start_time, arr[i].end_time) + '</td>\
           </tr>'
        }
        let html = Tool.header(o.params.jsFile, o.params.site) + '\
        <div class="p-2">\
            <div style="top:6px;position:relative;">'+ this.b06() + '</div>'
            + Tool.tab(o.params.jsFile, o.params.site, siteArr, o.params.num) + '\
            <table class="table align-middle table-hover">\
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
            <th style="padding-left: 30px;position: relative;">'+ this.b02() + '活动名称</th>\
            <th>物流渠道</th>\
            <th>运费</th>\
            <th class="w150">预算</th>\
            <th class="p-0 w160">\
                <select onChange="Tool.open(\'status\',this.options[this.selectedIndex].value)" class="form-select">\
                    <option value="">状态</option>\
                    <option value="1" '+ (o.params.status == "1" ? 'selected="selected"' : '') + '>接下来的活动</option>\
                    <option value="2" '+ (o.params.status == "2" ? 'selected="selected"' : '') + '>进行中的活动</option>\
                    <option value="3" '+ (o.params.status == "3" ? 'selected="selected"' : '') + '>已过期</option>\
                </select>\
            </th>\
            <th class="w150">活动期间</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + '&num=' + o.params.num + '&day=all\');"><a class="dropdown-item pointer">*获取【运费促销】信息（所有）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + '&num=' + o.params.num + '&day=3\');"><a class="dropdown-item pointer">*获取【运费促销】信息（近3天）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + '&num=' + o.params.num + '&day=30\');"><a class="dropdown-item pointer">*获取【运费促销】信息（近30天）</a></li>\
        </ul>'
    },
    b03: function () {
        let arr = [];
        if (o.params.status) { arr.push("@.status=" + o.params.status); }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    b04: function (status) {
        let str = "";
        if (status == 2) {
            str = '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">进行中的活动</span>'
        }
        else if (status == 3) {
            str = '<span class="p-1" style="color: #666;background-color:#eee;">已过期</span>'
        }
        else {
            str = "未知：" + status
        }
        return str;
    },
    b05: function (start_time, end_time) {
        return '\
        <table class="table m-0">\
            <tr><td title="活动开始时间">'+ Tool.js_date_time2(start_time, "-") + '</td></tr>\
            <tr><td title="活动结束时间" class="border-bottom-0">'+ Tool.js_date_time2(end_time, "-") + '</td></tr>\
        </table>'
    },
    b06: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=all\');"><a class="dropdown-item pointer">*获取【运费促销】信息（所有）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=3\');"><a class="dropdown-item pointer">*获取【运费促销】信息（近3天）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=30\');"><a class="dropdown-item pointer">*获取【运费促销】信息（近30天）</a></li>\
        </ul>'
    },
    b07: function (channel_ids) {
        let arr = JSON.parse(channel_ids), nArr = [];
        for (let i = 0; i < arr.length; i++) {
            nArr.push(this.b09(arr[i]))
        }
        return nArr.join("<hr/>");
    },
    b08: function (seller_budget) {
        let oo = JSON.parse(seller_budget), arr = [];
        if (oo.is_limited_budget) {
            arr = ["总共： RM" + (oo.total_budget / 100000).toFixed(2), "已用： RM" + oo.used_budget, "剩余： RM" + oo.used_budget_since]
        }
        else {
            arr = ["总共： 无限", "已用： RM" + oo.used_budget]
        }
        return arr.join("<hr/>")
    },
    b09: function (id) {
        let str = ""
        switch (id) {
            case 28059: str = "Express Delivery (International) (快速渠道)"; break;
            case 28056: str = "Self Collection Point (SPX Express)"; break;
            case 28052: str = "<font style=\"color:#999\">Doorstep Delivery (International Sea Shipping) (海运经济渠道)</font>"; break;
            case 28016: str = "Standard Doorstep Delivery (International) (标准渠道)"; break;
            default: str = "<font color=red>未知物流渠道：" + id + "</font>"; break;
        }
        return str;
    },
    b10: function (tiers) {
        let arr = JSON.parse(tiers), str = "";
        if (arr[0].discount_type == 1) {
            str = "购买 RM" + (arr[0].min_order_total / 100000).toFixed(2) + ", 运费减免RM" + (arr[0].discount_delta / 100000).toFixed(2)
        }
        else if (arr[0].discount_type == 2) {
            str = "购买 RM" + (arr[0].min_order_total / 100000).toFixed(2) + ", 免运费";
        }
        else {
            str = "未知类型"
        }
        return str;
    },
}
fun.a01();