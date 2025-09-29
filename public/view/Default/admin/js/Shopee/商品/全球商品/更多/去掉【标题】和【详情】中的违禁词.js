'use strict';
var fun =
{
    obj: {
        A1: 1, A2: 0,
        wordsArr: [],//所有“违禁词”
    },
    a01: function () {
        let html = Tool.header(o.params.return, "Shopee &gt; 商品列表 &gt; 全球商品 &gt; 更多 &gt; 去掉【标题】和【详情】中的违禁词") + '\
        <div class="p-2">\
          <table class="table  align-middle table-hover">\
          <tbody>\
		    <tr><td class="right w150">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/违禁词",
            sql: "select " + Tool.fieldAs("name") + " FROM @.table",
        }]
        $("#state").html("正在获取所有违禁词。。。")
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let wordsArr = []
        for (let i = 0; i < t[0].length; i++) {
            wordsArr = this.b01(wordsArr, t[0][i].name);
        }
        this.obj.wordsArr = wordsArr;
        this.d01();
    },
    ////////////////////////////////////////////////////
    b01: function (wordsArr, name) {
        let tempArr = [name]
        if (name.indexOf(",") != -1) {
            tempArr = name.split(",");
        }
        else if (name.indexOf("，") != -1) {
            tempArr = name.split("，");
        }
        for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i] && wordsArr.indexOf(tempArr[i]) == -1) {
                wordsArr.push(tempArr[i])
            }
        }
        return wordsArr;
    },
    b02: function (ManualReview_1688_subject, ManualReview_1688_description) {
        let arr = this.obj.wordsArr;
        for (let i = 0; i < arr.length; i++) {
            if (ManualReview_1688_subject.indexOf(arr[i]) != -1) {
                ManualReview_1688_subject = ManualReview_1688_subject.replace(arr[i], "");
                i--;
            }
            if (ManualReview_1688_description && ManualReview_1688_description.indexOf(arr[i]) != -1) {
                ManualReview_1688_description = ManualReview_1688_description.replace(arr[i], "");
                i--;
            }
        }
        return [ManualReview_1688_subject, ManualReview_1688_description]
    },
    ////////////////////////////////////////////////////
    d01: function () {
        let where = " where not(@.ManualReview_1688_subject is null)"
        let data = [{
            action: "sqlite",
            database: "shopee/商品/全球商品",
            sql: "select " + Tool.fieldAs("proid,ManualReview_1688_subject") + " FROM @.table" + where + Tool.limit(10, this.obj.A1),
            list: [{
                action: "sqlite",
                database: "shopee/商品/全球商品/${proid_100:proid}",
                sql: "select " + Tool.fieldAs("ManualReview_1688_description") + " FROM @.table where @.proid='${proid}'",
            }]
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select count(1) as count FROM @.table" + where,
            })
        }
        Tool.ajax.a01(data, this.d02, this);
    },
    d02: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = Math.ceil(t[1][0].count); }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d03, this, null, t[0]);
    },
    d03: function (t) {
        let update = []
        for (let i = 0; i < t.length; i++) {
            let field = [], rpArr = this.b02(t[i].ManualReview_1688_subject, t[i].list[0][0].ManualReview_1688_description);//去掉【违禁词】
            Tool.pre(t)
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            if (rpArr[0] != t[i].ManualReview_1688_subject) {
                field.push("@.tw_name=null");
                field.push("@.ms_name=null");
                field.push("@.en_name=null");
                field.push("@.pt_name=null");
                field.push("@.es_name=null");
                field.push("@.th_name=null");
                field.push("@.vi_name=null");
                field.push("@.ManualReview_1688_subject=" + Tool.rpsql(rpArr[0]));
            }
            if (rpArr[1] != t[i].ManualReview_1688_description) {
                field.push("@.tw_description=null");
                field.push("@.ms_description=null");
                field.push("@.en_description=null");
                field.push("@.pt_description=null");
                field.push("@.es_description=null");
                field.push("@.th_description=null");
                field.push("@.vi_description=null");
                field.push("@.ManualReview_1688_description=" + Tool.rpsql(rpArr[1]));
            }
            if (field.length != 0) {
                field.push("@.ManualReview_1688_state=4");
                update.push("update @.table set " + field.join(",") + " where @.proid='" + t[i].proid + "'")
            }
        }
        this.d04(update)
    },
    d04: function (update) {
        if (update.length == 0) {
            this.d06();
        }
        else {
            this.d05(update)
        }
    },
    d05: function (update) {
        let data = []
        for (let i = 0; i < update.length; i++) {
            data.push({
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: update[i],
            })
        }
        Tool.ajax.a01(data, this.d06, this);
    },
    d06: function (t) {
        this.obj.A1++;
        this.d01();
    },
}
fun.a01();
