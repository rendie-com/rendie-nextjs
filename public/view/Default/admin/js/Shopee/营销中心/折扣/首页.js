'use strict';
var fun =
{
    a01: function () {
        //o.params.jsFile        选择JS文件
        o.params.site = o.params.site ? o.params.site : "sg";//站点
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页
        o.params.field = o.params.field ? o.params.field : "1";//搜索字段
        o.params.searchword = o.params.searchword ? o.params.searchword : "";//搜索关键词
        o.params.self_status = o.params.self_status ? o.params.self_status : "";//状态
        o.params.num = o.params.num ? o.params.num : "1"//该站点的第几个店
        this.a02();
    },
    a02: function () {
        let siteNum = Tool.siteNum(o.params.site, o.params.num);
        Tool.download_sqlite.a01(["shopee/营销中心/折扣/" + siteNum], this.a03, this, siteNum)
    },
    a03: function (t, siteNum) {
        let where = this.b03()
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/折扣/" + siteNum,
            sql: "select count(1) as total FROM @.table" + where,
        }, {
            action: "sqlite",
            database: "shopee/营销中心/折扣/" + siteNum,
            sql: "select " + Tool.fieldAs("title,self_status,images,start_time,end_time") + " FROM @.table" + where + " order by @.start_time desc " + Tool.limit(10, o.params.page),
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
                <td>'+ arr[i].title + '</td>\
                <td>'+ this.b08(arr[i].images) + '</td>\
                <td class="center">'+ this.b07(arr[i].self_status) + '</td>\
                <td class="p-0">'+ this.b05(arr[i].start_time, arr[i].end_time) + '</td>\
           </tr>'
        }
        let html = Tool.header(o.params.jsFile, o.params.site) + '\
        <div class="p-2">\
           <div style="top:6px;position:relative;">'+ this.b09() + '</div>\
           '+ Tool.tab(o.params.jsFile, o.params.site, siteArr, o.params.num) + this.b06() + '\
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
            <th style="padding-left: 30px;position: relative;">'+ this.b02() + '促销名称</th>\
            <th>商品</th>\
            <th class="p-0 w160">\
                <select onChange="Tool.open(\'self_status\',this.options[this.selectedIndex].value)" class="form-select">\
                    <option value="">状态</option>\
                    <option value="1" '+ (o.params.self_status == "1" ? 'selected="selected"' : '') + '>1.接下来的活动</option>\
                    <option value="2" '+ (o.params.self_status == "2" ? 'selected="selected"' : '') + '>2.进行中的活动</option>\
                    <option value="3" '+ (o.params.self_status == "3" ? 'selected="selected"' : '') + '>3.已过期</option>\
                </select>\
            </th>\
            <th class="w160 center">时间</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=02&site=' + o.params.site + "&num=" + o.params.num + '\');"><a class="dropdown-item pointer">*创建【折扣】活动</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + "&num=" + o.params.num + '&day=all\');"><a class="dropdown-item pointer">*获取【折扣】信息（所有）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + "&num=" + o.params.num + '&day=3\');"><a class="dropdown-item pointer">*获取【折扣】信息（近3天）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + "&num=" + o.params.num + '&day=30\');"><a class="dropdown-item pointer">*获取【折扣】信息（近30天）</a></li>\
        </ul>'
    },
    b03: function () {
        let arr = [];
        if (o.params.searchword) {
            switch (o.params.field) {
                case "1": arr.push("@.title like '%" + o.params.searchword + "%'"); break;//优惠券名
            }
        }
        if (o.params.self_status) { arr.push("@.self_status=" + o.params.self_status); }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    b04: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "促销名称"; break;
            default: name = "未知：" + val;
        }
        return name
    },
    b05: function (start_time, end_time) {
        return '\
        <table class="table mb-0">\
            <tr><td title="优惠券领取开始时间">'+ Tool.js_date_time2(start_time) + '</td></tr>\
            <tr><td title="优惠券领取结束时间" class="border-bottom-0">'+ Tool.js_date_time2(end_time) + '</td></tr>\
        </table>'
    },
    b06: function () {
        return '\
        <div class="input-group w-50 m-2">\
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ o.params.field + '">' + this.b04(o.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">促销名称</li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ Tool.Trim(o.params.searchword) + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
    },
    b07: function (self_status) {
        let str = ""
        if (self_status == 1) {
            str = this.b10("*删除", "03", self_status) + '<span class="p-1" style="color:#ee4d2d;background-color:#fff1f0;">接下来的活动</span>'
        }
        else if (self_status == 2) {
            str = this.b10("*结束", "04", self_status) + '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">进行中的活动</span>'
        }
        else if (self_status == 3) {
            str = '<span class="p-1" style="color: #666;background-color:#eee;">已过期</span>'
        }
        else {
            str = "未知：" + self_status;
        }
        return str;
    },
    b08: function (t) {
        let html = "", arr = JSON.parse(t)
        if (arr.length == 0) { html = "还没有商品"; }
        else {
            for (let i = 0; i < arr.length; i++) {
                html += "\
                <a href=\"https://s-cf-sg.shopeesz.com/file/" + arr[i] + "\" target=\"_blank\">\
                    <img src=\"https://s-cf-sg.shopeesz.com/file/"+ arr[i] + "_tn\" class=\"img-fluid rounded w100\">\
                </a>"
            }
        }
        return html;
    },
    b09: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=02\');"><a class="dropdown-item pointer">*创建【折扣】活动</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=all\');"><a class="dropdown-item pointer">*获取【折扣】信息（所有）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=3\');"><a class="dropdown-item pointer">*获取【折扣】信息（近3天）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=30\');"><a class="dropdown-item pointer">*获取【折扣】信息（近30天）</a></li>\
        </ul>'
    },
    b10: function (name, jsFile2, self_status) {
        return '\
        <div style="position: relative;top: -8px;left: 0px;">\
            <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
            <ul class="dropdown-menu">\
                <li onclick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=' + jsFile2 + '&site=' + o.params.site + '&num=' + o.params.num + '&self_status=' + self_status + '\')"><a class="dropdown-item pointer">' + name + '</a></li>\
            </ul>\
        </div>'
    },
    /////////////////////////////////////////////////
    c01: function (val) {
        let name = this.b04("" + val);
        $("#field").html(name).val(val);
    },
    c02: function () {
        let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
        if (searchword) {
            Tool.main("jsFile=" + o.params.jsFile + "&site=" + o.params.site + "&num=" + o.params.num + "&page=1&field=" + field + "&searchword=" + searchword);
        } else { alert("请输入搜索内容"); }
    },
}
fun.a01();