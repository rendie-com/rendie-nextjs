'use strict';
var fun =
{
    a01: function () {
        //o.params.jsFile        选择JS文件
        o.params.site = o.params.site ? o.params.site : "sg";//站点
        o.params.page = o.params.page ? parseInt(o.params.page) : 1;//翻页
        o.params.field = o.params.field ? o.params.field : "1";//搜索字段
        o.params.searchword = o.params.searchword ? o.params.searchword : "";//搜索关键词
        o.params.fe_status = o.params.fe_status ? o.params.fe_status : "";//状态	
        o.params.num = o.params.num ? o.params.num : "1"//该站点的第几个店
        this.a02();
    },
    a02: function () {
        let siteNum = Tool.siteNum(o.params.site, o.params.num);
        Tool.download_sqlite.a01(["shopee/营销中心/优惠券/" + siteNum], this.a03, this, siteNum)
    },
    a03: function (t, siteNum) {
        let where = this.b11()
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/优惠券/" + siteNum,
            sql: "select count(1) as total FROM @.table" + where,
        }, {
            action: "sqlite",
            database: "shopee/营销中心/优惠券/" + siteNum,
            sql: "select " + Tool.fieldAs("id,rule,name,voucher_code,fe_display_coin_amount,value,discount,usage_quantity,fe_status,start_time,end_time,mtime,ctime") + " FROM @.table" + where + Tool.limit(10, o.params.page),
        }, {
            action: o.DEFAULT_DB,
            database: "shopee/卖家账户",
            sql: "select @.config as config FROM @.table where @.isdefault=1 limit 1",
        }]
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        let siteArr = JSON.parse(t[2][0].config)[o.params.site]
        let html1 = "", arr = t[1]
        for (let i = 0; i < arr.length; i++) {
            html1 += '\
            <tr>\
                <td class="p-0">'+ this.b03(arr[i].id, arr[i].name, arr[i].voucher_code, arr[i].value) + '</td>\
                <td>'+ this.b08(arr[i].fe_status) + '</td>\
                <td>'+ this.b07(arr[i].name, arr[i].voucher_code) + '</td>\
                <td>'+ (arr[i].rule.items ? arr[i].rule.items.length + ' 个商品' : '全部商品') + '</td>\
                <td>'+ this.b14(arr[i].rule, arr[i].value) + '</td>\
                <td>'+ arr[i].usage_quantity + '</td>\
                <td>-</td>\
                <td class="p-0">'+ this.b05(arr[i].start_time, arr[i].end_time) + '</td>\
                <td class="p-0">'+ this.b04(arr[i].ctime, arr[i].mtime) + '</td>\
           </tr>'
        }
        let html = Tool.header(o.params.jsFile, o.params.site) + '\
        <div class="p-2">\
            <div style="top:6px;position:relative;">'+ this.b12() + '</div>'
            + Tool.tab(o.params.jsFile, o.params.site, siteArr, o.params.num) + this.b09() + '\
            <table class="table align-middle center table-hover">\
  			    <thead class="table-light">'+ this.b01() + '</thead>\
				<tbody>'+ html1 + '</tbody>\
            </table>' + Tool.page(t[0][0].total, 10, o.params.page) + '\
        </div>'
        Tool.html(null, null, html);
    },
    /////////////////////////////////////////
    b01: function () {
        let html = '\
        <tr>\
            <th style="padding-left: 30px;position: relative;" class="left">'+ this.b02() + '优惠券活动名称 | 优惠券码</th>\
            <th class="p-0">\
                <select onChange="Tool.open(\'fe_status\',this.options[this.selectedIndex].value)" class="form-select">\
                    <option value="">状态</option>\
                    <option value="0" '+ (o.params.fe_status == "0" ? 'selected="selected"' : '') + '>0.进行中的活动（暂放）</option>\
                    <option value="1" '+ (o.params.fe_status == "1" ? 'selected="selected"' : '') + '>1.接下来的活动</option>\
                    <option value="2" '+ (o.params.fe_status == "2" ? 'selected="selected"' : '') + '>2.进行中的活动</option>\
                    <option value="3" '+ (o.params.fe_status == "3" ? 'selected="selected"' : '') + '>3.已过期</option>\
                </select>\
            </th>\
            <th>优惠券类型</th>\
            <th>适用商品范围</th>\
            <th>折扣金额</th>\
            <th>可使用总数</th>\
            <th>已使用</th>\
            <th class="w160">优惠券领取期间</th>\
            <th class="w160">时间</th>\
        </tr>'
        return html;
    },
    b02: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
		<ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=02&site=' + o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*创建【优惠券】</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + '&num=' + o.params.num + '&day=all\');"><a class="dropdown-item pointer">*获取【优惠券】信息（所有）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + '&num=' + o.params.num + '&day=3\');"><a class="dropdown-item pointer">*获取【优惠券】信息（近3天）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&site=' + o.params.site + '&num=' + o.params.num + '&day=30\');"><a class="dropdown-item pointer">*获取【优惠券】信息（近30天）</a></li>\
		</ul>'
    },
    b03: function (id, name, voucher_code, value) {
        return '\
        <table class="table m-0 left">\
            <tr>\
                <td rowspan="2" class="w70 border-bottom-0">'+ this.b06(voucher_code, value) + '</td>\
                <td title="优惠券活动名称"><a href="javascript:;" onclick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=05&site=' + o.params.site + '&num=' + o.params.num + '&id=' + id + '\');">' + name + '</td>\
            </tr>\
            <tr><td title="优惠券码" class="border-bottom-0">优惠券码：'+ voucher_code + '</td></tr>\
        </table>'
    },
    b04: function (ctime, mtime) {
        return '\
        <table class="table mb-0">\
            <tr><td title="上传时间">'+ Tool.js_date_time2(ctime) + '</td></tr>\
            <tr><td title="更新时间" class="border-bottom-0">'+ Tool.js_date_time2(mtime) + '</td></tr>\
        </table>'
    },
    b05: function (start_time, end_time) {
        return '\
        <table class="table mb-0">\
            <tr><td title="优惠券领取开始时间">'+ Tool.js_date_time2(start_time) + '</td></tr>\
            <tr><td title="优惠券领取结束时间" class="border-bottom-0">'+ Tool.js_date_time2(end_time) + '</td></tr>\
        </table>'
    },
    b06: function (voucher_code, value) {
        let str = ""
        if (voucher_code) {
            let val = voucher_code.split("-")[0];
            if (value) {
                str = '<img src="https://deo.shopeesz.com/shopee/shopee-seller-live-sg/mmf_portal_seller_root_dir/static/modules/vouchers/image/dollar-colorful.5e618d0.png" width="60">'
            }
            else {
                if (val == "SGAME") {
                    str = '<img src="https://deo.shopeesz.com/shopee/shopee-seller-live-sg/mmf_portal_seller_root_dir/static/modules/vouchers/image/reward-percent-colorful.4ceae47.png" width="60">'
                }
                else if (val == "LIVE") {
                    str = '<img src="https://deo.shopeesz.com/shopee/shopee-seller-live-sg/mmf_portal_seller_root_dir/static/modules/vouchers/image/dollar-colorful.5e618d0.png" width="60">'
                }
                else if (val == "SFP") {
                    str = '<img src="https://deo.shopeesz.com/shopee/shopee-seller-live-sg/mmf_portal_seller_root_dir/static/modules/vouchers/image/percent-colorful.0e15568.png" width="60">'
                }
                else {
                    str = '<img src="https://deo.shopeesz.com/shopee/shopee-seller-live-sg/mmf_portal_seller_root_dir/static/modules/vouchers/image/percent-colorful.0e15568.png" width="60">'
                }
            }
        }
        return str;
    },
    b07: function (name, voucher_code) {
        let str = ""
        if (name.indexOf("直播优惠券") != -1) {
            str = '直播优惠券'
        }
        else if (name.indexOf("店铺游戏优惠券") != -1) {
            str = '店铺游戏优惠券'
        }
        else if (name.indexOf("店铺优惠券") != -1) {
            str = '店铺优惠券'
        }
        else if (name.indexOf("回购买家优惠券") != -1) {
            str = '回购买家优惠券'
        }
        else if (name.indexOf("商品优惠券") != -1) {
            str = '商品优惠券'
        }
        else if (name.indexOf("非公开优惠券") != -1) {
            str = '非公开优惠券'
        }
        else if (name.indexOf("关注礼优惠券") != -1) {
            str = '关注礼优惠券'
        }
        else if (name.indexOf("新买家优惠券") != -1) {
            str = '新买家优惠券'
        }
        else {
            let val = voucher_code.split("-")[0]
            if (val == "SGAME") {
                str = '店铺游戏优惠券'
            }
            else if (val == "LIVE") {
                str = '直播优惠券'
            }
            else if (val == "SFP") {
                str = '关注礼优惠券'
            }
            else {
                str = "[异常]" + name
            }
        }


        return str;
    },
    b08: function (fe_status) {
        let str
        if (fe_status == 1) {
            str = this.b13("*删除", "03", fe_status) + '<span class="p-1" style="color:#ee4d2d;background-color:#fff1f0;">接下来的活动</span>'
        }
        else if (fe_status == 2) {
            str = this.b13("*结束", "04", fe_status) + '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">进行中的活动</span>'
        }
        else if (fe_status == 0) {
            str = '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">进行中的活动（暂放）</span>'
        }
        else if (fe_status == 3) {
            str = '<span class="p-1" style="color: #666;background-color:#eee;">已过期</span>'
        }
        else {
            str = "未知：" + fe_status
        }
        return str;
    },
    b09: function () {
        return '\
        <div class="input-group w-50 m-2">\
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ o.params.field + '">' + this.b10(o.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">优惠券活动名称</li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)">优惠券码</a></li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ Tool.Trim(o.params.searchword) + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
    },
    b10: function (val) {
        let name = "";
        switch (val) {
            case "1": name = "优惠券活动名称"; break;
            case "2": name = "优惠券码"; break;
            default: name = "未知：" + val;
        }
        return name
    },
    b11: function () {
        let arr = [];
        if (o.params.searchword) {
            switch (o.params.field) {
                case "1": arr.push("@.name like '%" + o.params.searchword + "%'"); break;//优惠券名
                case "2": arr.push("@.voucher_code='" + o.params.searchword + "'"); break;//优惠券ID
            }
        }
        if (o.params.fe_status) { arr.push("@.fe_status=" + o.params.fe_status); }
        return (arr.length == 0 ? "" : " where " + arr.join(" and ")) + " order by @.end_time desc";
    },
    b12: function () {
        return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=02\');"><a class="dropdown-item pointer">*创建【优惠券】</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=all\');"><a class="dropdown-item pointer">*获取【优惠券】信息（所有）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=3\');"><a class="dropdown-item pointer">*获取【优惠券】信息（近3天）</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=01&day=30\');"><a class="dropdown-item pointer">*获取【优惠券】信息（近30天）</a></li>\
        </ul>'
    },
    b13: function (name, jsFile2, fe_status) {
        return '\
        <div style="position: relative;top: -8px;left: 0px;">\
            <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
            <ul class="dropdown-menu">\
                <li onclick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=' + jsFile2 + '&site=' + o.params.site + '&num=' + o.params.num + '&status=' + fe_status + '\')"><a class="dropdown-item pointer">' + name + '</a></li>\
            </ul>\
        </div>'
    },
    b14: function (rule, value) {
        let oo = JSON.parse(rule), str = "[异常]";
        if (oo.reward_type == 1) {
            let svg = '<svg viewBox="0 0 1024 1024" focusable="false" data-icon="coins" width="1em" height="1em" ill="currentColor" aria-hidden="true"><path d="M983.8 312.7A513.94 513.94 0 00798.3 87.5 511.08 511.08 0 00664.2 23C616.1 8.1 565 0 512 0c-70.6 0-138 14.3-199.3 40.2A513.94 513.94 0 0087.5 225.7 511.08 511.08 0 0023 359.8C8.1 407.9 0 459 0 512c0 70.6 14.3 138 40.2 199.3 38.9 91.9 103.8 170 185.5 225.2 40.9 27.6 85.9 49.5 134 64.4 48.1 15 99.3 23 152.2 23 70.6 0 138-14.3 199.3-40.2 91.9-38.9 170-103.8 225.2-185.5 27.6-40.9 49.5-85.9 64.4-134 15-48.1 23-99.3 23-152.2.2-70.6-14.1-138-40-199.3zm-59 373.7c-34 80.4-90.8 148.8-162.3 197.1a446.71 446.71 0 01-117.2 56.4c-42.1 13-86.8 20.1-133.3 20.1-61.9 0-120.8-12.5-174.4-35.2-80.4-34-148.8-90.8-197.1-162.3a446.71 446.71 0 01-56.4-117.2C71.1 603.2 64 558.5 64 512c0-61.9 12.5-120.8 35.2-174.4 34-80.4 90.8-148.8 162.3-197.1 35.8-24.2 75.2-43.3 117.2-56.4C420.8 71.1 465.5 64 512 64c61.9 0 120.8 12.5 174.4 35.2 80.4 34 148.8 90.8 197.1 162.3 24.2 35.8 43.3 75.2 56.4 117.2 13 42.1 20.1 86.8 20.1 133.3 0 61.9-12.5 120.8-35.2 174.4z"></path><path d="M678.4 566.1c-8.5-15.4-19.8-28.3-32.8-39.3-9.7-8.2-20.4-15.4-31.6-21.7-16.8-9.5-34.9-17.3-53.1-24.1-18-6.7-36.3-12.5-53.6-17.9-1.1-.4-2.2-.9-3.5-1.3-2.9-1.1-6.4-2.4-10.5-4-7.2-2.9-16-6.6-25-11.4-6.8-3.6-13.7-7.7-20.2-12.4-4.9-3.5-9.5-7.3-13.6-11.4-6.2-6.1-11.3-12.7-14.7-19.8a52.4 52.4 0 01-5.4-23c.4-7.8 2.3-16.1 5.9-24.3 2.8-6.2 6.5-12.3 11.3-18 7.1-8.5 16.5-16.1 28.5-21.8 11.9-5.6 26.4-9.4 44-10.2 14.4 0 28.4 2 41.2 4.9 19.4 4.4 36.2 11 48 16.5 5.9 2.8 10.6 5.2 13.7 7 1.6.9 2.7 1.6 3.5 2 .4.2.7.4.8.5l.2.1c2.5 1.6 5.2 3 8.2 4 3.1 1 6.6 1.6 10.2 1.6 4.5 0 8.9-.9 12.8-2.6a32.9 32.9 0 0014.4-11.9c1.8-2.6 3.2-5.5 4.2-8.6 1-3.1 1.5-6.4 1.5-9.8a33.06 33.06 0 00-10.9-24.5l-.3-.3c-.9-.8-13.8-11.8-38-22.7-12.1-5.4-27-10.8-44.5-14.9-17.6-4-37.8-6.7-60.6-6.7-1.9 0-3.9 0-5.9.1-27.2.6-50.7 6.1-70.6 14.9-14.9 6.6-27.8 15.1-38.6 24.7a149.97 149.97 0 00-35.8 47.3c-3.9 8.2-6.9 16.4-9 24.2-2.1 7.9-3.4 15.4-3.8 22.6v.1c-.1 2.5-.2 4.9-.2 7.3 0 13.8 2.1 26.7 5.9 38.5 3.3 10.3 8 19.8 13.4 28.4 9.6 15 21.9 27.4 34.9 37.6 19.6 15.3 41 25.9 59.2 33.3 9.1 3.7 17.4 6.6 24.2 8.8l9 2.9c2.6.8 4.7 1.4 6.1 1.9 1.6.5 3.4 1 5.4 1.7 3.9 1.2 8.7 2.7 14.3 4.5 9.8 3.2 21.8 7.6 34.1 13.2 9.3 4.2 18.7 9.2 27.6 14.9 6.7 4.3 13 8.9 18.7 14 4.3 3.8 8.1 7.8 11.6 11.9 5.1 6.3 9.2 12.9 12 20 2.8 7.1 4.3 14.7 4.3 23.3 0 1.9-.1 3.8-.2 5.7-.5 6-1.7 11.6-3.5 16.7a66 66 0 01-14.9 23.8c-5 5.2-11 10-17.7 14.1-10.1 6.2-21.9 11.1-34.5 14.5-12.4 3.4-25.6 5.3-38.4 5.7-19.1-.4-36.6-3.2-52.2-7.2-23.6-6-42.8-14.8-56.7-22.5-13.6-7.6-21.9-14-23.9-15.7-.2-.1-.3-.3-.5-.4-.2-.2-.5-.4-.7-.6-2.7-2-5.7-3.7-9-4.8-3.3-1.1-6.9-1.8-10.7-1.8-4.5 0-8.9.9-12.8 2.6a32.9 32.9 0 00-14.4 11.9c-1.8 2.6-3.2 5.5-4.2 8.6-1 3.1-1.5 6.4-1.5 9.8a33 33 0 003.8 15.3c2.2 4.2 5.3 7.9 9.1 10.7 3.1 2.7 19 16.2 46.2 29.9 14.8 7.5 33 15 54.2 20.8 21.1 5.8 45.3 9.8 72.1 10.4 1.6.1 3.4.1 5.5.1 4.4 0 10.2-.2 16.9-.7 11.8-1 26.6-3.1 42.6-7.4 12-3.2 24.6-7.7 37-13.9 9.3-4.7 18.5-10.3 27.2-17.2 13-10.3 24.8-23.5 33.7-39.8 8.9-16.4 14.9-35.9 16.6-58.6.4-4.7.5-9.3.5-13.8 0-13.6-1.7-26.3-4.8-38-3-10-6.9-19.5-11.7-28.3zM382.9 671.3z"></path></svg>'
            str = oo.coin_cashback_voucher.coin_percentage_real + '%<br/>' + svg + ' Shopee币回扣'
        }
        else if (oo.reward_type == 0 && value) {
            str = '$' + value;
        }
        return str;
    },
    /////////////////////////////////////////////////
    c01: function (val) {
        let name = this.b10("" + val)
        $("#field").html(name).val(val)
    },
    c02: function () {
        let field = $("#field").val(), searchword = Tool.Trim($("#searchword").val());
        if (searchword) {
            Tool.main("jsFile=" + o.params.jsFile + "&site=" + o.params.site + "&num=" + o.params.num + "&page=1&field=" + field + "&searchword=" + searchword);
        } else { alert("请输入搜索内容"); }
    },
}
fun.a01();