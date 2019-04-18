/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
class AH_Game_userView extends BaseView{

    protected model:UserModel;
    /*头像*/
    protected headView:Game_headView;
    /*等待中*/
    protected waitText:egret.TextField;
    /*内容信息*/
    protected infoView:Game_user_infoView;
    /*庄家icon*/
    protected zhuangIcon:egret.Bitmap;
    /*房主icon*/
    protected hostIcon:egret.Bitmap;
    /*语音标志*/
    protected voiceIcon:egret.Bitmap;
    /*座位*/
    protected index:number;

    public constructor(model,index){
        super();
        this.model=model;
        this.index = index;
        /*初始化视图*/
        var showNetWork = this.index==1?true:false;
        this.headView=new Game_headView(showNetWork);
        this.addChild(this.headView);
        this.headView.scaleX=this.headView.scaleY=.8;
        this.headView.W=this.headView.width*this.headView.scaleX;
        this.addWaitTxt();
        //玩家状态更新
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerState,this.updateStateInfo,this);
        //玩家在线状态更新
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerLineState,this.lineState,this);
        //更新玩家基础信息
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo,this.updateBaseInfo,this);
        //更新网络质量标志
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_network,this.updateNetWork,this);
        //网络质量差提示
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_playerBadNet,this.badNetTip,this);
        //玩家聊天语音状态更新
        // this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_chatVoiceStatus,this.updateChatVoiceStatus,this); 1.2.0删除
        /*点击事件*/
        this.headView.touchEnabled = true;
        this.headView.addEventListener(egret.TouchEvent.TOUCH_TAP,this.addUserInfoPopupView,this);

        //底部介绍信息
        this.infoView=new Game_user_infoView();
        this.addChild(this.infoView);
        this.infoView.y=this.headView.height/2-10;
        if(this.model.playStatus == BaseModel.PLAYER_NONE) this.infoView.visible = false;
    }
    /*
     * playStatus的值有
     dating              用户在大厅中
     in                  刚进入房间，等待状态
     prepared            准备状态
     chu                 出牌状态（该出牌了）
     wait                等待状态（非出牌状态）
     xjs                 小结算
     none            这个位置没人（等待阶段 掉线或者退出房间）
     * **/
    protected updateStateInfo(){
        this.waitText.visible=this.infoView.visible=false;
        this.headView.setHighLight(true);//边框
        switch(this.model.playStatus){
            case BaseModel.PLAYER_IN://刚进入房间，等待状态 1.6.8舍弃
                // this.infoView.visible=true;
                // this.userInRoomTip();//玩家进入房间提示
                // this.updateBaseInfo();
                break;
            case BaseModel.PLAYER_PREPARED://准备状态
                this.infoView.visible=true;
                this.updateBaseInfo();
                break;
            case BaseModel.PLAYER_CHU://游戏阶段 出牌状态
                this.infoView.visible=true;
                this.headView.setChuStatus(true);
                this.headView.setHighLight(false);
                break;
            case BaseModel.PLAYER_WAIT://游戏阶段 非出牌状态
                this.infoView.visible=true;
                this.headView.setChuStatus(false);
                break;
            case BaseModel.PLAYER_XJS://游戏阶段 小结算
                this.infoView.visible=true;
                this.headView.setChuStatus(false);
                break;
            case BaseModel.PLAYER_NONE://这个位置没有人状态
                this.headView.setHead(null);
                this.waitText.visible=true;
                if(this.zhuangIcon)this.zhuangIcon.visible=false;
                if(this.hostIcon) this.hostIcon.visible=false;
                break;
            default:
                MyConsole.getInstance().trace("玩家状态 没有这个奇葩状态"+this.model.playStatus,0);
                break;
        }
    }
    //刷新玩家头像基础信息
    protected updateBaseInfo(){
        if(this.model.playStatus!=BaseModel.PLAYER_NONE){
            // MyConsole.getInstance().trace("玩家"+this.model.openName+"加入",1);
            //基础数据显示
            this.infoView.updateInfo(this.model.score,this.model.openName);
            this.headView.setHead(this.model.openImg);
            //庄加标志
            this.setZhuang(this.model.zhuang);
            //房主标志
            this.setHost(this.model.houseOwner);
        }

    }
    //玩家在线状态设置
    protected _isOut=-1;
    protected lineState(){
        if(this.model.status==BaseModel.PLAYER_OUT){
            if(this._isOut==1&&this.model.num_id!=1){
                PopupLayer.getInstance().floatAlert("玩家 <font color='#ff0000'>"+this.model.openName+"</font> 掉线",800);
            }
            if((this._isOut==1||this._isOut==-1)&& this.model.num_id!=1){
                this.headView.setOffLine(true);
            }
            this._isOut=2;
        }else if(this.model.status==BaseModel.PLAYER_INLINE){
            if(this._isOut==2&&this.model.num_id!=1){
                PopupLayer.getInstance().floatAlert("玩家 <font color='#00cc00'>"+this.model.openName+"</font> 上线",800);
            }
            if(this._isOut==2||this._isOut==-1){
                this.headView.setOffLine();
            }
            this._isOut=1;
        }
    }
    //更新网络质量
    protected updateNetWork(e){
        // if(this.model.userId == Number(e.data.userId)){
        //     this.headView.updateNetWork(e.data);
        // }
        if(this.index==1){//this.model.userId == Number(e.data.userId)
            this.headView.updateNetWork({level:e.data,userId:this.model.userId});
        }
    }
    //网络差提示
    protected badNetTip(e){
        if(this.model.userId == Number(e.data)){
            PopupLayer.getInstance().floatAlert("当前网络质量不稳定！",1500);
        }
    }
    /*玩家语音状态显示*/
    /* 1.2.0删除
    private updateChatVoiceStatus(){
        if(!this.voiceIcon){
            var voiceIcon = this.CCenterBit("g_isVoiceSign");
            voiceIcon.y = this.headView.height/2-40;
            this.voiceIcon = voiceIcon;
            this.voiceIcon.alpha = 0;
            this.addChild(this.voiceIcon);
            if(this.index == 2){
                this.voiceIcon.scaleX = -1;
                this.voiceIcon.x = this.headView.x-60;
            }else{
                this.voiceIcon.x= this.headView.x+60;
            }
        }
        egret.Tween.removeTweens(this.voiceIcon);
        this.voiceIcon.visible = this.model.chatVoiceStatus;
        if(this.voiceIcon.visible)
            egret.Tween.get(this.voiceIcon,{loop:true}).to({alpha:1},600).wait(200).to({alpha:0},600);
    }*/

    /*显示庄标志*/
    protected setZhuang(_isAdd){
        if(!this.zhuangIcon){
            var zhuang=this.CCenterBit("g_zhuang");

            if(this.index == 2 || this.index ==3){
                zhuang.x = -this.headView.W/2+10;//左
                zhuang.y=-this.headView.height/2+23;
            }else{
               zhuang.x = this.headView.W/2-5;//右
                zhuang.y=-this.headView.height/2+23;
            }

            this.zhuangIcon=zhuang;
            this.addChild(zhuang);
        }
        this.zhuangIcon.visible=_isAdd;
    }
    /*显示房主标志*/
    protected setHost(_isAdd){
        if(!this.hostIcon){
            var hostIcon=this.CCenterBit("g_host");
            this.addChild(hostIcon);
            hostIcon.scaleX=hostIcon.scaleY=.7;
            if(this.index == 2 || this.index ==3){
                hostIcon.x =  this.headView.W/2-8;//右
                hostIcon.rotation = 45;
                hostIcon.y=-this.headView.height/2+20;
            }else{
                hostIcon.x = -this.headView.W/2+8;//左
                hostIcon.rotation = -45;
                hostIcon.y=-this.headView.height/2+20;
            }

            this.hostIcon = hostIcon;
        }
        this.hostIcon.visible = _isAdd;
    }
    /*等待中文本*/
    protected addWaitTxt(){
        var waitText=new egret.TextField();
        this.addChild(waitText);
        waitText.textColor=0xffffff;
        waitText.multiline=true;
        waitText.stroke=1;
        waitText.strokeColor=0x000000;
        waitText.textAlign="center";
        waitText.verticalAlign="middle";
        waitText.width=this.width;
        waitText.x=-this.width/2;
        waitText.fontFamily="微软雅黑";
        waitText.size=17;
        waitText.y=this.headView.height/2;
        waitText.text="等待中...";
        this.waitText=waitText;
        this.waitText.visible=false;
    }
    /*---------------------弹窗-------------------------*/
    /*显示用户信息*/
    protected addUserInfoPopupView(){
        if(this.model.playStatus!=BaseModel.PLAYER_NONE){
            PopupLayer.getInstance().userinfo(this.model,true);
        }
    }
    /*清除*/
    public clear(){
        super.clear();
        //玩家状态更新
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerState,this.updateStateInfo,this);
        //玩家在线状态更新
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerLineState,this.lineState,this);
        //更新玩家基础信息
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo,this.updateBaseInfo,this);
        //玩家聊天语音状态更新
        // this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_chatVoiceStatus,this.updateChatVoiceStatus,this); 1.2.0删除
    }
}