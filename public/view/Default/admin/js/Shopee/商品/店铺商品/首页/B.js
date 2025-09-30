'use strict';
Object.assign(fun,
    {
        b01: function (siteObj, t3) {
            let config = JSON.parse(t3[0].value)["店铺商品"]
            if (!config) { config = {}; }
            if (!config[this.obj.siteNum]) config[this.obj.siteNum] = [];
            let html = '\
        <tr>\
            <th style="padding-left: 20px;position: relative;" class="w140">'+ this.b02() + 'ID</th>\
            <th class="w120">首图</th>\
            <th class="p-0">'+ this.b19('标题', o.params.title, "title", config[this.obj.siteNum]["标题"]) + '</th>\
            <th class="p-0">'+ this.b23('定价', o.params.price, "price", config[this.obj.siteNum]["定价"]) + '</th>\
            <th class="p-0">'+ this.b16('活动', o.params.activity, "activity", config[this.obj.siteNum]["活动"]) + '</th>\
            <th class="w120">满'+ siteObj.currency_symbol + siteObj.fullPrice + '利润</th>\
            <th class="w120">满'+ siteObj.currency_symbol + (siteObj.fullPrice * 2) + '利润</th>\
            <th class="w120">满'+ siteObj.currency_symbol + (siteObj.fullPrice * 3) + '利润</th>\
            <th class="w100 p-0">'+ this.b13(o.params.category, "category", config[this.obj.siteNum]["最低购买量"], config[this.obj.siteNum]["单位重量"]) + '</th>\
            <th class="p-0">'+ this.b10('状态', o.params.status, o.params.ExceptionType, config[this.obj.siteNum]["状态"], config[this.obj.siteNum]["商品异常类型"]) + '</th>\
            <th class="w100 p-0">'+ this.b12('1688信息', o.params.info1688, "info1688") + '</th>\
        </tr>'
            return html;
        },
        b02: function () {
            return '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
	        <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=02&site=' + o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*获取【店铺商品】信息</a></li>\
	        <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=04&site=' + o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*获取【店铺商品】详情信息</a></li>\
	        <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=07&site=' + o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*更新【店铺商品】信息</a></li>\
	        <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=11&site=' + o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*生成图片水印</a></li>\
	        <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=18&site=' + o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*生成首图水印</a></li>\
	        <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=10&site=' + o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*生成视频</a></li>\
	        <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=12&site=' + o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*为该站点创建类目</a></li>\
	        <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=19&site=' + o.params.site + '&num=' + o.params.num + '\');" title="怎么选？答：定价错误的选出来。"><a class="dropdown-item pointer">选出要修改价格的商品</a></li>\
            <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=17&table=shopPro_' + o.params.site + '&num=' + o.params.num + '&database=shopee\');"><a class="dropdown-item pointer">*把该表同步到【PostgreSQL】数据库</a></li>\
	        <li onClick="Tool.openR(\'jsFile=' + o.params.jsFile + '&jsFile2=15&site=' + o.params.site + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*修改出货天数</a></li>\
        </ul>'
        },
        b03: function (pic) {
            let html = "\
        <a href=\"https://s-cf-sg.shopeesz.com/file/" + pic + "\" target=\"_blank\">\
            <img src=\"https://s-cf-sg.shopeesz.com/file/"+ pic + "_tn\" class=\"img-fluid rounded w100\">\
        </a>"
            return html;
        },
        b04: function (name, shopId, fromid, isUnlisted, isTrueSignUp, promotion, price_uptime, addtime, uptime, self_uptime, saleNum, note) {
            let str = "";
            if (isUnlisted) {
                str += '<span class="p-1 m-1" style="color: #2673dd;background-color:#e6eefa;">能下架</span>'
            }
            else {
                str += '<span class="p-1 m-1" style="color: #666;background-color:#eee;">不能下架</span>'
            }
            if (price_uptime == 1) {
                str += '<span class="p-1 m-1" style="color: #5c7;background-color:#eaf9ef;">需要改价</span>'
            }
            if (price_uptime > 1) {
                str += '<span class="p-1 m-1" style="color: #5c7;background-color:#eaf9ef;" title="改价时间：' + Tool.js_date_time2(price_uptime) + '">改价时间：' + Tool.userDate13(price_uptime * 1000) + '</span>'
            }
            if (promotion) {
                if (promotion.upcoming_campaigns || promotion.ongoing_campaigns) {
                    let arr = this.b17(promotion)
                    str += '<span class="p-1 m-1" style="color: #ff7f57;background-color:#feeeeb;"  data-bs-placement="right" data-bs-toggle="tooltip2" data-bs-html="true" data-bs-original-title=\'' + arr.join("<hr>") + '\'>' + arr.length + '个营销活动 </span>'
                }
            }
            if (isTrueSignUp) {
                str += '<span class="p-1 m-1" style="color: #5c7;background-color:#eaf9ef;">已报名商品活动</span>'
            }
            return '\
            <table class="table mb-0 table-bordered">\
                <tr><td colspan="2"><a href="https://' + (o.params.site == 'tw' ? 'xiapi' : o.params.site) + '.xiapibuy.com/product/' + shopId + '/' + fromid + '/" target="_blank">' + name + '</a>' + str + '</td></tr>\
                <tr>\
                    <td>销量：'+ saleNum + '</td>\
                    <td title="上传时间：'+ Tool.js_date_time2(addtime) + '（同步下来的时间）\n更新时间：' + Tool.js_date_time2(uptime) + '（同步下来的时间）\n本地更新时间：' + Tool.js_date_time2(self_uptime) + '（当该时大于【更新时间】就表示可以更新商品了。）">时间：' + Tool.js_date_time2(addtime) + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">备注：'+ (note ? note : "") + '</td>\
                </tr>\
            </table>'
        },
        b05: function (status, ExceptionType) {
            return '\
            <table class="table mb-0 table-bordered">\
                <tr><td title="状态">'+ this.b20(status) + '</td></tr>\
                <tr><td title="备注">'+ this.b25(ExceptionType) + '</td></tr>\
            </table>'
        },
        b06: function () {
            return '\
        <div class="input-group w-50 m-2">\
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="field" value="'+ o.params.field + '">' + this.b07(o.params.field) + '</button>\
            <ul class="dropdown-menu">\
                <li class="dropdown-item pointer" onclick="fun.c01(1)">全球商品货号</li>\
                <li class="dropdown-item pointer" onclick="fun.c01(2)">商品ID</a></li>\
                <li class="dropdown-item pointer" onclick="fun.c01(3)">标题</a></li>\
            </ul>\
            <input type="text" class="form-control" id="searchword" value="'+ o.params.searchword + '" onKeyDown="if(event.keyCode==13) fun.c02();">\
            <button class="btn btn-outline-secondary" type="button"onclick="fun.c02();">搜索</button>\
        </div>'
        },
        b07: function (val) {
            let name = "";
            switch (val) {
                case "1": name = "全球商品货号"; break;
                case "2": name = "商品ID"; break;
                case "3": name = "标题"; break;
                default: name = "未知：" + val;
            }
            return name
        },
        b08: function () {
            let arr = [];
            if (o.params.searchword) {
                switch (o.params.field) {
                    case "1": arr.push("@.proid='" + o.params.searchword + "'"); break;//商品编码
                    case "2": arr.push("@.fromID=" + o.params.searchword); break;//DH商品ID
                    case "3": arr.push("@.name like '%" + o.params.searchword + "%'"); break;//标题
                }
            }
            if (o.params.title) {
                switch (o.params.title) {
                    case "1": arr.push("@.isUnlisted=1"); break;//能下架
                    case "2": arr.push("@.isUnlisted=0"); break;//不能下架
                    case "3": arr.push("@.price_uptime=1"); break;//需要改价
                    case "4": arr.push("@.price_uptime=0"); break;//不需要改价
                    case "5": arr.push("@.price_uptime>1"); break;//已改价
                    case "6": arr.push("@.isTrueSignUp=1"); break;//已报名商品活动
                    case "7": arr.push("@.saleNum>0"); break;//有销量
                    case "8": arr.push("@.saleNum=0"); break;//无销量
                }
            }
            if (o.params.price) {
                let arr2 = Tool.shopPro_price
                for (let i = 0; i < arr2.length; i++) {
                    if ("" + arr2[i][0] == o.params.price) {
                        arr.push(arr2[i][2]);
                    }
                }
            }
            if (o.params.activity) {
                switch (o.params.activity) {
                    case "1": arr.push("@.isDiscount=1"); break;//能打折
                    case "2": arr.push("@.isDiscount=0"); break;//不能打折
                    case "3": arr.push("@.isSignUp=1"); break;//能报名
                    case "4": arr.push("@.isSignUp=0"); break;//不能报名
                    case "5": arr.push("@.isSeckill=1"); break;//能做秒杀
                    case "6": arr.push("@.isSeckill=0"); break;//不能做秒杀
                }
            }
            if (o.params.category) {
                let arr2 = Tool.shopPro_unitWeight, isBool = false;
                for (let i = 0; i < arr2.length; i++) {
                    if ("" + arr2[i][0] == o.params.category) {
                        if (i == arr2.length - 1) {
                            arr.push("@.unitWeight>" + (arr2[i][2] / 1000));
                        }
                        else {
                            arr.push("@.unitWeight>" + (arr2[i][2] / 1000) + " and @.unitWeight<=" + (arr2[i][3] / 1000));
                        }
                        isBool = true;
                        break;
                    }
                }
                //////////////////////////////////////////
                if (!isBool) {
                    if (o.params.category == "10") {
                        arr.push("@.MinimumOrder>=10");
                    }
                    else if (o.params.category == "-2") {
                        arr.push("@.MinimumOrder<>@.min_purchase_limit");
                    }
                    else {
                        arr.push("@.MinimumOrder=" + o.params.category);
                    }
                }
            }
            if (o.params.status != "") { arr.push("@.status=" + o.params.status); }
            if (o.params.ExceptionType != "") { arr.push("@.ExceptionType=" + o.params.ExceptionType); }
            let where = " order by @.self_uptime desc";
            if (o.params.info1688) {
                switch (o.params.info1688) {
                    case "1": where = " order by @._1688_maxPrice asc"; break;//价格_升序
                    case "2": where = " order by @._1688_saleNum desc"; break;//销量_升序
                    case "3": arr.push("@.scale>1"); where = " order by @._1688_saleNum asc"; break;//单件够买量>1 且 销量_升序
                }
            }
            return (arr.length == 0 ? "" : " where " + arr.join(" and ")) + where;
        },
        b09: function (_1688_maxPrice, scale, _1688_saleNum, _1688_freight, _1688_MinimumOrder) {
            let title = "1688最高单价 = " + _1688_maxPrice + "（人民币）\n\
1688单件够买量 = " + scale + "（件倍数）\n\
1688最小够买量 = " + _1688_MinimumOrder + "\n"
            return '\
        <table class="table mb-0 table-bordered">\
            <tr><td title="'+ title + '"class="nowrap">¥ ' + _1688_maxPrice.toFixed(2) + ' * ' + scale + '</td></tr>\
            <tr><td title="1688运费">¥ '+ _1688_freight.toFixed(2) + '</td></tr>\
            <tr><td title="1688销量">'+ _1688_saleNum + '</td></tr>\
        </table>'
        },
        b10: function (name, status, ExceptionType, configArr1, configArr2) {
            let nArr1 = [], arr1 = Tool.shopPro_statusArr;
            for (let i = 0; i < arr1.length; i++) {
                nArr1.push('\
                <option value="status=' + arr1[i][0] + '" ' + ("" + arr1[i][0] == "" + status ? 'selected="selected"' : '') + '>' +
                    arr1[i][0] + '.' + arr1[i][1] + (configArr1 ? '(' + configArr1[i] + ')' : '') + '\
                </option>');
            }
            ////////////////////////////////////////
            let nArr2 = [], arr2 = Tool.shopPro_ExceptionTypeArr;
            for (let i = 0; i < arr2.length; i++) {
                nArr2.push('\
                <option value="ExceptionType=' + arr2[i][0] + '" ' + ("" + arr2[i][0] == "" + ExceptionType ? 'selected="selected"' : '') + '>' +
                    arr2[i][0] + '.' + arr2[i][1] + (configArr2 ? '(' + configArr2[i] + ')' : '') + '\
                </option>');
            }
            return '\
            <select onChange="fun.c03(this.options[this.selectedIndex].value)" class="form-select">\
                <option value="">'+ name + '</option>\
                <option value="-2">*下架</option>\
                <option value="-3">*删除</option>\
                ' + nArr1.join("") + '\
                <option disabled>商品异常类型</option>\
                ' + nArr2.join("") + '\
            </select>';
            //<option value="-1">*上架</option>\
        },
        b11: function (fromid, proid, _1688_fromid) {
            let str = '\
        <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
        <ul class="dropdown-menu">\
            <li onClick="fun.c06(' + fromid + ');"><a class="dropdown-item pointer">状态设置为【-3.问题数据】</a></li>\
		</ul>'
            return '\
        <table class="table mb-0 table-bordered">\
            <tr><td title="商品ID" style="padding-left: 25px;position: relative;">'+ str + '<a href="https://seller.shopee.cn/portal/product/' + fromid + '" target="_blank" style="margin-left:10px;">' + fromid + '</a></td></tr>\
            <tr><td title="全球商品货号">'+ proid + '</td></tr>\
            <tr><td title="1688详情ID"><a href="https://detail.1688.com/offer/' + _1688_fromid + '.html" target="_blank">' + _1688_fromid + '</a></td></tr>\
        </table>'
        },
        b12: function (name, val, name2) {
            return '\
        <select onChange="fun.c04(\''+ name2 + '\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          <option value="-1">把1688信息同步过来</option>\
          <option value="1" ' + (val == "1" ? 'selected="selected"' : '') + '>价格_升序</option>\
          <option value="2" ' + (val == "2" ? 'selected="selected"' : '') + '>销量_降序</option>\
          <option value="3" ' + (val == "3" ? 'selected="selected"' : '') + '>单件够买量&gt;1</option>\
        </select>';
        },
        b13: function (val, name, configArr, config2Arr) {
            let nArr = [], arr = [
                [1, "1件"],
                [2, "2件"],
                [3, "3件"],
                [4, "4件"],
                [5, "5件"],
                [6, "6件"],
                [7, "7件"],
                [8, "8件"],
                [9, "9件"],
                [10, "&gt;=10件"],
            ];
            for (let i = 0; i < arr.length; i++) {
                nArr.push('<option value="' + arr[i][0] + '" ' + ("" + arr[i][0] == val ? 'selected="selected"' : '') + '>' + arr[i][1] + (configArr ? '(' + configArr[i] + ')' : '') + '</option>');
            }
            nArr.push('<option value="" disabled>单位重量</option>')
            let arr2 = Tool.shopPro_unitWeight;
            for (let i = 0; i < arr2.length; i++) {
                nArr.push('<option value="' + arr2[i][0] + '" ' + ("" + arr2[i][0] == val ? 'selected="selected"' : '') + '>' + arr2[i][1] + (config2Arr ? '(' + config2Arr[i] + ')' : '') + '</option>');
            }
            return '\
        <select onChange="Tool.open(\''+ name + '\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">店铺分类</option>\
          <option value="" disabled>最低购买量</option>\
          <option value="-2" ' + ("-2" == val ? 'selected="selected"' : '') + '>最低购买量_不匹配</option>\
          ' + nArr.join("") + '\
        </select>';
        },
        b14: function (MinimumOrder, unitWeight, min_purchase_limit) {
            return '\
        <table class="table mb-0 table-bordered">\
            <tr><td title="以前最低购买量（MinimumOrder） = '+ MinimumOrder + '\n现在最低购买量（min_purchase_limit） = ' + min_purchase_limit + '" ' + (min_purchase_limit != MinimumOrder ? ' style="color:red;"' : '') + '>' + MinimumOrder + ' 件</td></tr>\
            <tr><td title="单位重量">'+ (unitWeight * 1000).toFixed(2) + ' 克</td></tr>\
        </table>'
        },
        b15: function (MinimumOrder, input_normal_price, scale, discount, _1688_maxPrice, _1688_freight, unitWeight, logistics, num, siteObj) {
            let discount1 = 0, discount2 = 0, discount3 = 0
            if (input_normal_price != 0) {
                discount1 = Tool.profitRate.a01(discount - 6, input_normal_price, scale, MinimumOrder, _1688_maxPrice, _1688_freight, unitWeight, logistics, siteObj, num);
                discount2 = Tool.profitRate.a01(discount - 1, input_normal_price, scale, MinimumOrder, _1688_maxPrice, _1688_freight, unitWeight, logistics, siteObj, num);
                discount3 = Tool.profitRate.a01(discount, input_normal_price, scale, MinimumOrder, _1688_maxPrice, _1688_freight, unitWeight, logistics, siteObj, num);
            }
            return '\
        <table class="table mb-0 table-bordered left">\
            <tr'+ (discount1.profitRate < 10 ? ' style="color:red;"' : '') + '>\
                <td data-bs-toggle="tooltip" data-bs-placement="right"data-bs-title="说明：利润率<10则字体变红色。\n店内正常折扣 = 指定折扣 - 6 = ' + discount1.txt + '" class="nowrap">' + siteObj.currency_symbol + ' ' + discount1.profit + ' (' + discount1.profitRate + '%)</td>\
            </tr>\
            <tr'+ (discount2.profitRate < 10 ? ' style="color:red;"' : '') + '>\
                <td data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="说明：利润率<10则字体变红色。\n报名商品活动 = 指定折扣 - 1 = ' + discount2.txt + '" class="nowrap">' + siteObj.currency_symbol + ' ' + discount2.profit + ' (' + discount2.profitRate + '%)</td>\
            </tr>\
            <tr'+ (discount3.profitRate < 10 ? ' style="color:red;"' : '') + '>\
                <td data-bs-toggle="tooltip" data-bs-placement="right"data-bs-title="说明：利润率<10则字体变红色。\n店内秒杀活动 = 加购折扣 = 指定折扣 = ' + discount3.txt + '" class="nowrap" style="font-weight: bold;">' + siteObj.currency_symbol + ' ' + discount3.profit + ' (' + discount3.profitRate + '%)</td>\
            </tr>\
        </table>'
        },
        b16: function (name, val, name2, configArr) {
            let nArr = [], arr2 = Tool.shopPro_activity;
            for (let i = 0; i < arr2.length; i++) {
                nArr.push('<option value="' + arr2[i][0] + '" ' + ("" + arr2[i][0] == val ? 'selected="selected"' : '') + '>'
                    + arr2[i][0] + '.' + arr2[i][1] + (configArr ? '(' + configArr[i] + ')' : '') + '\
             </option>');
            }
            return '\
        <select onChange="fun.c08(\''+ name2 + '\',this.options[this.selectedIndex].value)" class="form-select">\
          <option value="">'+ name + '</option>\
          <option value="-2">选出能做活动的商品</option>\
         ' + nArr.join("") + '\
        </select>';
        },
        b17: function (promotion) {
            let nObj = {}
            let arr1 = promotion.ongoing_campaigns
            if (arr1) {
                for (let i = 0; i < arr1.length; i++) {
                    let name = '进行中的活动 = ' + this.b18(arr1[i].campaign_type)
                    if (!nObj[name]) {
                        if (name == '进行中的活动 = 加购优惠') {
                            nObj[name] = '；<br/>期间 = ' + Tool.js_date_time2(arr1[i].start_time) + " - " + Tool.js_date_time2(arr1[i].end_time)
                        }
                        else {
                            nObj[name] = '；<br/>促销价格 = ' + arr1[i].price + '；<br/>期间 = ' + Tool.js_date_time2(arr1[i].start_time) + " - " + Tool.js_date_time2(arr1[i].end_time)
                        }
                    }
                }
            }
            ////////////////////////////////
            let arr2 = promotion.upcoming_campaigns
            if (arr2) {
                for (let i = 0; i < arr2.length; i++) {
                    let name = '接下來的活动 = ' + this.b18(arr2[i].campaign_type)
                    if (!nObj[name]) {
                        if (name == '接下來的活动 = 加购优惠') {
                            nObj[name] = '；<br/>期间 = ' + Tool.js_date_time2(arr2[i].start_time) + " - " + Tool.js_date_time2(arr2[i].end_time)
                        }
                        else {
                            nObj[name] = '；<br/>促销价格 = ' + arr2[i].price + '；<br/>期间 = ' + Tool.js_date_time2(arr2[i].start_time) + " - " + Tool.js_date_time2(arr2[i].end_time)
                        }
                    }
                }
            }
            /////////////////////////////////////
            let nArr = []
            for (let k in nObj) {
                nArr.push(k + nObj[k])
            }
            return nArr
        },
        b18: function (campaign_type) {
            let str1 = "";
            switch (campaign_type) {
                case 1: str1 = "报名商品活动"; break;
                case 4: str1 = "加购优惠"; break;
                case 6: str1 = "报名Shopee直播"; break;
                case 7: str1 = "店内秒杀"; break;
                case 8: str1 = "折扣"; break;
                default: str1 = "未知：" + campaign_type;
            }
            return str1
        },
        b19: function (name, val, title, configArr) {
            let nArr = [], arr2 = Tool.shopPro_title;
            for (let i = 0; i < arr2.length; i++) {
                nArr.push('\
                <option value="' + arr2[i][0] + '" ' + ("" + arr2[i][0] == val ? 'selected="selected"' : '') + '>\
                ' + arr2[i][0] + '.' + arr2[i][1] + (configArr ? '(' + configArr[i] + ')' : '') + '\
                </option>');
            }
            return '\
        <select onChange="fun.c07(\''+ title + '\',this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">'+ name + '</option>\
            <option value="-2">全部商品设置为待更新</option>\
            <option value="-3">异常商品设置为待更新</option>\
            ' + nArr.join("") + '\
        </select>';
        },
        b20: function (status) {
            let str = "未知：" + status;
            let arr = Tool.shopPro_statusArr
            for (let i = 0; i < arr.length; i++) {
                if (status == arr[i][0]) {
                    str = arr[i][1];
                    break;
                }
            }
            return str;
        },
        b21: function (isDiscount, isSignUp, isSeckill) {
            let str1, str2, str3;
            if (isDiscount) { str1 = '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">能打折</span>'; } else { str1 = '<span class="p-1" style="color: #666;background-color:#eee;">不能打折</span>'; }
            //////////////////////////////////
            if (isSignUp) { str2 = '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">能报名</span>'; } else { str2 = '<span class="p-1" style="color: #666;background-color:#eee;">不能报名</span>'; }
            //////////////////////////////////
            if (isSeckill) { str3 = '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">能做秒杀</span>'; } else { str3 = '<span class="p-1" style="color: #666;background-color:#eee;">不能做秒杀</span>'; }
            /////////////////////////////////
            return '\
        <table class="table mb-0 table-bordered">\
            <tr><td>'+ str1 + '</td></tr>\
            <tr><td>'+ str2 + '</td></tr>\
            <tr><td>'+ str3 + '</td></tr>\
        </table>';
        },
        b22: function (input_normal_price, discount, newDiscount, siteObj, oo) {
            let price1 = Tool.fomatFloat(input_normal_price * (1 - discount / 100), siteObj.scale)
            let price2 = Tool.fomatFloat(price1 * (1 + siteObj.taxRate / 100), siteObj.scale)
            let str1 = '最终定价 = ' + siteObj.currency_symbol + ' ' + input_normal_price
            let str2 = str1 + '\n计划折扣 = -' + discount + '%\n计划折扣价[税前] = ' + siteObj.currency_symbol + ' ' + price1 + '\n税率 = ' + siteObj.taxRate + '%\n计划折扣价[税后] = ' + siteObj.currency_symbol + ' ' + price2
            let price3 = Tool.fomatFloat(input_normal_price * (1 - newDiscount / 100), siteObj.scale)
            let str3 = '最终折扣价 = ' + price3 + '\n最终折扣 = -' + newDiscount + '%\n\n';
            //input_normal_price   表示【最终定价】
            return '\
        <table class="table mb-0 table-bordered left">\
            <tr><td title="'+ str1 + '"><s style="color:#929292">' + siteObj.currency_symbol + " " + input_normal_price + '</s></td></tr>\
            <tr><td title="'+ str2 + '">' + siteObj.currency_symbol + ' ' + price1 + '<sup>-' + discount + '%</sup></td></tr>\
            <tr'+ (newDiscount <= 8 || newDiscount >= 80 ? ' style="background-color:#ffc63d;"' : '') + '>\
                <td class="nowrap" data-bs-toggle="tooltip" data-bs-placement="right"data-bs-title="'+ str3 + oo.str + '" ' + (input_normal_price == oo.price ? '' : 'style="color:red;" ') + '>\
                   ' + siteObj.currency_symbol + ' ' + price3 + '<sup>-' + newDiscount + '%</sup>\
               </td>\
            </tr>\
        </table>';
        },
        b23: function (name, val, price, configArr) {
            //为什么要搞这个折扣？答：在报商品活动的时候，折扣太小报不了。
            let n2Arr = [], arr2 = Tool.shopPro_price
            for (let i = 0; i < arr2.length; i++) {
                n2Arr.push('\
                <option value="' + arr2[i][0] + '" ' + (arr2[i][0] == val ? 'selected="selected"' : '') + '>\
                ' + arr2[i][0] + '.' + arr2[i][1] + (configArr ? '(' + configArr[i] + ')' : '') + '\
                </option>');
            }
            return '\
            <select onChange="fun.c05(\''+ price + '\',this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">'+ name + '</option>\
            <option value="-1">重新计算【最终折扣】</option>\
            ' + n2Arr.join("") + '\
            </select>';
        },
        b24: function () {
            return '\
            <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
            <ul class="dropdown-menu">\
                <li onClick="Tool.openR(\'jsFile=' + o.params.jsFile + '&jsFile2=01\');"><a class="dropdown-item pointer">更新数量</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=02\');"><a class="dropdown-item pointer">*获取【店铺商品】信息</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=04\');"><a class="dropdown-item pointer">*获取【店铺商品】详情信息</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=03\');"><a class="dropdown-item pointer">把1688信息同步过来</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=05\');"><a class="dropdown-item pointer">重新计算【最终折扣】</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=06\');"><a class="dropdown-item pointer">选出能做活动的商品</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=07\');"><a class="dropdown-item pointer">*更新【店铺商品】信息</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=09\');"><a class="dropdown-item pointer">*下架</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=08\');"><a class="dropdown-item pointer">*删除</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=11\');"><a class="dropdown-item pointer">*生成图片水印</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=18\');"><a class="dropdown-item pointer">*生成首图水印</a></li>\
                <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=10\');"><a class="dropdown-item pointer">*生成视频</a></li>\
            </ul>'
        },
        b25: function (ExceptionType) {
            let str1 = "未知：" + ExceptionType
            let arr = Tool.shopPro_ExceptionTypeArr
            for (let i = 0; i < arr.length; i++) {
                if (ExceptionType == arr[i][0]) {
                    str1 = arr[i][1];
                    break;
                }
            }
            return str1;
        },
    })
// switch (status) {
//     case 1:
//         str3 = '\
//     <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=13&site=' + o.params.site + '&status=' + status + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*下架</a></li>\
//     <li onClick="Tool.openR(\'jsFile='+ o.params.jsFile + '&jsFile2=16&site=' + o.params.site + '&status=' + status + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*置顶推广</a></li>';
//         break;
//     case 8:
//         str3 = '<li onClick="Tool.openR(\'jsFile=' + o.params.jsFile + '&jsFile2=14&site=' + o.params.site + '&status=' + status + '&num=' + o.params.num + '\');"><a class="dropdown-item pointer">*上架</a></li>';
//         break;
// }