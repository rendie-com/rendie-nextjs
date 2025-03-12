Object.assign(Tool, {
    //为什么要拆成一行一行来翻译？答：因为一起翻译会翻译不出来。
    translate_description: {
        a01: function (str1, str2, language, next, This, t) {
            let oo = {
                Carr: str1.split("✅"),
                translateArr: [],//翻译好的结果放这里。
                C1: 1, C2: 0,
                str2: str2,
                language: language == "tw" ? "zh-TW" : language,//为什么有这个判断？答：tw是字段名。
                next: next,
                This: This,
                t: t,
                updateArr: []//更新时要用
            }
            oo.Carr.shift()
            oo.C2 = oo.Carr.length;
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.x1x2("C", oo.C1, oo.C2, this.a03, this, this.d01, oo)
        },
        a03: function (oo) {
            if (oo.str2) {          //.length > 100      
                $("#state").html("已有数据不用翻译【" + oo.language + "】---跳过");
                $("#C1").css("width", "0%");
                $("#C1,#C2").html("")
                Tool.apply(false, oo.next, oo.This, oo.t);
            }
            else {
                this.a04(oo);
            }
        },
        a04: function (oo) {
            let str = oo.Carr[oo.C1 - 1]
            $("#state").html("正在翻译成【" + str + "】。。。");
            Tool.translate_name.a01(str, "zh-CN", oo.language, this.a05, this, oo);
        },
        a05: function (t, oo) {
            oo.translateArr.push(t);
            oo.C1++;
            this.a02(oo)
        },
        //////////////////////////////////////////////////
        d01: function (oo) {
            let t = "✅" + oo.translateArr.join("✅")
            Tool.apply(t, oo.next, oo.This, oo.t);
        },
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    translate_site: {
        a01: function (str1, str2, language, next, This, t) {
            let oo = {
                str1: str1,
                str2: str2,
                language: language == "tw" ? "zh-TW" : language,
                next: next,
                This: This,
                t: t,
                updateArr: []//更新时要用
            }
            this.a02(oo);
        },
        a02: function (oo) {
            if (oo.str2) {
                $("#state").html("不用翻译【" + oo.language + "】---跳过");
                Tool.apply(false, oo.next, oo.This, oo.t);
            }
            else {
                this.a03(oo);
            }
        },
        a03: function (oo) {
            $("#state").html("正在翻译成【" + oo.language + "】。。。");
            Tool.translate_name.a01(oo.str1, "zh-CN", oo.language, this.a04, this, oo);
        },
        a04: function (t, oo) {
            Tool.apply(t, oo.next, oo.This, oo.t);
        },
    },
})