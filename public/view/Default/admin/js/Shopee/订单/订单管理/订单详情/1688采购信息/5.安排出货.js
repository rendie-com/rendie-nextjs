Object.assign(Tool, {
    Arrange_shipment: {
        a01: function (order_id, site, num, siteNum) {
            let oo = {
                order_id: order_id,
                site: site,
                num: num,
                siteNum: siteNum
            }
            $("#seep5").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>').attr("disabled", true);
            //说明：“package_number”的值不能从本地数据库拿。因为要处理完了才会有。
            Tool.login.a01(this.a02, this, oo);
        },
        a02: function (t, oo) {
            oo.seller = t;
            let pArr = [
                "SPC_CDS=" + t.SPC_CDS,
                "SPC_CDS_VER=2",
                "order_id=" + oo.order_id,
                "cnsc_shop_id=" + t[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/order/get_package?" + pArr.join("&")
            $("#state").html("正在获取“package_number”的值。。。")
            gg.getFetch(url, "json", this.a03, this, oo)
        },
        a03: function (t, oo) {
            if (t.message == "success") {
                let o1 = t.data.order_info.package_list[0];
                if (o1.status == 1 || o1.status == 2) {
                    Tool.Modal('网页对象提示', "该订单已出货。物流单号：" + o1.consignment_no, '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>', 'modal-l');
                }
                else if (o1.status == 5) {
                    Tool.Modal('网页对象提示', "该订单已完成,不能出货。", '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>', 'modal-l');
                }
                else if (o1.status == 10 || o1.status == 4) {
                    Tool.Modal('网页对象提示', "该订单已取消,不能出货。", '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>', 'modal-l');
                }
                else if (o1.status == 9) { this.a04(t.data.order_info.package_list[0], oo); }
                else { Tool.pre(["未知状状", o1.status]); }
            }
            else {
                Tool.pre(["出错：", t]);
            }
        },
        a04: function (o1, oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/shipment/init_order?" + pArr.join("&");
            let data = {
                "order_id": oo.order_id,
                "package_number": o1.package_number,
                "shipping_mode": "dropoff"
            }
            $("#state").html("正在安排出货。。。");
            gg.postFetch(url, JSON.stringify(data), this.a05, this, oo)
        },
        a05: function (t, oo) {
            if (t.message == "success") {
                this.d01(oo)
            }
            else {
                Tool.pre(["出错01：", t]);
            }
        },
        ///////////////////////////////
        d01: function (oo) {
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "order_id=" + oo.order_id,
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/order/get_package?" + pArr.join("&")
            $("#state").html("正在获取“package_number”和“consignment_no”的值（与第一次请求URL相同）。。。");
            gg.getFetch(url, "json", this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (t.message == "success") {
                let tracking_number = t.data.order_info.package_list[0].consignment_no
                if (tracking_number) {
                    this.d03(tracking_number, t.data.order_info.package_list[0].package_number, oo);
                }
                else {
                    Tool.Time("name", 500, this.d01, this, oo);
                }
            }
            else {
                Tool.pre(["出错02：", t]);
            }
        },
        d03: function (tracking_number, package_number, oo) {
            //@.logistics_status=1    表示“待出货“等待快递员确认发货。
            let data = [{
                action: "sqlite",
                database: "shopee/订单/订单管理/" + oo.siteNum,
                sql: "update @.table set @.package_number='" + package_number + "',@.tracking_number='" + tracking_number + "',@.logistics_status=1 where @.order_id='" + oo.order_id + "'",
            }];
            Tool.ajax.a01(data, this.d04, this, oo);
        },
        d04: function () {
            location.reload();
        },
    },
});