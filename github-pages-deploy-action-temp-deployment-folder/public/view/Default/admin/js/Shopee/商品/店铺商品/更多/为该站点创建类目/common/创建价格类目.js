'use strict';
Object.assign(Tool, {
    common_create_price_category:
    {
        obj: {
            C1: 1, C2: 10,//shopee只能创建10个子类目
            tw: {
                name: "⚡價格 $0-$",//价格
                currency: "$",
            },
            en: {
                name: "⚡Price RM0-RM",//价格
                currency: "RM",
            },
            pt: {
                name: "⚡Preço R$0-R$",//价格
                currency: "R$",
            },
            es: {
                name: "⚡precio $0-$",//价格
                currency: "$",
            },
            th: {
                name: "⚡ราคา $0-$",//价格
                currency: "$",
            },
            vi: {
                name: "⚡giá $0-$",//价格
                currency: "$",
            },
        },
        a01: function (seller, site, num, next, This, t) {
            this.obj.sg = this.obj.my;
            let oo = {
                seller: seller,
                site: site,
                siteLanguage:Tool.siteLanguage(site),
                num: Tool.int(num) - 1,
                next: next,
                This: This,
                t: t,
                I: (seller[site][Tool.int(num) - 1].fullPrice / 10),//包邮门槛，分成10份
                draft_id: 0,//空父类目ID（首次创建子类目要用）
                collection_list: [],//子类目ID调整顺序 
                parent_shop_category_id: 0,//父类目ID（俩次次上创建子类目要用）
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/create_collection_draft/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在创建shopee类目。。。");
            let data = {
                name: this.obj[oo.siteLanguage].name + oo.seller[oo.site][oo.num].fullPrice
            }
            gg.postFetch(url, JSON.stringify(data), this.a03, this, oo)
        },
        a03: function (t, oo) {
            /*
            {
              "code": 0,
              "message": "success",
              "data": {
                "draft_id": 46731
              }
            }
            */
            if (t.message == "success") {
                oo.draft_id = t.data.draft_id
                this.a04(oo);
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        a04: function (oo) {
            Tool.x1x2("C", this.obj.C1, this.obj.C2, this.d01, this, this.e01, oo)
        },
        ///////////////////////////////////////////
        d01: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = " https://seller.shopee.cn/api/shopcategory/v4/category/create_parent_or_sub_category/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在创建shopee子类目。。。");
            let data
            if (oo.parent_shop_category_id) {
                //俩次次上创建子类目
                data = {
                    "sub_shop_category": {
                        "name": this.obj[oo.siteLanguage].currency + ((this.obj.C1 - 1) * oo.I).toFixed(0) + "-" + this.obj[oo.siteLanguage].currency + (this.obj.C1 * oo.I).toFixed(0),
                        "collection_type": "rule_base",
                        "parent_shop_category_id": oo.parent_shop_category_id,
                        "collection_rule": {
                            "brand_ids": [],
                            "filter_price_min": Tool.fomatFloat((this.obj.C1 - 1) * oo.I, 0),
                            "filter_price_max": Tool.fomatFloat(this.obj.C1 * oo.I, 0),
                            "filter_with_discount": 0
                        }
                    }
                }
            }
            else {
                //首次
                data = {
                    "sub_shop_category": {
                        "name": this.obj[oo.siteLanguage].currency + "0-" + this.obj[oo.siteLanguage].currency + (this.obj.C1 * oo.I).toFixed(0),
                        "collection_type": "rule_base",
                        "to_delete_draft_id": oo.draft_id,
                        "parent_shop_category_name": this.obj[oo.siteLanguage].name + oo.seller[oo.site][oo.num].fullPrice,
                        "cover_image": "",
                        "collection_rule": {
                            "brand_ids": [],
                            "filter_price_max": Tool.fomatFloat(oo.I, 0),
                            "filter_with_discount": 0
                        }
                    }
                }
            }
            gg.postFetch(url, JSON.stringify(data), this.d02, this, oo)
        },
        d02: function (t, oo) {
            /*
           {
             "code": 0,
             "message": "success",
             "data": {
               "parent_shop_category_id": 251967340,
               "sub_shop_category_id": 251967341
             }
           }
           */
            if (t.message == "success") {
                oo.parent_shop_category_id = t.data.parent_shop_category_id;//父类目ID（俩次次上创建子类目要用）
                this.d03(t.data.sub_shop_category_id, oo);
            }
            else {
                Tool.pre(["出错01", t, this.obj.Aarr])
            }
        },
        d03: function (sub_shop_category_id, oo) {
            oo.collection_list.push({ "id": sub_shop_category_id, "sort_weight": 11 - this.obj.C1 });
            //////////////////////////////////////////////////////////////////////////////
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/update_category/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在启用shopee子类目。。。");
            let data = { "shop_category_id": sub_shop_category_id, "status": "active" }
            gg.postFetch(url, JSON.stringify(data), this.d04, this, oo)
        },
        d04: function (t, oo) {
            if (t.message = "message") {
                this.obj.C1++;
                this.a04(oo);
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        ///////////////////////////////////////////////////
        e01: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/update_shop_collection_sequence/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在调整顺序 。。。");
            let data = { "collection_list": oo.collection_list }
            gg.postFetch(url, JSON.stringify(data), this.e02, this, oo)
        },
        e02: function (t, oo) {
            if (t.message = "message") {
                $("#state").html("关键词完成。");
                oo.next.apply(oo.This, [oo.t])
            }
            else {
                Tool.pre(["出错", t])
            }
        },
    }
})