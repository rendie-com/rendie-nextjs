var fun =
{
    a01: function () {
        o.params.jsFile = o.params.jsFile ? o.params.jsFile : ""//选择JS文件
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页  
        this.a02();
    },
    a02: function () {
        let data = [{
            action: o.DEFAULT_DB,
            database: "shopee/任务/定时任务",
            sql: "select " + Tool.fieldAs("id,taskname,runuser,runtime,nexttime,runcycle,isenable,priority") + " FROM @.table order by @.runuser,@.isenable desc,@.priority asc" + Tool.limit(20, o.params.page, o.DEFAULT_DB),
        }]
        if (o.params.page == 1) {
            data.push({
                action: o.DEFAULT_DB,
                database: "shopee/任务/定时任务",
                sql: "select count(1) as count FROM @.table",
            })
        }
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let html = '', arr = Tool.getArr(t[0], o.DEFAULT_DB);
        for (let i = 0; i < arr.length; i++) {
            html += '\
            <tr>\
                <td>'+ arr[i].runuser + ' </td>\
                <td>' + arr[i].priority + '</td>\
                <td>'+ (arr[i].isenable ? '<font color="blue">已开启</font>' : '已关闭') + '</td>\
                <td style="padding-left: 30px;position: relative;" class="left">'+ this.b02(arr[i].id) + arr[i].taskname + '</td>\
                <td>'+ this.b04(arr[i].runcycle) + '</td>\
                <td>'+ Tool.js_date_time2(arr[i].runtime) + '</td>\
                <td>'+ Tool.js_date_time2(arr[i].nexttime) + '</td>\
            </tr>'
        }
        html = Tool.header2(o.params.jsFile) + '\
        <div class="p-2">\
            <table class="table table-hover align-middle center">\
                <thead class="table-light center">'+ this.b01() + '</thead>\
                <tbody>'+ html + '</tbody>\
            </table>' + Tool.page(t[1][0].count, 20, o.params.page) + '\
        </div>'
        Tool.html(null, null, html);
    },
    b01: function () {
        let str = '\
        <tr>\
            <th class="w100">执行者用户名</th>\
            <th class="w70">优先级</th>\
            <th class="w70">状态</th>\
            <th style="padding-left:25px;position: relative;" class="left">'+ this.b03() + '任务名称</th>\
            <th class="w120">执行周期</th>\
            <th class="w170">运行时时间</th>\
            <th class="w170">下次运行时间</th>\
        </tr>'
        return str
    },
    b02: function (id) {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false" id="dropdown0"><div></div><div></div><div></div></button>\
		<ul class="dropdown-menu" aria-labelledby="dropdown0">\
			<li><a class="dropdown-item pointer" onClick="Tool.openR(\'jsFile=js01&id='+ id + '\')">修改</a></li>\
			<li onClick="fun.c03('+ id + ')"><a class="dropdown-item pointer">删除</a></li>\
			<li onClick="fun.c04('+ id + ')"><a class="dropdown-item pointer">【下次运行时间】归零</a></li>\
		</ul>'
    },
    b03: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
		<ul class="dropdown-menu">\
            <li onClick="fun.c01();"><a class="dropdown-item pointer">添加任务</a></li>\
            <li onClick="Tool.openR(\'jsFile=js03&table=table&database=shopee/任务/定时任务&toaction=pg01\');"><a class="dropdown-item pointer">*把【sqlite】数据库该表同步到【PostgreSQL】【pg01】数据库</a></li>\
            <li onClick="Tool.openR(\'jsFile=js03&table=table&database=shopee/任务/定时任务&toaction=pg02\');"><a class="dropdown-item pointer">*把【sqlite】数据库该表同步到【PostgreSQL】【pg02】数据库</a></li>\
            <li onClick="Tool.openR(\'jsFile=js03&table=table&database=shopee/任务/定时任务&toaction=pg03\');"><a class="dropdown-item pointer">*把【sqlite】数据库该表同步到【PostgreSQL】【pg03】数据库</a></li>\
            <li onClick="Tool.openR(\'jsFile=js02\');"><a class="dropdown-item pointer">*启动定时任务</a></li>\
            <li onClick="Tool.openR(\'jsFile=js05&table=task&database=shopee&newdatabase=shopee/任务/定时任务\');"><a class="dropdown-item pointer">把一个db文件拆分成多个db文件</a></li>\
		</ul>'
    },
    b04: function (runcycle) {
        let str = "异常"
        switch (runcycle) {
            case 1: str = "5分钟"; break;
            case 2: str = "4小时"; break;
            case 3: str = "1天"; break;
            case 4: str = "3天"; break;
            case 5: str = "7天"; break;
        }
        return str;
    },
    ///////////////////////////////////////////////
    c01: function () {
        let data = [{
            action: o.DEFAULT_DB,
            database: "shopee/任务/定时任务",
            sql: "INSERT into @.table(@.addtime)VALUES(" + Tool.gettime("") + ")",
        }]
        Tool.ajax.a01(data, this.c02, this)
    },
    c02: function (t) {
        if (t[0].length == 0) {
            location.reload();
        }
        else {
            Tool.pre(["出错", t])
        }
    },
    c03: function (id) {
        if (confirm('确定删除该任务吗?')) {
            let data = [{
                action: o.DEFAULT_DB,
                database: "shopee/任务/定时任务",
                sql: "delete from @.table where @.id=" + id,
            }]
            Tool.ajax.a01(data, this.c02, this)
        }
    },
    c04: function (id) {
        let data = [{
            action: o.DEFAULT_DB,
            database: "shopee/任务/定时任务",
            sql: "update @.table set @.nexttime=0 where @.id=" + id,
        }]
        Tool.ajax.a01(data, this.c02, this)
    },
}
fun.a01();