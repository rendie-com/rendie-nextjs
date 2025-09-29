Object.assign(Tool, {
    check_product_common3: {
        a01: function (_1688, next, This, t) {
            let oo = {
                _1688: _1688,
                next: next,
                This: This,
                t: t,
                A1: 1, A2: _1688.length,
            }
            this.a02(oo)
        },
        a02: function (oo) {
            if (oo.A1 <= oo.A2) {
                $("#state").html("【" + oo.A1 + "/" + oo.A2 + "】正在获取1688详情。。。");
                Tool.gatherDetail.a01(oo._1688[oo.A1 - 1].fromid, this.a03, this, oo)
            }
            else {
                Tool.apply(oo._1688, oo.next, oo.This, oo.t);
            }
        },
        a03: function (t, oo) {
            if (t.error) {
                Tool.pre(t)
            }
            else {
                oo._1688[oo.A1 - 1].images = t.pic;
                oo._1688[oo.A1 - 1].name = t.name;
                oo._1688[oo.A1 - 1].unit = this.b02(t.sku.startAmount, t.sku.sellUnit, t.unit);
                oo._1688[oo.A1 - 1].desArr = this.b01(t.attr);
                oo.A1++;
                this.a02(oo)
            }
        },
        ////////////////////////////////////////////////
        b01: function (attr) {
            let arr = []
            for (let i = 0; i < attr.length; i++) {
                arr.push(attr[i].name + "：" + attr[i].value)
            }
            return arr;
        },
        b02: function (startAmount, sellunit, unit) {
            let des1 = ""
            //注：在1688中看到如【按包起批1包=100个】的内容时，那在个单时只能填100的倍数。
            if (startAmount > 1) {
                des1 = "✅ 单位:" + sellunit + " (1件=1" + sellunit + ",1" + sellunit + "=" + startAmount + unit + ") \n"
            }
            else {
                des1 = "✅ 单位:" + unit + (unit == "件" ? "" : "(1件=1" + unit + ")") + " \n"
            }
            return des1;
        },
    },
});