Object.assign(Tool, {  
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
                $("#state").html("不用翻译【" + oo.language + "】---跳过")
                Tool.apply(false, oo.next, oo.This, oo.t);
            }
            else {
                this.a03(oo)
            }
        },
        a03: function (oo) {
            $("#state").html("正在翻译成【" + oo.language + "】。。。")
            Tool.translate_name.a01(oo.str1, "zh-CN", oo.language, this.a04, this, oo)
        },
        a04: function (t, oo) {
            Tool.apply(t, oo.next, oo.This, oo.t);
        },
    },
})