Object.assign(Tool, {
    header: function (jsFile, site) {
        let html = '\
        <header class="panel-heading">\
            <div onclick="Tool.main(\'site='+ site + '\')"' + (!jsFile ? ' class="active"' : '') + '>营销中心</div>\
            <div onclick="Tool.main(\'jsFile=01&site='+ site + '\')"' + (jsFile == "01" ? ' class="active"' : '') + '>优惠券</div>\
            <div onclick="Tool.main(\'jsFile=02&site='+ site + '\')"' + (jsFile == "02" ? ' class="active"' : '') + '>折扣</div>\
            <div onclick="Tool.main(\'jsFile=03&site='+ site + '\')"' + (jsFile == "03" ? ' class="active"' : '') + '>加购优惠</div>\
            <div onclick="Tool.main(\'jsFile=04&site='+ site + '\')"' + (jsFile == "04" ? ' class="active"' : '') + '>店内秒杀</div>\
            <div onclick="Tool.main(\'jsFile=05&site='+ site + '\')"' + (jsFile == "05" ? ' class="active"' : '') + '>运费促销</div>\
        </header>'
        return html;
    },
})