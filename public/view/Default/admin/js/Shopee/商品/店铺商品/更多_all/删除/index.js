'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0, Aarr: [],
        B1: 1, B2: 0,
        seller: {},
        where: "",//删除条件
    },
    a01: function () {
        //o.params.site       站点
        //o.params.num
        let html = Tool.header(o.params.return, "Shopee &gt; 商品列表 &gt; 店铺商品 &gt; 更多_all &gt; 删除") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
 		    <tr><td class="right w150">删除条件：</td><td colspan="2">'+ this.b01() + '</td></tr>\
		    <tr><td class="right w150">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">站点：</td><td colspan="2" id="site"></td></tr>\
		    <tr><td class="right">站点进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">第几个店铺：</td><td colspan="2" id="num"></td></tr>\
		    <tr><td class="right">店铺进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		    <tr><td class="right">where语句：</td><td colspan="2" id="where"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
		    <tr><td class="right">地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(null, null, html)
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (t) {
        this.obj.seller = t;
        if (o.params.site && o.params.num) {
            this.obj.A2 = 1;
            this.obj.B1 = Tool.int(o.params.num)
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
    b01: function () {
        let str = '\
        <select onChange="fun.c01($(this),this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">请选择删除条件</option>\
            <option value="status=0">*状态 &rArr; 0.未知</option>\
            <option value="ExceptionType=2">*商品异常类型 &rArr; 2.最终折扣>=80</option>\
            <option value="ExceptionType=3">*商品异常类型 &rArr; 3.最终折扣<=8</option>\
            <option value="ExceptionType=6">*商品异常类型 &rArr; 6.更新后违规类型_不匹配</option>\
            <option value="ExceptionType=8">*商品异常类型 &rArr; 8.手动审核后1688商品状态_不匹配</option>\
            <option value="ExceptionType=9">*商品异常类型 &rArr; 9.修改状态_不匹配</option>\
        </select>';
        return str;
    },
    /////////////////////////////////////////////////////
    c01: function (This, val) {
        This.attr("disabled", true);
        this.obj.where = val;
        this.a02()
    },
    /////////////////////////////////////////////////////
    d01: function () {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d02, this, this.e01)
    },
    d02: function () {
        $("#num").html(this.obj.B1)//第几个店铺
        Tool.delete_product.a01(this.obj.seller, this.obj.Aarr[this.obj.A1 - 1].site, this.obj.B1, "C", this.obj.where, this.d03, this)
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