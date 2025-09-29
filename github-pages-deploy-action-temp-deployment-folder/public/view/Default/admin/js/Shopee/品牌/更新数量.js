var fun =
{
    obj: {
        A1: 1, A2: 0,
    },
    a01: function () {
        let html = Tool.header(o.params.return, 'Shopee &gt; 品牌 &gt; 更新数量') + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
		        <tr><td class="right w100">品牌页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/品牌/index",
            sql: "select " + Tool.fieldAs("brand_id") + "  from @.table" + Tool.limit(100, this.obj.A1),
            list: [{
                action: "sqlite",
                database: "shopee/品牌/${id_100:brand_id}",
                sql: "select " + Tool.fieldAs("category_ids") + " from @.table where @.brand_id=${brand_id}",
            }]
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/品牌/index",
                sql: "select count(1) as count from @.table",
            })
        }
        $("#state").html("正在获取品牌。。。");
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = Math.ceil(t[1][0].count / 100); }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a04, this, this.d01, t[0]);
    },
    a04: function (arr) {
        let data = []
        for (let i = 0; i < arr.length; i++) {
            let category_ids = JSON.parse(arr[i].list[0][0].category_ids)
            data.push({
                action: "sqlite",
                database: "shopee/品牌/index",
                sql: "update @.table set @.category_count=" + category_ids.length + " where  @.brand_id=" + arr[i].brand_id,
            });
        }
        $("#state").html("正在更新数量。。。");
        Tool.ajax.a01(data, this.a05, this);
    },
    a05: function (t) {
        this.obj.A1++;
        this.a02();
    },
    /////////////////////////////
    d01: function () {
        $("#state").html("全部完成");
    },
}
fun.a01();
