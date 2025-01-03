'use strict';
Object.assign(Tool, {
    common_C:
    {
        obj: {
            C1: 1, C2: 0, Carr: [],
        },
        ///////////////////////////////////////////////////////
        a01: function (sku, attrPic_shopee, fromid, seller, next, This, t) {
            let oo = {
                sku: JSON.parse(sku),
                attrPic_shopee: attrPic_shopee ? JSON.parse(attrPic_shopee) : {},
                fromid: fromid,
                seller: seller,
                next: next,
                This: This,
                t: t,
            }
            this.a02(oo)
        },
        a02: function (oo) {
            $("#state").html("正在检查内容...");
            if (this.b01(oo.attrPic_shopee, oo.sku.skuProps)) {//图片是否都能找到
                $("#state").html("可以跳过")
                this.d05([[]], oo);
            }
            else {
                if (oo.sku.skuProps) {
                    this.a03(oo);
                }
                else {
                    $("#state").html("没有属性价格，只是单价格")
                    this.d05([[]], oo);
                }
            }
        },
        a03: function (oo) {
            $("#state").html("正在找图片...");
            let imgArr = []
            for (let i = 0; i < oo.sku.skuProps.length; i++) {
                let isImg = false;
                for (let j = 0; j < oo.sku.skuProps[i].value.length; j++) {
                    if (oo.sku.skuProps[i].value[j].imageUrl) { isImg = true; break; }
                }
                if (isImg) {
                    imgArr = oo.sku.skuProps[i].value;
                }
            }
            this.a04(imgArr, oo);
        },
        a04: function (imgArr, oo) {
            this.obj.C2 = imgArr.length;
            this.obj.Carr = imgArr;
            this.d01(oo)
        },
        b01: function (attrPic_shopee, skuProps) {//图片是否都能找到
            let isBool = false;
            if (skuProps) {
                if (attrPic_shopee) {
                    let _1688_attrPic = this.b02(skuProps)//取出1688属性图片         
                    if (attrPic_shopee.length == _1688_attrPic.length) {
                        if (attrPic_shopee.length == 0) {
                            isBool = true;
                        }
                        else {
                            isBool = this.b03(attrPic_shopee, _1688_attrPic)//在1688属性图中，是否都能找到上传到shopee的图。
                        }
                    }
                }
            }
            return isBool;
        },
        b02: function (skuProps) {//取出1688属性图片
            let nArr = []
            for (let i = 0; i < skuProps.length; i++) {
                for (let j = 0; j < skuProps[i].value.length; j++) {
                    if (skuProps[i].value[j].imageUrl) {
                        nArr = skuProps[i].value;
                        break;
                    }
                }
                if (nArr.length != 0) { break; }
            }
            return nArr
        },
        b03: function (attrPic_shopee, _1688_attrPic) {//在1688属性图中，是否都能找到上传到shopee的图。
            let isbool = false;//是否能找到
            for (let i = 0; i < _1688_attrPic.length; i++) {
                if (_1688_attrPic[i].imageUrl) {
                    isbool = this.b04(_1688_attrPic[i].imageUrl, attrPic_shopee)
                    if (isbool === false) {//只要有一次没找到，就是找不到。
                        break;
                    }
                }
            }
            return isbool;
        },
        //已上传的shopee图中，能不能找到1688的图片
        b04: function (url, arr) {
            let isbool = false;
            for (let j = 0; j < arr.length; j++) {
                if (arr[j]) {
                    if (url == arr[j].imageUrl) {
                        isbool = true;
                        break;
                    }
                }
            }
            return isbool;
        },
        ///////////////////////////////////////////
        d01: function (oo) {
            Tool.x1x2("C", this.obj.C1, this.obj.C2, this.d02, this, this.d04, oo)
        },
        d02: function (oo) {
            let fileurl = this.obj.Carr[this.obj.C1 - 1].imageUrl;
            if (fileurl) {
                Tool.upPic_Hash.a01(oo.fromid, fileurl, "#attr_pic1", "#attr_pic2", oo.seller, this.d03, this, oo);//上传图片_并保存
            }
            else {
                $("#state").html("空位置...");
                this.d03(null, oo);
            }
        },
        d03: function (src, oo) {
            this.obj.Carr[this.obj.C1 - 1].shopee = src;
            this.obj.C1++;
            this.d01(oo);

        },
        d04: function (oo) {
            $("#state").html("正在更新数据...");
            let data = [{
                action: "sqlite",
                database: "1688_prodes/" + Tool.remainder(oo.fromid, 99),
                sql: "update @.prodes set @.attrPic_shopee=" + Tool.rpsql(JSON.stringify(this.obj.Carr)) + " where @.fromid=" + oo.fromid
            }]
            Tool.ajax.a01(data, this.d05, this, oo);
        },
        d05: function (t, oo) {
            $("#state").html("【attrPic_shopee】更新成功...");
            this.obj.C1 = 1; this.obj.C2 = 0; this.obj.Carr = [];
            oo.next.apply(oo.This, [oo.t]);
        },
    },
})