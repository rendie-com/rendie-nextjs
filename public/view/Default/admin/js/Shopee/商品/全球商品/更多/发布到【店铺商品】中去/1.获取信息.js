'use strict';
Object.assign(Tool, {
    common1:
    {
        b01: function (t, site, num) {
            let oo = JSON.parse(t), optionArr = [], count = 0;
            for (let k in oo) {
                count++;
                for (let i = 0; i < oo[k].length; i++) {
                    optionArr.push('\
                    <option value="' + k + '|' + (i + 1) + '" ' + (k + (i + 1) == site + num ? 'selected' : '') + '>\
                        ' + count + "-" + (i + 1) + "." + Tool.site(k) + '\
                    </option>')
                }
            }
            return '\
            <select class="form-select" id="siteNum">\
                '+ optionArr.join("") + '\
            </select>';
        },
        b02: function (typeArr, ManualReview_1688_categoryId1) {
            let nArr = [];
            for (let i = 0; i < typeArr.length; i++) {
                nArr.push('\
                <option value="' + typeArr[i].fromid + '" ' + (ManualReview_1688_categoryId1 == typeArr[i].fromid ? 'selected' : '') + '>\
                    ' + (i + 1) + '.' + typeArr[i].name + '（' + typeArr[i].fromid + '）\
                </option>');
            }
            return '\
             <select class="form-select" id="ManualReview_1688_categoryId1">\
               ' + nArr.join("") + '\
             </select>';
        },
        b03: function () {
            return '\
             <table class="table mb-0 align-middle">\
                 <tr>\
                     <td class="right">店铺商品价格 = </td>\
                     <td colspan="5">全球商品价格 * 站点调价比例 + 跨境物流成本（藏价）<hr style="background-color: #000;"/>1 - 佣金费率 - 活动服务费率 - 交易手续费率</td>\
                 </tr>\
                 <tr class="table-light"><th colspan="6">例1：【马来西亚】站点</th></tr>\
                 <tr>\
                     <td class="right">全球商品价格：</td>\
                     <td>10 USD</td>\
                     <td class="right">站点调价比例：</td>\
                     <td>200 %</td>\
                     <td class="right">跨境物流成本（藏价）：</td>\
                     <td>15 MYR</td>\
                 </tr>\
                 <tr>\
                     <td class="right">佣金费率：</td>\
                     <td>7.56 %</td>\
                     <td class="right">活动服务费率：</td>\
                     <td>7.56 %（参加了活动）</td>\
                     <td class="right">交易手续费率：</td>\
                     <td>2 %</td>\
                 </tr>\
                 <tr>\
                     <td class="right">汇率：</td>\
                     <td>1 USD = 4.8 MYR</td>\
                     <td class="right">店铺商品价格：</td>\
                     <td colspan="3"><b>((10 * 4.8 * 2) + 15) / (1 - 0.0756 - 0.0756 - 0.02) ≈ 133.93 MYR</b></td>\
                 </tr>\
                 <tr>\
                     <td class="right"></td>\
                     <td></td>\
                     <td class="right">我际际上是这么做的：</td>\
                     <td colspan="3">\
                        （1）“站点调价比例”就是“利润率”，“跨境物流成本（藏价）”就是“运费”。<br/>\
                        （2）不要“运费”。因为买10件，可能还是这个运费。<br/>\
                        例如：要50%利润还要打5折，的定价是多少?<br/>\
                        商品价格 = 全球商品价格 * 汇率 * 利润率 = 10 * 4.8 * (1 + 0.5) = 10 * 4.8 * 1.5 = 72<br/>\
                        打折前 = 商品价格 / 5折  = 72 / 0.5 = 144（按这个+公式定原价）<br/>\
                        打折后 = 打折前 * 0.5 = 144 * 0.5 = 72（按这个+公式为成交价）<br/>\
                        店铺商品价格 = 打折后 / (1 - 佣金费率 - 活动服务费率 - 交易手续费率) <br/>\
                        = 72 / (1 - 0.0756 - 0.0756 - 0.02)<br/>\
                        = 72 / 0.8288<br/>\
                        = 86.872586872586872586872586872587<hr/>\
                        已知成交价，反推成本：<br/>\
                        平台费 = 店铺商品价格 * (佣金费率 + 活动服务费率 + 交易手续费率) <br/>\
                        = 86.872586872586872586872586872587 * (0.0756 + 0.0756 + 0.02)<br/>\
                        = 86.872586872586872586872586872587 * 0.1712<br/>\
                        = 14.872586872586872586872586872587<br/>\
                        我的价格 = 店铺商品价格 - 平台费 - 成本价<br/>\
                        = 86.872586872586872586872586872587 - 14.872586872586872586872586872587 - 10 * 4.8<br/>\
                        = 86.872586872586872586872586872587 - 14.872586872586872586872586872587 - 48<br/>\
                        = 24（刚好50%的利润）<br/>\
                    </td>\
                 </tr>\
                 <tr class="table-light"><th colspan="6">例2：【巴西】站点</th></tr>\
                 <tr>\
                     <td class="right">全球商品价格：</td>\
                     <td>10 USD</td>\
                     <td class="right">站点调价比例：</td>\
                     <td>200 %</td>\
                     <td class="right">跨境物流成本（藏价）：</td>\
                     <td>95.8 BRL</td>\
                 </tr>\
                 <tr>\
                     <td class="right">佣金费率：</td>\
                     <td>10 %</td>\
                     <td class="right">活动服务费率：</td>\
                     <td>0（没有参加活动）</td>\
                     <td class="right">交易手续费率：</td>\
                     <td>2 %</td>\
                 </tr>\
                 <tr>\
                     <td class="right">汇率：</td>\
                     <td>1 USD = 5.6 BRL</td>\
                     <td class="right">店铺商品价格：</td>\
                     <td colspan="3"><b>((10 * 5.6 * 2) + 95.8) / (1 - 0.1 - 0 - 0.02) ≈ 236.14 BRL</b></td>\
                 </tr>\
             </table>'
        },
        b04: function (oo) {
            return '\
            <table class="table mb-0 align-middle">\
                <tr class="table-light center">\
                    <th class="w120"></th>\
                    <th class="w120">新加坡sg</th>\
                    <th class="w120">台湾虾皮tw</th>\
                    <th class="w120">泰国th</th>\
                    <th class="w120">马来西亚my</th>\
                    <th class="w120">越南vn</th>\
                    <th class="w120">菲律宾ph</th>\
                    <th class="w120">巴西br</th>\
                    <th class="w120">墨西哥mx</th>\
                    <th class="w120">哥伦比亚co</th>\
                    <th class="w120">智利cl</th>\
                    <th></th>\
                </tr>\
                <tr>\
                    <td class="right">汇率：</td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.sg[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.tw[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.th[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.my[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.vn[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.ph[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.br[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.mx[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.co[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.cl[0].exchangeRate + '")" disabled="disabled"></td>\
                    <td class="p-0"></td>\
                </tr>\
                <tr>\
                    <td class="right">佣金费率：</td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.sg[0].commissionRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.tw[0].commissionRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.th[0].commissionRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.my[0].commissionRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.vn[0].commissionRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.ph[0].commissionRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.br[0].commissionRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.mx[0].commissionRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.co[0].commissionRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.cl[0].commissionRate + '")" disabled="disabled"></td>\
                    <td></td>\
                </tr>\
                <tr>\
                    <td class="right">活动服务费率：</td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.sg[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.tw[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.th[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.my[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.vn[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.ph[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.br[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.mx[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.co[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.cl[0].activityServiceRate + '")" disabled="disabled"></td>\
                    <td></td>\
                </tr>\
                <tr>\
                    <td class="right">满多少免运费：</td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.sg[0].fullPrice + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.tw[0].fullPrice + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.th[0].fullPrice + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.my[0].fullPrice + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.vn[0].fullPrice + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.ph[0].fullPrice + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.br[0].fullPrice + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.mx[0].fullPrice + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.co[0].fullPrice + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.cl[0].fullPrice + '")" disabled="disabled"></td>\
                    <td></td>\
                </tr>\
                <tr>\
                    <td class="right">税率：</td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.sg[0].taxRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.tw[0].taxRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.th[0].taxRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.my[0].taxRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.vn[0].taxRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.ph[0].taxRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.br[0].taxRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.mx[0].taxRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.co[0].taxRate + '")" disabled="disabled"></td>\
                    <td class="p-0"><input type="text" class="form-control center" value="'+ oo.cl[0].taxRate + '")" disabled="disabled"></td>\
                    <td></td>\
                </tr>\
                <tr>\
                    <td class="right">说明：</td>\
                    <td colspan="11">以这里的"参数"为准，如果不对，那就把shopee的"参数"复制过来。（注：在shopee填的参数，不会对这里的价格产生影响。）</td>\
                </tr>\
            </table>'
        },
        b05: function (releasesNumber) {
            let str = '\
            <select class="form-select" id="releasesNumber">\
                <option value="0"' + (releasesNumber == "0" ? 'selected' : '') + '>不限制</option>\
                <option value="10"' + (releasesNumber == "10" ? 'selected' : '') + '>10条</option>\
                <option value="50"' + (releasesNumber == "50" ? 'selected' : '') + '>50条</option>\
                <option value="100"' + (releasesNumber == "100" ? 'selected' : '') + '>100条</option>\
            </select>';
            return str;
        },
        b06: function (releasesNumber, ManualReview_1688_categoryId1, site, num, A2) {
            let whereArr = [
                "@.ManualReview_1688_categoryId1=" + ManualReview_1688_categoryId1,//1688一级类目
                "@.ManualReview=9",//敦煌手动审核状态【9.图片且详情审核通过】
                "@.DHAfterReview=0",//敦煌审核后本地状态【0.正常】
                "@.BeforeReview=1",//更新前本地状态【1.更新成功】
                "@.penalty_type=0",//更新后违规类型【0.未违规】
                "@.ManualReview_1688_status=1",//手动审核前1688状态【1.使用1688属性图】
                "@.ManualReview_1688_state=0",//手动审核后1688状态【0.正常】
                //"@.ManualReview_1688_video_status=7",//人工审核1688视频状态【7.审核通过】
                "@.editStatus<3",//修改状态 < 3  （	0：未修改 1：第一次修改 2：第二次修改 3：货源不对）
            ]
            ///////////////////////////////////////////////////////
            //为什么要这个？答：主要为了（同一个站点，不同店铺）不上传同一个商品用的。
            if (site == "sg") {
                whereArr.push("@.issg=0");
            }
            else if (site == "mx") {
                whereArr.push("@.ismx=0");
            }
            else {
                whereArr.push("@.is" + Tool.siteNum(site, "" + num) + "=0")//站点更新状态【0.未更新】
            }
            //whereArr = ["@.proid='R789227'"]
            $("#where").html('<tr><td class="right">发布条件：</td><td colspan="2">' + whereArr.join(" <br/> ") + '</td></tr>');
            let data = [];
            if (releasesNumber == "0") {
                data = [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select " + Tool.fieldAs("manualreview_1688_fromid,discount,manualreview_1688_unitweight,proid") + " FROM @.table where " + whereArr.join(" and ") + " limit 10",
                }]
                if (A2 == 0) {
                    data.push({
                        action: "sqlite",
                        database: "shopee/商品/全球商品",
                        sql: "select count(1) as total FROM @.table where " + whereArr.join(" and ")
                    })
                }
            }
            else {
                data = [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select " + Tool.fieldAs("manualreview_1688_fromid,discount,manualreview_1688_unitweight,proid") + " FROM @.table where " + whereArr.join(" and ") + " limit " + releasesNumber,
                }]
            }
            return data;
        },
    },
})