'use strict';
!function () {
    let path = "admin/js/Shopee/营销中心/店内秒杀/"
    let commonPath = "admin/js/Shopee/common.js"
    let loginPath = ["admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile2) {
        case "01": Tool.scriptArr(loginPath.concat([commonPath, path + '更多_all/获取【店内秒杀】信息/common.js', path + '更多_all/获取【店内秒杀】信息/index.js'])); break;
        case "02": Tool.scriptArr(loginPath.concat([commonPath, path + '状态_删除.js'])); break;
        case "js11": Tool.scriptArr(loginPath.concat([path + '店内秒杀/获取【店内秒杀】信息.js'])); break;
        default: Tool.scriptArr([commonPath, path + '../common.js', path + '首页.js']); break;
    }
}();