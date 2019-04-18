/**
 * Created by 伟大的周鹏斌大王 on 2017/7/19.
 */
class AH_Game_RoomInfoModel extends AH_BaseModel{

    public roomSn:string; /*房间号*/
    public roomType:number;/*房间类型*/
    public userId:number;/*房主id*/
    public _openName:string="";/*房主昵稱*/
    public maxScore:number;/*封顶分数*/
    protected _circleWind:number=1;/*圈风 1东风圈 2西风圈 3北风圈 4南风圈*/
    protected _totalNum:number=0;/*房间总圈数*/
    protected _lastNum:number=0;/*房间剩余圈数*/
    protected _cnrrMJNum:number=0;/*麻将剩余数量*/
    public lastUserId:number;/*最新出牌玩家 id*/
    public lastPaiModel:CardModel;/*最新出牌玩家 牌信息*/
    public killRoomModel:Game_killRoomModel;/*解散房间信息*/
    public _status:number;
    public _ct:number;/*房间创建时间*/
    public _xjst:number;/*某一小局开始时间*/
    public constructor(){
        super();
    }
    /*开局初始化*/
    public initData(){
        this.killRoomModel=new Game_killRoomModel();
        this.initLastCardModel();
    }

    /*初始化最新出牌玩家信息*/
    public initLastCardModel(){
        this.lastPaiModel=new CardModel();
        this.lastUserId=null;
    }
    /*更新最新出牌玩家信息*/
    public setNewPlayHandUserInfo(lastPai,userId=null){
        if(userId&&lastPai){
            this.lastUserId=Number(userId);
            this.lastPaiModel.type=lastPai[0][0];
            this.lastPaiModel.num=lastPai[0][1];
            //this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_stopNewCard)); 1.9.0舍弃 因为发现没用到
        }else{
            this.lastUserId=null;
        }
    }

    get ct():number{
        return this._ct;
    }
    set ct(value:number){
        this._ct = value;
    }

    get xjst():number{
        return this._xjst;
    }
    set xjst(value:number){
        this._xjst = value;
    }
    get status():number{
        return this._status;
    }
    set status(value){
        this._status = Number(value);
    }

    get circleWind(): number {
        return this._circleWind;
    }
    set circleWind(value: number) {
        /*刷新*/
        if(this.circleWind!=value){
            this._circleWind = value;
            this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_circleWind));
        }
    }
    get totalNum():number{
        return this._totalNum;
    }
    set totalNum(value:number){
        this._totalNum = value;
    }
    get openName():string{
        return this._openName;
    }
    set openName(value:string){
        this._openName = decodeURIComponent(value);
    }



    get lastNum(): number {
        return this._lastNum;
    }
    set lastNum(value: number) {
        /*刷新*/
        if(this._lastNum!=value){//1.9.5
            this._lastNum = value;
            this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_lastNum));
        }
    }
    get cnrrMJNum(): number {
        return this._cnrrMJNum;
    }
    set cnrrMJNum(value: number) {
        /*刷新*/
        if(this._cnrrMJNum!=value&&this._cnrrMJNum>=0){
            this._cnrrMJNum = value;
            this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_cnrrMJNum));
        }
    }
    /*更新解散房间信息*/
    public updateKillRoomInfo(data,userId){
        if(data){
            this.killRoomModel.dissolveTime=data.dissolveTime;
            this.killRoomModel.userId=data.userId;
            this.killRoomModel.userName=data.userName;
            this.killRoomModel.userImg=data.userImg;
            //其他人操作信息
            this.killRoomModel.othersAgree=data.othersAgree;
            //是否是发起人
            this.killRoomModel._isInitiator=false;
            if(userId==this.killRoomModel.userId){
                this.killRoomModel._isInitiator=true;
            }
            //是否有过操作
            this.killRoomModel._isHandle=false;
            for(var i in this.killRoomModel.othersAgree){
                if(this.killRoomModel.othersAgree[i].userId==userId&&this.killRoomModel.othersAgree[i]["agree"]!=0){
                    this.killRoomModel._isHandle=true;
                    break;
                }
            }
            //弹出解散房间框框
            PopupLayer.getInstance().addKillRoomView(this.killRoomModel,userId);
        }
    }

}