'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        seller: {},
    },
    a01: function () {
        let html = Tool.header(obj.params.return, "Shopee &gt; 商品列表 &gt; 店铺商品 &gt; 为该站点首图生成水印") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w250 right">获取站点：</td><td colspan="2">'+ Tool.site(obj.params.site) + '</td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">店铺商品ID：</td><td id="fromid" colspan="2"></td></tr>\
		    <tr><td class="right">商品编码：</td><td id="proid" colspan="2"></td></tr>\
		    <tr><td class="right">（上传前）首图：</td><td id="pic1A" colspan="2"></td></tr>\
		    <tr><td class="right">（上传后）首图：</td><td id="pic1B" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          <tbody id="tbody"></tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (t) {
        this.obj.seller = t;
        this.a04();
    },
    a04: function () {
        //@.ispic1watermark=0      表示【没有生成首图水印】
        //let where = " where @.proid='R154110'"
        let where = " where @.ispic1watermark=0"
        let data = [
            ///////////修复数据要用下面的代码//////////////////////////////////////////
            // {
            //     action: "sqlite",
            //     database: "shopee/商品/图片/shopee首图",
            //     sql: "update @.table set @." + obj.params.site + "_watermark=null",
            // },
            // {
            //     action: "sqlite",
            //     database: "shopee/商品/店铺商品/" + obj.params.site,
            //     sql: "update @.table set @.ispic1watermark=0",
            // },
            ////////////////////////////////////////////////////////////////////////
            {
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + obj.params.site,
                sql: "select " + Tool.fieldAs("fromid,ispic1watermark,proid,_1688_fromid") + " FROM @.table" + where + " limit 1",
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select " + Tool.fieldAs("pic,ManualReview_1688_categoryId") + " FROM @.table where @.manualreview_1688_fromid=${_1688_fromid} limit 1",
                    list: [{
                        action: "sqlite",
                        database: "1688/类目/现货类目",
                        sql: "select @.catNamePath as catNamePath FROM @.table where @.fromid=${ManualReview_1688_categoryId} limit 1",
                    }]
                }]
            }
        ]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + obj.params.site,
                sql: "select count(1) as Count FROM @.table" + where,
            })
        }
        Tool.ajax.a01(data, this.a05, this);
    },
    a05: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].Count; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d01, this, null, t[0][0])
    },
    ///////////////////////////////////////////////////////////////
    d01: function (oo) {
        $("#fromid").html('<a href="https://seller.shopee.cn/portal/product/' + oo.fromid + '" target="_blank">' + oo.fromid + '</a>')
        $("#proid").html(oo.proid);
        if (oo.ispic1watermark) {
            $("#state").html("已经有水印了。")
            this.d04();
        }
        else {
            this.d02(oo)
        }
    },
    d02: function (oo) {
        let typeName = oo.list[0][0].list[0][0].catNamePath.split(">").pop()
        if (typeName) {
            if (obj.params.site == "tw") {
                $("#state").html("正在翻译成台湾语。。。（需要开代理）");
                Tool.translate_name.a01(typeName, "zh-CN", "zh-TW", this.d03, this, oo)
            }
            else if (obj.params.site == "my" || obj.params.site == "sg") {
                //正在翻译成英语。。。
                Tool.translate_name.a01(typeName, "zh-CN", "en", this.d03, this, oo)
            }
            else if (obj.params.site == "br") {
                //正在翻译成葡萄牙语。。。
                Tool.translate_name.a01(typeName, "zh-CN", "pt", this.d03, this, oo)
            }
            else if (obj.params.site == "mx") {
                //正在翻译成葡萄牙语。。。
                Tool.translate_name.a01(typeName, "zh-CN", "es", this.d03, this, oo)
            }
            else {
                Tool.pre("还没开发2025.1.13:20:52。。。。")
            }
        }
        else {
            let str = "下架的商品，不能创建【搜索广告】,所以终止。" + typeName;
            $("#state").html(str);
            //Tool.at(str)
        }
    },
    d03: function (typeName, oo) {
        let dom = {
            pic1A: $("#pic1A"),
            pic1B: $("#pic1B"),
        }
        Tool.common_pic1_waterMark.a01(oo.proid, oo.list[0][0].pic, typeName, this.obj.seller, obj.params.site, dom, this.d04, this, oo)
    },
    d04: function () {
        this.obj.A1++;
        $("#pic1A,#pic1B").html("")
        this.a04();
    },
}
fun.a01();