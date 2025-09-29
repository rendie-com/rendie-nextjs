'use strict';
!function () {
    let path = "admin/js/Shopee/类目/"
    switch (o.params.jsFile) {
        case "js01": Tool.scriptArr([path + '【shopee】类目/采集类目.js']); break;
        case "js02": Tool.scriptArr([path + '【shopee】类目/采集类目属性.js']); break;
        default: Tool.scriptArr([path + '【shopee】类目/index.js']);
    }
}();