Object.assign(Tool, {
    common3: {
        a01: function (oo) {
            return '\
            <tr>\
                <td class="right">属性：</td>\
                <td><pre>'+ (oo.list[2][0] ? JSON.stringify(JSON.parse(oo.list[2][0].sku), null, 2) : '') + '</pre></td>\
            </tr>'
        }
    }
})