'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0, Aarr: [],
        B1: 1, B2: 0,
    },
    a01: function () {
        //o.params.site           站点
        let html = Tool.header(o.params.return, 'Shopee &gt; 商品列表 &gt; 店铺商品 &gt; 1688信息_把1688信息同步过来') + '\
        <div class="p-2">\
          <table class="table table-hover">\
          <tbody>\
            <tr><td class="right w150">同步字段：</td><td colspan="2">【销量】【最高价】【运费】【详情ID】【全球商品-单位重量】【全球商品-折扣】【件倍数】</td></tr>\
            <tr><td class="right">站点：</td><td colspan="2" id="site"></td></tr>\
		    <tr><td class="right">站点进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">第几个店铺：</td><td colspan="2" id="num"></td></tr>\
		    <tr><td class="right">店铺进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
            <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
            <tr><td class="right">商品编码：</td><td id="proid" colspan="2"></td></tr>\
            <tr><td class="right">1688地址：</td><td id="url" colspan="2"></td></tr>\
            <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        if (o.params.site && o.params.num) {
            this.obj.A2 = 1;
            this.obj.B1 = Tool.int(o.params.num)
            this.obj.Aarr = [{
                site: o.params.site,
                B2: this.obj.B1
            }];
            this.a04()
        }
        else {
            $("#state").html("正在获得配置参数");
            let data = [{
                action: o.DEFAULT_DB,
                database: "shopee/卖家账户",
                sql: "select " + Tool.fieldAs("config") + " FROM @.table limit 1",
            }]
            Tool.ajax.a01(data, this.a03, this)
        }

    },
    a03: function (t) {
        let arr = [], config = JSON.parse(t[0][0].config)
        for (let k in config) {
            if (k != "SPC_CDS") {
                arr.push({
                    site: k,
                    B2: config[k].length
                })
            }
        }
        this.obj.Aarr = arr;
        this.obj.A2 = arr.length;
        this.a04()
    },
    a04: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a05, this, this.e02)
    },
    a05: function () {
        let oo = this.obj.Aarr[this.obj.A1 - 1]
        $("#site").html(Tool.site(oo.site));
        this.obj.B2 = oo.B2;
        this.d01()
    },
    d01: function () {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d02, this, this.e01)
    },
    d02: function () {
        $("#num").html(this.obj.B1)//第几个店铺
        Tool.get_1688Info.a01(this.obj.Aarr[this.obj.A1 - 1].site, this.obj.B1, "C", this.d03, this);
    },
    d03: function () {
        this.obj.B1++;
        this.d01();
    },
    //////////////////////////////////////////
    e01: function () {
        $("#B1").css("width", "0%");
        $("#B1,#B2").html("");
        this.obj.B1 = 1; this.obj.B2 = 0;
        this.obj.A1++;
        this.a04();
    },
    e02: function () {
        $("#state").html("全部完成")
    },
}
fun.a01();