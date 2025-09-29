Object.assign(Tool, {
    common5: {
        //找出要修改的商品并删除要删除的商品。
        a01: function (seller, site, num, siteNum, session_id, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                siteNum: siteNum,
                session_id: session_id,
                next: next,
                This: This,
                t: t,
                ///////////////////////
                temp_newArr: [],
                discountArr: [],
            }
            this.a02(oo);
        },
        a02: function (oo) {
            $("#state").html("正在获取【尚未提交】，用来修改折扣。。。");
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/mkt/cmt/preview/preview_list?" + arr.join("&")
            let data = { "session_id": oo.session_id, "entity_type": [2] }
            $("#state").html("正在获取选中的商品。。。");
            gg.postFetch(url, JSON.stringify(data), this.a03, this, oo);
        },
        a03: function (t, oo) {
            $("#state").html("已获取选中的商品。。。");
            if (t.data.entity_list_data) {
                oo.preview_no = t.data.preview_no
                let idArr = [], newArr = [], arr = t.data.entity_list_data.recruiting_entities;
                for (let i = 0; i < arr.length; i++) {
                    idArr.push(arr[i].product.item_id)
                    ////////////////////////////////////////////////////
                    let nomination_ids = [], self_reference_price_by_shopee = [], current_stock = [];
                    for (let j = 0; j < arr[i].product.models.length; j++) {
                        self_reference_price_by_shopee.push(arr[i].product.models[j].pricing_application_info.reference_price_by_shopee)//shopee想要你设置的价格
                        nomination_ids.push(arr[i].product.models[j].nomination_id)//修改价时要用
                        current_stock.push(arr[i].product.models[j].current_stock)
                    }
                    newArr.push({
                        self_reference_price_by_shopee: self_reference_price_by_shopee,//shopee想要你设置的价格
                        nomination_ids: nomination_ids,//修改价时要用
                        original_price: Tool.int(arr[i].product.models[0].original_price),//我填写的价格-------我是统一设置价格，所以用第一个。
                        item_id: arr[i].product.item_id,//商品ID
                        current_stock: current_stock
                    })
                }
                oo.temp_newArr = newArr
                this.a04(idArr, oo)
            }
            else {
                this.d03({ code: 0 }, oo);
            }
        },
        a04: function (idArr, oo) {
            //@.isSignUp=1          表示【能报名】
            //@.isTrueSignUp=0      表示【未报名】 and @.isTrueSignUp=1 
            //@.status=1            表示【上架商品】
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("fromid,newDiscount,MinimumOrder") + " FROM @.table where @.status=1 and @.isSignUp=1 and @.fromid in(" + idArr.join(",") + ")",
            }]
            Tool.ajax.a01(data, this.a05, this, oo);
        },
        a05: function (t, oo) {
            let discountArr = [], self_del_ids = [], isErr = false, newArr = oo.temp_newArr;
            for (let i = 0; i < newArr.length; i++) {
                let o1 = this.b01(t[0], newArr[i].item_id)//找到来源ID对应的折扣和最小购买量。
                if (o1.newDiscount) {
                    let price = Math.round(newArr[i].original_price * (1 - o1.newDiscount / 100) / 1000) * 1000//价格
                    let o2 = this.b02(newArr[i].nomination_ids, price, newArr[i].self_reference_price_by_shopee, newArr[i].current_stock, o1.MinimumOrder * 5)
                    self_del_ids = [...self_del_ids, ...o2.self_del_ids]//删除时要用
                    if (o2.nomination_ids.length) {
                        discountArr.push({
                            "item_id": newArr[i].item_id,//显示给我看用的
                            "nomination_ids": o2.nomination_ids,//活动ID
                            "campaign_stock": o1.MinimumOrder * 5,//库存
                            "campaign_price": price
                        })
                    }
                }
                else {
                    Tool.pre(["找不到商品ID【" + newArr[i].item_id + "】对应的折扣，程序终止。", t[0], newArr[i].item_id])
                    isErr = true;
                    break;
                }
            }
            if (!isErr) {
                $("#state").html("【common5.js】完成。");
                oo.discountArr = discountArr;
                this.d01(self_del_ids, oo)
            }
        },
        ///////////////////////////////////////
        b01: function (arr, fromid) {
            let oo = {}
            for (let i = 0; i < arr.length; i++) {
                if ("" + arr[i].fromid == fromid) {
                    oo = arr[i];
                    oo.newDiscount = oo.newDiscount - 1;
                    break;
                }
            }
            return oo;
        },
        //【要卖的价格>原始价格】或【当前库存<活动数量】时要删除。
        b02: function (idArr, price, arr, current_stock, MinimumOrder) {
            let self_del_ids = [], nomination_ids = [];
            for (let i = 0; i < arr.length; i++) {
                if (price > arr[i] || current_stock[i] < MinimumOrder) {
                    self_del_ids.push(idArr[i])//要删除的
                }
                else {
                    nomination_ids.push(idArr[i])//要修改价格的
                }
            }
            return {
                self_del_ids: self_del_ids,
                nomination_ids: nomination_ids
            }
        },
        /////////////////////////////////////////////////////
        d01: function (self_del_ids, oo) {
            if (self_del_ids.length == 0) {
                this.d03({ code: 0 }, oo);
            }
            else {
                this.d02(self_del_ids, oo)
            }
        },
        d02: function (self_del_ids, oo) {
            let data = {
                "session_id": oo.session_id,
                "preview_no": oo.preview_no,
                "nomination_ids": self_del_ids
            }
            $("#state").html("正在删除【尚未提交】的商品。");
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/mkt/cmt/preview/delete?" + arr.join("&")
            gg.postFetch(url, JSON.stringify(data), this.d03, this, oo);
        },
        d03: function (t, oo) {
            /*
            {
              "code": 0,
              "data": null,
              "msg": null
            }
            */
            if (t.code == 0) {
                Tool.apply({
                    discountArr: oo.discountArr,
                    preview_no: oo.preview_no
                }, oo.next, oo.This, oo.t);
            }
            else {
                Tool.pre(["出错0006", t])
            }
        },
    }
})