'use strict';
var fun =
{
    obj: {
        siteNum: "",
        pagesize: 10
    },
    a01: function () {
        o.params.jsFile = o.params.jsFile ? o.params.jsFile : ""//选择JS文件
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页  
        o.params.site = o.params.site ? o.params.site : 'sg'//站点
        o.params.field = o.params.field ? o.params.field : '1'//搜索字段
        o.params.searchword = o.params.searchword ? Tool.Trim(o.params.searchword) : "";//搜索关键词
        o.params.title = o.params.title ? o.params.title : ""//标题
        o.params.price = o.params.price ? o.params.price : ""//定价
        o.params.activity = o.params.activity ? o.params.activity : ""//活动
        o.params.category = o.params.category ? o.params.category : ""//分类信息
        o.params.status = o.params.status ? o.params.status : ""//状态
        o.params.ExceptionType = o.params.ExceptionType ? o.params.ExceptionType : ""//商品异常类型
        o.params.info1688 = o.params.info1688 ? o.params.info1688 : ""//1688信息 
        o.params.num = o.params.num ? o.params.num : "1"//该站点的第几个店
        ///////////////////////////////////////////////////////////////////////
        this.obj.siteNum = Tool.siteNum(o.params.site, o.params.num);
        Tool.logistics.a01(o.params.site, null, this.a02, this)
    },
    a02: function (logistics) {
        let data = [{
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/卖家账户",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/卖家账户.db"],
                database: "shopee/卖家账户",
            }]
        }, {
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/商品/店铺商品/" + this.obj.siteNum,
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/商品/店铺商品/" + this.obj.siteNum + ".db"],
                database: "shopee/商品/店铺商品/" + this.obj.siteNum,
            }]
        }]
        Tool.ajax.a01(data, this.a03, this, logistics);
    },
    a03: function (t, logistics) {
        let where = this.b08();
        let data = [{
            action: o.DEFAULT_DB,
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }, {
            action: "sqlite",
            database: "shopee/商品/店铺商品/" + this.obj.siteNum,
            sql: "select count(1) as total FROM @.table" + where,
        }, {
            //promotion
            action: "sqlite",
            database: "shopee/商品/店铺商品/" + this.obj.siteNum,
            sql: "select " + Tool.fieldAs("fromid,isUnlisted,isTrueSignUp,unitWeight,discount,newDiscount,isDiscount,isSignUp,isSeckill,status,pic,proid,MinimumOrder,name,_1688_fromid,_1688_saleNum,_1688_maxPrice,_1688_MinimumOrder,_1688_freight,input_normal_price,self_uptime,price_uptime,uptime,addtime,scale,saleNum,note,ExceptionType") + " FROM @.table" + where + Tool.limit(this.obj.pagesize, o.params.page, "sqlite"),
        }, {
            action: o.DEFAULT_DB,
            database: "main",
            sql: "select @.value as value FROM @.config where @.name='" + o.params.template + "'",
        }]
        Tool.ajax.a01(data, this.a04, this, logistics);
    },
    a04: function (t, logistics) {
        let siteArr = JSON.parse(t[0][0].config)[o.params.site]
        let config = siteArr[Tool.int(o.params.num) - 1];
        let html1 = "", arr = t[2]
        for (let i = 0; i < arr.length; i++) {
            let oo = Tool.fixedPrice.a01(arr[i]._1688_maxPrice,
                arr[i].scale,
                arr[i]._1688_MinimumOrder,
                arr[i]._1688_freight,
                config,
                arr[i].unitWeight,
                logistics,
                arr[i].newDiscount);
            //////////////////////////////////////////////////////
            html1 += '\
            <tr>\
                <td class="p-0">'+ this.b11(arr[i].fromid, arr[i].proid, arr[i]._1688_fromid) + '</td>\
                <td>'+ this.b03(arr[i].pic) + '</td>\
                <td class="left p-0">' + this.b04(arr[i].name, config.shopId, arr[i].fromid, arr[i].isUnlisted, arr[i].isTrueSignUp, arr[i].promotion, arr[i].price_uptime, arr[i].addtime, arr[i].uptime, arr[i].self_uptime, arr[i].saleNum, arr[i].note) + '</td>\
                <td class="p-0">'+ this.b22(arr[i].input_normal_price, arr[i].discount, arr[i].newDiscount, config, oo) + '</td>\
                <td class="p-0">'+ this.b21(arr[i].isDiscount, arr[i].isSignUp, arr[i].isSeckill) + '</td>\
                <td class="p-0">'+ this.b15(arr[i].MinimumOrder, arr[i].input_normal_price, arr[i].scale, arr[i].newDiscount, arr[i]._1688_maxPrice, arr[i]._1688_freight, arr[i].unitWeight, logistics, 1, config) + '</td>\
                <td class="p-0">'+ this.b15(arr[i].MinimumOrder, arr[i].input_normal_price, arr[i].scale, arr[i].newDiscount, arr[i]._1688_maxPrice, arr[i]._1688_freight, arr[i].unitWeight, logistics, 2, config) + '</td>\
                <td class="p-0">'+ this.b15(arr[i].MinimumOrder, arr[i].input_normal_price, arr[i].scale, arr[i].newDiscount, arr[i]._1688_maxPrice, arr[i]._1688_freight, arr[i].unitWeight, logistics, 3, config) + '</td>\
                <td class="p-0">'+ this.b14(arr[i].MinimumOrder, arr[i].unitWeight, oo.min_purchase_limit) + '</td>\
                <td class="p-0">'+ this.b05(arr[i].status, arr[i].ExceptionType) + '</td>\
                <td class="p-0">'+ this.b09(arr[i]._1688_maxPrice, arr[i].scale, arr[i]._1688_saleNum, arr[i]._1688_freight, arr[i]._1688_MinimumOrder) + '</td>\
            </tr>';
        }
        //////////////////////////////////////////////////
        let html = Tool.header2(o.params.jsFile) + '\
		<div class="p-2">\
			<div style="top:6px;position:relative;">'+ this.b24() + '</div>' + Tool.tab(o.params.jsFile, o.params.site, siteArr, o.params.num) + this.b06() + '\
			<table class="table align-top table-hover center align-top">\
				<thead class="table-light">'+ this.b01(config, t[3]) + '</thead>\
				<tbody>'+ html1 + '</tbody>\
			</table>\
            ' + Tool.page(t[1][0].total, this.obj.pagesize, o.params.page) + '\
		</div>'
        Tool.html(this.a05, this, html);
    },
    a05: function () {
        $('[data-bs-toggle="tooltip"]').tooltip({
            //帮助：https://bootstrapdoc.com/docs/5.0/components/tooltips
            //帮助：https://blog.csdn.net/m0_49017085/article/details/130595296
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><pre class="tooltip-inner"></pre></div>',//为了换行
        });
        $('[data-bs-toggle="tooltip2"]').tooltip({ boundary: 'window' });
    },
}
fun.a01();