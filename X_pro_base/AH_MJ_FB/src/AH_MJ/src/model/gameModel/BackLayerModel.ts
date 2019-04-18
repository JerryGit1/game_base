/**
 * Created by 伟大的周鹏斌大王 on 2017/7/14.
 */
class AH_Game_backLayerModel extends AH_BaseModel{

    /*玩家头像坐标*/
    public headPos = [
        {"x":45,"y":Main.stageHeight-BaseModel.USER_CARD_WIDTH*2.5},//*2
        {"x":Main.stageWidth-45,"y":Main.stageHeight/2-BaseModel.USER_CARD_WIDTH},
        {"x":Main.stageWidth-210,"y":55},
        {"x":45,"y":Main.stageHeight/2-BaseModel.USER_CARD_WIDTH*1.5}
    ];
    public headPos1 = [
        {"x":45,"y":Main.stageHeight-BaseModel.USER_CARD_WIDTH*2.5},//*2
        {"x":Main.stageWidth-45,"y":Main.stageHeight-BaseModel.USER_CARD_WIDTH*3},
        {"x":Main.stageWidth-210,"y":55},
        {"x":45,"y":Main.stageHeight/2-BaseModel.USER_CARD_WIDTH*1.5}
    ];
    /*出牌风向位置*/
    public windDirection:Number;/*1东朝下 2南朝下 3西朝下 4北朝下*/
    protected playCountdownTime;//倒计时
    protected playCountdownMaxNum=10;
    public playCountdown=0;//出牌倒计时
    public lastChatTime:number = 0;//上次发表情的时间
    //数据model
    public userGroupModel:UserGroupModel;//用户中心
    public roomInfoModel:Game_RoomInfoModel;//房间信息
    public constructor(roomInfoModel,userGroupModel){
        super();
        this.roomInfoModel=roomInfoModel;
        this.userGroupModel=userGroupModel;
        //更新风向
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_updateClock,this.updateClock,this);
    }
    /*更新玩家信息*/
    public updatePlayerInfo(oPlayerInfo){
        this.userGroupModel.setBaseInfo(oPlayerInfo);
        //更新风向
        this.updateClock();
        //更新冲突
        this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_ipSame,false,{"data":oPlayerInfo});
    }
    //更新风向
    public updateClock(){
        var userModel:UserModel,i;
        for(i=1;i<=4;i++){
            userModel=this.userGroupModel.numIdGetUserModel(i);
            if(userModel.playStatus==BaseModel.PLAYER_CHU){
                /*更新出牌风向位置*/
                if(this.windDirection!=userModel.position){
                    this.windDirection=userModel.position;
                    MyConsole.getInstance().trace("更新风向"+this.windDirection);
                    this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_clock));
                    this.setPlayCountdown();//设置出牌倒计时
                }
            }
            //房主
            userModel.houseOwner=false;
            if(userModel.userId==Number(this.roomInfoModel.userId)){
                userModel.houseOwner=true;
            }
        }
    }
    //出牌倒计时
    protected setPlayCountdown(){
        if(this.playCountdownTime){
            clearInterval(this.playCountdownTime);
        }
        this.playCountdown=this.playCountdownMaxNum;
        this.playCountdownTime=setInterval(function () {
            if(this.playCountdown>=1){
                this.playCountdown--;
                if(this.playCountdown<=3){
                    this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_twinkleAni));
                }
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_countdown));
            }else{
                clearInterval(this.playCountdownTime);
            }
        }.bind(this),1000);
    }
}