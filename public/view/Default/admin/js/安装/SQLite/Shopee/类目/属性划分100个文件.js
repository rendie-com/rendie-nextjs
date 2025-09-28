'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "shopee类目属性表",
        database: "shopee/类目/属性/${100}",
        action: "sqlite",
        //"sql": [
        //  "create index pk_cateId ON @.table(@.cateId)"
        //],
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "cateId",
                type: "varchar(20)",
                default: "0",
                des: "叶子类目ID"
            },
            {
                name: "json",
                type: "text",
                default: "",
                des: "json代码"
            }
        ]
    }
]);