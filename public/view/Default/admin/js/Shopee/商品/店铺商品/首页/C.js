'use strict';
Object.assign(fun,
    {
        c01: function (val) {
            let name = this.b07("" + val)
            $("#field").html(name).val(val)
        },
        c02: function () {
            let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
            if (field == "2" && isNaN(searchword)) {
                alert("【商品ID】必须是数字。")
            }
            else if (searchword) {
                Tool.main("jsFile=" + o.params.jsFile + "&site=" + o.params.site + "&page=1&field=" + field + "&searchword=" + searchword + "&num=" + o.params.num);
            } else { alert("请输入搜索内容"); }
        },
        c03: function (val) {
            if (val == "-2") {
                Tool.openR("jsFile=" + o.params.jsFile + "&jsFile2=09&site=" + o.params.site + "&num=" + o.params.num);
            }
            else if (val == "-3") {
                Tool.openR("jsFile=" + o.params.jsFile + "&jsFile2=08&site=" + o.params.site + "&num=" + o.params.num);
            }
            else {
                let arr = val.split("=");
                Tool.open(arr[0], arr[1]);
            }
        },
        c04: function (name, val) {
            if (val == "-1") {
                Tool.openR("jsFile=" + o.params.jsFile + "&jsFile2=03&site=" + o.params.site + "&num=" + o.params.num);
            }
            else {
                Tool.open(name, val);
            }
        },
        c05: function (name, val) {
            if (val == "-1") {
                Tool.openR("jsFile=" + o.params.jsFile + "&jsFile2=05&site=" + o.params.site + "&num=" + o.params.num);
            }
            else {
                Tool.open(name, val);
            }
        },
        c06: function (fromid) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + this.obj.siteNum,
                sql: "update @.table set @.status=-3 where @.fromid='" + fromid + "'",
            }]
            Tool.ajax.a01(data, Tool.reload)
        },
        c07: function (name, val) {
            let data = []
            if (val == "-2") {
                if (confirm('确定【全部商品设置为待更新】吗?')) {
                    data = [{
                        action: "sqlite",
                        database: "shopee/商品/店铺商品/" + this.obj.siteNum,
                        sql: "update @.table set @.self_uptime=" + Tool.gettime(""),
                    }]
                    Tool.ajax.a01(data, Tool.reload)
                }
            }
            else if (val == "-3") {
                if (confirm('确定【异常商品设置为待更新】吗?')) {
                    data = [{
                        action: "sqlite",
                        database: "shopee/商品/店铺商品/" + this.obj.siteNum,
                        sql: "update @.table set @.self_uptime=" + Tool.gettime("") + " where @.newDiscount>=80 or @.newDiscount<=8 or @.isSeckill=0",
                    }]
                }
                Tool.ajax.a01(data, Tool.reload)
            }
            else {
                Tool.open(name, val);
            }
        },
        c08: function (I, val) {
            if (val == "-2") {
                Tool.openR("jsFile=" + o.params.jsFile + "&jsFile2=06&site=" + o.params.site + "&num=" + o.params.num);
            }
            else {
                Tool.open(I, val);
            }
        },
    })