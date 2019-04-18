/**
 * Created by 伟大的周鹏斌大王 on 2017/7/13.
 * 用户基础信息
 */
class AH_UserBaseModel extends AH_BaseModel{

    public num_id:number=1;/*房间位置id 1玩家自己 2玩家下家 3对家 4上家*/
    public houseOwner:boolean=false;//是否是房主
    public joinIndex:number=0;//加入顺序1.6.8新增
    protected _openName:string;/*昵称*/
    protected _openImg:string;/*头像*/
    public gender:number=1;/*性别 1男 2女*/
    protected _userAgree:boolean=true;/*用户协议是否通过*/
    protected _money:number;/*余额*/
    protected _score:number;/*分数*/
    protected _notice:string;/*跑马灯*/
    protected _userId:number;/*用户id*/
    protected _status:string;/*在线状态 out离开状态（断线） inline正常在线*/
    protected _position:number;/*玩家坐标 1,2,3,4 东南西北*/
    protected _chatVoiceStatus:boolean=false;/*玩家是否在播放语音状态*/
    public leave =false;
    /*
    * playStatus的值有
     dating         用户在大厅中
     in                  刚进入房间，等待状态
     prepared    准备状态
     chu               出牌状态（该出牌了）
     wait              等待状态（非出牌状态）
     xjs                 小结算
     none            这个位置没人（等待阶段 掉线或者退出房间）
    * **/
    protected _playStatus:string="";
    protected _ip:number;/*ip地址*/
    protected _zhuang:boolean;/*是否是庄家*/

    get position(): number {
        return this._position;
    }

    set position(value: number) {
        this._position = value;
    }
    get openName(): string {
        return this._openName;
    }

    set openName(value: string) {
        if(this._openName!=value){
            this._openName =value;
            this._openName=String(decodeURIComponent(this._openName));
        }
    }

    get openImg(): string {
        return this._openImg;
    }

    set openImg(value: string) {
        this._openImg = value;
    }

    get userAgree(): boolean {
        return this._userAgree;
    }

    set userAgree(value: boolean) {
        this._userAgree = value;
    }

    get money(): number {
        return this._money;
    }

    set money(value: number) {
        if(this._money!= value){
            this._money = value;
            this.dispatchEvent(new egret.Event("updateMoney"));
        }
    }
    get score(): number {
        return this._score;
    }

    set score(value: number) {
        if(!this._score||this._score!= value){
            this._score = value;
            this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo));
        }
    }
    get notice(): string {
        return this._notice;
    }

    set notice(value: string) {
        this._notice = value;
    }
    get userId(): number {
        return this._userId;
    }
    set userId(value: number) {
        if(this._userId!=Number(value)){
            this._userId = Number(value);
            this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo));
        }
    }
    get playStatus(): string {
        return this._playStatus;
    }

    set playStatus(value: string) {
        if(this._playStatus!=value){
            this._playStatus = value;
            setTimeout(function () {
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerState));
            }.bind(this),300);
        }
    }
    get status(): string {
        return this._status;
    }
    set status(value: string) {
        if(this._status!=value){
            this._status = value;
            this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerLineState));
        }
    }
    get ip(): number {
        return this._ip;
    }

    set ip(value: number) {
        this._ip = value;
    }

    get zhuang(): boolean {
        return this._zhuang;
    }

    set zhuang(value: boolean) {
        this._zhuang = value;
    }

    get chatVoiceStatus():boolean{
        return this._chatVoiceStatus;
    }
    set chatVoiceStatus(value:boolean){
        if(this._chatVoiceStatus != value){
            this._chatVoiceStatus = value;
            this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_chatVoiceStatus));
        }
    }
}