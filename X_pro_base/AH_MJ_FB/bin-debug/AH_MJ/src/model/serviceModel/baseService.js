var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/22.
 * 基础通信类
 */
var AH_baseService = (function (_super) {
    __extends(AH_baseService, _super);
    function AH_baseService() {
        var _this = _super.call(this, false) || this;
        /**是否已连接了服务器*/
        _this.isConnection = false;
        _this.cSocketUrl = "";
        return _this;
    }
    /*---------------------------http*-------------------------------------*/
    AH_baseService.prototype.http = function (url, data, backFun, _isLoading) {
        if (_isLoading === void 0) { _isLoading = true; }
        MyConsole.getInstance().trace("---------发送的数据--------------" + data.function_id, 3);
        MyConsole.getInstance().trace(data);
        if (_isLoading)
            LoadLayer.getInstance().addDataLoading();
        var urlLoader = new egret.URLLoader(), urlreq, urlVari, data;
        urlreq = new egret.URLRequest();
        urlreq.url = url; //地址
        urlreq.method = egret.URLRequestMethod.POST;
        urlVari = new egret.URLVariables();
        urlVari.variables = data;
        urlreq.data = urlVari; //数据
        //成功获取数据
        function onComplete() {
            urlLoader.removeEventListener(egret.Event.COMPLETE, onComplete, this);
            urlLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onLoadError, this);
            this.disposeBaseData(urlLoader.data, backFun);
        }
        //获取数据失败
        function onLoadError(e) {
            urlLoader.removeEventListener(egret.Event.COMPLETE, onComplete, this);
            urlLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onLoadError, this);
            this.onSocketError(e);
        }
        urlLoader.addEventListener(egret.Event.COMPLETE, onComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onLoadError, this);
        urlLoader.load(urlreq);
    };
    /*-------------------------socket------------------------------------*/
    /*连接服务器*/
    AH_baseService.prototype.connection = function (socketUrl) {
        if (this.judge_isConnect()) {
            MyConsole.getInstance().trace("开始webSocket连接..." + socketUrl);
            LoadLayer.getInstance().addDataLoading();
            //new一个套接字（唯一的连接标识）
            this.webSocket = new egret.WebSocket();
            //设置数据格式为二进制，默认为字符串
            //this.webSocket.type = egret.WebSocket.TYPE_BINARY;
            //2
            //侦听 套接字 跟 服务器 的 连接事件（如果检测到 连接至服务器成功了，就 转向 成功后要执行的子程序 onSocketOpen）
            this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            //3
            //侦听 套接字 的 收到数据事件（如果检测到 服务器返回了数据，就 转向 收到数据后要执行的子程序 onReceiveMessage）
            this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            //4添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
            this.webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            //5添加异常侦听，出现异常会调用此方法
            this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
            //6用 套接字 去尝试连接至 服务器
            this.cSocketUrl = socketUrl;
            this.webSocket.connectByUrl(socketUrl);
        }
    };
    /**向 服务器 发送数据*/
    AH_baseService.prototype.sendData = function (data, _isLoading) {
        if (_isLoading === void 0) { _isLoading = false; }
        if (!this.isConnection) {
            MyConsole.getInstance().trace("尚未建立连接", 0);
        }
        else if (BaseModel.USER_repetitionLogin) {
            MyConsole.getInstance().trace("重复登录", 0);
        }
        else {
            if (data.interfaceId && data.interfaceId != Number(BaseModel.PORT_DATA_CONFIG.heartbeat.interfaceId)) {
                MyConsole.getInstance().trace("---------发送的数据--------------" + data.interfaceId, 100000);
                MyConsole.getInstance().trace(JSON.stringify(data));
            }
            if (_isLoading)
                LoadLayer.getInstance().addDataLoading();
            this.webSocket.writeUTF(JSON.stringify(data)); /*开始发送请求*/
            this.webSocket.flush();
        }
    };
    /*获取socket数据ok*/
    AH_baseService.prototype.onReceiveMessageOk = function (info, interfaceId) {
    };
    /*判断服务器是否可以连接*/
    AH_baseService.prototype.judge_isConnect = function () {
        if (this.webSocket) {
            if (this.isConnection) {
                MyConsole.getInstance().trace("已有连接，勿重复", 0);
                return false;
            }
            else {
                MyConsole.getInstance().trace("服务器正在连接中", 0);
                return false;
            }
        }
        return true;
    };
    /*连接服务器成功*/
    AH_baseService.prototype.onSocketOpen = function () {
        MyConsole.getInstance().trace("webSocket连接成功");
        LoadLayer.getInstance().removeDataLoading();
        this.isConnection = true;
        BaseModel.getInstance().eventRadio("webSocketOpen");
    };
    /*收到 服务器发来数据 后 执行的子程序*/
    AH_baseService.prototype.onReceiveMessage = function (e) {
        var msg = this.webSocket.readUTF();
        this.disposeBaseData(msg, this.onReceiveMessageOk.bind(this));
    };
    /*-----------------------------------数据处理--------------------------*/
    AH_baseService.prototype.disposeBaseData = function (data, backFun) {
        var data = JSON.parse(data);
        LoadLayer.getInstance().removeDataLoading();
        LoadLayer.getInstance().removeDataLoading(); //移除加载提示界面
        this.selectSendInfoTips(data); //提示打印
        if (data) {
            if (Number(data.state) == 1) {
                backFun(data.info, data["interfaceId"]);
            }
            else {
                PopupLayer.getInstance().addHintView(data.message, null, true, "min"); //弹出信息提示
            }
        }
        else {
            PopupLayer.getInstance().addHintView("网络异常" + data.interfaceId, null, true, "min"); //弹出异常
        }
    };
    /*接收消息查询*/
    AH_baseService.prototype.selectSendInfoTips = function (data) {
    };
    /*服务器关闭连接*/
    AH_baseService.prototype.onSocketClose = function (e) {
        if (!BaseModel.USER_repetitionLogin) {
            this.webSocket.close();
            PopupLayer.getInstance().addHintView("网络开小差了 请尝试刷新?", function () {
                window.location.reload(); /*重新加载*/
            });
        }
        LoadLayer.getInstance().removeDataLoading(); //移除加载提示界面
    };
    /*服务器连接异常*/
    AH_baseService.prototype.onSocketError = function (e) {
        //if(!BaseModel.USER_repetitionLogin)PopupLayer.getInstance().addHintView("服务器连接异常",null,true,"min");
        PopupLayer.getInstance().floatAlert("网络异常");
        LoadLayer.getInstance().removeDataLoading(); //移除加载提示界面
    };
    return AH_baseService;
}(AH_BaseModel));
AH_baseService.host = "";
__reflect(AH_baseService.prototype, "AH_baseService");
