'use strict';
var fun =
{
    a01: function () {
        o.params.page = o.params.page ? Tool.int(o.params.page) : 1
        let path = "admin/js/系统/分类配置信息/"
        switch (o.params.jsFile) {
            case "js01": Tool.scriptArr(["admin/js/menuList.js", path + '修改.js']); break;
            default: this.a02();
        }
    },
    a02: function () {
        let where = ""
        let data = [{
            action: o.DEFAULT_DB,
            database: "main",
            sql: "select " + Tool.fieldAs("id,name") + " FROM @.config" + where + Tool.limit(20, o.params.page),
        }, {
            action: o.DEFAULT_DB,
            database: "main",
            sql: "select count(1) as count FROM @.config " + where,
        },]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let tbody = "";
        for (let i = 0; i < t[0].length; i++) {
            tbody += '\
            <tr>\
                <td style="padding-left: 30px;position: relative;">\
                <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
                <ul class="dropdown-menu">\
                    <li onClick="Tool.openR(\'jsFile=js01&id='+ t[0][i].id + '\')"><a class="dropdown-item pointer">修改</a></li>\
                    <li onClick="fun.c02('+ t[0][i].id + ')"><a class="dropdown-item pointer">删除</a></li>\
                </ul>' + t[0][i].id + '\
                </td>\
                <td>' + t[0][i].name + '</td>\
            </tr>';
        }
        let html = '\
        <header class="panel-heading">分类配置信息</header>\
        <div class="p-2">\
        <table class="table table-hover align-middle">\
            <thead class="table-light">\
                <tr>\
                    <th class="w70" style="padding-left: 30px;position: relative;">\
                        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false" id="dropdown0"><div></div><div></div><div></div></button>\
                        <ul class="dropdown-menu" aria-labelledby="dropdown0">\
                            <li><a class="dropdown-item pointer" onClick="fun.c01()">添加</a></li>\
                        </ul>ID\
                    </th>\
                    <th>分类名称</th>\
                </tr>\
            </thead>\
            <tbody>'+ tbody + '</tbody>\
        </table>' + Tool.page(t[1][0].count, 20, o.params.page) + '\
        </div>'
        Tool.html(null, null, html)
    },
    /////////////////////////////////////////////
    c01: function () {
        let data = [{
            action: o.DEFAULT_DB,
            database: "main",
            sql: "insert into @.config(@.name)values(null)",
        }]
        Tool.ajax.a01(data, Tool.reload)
    },
    c02: function (id) {
        if (confirm('确定要删除吗？')) {
            let data = [{
                action: o.DEFAULT_DB,
                database: "main",
                sql: "delete from @.config where @.id=" + id,
            }]
            Tool.ajax.a01(data, Tool.reload);
        }
    },
}
fun.a01()