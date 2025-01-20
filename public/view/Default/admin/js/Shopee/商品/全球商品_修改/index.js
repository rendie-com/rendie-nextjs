'use strict';
var fun =
{
    a01: function () {
        obj.params.jsFile = obj.params.jsFile ? obj.params.jsFile : ""//选择JS文件
        obj.params.page = obj.params.page ? parseInt(obj.params.page) : 1;//翻页         
        obj.params.field = obj.params.field ? obj.params.field : '1'//搜索字段
        obj.params.searchword = obj.params.searchword ? Tool.Trim(obj.params.searchword) : "";//搜索关键词
        obj.params.BeforeReview = obj.params.BeforeReview ? obj.params.BeforeReview : "";//更新前本地状态
        obj.params.mode = obj.params.mode ? obj.params.mode : "";//请选择【查询条件】
        obj.params.editStatus = obj.params.editStatus ? obj.params.editStatus : "";//修改状态
        obj.params.site = obj.params.site ? obj.params.site : "";//已发布站点
        obj.params.ManualReview_1688_video_status = obj.params.ManualReview_1688_video_status ? obj.params.ManualReview_1688_video_status : "";//人工审核1688主视频状态
        obj.params.ManualReview_1688_ExplanationVideo_status = obj.params.ManualReview_1688_ExplanationVideo_status ? obj.params.ManualReview_1688_ExplanationVideo_status : "";//人工审核1688讲解视频状态
        obj.params.productType = obj.params.productType ? obj.params.productType : "1";//商品分段
        this.a02();
    },
    a02: function () {
        let data = [{
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/商品/全球商品",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/商品/全球商品.db"],
                database: "shopee/商品/全球商品",
            }]
        }, {
            action: "fs",
            fun: "access_sqlite",
            database: "shopee/类目/类目",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/类目/类目.db"],
                database: "shopee/类目/类目",
            }]
        }, {
            action: "fs",
            fun: "access_sqlite",
            database: "1688/类目/现货类目",
            mode: 0,
            elselist: [{
                action: "fs",
                fun: "download_sqlite",
                urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/1688/类目/现货类目.db"],
                database: "1688/类目/现货类目",
            }]
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function () {
        let where = this.b01();
        let data = [{
            action: "sqlite",
            database: "shopee/商品/全球商品",
            sql: "select count(1) as total FROM @.table" + where,
        }, {
            action: "sqlite",
            database: "shopee/商品/全球商品",
            sql: "select " + Tool.fieldAs("video,ExplanationVideo,proid,id,ManualReview_1688_video_status,ManualReview_1688_ExplanationVideo_status,discount,editStatus,ms_nameLen,tw_nameLen,tw_2_nameLen,en_nameLen,pt_nameLen,es_nameLen,tw_name,tw_1_name,tw_2_name,ms_name,en_name,pt_name,es_name,fromID,manualreview_1688_fromid,ManualReview_1688_description,tw_description,ms_description,en_description,pt_description,es_description,BeforeReview,pic,ManualReview_1688_subject,ManualReview_1688_unitWeight,tw_ads_key,my_ads_key,br_ads_key,ManualReview_1688_categoryId,shopee_8pic") + " FROM @.table" + where + Tool.limit(1, obj.params.page),
            list: [{
                action: "sqlite",
                database: "1688",
                sql: "select @.subject as subject FROM @.proList where @.fromid=${manualreview_1688_fromid}",
            }, {
                action: "sqlite",
                database: "1688/类目/现货类目",
                sql: "select @.catNamePath as catNamePath,@.fromid as fromid_1688,@.bindShopee as bindShopee FROM @.table where @.fromid=${ManualReview_1688_categoryId} limit 1",
                list: [{
                    action: "sqlite",
                    database: "shopee/类目/类目",
                    sql: "select @.upid as upid,@.name as name FROM @.table where @.fromid=${bindShopee} limit 1",
                    list: [{
                        action: "sqlite",
                        database: "shopee/类目/类目",
                        sql: "select @.upid as upid,@.name as name FROM @.table where @.fromid=${upid} limit 1",
                        list: [{
                            action: "sqlite",
                            database: "shopee/类目/类目",
                            sql: "select @.upid as upid,@.name as name FROM @.table where @.fromid=${upid} limit 1",
                            list: [{
                                action: "sqlite",
                                database: "shopee/类目/类目",
                                sql: "select @.upid as upid,@.name as name FROM @.table where @.fromid=${upid} limit 1",
                                list: [{
                                    action: "sqlite",
                                    database: "shopee/类目/类目",
                                    sql: "select @.upid as upid,@.name as name FROM @.table where @.fromid=${upid} limit 1",
                                    list: []
                                }]
                            }]
                        }]
                    }]
                }]
            }, {
                action: "sqlite",
                database: "1688_prodes/${fromid99:manualreview_1688_fromid}",
                sql: "select " + Tool.fieldAs("pic_shopee,attrPic_shopee,desPic_shopee,sku,videoUrl,ExplanationVideo") + " FROM @.prodes where @.fromid=${manualreview_1688_fromid}",
            }, {
                action: "sqlite",
                database: "aliexpress_prodes/${proid50:proid}",
                sql: "select @.DHpic as DHpic,@.DHdesPic as DHdesPic FROM @.prodes where @.proid='${proid}'",
            }, {
                action: "sqlite",
                database: "shopee/Shopee广告/关键词",
                sql: "select @.cn_keyword as tw_keyword_cn_keyword FROM @.table where @.keyword='${tw_ads_key}' and @.site='tw'",
            }, {
                action: "sqlite",
                database: "shopee/Shopee广告/关键词",
                sql: "select @.cn_keyword as my_keyword_cn_keyword FROM @.table where @.keyword='${my_ads_key}' and @.site='my'",
            }, {
                action: "sqlite",
                database: "shopee/Shopee广告/关键词",
                sql: "select @.cn_keyword as br_keyword_cn_keyword FROM @.table where @.keyword='${br_ads_key}' and @.site='br'",
            }]
        }]
        Tool.ajax.a01(data, this.a04, this, where);
    },
    a04: function (t, where) {
        let oo = t[1][0], html = "";
        if (oo) {
            let title = "每次修改都会把【更新前本地状态】设置成【0.未更新】\n且会修改【店铺商品】的【本地更新时间】为当前时间。"
            html = '\
			<table class="table">\
                <tr class="table-light">\
                    <td class="right w270" style="padding-left:25px;position: relative;">'+ this.b05() + '<span title="' + title + '">设置【修改状态】' + this.b06() + '</span>：</td>\
                    <td>'+ (oo.id ? this.b07(oo.editStatus, oo.proid) : '') + '</td>\
                </tr>\
                <tbody '+ (obj.params.productType != "1" ? ' class="hide"' : '') + '>' + Tool.common1.a01(oo) + '</tbody>\
				<tbody '+ (obj.params.productType != "2" ? ' class="hide"' : '') + '>' + Tool.common2.a01(oo) + '</tbody>\
				<tbody '+ (obj.params.productType != "3" ? ' class="hide"' : '') + '>' + Tool.common3.a01(oo) + '</tbody>\
				<tbody '+ (obj.params.productType != "4" ? ' class="hide"' : '') + '>' + Tool.common4.a01(oo) + '</tbody>\
				<tbody '+ (obj.params.productType != "5" ? ' class="hide"' : '') + '>' + Tool.common5.a01(oo) + '</tbody>\
				<tbody '+ (obj.params.productType != "6" ? ' class="hide"' : '') + '>' + Tool.common6.a01(oo) + '</tbody>\
			</table>'
        }
        this.a05(t[0][0].total, html, where)
    },
    a05: function (total, html1, where) {
        let html2 = Tool.header2(obj.params.jsFile) + '\
		<div class="p-2">\
			'+ this.b02() + '\
			<table class="table align-middle">\
				<thead class="table-light">\
                    <tr><td colspan="6">查询条件：' + where + '</td></tr>\
                    <tr>\
                        <td class="p-0">'+ this.b04("BeforeReview", obj.params.BeforeReview) + '</td>\
                        <td class="p-0">' + this.b08("mode", obj.params.mode) + '</td>\
                        <td class="p-0">' + this.b09("editStatus", obj.params.editStatus, config.GlobalPro_editStatus_count) + '</td>\
                        <td class="p-0">' + this.b10("site", obj.params.site) + '</td>\
                        <td class="p-0">' + this.b11("ManualReview_1688_video_status", obj.params.ManualReview_1688_video_status, config.GlobalPro_ManualReview_1688_video_status_count) + '</td>\
                        <td class="p-0">' + this.b12("ManualReview_1688_ExplanationVideo_status", obj.params.ManualReview_1688_ExplanationVideo_status, config.GlobalPro_ManualReview_1688_ExplanationVideo_status_count) + '</td>\
                    </tr>\
                </thead>\
			</table>\
            <ul class="makeHtmlTab">\
                <li onclick="Tool.open(\'productType\', 1)" '+ (obj.params.productType == "1" ? ' class="hover"' : '') + '>基本信息</li>\
                <li onclick="Tool.open(\'productType\', 2)" '+ (obj.params.productType == "2" ? ' class="hover"' : '') + '>图片</li>\
                <li onclick="Tool.open(\'productType\', 3)" '+ (obj.params.productType == "3" ? ' class="hover"' : '') + '>属性</li>\
                <li onclick="Tool.open(\'productType\', 4)" '+ (obj.params.productType == "4" ? ' class="hover"' : '') + '>详情</li>\
                <li onclick="Tool.open(\'productType\', 5)" '+ (obj.params.productType == "5" ? ' class="hover"' : '') + '>主视频</li>\
                <li onclick="Tool.open(\'productType\', 6)" '+ (obj.params.productType == "6" ? ' class="hover"' : '') + '>讲解视频</li>\
            </ul>' + html1 + Tool.page(total, 1, obj.params.page) + '\
		</div>'
        Tool.html(this.a06, this, html2)
    },
    a06: function () {
        $('.easyzoom').easyZoom();
        let pageX = 0;
        document.addEventListener("drag", (e) => {
            if (pageX === 0) pageX = e.pageX
            $(".fragment-left").css("left", (e.pageX - pageX) + "px");

        }, false)
        document.addEventListener("dragend", (e) => {
            $(".fragment-left").css("left", (e.pageX - pageX) + "px");
        }, false)
    },
    //////////////////////////////////////////////
    b01: function () {
        let arr = [
            "@.isup=1",
            "@.ManualReview_1688=1"
            //"@.ManualReview=9",
            //"@.DHAfterReview=0",
            //"@.penalty_type=0"
        ];
        if (obj.params.searchword) {
            switch (obj.params.field) {
                case "1": arr.push("@.proid='" + obj.params.searchword + "'"); break;//商品编码
                case "2": arr.push("@.fromID=" + obj.params.searchword); break;//DH商品ID
            }
        }
        if (obj.params.BeforeReview != "") { arr.push("@.BeforeReview=" + obj.params.BeforeReview); }
        if (obj.params.ManualReview_1688_video_status != "") { arr.push("@.ManualReview_1688_video_status=" + obj.params.ManualReview_1688_video_status); }
        if (obj.params.ManualReview_1688_ExplanationVideo_status != "") { arr.push("@.ManualReview_1688_ExplanationVideo_status=" + obj.params.ManualReview_1688_ExplanationVideo_status); }
        if (obj.params.mode != "") {
            switch (obj.params.mode) {
                case "1": arr.push("(@.tw_2_nameLen<25 or @.tw_2_nameLen>100)"); break;
                case "2": arr.push("(@.ms_nameLen<25 or @.ms_nameLen>100)"); break;
                case "3": arr.push("(@.en_nameLen<25 or @.en_nameLen>100)"); break;
                case "4": arr.push("(@.pt_nameLen<25 or @.pt_nameLen>100)"); break;
                case "5": arr.push("@.ManualReview_1688_unitWeight<=0"); break;
                case "6": arr.push("(@.es_nameLen<25 or @.es_nameLen>100)"); break;//西班牙语
            }
        }
        if (obj.params.editStatus != "") { arr.push("@.editStatus=" + obj.params.editStatus); }
        if (obj.params.site != "") { arr.push("@.is" + obj.params.site + "=1"); }
        return (arr.length == 0 ? "" : " where " + arr.join(" and "));
    },
    b02: function () {
        return '\
        <div class="input-group w-50 m-2">\
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ obj.params.field + '">' + this.b03(obj.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)" value="1">商品编码</li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)" value="2">商品ID</a></li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ obj.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
    },
    b03: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "商品编码"; break;
            case "2": name = "商品ID"; break;
            default: name = "未知：" + val;
        }
        return name
    },
    b04: function (name, val) {
        let nArr = [], arr = Tool.BeforeReview;
        for (let i = 0; i < arr.length; i++) {
            nArr.push('<option value="' + i + '" ' + ("" + arr[i][0] === "" + val ? 'selected="selected"' : '') + '>' + i + '.' + arr[i][1] + '（' + config.GlobalPro_BeforeReview_count[i] + '）</option>');
        }
        return '\
        <select onChange="fun.c03(\''+ name + '\',this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">更新前本地状态</option>\
            <option value="-1">更新数量</option>\
            ' + nArr.join("") + '\
        </select>'
    },
    b05: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="fun.c11(0);"><a class="dropdown-item pointer">把【未修改】设置成【更新前本地状态-未更新】</a></li>\
            <li onClick="fun.c11(1);"><a class="dropdown-item pointer">把【第一次修改】设置成【更新前本地状态-未更新】</a></li>\
            <li onClick="fun.c11(2);"><a class="dropdown-item pointer">把【第二次修改】设置成【更新前本地状态-未更新】</a></li>\
        </ul>'
    },
    b06: function () {//问号图片
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style="height:16px;width:16px;"><path fill-rule="evenodd" d="M8,1 C11.8659932,1 15,4.13400675 15,8 C15,11.8659932 11.8659932,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 Z M8,2 C4.6862915,2 2,4.6862915 2,8 C2,11.3137085 4.6862915,14 8,14 C11.3137085,14 14,11.3137085 14,8 C14,4.6862915 11.3137085,2 8,2 Z M7.98750749,10.2375075 C8.40172105,10.2375075 8.73750749,10.5732939 8.73750749,10.9875075 C8.73750749,11.401721 8.40172105,11.7375075 7.98750749,11.7375075 C7.57329392,11.7375075 7.23750749,11.401721 7.23750749,10.9875075 C7.23750749,10.5732939 7.57329392,10.2375075 7.98750749,10.2375075 Z M8.11700238,4.60513307 C9.97011776,4.60513307 10.7745841,6.50497267 9.94298079,7.72186504 C9.76926425,7.97606597 9.56587088,8.14546785 9.27050506,8.31454843 L9.11486938,8.39945305 L8.95824852,8.47993747 C8.56296349,8.68261431 8.49390831,8.75808648 8.49390831,9.0209925 C8.49390831,9.29713488 8.27005069,9.5209925 7.99390831,9.5209925 C7.71776594,9.5209925 7.49390831,9.29713488 7.49390831,9.0209925 C7.49390831,8.34166619 7.7650409,7.99681515 8.35913594,7.6662627 L8.76655168,7.45066498 C8.9424056,7.3502536 9.04307851,7.26633638 9.11735517,7.1576467 C9.52116165,6.56675314 9.11397414,5.60513307 8.11700238,5.60513307 C7.41791504,5.60513307 6.82814953,6.01272878 6.75715965,6.55275918 L6.75,6.66244953 L6.74194433,6.75232516 C6.69960837,6.98557437 6.49545989,7.16244953 6.25,7.16244953 C5.97385763,7.16244953 5.75,6.9385919 5.75,6.66244953 C5.75,5.44256682 6.87194406,4.60513307 8.11700238,4.60513307 Z"></path></svg>'
    },
    b07: function (editStatus, proid) {
        let arr = Tool.GlobalPro_editStatus, str = ''
        for (let i = 0; i < arr.length; i++) {
            str += '\
            <div class="form-check form-check-inline">\
                <input class="form-check-input" type="radio" name="editStatus" id="editStatus'+ i + '" ' + (arr[i][0] == editStatus ? 'disabled checked' : '') + ' onclick="fun.c09(' + arr[i][0] + ' ,\'' + proid + '\')">\
                <label class="form-check-label" for="editStatus'+ i + '">' + arr[i][1] + '</label>\
            </div>'
        }
        return str
    },
    b08: function (name, val) {
        return '\
        <select onChange="fun.c08(\''+ name + '\',this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">请选择【查询条件】</option>\
            <option value="1" ' + ("1" == val ? 'selected="selected"' : '') + '>25 &gt; 中文(繁体)标题长度 &gt;100</option>\
            <option value="2" ' + ("2" == val ? 'selected="selected"' : '') + '>25 &gt; 马来语标题长度 &gt;100</option>\
            <option value="3" ' + ("3" == val ? 'selected="selected"' : '') + '>25 &gt; 英语标题长度 &gt;100</option>\
            <option value="4" ' + ("4" == val ? 'selected="selected"' : '') + '>25 &gt; 葡萄牙语标题长度 &gt;100</option>\
            <option value="5" ' + ("5" == val ? 'selected="selected"' : '') + '>手动审核1688后单位重量&lt;=0</option>\
            <option value="6" ' + ("6" == val ? 'selected="selected"' : '') + ' title="西班牙语的国家有：墨西哥">25 &gt; 西班牙语标题长度 &gt;100</option>\
        </select>'
    },
    b09: function (name, val, configArr) {
        let nArr = [], arr = Tool.GlobalPro_editStatus;
        for (let i = 0; i < arr.length; i++) {
            nArr.push('<option value="' + i + '" ' + ("" + arr[i][0] == "" + val ? 'selected="selected"' : '') + '>' + i + '.' + arr[i][1] + '（' + configArr[i] + '）</option>');
        }
        return '\
        <select onChange="fun.c10(\''+ name + '\',this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">修改状态</option>\
            <option value="-1">更新数量</option>\
        ' + nArr.join("") + '\
        </select>'
    },
    b10: function (name, val) {
        let nArr = [], arr = [
            ["sg", "新加坡"],
            ["tw", "台湾虾皮"],
            ["my", "马来西亚"],
            ["br", "巴西"],
            ["mx", "墨西哥"]
        ];
        for (let i = 0; i < arr.length; i++) {
            nArr.push('<option value="' + arr[i][0] + '" ' + (arr[i][0] == val ? 'selected="selected"' : '') + '>' + arr[i][1] + '</option>');
        }
        return '\
        <select onChange="fun.c08(\''+ name + '\',this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">已发布站点</option>\
            <option value="-1">翻译【已发布站点】标题和详情</option>\
            ' + nArr.join("") + '\
        </select>'
    },
    b11: function (name, val, configArr) {
        let nArr = [], arr = Tool.ManualReview_1688_video_status;
        for (let i = 0; i < arr.length; i++) {
            nArr.push('<option value="' + i + '" ' + ("" + arr[i][0] == "" + val ? 'selected="selected"' : '') + '>' + i + '.' + arr[i][1] + '（' + configArr[i] + '）</option>');
        }
        return '\
        <select onChange="fun.c12(\''+ name + '\',this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">人工审核1688主视频状态</option>\
            <option value="-1">更新数量</option>\
            ' + nArr.join("") + '\
        </select>'
    },
    b12: function (name, val, configArr) {
        let nArr = [], arr = Tool.ManualReview_1688_video_status;
        for (let i = 0; i < arr.length; i++) {
            nArr.push('<option value="' + i + '" ' + ("" + arr[i][0] == "" + val ? 'selected="selected"' : '') + '>' + i + '.' + arr[i][1] + '（' + configArr[i] + '）</option>');
        }
        return '\
        <select onChange="fun.c13(\''+ name + '\',this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">人工审核1688讲解视频状态</option>\
            <option value="-1">更新数量</option>\
            ' + nArr.join("") + '\
        </select>'
    },
    ////////////////////////////////////////////
    c01: function (val) {
        let name = this.b03("" + val)
        $("#field").html(name).val(val)
    },
    c02: function () {
        let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
        if (field == "2" && isNaN(searchword)) {
            alert("【商品ID】必须是数字。")
        }
        else if (searchword) {
            Tool.main("?jsFile=" + obj.params.jsFile + "&page=1&field=" + field + "&searchword=" + searchword);
        } else { alert("请输入搜索内容"); }
    },
    c03: function (I, val) {
        if (val == "-1") {
            Tool.openR("?jsFile=js11");
        }
        else {
            Tool.open(I, val);
        }
    },
    c08: function (I, val) {
        if (val == "-1") {
            Tool.openR("?jsFile=js44");
        }
        else {
            Tool.open(I, val);
        }
    },
    c09: function (val, proid) {
        let data = [
            {
                action: "sqlite",
                database: "shopee/商品/全球商品",
                //@.BeforeReview=0      表示【0.未更新】
                sql: "update @.table set @.editStatus=" + val + ",@.BeforeReview=0 where @.proid='" + proid + "'",
            }, {
                action: "sqlite",
                database: "shopee/商品/店铺商品/sg",
                //@.self_uptime        表示【本地更新时间】
                sql: "update @.table set @.self_uptime=" + Tool.gettime("") + " where @.proid='" + proid + "'",
            }, {
                action: "sqlite",
                database: "shopee/商品/店铺商品/tw",
                //@.self_uptime        表示【本地更新时间】
                sql: "update @.table set @.self_uptime=" + Tool.gettime("") + " where @.proid='" + proid + "'",
            }, {
                action: "sqlite",
                database: "shopee/商品/店铺商品/my",
                //@.self_uptime        表示【本地更新时间】
                sql: "update @.table set @.self_uptime=" + Tool.gettime("") + " where @.proid='" + proid + "'",
            }, {
                action: "sqlite",
                database: "shopee/商品/店铺商品/br",
                //@.self_uptime        表示【本地更新时间】
                sql: "update @.table set @.self_uptime=" + Tool.gettime("") + " where @.proid='" + proid + "'",
            }, {
                action: "sqlite",
                database: "shopee/商品/店铺商品/mx",
                //@.self_uptime        表示【本地更新时间】
                sql: "update @.table set @.self_uptime=" + Tool.gettime("") + " where @.proid='" + proid + "'",
            }]
        Tool.ajax.a01(data, Tool.reload);
    },
    c10: function (I, val) {
        if (val == "-1") {
            Tool.openR("?jsFile=js47");
        }
        else {
            Tool.open(I, val);
        }
    },
    c11: function (editStatus) {
        if (confirm("确定要修改码？")) {
            let str = '"ok"<r: db="sqlite.shopee">update @.GlobalPro set @.BeforeReview=0,@.err=null where @.editStatus=' + editStatus + '</r:>'
            Tool.ajax.a01(str, 1, Tool.reload);
        }
    },
    c12: function (name, val) {
        if (val == "-1") {
            Tool.openR("?jsFile=js68");
        }
        else {
            Tool.open(name, val);
        }
    },
    c13: function (name, val) {
        if (val == "-1") {
            Tool.openR("?jsFile=js65");
        }
        else {
            Tool.open(name, val);
        }
    },
}
fun.a01();