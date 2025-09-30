'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0, Aarr: [],
        B1: 1, B2: 0,
        seller: {},
    },
    a01: function () {
        //o.params.return        返回URL
        //o.params.site          站点
        let html = Tool.header(o.params.return, "Shopee &gt; 商品列表 &gt; 店铺商品 &gt; 更多_all &gt; 生成图片水印") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="right w220">账号：</td><td id="username" colspan="2"></td></tr>\
            <tr><td class="right">站点：</td><td colspan="2" id="site"></td></tr>\
		    <tr><td class="right">站点进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">第几个店铺：</td><td colspan="2" id="num"></td></tr>\
		    <tr><td class="right">店铺进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
            <tr><td class="right">商品条进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
            <tr><td class="right">shopee_放大镜图进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
            <tr><td class="right">1688_属性图进度：</td>'+ Tool.htmlProgress('E') + '</tr>\
            <tr><td class="right">shopee_店铺商品ID：</td><td id="fromid" colspan="2"></td></tr>\
            <tr><td class="right">商品编码：</td><td id="proid" colspan="2"></td></tr>\
            <tr><td class="right">（上传前）shopee_放大镜图：</td><td id="picA" colspan="2"></td></tr>\
            <tr><td class="right">（上传后）shopee_放大镜图：</td><td id="picB" colspan="2"></td></tr>\
            <tr><td class="right">1688_商品ID：</td><td id="manualreview_1688_fromid" colspan="2"></td></tr>\
            <tr><td class="right">（上传前）1688_属性图：</td><td id="attrPicA" colspan="2"></td></tr>\
            <tr><td class="right">（上传后）1688_属性图：</td><td id="attrPicB" colspan="2"></td></tr>\
            <tr ><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
            </tbody>\
            <tbody id="tbody"></tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function (t) {
        this.obj.seller = t;
        if (o.params.site && o.params.num) {
            this.obj.A2 = 1;
            this.obj.B1 = Tool.int(o.params.num);
            this.obj.Aarr = [{
                site: o.params.site,
                B2: this.obj.B1
            }];
        }
        else {
            let arr = []
            for (let k in t) {
                if (k != "SPC_CDS") {
                    arr.push({
                        site: k,
                        B2: t[k].length
                    })
                }
            }
            this.obj.Aarr = arr;
            this.obj.A2 = arr.length;
        }
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
    /////////////////////////////////////////////////////
    d01: function () {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d02, this, this.e01)
    },
    d02: function () {
        $("#num").html(this.obj.B1)//第几个店铺
        let dom = {
            fromid: $("#fromid"),
            proid: $("#proid"),
            picA: $("#picA"),
            picB: $("#picB"),
            manualreview_1688_fromid: $("#manualreview_1688_fromid"),
            attrPicA: $("#attrPicA"),
            attrPicB: $("#attrPicB"),
        }
        Tool.common1.a01(this.obj.seller, this.obj.Aarr[this.obj.A1 - 1].site, this.obj.B1, ["C", "D", "E"], dom, this.d03, this)
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
        $("#state").html("全部完成");
    },
}
fun.a01();