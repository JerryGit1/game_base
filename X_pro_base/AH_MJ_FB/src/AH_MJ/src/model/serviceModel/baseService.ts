/**
 * Created by 伟大的周鹏斌大王 on 2017/7/22.
 * 基础通信类
 */
class AH_baseService extends AH_BaseModel{

    public static  host="";
    /**网络套接字对象*/
    private webSocket;
    /**是否已连接了服务器*/
    private isConnection: boolean = false;
    protected cSocketUrl="";
    public constructor(){
        super(false);
    }
    /*---------------------------http*-------------------------------------*/
    protected http(url,data,backFun,_isLoading=true){
        MyConsole.getInstance().trace("---------发送的数据--------------",3);
        if(data)MyConsole.getInstance().trace(data);
        if(_isLoading)LoadLayer.getInstance().addDataLoading();
        var urlLoader = new egret.URLLoader(),urlreq,urlVari,data;
        urlreq=new egret.URLRequest();
        urlreq.url = url;//地址
        urlreq.method=egret.URLRequestMethod.POST;
        urlVari=new egret.URLVariables();
        urlVari.variables=data;
        urlreq.data=urlVari;//数据
        //成功获取数据
        function onComplete(){
            urlLoader.removeEventListener(egret.Event.COMPLETE,onComplete, this);
            urlLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR,onLoadError, this);
            this.disposeBaseData(urlLoader.data,backFun);
        }
        //获取数据失败
        function onLoadError(e){
            urlLoader.removeEventListener(egret.Event.COMPLETE,onComplete, this);
            urlLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR,onLoadError, this);
            this.onSocketError(e);
        }
        urlLoader.addEventListener(egret.Event.COMPLETE,onComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR,onLoadError, this);
        urlLoader.load(urlreq);
    }
    /*-------------------------socket------------------------------------*/
    /*连接服务器*/
    protected connection(socketUrl): void {
        if(this.judge_isConnect()){
            MyConsole.getInstance().trace("开始webSocket连接..."+socketUrl);
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
            this.cSocketUrl=socketUrl;
            this.webSocket.connectByUrl(socketUrl);
        }
    }
    /**向 服务器 发送数据*/
    protected sendData(data,_isLoading=false):void{
        if(!this.isConnection){
            MyConsole.getInstance().trace("尚未建立连接",0);
        }else if(BaseModel.USER_repetitionLogin){
            MyConsole.getInstance().trace("重复登录",0);
        }
        else{
            if(data.interfaceId&&data.interfaceId!=Number(BaseModel.PORT_DATA_CONFIG.heartbeat.interfaceId)){
                MyConsole.getInstance().trace(JSON.stringify(data, null, 2),888888);
            }
            if(_isLoading)LoadLayer.getInstance().addDataLoading();
            this.webSocket.writeUTF(JSON.stringify(data));/*开始发送请求*/
            this.webSocket.flush();
        }
    }
    /*获取socket数据ok*/
    protected onReceiveMessageOk(info,interfaceId){

    }
    /*判断服务器是否可以连接*/
    private judge_isConnect(){
        if(this.webSocket){
            if(this.isConnection){
                MyConsole.getInstance().trace("已有连接，勿重复",0);
                return false;
            }else{
                MyConsole.getInstance().trace("服务器正在连接中",0);
                return false;
            }
        }
        return true;
    }
    /*连接服务器成功*/
    protected onSocketOpen(){
        MyConsole.getInstance().trace("webSocket连接成功");
        LoadLayer.getInstance().removeDataLoading();
        this.isConnection=true;
        BaseModel.getInstance().eventRadio("webSocketOpen");
    }
    /*收到 服务器发来数据 后 执行的子程序*/
    private onReceiveMessage(e) {
        var msg = this.webSocket.readUTF();
        this.disposeBaseData(msg,this.onReceiveMessageOk.bind(this));
    }
    /*主动关闭链接*/
    public closeSocket(){
        if(this.webSocket){
            this.webSocket.close();
            if(BaseModel.USER_turnLogin) this.webSocket = null;
        }
    }
    /*-----------------------------------数据处理--------------------------*/
    private disposeBaseData(data,backFun){
        var data=JSON.parse(data);
        LoadLayer.getInstance().removeDataLoading();
        LoadLayer.getInstance().removeDataLoading();//移除加载提示界面
        this.selectSendInfoTips(data);//提示打印
        if(data){
            if(Number(data.state)==1){
                if(data.info && Number(data.info.reqState)==-1){
                    PopupLayer.getInstance().addHintView("该功能即将上线，敬请期待！",null,true,"min");
                }
                backFun(data.info,data["interfaceId"]);
            }else{
                PopupLayer.getInstance().addHintView(data.message,null,true,"min");//弹出信息提示
            }
        }else{
            PopupLayer.getInstance().addHintView("网络异常" + data.interfaceId,null,true,"min");//弹出异常
        }
    }
    /*接收消息查询*/
    protected selectSendInfoTips(data){

    }
    /*服务器关闭连接*/
    private onSocketClose(e){
        if(!BaseModel.USER_repetitionLogin && !BaseModel.USER_turnLogin){
            this.webSocket.close();
            // //统计掉线次数  唐山2.0.8 舍弃
            // AH_statisticService.getInstance().offLine();
            SoundModel.stopBackSound();/*暫停音樂*/
            PopupLayer.getInstance().addHintView("网络开小差了 请尝试刷新?",function () {
                window.location.reload();/*重新加载*/
            },false);
        }
        if(BaseModel.USER_turnLogin){
            // BaseModel.USER_turnLogin = false;
            this.isConnection = false;
        }
        LoadLayer.getInstance().removeDataLoading();//移除加载提示界面
    }
    /*服务器连接异常*/
    private onSocketError(e){
        //if(!BaseModel.USER_repetitionLogin)PopupLayer.getInstance().addHintView("服务器连接异常",null,true,"min");
        PopupLayer.getInstance().floatAlert("网络异常");
        LoadLayer.getInstance().removeDataLoading();//移除加载提示界面
    }
}
