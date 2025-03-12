'use strict';
Object.assign(Tool, {
    common_B:
    {
        //上传放大镜图
        obj: { B1: 1, B2: 0 },
        a01: function (pic, pic_shopee, fromid, seller, next, This, t) {
            let oo = {
                pic: JSON.parse(pic),
                pic_shopee: pic_shopee ? JSON.parse(pic_shopee) : {},
                fromid: fromid,
                seller: seller,
                next: next,
                This: This,
                t: t,
                isEdit: false//初始化，是否修改【pic_shopee】字段。
            }
            $("#state").html("正在检查内容...");
            this.obj.B2 = oo.pic.length;
            this.a02(oo)
        },
        a02: function (oo) {
            Tool.x1x2("B", this.obj.B1, this.obj.B2, this.a03, this, this.a05, oo)
        },
        a03: function (oo) {
            let url = oo.pic[this.obj.B1 - 1]
            if (oo.pic_shopee[url]) {
                this.obj.B1++;
                this.a02(oo);
            }
            else {
                oo.isEdit = true;
                Tool.upPic_Hash.a01(oo.fromid, url, "#pic1", "#pic2", oo.seller, this.a04, this, oo);//上传图片_并保存
            }
        },
        a04: function (src, oo) {
            if (src) {//一个橡素的图片是上传不了的。
                oo.pic_shopee[oo.pic[this.obj.B1 - 1]] = src;
            }
            this.obj.B1++;
            this.a02(oo);
        },
        a05: function (oo) {
            if (oo.isEdit) {
                $("#state").html("正在更新数据...");
                let data = [{
                    action: "sqlite",
                    database: "1688_prodes/" + Tool.remainder(oo.fromid, 99),
                    sql: "update @.prodes set @.pic_shopee=" + Tool.rpsql(JSON.stringify(oo.pic_shopee)) + " where @.fromid=" + oo.fromid
                }]
                Tool.ajax.a01(data, this.a06, this, oo);
            }
            else {
                this.a06([], oo);
            }
        },
        a06: function (t, oo) {
            this.obj.B1 = 1;
            this.obj.B2 = 0;
            oo.next.apply(oo.This, [oo.t])
        },
    },
})