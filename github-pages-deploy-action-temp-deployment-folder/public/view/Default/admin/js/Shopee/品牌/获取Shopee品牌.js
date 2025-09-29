var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        B1: 1, B2: 0,
        seller: {},//提交要用
        typeID: 0,//数目ID(一个类目下有我少个品牌)
        cursor: "",//下一页
    },
    a01: function () {
        let html = Tool.header(o.params.return, 'Shopee &gt; 品牌 &gt; 正在【获取Shopee品牌】...') + '\
        <div class="p-2">\
            <table class="table table-hover align-middle">\
                <tbody>\
                    <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
                    <tr><td class="right">类目进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                    <tr><td class="right">品牌页进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
                    <tr><td class="right">请求地址：</td><td id="url" colspan="2"></td></tr>\
                    <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
                </tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (t) {
        this.obj.seller = t;
        this.a04()
    },
    a04: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/类目/类目",
            sql: "select @.fromid as fromid FROM @.table where @.isleaf=1" + Tool.limit(1, this.obj.A1),
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/类目/类目",
                sql: "select count(1) as total FROM @.table where @.isleaf=1",
            })
        }
        Tool.ajax.a01(data, this.a05, this);
    },
    a05: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].total; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a06, this, null, t[0][0].fromid);
    },
    a06: function (typeID) {
        this.obj.typeID = typeID;
        this.obj.cursor = "";//第一页
        this.d01()
    },
    /////////////////////////////////////////////
    d01: function () {
        let pArr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "category_ids=" + this.obj.typeID,
            "brand_status=1",
            "limit=50",
            "cursor=" + this.obj.cursor,
            "brand_name=",
            "cnsc_shop_id=" + this.obj.seller["my"][0].shopId,
            "cbsc_shop_region=my"
        ]
        let url = "https://seller.shopee.cn/api/v3/mtsku/get_mtsku_brand_list?" + pArr.join("&")
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在搜索商品SKU。。。");
        gg.getFetch(url, "json", this.d02, this)
    },
    d02: function (oo) {
        if (oo.code === 0) {
            if (oo.data.list[0].page_info.has_next) {
                this.obj.cursor = oo.data.list[0].page_info.cursor//下一页
                this.obj.B2 = this.obj.B1 + 1;
            }
            Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d03, this, this.e01, oo.data.list[0].brand_list);
        }
        else {
            Tool.pre(["出错", oo])
        }
    },
    d03: function (arr) {
        $("#state").html("正在获取本地品牌信息。。。");
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            data.push({
                action: "sqlite",
                database: "shopee/品牌/index",
                sql: "select " + Tool.fieldAs("brand_id") + " FROM @.table where @.brand_id=" + arr[i].brand_id,
                list: [{
                    action: "sqlite",
                    database: "shopee/品牌/" + Tool.remainder(arr[i].brand_id, 100),
                    sql: "select " + Tool.fieldAs("brand_id,category_ids") + " FROM @.table where @.brand_id=" + arr[i].brand_id,
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/品牌/index",
                    sql: "insert into @.table(@.brand_id,@.name,@.addtime)values(" + arr[i].brand_id + "," + Tool.rpsql(arr[i].name) + "," + Tool.gettime("") + ")"
                }, {
                    action: "sqlite",
                    database: "shopee/品牌/" + Tool.remainder(arr[i].brand_id, 100),
                    sql: "insert into @.table(@.brand_id,@.category_ids)values(" + arr[i].brand_id + ",'[" + this.obj.typeID + "]')"
                }]
            })
        }
        if (data.length == 0) {
            this.d05();
        }
        else {
            Tool.ajax.a01(data, this.d04, this);
        }
    },
    d04: function (t) {
        let data = [];
        for (let i = 0; i < t[0].length; i++) {
            //看是否要更新类目
            let arr = t[0][i].list[0];
            if (arr[0] && arr[0].category_ids) {
                let category_ids = JSON.parse(arr[0].category_ids)
                if (category_ids.indexOf(this.obj.typeID) == -1) {
                    category_ids.push(this.obj.typeID)
                    data.push({
                        action: "sqlite",
                        database: "shopee/品牌/" + Tool.remainder(arr[0].brand_id, 100),
                        sql: "update @.table set @.category_ids=" + Tool.rpsql(JSON.stringify(category_ids)) + " where @.brand_id=" + arr[0].brand_id
                    })
                }
            }
        }
        $("#state").html("正在更新品牌。。。");
        if (data.length == 0) {
            this.d05()
        }
        else {
            Tool.ajax.a01(data, this.d05, this);
        }
    },
    d05: function () {
        this.obj.B1++;
        this.d01();
    },
    ///////////////////////////////////////////////
    e01: function () {
        this.obj.typeID = 0;
        this.obj.cursor = "";
        this.obj.B1 = 1; this.obj.B2 = 0;
        this.obj.A1++;
        this.a04();
    },
}
fun.a01();