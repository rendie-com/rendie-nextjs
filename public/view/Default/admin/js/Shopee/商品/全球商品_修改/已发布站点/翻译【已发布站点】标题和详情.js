'use strict';
var fun =
{
    obj: {
        A1: 5, Aarr: ["sg", "tw", "my", "br", "mx"],
        B1: 1, B2: 0,
    },
    a01: function () {
        let html = Tool.header(obj.params.return, "Shopee &gt; 全球商品_修改 &gt; 翻译【已发布站点】标题和详情") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle mb-0">\
                <tbody>\
                <tr><td class="right">站点：</td><td colspan="2" id="site"></td></tr>\
                <tr><td class="right w150">站点进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                <tr><td class="right">商品条进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
                <tr><td class="right">商品编码：</td><td id="proid" colspan="2"></td></tr>\
                <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
                </tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        gg.isRD(this.a03, this)
    },
    a03: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.Aarr.length, this.a04, this)
    },
    a04: function () {
        let site = this.obj.Aarr[this.obj.A1 - 1]
        $("#site").html(Tool.site(site));
        let language = this.b02(site);
        if (language) {
            let where = " where @.isup=1 and @.is" + site + "=1"
            //and @.proid=\'R837763\'
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select " + Tool.fieldAs("ManualReview_1688_subject," + language + "_name,ManualReview_1688_description," + language + "_description,proid") + " FROM @.table" + where + Tool.limit(1, this.obj.B1),
            }]
            if (this.obj.B2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select count(1) as total FROM @.table" + where,
                })
            }
            $("#state").html("正在获取商品信息。。。")
            let oo = {
                language: language,
                updateArr: []//更新数据要用
            }
            Tool.ajax.a01(data, this.a05, this, oo)
        }
        else {
            Tool.pre("未开发，需要设置翻译的语言。")
        }
    },
    a05: function (t, oo) {
        if (this.obj.B2 == 0) this.obj.B2 = t[1][0].total;
        oo.data = t[0][0]
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d01, this, this.e03, oo)
    },
    /////////////////////////////////////
    b01: function (t) {
        //处理单位，后面的括号。
        //翻译后不是换行的，我给它换行。
        let arr1 = t.split("✅")
        let str = "✅" + arr1[1] + "\n"
        if (str.indexOf("(") != -1) {
            let arr2 = Tool.StrSlice(str, "(", ")").split("=");
            if (Tool.Trim(arr2[0]) == Tool.Trim(arr2[1])) {
                str = str.split("(")[0] + "\n"
            }
        }
        for (let i = 2; i < arr1.length; i++) {
            str += "✅" + arr1[i] + "\n"
        }
        return str;
    },
    b02: function (site) {
        let language
        switch (site) {//选择JS文件
            case "tw": language = "tw"; break;
            case "sg":
            case "my":
                language = "en"; break;
            case "br": language = "pt"; break;
            case "mx": language = "es"; break;
        }
        return language
    },
    //////////////////////////////////////////////////////
    d01: function (oo) {
        $("#proid").html(oo.proid)
        Tool.translate_site.a01(oo.data.ManualReview_1688_subject, oo.data[oo.language + "_name"], oo.language, this.d02, this, oo);
    },
    d02: function (t, oo) {
        if (t) {
            oo.updateArr.push("@." + oo.language + "_name=" + Tool.rpsql(t))
            oo.updateArr.push("@." + oo.language + "_nameLen=" + t.length)
        }
        this.d03(oo)
    },
    d03: function (oo) {
        Tool.translate_site.a01(oo.data.ManualReview_1688_description, oo.data[oo.language + "_description"], oo.language, this.d04, this, oo);
    },
    d04: function (t, oo) {
        if (t) {
            oo.updateArr.push("@." + oo.language + "_description=" + Tool.rpsql(this.b01(t)))
        }
        this.e01(oo.updateArr, oo.data.proid)
    },
    //////////////////////////////////////////////////////////////
    e01: function (updateArr, proid) {
        if (updateArr.length != 0) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set " + updateArr.join(",") + " where @.proid=" + Tool.rpsql(proid),
            }]
            $("#state").html("正在更新本地商品状态。。。");
            Tool.ajax.a01(data, this.e02, this)
        }
        else {
            this.e02()
        }
    },
    e02: function (t) {
        this.obj.B1++;
        $("#state").html("正在进入第" + this.obj.B1 + "页。。。");
        this.a04();
    },
    e03: function () {
        this.obj.B1 = 1; this.obj.B2 = 0;
        $("#B1").css("width", "0%"); $("#B1,#B2").html("");
        this.obj.A1++;
        this.a03();
    },
}
fun.a01();



