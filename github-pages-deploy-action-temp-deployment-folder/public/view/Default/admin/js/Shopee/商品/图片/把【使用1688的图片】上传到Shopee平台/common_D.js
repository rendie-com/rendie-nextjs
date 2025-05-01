'use strict';
Object.assign(Tool, {
    common_D:
    {
        obj: {
            D1: 1, D2: 0,
        },
        ///////////////////////////////////////////////////////
        a01: function (des, desPic_shopee, fromid, seller, next, This, t) {
            let oo = {
                desImgArr: this.b01(des),
                desPic_shopee: desPic_shopee ? JSON.parse(desPic_shopee) : {},
                fromid: fromid,
                seller: seller,
                next: next,
                This: This,
                t: t,
                isEdit: false//初始化，是否修改【desPic_shopee】字段。
            }
            if (oo.desImgArr) {
                this.obj.D2 = oo.desImgArr[1].length;
                this.a02(oo)
            } else {
                this.e02([], oo);
            }
        },
        a02: function (oo) {
            Tool.x1x2("D", this.obj.D1, this.obj.D2, this.a03, this, this.e01, oo)
        },
        a03: function (oo) {
            let url = oo.desImgArr[1][this.obj.D1 - 1]
            if (oo.desPic_shopee[url] && oo.desPic_shopee[url] != "不是图片") {
                this.d04(oo);
            }
            else {
                oo.isEdit = true;
                this.a04(oo.desImgArr[0][this.obj.D1 - 1], oo)
            }
        },
        a04: function (img, oo) {
            let width = Tool.StrSlice(img, 'width="', '"')
            let height = Tool.StrSlice(img, 'height="', '"')
            if (width || height) {
                if (Tool.int(width) < 400 || Tool.int(height) < 400) {
                    this.d03("width<400||height<400", oo);//width<400||height<400   表示这个已处理，免得下次还要进来
                }
                else {
                    this.d01(oo);
                }
            }
            else {
                this.d01(oo);
            }
        },
        //////////////////////////////////////////
        //取出图片src
        b01: function (html) {
            let reg = /<img.*?>/ig
            // 提取出html中所有的img标签
            if (!html) {
                return null;
            }
            let arr = html.match(reg)
            if (arr == null) {
                return null;
            }
            else {
                let reg1 = /\s+src=['"](.*?)['"]/i
                let arr1 = arr.map(item => {
                    if (item.match(reg1)) {//有时后img标签里面没有src属性。
                        return item.match(reg1)[1];
                    }
                    else { return null; }
                });
                return [arr, arr1];
            }
        },
        ////////////////////////////////////
        d01: function (oo) {
            let url = oo.desImgArr[1][this.obj.D1 - 1]
            Tool.getImgBase64.a01(url, this.d02, this, oo)
        },
        d02: function (t, oo) {
            if (t.width < 400 || t.height < 400) {
                $("#des_pic1,#des_pic2").append('<figure class="figure border m-1 p-1">width<400||height<400</figure>')
                this.d03("width<400||height<400", oo);//width<400||height<400   表示这个已处理，免得下次还要进来
            }
            else if (t.base64) {
                Tool.upPic_Hash.a01(oo.fromid, t.base64, "#des_pic1", "#des_pic2", oo.seller, this.d03, this, oo);//上传图片_并保存
            } else {
                $("#des_pic1,#des_pic2").append('<figure class="figure border ml-1 mb-1 mt-1 p-1">[不是图片]</figure>')
                this.d03("[不是图片]", oo);//不是图片   表示这个已处理，免得下次还要进来
            }
        },
        d03: function (src, oo) {
            oo.desPic_shopee[oo.desImgArr[1][this.obj.D1 - 1]] = src;
            this.d04(oo)
        },
        d04: function (oo) {
            this.obj.D1++;
            this.a02(oo);
        },
        //////////////////////////////////////////////////////
        e01: function (oo) {
            if (oo.isEdit) {
                $("#state").html("正在更新数据...");
                let data = [{
                    action: "sqlite",
                    database: "1688_prodes/" + Tool.remainder(oo.fromid, 99),
                    sql: "update @.prodes set @.desPic_shopee=" + Tool.rpsql(JSON.stringify(oo.desPic_shopee)) + " where @.fromid=" + oo.fromid
                }]
                Tool.ajax.a01(data, this.e02, this, oo);
            }
            else {
                this.e02([], oo);
            }
        },
        e02: function (t, oo) {
            this.obj.D1 = 1;
            this.obj.D2 = 0;
            oo.next.apply(oo.This, [oo.t])
        },
    },
})