var fun =
{
    obj:
    {
        A1: 1, A2: 100,
        B1: 1, B2: 1,
        shopId: 0,
        dbnameObj: {},
        siteNum: Tool.siteNum(o.params.site, o.params.num),
    },
    a01: function () {
        //o.params.jsFile         选择JS文件
        //o.params.return         返回URL  
        //o.params.site           站点 
        this.a02()
    },
    a02: function () {
        let html = Tool.header(o.params.return, "Shopee &gt; 采集箱 &gt; 粉丝 &gt; 获取我关注的用户") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle">\
            <tbody>\
		        <tr><td class="right w150">站点：</td><td colspan="2">'+ Tool.site(o.params.site) + '</td></tr>\
 		        <tr><td class="right">第几个店铺：</td><td colspan="2">'+ o.params.num + '</td></tr></tbody>\
		        <tr><td class="right">店铺ID：</td><td colspan="2" id="shopId"></td></tr>\
		        <tr><td class="right">数据库进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">粉丝页进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
            </tbody>\
            </table>\
        </div>'
        Tool.html(this.a03, this, html);
    },
    a03: function () {
        Tool.login.a01(this.a04, this);
    },
    a04: function (t) {
        this.obj.shopId = t[o.params.site][Tool.int(o.params.num) - 1].shopId;
        $("#shopId").html(this.obj.shopId)
        this.a05();
    },
    a05: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a06, this, this.d01)
    },
    a06: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/采集箱/粉丝/" + this.obj.siteNum + "/" + (this.obj.A1.toString().padStart(3, '0')),
            sql: "update @.table set @.is_my_following=0 where @.is_my_following=1",
        }]
        Tool.ajax.a01(data, this.a07, this);
    },
    a07: function (t) {
        this.obj.A1++;
        this.a05();
    },
    ////////////////////////////////
    d01: function () {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.d02, this, this.e01)
    },
    d02: function () {
        //【我关注的】来源：https://my.xiapibuy.com/shop/896010703/following/?__classic__=1
        let url = "https://" + (o.params.site == "tw" ? "xiapi" : o.params.site) + ".xiapibuy.com/api/v4/pages/get_followee_list?limit=20&offset=" + ((this.obj.B1 - 1) * 20) + "&shopid=" + this.obj.shopId;
        $("#state").html("正在获取店铺的粉丝。。。")
        gg.getFetch(url, "json", this.d03, this)
    },
    d03: function (t) {
        if (t.data) {
            if (!t.data.nomore) { this.obj.B2++; }
            if (t.data.accounts) {
                Tool.accounts.a01(t.data.accounts, {}, "@.is_my_following", this.obj.siteNum, this.d04, this)
            }
            else {
                $("#state").html("店铺的粉丝隐藏了，跳过。。。")
            }
        }
        else {
            Tool.pre(["出错", t])
        }
    },
    d04: function (dbnameObj) {
        $("#state").html("计数。")
        for (let k in dbnameObj) {
            if (this.obj.dbnameObj[k]) {
                this.obj.dbnameObj[k] += dbnameObj[k];
            }
            else {
                this.obj.dbnameObj[k] = dbnameObj[k];
            }
        }
        this.obj.B1++;
        this.d01()
    },
    ////////////////////////////////////////////////////
    e01: function () {
        if (!config[this.obj.siteNum]) { config[this.obj.siteNum] = { is_following: {}, is_my_following: {} }; }
        config[this.obj.siteNum].is_my_following = this.obj.dbnameObj;
        let data = [{
            action: "fs",
            fun: "writeFile",
            path: "public/" + o.path + "admin/js/Shopee/采集箱/粉丝/config.js",
            data: "let config=" + JSON.stringify(config, null, 2),
        }]
        Tool.ajax.a01(data, this.e02, this);
    },
    e02: function (t) {
        if (t[0] == "写入成功") {
            $("#state").html("全部完成。");
        }
        else { Tool.pre(["出错", t]); }
    },
}
fun.a01();