'use strict';
Object.assign(Tool, {
    common5:
    {
        obj: {
            bannedWord_keyouyun: [],
        },
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
            if (!this.obj.bannedWord_keyouyun) {
                $("#state").html("正在获禁限词。。。");
                let data = [{
                    action: "sqlite",
                    database: "shopee/客优云/违禁词",
                    sql: "select @.name as name FROM @.table where @.isWhitelist=0",
                }]
                Tool.ajax.a01(data, this.a03, this, oo);
            } else { this.d01(oo); }
        },
        a03: function (t, oo) {
            let arr = []
            for (let i = 0; i < t[0].length; i++) {
                arr.push(t[0][i].name)
            }
            this.obj.bannedWord_keyouyun = arr;
            this.d01(oo);
        },
        /////////////////////////////////////////////////////////
        b01: function (_description, manualreview_1688_description) {
            let DesArr = []
            if (!manualreview_1688_description || _description.split("\n")[0] != manualreview_1688_description.split("\n")[0]) {
                //单位不一样，也要修改一下。
                DesArr.push("@.manualreview_1688_description=" + Tool.rpsql(_description))
                //以前翻译的内容也要清空。
                DesArr.push("@.tw_description=null")
                DesArr.push("@.ms_description=null")
                DesArr.push("@.en_description=null")
                DesArr.push("@.pt_description=null")
                DesArr.push("@.es_description=null")
                DesArr.push("@.th_description=null")
                DesArr.push("@.vi_description=null")
            }
            return DesArr;
        },
        /////////////////////////////////////////////////////////
        d01: function (oo) {
            if (oo.obj.data.days_to_ship > 3) {
                $("#state").html("天货天数异常,发货天数为：" + oo.obj.data.days_to_ship + "天.")
                this.e01(oo, 15, "发货天数为：" + oo.obj.data.days_to_ship + "天", oo.obj.shopee.GlobalPro.proid)
            }
            else {
                this.d02(oo);
            }
        },
        d02: function (oo) {
            let str = JSON.stringify(oo.obj.data), arr = this.obj.bannedWord_keyouyun, isBool = true
            str = str.replace(/亚马逊|东南亚|进口|欧美|出口|外贸|跨境|速卖通|wish|药|哦|logo|医|amazon|非洲|分销|直销|独立站|工厂|代发|零售|加工定制|ebay|抖音同款|南美|微商|like|混批/g, "")
            for (let i = 1; i < arr.length; i++) {
                if (str.indexOf(arr[i]) != -1) {
                    Tool.pre(["有违禁词【" + arr[i]] + "】，请修改后再来。", data)
                    isBool = false; break;
                }
            }
            if (isBool) {
                let pArr = [
                    "SPC_CDS=" + oo.seller.SPC_CDS,
                    "SPC_CDS_VER=2",
                    "cnsc_shop_id=" + oo.seller["my"][0].shopId,
                    "cbsc_shop_region=my"
                ]
                let url = 'https://seller.shopee.cn/api/v3/mtsku/update_mtsku/?' + pArr.join("&")
                $("#state").html("更新商品。。。")
                gg.postFetch(url, str, this.d03, this, oo);
            }
        },
        d03: function (t, oo) {
            let GlobalPro = oo.obj.shopee.GlobalPro;
            if (t.code == 0) {
                this.d04(GlobalPro, oo);
            }
            else if (t.user_message == "There is duplicate tier option name and it cannot be duplicated") {
                this.e01(oo, 7, t.user_message, GlobalPro.proid)
            }
            else if (t.user_message == "lvs_mpsku_error_stock.mandatory_direct") {
                this.e01(oo, 11, t.message, GlobalPro.proid)
            }
            else if (t.user_message == "Update product failed") {
                Tool.pre(oo)
                $("#state").html("更新失败，延时1秒后重式。")
                //Tool.Time("name", 1000, this.d01, this)
            }
            else if (t.user_message == "Model number should be less than 100" || t.user_message == "SKU number should be less than 100") {
                this.e01(oo, 8, t.user_message, GlobalPro.proid)
            }
            else if (t.user_message.indexOf("Product DTS value") != -1) {
                this.e01(oo, 12, t.user_message, GlobalPro.proid)
            }
            else if (t.transify_key == "ps_basicservice_error_10025") {
                this.e01(oo, 17, t.user_message, GlobalPro.proid)
            }
            else if (t.user_message.indexOf("Option name length") != -1) {
                this.e01(oo, 13, t.user_message, GlobalPro.proid)
            }
            else if (t.user_message.indexOf("of the cheapest variation is out of limit7") != -1) {
                this.e01(oo, 14, t.user_message, GlobalPro.proid)
            }
            else if (t.user_message == "Your attribute info is invalid. Please fill in the category related attributes with correct attribute value") {
                $("#state").html("您的属性信息无效，请填写类别相关属性的正确属性值。")
                //this.e01(oo, 9, t.user_message, GlobalPro.proid)
            }
            else if (t.code == 1000310495) {
                //"message": "failed to update mtsku : validation: [Rule Type: media.image.exist, Detail: {\"code\":1211,\"msg\":\"image not exists: sg-11134201-7rdyu-m1bjpttmfd\"}] ",
                this.e01(oo, 16, t.user_message, GlobalPro.proid)
                //Tool.pre(t)
            }
            else {
                //let err = t.message     
                //if (err.length > 255) { err = err.substr(0, 252) + "..."; }
                //this.e01(oo,2, err, proid)
                Tool.pre(["更新出错", t])
            }
        },
        d04: function (GlobalPro, oo) {
            let arr = [
                '@.uptime=' + Tool.gettime(""),
                '@.BeforeReview=1',
                '@.err=null',
            ], DesArr = this.b01(GlobalPro._description, GlobalPro.list[0][0].manualreview_1688_description)
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set " + arr.join(",") + "  where @.proid='" + GlobalPro.proid + "'",
            }]
            if (DesArr.length != 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/全球商品/" + Tool.pronum(GlobalPro.proid, 100),
                    sql: "update @.table set " + DesArr.join(",") + "  where @.proid='" + GlobalPro.proid + "'",
                })
            }
            $("#state").html("更新成功，正在保存结果。。。")
            Tool.ajax.a01(data, this.e02, this, oo);
        },
        /////////////////////////////////////
        e01: function (oo, BeforeReview, err, proid) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set @.BeforeReview=" + BeforeReview + ",@.err=" + Tool.rpsql(err) + ",@.uptime=" + Tool.gettime("") + " where @.proid='" + proid + "'",
            }]
            $("#state").html(["更新成功，准备下一条。。。", JSON.stringify(data)])
            Tool.ajax.a01(data, this.e02, this, oo)
        },
        e02: function (t, oo) {
            //$("#state").html("更新成功，准备下一条。。。")
            $("#tbody").html("");
            oo.next.apply(oo.This, [oo.t]);
        },
    },
})