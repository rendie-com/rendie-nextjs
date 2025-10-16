var fun =
{
    obj: {
        A1: 1, A2: 0,
    },
    a01: function () {
        let html = Tool.header(o.params.return, 'Shopee &gt; 商品 &gt; 全球商品 &gt; 手动审核1688状态 &gt; 上传讲解视频到shopee') + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
		        <tr><td class="right w150">商品条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">商品编码：</td><td id="proid" colspan="2"></td></tr></tbody>\
		        <tr><td class="right">1688详情ID：</td><td id="ManualReview_1688_fromid" colspan="2"></td></tr></tbody>\
		        <tr><td class="right">上传视频前地址：</td><td id="ExplanationVideoA" colspan="2"></td></tr></tbody>\
		        <tr><td class="right">上传视频后地址：</td><td id="ExplanationVideoB" colspan="2"></td></tr></tbody>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (t) {
        this.obj.seller = t;
        this.a04();
    },
    a04: function () {
        $("#state").html("正在获得配置参数");
        let where = " where @.isup=1 and @.ManualReview_1688_status=1 and @.ManualReview_1688_ExplanationVideo_status>3"
        let data = [{
            action: "sqlite",
            database: "shopee/商品/全球商品",
            sql: "select " + Tool.fieldAs("ManualReview_1688_fromid,proid") + " FROM @.table " + where + Tool.limit(1, this.obj.A1),
            list: [{
                action: "sqlite",
                database: "1688/采集箱/商品列表/详情/${id_1000:ManualReview_1688_fromid}",
                sql: "select " + Tool.fieldAs("ExplanationVideo") + " FROM @.table where @.fromid=${ManualReview_1688_fromid}"
            }, {
                action: "sqlite",
                database: "shopee/商品/全球商品/${proid_100:proid}",
                sql: "select " + Tool.fieldAs("ExplanationVideo") + " FROM @.table where @.proid='${proid}'"
            }]
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select count(1) as count FROM @.table" + where,
            })
        }
        Tool.ajax.a01(data, this.a05, this)
    },
    a05: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].count; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d01, this, null, t[0])
    },
    ////////////////////////////////////////////////////////
    d01: function (arr) {
        $("#proid").html(arr[0].proid)
        $("#ManualReview_1688_fromid").html('<a href="https://detail.1688.com/offer/' + arr[0].ManualReview_1688_fromid + '.html" target="_blank">' + arr[0].ManualReview_1688_fromid + '</a>')
        if (arr[0].list[0][0].ExplanationVideo) { arr[0].list[0][0].ExplanationVideo = "https:" + arr[0].list[0][0].ExplanationVideo; }
        let ExplanationVideo = arr[0].list[0][0].ExplanationVideo
        $("#ExplanationVideoA").html('<a href="' + ExplanationVideo + '" target="_blank">' + ExplanationVideo + '</a>');
        this.d02(ExplanationVideo, arr[0])
    },
    d02: function (ExplanationVideo, oo) {
        if (oo.list[1][0].ExplanationVideo || !ExplanationVideo) {
            //oo.list[1][0].ExplanationVideo        表示已上传过视频
            //!ExplanationVideo                     表示1688都没有视频
            $("#state").html("执行跳过")
            this.d04()
        }
        else {
            Tool.uploadShopeeVideo.a01(ExplanationVideo, this.obj.seller, "my", 1, this.d03, this, oo)
        }
    },
    d03: function (t, oo) {
        if (t.iserr) {
            this.d05(t.code, oo.ManualReview_1688_fromid)
        }
        else {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品/" + Tool.pronum(oo.proid, 100),
                sql: "update @.table set @.ExplanationVideo=" + Tool.rpsql(JSON.stringify(t)) + " where @.proid='" + oo.proid + "'"
            }]
            Tool.ajax.a01(data, this.d04, this)
        }
    },
    d04: function (t) {
        this.obj.A1++;
        $("#state").html("下一条。。。")
        $("#ManualReview_1688_fromid,#ExplanationVideoA,#ExplanationVideoB,#proid").html("");
        this.a04();
    },
    d05: function (ManualReview_1688_ExplanationVideo_status, ManualReview_1688_fromid) {
        let data = [{
            action: "sqlite",
            database: "shopee/商品/全球商品",
            sql: "update @.table set @.ManualReview_1688_ExplanationVideo_status=" + ManualReview_1688_ExplanationVideo_status + " where @.ManualReview_1688_fromid=" + ManualReview_1688_fromid
        }]
        Tool.ajax.a01(data, this.d04, this)
    },
}
fun.a01();