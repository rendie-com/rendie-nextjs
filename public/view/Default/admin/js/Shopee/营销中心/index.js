'use strict';
!function () {
    //o.params.jsFile     选择JS文件      
    let path = "admin/js/Shopee/营销中心/"
    switch (o.params.jsFile) {
        case "01": Tool.scriptArr([path + '优惠券/index.js']); break;
        case "02": Tool.scriptArr([path + '折扣/index.js']); break;
        case "03": Tool.scriptArr([path + '加购优惠/index.js']); break;
        case "04": Tool.scriptArr([path + '店内秒杀/index.js']); break;
        case "05": Tool.scriptArr([path + '运费促销/index.js']); break;
        default: Tool.scriptArr([path + '营销中心/index.js']);
    }
}();