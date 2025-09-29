'use strict';
Object.assign(Tool, {
    common2:
    {
        a01: function (obj, seller, next, This, t) {
            let oo = {
                obj: obj,
                seller: seller,
                next: next,
                This: This,
                t: t,
                A1: obj.shopee.A1,
                A2: obj.shopee.A2
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.x1x2("A", oo.A1, oo.A2, this.a03, this, null, oo)
        },
        a03: function (oo) {
            if (!oo.obj._1688.category) {
                $("#state").html("类目名称丢失");
                oo.next = fun.a04
                oo.This = fun
                Tool.common5.e01(oo, 2, "类目名称丢失", oo.obj.shopee.GlobalPro.proid)
            } else if (!oo.obj._1688.category.bindshopee) {
                $("#state").html("没绑定类目");
                oo.next = fun.a04
                oo.This = fun
                Tool.common5.e01(oo, 3, "没绑定类目", oo.obj.shopee.GlobalPro.proid)
            } else if (!oo.obj._1688.prodes.attr) {
                $("#state").html("没绑定类目");
                oo.next = fun.a04
                oo.This = fun
                Tool.common5.e01(oo, 9, "没有属性", oo.obj.shopee.GlobalPro.proid)
            }
            else {
                let url1 = 'https://detail.1688.com/offer/' + oo.obj.shopee.GlobalPro.manualreview_1688_fromid + '.html';
                let url2 = 'https://seller.shopee.cn/portal/mtsku/' + oo.obj.shopee.GlobalPro.fromid + "?cnsc_shop_id=" + oo.seller["my"][0].shopId
                let html = '\
                    <tr><td class="right">1688详情页地址：</td><td colspan="2"><a href="' + url1 + '" target="_blank">' + url1 + '</a></td></tr>\
                    <tr><td class="right">Shopee商品ID：</td><td colspan="2"><a href="' + url2 + '" target="_blank">' + oo.obj.shopee.GlobalPro.fromid + '</a></td></tr>\
                    <tr><td class="right">商品编码：</td><td colspan="2">' + oo.obj.shopee.GlobalPro.proid + '</td></tr>\
                    <tr><td class="right">1688类目名称：</td><td colspan="2">' + oo.obj._1688.category.catnamepath + '</td></tr>\
                    <tr><td class="right">1688单位：</td><td colspan="2">' + oo.obj._1688.proList.unit + '</td></tr>\
                    <tr><td class="right">绑定到Shopee类目ID：</td><td colspan="2">' + oo.obj._1688.category.bindshopee + '</a></td></tr>'
                $("#tbody").append(html);
                //属性绑定。返回：类目路径，属性，绑定不了的属性
                Tool.attributes.a01(oo.obj._1688.category.bindshopee, JSON.parse(oo.obj._1688.prodes.attr), this.a04, this, oo)
            }
        },
        a04: function (o1, oo) {
            if (o1 == "属性值,想绑定,绑定不了，请查看原因。") {
                Tool.at("属性值,想绑定,绑定不了，请查看原因。")
                //this.f01(10, "属性值,想绑定,绑定不了，请查看原因。", oo.proid)
            }
            else if (o1 == "必填属性,必需要给一个值。") {
                Tool.pre("必填属性,必需要给一个值。")
                //this.f01(9, "必填属性,必需要给一个值。", oo.proid)
            }
            else {
                oo.obj.post = {
                    category_path: o1.category_path,
                    attributes: o1.attributes,
                    description: o1.description
                }
                let html = '\
                <tr><td class="right">category_path：</td><td colspan="2">' + oo.obj.post.category_path + '</td></tr>\
                <tr><td class="right">attributes：</td><td colspan="2"><textarea id="sql" rows="10" class="form-control form-control-sm">' + JSON.stringify(oo.obj.post.attributes, null, 2) + '</textarea></td></tr>'
                $("#tbody").append(html);
                this.d01(oo);
            }
        },
        /////////////////////////////////////////////
        b01: function (arr1, oo, shopeeFromid) {
            let o2 = oo.data.stock_list
            if (o2[0].item_id == shopeeFromid) {
                if (arr1.length == o2[0].model_stock_list.length) {
                    arr1 = this.b02(arr1, o2[0].model_stock_list)
                }
                else {
                    //pre([arr1,arr1.length+"|---------------|"+oo[0].model_stock_list.length,oo[0].model_stock_list])
                    //alert("俩边库存不一样长。")
                }
            }
            else { alert("商品ID，不对。。。") }
            return arr1
        },
        b02: function (arr1, arr2) {
            for (let i = 0; i < arr1.length; i++) {
                arr1[i].mtsku_model_id = arr2[i].model_id
                //arr1[i].stock_setting_list=[]
                //arr1[i].normal_price=null
            }
            return arr1
        },
        b03: function (arr) {
            for (let i = 0; i < arr.length; i++) {
                switch (arr[i].name) {
                    case "颜色": arr[i].name = "color"; break;
                    case "型号": arr[i].name = "model"; break;
                    case "尺码": arr[i].name = "size"; break;
                    case "规格": arr[i].name = "Specification"; break;
                    case "纯度": arr[i].name = "purity"; break;
                    case "颜色分类": arr[i].name = "sort by color"; break;
                    case "规格（长*宽）": arr[i].name = "length*width"; break;
                    case "": arr[i].name = ""; break;
                    case "片数": arr[i].name = "Number of pcs"; break;
                    case "尺寸": arr[i].name = "size"; break;
                    case "容量": arr[i].name = "capacity"; break;
                    case "图案": arr[i].name = "pattern"; break;
                    case "外观颜色": arr[i].name = "Exterior color"; break;
                    case "种类": arr[i].name = "type"; break;
                    case "层数（规格）": arr[i].name = "Specification"; break;
                    case "规格型号": arr[i].name = "models"; break;
                    case "规格类型": arr[i].name = "Specification type"; break;
                    case "款式": arr[i].name = "style"; break;
                    case "产品颜色": arr[i].name = "color"; break;
                    case "产品规格": arr[i].name = "Specifications"; break;
                    case "xxxx": arr[i].name = "xxx"; break;
                    default:
                        Tool.at("【" + arr[i].name + "】还没翻译");
                        arr = false;
                        break;
                }
            }
            return arr;
        },
        ////////////////////////////////////////////////////////////
        d01: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "item_id_list=" + oo.obj.shopee.GlobalPro.fromid,
                "cnsc_shop_id=" + oo.seller["my"][0].shopId,
                "cbsc_shop_region=my"
            ]
            let url = "https://seller.shopee.cn/api/v3/mtsku/get_mtsku_stock/?" + pArr.join("&")
            gg.getFetch(url, "json", this.d02, this, oo)
        },
        d02: function (t, oo) {
            if (t.code == 0) {
                let o1 = oo.obj._1688.prodes
                let sku = JSON.parse(o1.sku)
                if (sku.skuInfoMap) {
                    this.d03(t, sku, oo);
                }
                else {
                    oo.next = fun.a04
                    oo.This = fun
                    Tool.common5.e01(oo, 11, 'sku格式不对', oo.obj.shopee.GlobalPro.proid);
                    //Tool.pre('sku格式不对')
                }
            }
            else {
                oo.next = fun.a04
                oo.This = fun
                Tool.common5.e01(oo, 11, t.message, oo.obj.shopee.GlobalPro.proid)
                //Tool.pre(["出错123。。。。。", t]); 
            }
        },
        d03: function (t, sku, oo) {
            let sku_shopee = Tool.sku.a01(sku, JSON.parse(oo.obj._1688.prodes.attrpic_shopee), oo.obj._1688.proList.freight, oo.obj.shopee.GlobalPro.proid);
            if (sku_shopee.model_list) {
                sku_shopee.model_list = this.b01(sku_shopee.model_list, t, oo.obj.shopee.GlobalPro.fromid)//shopee要求这么做,把model_id加入进去。
                this.d04(sku_shopee, oo)
            }
            else {
                Tool.pre(["价格出错", sku_shopee])
            }
        },
        d04: function (sku_shopee, oo) {
            let arr = this.b03(sku_shopee.tier_variation);
            $("#tbody").append(' <tr><td class="right">sku：</td><td colspan="2"><textarea id="sql" rows="10" class="form-control form-control-sm">' + JSON.stringify(sku_shopee, null, 2) + '</textarea></td></tr>');
            if (arr) {
                if (typeof (sku_shopee) == "object") {
                    oo.obj.post.tier_variation = arr;
                    oo.obj.post.model_list = sku_shopee.model_list;
                    Tool.apply(oo.obj, oo.next, oo.This, oo.t);
                }
                else {
                    Tool.pre(["出错1111", sku_shopee])
                    //this.f01(5, o1, oo.proid);
                }
            }
        },
    },
})