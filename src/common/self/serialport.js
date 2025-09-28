//https://blog.csdn.net/Naisu_kun/article/details/125146766
import { SerialPort } from 'serialport';

export const self_serialport = {
    port: null,
    obj: {
        path: "",//端口
        baudRate: 0,//波特率
        data: []//收到的数据
    },
    a01: async function (obj) {
        let nObj = {}
        switch (obj.fun) {
            case "list": nObj = await SerialPort.list(); break;   // 打印串口列表         
            case "open": nObj = await this.open(obj.path, obj.baudRate); break;//打开串口
            case "write": nObj = await this.write(obj.string); break;//向串口发送数据
            case "close": nObj = await this.close(); break;//关闭串口
            case "obj": nObj = this.obj; break;//已打开的参数
            case "getdata": nObj = this.obj.data; this.obj.data = []; break;
        }
        return nObj;
    },
    open: async function (path, baudRate) {
        return new Promise((resolve, reject) => {
            let port = new SerialPort({ path: path, baudRate: baudRate }, (err) => {
                if (err) {
                    resolve("端口打开失败！")
                    return;
                }
                //监听收到的数据
                port.on('readable', () => {
                    self_serialport.obj.data.push(port.read().toString())// 使用read方法读取数据                    
                });
                //监听close事件（手动拔掉数据线时执行）
                port.on('close', function () {
                    //在这里执行关闭后的操作
                    self_serialport.port = null;
                    self_serialport.obj = {
                        path: "",
                        baudRate: 0,
                        data: []
                    };
                });
                ///////////////////////////////////////////////////
                self_serialport.port = port;//关闭时还要用
                self_serialport.obj = {
                    path: path,
                    baudRate: baudRate,
                    data: []
                };
                resolve("端口打开成功！")
            });
        });
    },
    //向串口发送数据
    write: async function (string) {
        let port = this.port
        if (port) {
            return new Promise((resolve, reject) => {
                port.write(string, (err) => {
                    if (err) {
                        resolve('发送失败！');
                        return;
                    }
                    resolve('发送成功！');
                });
            });
        }
        else {
            return "必须先打开串口！"
        }
    },
    //关闭串口
    close: async function () {
        let port = this.port;
        return new Promise((resolve, reject) => {
            port.close((err) => {
                if (err) {
                    resolve('关闭失败！');
                    return;
                }
                resolve('关闭成功！');
            });
        });
    },
};
