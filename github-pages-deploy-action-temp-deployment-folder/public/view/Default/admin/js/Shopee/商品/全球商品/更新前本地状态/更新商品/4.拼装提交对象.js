'use strict';
Object.assign(Tool, {
    common4:
    {
        a01: function (obj, seller, next, This, t) {
            let oo = {
                obj: obj,
                seller: seller,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let deliverylimit = this.b01(oo.obj._1688.proList.deliverylimit)//发货天数
            let data = {
                name: oo.obj.post.name,
                brand_id: 1145793,//1145793：表示品牌名称【Malaysia Collection】
                description: oo.obj.post.descriptionArr[0],
                description_type: "normal",
                images: oo.obj.post.images,//要9张图片
                video_list: this.b02(oo.obj.shopee.GlobalPro.ManualReview_1688_video_status, oo.obj.shopee.GlobalPro.video, oo.obj.shopee.GlobalPro.ManualReview_1688_ExplanationVideo_status, oo.obj.shopee.GlobalPro.ExplanationVideo),
                category_path: oo.obj.post.category_path,
                attributes: oo.obj.post.attributes,
                size_chart: "",
                tier_variation: oo.obj.post.tier_variation,
                model_list: oo.obj.post.model_list,
                weight: oo.obj.post.unitweight < 0.01 ? "0.01" : oo.obj.post.unitweight.toFixed(2),//注：这个最小值，只能填写0.01。
                dimension: { width: 0, height: 0, length: 0 },
                days_to_ship: deliverylimit.day,
                condition: 1,
                seller_sku: oo.obj.shopee.GlobalPro.proid,
                mtsku_item_id: oo.obj.shopee.GlobalPro.fromid,
                ds_cat_rcmd_id: ""
            }
            let html = '\
            <tr><td class="right">视频：</td><td colspan="2"><textarea id="sql" rows="10" class="form-control form-control-sm">' + (data.video_list ? JSON.stringify(data.video_list, null, 2) : '') + '</textarea></td></tr>\
            <tr><td class="right">标题：</td><td colspan="2">' + oo.obj.post.name + '</td></tr>\
            <tr><td class="right">放大镜图：</td><td colspan="2">' + oo.obj.post.images.join("<br/>") + '</td></tr>\
            <tr><td class="right">重量：</td><td colspan="2">' + oo.obj.post.unitweight + ' KG</td></tr>\
            <tr><td class="right">发货天数：</td><td colspan="2">' + deliverylimit.day + '天</a></td></tr>'
            $("#tbody").append(html);
            //下面二行，主要添加标题和重量，以后有内容，就用这个内容更新数据
            oo.obj.shopee.GlobalPro._name = oo.obj.post.name
            oo.obj.shopee.GlobalPro._unitweight = oo.obj.post.unitweight.toFixed(2)
            oo.obj.shopee.GlobalPro._description = oo.obj.post.descriptionArr[1];
            oo.obj.data = data
            Tool.apply(oo.obj, oo.next, oo.This, oo.t);
        },
        /////////////////////////////////////////////
        b01: function (deliverylimit) {
            let oo = {
                day: deliverylimit,
                msg: ""
            }
            if (deliverylimit) {
                if (deliverylimit < 4) {
                    oo.day = 2
                }
                else {
                    $("#state").html("发货天数异常4天");
                    oo.msg = "发货天数超过4天";
                }
            }
            else {
                $("#state").html("发货天数异常");
                oo.msg = "发货天数异常。";
            }
            return oo
        },
        b02: function (ManualReview_1688_video_status, video, ManualReview_1688_ExplanationVideo_status, ExplanationVideo) {
            let video_list = []
            if (video && ManualReview_1688_video_status > 5) {
                video_list = JSON.parse(video)
            }
            else if (ExplanationVideo && ManualReview_1688_ExplanationVideo_status > 5) {
                video_list = JSON.parse(ExplanationVideo)
            }
            return video_list;
        },
    },
})