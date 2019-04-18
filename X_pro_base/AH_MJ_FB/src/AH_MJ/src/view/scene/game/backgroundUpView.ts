/**
 * Created by Tang on 2017/9/9.
 */
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 背景场景
 */
class AH_BackgroundUpView extends BaseView {
    protected model:Game_backLayerModel;
    /*跑马灯*/
    public noticeView:H_noticeView;
    /*头像组*/
    protected userViews:Array<Game_userView> = [];
    /*设置按钮*/
    protected settingBtn:MyButton;
    /*语音按钮*/
    protected voiceBtn:MyButton;
    /*聊天表情按钮*/
    protected chatBtn:MyButton;
    /*帮助按钮*/
    protected helpBtn:MyButton;
    public constructor(model) {
        super();
        this.model = model;
        this.addUserList();//添加玩家
        this.addNoticeView();//跑马灯
        if(!BaseModel.PLAYBACK_MODEL) this.addBtns();//按钮
        BaseModel.getInstance().addEventListener("isVoicing",this.updateUserChatVoiceState,this);//更新玩家播放语音状态
        BaseModel.getInstance().addEventListener("searchName",this.searchName,this);//查询用点杠户名
        //出牌时 顶层按钮事件屏蔽处理
        BaseModel.getInstance().addEventListener("setUpViewTouchEvent",this.setTouchEvent,this);
    }
    /*跑马灯*/
    protected addNoticeView(){
        this.noticeView = new H_noticeView();
        this.noticeView.x = Main.stageWidth/2-this.noticeView.width/2;
        this.noticeView.y = 15;
        this.noticeView.visible = false;
        this.addChild(this.noticeView);
    }
    /*------------------实例化视图------------------------*/
    /*显示头像*/
    protected addUserList() {
        for (var i = 1; i <=4; i++) {
            var userView = new Game_userView(this.model.userGroupModel.numIdGetUserModel(i),i);
            userView.x = BaseModel.PLAYBACK_MODEL?this.model.headPos1[i-1].x:this.model.headPos[i-1].x;
            userView.y = BaseModel.PLAYBACK_MODEL?this.model.headPos1[i-1].y:this.model.headPos[i-1].y;
            this.userViews.push(userView);
            this.addChild(userView);
        }
    }
    /*---------------------更新视图---------------------*/
    //更新玩家播放语音状态
    protected updateUserChatVoiceState(e:egret.Event){
        var data = e.data;
        this.model.userGroupModel.setUserIsPlayingVoice(data.Id,data._isVoicing);
    }
    /*-----------------------弹框----------------------*/
    /*点杠人弹框*/
    protected searchName(e) {
        var userId = e.data.dian_userId;
        var name = (this.model.userGroupModel.userIdGetUserModel(userId)).openName;
        var string = "<font color='#CB6F01'>"+name+"</font>  点杠";
        // PopupLayer.getInstance().addTipView(name,e.data.x,e.data.y)
        var view = PopupLayer.getInstance().addTipView(string);
        view.x = e.data.x;
        view.y = e.data.y;
    }
    //添加按钮
    protected addBtns() {
        //设置按钮
        this.settingBtn = new MyButton("g_settingBtn");
        this.settingBtn.x = Main.stageWidth*0.95;
        this.settingBtn.y = Main.stageHeight*.1;
        this.addChild(this.settingBtn);
        //表情按钮
        this.chatBtn = new MyButton("g_chatBtn");
        this.chatBtn.x = this.settingBtn.x;
        this.chatBtn.y = Main.stageHeight*.6;
        this.addChild(this.chatBtn);

        //1.0 去掉
        // this.helpBtn.visible=false;
        this.settingBtn.addTouchEvent();
        this.settingBtn.addEventListener("click", this.settingBtnClick, this);
        //1.6.8 release版去掉
        /*if(this.model.getVersionType()!="release"){
         this.voiceBtn.addTouchEvent();
         this.voiceBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.voiceBtnClick, this);
         }else{
         this.voiceBtn.visible=false;
         }*/
        this.chatBtn.addTouchEvent();
        this.chatBtn.addEventListener("click", this.chatBtnBtnClick, this);
    }
    /*-----------------------弹框----------------------*/
    /*设置弹框*/
    protected settingBtnClick(e) {
        PopupLayer.getInstance().setView("in",this.model.roomInfoModel);
    }
    /*表情弹框*/
    protected chatBtnBtnClick(e) {
        PopupLayer.getInstance().addChatView(this.model["user1Model"]);
    }

    /*------------------------事件------------------------*/
    protected setTouchEvent(e:egret.Event){
        if(e){
            this.touchEnabled=e.data;
            this.touchChildren=e.data;
        }
    }

    public clear(){
        super.clear();
        for (var i = 0; i < this.userViews.length; i++) {
            this.userViews[i].clear();
        }
    }
}
