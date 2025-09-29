'use strict';
let hid = {
    obj: {
        device: null,
        reportId: 0,
        left: 0, top: 0,//鼠标X轴和Y轴的位置。
    },
    init: {
        a01: function (next, This, t) {
            // 检查浏览器是否支持 WebHID
            if ("hid" in navigator) {
                //你的浏览器支持 WebHID 🎉
                this.a02(next, This, t);
            } else { Tool.Modal("提示", "<p>换个 Chrome 再来试试吧！😭<p>", '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">知道了</button>', ''); }
        },
        a02: function (next, This, t) {
            //全局HID设备插入事件
            navigator.hid.onconnect = async (event) => {
                // device 的 collections 可以看到设备报告描述符相关信息
                $("#RenDie-HID").html(`已插入设备：${event.device.productName}！`);
            };
            //全局HID设备拔出事件
            navigator.hid.ondisconnect = async (event) => {
                $("#RenDie-HID").html(`已拔出设备：${event.device.productName}！`);
                hid.device = null;
            };
            this.a03(next, This, t);
        },
        a03: async function (next, This, t) {
            let devices = await navigator.hid.getDevices({
                filters: [{
                    vendorId: 1155,  // 根据VID进行过滤
                    productId: 22352, // 根据PID进行过滤
                }]
            });//getDevices方法可以返回已连接的授权过的设备列表
            if (devices.length == 0) {
                //注：必须点击才能复制。（我也不知道什么原因。）
                let html = '请使用【RenDie-HID】硬件。<hr/><button class="btn btn-outline-secondary" onclick="hid.c01()">列出所有HID设备</button>'
                Tool.Modal("提示", html, '', '')
            }
            else {
                if (!devices[0].opened) {// 检查设备是否打开            
                    await devices[0].open(); // 打开设备
                }
                $("#RenDie-HID").html(`已打开设备！`);
                hid.obj.device = devices[0];
                hid.obj.reportId = parseInt(devices[0].collections[0].outputReports[0].reportId, 16);//将16进制转换为十进制                
                Tool.apply(t, next, This)
            }
        },
    },
    move: {
        a01: function (left, top, distance, next, This, t) {
            let oo = {
                left: left - hid.obj.left,
                top: top - hid.obj.top,
                distance: distance,//每次移动距离。 （ 注：最多移动【127】像素且还要关闭【增强指针精度】）
                next: next,
                This: This,
                t: t,
                /////////////////////////////
                numX: 0,
                numY: 0,
            }
            this.a02(oo);
        },
        a02: async function (oo) {
            let countX = Math.ceil(oo.left / oo.distance)//次数
            let countY = Math.ceil(oo.top / oo.distance)//次数
            oo.numX++; oo.numY++;
            if (oo.numX <= countX || oo.numY <= countY) {
                let x = 0, y = 0;
                if (oo.numX < countX) { x = oo.distance; } else if (oo.numX == countX) { x = oo.left % oo.distance; };
                if (oo.numY < countY) { y = oo.distance; } else if (oo.numX == countX) { y = oo.top % oo.distance; };
                ///////////////////////////////////////////
                //console.log(oo.left, oo.top, x, y)
                const outputData = new Uint8Array([4, 0, x, y, 0]);//要发送的数据包
                await hid.obj.device.sendReport(hid.obj.reportId, outputData);
                Tool.Time("move", 0, this.a02, this, oo);
            }
            else {
                hid.obj.left = oo.left < 0 ? 0 : oo.left;
                hid.obj.top = oo.top < 0 ? 0 : oo.top;
                Tool.apply(oo.t, oo.next, oo.This)
            }
        }
    },
    //鼠标点击
    mouseClick: {
        //num   表示点击次数
        //code  1:表示鼠标【左】点击    
        //      2:表示鼠标【右】点击
        //      4:表示鼠标【中】点击
        a01: function (left, top, code, num, next, This, t) {
            let oo = { code: code, num: num, next: next, This: This, t: t }
            hid.move.a01(left, top, 127, this.a02, this, oo);
        },
        a02: async function (oo) {
            hid.click.a01([4, oo.code, 0, 0, 0], oo.num, this.a03, this, oo);
        },
        a03: async function (oo) {
            if (oo.next) { Tool.apply(oo.t, oo.next, oo.This); }
        }
    },
    click: {
        a01: async function (arr, num, next, This, t) {
            let oo = {
                arr: arr,
                num: num,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo);
        },
        a02: async function (oo) {
            if (oo.num == 0) {
                if (oo.next) Tool.apply(oo.t, oo.next, oo.This);
            }
            else {
                await hid.obj.device.sendReport(hid.obj.reportId, new Uint8Array(oo.arr));
                if (oo.arr[0] == 3 && oo.arr[1] != 0) {
                    //组合按键如果不快点松开就会一直起做用。
                    //例如：粘贴【ctrl+v】就会粘贴很多次。
                    this.a03(oo);
                }
                else {
                    Tool.Time("click", 50, this.a03, this, oo);
                }

            }
        },
        a03: async function (o1) {
            let o2 = new Uint8Array(o1.arr.length); o2["0"] = o1.arr[0];
            await hid.obj.device.sendReport(hid.obj.reportId, o2);
            o1.num--;
            Tool.Time("click", 50, this.a02, this, o1);
        }
    },
    ////////////////////////////////////////////////////
    c01: async function () {
        const devices = await navigator.hid.requestDevice({ filters: [] });
        if (devices.length > 0) {
            location.reload();
        } else {
            $("#RenDie-HID").html("没有选中任何设备。");
        }
    },
}