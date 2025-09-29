'use strict';
!function () {
    let path = "admin/js/Shopee/商品/"
    switch (o.params.jsFile) {
        case "js04": Tool.scriptArr([path + '店铺商品/index.js']); break;
        case "js19": Tool.scriptArr([path + '违规或删除/index.js']); break;
        case "js22": Tool.scriptArr([path + '图片/index.js']); break;
        case "js28": Tool.scriptArr([path + '图片/index.js']); break;
        case "js40": Tool.scriptArr([path + '全球商品/index.js']); break;
        case "js43": Tool.scriptArr([path + '全球商品_修改/index.js']); break;
        default: Tool.scriptArr([path + '平台关联/index.js']); break;
    }
}();
//case "js01": Tool.scriptArr([path + '商品/把速卖通信息同步过来.js']); break;
// case "js03": Tool.scriptArr([
//     'admin/js/Shopee/卖家账户/更多/common.js',
//     path + '商品/从Shopee获取【马来西亚站点】商品信息.js'
// ]); break;
