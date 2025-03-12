Object.assign(Tool, {
    common4: {
        a01: function (oo) {
            return '\
                    <tr><td class="right w200">详情：</td><td>' + (oo.id ? this.b17(oo.id,
                oo.ManualReview_1688_description,
                oo.tw_description,
                oo.ms_description,
                oo.en_description,
                oo.pt_description,
                oo.es_description,
                oo.th_description,
                oo.vi_description
            ) : '') + '</td></tr>'
        },
        b17: function (id, ManualReview_1688_description, tw_description, ms_description, en_description, pt_description, es_description, th_description, vi_description) {
            let str = '\
            <ul class="makeHtmlTab">\
                <li onclick="Tool.common4.c15($(this),1)" class="hover">中文（简体）</li>\
                <li onclick="Tool.common4.c15($(this),2)" title="台湾">中文（繁体）【tw】</li>\
                <li onclick="Tool.common4.c15($(this),3)" title="马来西亚">马来语【ms】</li>\
                <li onclick="Tool.common4.c15($(this),4)" title="新加坡/马来西亚/菲律宾">英语【en】</li>\
                <li onclick="Tool.common4.c15($(this),5)" title="巴西">葡萄牙语【pt】</li>\
                <li onclick="Tool.common4.c15($(this),6)" title="墨西哥/哥伦比亚/智利">西班牙语【es】</li>\
                <li onclick="Tool.common4.c15($(this),7)" title="泰国">泰语【th】</li>\
                <li onclick="Tool.common4.c15($(this),8)" title="越南">越南语【vi】</li>\
            </ul>\
            <textarea id="description1" rows="10" class="form-control form-control" onblur="fun.c06($(this),' + id + ',\'ManualReview_1688_description\')">' + ManualReview_1688_description + '</textarea>\
            <textarea id="description2" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'tw_description\')">' + tw_description + '</textarea>\
            <textarea id="description3" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'ms_description\')">' + ms_description + '</textarea>\
            <textarea id="description4" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'en_description\')">' + en_description + '</textarea>\
            <textarea id="description5" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'pt_description\')">' + pt_description + '</textarea>\
            <textarea id="description6" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'es_description\')">' + es_description + '</textarea>\
            <textarea id="description7" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'es_description\')">' + th_description + '</textarea>\
            <textarea id="description8" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'es_description\')">' + vi_description + '</textarea>'
            return str;
        },
        ////////////////////////////////////////
        c06: function (This, id, L) {
            if (!This.attr("disabled")) {
                This.attr("disabled", true);
                let html = "\"ok\"<r: db=\"sqlite.shopee\">update @.GlobalPro set @." + L + "=" + Tool.rpsql(This.val()) + " where @.id=" + id + "</r:>"
                Tool.at(html)
                //Tool.ajax.a01(html, 1, this.c07, this, This);
            }
        },
        c07: function (t, This) {
            if (t == "ok") {
                This.attr("disabled", false);
            }
            else { alert("出错：" + t); }
        },
        c15: function (This, id) {
            This.parent().find('li').attr("class", "");
            This.attr("class", "hover")
            $("textarea[id^='description']").hide();
            $("#description" + id).show();
        },
    }
})