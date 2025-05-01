'use strict';
var fun =
{
    a01: function () {
        obj.params.jsFile = obj.params.jsFile ? obj.params.jsFile : ""//选择JS文件
        obj.params.page = obj.params.page ? parseInt(obj.params.page) : 1;//翻页  
        obj.params.field = obj.params.field ? obj.params.field : '1'//搜索字段
        obj.params.searchword = obj.params.searchword ? Tool.Trim(obj.params.searchword) : "";//搜索关键词
        obj.params.logisticsPhone = obj.params.logisticsPhone ? Tool.Trim(obj.params.logisticsPhone) : "";
        this.a02()
    },
    a02: function () {
        let data = [{
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/客优云/问题件",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/客优云/问题件.db"],
                database: "shopee/客优云/问题件",
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let where = "";
        if (obj.params.logisticsPhone) {
            where = " where @.logisticsPhone=" + obj.params.logisticsPhone
        }
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/问题件",
            sql: "select " + Tool.fieldAs("expressNum,gmtCreate,logisticsName,logisticsPhone,expressStatus,shelfCode,sellerId,sellerLogin,sellerPhone") + " FROM @.table" + where + " order by @.gmtCreate desc" + Tool.limit(20, obj.params.page, "sqlite"),
        }, {
            action: "sqlite",
            database: "shopee/客优云/问题件",
            sql: "select count(1) as Count FROM @.table" + where,
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (arr) {
        let tr = [], t = arr[0];
        for (let i = 0; i < t.length; i++) {
            tr.push('\
            <tr>\
                <td>'+ t[i].expressNum + '</td>\
                <td>'+ Tool.js_date_time2(t[i].gmtCreate, "-") + '</td>\
                <td>'+ t[i].logisticsName + '</td>\
                <td>'+ t[i].logisticsPhone + '</td>\
                <td>'+ (t[i].sellerId ? t[i].sellerId : "") + '</td>\
                <td>'+ (t[i].sellerPhone ? t[i].sellerPhone : "") + '</td>\
                <td>'+ (t[i].sellerLogin ? t[i].sellerLogin : "") + '</td>\
                <td>'+ (t[i].shelfCode ? t[i].shelfCode : '') + '</td>\
                <td>'+ this.b03(t[i].expressStatus) + '</td>\
           </tr>')
        }
        let html = Tool.header2(obj.params.jsFile) + '\
		<div class="p-2">\
			<table class="table align-top table-hover center">\
				<thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
			</table>\
            ' + Tool.page(arr[1][0].Count, 20, obj.params.page) + '\
		</div>'
        Tool.html(null, null, html)
    },
    /////////////////////////////////////
    b01: function () {
        let html = '\
        <tr>\
            <th style="position: relative;">'+ this.b02() + ' 快递单号</th>\
            <th>收件时间</th>\
            <th>物流商</th>\
            <th class="p-0">'+ this.b04("物流商电话", obj.params.logisticsPhone) + '</th>\
            <th>客优云ID</th>\
            <th>卖家联系方式</th>\
            <th>登陆账号</th>\
            <th>货架</th>\
            <th>状态</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'?jsFile=js09\');"><a class="dropdown-item pointer">*获取问题件</a></li>\
        </ul>'
    },
    b03: function (expressStatus) {
        let str = expressStatus
        if (expressStatus == "未录单") {
            str = '<font color=red>' + expressStatus + '</font>'
        }
        else if (expressStatus == "已录单") {
            str = '<font color=#ffd424>' + expressStatus + '</font>'
        }
        return str;
    },
    b04: function (name, logisticsPhone) {
        let optionArr = []
        let arr = [
            [17855895502, "富盛"],
            [13316513542, "全驰"],
            [15759526900, "今日达"],
            [18958412711, "丰景"],
            [17318018090, "河马"],
            [15000202881, "艾詹"],
            [18958412711, "速达"],
            [18588806280, "小7國際"],
        ]
        for (let i = 0; i < arr.length; i++) {
            optionArr.push('<option value="' + arr[i][0] + '"' + ("" + arr[i][0] == logisticsPhone ? 'selected="selected"' : '') + '>' + arr[i][0] + '.' + arr[i][1] + '</option>')
        }
        return '\
        <select onChange="Tool.open(\'logisticsPhone\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          '+ optionArr.join("") + '\
        </select>';
    },
}
fun.a01();