'use strict';
var fun =
{
    obj:
    {
        A1: 1, Aarr: [],
        B1: 1, B2: 0,
        C1: 1, C2: 0, Carr: [],
        seller: {},
    },
    a01: function () {
        //o.params.return         返回URL 
        let html = Tool.header(o.params.return, "Shopee &gt; 商品列表 &gt; 违规或删除 &gt; 更多 &gt; 获取【搜索排名降低】的商品") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle mb-0">\
                <tbody>\
                <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
                <tr><td class="right">站点：</td><td id="site"></td><td></td></tr>\
                <tr><td class="right">站点进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
                <tr><td class="right">商品条进进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
                <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
                <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
                </tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let config = JSON.parse(t[0][0].config), Aarr = [];
        for (let k in config) {
            for (let i = 0; i < config[k].length; i++) {
                Aarr.push([k, config[k][i].shopId, i + 1]);
            }
        }
        this.obj.Aarr = Aarr;
        this.obj.A2 = Aarr.length;
        Tool.login.a01(this.a04, this);
    },
    a04: function (t) {
        this.obj.seller = t
        this.d01();
    },
    ///////////////////////////////////////////////////////
    d01: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this)
    },
    d02: function () {
        let Aarr = this.obj.Aarr[this.obj.A1 - 1]
        $("#site").html(Aarr[2] + "." + Tool.site(Aarr[0]));
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "page_number=" + this.obj.B1,
            "page_size=12",
            "list_type=deboosted",
            "count_list_types=sold_out,banned,deboosted,deleted,unlisted,reviewing,unpublished",
            "cnsc_shop_id=" + Aarr[1],
            "cbsc_shop_region=" + Aarr[0]
        ]
        let url = "https://seller.shopee.cn/api/v3/mpsku/list/search_deboosted_product_list?" + arr.join("&")
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在获取第" + this.obj.B1 + "页商品。。。");
        gg.getFetch(url, "json", this.d03, this);
    },
    d03: function (oo) {
        if (oo.code == 0) {
            if (!oo.data.page_info.page_size) oo.data.page_info.page_size = 1;//说明：这里这么写，是因为，没有测式数据，不知道下一页是什么样子。
            this.obj.B2 = Math.ceil(oo.data.page_info.total / oo.data.page_info.page_size)
            if (oo.data.products) {
                this.obj.Carr = oo.data.products
                this.obj.C2 = oo.data.products.length;
            }
            this.e01()
        }
        else if (oo.code == 429) {
            $("#state").html("请不要要求太频繁");
            //Tool.Time("1" 500,,this.a07, this,);
        }
        else {
            Tool.pre(["出错", oo]);
        }
    },
    /////////////////////////////////
    b01: function (id, oo) {
        let proid = "'【proid】丢失'"
        if (oo.fromid == id) {
            proid = "'" + oo.proid + "'"
        }
        return proid;
    },
    ///////////////////////////////////
    e01: function () {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.e02, this, this.f02)
    },
    e02: function () {
        Tool.x1x2("C", this.obj.C1, this.obj.C2, this.e03, this, this.f01)
    },
    e03: function () {
        let data = [], products = this.obj.Carr[this.obj.C1 - 1];
        if (products.deboosted_infos.reasons) {
            //将shopee给的类目ID,翻译成中文.           
            let arr1 = products.deboosted_infos.reasons[0].suggested_category_path;//shoppe要我绑定这个类目。
            if (arr1) {
                for (let i = 0; i < arr1.length; i++) {
                    data.push({
                        action: "sqlite",
                        database: "shopee/类目/类目",
                        sql: "select @.name as name FROM @.table where @.fromid=" + arr1[i],
                    })
                }
            }
        }
        else {
            products.deboosted_infos.reasons = [
                {
                    explanation: "",//建议
                    hint_message: "",
                    deboost_type: "5",//违规类型
                    description: "",//违规原因
                }
            ]
        }
        this.e04(data, products)
    },
    e04: function (data1, products) {
        let Aarr = this.obj.Aarr[this.obj.A1 - 1]
        let siteNum = Tool.siteNum(Aarr[0], Aarr[2])
        let data2 = [{
            action: "sqlite",
            database: "shopee/商品/店铺商品/" + siteNum,
            sql: "select " + Tool.fieldAs("fromid,proid") + " FROM @.table where @.fromid=" + products.id,
        },
        {
            action: "sqlite",
            database: "shopee/商品/违规或删除",
            sql: "select 1 from @.table where @.site='" + siteNum + "' and @.productId=" + products.id,
        }].concat(data1)
        Tool.ajax.a01(data2, this.e05, this, products)
    },
    e05: function (t, products) {
        let category_path = [];
        for (let i = 2; i < t.length; i++) {
            category_path.push(t[i][0].name)
        }
        let explanation = Tool.rpsql(products.deboosted_infos.reasons[0].explanation + "<hr/>" + products.deboosted_infos.reasons[0].hint_message + " " + category_path.join(" &gt; "));
        this.e06(t, products, explanation)
    },
    e06: function (t, products, explanation) {
        let proid = this.b01(products.id, t[0][0])
        if (proid == "'【proid】丢失'") {
            Tool.pre(proid)
        }
        else {
            let Aarr = this.obj.Aarr[this.obj.A1 - 1]
            let siteNum = Tool.siteNum(Aarr[0], Aarr[2])
            let arrL = [
                "@.productId",//商品ID
                "@.proid",//商品编码
                "@.name",//商品名称
                "@.status",//商品状态
                "@.pic",//图片
                "@.addtime",//添加时间
                "@.uptime",//修改时间
                "@.banned_time",//违规时间
                "@.penalty_type",//违规类型
                "@.description",//违规原因
                "@.explanation",//建议
                "@.site"//站点
            ]
            let arrR = [
                products.id,//商品ID
                proid,//商品编码
                Tool.rpsql(products.name),//商品名称
                products.status,//商品状态
                Tool.rpsql(products.cover_image),//图片
                products.create_time,//添加时间
                products.modify_time,//修改时间
                products.deboosted_infos.deboosted_time,//违规时间
                products.deboosted_infos.reasons[0].deboost_type,//违规类型
                Tool.rpsql(products.deboosted_infos.reasons[0].description),//违规原因
                explanation,//建议
                "'" + siteNum + "'"//站点
            ];
            let sql = ""
            if (t[1].length == 0) {
                sql = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")"

            }
            else {
                sql = "update @.table set @.penalty_type=" + products.deboosted_infos.reasons[0].deboost_type + ",@.explanation=" + explanation + ",@.proid=" + proid + " where @.site='" + siteNum + "' and @.productId=" + products.id
            }
            let data = [{
                action: "sqlite",
                database: "shopee/商品/违规或删除",
                sql: sql,
            }]
            $("#state").html("正在更新本地商品状态。。。");
            Tool.ajax.a01(data, this.e07, this)
        }
    },
    e07: function (t) {
        if (t[0].length == 0) {
            this.obj.C1++
            this.e02()
        }
        else {
            Tool.pre(["出错", t])
        }
    },
    //////////////////////////////////////
    f01: function () {
        this.obj.C1 = 1; this.obj.C2 = 0; this.obj.Carr = [];
        $("#C1").css("width", "0%"); $("#C1,#C2").html("");
        this.obj.B1++;
        $("#state").html("正在进入第" + this.obj.B1 + "页。。。");
        this.e01();
    },
    f02: function () {
        this.obj.B1 = 1; this.obj.B2 = 0;
        $("#B1").css("width", "0%"); $("#B1,#B2").html("");
        this.obj.A1++;
        this.d01();
    },
}
fun.a01();