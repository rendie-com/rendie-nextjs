'use strict';
var fun =
{
    obj: {
        A1: 1, A2: 0,
    },
    a01: function () {
        //obj.arr[4]    返回URL
        let html = Tool.header(obj.params.return, "1688 &gt; 采集箱 &gt; 次商品列表 &gt; 修复【一级类目ID】") + '\
        <div class="p-2">\
          <table class="table  align-middle table-hover">\
            <tbody>\
                <tr><td class="right w150">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                <tr><td class="right">提示：</td><td id="state" colspan="2">...</td></tr>\
            </tbody>\
          </table>\
        </div>';
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        gg.isRD(this.a03, this)
    },
    a03: function () {
        let data = [{
            action: "sqlite",
            database: "1688",
            sql: "select @.categoryId as categoryId FROM @.proList where @.categoryId1=0 order by @.categoryId asc limit 100",
            list: [{
                action: "sqlite",
                database: "1688/类目/现货类目",
                sql: "select @.upid as upid FROM @.table where @.fromID=${categoryId}",
                list: [{
                    action: "sqlite",
                    database: "1688/类目/现货类目",
                    sql: "select @.upid as upid FROM @.table where @.fromID=${upid}",
                    list: [{
                        action: "sqlite",
                        database: "1688/类目/现货类目",
                        sql: "select @.upid as upid FROM @.table where @.fromID=${upid}",
                        list: [{
                            action: "sqlite",
                            database: "1688/类目/现货类目",
                            sql: "select @.upid as upid FROM @.table where @.fromID=${upid}",
                            list: []
                        }]
                    }]
                }]
            }]
        }, {
            action: "sqlite",
            database: "1688",
            sql: "select count(1) as total FROM @.proList where @.categoryId1=0",
        }]
        $("#state").html("正在获取商品信息...");
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
         this.obj.A2 = Math.ceil(t[1][0].total / 100); 
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a05, this, this.d01, t[0]);
    },
    a05: function (arr) {
        let data = [], rArr = []
        for (let i = 0; i < arr.length; i++) {
            if (rArr.indexOf(arr[i].categoryId) == -1) {
                rArr.push(arr[i].categoryId);//去重复
                data.push({
                    action: "sqlite",
                    database: "1688",
                    sql: "update @.proList set @.categoryId1=" + this.b01(arr[i].list[0][0]) + " where @.categoryId=" + arr[i].categoryId
                })
            }
        }
        $("#state").html("正在更新一级类目...");
        Tool.ajax.a01(data, this.a03, this);
    },
    /////////////////////////////////////
    b01: function (oo) {
        let upid = -1;//如果1688有了新类目，那我这里就是“-1”了。
        if (oo&&oo.upid) {
            upid = oo.upid;
            oo=oo.list[0][0]
            if (oo && oo.upid) {
                upid = oo.upid
                oo=oo.list[0][0]
                if (oo && oo.upid) {
                    upid = oo.upid
                    oo=oo.list[0][0]
                    if (oo && oo.upid) {
                        upid = oo.upid
                        oo=oo.list[0][0]
                        if (oo && oo.upid) {
                            upid = oo.upid
                        }
                    }
                }
            }
        }
        // if (!upid) {
        //     Tool.pre(["找不到一级类目，程序终止。",oo])
        //     aaaaaaaaaaaaaaaa
        // }
        return upid
    },
}
fun.a01()