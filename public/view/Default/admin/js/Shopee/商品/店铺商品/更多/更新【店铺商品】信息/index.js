'use strict';
var fun =
{
    a01: function () {
        //obj.params.return        返回URL
        //obj.params.site          站点
        let html = Tool.header(obj.params.return, "Shopee &gt; 商品列表 &gt; 店铺商品 &gt; 更多 &gt; 更新【店铺商品】信息") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w190 right">更新站点：</td><td colspan="2">'+ Tool.site(obj.params.site) + '</td></tr>\
		    <tr><td class="right">更新条件：</td><td colspan="2">'+ this.b01() + '</td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
            <tr><td class="right">参数：</td><td colspan="2" class="p-0" id="parameter"></td></tr>\
            <tr><td class="right">物流方式：</td><td colspan="5" id="logistics" class="p-0"></td></tr>\
            <tr><td class="right">更新条件：</td><td id="where" colspan="2"></td></tr>\
		    <tr><td class="right">商品条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          <tbody id="tbody"></tbody>\
          </table>\
        </div>'
        Tool.html(null, null, html)
    },
    b01: function () {
        let str = '\
        <select onChange="fun.c01($(this),this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">请选择更新条件</option>\
            <option value="1">本地更新时间 &gt;= 同步的更新时间 && 非【审查中】</option>\
            <option value="2">以前最低购买量 &lt;&gt; 现在最低购买量 && 非【审查中】</option>\
        </select><hr/>说明：为什么不要【审查中】的数据？答：因为改不了。';
        return str;
    },
    b02: function (oo) {
        return '\
        <table class="table mb-0 align-middle">\
            <tr class="table-light center">\
                <th class="w120"></th>\
                <th class="w100">台湾虾皮</th>\
                <th class="w100">马来西亚</th>\
                <th class="w100">巴西</th>\
                <th></th>\
            </tr>\
            <tr>\
                <td class="right">汇率：</td>\
                <td><input type="text" class="form-control center" value="'+ oo.tw.exchangeRate + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.my.exchangeRate + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.br.exchangeRate + '")" disabled="disabled"></td>\
                <td></td>\
            </tr>\
            <tr>\
                <td class="right">佣金费率：</td>\
                <td><input type="text" class="form-control center" value="'+ oo.tw.commissionRate + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.my.commissionRate + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.br.commissionRate + '")" disabled="disabled"></td>\
                <td></td>\
            </tr>\
            <tr>\
                <td class="right">活动服务费率：</td>\
                <td><input type="text" class="form-control center" value="'+ oo.tw.activityServiceRate + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.my.activityServiceRate + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.br.activityServiceRate + '")" disabled="disabled"></td>\
                <td></td>\
            </tr>\
            <tr>\
                <td class="right">满多少免运费：</td>\
                <td><input type="text" class="form-control center" value="'+ oo.tw.fullPrice + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.my.fullPrice + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.br.fullPrice + '")" disabled="disabled"></td>\
                <td></td>\
            </tr>\
            <tr>\
                <td class="right">税率：</td>\
                <td><input type="text" class="form-control center" value="'+ oo.tw.taxRate + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.my.taxRate + '")" disabled="disabled"></td>\
                <td><input type="text" class="form-control center" value="'+ oo.br.taxRate + '")" disabled="disabled"></td>\
                <td></td>\
            </tr>\
            <tr>\
                <td class="right">说明：</td>\
                <td colspan="4">以这里的"参数"为准，如果不对，那就把shopee的"参数"复制过来。（注：在shopee填的参数，不会对这里的价格产生影响。）</td>\
            </tr>\
        </table>'
    },
    c01: function (This, mode) {
        This.attr("disabled", true);
        Tool.login.a01(this.c02, this, mode)
    },
    c02: function (t, mode) {
        $("#parameter").html(this.b02(t))
        $("#state").html("已登陆。。。")
        t.mode = mode
        Tool.logistics.a01(obj.params.site, $("#logistics"), this.c03, this, t)
    },
    c03: function (logistics, t) {
        t.logistics = logistics;
        Tool.common_A.a01(t, obj.params.site)
    },
}
fun.a01();