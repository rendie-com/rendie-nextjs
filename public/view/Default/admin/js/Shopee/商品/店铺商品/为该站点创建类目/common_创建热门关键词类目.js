'use strict';
Object.assign(Tool, {
    common_create_key_category:
    {
        obj: {
            A1: 1, A2: 0,
            B1: 1, B2: 10,//“关键词类目进度”shopee只能创建10个子类目
            tw: {
                name: "🔥熱門關鍵字"//热门关键词
            },
            my: {
                name: "🔥Hot Keywords"//热门关键词
            },
            br: {
                name: "🔥Palavras-chave quentes"//热门关键词
            }
        },
        a01: function (seller, site, next, This, t) {
            this.obj.sg=this.obj.my;
            let oo = {
                seller: seller,
                site: site,
                next: next,
                This: This,
                t: t,
                keys: {},
                draft_id: 0,//空父类目ID（首次创建子类目要用）
                keyObj: {},//关键词类目ID（判断是否重复用，和添加商品用的）
                keyArr: [],//已处理的关键词
                collection_list: [],//子类目ID调整顺序 
                parent_shop_category_id: 0,//父类目ID（俩次次上创建子类目要用）
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let where = " where @.status=1"
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + obj.params.site,
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
                    database: "shopee/商品/店铺商品/" + obj.params.site,
                    sql: "select count(1) as Count FROM @.table" + where,
                })
            }
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
            Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a04, this, this.d01, oo)
        },
        a04: function (oo) {
            this.obj.A1++;
            this.a02(oo);
        },
        ///////////////////////
        d01: function (oo) {
            let arr = []
            $("#state").html("排序一下");
            for (let k in oo.keys) {
                arr.push([k, oo.keys[k], oo.keys[k].length])
            }
            if (arr.length == 0) {
                $("#state").html("没有关键词跳出。");
                //this.f03(oo)
            }
            else {
                arr.sort(function (A, B) {
                    return B[2] - A[2]
                })
                this.d02(arr, oo)
            }
        },
        d02: function (config, oo) {
            //采集商品要用，采集店铺要用，生成首图水印，所以就保存到那里去了。
            oo.keyArr = config;//后面会用到。
            let data = [{
                action: "fs",
                fun: "writeFile",
                path: "public/" + o.path + "admin/js/Shopee/采集箱/config_" + oo.site + ".js",
                data: "let config=" + JSON.stringify(config, null, 2),
            }]
            Tool.ajax.a01(data, this.d03, this, oo);
        },
        d03: function (t, oo) {
            if (t[0] == "写入成功") {
                this.d04(oo);
            }
            else {
                Tool.pre(["出错", t]);
            }
        },
        d04: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/create_collection_draft/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在创建shopee类目00000。。。");
            let data = {
                name: this.obj[oo.site].name//热门关键词
            }
            gg.postFetch(url, JSON.stringify(data), this.d05, this, oo)
        },
        d05: function (t, oo) {
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
                this.d06(oo);
            }
            else if (t.code == 340007) {
                Tool.at("类目已存在，请手动删除类目，再来。")
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        d06: function (oo) {
            Tool.x1x2("B", this.obj.B1, this.obj.B2, this.e01, this, this.f01, oo)
        },
        /////////////////////////////////////////////////////////////
        e01: function (oo) {
            if (oo.site == "tw") {
                $("#state").html("正在翻译成台湾语。。。（需要开代理）");
                Tool.translate_name.a01(oo.keyArr[this.obj.B1 - 1][0], "zh-CN", "zh-TW", this.e02, this, oo)
            }
            else if (oo.site == "my"||oo.site == "sg") {
                //正在翻译成英语。。。
                Tool.translate_name.a01(oo.keyArr[this.obj.B1 - 1][0], "zh-CN", "en", this.e02, this, oo)
            }
            else if (oo.site == "br") {
                //正在翻译成葡萄牙语。。。
                Tool.translate_name.a01(oo.keyArr[this.obj.B1 - 1][0], "zh-CN", "pt", this.e02, this, oo)
            }
            else {
                Tool.pre("还没开发。。。。")
            }
        },
        e02: function (t, oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/create_parent_or_sub_category/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在创建shopee子类目。。。");
            let data
            if (oo.parent_shop_category_id) {
                //俩次次上创建子类目
                data = {
                    "sub_shop_category": {
                        "name": Tool.titleCase(t),
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
                        "name": Tool.titleCase(t),
                        "collection_type": "customized",
                        "to_delete_draft_id": oo.draft_id,
                        "parent_shop_category_name": this.obj[oo.site].name,//热门关键词
                        "cover_image": "",
                        "product_id_list": oo.keyArr[this.obj.B1 - 1][1]
                    }
                }
            }
            gg.postFetch(url, JSON.stringify(data), this.e03, this, oo)
        },
        e03: function (t, oo) {
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
                this.e04(t.data.sub_shop_category_id, oo);
            }
            else if (t.code == 140000) {
                Tool.at("无法创建子类目，请重新【*获取【全部广告】信息】")
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
                this.e04({ message: "message" }, oo)
            }
            else {
                Tool.pre(["出错01", t, oo.keyArr[this.obj.B1 - 1]])
            }
        },
        e04: function (sub_shop_category_id, oo) {
            oo.collection_list.push({ "id": sub_shop_category_id, "sort_weight": this.obj.B2 + 1 - this.obj.B1 });
            //////////////////////////////////////////////////////////////////////////////
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/update_category/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在启用shopee子类目。。。");
            let data = { "shop_category_id": sub_shop_category_id, "status": "active" }
            gg.postFetch(url, JSON.stringify(data), this.e05, this, oo)
        },
        e05: function (t, oo) {
            if (t.message = "message") {
                this.obj.B1++;
                this.d06(oo);
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
                "cnsc_shop_id=" + oo.seller[oo.site].shopId,
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
            this.obj.A1 = 1; this.obj.A2 = 0;
            this.obj.B1 = 1;
            oo.next.apply(oo.This, [oo.t])
        },
    }
})