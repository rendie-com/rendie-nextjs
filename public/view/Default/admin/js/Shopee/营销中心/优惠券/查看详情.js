'use strict';
var fun =
{
    a01: function () {
        //o.params.site       站点
        let siteNum = Tool.siteNum(o.params.site, o.params.num);
        let data = [{
            action: "sqlite",
            database: "shopee/营销中心/优惠券/" + siteNum,
            sql: "select " + Tool.fieldAs("name,start_time,end_time,fe_status,rule,voucher_code,value,min_price,usage_quantity,discount,max_value") + " FROM @.table where @.id=" + o.params.id,
        }]
        Tool.ajax.a01(data, this.a02, this);
    },
    a02: function (t) {
        let rule = JSON.parse(t[0][0].rule)
        let html = Tool.header(o.params.return, "Shopee &gt; 营销中心 &gt; 优惠券 &gt; 查看详情") + '\
        <div class="p-2">\
            <table class="table">\
            <tbody>\
		        <tr>\
                <td>\
                    <table class="table align-middle mb-0">'+ this.b02(t[0][0].name, t[0][0].start_time, t[0][0].end_time, t[0][0].fe_status, rule, t[0][0].voucher_code) + this.b03(rule, t[0][0].value, t[0][0].min_price, t[0][0].usage_quantity, t[0][0].discount, t[0][0].max_value) + this.b04() + '\
                    </table>\
                </td>\
                <td class="w-25">' + this.b01() + '</td>\
                </tr>\
            </tbody>\
            </table>\
        </div>'
        Tool.html(null, null, html);
    },
    b01: function () {
        return '\
        <h3 class="m-2">预览</h3>\
        <img src="/'+ o.path + 'admin/img/shopee/优惠券.png"/>\
        <div class="p-2 m-2" style="color: #666;">买家可以使用此优惠券购买商店中的所有商品。</div>'
    },
    b02: function (name, start_time, end_time, fe_status, rule, voucher_code) {
        let str = '\
             <table class="table align-middle  mb-0"><tr>\
                <td><input class="form-control" type="text" placeholder="Select Date" disabled="disabled" value="'+ Tool.js_date_time2(start_time) + '"></td>\
                <td class="center w50">——</td>\
                <td><input class="form-control" type="text" placeholder="Select Date" disabled="disabled" value="'+ Tool.js_date_time2(end_time) + '"></td>\
            </tr>\
            <tr>\
                <td class="border-bottom-0">\
                    <div class="form-check form-switch">\
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"  '+ (rule.display_voucher_early ? 'checked' : '') + ' disabled="disabled">\
                        <label class="form-check-label" for="flexSwitchCheckDefault">提前显示优惠券</label>\
                    </div>\
                    '+ (rule.display_voucher_early ? '<input class="form-control" type="text" value="' + Tool.js_date_time2(rule.display_from) + '" disabled="disabled"><div style="color:#666;">一旦优惠券开始显示，此部分将无法再编辑</div>' : '') + '\
                </td><td class="border-bottom-0" colspan="2"></td>\
            </tr>\
            </table>'
        return '\
        <tr class="table-light"><th colspan="2">基本详情</th></tr>\
        <tr><td class="right">状态：</td><td>'+ this.b05(fe_status) + '</td></tr>\
        <tr><td class="right">优惠券类型：</td><td>'+ this.b06(rule.choose_users.shop_order_count, voucher_code) + '</td></tr>\
        <tr><td class="right">优惠券名称：</td><td><input class="form-control" type="text" placeholder="" disabled="disabled" maxlength="100" value="'+ name + '"><div style="color:#666;">优惠券名称对买家不可见</div></td></tr>\
        <tr><td class="right">优惠码：</td><td>'+ this.b10(voucher_code) + '</td></tr>\
        <tr><td class="right">优惠券领取期限：</td><td class="p-0">'+ str + '</td></tr>'
    },
    b03: function (rule, value, min_price, usage_quantity, discount, max_value) {
        return '\
        <tr class="table-light"><th colspan="2">奖励设置</th></tr>\
            <tr><td class="right">奖励类型：</td><td>\
                <div class="form-check form-check-inline">\
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option3" disabled '+ (rule.reward_type == 0 ? " checked" : "") + '>\
                    <label class="form-check-label" for="inlineRadio1">折扣</label>\
                </div>\
                <div class="form-check form-check-inline">\
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option3" disabled '+ (rule.reward_type == 1 ? " checked" : "") + '>\
                    <label class="form-check-label" for="inlineRadio2">Shopee币回扣</label>\
                </div>\
            </td></tr>\
            <tr><td class="right">折扣类型 | 优惠限额：</td><td>'+ this.b07(value, rule.coin_cashback_voucher, rule.reward_type, discount) + '</td></tr>\
            '+ this.b08(rule.coin_cashback_voucher, discount, max_value) + '\
            <tr><td class="right">最低消费金额：</td><td>\
            <div class="input-group">\
                <span class="input-group-text">$</span>\
                <input type="text" class="form-control" value="'+ min_price + '" disabled="disabled">\
            </div></td></tr>\
            <tr>\
                <td class="right">可使用总数：</td>\
                <td><input class="form-control" value="'+ usage_quantity + '" disabled="disabled"><div style="color: #999;">可供所有买家使用的优惠券总数</div></td>\
            </tr>\
            <tr><td class="right">每个买家可用的优惠券数量上限：</td><td><input class="form-control" disabled="disabled" value="'+ rule.usage_limit_per_user + '"></td></tr>'
    },
    b04: function () {
        return '\
        <tr class="table-light"><th colspan="2">显示/商品设置</th></tr></thead>\
        <tr><td class="right">优惠券显示设置：</td><td>通过优惠码分享</td></tr>\
        <tr><td class="right">优惠商品：</td><td>\
            <div class="form-check">\
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked>\
                <label class="form-check-label" for="flexRadioDefault1">全部商品</label>\
            </div>\
            <div class="form-check">\
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" >\
                <label class="form-check-label" for="flexRadioDefault2">特定的商品</label>\
            </div>\
        </td></tr>'

    },
    b05: function (fe_status) {
        let str
        switch (fe_status) {
            case 0: str = '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">进行中的活动（暂放）</span>'; break;
            case 1: str = '<span class="p-1" style="color:#ee4d2d;background-color:#fff1f0;">接下来的活动</span>'; break;
            case 2: str = '<span class="p-1" style="color: #5c7;background-color:#eaf9ef;">进行中的活动</span>'; break;
            case 3: str = '<span class="p-1" style="color: #666;background-color:#eee;">已过期</span>'; break;
            default: str = "未知：" + fe_status; break;
        }
        return str;
    },
    b06: function (shop_order_count, voucher_code) {
        let str
        switch (shop_order_count) {
            case 0:
                if (voucher_code.indexOf("LIVE-") == 0) {
                    str = '<svg style="width: 20px;margin: -3px 5px 0 0;" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.21 4.203c0-.4-.324-.725-.725-.725H2.892c-.4 0-.724.325-.724.725v11.594c0 .4.324.725.724.725h11.595c.4 0 .724-.325.724-.725V4.203zM6.514 8.019c0-.5.347-.694.75-.45l3.293 1.986c.41.247.404.658 0 .902l-3.293 1.976c-.412.244-.75.04-.75-.45V8.019z" fill="#EE4D2D"></path><path d="M18.833 12.707c0 .82-.703.967-1.072.742l-1.826-.965V7.565l1.781-1.02c.36-.211 1.11-.074 1.117.745v5.417z" fill="#EE4D2D"></path></svg>直播优惠券';
                }
                else {
                    str = '<svg style="width: 20px;margin: -3px 5px 0 0;" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.875 5.625a2.183 2.183 0 01-2.188 2.188A2.183 2.183 0 0110.5 5.624a2.183 2.183 0 01-2.187 2.188 2.183 2.183 0 01-2.187-2.188 2.183 2.183 0 01-2.188 2.187 2.179 2.179 0 01-1.83-.99 2.174 2.174 0 01-.357-1.185v-.012l.62-2.481A2.5 2.5 0 014.796 1.25h11.408a2.5 2.5 0 012.426 1.894l.62 2.48V5.638a2.177 2.177 0 01-.357 1.186 2.18 2.18 0 01-1.83.99 2.183 2.183 0 01-2.188-2.187zM3 8.933V17.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V8.933a3.44 3.44 0 01-3.125-.656 3.423 3.423 0 01-2.188.786 3.423 3.423 0 01-2.187-.786 3.424 3.424 0 01-2.188.786 3.423 3.423 0 01-2.187-.786A3.44 3.44 0 013 8.933zm8.208 6.066a.579.579 0 00-.22-.483 2.675 2.675 0 00-.768-.357 7.273 7.273 0 01-.899-.358c-.758-.371-1.137-.882-1.137-1.533a1.38 1.38 0 01.28-.856c.21-.263.488-.463.804-.579a3.121 3.121 0 011.166-.208c.388-.006.772.07 1.128.225.316.134.587.357.779.642.186.281.283.612.277.95h-1.405a.709.709 0 00-.222-.557.844.844 0 00-.589-.195.967.967 0 00-.607.168.508.508 0 00-.217.422.524.524 0 00.241.41c.262.167.548.294.847.377.346.104.68.244.996.417.632.364.949.866.949 1.506a1.43 1.43 0 01-.579 1.205c-.385.292-.914.438-1.586.438a3.186 3.186 0 01-1.289-.252 1.973 1.973 0 01-.868-.7A1.834 1.834 0 018 14.658h1.414a.91.91 0 00.241.695c.162.146.426.22.791.22a.91.91 0 00.55-.152.5.5 0 00.212-.422z" fill="#EE4D2D"></path></svg>店铺优惠券';
                }
                break;
            case 1: str = '新买家优惠券'; break;
            case 2: str = '回购买家优惠券'; break;
            case 3: str = '【回购买家优惠券】二次'; break;
            default: str = "未知：" + shop_order_count; break;
        }
        return str;
    },
    b07: function (value, coin_cashback_voucher, reward_type, discount) {
        let str = ""
        if (reward_type == 1) {
            //Shopee币回扣
            str = '\
            <div class="input-group">\
                <select class="form-select" disabled>\
                    <option  selected="selected">扣除百分比</option>\
                </select>\
                <input type="text" class="form-control" value="' + coin_cashback_voucher.coin_percentage_real + '" disabled="disabled"><span class="input-group-text">%Shopee币回扣</span>\
            </div>\
            <p style="color: #999;">\
                付款数额中的<b>' + coin_cashback_voucher.coin_percentage_real + '%</b> 将以Shopee币退还给买家。<br/>\
                Shopee币交换规则：$1 = 1 Shopee币。\
            </p>'
        }
        else if (reward_type == 0) {
            let input
            if (discount) {
                input = '<input type="text" class="form-control" value="' + discount + '" disabled="disabled"><span class="input-group-text">%折扣</span>'
            }
            else {
                input = '<span class="input-group-text">$</span><input type="text" class="form-control" value="' + value + '" disabled="disabled">'
            }
            str = '\
            <div class="input-group">\
                <select class="form-select" disabled>\
                    <option'+ (discount ? ' selected="selected"' : "") + '>扣除百分比</option>\
                    <option'+ (value ? ' selected="selected"' : "") + '>折扣金额</option>\
                </select>'+ input + '\
            </div>'
        }
        else {
            str = "未知"
        }
        return str
    },
    b08: function (coin_cashback_voucher, discount, max_value) {
        let str = ""
        if (discount) { str = this.b09(max_value, false); }
        else if (coin_cashback_voucher && coin_cashback_voucher.max_coin) { str = this.b09(coin_cashback_voucher.max_coin, true) }
        return str;
    },
    b09: function (value, isbool) {
        return '\
        <tr>\
            <td class="right">最高上限数额：</td>\
            <td>\
                <div class="form-check form-check-inline">\
                    <input class="form-check-input" type="radio" name="max_coin" id="max_coin1" disabled '+ (value ? " checked" : "") + '>\
                    <label class="form-check-label" for="max_coin1">设置金额</label>\
                </div>\
                <div class="form-check form-check-inline">\
                    <input class="form-check-input" type="radio" name="max_coin" id="max_coin2" disabled '+ (value ? "" : " checked") + '>\
                    <label class="form-check-label" for="max_coin2">无限制</label>\
                </div>\
                <div class="input-group mt-1 mb-1">\
                    <span class="input-group-text">$</span>\
                    <input type="text" class="form-control" value="' + value + '" disabled="disabled">\
                </div>\
                '+ (isbool ? '<p style="color: #666;">等于：<strong>' + value + ' Shopee币</strong></p>' : '') + '\
            </td>\
        </tr>'
    },
    b10: function (voucher_code) {
        return '\
        <div class="input-group">\
            <span class="input-group-text">'+ voucher_code.substring(0, 4) + '</span>\
            <input type="text" class="form-control" value="'+ voucher_code.substring(4) + '" disabled="disabled">\
        </div>\
        <div style="color: #666;">请输入英文字A-Z 0-9 最多输入五个字<div>您的完整优惠码是:&nbsp;'+ voucher_code + '</div></div>'
    },
}
fun.a01();