/**
 * Created by 伟大的周鹏斌大王 on 2017/7/14.
 * url post参数信息
 */
class AH_UrlDataModel extends AH_BaseModel{

    protected _cId:Number=1;/*商品ID*/
    protected _gId:Number;/*游戏ID*/
    protected _mId:Number;/*商家ID*/
    protected _openId:String;/*用户openId*/
    protected _vId:Number;/*版本id*/
    protected testVId:Number=3;/*那个版本一下可以接入测试信息*/
    protected _state:number;/*附加参数*/
    protected _roomIp:string;
    public shareJoining:number=0;/*分享房间号 加入房间中  1还没加入 2加入中 3加入过了 4回放模式下*/
    public playbackInfo;
    //url get数据 demo用
    protected urlParam;
    public constructor(){
        super();
        this.setUrlParam();
    }
    get cId(): Number {
        return this._cId;
    }

    set cId(value: Number) {
        this._cId = value;
    }

    get gId(): Number {
        return this._gId;
    }

    set gId(value: Number) {
        this._gId = value;
    }

    get mId(): Number {
        return this._mId;
    }

    set mId(value: Number) {
        this._mId = value;
    }

    get openId(): String {
        if(this._vId<=this.testVId&&this.urlParam["openId"]){
            return this.urlParam["openId"];
        }
        return this._openId;

    }
    set openId(value: String) {
        this._openId = value;
    }

    get vId(): Number {
        return this._vId;
    }

    set vId(value: Number) {
        if(value<=this.testVId&&this.urlParam["vId"]){
            this._vId = Number(this.urlParam["vId"]);
        }else{
            this._vId = Number(value);
        }
        this.webSocketModel.setGameUrl(this.vId,this.urlParam["service_id"]);
        WeiXinJSSDK.getInstance().model=this;
    }
    get state(): number {
        if(this._vId<=this.testVId&&this.urlParam["state"]){
            this.state=this.urlParam["state"];
            return Number(this._state);
        }
        return Number(this._state);
    }

    set state(value) {
        this.shareJoining=0;
        if(value){
            var arr=String(value).split("_");
            if(Number(arr[0])==1){
                //分享
                this.shareJoining=1;
                this._state = Number(arr[1]);
            }else if(Number(arr[0])==2&&arr.length>=3){
                //分享回放
                this.shareJoining=4;
                this.playbackInfo={
                    roomSn:Number(arr[1]),/*房间号码*/
                    index:arr[2],
                    createTime:"",
                    url:arr[3],
                    tips:"share"
                }
                if(arr[4]){
                    BaseModel.PLAYBACK_SHARE_USERID=arr[4];
                }
            }else if(Number(arr[0])==3){
                //加入俱乐部
                this.shareJoining = 5;
                BaseModel.CLUB_SHARE_ID=Number(arr[1]);
            }
        }
    }
    get roomIp():string{
        return this._roomIp;
    }
    set roomIp(value:string){
        if(this._roomIp != value) this._roomIp = value;
        this.webSocketModel.setGameUrl(this.vId,this.urlParam["service_id"],this._roomIp);
        egret.localStorage.setItem("roomIpStr",this._roomIp);
        MyConsole.getInstance().trace("==================="+"缓存"+egret.localStorage.getItem("roomIpStr"));
    }
    /*获取url参数配置*/
    protected setUrlParam(){
        var aQuery = window.location.href.split("?");//取得Get参数
        var urlDataInfo = new Array();
        if(aQuery.length > 1)
        {
            var aBuf = aQuery[1].split("&");
            for(var i=0, iLoop = aBuf.length; i<iLoop; i++){
                var aTmp = aBuf[i].split("=");
                urlDataInfo[aTmp[0]] = aTmp[1];
            }
        }
        this.urlParam=urlDataInfo;
    }
}
