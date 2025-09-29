var fun =
{
    obj: { A1: 1, A2: 0 },
    a01: function () {
        //o.params.return     返回URL
        //o.params.table      表名
        //o.params.database   数据库名
        //o.params.toaction   同步到哪个数据库（如：pg01）
        gg.isRD(this.a02, this)
    },
    a02: function () {
        let html = Tool.header(o.params.return, "Shopee &gt; 定时任务 &gt; 更多 &gt; 把【sqlite】数据库该表同步到新的数据库") + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
 		        <tr><td class="right w150">数据库名：</td><td colspan="2">'+ o.params.database + '</td></tr>\
 		        <tr><td class="right">同步表名：</td><td colspan="2">'+ o.params.table + '</td></tr>\
                <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
            </tbody>\
            </table>\
        </div>'
        Tool.html(this.a03, this, html);
    },
    a03: function () {
        $("#state").html("正在获取商品信息。。。");
        let data = [{
            action: "sqlite",
            database: o.params.database,
            sql: "select * FROM @." + o.params.table + " order by @.id asc" + Tool.limit(10, this.obj.A1, "sqlite"),
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: o.params.database,
                sql: "select count(1) as total FROM @." + o.params.table,
            })
        }
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = Math.ceil(t[1][0].total / 10) }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d01, this, null, t[0]);
    },
    //////////////////////////////////////////
    b01: function (oo) {
        let arr = []
        for (let k in oo) {
            arr.push(k);
        }
        return arr;
    },
    b02: function (oo) {
        let arr = []
        for (let k in oo) {
            if (arr.length == 0) {
                arr.push(oo[k]);
            }
            else {
                arr.push(Tool.rpsql(oo[k]));
            }
        }
        return arr;
    },
    b03: function (arrL, arrR) {
        let arr = []
        for (let i = 0; i < arrL.length; i++) {
            arr.push(arrL[i] + "=" + arrR[i]);
        };
        return arr;
    },
    /////////////////////////////////////////
    d01: function (arr) {
        let data = [], arrL = this.b01(arr[0]);
        for (let i = 0; i < arr.length; i++) {
            let arrR = this.b02(arr[i]);
            data.push({
                action: o.params.toaction,
                database: o.params.database,
                sql: "select @.id as id FROM @." + o.params.table + " where @.id=" + arrR[0],//说明：为什么是“arrL[0]”?答：因为第一个一定是ID字段。
                list: [{
                    action: o.params.toaction,
                    database: o.params.database,
                    sql: "update @." + o.params.table + " set " + this.b03(arrL, arrR).join(",") + " where @.id=" + arrR[0],
                }],
                elselist: [{
                    action: o.params.toaction,
                    database: o.params.database,
                    sql: "insert into @." + o.params.table + "(" + arrL.join(",") + ")values(" + arrR.join(",") + ")",
                }]
            })
        }
        Tool.ajax.a01(data, this.d02, this);
    },
    d02: function (t) {
        this.obj.A1++
        this.a03()
    },
}
fun.a01();
// b04: function (oo, database, table, tableObj) {
//     let Item = {}, name, pre, TableName = Tool.getChinaAscii(database.replace(/\//g, "_")) + '_' + table
//     for (let k in oo) {
//         if (oo[k] != null) {
//             if (!pre) { pre = k.split("_")[0] }
//             name = k.substring(k.indexOf("_") + 1, k.length)
//             Item[name] = {}
//             Item[name][tableObj[name]] = "" + oo[k];
//         }
//     }
//     ////////////////////////////////////////////////////////
//     let data = {
//         action: "dynamodb",
//         fun: "getItem",//查询
//         params: {
//             TableName: TableName,
//             ProjectionExpression: 'id', // 只获取这些字段
//             Key: { 'id': Item["id"] }
//         },
//         list: this.b06(TableName, Item),
//         elselist: [{
//             action: "dynamodb",
//             fun: "putItem",//插入
//             params: {
//                 TableName: TableName,
//                 Item: Item
//             }
//         }]
//     }
//     return data
// },
// //获取字段类型
// b05: function (mssql, database, table) {
//     let tableObj = {}
//     for (let i = 0; i < mssql.length; i++) {
//         if (mssql[i].name == table && mssql[i].database == database) {
//             for (let j = 0; j < mssql[i].table.length; j++) {
//                 tableObj[mssql[i].table[j].name] = mssql[i].table[j].type
//             }
//             break;
//         }
//     }
//     return tableObj;
// },
// b06: function (TableName, Item) {
//     let UpdateExpression = [], id, ExpressionAttributeNames = {}, ExpressionAttributeValues = {}
//     for (let k in Item) {
//         if (k == "id") {
//             id = Item[k];
//         }
//         else {
//             UpdateExpression.push("#" + k + "=:" + k);
//             ExpressionAttributeNames["#" + k] = k;
//             ExpressionAttributeValues[":" + k] = Item[k];
//         }
//     }
//     let data = [{
//         action: "dynamodb",
//         fun: "updateItem",//更新
//         params: {
//             TableName: TableName,
//             Key: { 'id': id },
//             UpdateExpression: 'SET ' + UpdateExpression.join(","),
//             ExpressionAttributeNames: ExpressionAttributeNames,
//             ExpressionAttributeValues: ExpressionAttributeValues
//         }
//     }]
//     return data;
// },
//////////////////////////////////////////////
// d01: function (arr) {
//     if (o.params.toaction == "dynamodb") {
//         this.d02(arr)
//     }
//     else {
//         this.e01(arr);
//     }
// },
// d02: function (arr) {
//     let data = [], tableObj = this.b05(mssql, o.params.database, o.params.table)//获取字段类型
//     for (let i = 0; i < arr.length; i++) {
//         data.push(this.b04(arr[i], o.params.database, o.params.table, tableObj));
//     }
//     Tool.ajax.a01(data, this.d03, this);
// },
// d03: function (t) {
//     let isErr = false;
//     for (let i = 0; i < t.length; i++) {
//         for (let j = 0; j < t[i].length; j++) {
//             if (t[i][j].list[0] != "更新成功" && t[i][j].list[0] != "插入成功") {
//                 isErr = true;
//                 break;
//             }
//         }
//     }
//     if (isErr) {
//         Tool.pre(["有错误", t])
//     }
//     else {
//         this.e06()
//     }
// },