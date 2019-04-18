/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 * 游戏准备 等待玩家凑齐场景类
 */
class AH_PrepareScene extends AH_GameBaseScene{
    /*数据类*/
    protected model:Game_backLayerModel;
    /*邀请好友*/
    protected shareBtn:MyButton;
    /*解散房间*/
    protected killRoomBtn:MyButton;
    /*凑齐4人后 房主显示开局按钮*/
    protected openingBtn:MyButton;
    public constructor(model){
        super(model);
        //有人加入房间提示
        this.model.userGroupModel.addEventListener("newJoinRoom",this.newJoinRoomTips,this);
        //有人离开提示
        this.model.userGroupModel.addEventListener("leaveRoom",this.leaveRoom,this);
        //4个人凑齐显示 确认开局按钮
        this.model.userGroupModel.addEventListener("playerTogetherOk",this.addOpeningBtn,this);
        //4个人没凑齐
        this.model.userGroupModel.addEventListener("playerTogetherNo",this.removeOpeningBtn,this)
    }
    /*---------视图------------*/
    public addBtns(){
        //分享按钮
        this.shareBtn = new MyButton("g_shareBtn",1);
        this.shareBtn.x = Main.stageWidth*0.37;
        this.shareBtn.y = Main.stageHeight-this.shareBtn.height*.9;
        this.addChild(this.shareBtn);
        //解除房间or退出房间按钮
        this.killRoomBtn = new MyButton((this.model.userGroupModel.user1Model.houseOwner && this.model.roomInfoModel.roomType==1)?"g_killRoomBtn":"g_killRoomBtn1");
        this.killRoomBtn.x = Main.stageWidth*0.63;
        this.killRoomBtn.y = Main.stageHeight-this.killRoomBtn.height*.9;
        this.addChild(this.killRoomBtn);

        this.shareBtn.addTouchEvent();
        this.shareBtn.addEventListener("click",this.shareClick,this);

        this.killRoomBtn.addTouchEvent();
        this.killRoomBtn.addEventListener("click",this.killRoomClick,this);


        if(this.openingBtn){
            this.killRoomBtn.visible=this.shareBtn.visible=false;
        }
    }
    /*显示确认开局按钮*/
    protected addOpeningBtn(){
        if(this.killRoomBtn)this.killRoomBtn.visible=this.shareBtn.visible=false;
        if(!this.openingBtn){
            this.openingBtn = new MyButton("openingBtn",2);
            this.openingBtn.x = Main.stageWidth/2;
            this.openingBtn.y = Main.stageHeight+this.openingBtn.height*.7;
            this.addChild(this.openingBtn);

            this.openingBtn.addTouchEvent();
            this.openingBtn.addEventListener("click",this.opening,this);

            egret.Tween.get(this.openingBtn).to({y:Main.stageHeight-this.openingBtn.height*.9},500,egret.Ease.backOut);
        }
    }
    protected removeOpeningBtn(){
        if(this.openingBtn){
            this.openingBtn.removeEventListener("click",this.opening,this);
            this.openingBtn.clear();
            this.removeChild(this.openingBtn);
            this.openingBtn=null;
        }
        if(this.killRoomBtn)this.killRoomBtn.visible=this.shareBtn.visible=true;
    }
    /*---------事件-------------*/
    /*分享*/
    protected shareClick(e){
        PopupLayer.getInstance().addShareView();
    }
    /*解散or退出房间*/
    protected killRoomClick(e){
        BaseModel.getInstance().eventRadio("sponsorGameKillRoom");
    }
    /*确认开局*/
    protected opening(e){
        // /*消费房卡统计*/  2.1.0 舍弃
        // var userId = this.model.userGroupModel.user1Model.userId;
        // var num = 0;
        // switch (Number(this.model.roomInfoModel.totalNum)){
        //     case 8: num=4;
        //     case 16: num=6;
        //     case 24: num=12;
        // }
        // AH_statisticService.getInstance().consume(userId,num);

        BaseModel.getInstance().eventRadio("settlementWaitOk");
    }
    /*加入房间提示*/
    protected newJoinRoomTips(e){
        var data=e.data;
        PopupLayer.getInstance().floatAlert("玩家 <font color='#ffff00'>"+data.name+"</font> 加入房间",1000);
    }
    /*有人离开房间提示*/
    protected leaveRoom(e){
        var data=e.data;
        PopupLayer.getInstance().floatAlert("玩家 <font color='#ff0000'>"+data.name+"</font> 离开房间",1000);
    }

    public clear(){
        super.clear();
        this.shareBtn.removeEventListener("click",this.shareClick,this);
        this.shareBtn.clear();

        this.killRoomBtn.removeEventListener("click",this.shareClick,this);
        this.killRoomBtn.clear();

        this.model.userGroupModel.removeEventListener("newJoinRoom",this.newJoinRoomTips,this);

        this.model.userGroupModel.removeEventListener("playerTogether",this.newJoinRoomTips,this);
        //4个人没凑齐
        this.model.userGroupModel.removeEventListener("playerTogetherNo",this.removeOpeningBtn,this)
        this.removeOpeningBtn();
    }
}