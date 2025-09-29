'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        seller: {},
    },
    a01: function () {
        //obj.params.jsFile       选择JS文件
        let html = Tool.header(obj.params.return, "Shopee &gt; 商品列表 &gt; 图片 &gt; 把【使用1688的图片】上传到Shopee平台") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle">\
                <tbody>\
                    <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
                    <tr><td class="right">商品进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                    <tr><td class="right">放大镜图进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
                    <tr><td class="right">属性图进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
                    <tr><td class="right">详情图进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
                    <tr><td class="right">详情地址：</td><td id="url" colspan="2"></td></tr>\
                    <tr><td class="right">上传前放大镜图：</td><td id="pic1" colspan="2" class="p-0"></td></tr>\
                    <tr><td class="right">上传后放大镜图：</td><td id="pic2" colspan="2" class="p-0"></td></tr>\
                    <tr><td class="right">上传前属性图：</td><td id="attr_pic1" colspan="2" class="p-0"></td></tr>\
                    <tr><td class="right">上传后属性图：</td><td id="attr_pic2" colspan="2" class="p-0"></td></tr>\
                    <tr><td class="right">上传前详情图：</td><td id="des_pic1" colspan="2" class="p-0"></td></tr>\
                    <tr><td class="right">上传后详情图：</td><td id="des_pic2" colspan="2" class="p-0"></td></tr>\
                    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
                </tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (t) {
        this.obj.seller = t;
        this.d01()
    },
    /////////////////////////////////////////
    d01: function () {
        let where = " where @.ManualReview_1688=1"//表示【使用1688属性图】
        //let where =" where @.manualreview_1688_fromid=628562507449"
        let data = [{
            action: "sqlite",
            database: "1688",
            sql: "select " + Tool.fieldAs("manualreview_1688_fromid") + " FROM @.product" + where + Tool.limit(1, this.obj.A1),
            list: [{
                action: "sqlite",
                database: "1688_prodes/${fromid99:manualreview_1688_fromid}",
                sql: "select " + Tool.fieldAs("sku,attrPic_shopee,attrPic,pic_shopee,pic,desPic_shopee,des,fromid") + " FROM @.prodes where @.fromid=${manualreview_1688_fromid} limit 1"
            }]
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "1688",
                sql: "select count(1) as total FROM @.product" + where,
            })
        }
        $("#state").html("正在获取商品...");
        Tool.ajax.a01(data, this.d02, this);
    },
    d02: function (oo) {
        if (this.obj.A2 == 0) { this.obj.A2 = oo[1][0].total; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d03, this, null, oo[0][0])
    },
    d03: function (oo) {
        let o1 = oo.list[0][0];
        let url = "https://detail.1688.com/offer/" + o1.fromid + ".html";
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        Tool.common_B.a01(o1.pic, o1.pic_shopee, o1.fromid, this.obj.seller, this.d04, this, o1)
    },
    d04: function (oo) {
        Tool.common_C.a01(oo.sku, oo.attrPic_shopee, oo.fromid, this.obj.seller, this.d05, this, oo)
    },
    d05: function (oo) {
        Tool.common_D.a01(oo.des, oo.desPic_shopee, oo.fromid, this.obj.seller, this.d06, this)
    },
    d06: function () {
        $("#state").html("下一条...");
        this.obj.A1++;
        $("#B1,#C1,#D1").html("0%").css("width", "0%");
        $("#B2,#C2,#D2").html("");
        $("#pic1,#pic2,#attr_pic1,#attr_pic2,#des_pic1,#des_pic2").html("")
        this.d01();
    },
}
fun.a01()
