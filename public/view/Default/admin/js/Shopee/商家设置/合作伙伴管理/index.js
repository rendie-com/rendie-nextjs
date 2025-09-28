'use strict';
var fun =
{
    a01: function () {
        //o.params.jsFile         选择JS文件
        this.a02();
    },
    a02: function () {   
        let data = this.b02(o.DEFAULT_DB);
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let app_list = JSON.parse(t[0][0].app_list);
        let tr = [];
        for (let i = 0; i < app_list.length; i++) {
            tr.push('\
            <tr>\
                <td style="padding-left: 30px;position: relative;">\
                    <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false" id="dropdown0"><div></div><div></div><div></div></button>\
                    <ul class="dropdown-menu" aria-labelledby="dropdown0">\
                        <li><a class="dropdown-item pointer" onclick="Tool.openR(\'jsFile=js07&partner_id='+ app_list[i].partner_id + '\');">授权管理</a></li>\
                        <li><a class="dropdown-item pointer" onclick="Tool.openR(\'jsFile=js04&partner_id='+ app_list[i].partner_id + '\');">*取消连接</a></li>\
                    </ul>'+ app_list[i].partner_id + '\
                </td>\
                <td>'+ app_list[i].name + '</td>\
                <td>'+ app_list[i].company + '</td>\
                <td>'+ app_list[i].developer_name + '</td>\
                <td>'+ app_list[i].app_id + '</td>\
                <td>'+ app_list[i].is_active + '</td>\
                <td>'+ app_list[i].shop_count + '</td>\
            </tr>');
        }
        let html = Tool.header2(o.params.jsFile) + '\
        <div class="p-2">\
            <table class="table table-hover align-middle center">\
                <thead class="table-light">'+ this.b01() + '</thead>\
                <tbody>'+ tr.join("") + '</tbody>\
            </table>\
        </div>';
        Tool.html(null, null, html);
    },
    //////////////////////////////////////
    b01: function () {
        let str = '\
        <tr>\
            <th class="w100" style="padding-left: 30px;position: relative;">\
                <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false" id="dropdown0"><div></div><div></div><div></div></button>\
                <ul class="dropdown-menu" aria-labelledby="dropdown0">\
                    <li><a class="dropdown-item pointer" onClick="Tool.openR(\'jsFile=js06\');">*获取店铺授权信息</a></li>\
                </ul>partner_id\
            </th>\
            <th>name</th>\
            <th>company</th>\
            <th>developer_name</th>\
            <th>app_id</th>\
            <th>is_active</th>\
            <th>授权中</th>\
        </tr>'
        return str
    },
    b02: function (DEFAULT_DB) {
        let data = []
        if (DEFAULT_DB == "dynamodb") {
            data = this.b03(DEFAULT_DB)
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
}
fun.a01();