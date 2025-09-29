'use strict';
!function () {
    let path = "admin/js/Shopee/商品/平台关联/"
    let loginPath = ["admin/js/Shopee/common.js", "admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile2) {
        case "01": Tool.scriptArr([path + '更多/更新数量/common.js', path + '更多/更新数量/index.js']); break;
        case "02": Tool.scriptArr([path + '全球商品/更多/获取敦煌网【手动审核通过】的商品.js']); break;
        case "03": Tool.scriptArr(loginPath.concat([path + '全球商品/更多/将【未上传】的商品上传到【Shopee全球商品】.js'])); break;
        case "04": Tool.scriptArr(loginPath.concat([path + '全球商品/更多/删除【Shopee全球商品】中【没被记录】的商品.js'])); break;
        case "05": Tool.scriptArr(loginPath.concat([path + '全球商品/更多/重新记录【已上传】的商品.js'])); break;
        case "06": Tool.scriptArr(['admin/js/Shopee/通用/把一个db文件拆分成多个db文件.js']); break;
        case "07": Tool.scriptArr([path + '全球商品/敦煌手动审核状态_获取【敦煌手动审核状态】.js']); break;
        case "08": Tool.scriptArr([path + '更新后违规类型/从【违规或删除】中同步该信息.js']); break;
        default: Tool.scriptArr([
            'admin/js/敦煌网/已上传商品/商品/common.js',
            path + '../common.js',
            path + '首页.js']); break;
    }
}();