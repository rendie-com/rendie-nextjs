var rendie_fun =
{
    a01: function () {
        $('.basic-info__arrow-icon').click();
        $('.shopee-checkbox__indicator').click();
        $('button[type="button"]').click();
        this.a02(0)
    },
    a02: function (count) {
        count++;
        $("title").html("计数：" + count)
        this.Time("name", 200, this.a03, this, count)
    },
    a03: function (count) {
        let html = $("body").html()
        if (html.indexOf("Authorized successful except some banned or deleted affiliate shops. For more information，please refer to the") != -1) {
            $("title").html("计数完成")
            document.querySelector("body > div.shopee-modal > div > div > div > div > div.shopee-modal__footer > div > button").click();
        }
        else { this.a02(count) }
    },
    TimeNameArr: [],//定时器名称
    Time: function (name, time, next, This, t) {//延时执行
        if (this.TimeNameArr[name]) {
            window.clearTimeout(this.TimeNameArr[name]);
            delete this.TimeNameArr[name];
        };
        //setTimeout() 方法用于在指定的毫秒数后调用函数或计算表达式。
        this.TimeNameArr[name] = window.setTimeout(function () {
            if (t == undefined) {
                next.apply(This);
            }
            else { next.apply(This, [t]); }
        }, time);
    },
}