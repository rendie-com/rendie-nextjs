'use strict';
Object.assign(Tool, {
    //删除该站点类目
    common_delete_category:
    {
        a01: function (seller, site, num, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: Tool.int(num) - 1,
                next: next,
                This: This,
                t: t,
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/get_collection_draft_list/?" + arr.join("&")
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            $("#state").html("正在获取shopee空类目。。。");
            gg.getFetch(url, "json", this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (t.message == "success") {
                let arr = t.data.draft_list
                if (arr) {
                    let nArr = []
                    for (let i = 0; i < arr.length; i++) {
                        nArr.push(arr[i].id);
                    }
                    this.a04(nArr, oo);
                }
                else {
                    this.d01(oo);
                }
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        a04: function (nArr, oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/delete_collection_draft/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在删除shopee空类目。。。");
            let data = { "ids": nArr }
            gg.postFetch(url, JSON.stringify(data), this.a05, this, oo)
        },
        a05: function (t, oo) {
            if (t.message == "success") {
                this.d01(oo)
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        /////////////////////////////////////////////////////////////////////////
        d01: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
                "need_parent_shop_category=true"
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/get_collection_list/?" + arr.join("&")
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            $("#state").html("正在获取shopee类目。。。");
            gg.getFetch(url, "json", this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (t.message == "success") {
                let arr = t.data.list
                if (arr.length == 0) {
                    this.e01(oo)
                }
                else {
                    let nArr = []
                    for (let i = 0; i < arr.length; i++) {
                        nArr.push(arr[i].id);
                    }
                    this.d03(nArr, oo)
                }
            }
            else {
                Tool.pre(["出错", oo]);
            }
        },
        d03: function (nArr, oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/shopcategory/v4/category/batch_delete_category/?" + arr.join("&")
            $("#url").html(url + '【post】');
            $("#state").html("正在删除shopee有商品的类目。。。");
            let data = {
                "shop_category_ids": nArr
            }
            gg.postFetch(url, JSON.stringify(data), this.d04, this, oo);
        },
        d04: function (t, oo) {
            if (t.message == "success") {
                this.e01(oo)
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        ///////////////////////////////
        e01: function (oo) {
            $("#state").html("删除完成。。。");
            oo.next.apply(oo.This, [oo.t])
        },
    }
})







