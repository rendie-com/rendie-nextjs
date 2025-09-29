'use strict';
Object.assign(Tool, {
    shopeeCategory://Shopee类目
    {
        a01: function () {
            let data = [{
                action: "sqlite",
                database: "shopee/类目/类目",
                sql: "select " + Tool.fieldAs("isleaf,name,fromid") + " FROM @.table where @.upid=0 order by @.sort asc",
            }]
            Tool.ajax.a01(data, this.a02, this)
        },
        a02: function (t) {
            let option1 = "";
            for (let i = 0; i < t[0].length; i++) {
                option1 += '<option value="' + t[0][i].fromid + '">' + (t[0][i].isleaf == 1 ? "&nbsp; &nbsp;" : "+") + t[0][i].name + '</option>';
            }
            let html = '\
            <table class="table mb-0">\
                <tr>\
                    <td><select size="2" class="form-select" style="height:300px;width:200px;" id="shopeeList1" onChange="Tool.shopeeCategory.c02(this.value,\'2\',\'3,4,5\')">'+ option1 + '</select></td>\
                    <td><select size="2" class="form-select" style="height:300px;width:200px;" id="shopeeList2" onChange="Tool.shopeeCategory.c02(this.value,\'3\',\'4,5\')"></select></td>\
                    <td><select size="2" class="form-select" style="height:300px;width:200px;" id="shopeeList3" onChange="Tool.shopeeCategory.c02(this.value,\'4\',\'5\')"></select></td>\
                    <td><select size="2" class="form-select" style="height:300px;width:200px;" id="shopeeList4"></select></td>\
                    <td><select size="2" class="form-select" style="height:300px;width:200px;" id="shopeeList5"></select></td>\
                </tr>\
            </table>'
            let button = '\
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>\
            <button type="button" class="btn btn-primary" onClick="Tool.shopeeCategory.c01();" data-bs-dismiss="modal">查看类目</button>'
            Tool.Modal('选中要查看的【Shopee类目】', html, button, 'modal-xl');
        },
        //////////////////////////////////////////////////////////////////////////
        c01: function () {
            let category
            for (let i = 5; i > 0; i--) {
                let proselected = $("#shopeeList" + i).find("option:selected").text()
                if (proselected) { category = $("#shopeeList" + i).val(); break; }
            }
            if (category) { Tool.open("category", category); } else { Tool.at("选择绑定的分类"); }
        },
        c02: function (val, num, celar) {
            if (celar == "3,4,5") { $("#shopeeList3,#shopeeList4,#shopeeList5").html(""); }
            else if (celar == "4,5") { $("#shopeeList4,#shopeeList5").html(""); }
            else if (celar == "5") { $("#shopeeList5").html(""); }
            let This = $("#shopeeList" + num);
            This.html('<option>加载中。。。</option>');
            let data = [{
                action: "sqlite",
                database: "shopee/类目/类目",
                sql: "select " + Tool.fieldAs("name,fromid,isleaf") + " FROM @.table where @.upid=" + val + " order by @.sort asc",
            }]
            Tool.ajax.a01(data, this.c03, this, This)
        },
        c03: function (t, This) {
            let html = "", arr = t[0];
            for (let i = 0; i < arr.length; i++) {
                html += '<option value="' + arr[i].fromid + '">' + (arr[i].isleaf == 1 ? "&nbsp;&nbsp;&nbsp;" : "+") + arr[i].name + '</option>';
            }
            This.html(html);
        },
    }
})