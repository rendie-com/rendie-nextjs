'use strict';
Object.assign(Tool, {
    common_create_key_category:
    {
        obj: {
            A1: 1, A2: 0,
            B1: 1, B2: 10,//“关键词类目进度”shopee只能创建10个子类目

        },
        a01: function (seller, site, num, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: Tool.int(num) - 1,
                next: next,
                This: This,
                t: t,
                language: "",//表示要翻译的语言
                keys: {},//关键词
                draft_id: 0,//空父类目ID（首次创建子类目要用）
                keyObj: {},//关键词类目ID（判断是否重复用，和添加商品用的）
                keyArr: [],//已处理的关键词
                collection_list: [],//子类目ID调整顺序 
                parent_shop_category_id: 0,//父类目ID（俩次次上创建子类目要用）
                siteNum: Tool.siteNum(site, num),
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let where = " where @.status=1"
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                //“fromid”有什么用？答：创建子类目后放商品用的。
                sql: "select " + Tool.fieldAs("_1688_fromid,fromid") + " FROM @.table" + where + Tool.limit(10, this.obj.A1, "sqlite"),
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select " + Tool.fieldAs("ManualReview_1688_categoryId") + " FROM @.table where @.manualreview_1688_fromid=${_1688_fromid} limit 1",
                    list: [{
                        action: "sqlite",
                        database: "1688/类目/现货类目",
                        sql: "select @.catNamePath as catNamePath FROM @.table where @.fromid=${ManualReview_1688_categoryId} limit 1",
                    }]
                }]
            }]
            if (this.obj.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as Count FROM @.table" + where,
                })
            }
            $("#state").html("正在取出店铺商品的所有在1688的类目。。。");
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].Count; }
            let typeName
            for (let i = 0; i < t[0].length; i++) {
                typeName = t[0][i].list[0][0].list[0][0].catNamePath.split(">").pop()
                if (oo.keys[typeName]) {
                    oo.keys[typeName].push(t[0][i].fromid);
                }
                else {
                    oo.keys[typeName] = [t[0][i].fromid]
                }
            }
            $("#state").html("给【oo.keys】添加数据。。。");
            Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a04, this, this.d01, oo)
        },
        a04: function (oo) {
            this.obj.A1++;
            this.a02(oo);
        },
        /////////////////////////////////////////
        b01: function (site) {
            let language
            switch (site) {
                case "vn": language = "vi"; break;
                case "th": language = "th"; break;
                case "tw": language = "zh-TW"; break;
                case "ph":
                case "sg":
                case "sg2":
                case "my":
                    language = "en"; break;
                case "br": language = "pt"; break;
                case "cl":
                case "co":
                case "mx":
                case "mx2":
                    language = "es"; break;
            }
            return language
        },
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
        d01: function (oo) {
            let arr = []
            $("#state").html("排序一下");
            for (let k in oo.keys) {
                arr.push([k, oo.keys[k], oo.keys[k].length])
            }
            if (arr.length == 0) {
                $("#state").html("没有关键词跳出。");
            }
            else {
                arr.sort(function (A, B) {
                    return B[2] - A[2]
                })
                oo.keyArr = arr;//后面会用到。
                this.d02(oo)
            }
        },
        d02: function (oo) {
            $("#state").html("正在翻译。。。（需要开代理）");
            oo.language = this.b01(oo.site)
            if (oo.language) {
                Tool.translate_name.a01("热门关键词", "zh-CN", oo.language, this.d03, this, oo);
            }
            else {
                Tool.pre("未知的翻译语言。。。还没开发2025.1.19。。。")
            }
        },
        d03: function (t, oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/create_collection_draft/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在创建shopee主类目。。。");
            let data = {
                name: "🔥" + t//热门关键词
            }
            gg.postFetch(url, JSON.stringify(data), this.d04, this, oo)
        },
        d04: function (t, oo) {
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
                if (oo.keyArr.length < this.obj.B2) { this.obj.B2 = oo.keyArr.length }//确保“关键词类目”个数不出错。
                this.e01(oo);
            }
            else if (t.code == 340007) {
                Tool.at("类目已存在，请手动删除类目，再来。")
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        ///////////////////////////////////////////////////////////////////////
        e01: function (oo) {
            Tool.x1x2("B", this.obj.B1, this.obj.B2, this.e02, this, this.f01, oo)
        },
        e02: function (oo) {
            $("#state").html("正在翻译。。。（需要开代理）");
            Tool.translate_name.a01(oo.keyArr[this.obj.B1 - 1][0], "zh-CN", oo.language, this.e03, this, oo)
        },
        e03: function (name, oo) {
            oo.keyArr[this.obj.B1 - 1][3] = name//保存用，到时后采集商品的时间要用。
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/create_parent_or_sub_category/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在创建shopee子类目。。。");
            this.e04(name, url, oo)
        },
        e04: function (name, url, oo) {
            let data
            if (oo.parent_shop_category_id) {
                //俩次次上创建子类目
                data = {
                    "sub_shop_category": {
                        "name": Tool.titleCase(name),
                        "collection_type": "customized",
                        "parent_shop_category_id": oo.parent_shop_category_id,
                        "product_id_list": oo.keyArr[this.obj.B1 - 1][1]
                    }
                }
            }
            else {
                //首次
                data = {
                    "sub_shop_category":
                    {
                        "name": Tool.titleCase(name),
                        "collection_type": "customized",
                        "to_delete_draft_id": oo.draft_id,
                        "parent_shop_category_name": name,//热门关键词
                        "cover_image": "",
                        "product_id_list": oo.keyArr[this.obj.B1 - 1][1]
                    }
                }
            }
            gg.postFetch(url, JSON.stringify(data), this.e05, this, oo)
        },
        e05: function (t, oo) {
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
                oo.parent_shop_category_id = t.data.parent_shop_category_id;//父类目ID（俩次以上，创建子类目要用）
                this.e06(t.data.sub_shop_category_id, oo);
            }
            else if (t.code == 140000) {
                //还不知道哪里出错了
                this.e07({ message: "message" }, oo)
            }
            else if (t.code == 340009) {
                /*
                还不知道哪里出错了。
                {
                "code": 340009,
                "data": null,
                "message": "subCategoryNameDup"
                }
                */
                //Tool.pre(["还不知道哪里出错了。", t])
                this.e07({ message: "message" }, oo)
            }
            else {
                Tool.pre(["出错01", t, oo.keyArr[this.obj.B1 - 1]])
            }
        },
        e06: function (sub_shop_category_id, oo) {
            oo.collection_list.push({ "id": sub_shop_category_id, "sort_weight": this.obj.B2 + 1 - this.obj.B1 });
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
            gg.postFetch(url, JSON.stringify(data), this.e07, this, oo)
        },
        e07: function (t, oo) {
            if (t.message = "message") {
                this.obj.B1++;
                this.e01(oo);
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        ///////////////////////////////////////////////////
        f01: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/update_shop_collection_sequence/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在 调整顺序 。。。");
            let data = { "collection_list": oo.collection_list }
            gg.postFetch(url, JSON.stringify(data), this.f02, this, oo)
        },
        f02: function (t, oo) {
            if (t.message = "message") {
                $("#state").html("关键词完成。");
                this.f03(oo);
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        f03: function (oo) {
            //采集商品要用，采集店铺要用，生成首图水印，所以就保存到那里去了。
            let data = [{
                action: "fs",
                fun: "writeFile",
                path: "public/" + o.path + "admin/js/Shopee/采集箱/config_" + oo.siteNum + ".js",
                data: "let config=" + JSON.stringify(oo.keyArr, null, 2),
            }]
            Tool.ajax.a01(data, this.f04, this, oo);
        },
        f04: function (t, oo) {
            if (t[0] == "写入成功") {
                this.f05(oo);
            }
            else {
                Tool.pre(["出错", t]);
            }
        },
        f05: function (oo) {
            this.obj.A1 = 1; this.obj.A2 = 0;
            this.obj.B1 = 1;
            oo.next.apply(oo.This, [oo.t])
        },
    }
})






