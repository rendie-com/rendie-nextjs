'use strict';
var fun =
{
    obj: {
        A1: 1, A2: 0
    },
    a01: function () {
        let html = Tool.header(o.params.return, "Shopee &gt; 商品列表 &gt; 全球商品 &gt; 更多 &gt; 修复异常的【折扣】") + '\
        <div class="p-2">\
          <table class="table  align-middle table-hover">\
          <tbody>\
		    <tr><td class="right w150">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr>\
                <td class="right">说明：</td>\
                <td colspan="2">\
                    (1).如果没有折扣，那就随机给个10%到50%(不含50%)的折扣。<br/>\
                    (2)如果折扣“<10%”，也随机给个10%到50%(不含50%)的折扣。（例如：原价0.22打2%的折扣，结果还是0.22，因为平台会四舍五入保留俩位小数。）<br/>\
                    (3)如果折扣“>=50”，也随机给个10%到50%(不含50%)的折扣。（在报商品活动的时候，折扣太大或太小报不了）<br/>\
                    (4)为什么不能大于50%？答：越南站点打折最没不能超50%，而且我做的是在指定折扣上减6，折扣太大，会使利润率太高。<br/>\
                    注：发布到各个站点后，都是用折扣来调价的。（例如1：1688的价格涨了，我就少打的折，反之就多打的折。）\
                </td>\
            </tr>\
		    <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.download_sqlite.a01(["shopee/类目/index", "shopee/商品/全球商品"], this.a03, this);
    },
    a03: function () {
        let where = " where @.discount<10 or @.discount>=50"
        let data = [{
            action: "sqlite",
            database: "shopee/商品/全球商品",
            sql: "select " + Tool.fieldAs("id") + " FROM @.table" + where + " limit 100",
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select count(1) as count FROM @.table" + where,
            })
        }
        $("#state").html("正在获取商品...");
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = Math.ceil(t[1][0].count / 100); }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a05, this, null, t[0]);
    },
    a05: function (arr) {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            data.push({
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set @.discount=" + Tool.randomRange(10, 50) + " where @.id=" + arr[i].id
            })
        }
        Tool.ajax.a01(data, this.a06, this);
    },
    a06: function (t) {
        this.obj.A1++;
        this.a03();
    },
}
fun.a01();