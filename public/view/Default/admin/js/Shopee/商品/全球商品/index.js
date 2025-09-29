'use strict';
!function () {
    let path = "admin/js/Shopee/商品/全球商品/"
    let loginPath = ["admin/js/Shopee/common.js", "admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile2) {
        case "01": Tool.scriptArr([
            path + '../common.js',
            path + '更多/更新数量/common.js',
            path + '更多/更新数量/index.js'
        ]); break;
        case "02": Tool.scriptArr(loginPath.concat([
            path + '../common_logistics.js',
            path + 'common_price.js',
            path + '更多/发布到【店铺商品】中去/1.获取信息.js',
            path + '更多/发布到【店铺商品】中去/common2.js',
            path + '更多/发布到【店铺商品】中去/common3.js',
            path + '更多/发布到【店铺商品】中去/common4.js',
            path + '更多/发布到【店铺商品】中去/index.js'
        ])); break;
        case "03": Tool.scriptArr([path + '更多/把【Shopee广告】中的关键词同步过来.js']); break;
        case "04": Tool.scriptArr([path + '更多/把速卖通的【折扣】同步过来.js']); break;
        case "05": Tool.scriptArr([path + '更多/把1688的【手动审核1688状态】同步过来.js']); break;
        case "06": Tool.scriptArr([path + '更多/去掉【标题】和【详情】中的违禁词.js']); break;
        case "07": Tool.scriptArr(loginPath.concat([
            path + '更新前本地状态/更新商品/common_attributes.js',
            path + '更新前本地状态/更新商品/common_sku.js',
            path + '更新前本地状态/更新商品/1.获取商品信息.js',
            path + '更新前本地状态/更新商品/2.拼装提交对象.js',
            path + '更新前本地状态/更新商品/3.拼装提交对象.js',
            path + '更新前本地状态/更新商品/4.拼装提交对象.js',
            path + '更新前本地状态/更新商品/5.提交对象.js',
            path + '更新前本地状态/更新商品/index.js',
        ])); break;
        case "08": Tool.scriptArr(loginPath.concat([
            'admin/js/common_img/index.js',
            'admin/js/common_img/uploadFile.js',
            path + 'common_self_ArrayBuffer.js',
            path + '手动审核1688状态/上传主视频到shopee.js'
        ])); break;
        case "09": Tool.scriptArr(loginPath.concat([
            'admin/js/common_img/index.js',
            'admin/js/common_img/uploadFile.js',
            path + 'common_self_ArrayBuffer.js',
            path + '手动审核1688状态/上传讲解视频到shopee.js'
        ])); break;
        case "10": Tool.scriptArr([path + '手动审核1688状态/重新采集1688商品状态.js']); break;
        case "11": Tool.scriptArr([
            'admin/js/1688/采集箱/common_滑块验证码.js',
            'admin/js/1688/采集箱/商品列表/common_采集商品详情.js',
            path + '手动审核1688状态/重新采集1688商品.js'
        ]); break;
        case "12": Tool.scriptArr([
            'admin/js/1688/采集箱/商品列表/common_采集商品详情_tabs_remove_create_indexOf.js',
            path + '手动审核1688状态/重新采集1688商品讲解视频.js'
        ]); break;
        case "13": Tool.scriptArr([path + '更多/把【shopee首图-已弃用.db】同步过来.js']); break;
        case "14": Tool.scriptArr(loginPath.concat([path + '更多/获取【全球商品】信息找到要更新的商品.js'])); break;
        default: Tool.scriptArr([
            'admin/js/敦煌网/已上传商品/商品/common.js',
            path + '../common.js',
            path + '首页/common_绑定类目.js',
            path + '首页/index.js'
        ]); break;
    }
}();