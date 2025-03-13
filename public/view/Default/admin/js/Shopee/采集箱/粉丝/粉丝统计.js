'use strict';
var fun =
{
    obj: {
        siteNum: "",
    },
    a01: function () {
        obj.params.jsFile = obj.params.jsFile ? obj.params.jsFile : ""//选择JS文件
        obj.params.site = obj.params.site ? obj.params.site : 'sg'//站点
        obj.params.num = obj.params.num ? obj.params.num : "1"//该站点的第几个店
        ///////////////////////////////////////////////////////////////////////
        this.obj.siteNum = Tool.siteNum(obj.params.site, obj.params.num);
        this.a02()
    },
    a02: function () {
        let data = [{
            action: "${default_db}",
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        let siteArr = JSON.parse(t[0][0].config)[obj.params.site]
        let tr = "", dbname, is_following, sum_is_following = 0, is_my_following, sum_is_my_following = 0
        if (!config[this.obj.siteNum]) { config[this.obj.siteNum] = { is_following: 0, is_my_following: 0 } }
        for (let i = 1; i < 101; i++) {
            dbname = i.toString().padStart(3, '0')
            is_following = config[this.obj.siteNum].is_following[dbname]
            if (!is_following) is_following = 0;
            if (is_following) sum_is_following += is_following
            is_my_following = config[this.obj.siteNum].is_my_following[dbname]
            if (!is_my_following) is_my_following = 0;
            sum_is_my_following += is_my_following;
            /////////////////////////////////////
            tr += '\
            <tr>\
              <td>'+ dbname + '</td>\
              <td>'+ (is_following ? is_following : '') + '</td>\
              <td>'+ is_my_following + '</td>\
            </tr>'
        }
        let html = Tool.header2(obj.params.jsFile, obj.params.site) + '\
        <div class="p-2">\
            '+ Tool.tab(obj.params.jsFile, obj.params.site, siteArr, obj.params.num) + Tool.header4(obj.params.site, 1) + '\
        	<table class="table align-middle table-hover center">\
        		<thead class="table-light">'+ this.b01(sum_is_following, sum_is_my_following) + '</thead>\
        		<tbody>'+ tr + '</tbody>\
        	</table>\
        </div>'
        Tool.html(null, null, html)
    },
    //////////////////////////////////////////////
    b01: function (sum_is_following, sum_is_my_following) {
        let html = '\
        <tr>\
          <th>数据库</th>\
          <th>关注我('+ sum_is_following + ')</th>\
          <th>我关注('+ sum_is_my_following + ')</th>\
          <th>我关注次数</th>\
          <th>我取关次数</th>\
        </tr>'
        return html;
    },
}
fun.a01();