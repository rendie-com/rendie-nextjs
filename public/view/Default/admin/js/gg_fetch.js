'use strict';
Object.assign(gg, {
    uploadFile: function (url, type, headers, data, next, This, t) {
        /*
        data格式如下：
        [{
            name: "target_img",
            value: "（二进制）https://rendie.com/view/Default/html/product/img/logo/logo.png",
            fileName: "captcha.jpg"
        },
        {
            name: "bg_img",
            value: "（二进制）https://rendie.com/view/Default/html/product/img/logo/logo.png",
            fileName: "captcha.jpg"
        },
        {
            name: "targetWidth",
            value: 80
        },
        {
            name: "bgWidth",
            value: 300
        }]
        注：（二进制）表示会把文件转成二进制后，再上传。
        上传文件       gg.uploadFile("https://rendie.com/ajax","json",headers,data,this.a02,this,"xxxxx")
        可走Headers监听路线，比如：修改“Origin”标头，胆会慢一点。
        */
        let oo = { action: "uploadFile", url: url, type: type, headers: headers, data: data }
        this.postMessage(next, This, t, oo)
    },
    ///////////////////////////////////////////////////////////////
    //gg.getFetch("https://www.aliexpress.com/item/1005002156462954.html","text",this.c01,this,t)
    //gg.getFetch(url, "gbk", this.a04, this)
    //gg.getFetch(url, "json", this.a04, this)
    getFetch: function (url, type, next, This, t) {
        let oo = { action: "getFetch", type: type, url: url }
        this.postMessage(next, This, t, oo)
    },
    //gg.getHeadersFetch(url,{"Authorization":"xxxxx"}, "json", this.xxxx, this)
    getHeadersFetch: function (url, headersObj, type, next, This, t) {
        let oo = { action: "getHeadersFetch", headersObj: headersObj, type: type, url: url }
        this.postMessage(next, This, t, oo)
    },
    //普通返回  gg.postFetch("https://www.aliexpress.com/item/1005002156462954.html",arr3,this.c01,this)
    postFetch: function (url, data, next, This, t) {
        let oo = { action: "postFetch", url: url, data: data }
        this.postMessage(next, This, t, oo)
    },
    //指定类型提交  gg.typeFetch(url, "DELETE", data, this.a08, this, "xxxxx")
    typeFetch: function (url, type, data, next, This, t) {
        let oo = { action: "typeFetch", url: url, type: type, data: data }
        this.postMessage(next, This, t, oo)
    },
    /*
        let body ="type=offer&cargoIdentity=731977718761&returnType=url&needTotalPrice=false&promotionSwitch=false&_csrf_token=cc736af52943226daac3c4a9a12d0275&t=1747833991058&purchaseType=&ext=%7B%22sceneCode%22%3A%22offerdetail%3Apc%3BipvId%3A213e360e17478339511078151eb68f%22%7D&specData=%5B%7B%22amount%22%3A1%2C%22specId%22%3A%227a5283b560ccdd0d80c29db04a761e49%22%2C%22selectedTradeServices%22%3A%5B%5D%7D%2C%7B%22amount%22%3A1%2C%22specId%22%3A%222cf1cfa58419fea7f98cabf857c1f039%22%2C%22selectedTradeServices%22%3A%5B%5D%7D%5D"
        gg.formDataFetch(url, data,"gbk", this.e02, this)
    */
    postBodyFetch: function (url, body, type, next, This, t) {
        let oo = { action: "postBodyFetch", url: url, body: body, type: type }
        this.postMessage(next, This, t, oo)
    },
})
////////////////////////////////////////////////
////返回值必须是Json,否则出错  (注：有的网站还必须要你Json提交，否则它给你报错)
////设置Headers信息post请求返回json		    gg.setHeaders_postHtml("https://www.aliexpress.com/item/1005002156462954.html",{},{},this.c01,this)
//setHeaders_postHtml: function (url, headers, data, next, This, t) {
//    let oo = { action: "setHeaders_postHtml", url: url, headers: headers, data: data }
//    this.postMessage(next, This, t, oo)
//}