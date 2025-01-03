Object.assign(Tool, {
    common4: {
        a01: function (oo) {
            return '\
                    <tr><td class="right w200">详情：</td><td>' + (oo.id ? this.b17(oo.id,
                oo.ManualReview_1688_description,
                oo.tw_description,
                oo.ms_description,
                oo.en_description,
                oo.pt_description
            ) : '') + '</td></tr>'
        },
        b17: function (id, ManualReview_1688_description, tw_description, ms_description, en_description, pt_description) {
            let str = '\
            <ul class="makeHtmlTab">\
                <li onclick="Tool.common4.c15($(this),1)" class="hover">中文（简体）</li>\
                <li onclick="Tool.common4.c15($(this),2)">中文（繁体）</li>\
                <li onclick="Tool.common4.c15($(this),3)">马来语</li>\
                <li onclick="Tool.common4.c15($(this),4)">英语</li>\
                <li onclick="Tool.common4.c15($(this),5)">葡萄牙语</li>\
            </ul>\
            <textarea id="description1" rows="10" class="form-control form-control" onblur="fun.c06($(this),' + id + ',\'ManualReview_1688_description\')">' + ManualReview_1688_description + '</textarea>\
            <textarea id="description2" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'tw_description\')">' + tw_description + '</textarea>\
            <textarea id="description3" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'ms_description\')">' + ms_description + '</textarea>\
            <textarea id="description4" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'en_description\')">' + en_description + '</textarea>\
            <textarea id="description5" rows="10" class="form-control form-control hide" onblur="fun.c06($(this),' + id + ',\'pt_description\')">' + pt_description + '</textarea>'
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