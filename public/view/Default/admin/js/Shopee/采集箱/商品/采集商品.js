var fun =
{
    obj:
    {
        A1: 1, A2: 0, Aarr: [],
        B1: 1, B2: 0,
        siteNum: Tool.siteNum(obj.params.site, obj.params.num)
    },
    a01: function () {
        //obj.params.jsFile         选择JS文件        
        //obj.params.site           站点
        //obj.params.return         返回URL  
        Tool.loadJS("/" + o.path + "admin/js/Shopee/采集箱/config_" + this.obj.siteNum + ".js", this.a02, this)
    },
    a02: function () {
        let html = Tool.header(obj.params.return, "Shopee &gt; 采集箱 &gt; 商品 &gt; 采集商品") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle">\
            <tbody>\
		        <tr><td class="right w150">站点：</td><td colspan="2">'+ Tool.site(obj.params.site) + '</td></tr>\
 		        <tr><td class="right">第几个店铺：</td><td colspan="2">'+ obj.params.num + '</td></tr></tbody>\
                <tr><td class="right">关键词个数进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">关键词页进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
            </tbody>\
            </table>\
        </div>'
        Tool.html(this.a03, this, html);
    },
    a03: function () {
        let arr = [];
        for (let i = 0; i < config.length; i++) {
            if (config[i][3]) {
                arr.push(config[i][3])
            }
            else {
                break;
            }
        }
        this.obj.A2 = arr.length;;
        this.obj.Aarr = arr;
        gg.isRD(this.a04, this);
    },
    a04: function () {
        $("#state").html("正在删除【cookies】只是为了使用当地语言。");
        let www = this.b02(obj.params.site)
        if (www) {
            gg.delCookies("https://" + www + ".xiapibuy.com/", "language", this.d01, this)
        }
        else {
            Tool.at("程序终止。需要知道这个国家使用的搜索链接。")
        }
    },
    //////////////////////////////////////
    b02: function (site) {
        let www = ""
        switch (site) {
            case "tw": www = "xiapi"; break;
            case "vn":
            case "cl":
            case "co":
            case "ph":
            case "th":
            case "sg":
            case "my":
            case "br":
            case "mx":
                www = site; break;
        }
        return www;
    },
    /////////////////////////////////////////////////////////////////////////////////////////
    d01: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this, this.g02)
    },
    d02: function () {
        let url = "https://" + this.b02(obj.params.site) + ".xiapibuy.com/search?keyword=" + this.obj.Aarr[this.obj.A1 - 1] + "&page=0&sortBy=ctime";//搜索;
        gg.tabs_remove_create_indexOf(3, url, false, false, this.d03, this)
    },
    d03: function () {
        Tool.ajax.text("/" + o.path + "admin/js/Shopee/采集箱/商品/注入_翻页和显示完整内容.js", this.d04, this);
    },
    d04: function (t) {
        gg.tabs_executeScript_indexOf(3, ["jquery"], t + "\nfun01.a01()", ["商品个数：60=60=60</title>", 'class="NzsmWF"', 'class="mOGBQ4"'], false, this.d05, this)
    },
    d05: function (t) {
        if (t.indexOf('class="NzsmWF"') !== -1) {
            $("#state").html("要人工验证1。")
            //Tool.Time("name", 1000, this.d03, this);
        }
        else if (t.indexOf('class="mOGBQ4"') !== -1) {
            $("#state").html("要人工验证2。")
            Tool.Time("name", 1000, this.d06, this);
        }
        else {
            this.e01(t);
        }
    },
    d06: function (t) {
        gg.tabs_executeScript_indexOf(3, [], "", ['data-sqe="item">'], false, this.d03, this)
    },
    ///////////////////////////////////////////////////
    e01: function (t) {
        let itemArr = Tool.StrSplits(t, 'data-sqe="item">', "</li>")
        let itemidArr = [], shopidArr = [], titleArr = [], imageArr = [], priceArr = [], shop_locationArr = []
        for (let i = 0; i < itemArr.length; i++) {
            itemidArr.push(Tool.StrSlice(itemArr[i], "itemid=", "&"))
            shopidArr.push(Tool.StrSlice(itemArr[i], "shopid=", "\""))
            titleArr.push(Tool.StrSlice(itemArr[i], '.webp" alt="', "\""))
            imageArr.push(Tool.StrSlice(itemArr[i], '<div class="relative z-0 w-full pt-full"><img src="', "\""))
            priceArr.push(Tool.StrSlice(itemArr[i], '<span class="font-medium text-base/5 truncate">', "</span>"))
            shop_locationArr.push(Tool.StrSlice(itemArr[i], 'class="ml-[3px] align-middle">', "</span>"))
        }
        if (this.obj.B2 == 0) this.obj.B2 = Tool.int(Tool.StrSlice(t, 'class="shopee-mini-page-controller__total">', '</span>'));
        this.e02(itemidArr, shopidArr, titleArr, imageArr, priceArr, shop_locationArr)
    },
    e02: function (itemidArr, shopidArr, titleArr, imageArr, priceArr, shop_locationArr) {
        let data = []
        for (let i = 0; i < itemidArr.length; i++) {
            let arrL = [
                "@.itemid",
                "@.shopid",
                "@.title",
                "@.image",
                "@.price",
                "@.shop_location",
                "@.addtime",
            ]
            let price1 = priceArr[i].replace(/,/ig, "")
            let priceArr2 = price1.split(".")
            if (priceArr2.length == 3) {
                //如：1.310.000  转换成：1310.000 
                price1 = priceArr2[0] + priceArr2[1] + "." + priceArr2[2]
            }
            let arrR = [
                shopidArr[i],
                shopidArr[i],
                Tool.rpsql(titleArr[i]),
                Tool.rpsql(imageArr[i]),
                price1,
                Tool.rpsql(shop_locationArr[i]),
                Tool.gettime(""),
            ]
            let arrUp = []; for (let i = 0; i < arrL.length; i++) { arrUp.push(arrL[i] + "=" + arrR[i]); }
            ////////////////////////////////////////////////////////////////////////////////////////////////
            data.push({
                action: "sqlite",
                database: "shopee/采集箱/商品/" + this.obj.siteNum,
                sql: "select @.itemid as itemid from @.table where @.itemid=" + itemidArr[i],
                list: [{
                    action: "sqlite",
                    database: "shopee/采集箱/商品/" + this.obj.siteNum,
                    sql: "update @.table set " + arrUp.join(",") + " where @.itemid=" + itemidArr[i],
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/采集箱/商品/" + this.obj.siteNum,
                    sql: "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")",
                }]
            })
        }
        Tool.ajax.a01(data, this.f01, this);
    },
    ///////////////////////////////////////////////////////////////////////////
    f01: function () {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.f02, this, this.g01)
    },
    f02: function () {
        this.obj.B1++;
        if (this.obj.B1 > this.obj.B2) {//要不是点开【下一页】
            this.d03()
        }
        else {
            $("#state").html("注入_翻页和显示完整内容。")
            Tool.ajax.text("/" + o.path + "admin/js/Shopee/采集箱/商品/注入_翻页和显示完整内容.js", this.f03, this);
        }
    },
    f03: function (t) {
        //问：为什么不直接访问下一页？答：这样会很容易出现验证码。
        $("#state").html("正在打开下一页。");
        gg.tabs_executeScript_indexOf(3, ["jquery"], t + "\nfun01.d01(" + this.obj.B1 + ")", ["已打开下一页。", 'class="NzsmWF"'], false, this.f04, this)
    },
    f04: function (t) {
        if (t.indexOf('class="NzsmWF"') != -1) {
            $("#state").html("要人工验证3。")
        }
        else {
            this.d03();
        }
    },
    //////////////////////////////////////////
    g01: function () {
        this.obj.B1 = 1;
        this.obj.B2 = 0;
        $("#B1").css("width", "0%");
        $("#B1,#B2").html("")
        $("#state").html("翻页翻完。");
        this.obj.A1++;
        this.d01();
    },
    g02: function () {
        gg.highlightTab(1, this.g03, this)
    },
    g03: function (t) {
        this.obj.A1 = 1
        this.obj.A2 = 0
        this.obj.Aarr = []
    },

}
fun.a01();
// b01: function () {
//     let arr = config
//     let str1 = ""
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i][3]) {
//             str1 += '<option value="' + arr[i][3] + '">' + (i + 1) + '.' + arr[i][0] + '(' + arr[i][2] + ')</option>'
//         }
//         else {
//             break;
//         }
//     }
//     let str2 = '\
//     <select onChange="fun.c01(this.options[this.selectedIndex].value)" class="form-select" id="select01">\
//         <option value="">请选择关键词</option>\
//         '+ str1 + '\
//     </select>';
//     return str2;
// },
// let site = this.obj.siteNum, language = this.b01(site), www = this.b02(site)
// if (language) {
//     let cookies = [
//         {
//             "url": "https://" + www + ".xiapibuy.com/",
//             "cookies": [
//                 {
//                     "domain": ".xiapibuy.com",
//                     "hostOnly": false,
//                     "httpOnly": false,
//                     "name": "language",
//                     "path": "/",
//                     "sameSite": "unspecified",
//                     "secure": true,
//                     "session": false,
//                     "storeId": "0",
//                     "value": language
//                 }
//             ]
//         }
//     ]
//     Tool.pre(cookies)
//     gg.setAllCookies(cookies, this.d03, this, key)
// }
// else {
//     Tool.at("程序终止。需要知道这个国家使用的语言。")
// }