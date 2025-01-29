Object.assign(Tool, {
    common1: {
        a01: function (oo) {
            return '\
            <tr>\
                <td class="p-0" colspan="2">'+
                (oo.id ? this.b01(
                    oo.pic,
                    oo.ManualReview_1688_subject,
                    oo.id,
                    oo.proid,
                    oo.tw_nameLen,
                    oo.tw_2_nameLen,
                    oo.ms_nameLen,
                    oo.en_nameLen,
                    oo.pt_nameLen,
                    oo.es_nameLen,
                    oo.tw_name,
                    oo.tw_1_name,
                    oo.tw_2_name,
                    oo.ms_name,
                    oo.en_name,
                    oo.pt_name,
                    oo.es_name,
                    (oo.list[0][0] ? oo.list[0][0].subject : ""),
                    oo.tw_ads_key,
                    oo.my_ads_key,
                    oo.br_ads_key,
                    oo.list[4][0],
                    oo.list[5][0],
                    oo.list[6][0]) : '') +
                '</td>\
            </tr>\
            <tr>\
              <td class="right">1688类目路径：</td>\
              <td>'+ (oo.list[1][0] ? (oo.list[1][0].catNamePath ? oo.list[1][0].catNamePath : '') : '') + '</td>\
            </tr>\
            <tr>\
              <td class="right">shopee类目路径：</td>\
              <td style="padding-left:30px;position: relative;">'+ this.b04(oo.list[1][0]) + '</td>\
            </tr>\
             <tr>\
              <td class="right">更新前本地状态：</td>\
              <td>'+ (oo.id ? this.b03(oo.BeforeReview, Tool.BeforeReview) : "") + '</td>\
            </tr>\
           <tr>\
              <td class="right">编码：</td>\
              <td style="padding-left:30px;position: relative;">'+ this.b02(oo.proid) + '</td>\
            </tr>\
            <tr>\
              <td class="right">手动选中的【详情ID】：</td>\
              <td>'+ (oo.manualreview_1688_fromid ? '<a href="https://detail.1688.com/offer/' + oo.manualreview_1688_fromid + '.html" target="_blank">' + oo.manualreview_1688_fromid + '</a>' : '') + '</td>\
            </tr>\
            <tr>\
              <td class="right">商品ID：</td>\
              <td>'+ (oo.fromID ? '<a href="https://seller.shopee.cn/portal/product/mtsku/' + oo.fromID + '" target="_blank">' + oo.fromID + '</a>' : '') + '</td>\
            </tr>\
            <tr>\
              <td class="right">手动审核1688后单位重量：</td>\
              <td>'+ (oo.id ? '<div class="input-group w200"><input type="text" value="' + oo.ManualReview_1688_unitWeight + '" class="form-control" onblur="Tool.common1.c04($(this),' + oo.id + ',\'ManualReview_1688_unitWeight\',\'' + oo.ManualReview_1688_unitWeight + '\')"><span class="input-group-text" id="inputGroup-sizing-sm">KG</span></div>' : '') + '</td>\
            </tr>\
            <tr>\
              <td class="right">折扣：</td>\
              <td>'+ (oo.id ? '<input type="text" value="' + oo.discount + '" class="form-control w100" onblur="Tool.common1.c04($(this),' + oo.id + ',\'discount\',\'' + oo.discount + '\')">' : '') + '</td>\
            </tr>'
        },
        ///////////////////////////////////////////////////////////////////////////
        b01: function (pic,
            ManualReview_1688_subject,
            id, proid,
            tw_nameLen,
            tw_2_nameLen,
            ms_nameLen,
            en_nameLen,
            pt_nameLen,
            es_nameLen,
            tw_name,
            tw_1_name,
            tw_2_name,
            ms_name,
            en_name,
            pt_name,
            es_name,
            _1688_subject,
            tw_ads_key,
            my_ads_key,
            br_ads_key,
            tw_keyword_cn_keyword,
            my_keyword_cn_keyword,
            br_keyword_cn_keyword) {
            return '\
            <table class="table table-bordered mb-0 align-middle">\
                <tr>\
                    <td rowspan="7" class="w270 p-0" title="首图">\
                        <div class="easyzoom easyzoom--overlay">\
                            <a href=\"https://s-cf-sg.shopeesz.com/file/' + pic + '\">\
                                <img src="https://s-cf-sg.shopeesz.com/file/'+ pic + '_tn"  class="figure-img img-fluid mb-0 rounded w270">\
                            </a>\
                        </div>\
                    </td>\
                    <td colspan="5">\
                        <div style="color:#999;">原标题：'+ (_1688_subject ? _1688_subject : '') + '</div>\
                        <input type="text" value="'+ ManualReview_1688_subject + '" class="form-control" onblur="Tool.common1.c13($(this),' + id + ')" title="品牌名称 + 商品类型 + 主要特点（材质、颜色、尺寸、型号）">\
                    </td>\
                </tr>\
                <tr class="table-light center">\
                    <th class="w100">站点</th>\
                    <th class="w100">语言</th>\
                    <th class="">主推关键词</th>\
                    <th class="w70">长度</th>\
                    <th class="left">标题</th>\
                </tr>\
                <tr>\
                    <td class="center">台湾</td>\
                    <td class="center">中文(繁体)</td>\
                    <td class="center">\
                    '+ (tw_ads_key ? tw_ads_key + '（' + tw_keyword_cn_keyword.tw_keyword_cn_keyword + '）' : '') + '</td>\
                    <td colspan="2" class="p-0">'+ this.b06(_1688_subject, tw_nameLen, tw_name, tw_1_name, tw_2_nameLen, tw_2_name, proid) + '</td>\
                </tr>\
                <tr>\
                    <td class="center">马来西来</td>\
                    <td class="center">马来语</td>\
                    <td class="center">-</td>\
                    <td id="ms_nameLen" class="center">'+ (ms_nameLen < 25 || ms_nameLen > 100 ? '<font color=red>' + ms_nameLen + '</font>' : ms_nameLen) + '</td>\
                    <td id="ms_name">'+ ms_name + '</td>\
                </tr>\
                <tr>\
                    <td class="center">马来西来</td>\
                    <td class="center">英语</td>\
                    <td class="center">'+ (my_ads_key ? my_ads_key + (my_keyword_cn_keyword ? '（' + my_keyword_cn_keyword.my_keyword_cn_keyword + '）' : '') : '') + '</td>\
                    <td id="en_nameLen" class="center" title="商品名称的建议字数为 25~100">'+ (en_nameLen < 25 || en_nameLen > 100 ? '<font color=red>' + en_nameLen + '</font>' : en_nameLen) + '</td>\
                    <td id="en_name">'+ en_name + '</td>\
                </tr>\
                <tr>\
                    <td class="center">巴西</td>\
                    <td class="center">葡萄牙语</td>\
                    <td class="center">'+ (br_ads_key ? br_ads_key : '') + '</td>\
                    <td id="pt_nameLen" class="center" title="商品名称的建议字数为 25~100">'+ (pt_nameLen < 25 || pt_nameLen > 100 ? '<font color=red>' + pt_nameLen + '</font>' : pt_nameLen) + '</td>\
                    <td id="pt_name">'+ pt_name + '</td>\
                </tr>\
                <tr>\
                    <td class="center">墨西哥</td>\
                    <td class="center">西班牙语</td>\
                    <td class="center">-</td>\
                    <td id="pt_nameLen" class="center" title="商品名称的建议字数为 25~100">'+ (es_nameLen < 25 || es_nameLen > 100 ? '<font color=red>' + es_nameLen + '</font>' : es_nameLen) + '</td>\
                    <td id="pt_name">'+ es_name + '</td>\
                </tr>\
            </table>'
            //说明：pt表示葡萄牙语。
        },
        b02: function (proid) {
            let str = "";
            if (proid) {
                str = '\
                <button title="操作" class="menu-button show" data-bs-toggle="dropdown" aria-expanded="true"><div></div><div></div><div></div></button>\
                <ul class="dropdown-menu">\
                    <li onclick="Tool.common1.c11(\''+ proid + '\');"><a class="dropdown-item pointer">设置为【未更新】</a></li>\
                </ul>'+ proid;
            }
            return str
        },
        b03: function (ManualReview, arr) {
            let str = "未知:" + ManualReview;
            for (let i = 0; i < arr.length; i++) {
                if (ManualReview == arr[i][0]) {
                    str = ManualReview + "." + arr[i][1];
                    break;
                }
            }
            return str
        },
        b04: function (t) {
            let str = "";
            if (t) {
                let nameArr = this.b05([], t.list[0])
                str = '\
                <button title="操作" class="menu-button show" data-bs-toggle="dropdown" aria-expanded="true"><div></div><div></div><div></div></button>\
                <ul class="dropdown-menu">\
                    <li onclick="Tool.BindCategory0.a01(\''+ t.fromid_1688 + '\');"><a class="dropdown-item pointer">绑定类目</a></li>\
                </ul>'+ nameArr.join(" &gt; ") + "（类目ID:" + t.bindShopee + "）";
            }
            return str
        },
        //整理成1维数组
        b05: function (newArr, arr) {
            if (arr.length != 0) {
                newArr.unshift(arr[0].name);
                return this.b05(newArr, arr[0].list[0])
            }
            return newArr
        },
        b06: function (_1688_subject, tw_nameLen, tw_name, tw_1_name, tw_2_nameLen, tw_2_name, proid) {
            return ' <table class="table align-middle mb-0">\
            <tr>\
                <td id="tw_nameLen" class="center w70" title="商品名称的建议字数为 25~60">' + (tw_nameLen < 25 || tw_nameLen > 100 ? '<font color=red>' + tw_nameLen + '</font>' : tw_nameLen) + '</td>\
                <td id="tw_name">'+ tw_name + '</td>\
            </tr>\
            <tr>\
                <td colspan="2"><input type="text" value="'+ (tw_1_name == null ? _1688_subject : tw_1_name) + '" class="form-control" class="form-control" onblur="Tool.common1.c14($(this),\'' + proid + '\')"></td>\
            </tr>\
            <tr>\
                <td class="center" title="商品名称的建议字数为 25~100" id="tw_2_nameLen">\
                    ' + (tw_2_nameLen < 25 || tw_2_nameLen > 100 ? '<font color=red>' + tw_2_nameLen + '</font>' : tw_2_nameLen) + '\
                </td>\
                <td id="tw_2_name">'+ (tw_2_name ? tw_2_name : '') + '</td>\
            </tr>\
            </table>'
        },
        /////////////////////////////////////////////////////
        c04: function (This, id, L, V) {
            let val = This.val()
            if (val != V && !This.attr("disabled")) {
                This.attr("disabled", true);
                let data = [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "update @.table set @." + L + "='" + val + "' where @.id=" + id,
                }]
                Tool.ajax.a01(data, this.c05, this, [This, val]);
            }
        },
        c05: function (t, arr) {
            if (t[0].length == 0) {
                arr[0].attr("disabled", false);
            }
            else {
                Tool.pre("出错：" + t);
            }
        },
        c11: function (proid) {
            if (confirm("确定要修改码？")) {
                let str = '"ok"<r: db="sqlite.shopee">update @.GlobalPro set @.BeforeReview=0,@.err=null where @.proid=\'' + proid + '\'</r:>'
                Tool.at(str)
                //Tool.ajax.a01(str, Tool.reload);
            }
        },
        c13: function (This, id) {
            let val = Tool.Trim(This.val())
            if (!This.attr("disabled")) {
                This.attr("disabled", true);
                let dom = {
                    This: This,
                    tw_nameLen: $("#tw_nameLen"),
                    tw_name: $("#tw_name"),
                    ms_nameLen: $("#ms_nameLen"),
                    ms_name: $("#ms_name"),
                    en_nameLen: $("#en_nameLen"),
                    en_name: $("#en_name"),
                    pt_nameLen: $("#pt_nameLen"),
                    pt_name: $("#pt_name"),
                }
                Tool.translate.a01(dom, id, val);
            }
        },
        c14: function (This, proid) {
            let val = Tool.Trim(This.val())
            if (!This.attr("disabled")) {
                This.attr("disabled", true);
                let dom = {
                    This: This,
                    tw_2_nameLen: $("#tw_2_nameLen"),
                    tw_2_name: $("#tw_2_name"),
                }
                Tool.translate_tw.a01(dom, proid, val);
            }
        },
    }
})