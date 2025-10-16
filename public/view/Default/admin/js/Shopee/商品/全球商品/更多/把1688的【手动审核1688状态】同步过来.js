'use strict';
var fun =
{
    obj: {
        A1: 1, A2: 0
    },
    a01: function () {
        //o.params.return    返回URL
        let html = Tool.header(o.params.return, "Shopee &gt; 商品列表 &gt; 全球商品 &gt; 更多 &gt; 把1688的【手动审核1688状态】同步过来") + '\
        <div class="p-2">\
          <table class="table  align-middle table-hover">\
          <tbody>\
		    <tr><td class="right w150">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr>\
                <td class="right">说明：</td>\
                <td colspan="2">\
                    手动审核1688状态：1688 &gt; 采集箱 &gt; 【1688】主商品列表 &gt; 手动审核1688状态<br/>\
                    更新字段有：<br/>\
                    [@.ManualReview_1688_status]                    表示手动审核1688状态。<br/>\
                    [@.manualreview_1688_fromid]                    表示手动审核1688后来源ID。<br/>\
                    [@.ManualReview_1688_categoryId]                表示手动审核1688后分类ID，主要来来绑定shopee类目用的。<br/>\
                    [@.ManualReview_1688_categoryId1]               表示手动审核1688后一级分类ID，按类目上传要用。<br/>\
                    [@.ManualReview_1688_state]                     表示手动审核1688后商品状态，主要看是不是404用的。<br/>\
                    [@.ManualReview_1688_video_status]              人工审核主视频状态<br/>\
                    [@.ManualReview_1688_ExplanationVideo_status]   人工审核讲解视频状态<br/>\
                    [@.ManualReview_1688_bindShopee_categoryId]     人工审核后绑定shopee类目ID<hr/>\
                    注：[@.ManualReview_1688_subject]    标题字段<b>不要同步过来</b>，这个只在更新【全球商品】时只做首次添加。（就是无则添加，有则不更新，因为这个要人工修改用的。）<br/>\
                    注：[@.ManualReview_1688_unitWeight] 手动审核1688后单位重量，<b>不要同步过来</b>（原因：同上）。<br/>\
               </td></tr>\
		    <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        //ManualReview=9    手动审核状态：图片且详情审核通过
        let where = " where @.ManualReview_1688_status>0"
        //let where = " where @.proid='R368542'"
        let data = [{
            action: "sqlite",
            database: "1688/采集箱/平台关联",
            sql: "select " + Tool.fieldAs("ManualReview_1688_status,manualreview_1688_fromid,ManualReview_video_status,ManualReview_ExplanationVideo_status,proid,ManualReview_1688_fromid") + " FROM @.table" + where + Tool.limit(30, this.obj.A1),
            list: [{
                action: "sqlite",
                database: "1688/采集箱/商品列表/${id_100:manualreview_1688_fromid}",
                sql: "select " + Tool.fieldAs("categoryId,categoryId1,state,unitWeight,subject") + " FROM @.table where @.fromid=${manualreview_1688_fromid} limit 1",
                list: [{
                    action: "sqlite",
                    database: "1688/类目/现货类目",
                    sql: "select @.bindShopee as bindShopee FROM @.table where @.fromid=${categoryId} limit 1",
                }]
            }, {
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select " + Tool.fieldAs("ManualReview_1688_subject,ManualReview_1688_unitWeight") + " FROM @.table where @.proid='${proid}' limit 1",
            }]
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "1688/采集箱/平台关联",
                sql: "select count(1) as count FROM @.table" + where,
            })
        }
        $("#state").html("正在获取敦煌商品...");
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = Math.ceil(t[1][0].count / 30); }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a04, this, null, t[0]);
    },
    a04: function (arr) {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            let bindShopee = 0;
            if (arr[i].list[0][0].categoryId && arr[i].list[0][0].list[0][0]) {
                bindShopee = arr[i].list[0][0].list[0][0].bindShopee;
            }
            let updateArr = [
                "@.ManualReview_1688_ExplanationVideo_status=" + arr[i].ManualReview_ExplanationVideo_status,
                "@.ManualReview_1688_video_status=" + arr[i].ManualReview_video_status,
                "@.ManualReview_1688_status=" + arr[i].ManualReview_1688_status,
                "@.manualreview_1688_fromid=" + arr[i].manualreview_1688_fromid,
                "@.ManualReview_1688_state=" + (arr[i].list[0][0].state ? arr[i].list[0][0].state : 0),
                "@.ManualReview_1688_categoryId=" + (arr[i].list[0][0].categoryId ? arr[i].list[0][0].categoryId : 0),
                "@.ManualReview_1688_categoryId1=" + (arr[i].list[0][0].categoryId1 ? arr[i].list[0][0].categoryId1 : 0),
                "@.ManualReview_1688_bindShopee_categoryId=" + bindShopee,
            ]
            if (!arr[i].list[1][0].ManualReview_1688_subject) { updateArr.push("@.ManualReview_1688_subject=" + Tool.rpsql(arr[i].list[0][0].subject)); }
            if (!arr[i].list[1][0].ManualReview_1688_unitWeight) { updateArr.push("@.ManualReview_1688_unitWeight=" + arr[i].list[0][0].unitWeight); }
            data.push({
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set " + updateArr.join(",") + " where @.proid='" + arr[i].proid + "'",
            })
        }
        Tool.ajax.a01(data, this.a05, this)
    },
    a05: function (t) {
        this.obj.A1++;
        this.a02();
    },
}
fun.a01();