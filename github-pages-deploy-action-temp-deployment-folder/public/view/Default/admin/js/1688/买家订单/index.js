'use strict';
!function () {
    //obj.params.jsFile     选择JS文件  
    let path = "admin/js/1688/买家订单/"
    switch (obj.params.jsFile) {
        case "js01": Tool.scriptArr(['admin/js/1688/common.js', 'admin/js/1688/common_登录.js', path + '获取买家【近三个月订单】.js']); break;
        case "js02": Tool.scriptArr(['admin/js/1688/common.js', 'admin/js/1688/common_登录.js', path + '获取买家【三个月前订单】.js']); break;
        case "js03": Tool.scriptArr(['admin/js/1688/common.js', 'admin/js/1688/common_登录.js', path + '获取【订单详情】.js']); break;
        default: Tool.scriptArr([path + '首页.js']); break;
    }
}();