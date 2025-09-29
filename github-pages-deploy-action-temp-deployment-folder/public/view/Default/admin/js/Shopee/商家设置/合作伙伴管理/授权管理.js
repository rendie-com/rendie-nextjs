'use strict';
var fun =
{
    a01: function () {
        //o.params.jsFile         选择JS文件
        //o.params.return         返回
        //o.params.partner_id     
        this.a02();
    },
    a02: function () {
        let data = this.b02(o.DEFAULT_DB);
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let app_list = JSON.parse(t[0][0].app_list);
        let shop_list = [], info = {};
        for (let i = 0; i < app_list.length; i++) {
            if ("" + app_list[i].partner_id == o.params.partner_id) {
                shop_list = app_list[i].shop_list;
                info = app_list[i].info
                break;
            }
        }
        this.a05(shop_list, info);
    },
    a05: function (shop_list, info) {
        let tbody = [], countArr = [];
        for (let i = 0; i < shop_list.length; i++) {
            let tr = []
            for (let j = 0; j < shop_list[i].length; j++) {
                tr.push('\
                <tr>\
                    <td>'+ shop_list[i][j].shop_id + '</td>\
                    <td>'+ shop_list[i][j].region + '</td>\
                    <td>'+ shop_list[i][j].shop_name + '</td>\
                    <td>'+ shop_list[i][j].status + '</td>\
                    <td>'+ Tool.js_date_time2(shop_list[i][j].mtime) + '</td>\
                    <td>'+ Tool.js_date_time2(shop_list[i][j].expire_time) + '</td>\
                    <td>'+ shop_list[i][j].is_active + '</td>\
                </tr>');
            }
            tbody.push('<tbody id="status' + i + '" ' + (i != 0 ? 'class="hide"' : '') + '>' + tr.join("") + '</tbody>');
            countArr.push(tr.length)
        }       
        let html = Tool.header(o.params.return, "Shopee &gt; 商家设置 &gt; 合作伙伴管理 &gt; 授权管理") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle center">\
                <thead class="table-light">\
                    <tr>\
                        <th>应用</th>\
                        <th>公司名称</th>\
                        <th>开发者名称</th>\
                        <th>商家账户名称</th>\
                        <th>状态</th>\
                        <th>授权时间</th>\
                        <th>截止日期</th>\
                        <th>is_active</th>\
                    </tr>\
                </thead>\
                <tbody>\
                    <tr>\
                        <td>'+ info.partner_info.name + '</td>\
                        <td>'+ info.partner_info.company + '</td>\
                        <td>'+ info.partner_info.developer_name + '</td>\
                        <td>'+ info.merchant_info.name + '</td>\
                        <td>'+ this.b04(info.merchant_info.status) + '</td>\
                        <td>'+ Tool.js_date_time2(info.merchant_info.mtime) + '</td>\
                        <td>'+ Tool.js_date_time2(info.merchant_info.expire_time) + '</td>\
                        <td>'+ info.merchant_info.is_active + '</td>\
                    </tr>\
                </tbody>\
            </table>\
            <ul class="makeHtmlTab">\
                <li class="hover" onclick="fun.c01($(this),0)">使用 ('+ countArr[0] + ')</li>\
                <li onclick="fun.c01($(this),3)">冻结 ('+ countArr[3] + ')</li>\
                <li onclick="fun.c01($(this),2)">已过期 ('+ countArr[2] + ')</li>\
                <li onclick="fun.c01($(this),1)">取消连接 ('+ countArr[1] + ')</li>\
            </ul>\
            <table class="table table-hover align-middle center">\
                <thead class="table-light">'+ this.b01() + '</thead>\
                '+ tbody.join("") + '\
            </table>\
        </div>'
        Tool.html(null, null, html);
    },
    //////////////////////////////////////
    b01: function () {
        let str = '\
        <tr>\
            <th>shop_id</th>\
            <th>region</th>\
            <th>shop_name</th>\
            <th>status</th>\
            <th>mtime</th>\
            <th>expire_time</th>\
            <th>is_active</th>\
        </tr>'
        return str;
    },
    b02: function (DEFAULT_DB) {
        let data = []
        if (DEFAULT_DB == "dynamodb") {
            data = this.b03(DEFAULT_DB);
        }
        else {
            data = [{
                action: DEFAULT_DB,
                database: "shopee/卖家账户",
                sql: "select " + Tool.fieldAs("app_list") + " FROM @.table where @.isDefault=1 limit 1"
            }]
        }
        return data
    },
    b03: function (DEFAULT_DB) {
        let params = {
            ProjectionExpression: 'app_list',//只获取这些字段
            Limit: 1, // 每页项目数上限
            TableName: Tool.getChinaAscii('shopee_卖家账户_table'),
        }
        let data = [{
            action: DEFAULT_DB,
            fun: "scan",
            params: params,
        }]
        return data;
    },
    b04: function (status) {
        let str = '';
        if (status == 1) {
            str = '已取消连接';
        }
        else {
            str = '授权中';
        }
        return str;
    },
    //////////////////////////////////////
    c01: function (This, status) {
        $(".makeHtmlTab li").removeAttr('class');
        This.attr("class", "hover");
        $("#status0,#status1,#status2,#status3").hide()
        $("#status" + status).show();
    },
}
fun.a01();