Object.assign(Tool, {
    check_product_common2: {
        a01: function (obj, next, This, t) {
            let oo = {
                obj: obj,
                next: next,
                This: This,
                t: t,
                A1: 1, A2: 0,//商品种类进度
                Aarr: [],
                B1: 1, B2: 0,//详情翻译进度              
                shopee: [],
                _1688: [],
            }
            this.a02(oo);
        },
        a02: function (oo) {
            oo.obj.order.order_items = JSON.parse(oo.obj.order.order_items);
            let sku = [], order_items = oo.obj.order.order_items;
            for (let i = 0; i < order_items.length; i++) {
                if (sku.indexOf(order_items[i].product.sku) == -1) {
                    sku.push(order_items[i].product.sku);
                }
            }
            ////////////////////////////////////////////////////
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.obj.siteNum,
                sql: "select " + Tool.fieldAs("_1688_fromid,proid,fromid") + " FROM @.table where @.proid in('" + sku.join("','") + "')",
            }];
            $("#state").html("已获得1688商品ID。。。");
            oo.A2 = sku.length;
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (t[0].length == oo.A2) {
                oo.Aarr = t[0];
                this.d01(oo)
            }
            else {
                let str = "订单中的商品，在1688中找不到。<br/>shopee【@.proid】：" + len + "个，1688【@.proid】：" + t[0].length + "个。"
                $("#state").html(str);
                Tool.Modal('报错提示', str, '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>', 'modal-l');
            }
        },
        ////////////////////////////////////////////////////////////////
        b01: function (images, name, description, fromid, site, shopId) {
            let desArr = [], arr = description.split("\n");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == "") {
                    break;
                }
                else {
                    desArr.push(arr[i]);
                }
            }
            return {
                fromid: fromid,
                site: site,
                shopId: shopId,
                images: images,
                name: [name],
                desArr: [desArr, []],
            }
        },
        ////////////////////////////////////////////////////////////////
        d01: function (oo) {
            if (oo.A1 <= oo.A2) {
                this.d02(oo)
            }
            else {
                this.e05(oo);
            }
        },
        d02: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.obj.SPC_CDS,
                "SPC_CDS_VER=2",
                "product_id=" + oo.Aarr[oo.A1 - 1].fromid,
                "is_draft=false",
                "cnsc_shop_id=" + oo.obj.seller[oo.obj.site][oo.obj.num - 1].shopId,
                "cbsc_shop_region=" + oo.obj.site
            ]
            let url = "https://seller.shopee.cn/api/v3/product/get_product_info?" + pArr.join("&");
            $("#state").html("正在获取shopee商品信息。。。")
            gg.getFetch(url, "json", this.d03, this, oo)
        },
        d03: function (t, oo) {
            if (t.msg == "success") {
                this.d04(t.data.product_info, oo)
            }
            else {
                Tool.pre(["获取shopee商品信息出错", t])
            }
        },
        d04: function (t, oo) {
            oo._1688[oo.A1 - 1] = { fromid: oo.Aarr[oo.A1 - 1]._1688_fromid };
            oo.shopee[oo.A1 - 1] = this.b01(t.images, t.name, t.description_info.description, oo.Aarr[oo.A1 - 1].fromid, oo.obj.site, oo.obj.seller[oo.obj.site][oo.obj.num - 1].shopId);
            oo.siteLanguage = Tool.siteLanguage(oo.obj.site)
            Tool.translate_name.a01(oo.shopee[oo.A1 - 1].name[0], oo.siteLanguage, "zh-CN", this.d05, this, oo)
        },
        d05: function (t, oo) {
            oo.shopee[oo.A1 - 1].name[1] = t;
            oo.B2 = oo.shopee[oo.A1 - 1].desArr[0].length;
            this.e01(oo)
        },
        ////////////////////////////////////////
        e01: function (oo) {
            if (oo.B1 <= oo.B2) {
                $("#state").html("正在翻译详情【" + oo.B1 + "/" + oo.B2 + "】。。。")
                Tool.translate_name.a01(oo.shopee[oo.A1 - 1].desArr[0][oo.B1 - 1], oo.siteLanguage, "zh-CN", this.e02, this, oo)
            }
            else {
                this.e03(oo);
            }
        },
        e02: function (t, oo) {
            oo.shopee[oo.A1 - 1].desArr[1].push(t);
            oo.B1++;
            this.e01(oo)
        },
        e03: function (oo) {
            let des = oo.shopee[oo.A1 - 1].desArr[1][0]

            oo.shopee[oo.A1 - 1].unit = des;
            this.e04(oo)
        },
        e04: function (oo) {
            oo.B1 = 1; oo.B2 = 0;
            oo.A1++;
            this.d01(oo)
        },
        e05: function (oo) {
            let data = {
                shopee: oo.shopee,
                _1688: oo._1688
            }
            Tool.apply(data, oo.next, oo.This, oo.t);
        },
    },
});