/**
 * Created by TYQ on 2017/7/8.
 */
class AH_SmallSettlementView extends PopupBaseView{
    protected continueBtn:MyButton;
    protected roomModel:Game_RoomInfoModel;
    protected playbackModel:PlaybackModel;
    protected currentId;
    protected title;
    protected roomId;
    public constructor(data=null,isHuang,currentUserWin,currentId,roomModel,playBackModel){
        super(false);
        var maskShape = new egret.Shape();
        maskShape.graphics.beginFill(0x211f1f,2);
        maskShape.graphics.drawRect(0,0,Main.stageWidth,Main.stageHeight);
        maskShape.graphics.endFill();
        this.addChildAt(maskShape,1);

        this.currentId = currentId;
        this.roomModel = roomModel;
        this.playbackModel = playBackModel;
        this.roomId = this.roomModel.roomSn;
        this.title=this.addTitle(currentUserWin?"g_settle_winTitleBg":"g_settle_failTitleBg",582,-12);
        var bg=this.addSettleBg(1136,530);
        bg.y=8;
        var height = 442;//this.title.height;
        this.initContentInfo(data,currentUserWin,isHuang,this.title.y+height/4-6);
        this.updateTitleText(isHuang,currentUserWin);
        this.addOtherInfo();
        if(!BaseModel.PLAYBACK_MODEL)this.addContinueBtn();
        else this.addPlaybackBtn();
        egret.Tween.get(this.title,{loop:true}).to({rotation:360},7000);
    }
    /*正常模式下 继续按钮*/
    protected addContinueBtn(){
        this.continueBtn = new MyButton("g_settle_continueBtn",2);
        this.centerSp.addChild(this.continueBtn);
        this.continueBtn.addTouchEvent();
        this.continueBtn.addEventListener("click",this.continueBtnClick,this);
        this.continueBtn.anchorOffsetX = this.continueBtn.width/2;
        this.continueBtn.anchorOffsetY = this.continueBtn.height/2;
        this.continueBtn.x=this.centerSp.width/2;
        this.continueBtn.y=this.centerSp.y+236;
        // this.continueBtn.y=Main.stageHeight-this.continueBtn.height/2;
    }
    protected continueBtnClick(){
        this.dispatchEvent(new egret.Event("close"));
        PopupLayer.getInstance().removePopupViewAll();
        //切换到等待界面
        BaseModel.getInstance().eventRadio("settlement_waitOk","small");
    }
    /*回放模式下 离开按钮*/
    protected addPlaybackBtn(){
        this.continueBtn = new MyButton("g_settle_leaveBtn",1);
        this.centerSp.addChild(this.continueBtn);
        this.continueBtn.addTouchEvent();
        this.continueBtn.addEventListener("click",this.playbackBtnClick,this);
        this.continueBtn.anchorOffsetX = this.continueBtn.width/2;
        this.continueBtn.anchorOffsetY = this.continueBtn.height/2;
        this.continueBtn.x=this.centerSp.width/2;
        this.continueBtn.y=this.centerSp.y+236;
        // this.continueBtn.y=Main.stageHeight-this.continueBtn.height/2;
    }
    protected playbackBtnClick(){
        this.dispatchEvent(new egret.Event("close"));
        PopupLayer.getInstance().removePopupViewAll();
        //切换到等待界面
        BaseModel.getInstance().eventRadio("playbackOver");
    }
    protected initContentInfo(userInfos,currentUserWin,isHuang,initY){
        var H=(Main.stageHeight-initY-120)/4;
        for(var i:number=0;i<4;i++){
            var settleView:SmallSettleInfoView = new SmallSettleInfoView(userInfos[i],this.currentId,currentUserWin,isHuang);
            settleView.x = 50;
            settleView.y = initY+H*i;
            this.centerSp.addChild(settleView);
            //分割线
            if(i<3){
                var line = new egret.Bitmap(RES.getRes("g_smallSettle_line"));
                line.y = initY+(H*i)+60;
                line.x=40;
                this.centerSp.addChild(line);
            }
        }
    }
    protected updateTitleText(isHuang,currentUserWin){
        var title:egret.Bitmap;
        if(!isHuang){
            title = this.CCenterBit(currentUserWin?"g_settle_small_win":"g_settle_small_fail");
        }else{
            title = this.CCenterBit("g_settle_small_ping");
        }
        title.anchorOffsetX = title.width/2;
        title.anchorOffsetY = title.height/2;
        title.x=this.centerSp.width/2;
        title.y=-30;
        this.centerSp.addChild(title);
    }
    //添加 房间号、时间
    protected addOtherInfo(){
        //房间号
        var roomIdText = new egret.TextField();
        roomIdText.x=26;
        roomIdText.y=-80;
        roomIdText.textColor = 0xffffff;
        roomIdText.multiline = true;
        roomIdText.fontFamily = "微软雅黑";
        roomIdText.size = 24;
        this.centerSp.addChild(roomIdText);
        roomIdText.text="房间号:"+this.roomId;

        //时间
        var nowDate = new Date().getTime();
        var date  = new egret.TextField();
        date.size = 20;
        date.textAlign = "left";
        date.verticalAlign = "middle";
        if(this.playbackModel && this.playbackModel.createTime){
            date.text = this.getTime(Number(this.playbackModel.createTime));
        }else{
            date.text =this.getTime(nowDate);
        }
        date.x = 900;
        date.y = -12;
        date.textColor = 0xfafafa;
        this.centerSp.addChild(date);
    }
    // 格式化时间
    protected getTime(date){
        let dateTime = new Date(date);
        let year = dateTime.getFullYear();
        let month = this.addPreZero(dateTime.getMonth()+1);
        let day = this.addPreZero(dateTime.getDate());

        let hours = this.addPreZero(dateTime.getHours());
        let minutes = this.addPreZero(dateTime.getMinutes());
        let seconds = this.addPreZero(dateTime.getSeconds());
        let createTime = year + "-" +month + "-" + day + "   " + hours + ":" + minutes+":"+seconds;
        return createTime;
    }
    // 补零方法
    protected addPreZero(num){
        if(num<10){
            return '0'+num;
        }else {
            return num;
        }
    }
    public clear(){
        super.clear();
        this.continueBtn.clear();
        this.continueBtn.removeEventListener("click",this.continueBtnClick,this);
        this.continueBtn.removeEventListener("click",this.playbackBtnClick,this);
        egret.Tween.removeTweens(this.title);
    }
}