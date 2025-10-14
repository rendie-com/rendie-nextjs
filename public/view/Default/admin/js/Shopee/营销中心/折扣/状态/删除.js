'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,// 页进度
        seller: {},
        siteNum: Tool.siteNum(o.params.site, o.params.num),
    },
    a01: function () {
        //o.params.return               返回URL
        //o.params.site                 站点
        //o.params.self_status          自定义状态
        let html = Tool.header(o.params.return, "Shopee &gt; 营销中心 &gt; 折扣 &gt; 状态 &gt; 删除") + '\
        <div class="p-2">\
        <table class="table table-hover">\
            <tbody>\
   		        <tr><td class="right">站点：</td><td colspan="2">'+ Tool.site(o.params.site) + '</td></tr>\
                <tr><td class="right">第几个店铺：</td><td colspan="2">'+ o.params.num + '</td></tr>\
                <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
                <tr><td class="right">条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
            </tbody>\
        </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function (t) {
        this.obj.seller = t;
        this.a04();
    },
    a04: function () {
        $("#state").html("正在获取商品信息。。。");
        let where = " where @.self_status=" + o.params.self_status
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/折扣/" + this.obj.siteNum,
            sql: "select @.promotion_id as promotion_id FROM @.table" + where + " limit 1",
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/营销中心/折扣/" + this.obj.siteNum,
                sql: "select count(1) as total FROM @.table" + where,
            })
        }
        Tool.ajax.a01(data, this.a05, this);
    },
    a05: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].total; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d01, this, null, t[0])
    },
    ////////////////////////////////////////////////////////////////////////
    d01: function (arr) {
        let promotion_id = arr[0].promotion_id
        let pArr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[o.params.site][Tool.int(o.params.num) - 1].shopId,
            "cbsc_shop_region=" + o.params.site
        ]
        let url = "https://seller.shopee.cn/api/marketing/v4/discount/delete_stop_discount/?" + pArr.join("&")
        let data = '{"promotion_id":' + promotion_id + ',"action":1}'
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在删除。。。");
        gg.postFetch(url, data, this.d02, this, promotion_id)
    },
    d02: function (t, promotion_id) {
        if (t.error_msg == null) {
            $("#state").html("删除成功。");
            this.d03(promotion_id)
        }
        // else if (t.bff_meta == null) {
        //     $("#state").html("这个不给删除。【无效的活动期间，结束时间需晚于开始时间1小时以上】");
        //     this.d03(promotion_id)
        // }
        // else if (t.error_msg == "discount not exists") {
        //     $("#state").html("这个已经删除过了。");
        //     this.d03(promotion_id)
        // }
        else {
            Tool.pre(["出错【2025/10/14】", t])
        }
    },
    d03: function (promotion_id) {
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/折扣/" + this.obj.siteNum,
            sql: "delete from @.table where @.promotion_id=" + promotion_id,
        }]
        Tool.ajax.a01(data, this.d04, this);
    },
    d04: function (t) {
        this.obj.A1++;
        this.a04();
    },
}
fun.a01();