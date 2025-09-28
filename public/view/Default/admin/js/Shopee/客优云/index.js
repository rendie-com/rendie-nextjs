'use strict';
!function () {
    //o.params.jsFile     选择JS文件  
    let path = "admin/js/Shopee/客优云/"
    let loginPath = [
        path + "common.js",
        path + "common_登录.js",
    ]
    switch (o.params.jsFile) {
        case "js01": Tool.scriptArr(loginPath.concat([
            path + '订单管理/更多/同步缺失订单/common/1.同步缺失订单.js',
            path + '订单管理/更多/同步缺失订单/common/2.获取订单信息.js',
            path + '订单管理/更多/同步缺失订单/common/3.执行【代打包】操作.js',
            path + '订单管理/更多/同步缺失订单/index.js'
        ])); break;
        case "js02": Tool.scriptArr(["admin/js/Shopee/common.js", path + "common.js", path + '包裹管理/index.js']); break;
        case "js03": Tool.scriptArr(loginPath.concat([path + '包裹管理/更多/获取包裹信息.js'])); break;
        case "js04": Tool.scriptArr([path + "common.js", path + '充值日志/index.js']); break;
        case "js05": Tool.scriptArr(loginPath.concat([path + '充值日志/获取充值日志.js'])); break;
        case "js06": Tool.scriptArr([path + "common.js", path + '系统消息/index.js']); break;
        case "js07": Tool.scriptArr(loginPath.concat([path + '系统消息/获取系统消息.js'])); break;
        case "js08": Tool.scriptArr([path + "common.js", path + '问题件/index.js']); break;
        case "js09": Tool.scriptArr(loginPath.concat([path + '问题件/获取问题件.js'])); break;
        case "js10": Tool.scriptArr([path + "common.js", path + '黑名单/index.js']); break;
        case "js11": Tool.scriptArr(loginPath.concat([path + '黑名单/获取黑名单.js'])); break;
        case "js12": Tool.scriptArr([path + "common.js", path + '违禁词/index.js']); break;
        case "js13": Tool.scriptArr(loginPath.concat([path + '违禁词/获取违禁词.js'])); break;
        case "js14": Tool.scriptArr([
            "admin/js/Shopee/common.js",
            path + "common.js",
            path + '订单管理/index.js'
        ]); break;
        case "js15": Tool.scriptArr([path + '账户/修改.js']); break;
        case "js16": Tool.scriptArr(loginPath.concat([
            'admin/js/1688/common_登录.js',
            'admin/js/1688/common.js',
            path + '包裹管理/更多/把1688运单号同步过来/common1.js',
            path + '包裹管理/更多/把1688运单号同步过来/common2.js',
            path + '包裹管理/更多/把1688运单号同步过来/index.js'
        ])); break;
        case "js17": Tool.scriptArr([
            path + '包裹管理/更多/更新数量/common.js',
            path + '包裹管理/更多/更新数量/index.js'
        ]); break;
        case "js18": break;
        case "js19": Tool.scriptArr([path + "common.js", path + '店铺授权/index.js']); break;
        case "js20": Tool.scriptArr(loginPath.concat([path + "common.js", path + '店铺授权/更多/获取授权信息.js'])); break;
        case "js21": Tool.scriptArr(loginPath.concat([path + "common.js", path + '店铺授权/更多/添加授权/index.js'])); break;
        case "js22": Tool.scriptArr([
            "admin/js/Shopee/common.js",
            path + '订单管理/更多/更新数量/common.js',
            path + '订单管理/更多/更新数量/index.js'
        ]); break;
        default: Tool.scriptArr(loginPath.concat([path + "common.js", path + '账户/index.js']));
    }
}();