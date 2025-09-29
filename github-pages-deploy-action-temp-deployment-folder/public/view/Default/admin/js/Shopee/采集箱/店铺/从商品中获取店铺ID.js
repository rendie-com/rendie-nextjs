var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        siteNum: Tool.siteNum(o.params.site, o.params.num)
    },
    a01: function () {
        //o.params.jsFile         选择JS文件        
        //o.params.site           站点
        //o.params.return         返回URL  
        this.a02()
    },
    a02: function () {
        let html = Tool.header(o.params.return, "Shopee &gt; 采集箱 &gt; 商品 &gt; 从商品中获取店铺ID") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle">\
            <tbody>\
		        <tr><td class="right w150">站点：</td><td colspan="2">'+ Tool.site(o.params.site) + '</td></tr>\
 		        <tr><td class="right">第几个店铺：</td><td colspan="2">'+ o.params.num + '</td></tr></tbody>\
		        <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
            </tbody>\
            </table>\
        </div>'
        Tool.html(this.a03, this, html);
    },
    a03: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/采集箱/商品/" + this.obj.siteNum,
            sql: "select @.shopid as shopid, @.shop_location as shop_location from @.table" + Tool.limit(100, this.obj.A1),
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/采集箱/商品/" + this.obj.siteNum,
                sql: "select count(1) as total FROM @.table",
            })
        }
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = Math.ceil(t[1][0].total / 100); }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a05, this, null, t[0])
    },
    a05: function (arr) {
        let shopidArr = [], insertObj = {}, updateObj = {};
        for (let i = 0; i < arr.length; i++) {
            if (shopidArr.indexOf(arr[i].shopid) == -1) {//去重
                shopidArr.push(arr[i].shopid)
                ////////////////////////////////////////////
                let arrL = [
                    "@.shopid",
                    "@.shop_location",
                ]
                let arrR = [
                    arr[i].shopid,
                    Tool.rpsql(arr[i].shop_location),
                ]
                /////////////////////////////////////////////////
                let arrUp = []; for (let i = 0; i < arrL.length; i++) { arrUp.push(arrL[i] + "=" + arrR[i]); }
                insertObj[arr[i].shopid] = 'insert into @.table(' + arrL.join(",") + ')values(' + arrR.join(",") + ')'
                updateObj[arr[i].shopid] = 'update @.table set ' + arrUp.join(",") + ' where @.shopid=' + arr[i].shopid
            }
        }
        let data = [{
            action: "sqlite",
            database: "shopee/采集箱/店铺/" + this.obj.siteNum,
            sql: "select @.shopid as shopid from @.table where @.shopid in(" + shopidArr.join(",") + ")",
        }]
        Tool.ajax.a01(data, this.a06, this, [insertObj, updateObj]);
    },
    a06: function (t, sqlArr) {
        let arr = t[0], nArr = []
        for (let i = 0; i < arr.length; i++) {
            nArr.push(arr[i].shopid);
        }
        this.a07(nArr, sqlArr[0], sqlArr[1])
    },
    a07: function (shopidArr, insertObj, updateObj) {
        let data = []
        for (let k in insertObj) {
            if (shopidArr.indexOf(Tool.int(k)) == -1) {
                data.push({
                    action: "sqlite",
                    database: "shopee/采集箱/店铺/" + this.obj.siteNum,
                    sql: insertObj[k],
                })
            }
            else {
                data.push({
                    action: "sqlite",
                    database: "shopee/采集箱/店铺/" + this.obj.siteNum,
                    sql: updateObj[k],
                })
            }
        }
        Tool.ajax.a01(data, this.a08, this);
    },
    a08: function () {
        this.obj.A1++;
        this.a03();
    },
}
fun.a01();