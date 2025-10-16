'use strict';
Object.assign(Tool, {
    get_product_list: {
        a01: function (seller, site, num, progress, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                products: [],
                data: [],
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.download_sqlite.a01(["shopee/商品/店铺商品/" + oo.siteNum, "shopee/商品/全球商品"], this.a03, this, oo);
        },
        a03: function (t, oo) {
            $("#state").html("正在初始化。。。");
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "update @.table set @.status=0",//状态设置为【未知】
            }]
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            this.d01(oo);
        },
        //////////////////////////////////////////   
        b01: function (oo) {
            let isUnlisted = 1//0表示不能下架 1：可以下架
            if (oo.ongoing_campaigns) {
                let arr = oo.ongoing_campaigns;
                if (oo.upcoming_campaigns) {
                    arr = arr.concat(oo.upcoming_campaigns);
                }
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].campaign_type != 4 && arr[i].campaign_type != 8) {
                        isUnlisted = 0;
                        break;
                    }
                }
            }
            return isUnlisted
        },
        b02: function (oo) {
            let isTrueSignUp = 0//0 表示未报名活动 1：表示已报名活动
            if (oo.ongoing_campaigns) {
                let arr = oo.ongoing_campaigns;
                if (oo.upcoming_campaigns) {
                    arr = arr.concat(oo.upcoming_campaigns);
                }
                ///////////////////////////////////////
                //arr[i].campaign_type值如下：
                //1:"报名商品活动"
                //4:"加购优惠"
                //6:"报名Shopee直播"
                //7:"店内秒杀"
                //8:"折扣"
                /////////////////////////////
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].campaign_type == 1) {
                        isTrueSignUp = 1;
                        break;
                    }
                }
            }
            return isTrueSignUp
        },
        b03: function (arr) {
            let Rarr = [];
            for (let i = 0; i < arr.length; i++) {
                switch (arr[i]) {//选择JS文件
                    case "@.fromid": Rarr.push(arr[i] + "==来源ID"); break;
                    case "@.name": Rarr.push(arr[i] + "==标题"); break;
                    case "@.status": Rarr.push(arr[i] + "==状态"); break;
                    case "@.pic": Rarr.push(arr[i] + "==首图"); break;
                    case "@.proid": Rarr.push(arr[i] + "==全球商品货号"); break;
                    case "@.addtime": Rarr.push(arr[i] + "==添加时间"); break;
                    case "@.uptime": Rarr.push(arr[i] + "==更新时间"); break;
                    case "@.input_normal_price": Rarr.push(arr[i] + "==原价"); break;
                    case "@.promotion": Rarr.push(arr[i] + "==活动信息"); break;
                    case "@.model_list": Rarr.push(arr[i] + "==价格和价格ID信息"); break;
                    case "@.isUnlisted": Rarr.push(arr[i] + "==能不能下架"); break;
                    case "@.isTrueSignUp": Rarr.push(arr[i] + "==是否已报名活动"); break;
                    case "@.saleNum": Rarr.push(arr[i] + "==销量"); break;
                    default: Rarr.push(arr[i] + "==未知"); break;
                }
            }
            return Rarr.join("<br/>")
        },
        b04: function (arrL, arrR, site, siteNum, id, proid) {
            //self_uptime   本地更新时间（在添加商品时，目的就是要【该时间】大于【shopee更新时间】）
            let updateArr = []
            for (let i = 0; i < arrL.length; i++) {
                if (arrL[i] != "@.fromid") { updateArr.push(arrL[i] + "=" + arrR[i]); }
            }
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + siteNum,
                sql: "select @.id from @.table where @.fromid=" + id,
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + siteNum,
                    sql: "update @.table set " + updateArr.join(",") + "  where @.fromid=" + id,
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + siteNum,
                    sql: "insert into @.table(@.self_uptime," + arrL.join(",") + ")values(" + Tool.gettime("") + "," + arrR.join(",") + ")",
                }]
            }, {
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set @.is" + site + "=1 where @.proid=" + Tool.rpsql(proid),
            }]
            return data;
        },
        b05: function (promotion, model_list, siteNum, proid) {
            //@.promotion     活动信息
            //@.model_list    价格和价格ID信息
            let pronum = Tool.pronum(proid, 100)
            let data = {
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + siteNum + "/" + pronum,
                sql: "select @.id from @.table where @.proid='" + proid + "'",
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + siteNum + "/" + pronum,
                    sql: "update @.table set @.promotion=" + Tool.rpsql(JSON.stringify(promotion)) + ",@.model_list=" + Tool.rpsql(JSON.stringify(model_list)) + " where @.proid='" + proid + "'",
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + siteNum + "/" + pronum,
                    sql: "insert into @.table(@.promotion,@.model_list,@.proid)values(" + Tool.rpsql(JSON.stringify(promotion)) + "," + Tool.rpsql(JSON.stringify(model_list)) + ",'" + proid + "')",
                }]
            }
            return data;
        },
        b06: function (arr) {
            let num = 0;
            for (let i = 0; i < arr.length; i++) {
                num += arr[i].statistics.sold_count;
            }
            return num;
        },
        //////////////////////////////////////////   
        d01: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "page_number=" + oo.A1,
                "page_size=12",
                "list_type=all",
                "need_ads=true",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/opt/mpsku/list/v2/get_product_list?" + arr.join("&")
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            $("#state").html("正在获取第" + oo.A1 + "页商品。。。");
            gg.getFetch(url, "json", this.d02, this, oo);
        },
        d02: function (o1, o2) {            
            if (o1.code == 0) {
                o2.A2 = Math.ceil(o1.data.page_info.total / o1.data.page_info.page_size)
                o2.products = o1.data.products
                this.d03(o2)
            }
            //else if (o1.code == 429) {
            //     $("#state").html("请不要要求太频繁");
            //     //Tool.Time("name", 1000, this.d03, this,);
            //}
            // else if (o1.error == 90309999 || o1.message == null) {
            //     $("#state").html("访问不了,重试看行不行。");
            //     Tool.Time("name", 1000, this.d01, this, o2);
            // }
            else {
                Tool.pre(["出错：2025/8/12", o1])
            }
        },
        d03: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d04, this, this.e01, oo)
        },
        d04: function (oo) {
            let arrL = [
                "@.fromid",//来源ID
                "@.name",//标题
                "@.status",//状态
                "@.pic",//首图
                "@.proid",//全球商品货号
                "@.addtime",//添加时间
                "@.uptime",//更新时间
                "@.input_normal_price",//原价
                "@.isUnlisted",//能不能下架
                "@.isTrueSignUp",//是否已报名活动
                "@.saleNum",//销量
            ], data = [], sqlite_data = []
            for (let i = 0; i < oo.products.length; i++) {
                let arrR = [
                    oo.products[i].id,
                    Tool.rpsql(oo.products[i].name),
                    oo.products[i].status,
                    Tool.rpsql(oo.products[i].cover_image),
                    Tool.rpsql(oo.products[i].parent_sku),
                    oo.products[i].create_time,
                    oo.products[i].modify_time,
                    oo.products[i].model_list[0].price_detail.origin_price,//原价
                    this.b01(oo.products[i].promotion),
                    this.b02(oo.products[i].promotion), //是否已报名活动
                    this.b06(oo.products[i].model_list), //销量
                ]
                data.push(...this.b04(arrL, arrR, oo.site, oo.siteNum, oo.products[i].id, oo.products[i].parent_sku));
                data.push(this.b05(oo.products[i].promotion, oo.products[i].model_list, oo.siteNum, oo.products[i].parent_sku));
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                sqlite_data.push("shopee/商品/店铺商品/" + oo.siteNum + "/" + Tool.pronum(oo.products[i].parent_sku, 100))
            }
            $("#updateFields").html(this.b03(arrL));
            $("#state").html("正在更新本地商品状态。。。");
            oo.data = data;
            Tool.download_sqlite.a01(sqlite_data, this.d05, this, oo);
        },
        d05: function (t, oo) {
            Tool.ajax.a01(oo.data, this.d06, this, oo);
        },
        d06: function (t, oo) {
            oo.data = [];
            oo.products = [];
            oo.A1++;
            $("#state").html("正在进入第" + oo.A1 + "页。。。");
            Tool.Time("name", 0, this.d01, this, oo);
        },
        //////////////////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})