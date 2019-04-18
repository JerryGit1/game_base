/**
 * Created by Administrator on 2016/12/19.
 */
class AH_PopupLayer extends BaseView{
    /*浮层框提示*/
    /*-------------------浮层框--------------------*/
    public floatAlert(str,time=2500){
        var sp=new egret.Sprite(),txt=new egret.TextField(),w,h;
        this.addChild(sp);
        sp.addChild(txt);
        txt.textColor=0xffffff;
        txt.height = 40;
        txt.multiline = true;
        txt.textFlow = (new egret.HtmlTextParser()).parse(str);
        txt.size=25;
        txt.textAlign = "center";
        w=txt.textWidth+10;
        h=txt.textHeight+20;
        txt.x = w/2 - txt.width/2;
        txt.y = h/2 - txt.height/2+5;
        sp.graphics.beginFill(0x000000,.5);
        sp.graphics.drawRoundRect(0,0,w,h,10,10);
        sp.graphics.endFill();
        sp.x = Main.stageWidth/2-w/2;
        sp.y = Main.stageHeight/2-h/2+20;
        sp.alpha=0;
        egret.Tween.get(sp).to({y:sp.y-20,alpha:1},100).wait(time).to({y:sp.y-40,alpha:0},150).call(function(){
            this.removeChild(sp);
        },this)
    }
    /*-------------------游戏中所有的弹出框--------------------*/
    //提示框类型1
    public addHintView(str,backFunc=null,_isAddCloseBtn=true,type="min",runBackFunc=null){
        var view = new Hint_View(str,backFunc,_isAddCloseBtn,type,runBackFunc);
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    // 用户协议
    public adduserAgreementView(){
        var view = new H_userAgreementView();
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //个人信息
    public userinfo(mode,isGaming=false){
        var view = new H_userInfoPopupView(mode,isGaming);
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //创建房间
    public createRoom(){
        var view = new H_createRoomView();
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //加入房间
    public joinRoomView:H_joinRoomView;
    public joinRoom (){
        if(this.joinRoomView)this.closeJoinRoomPopupView();
        this.joinRoomView = new H_joinRoomView();
        this.addChild(this.joinRoomView );
        this.joinRoomView .addEventListener("close",this.closeLayer2_popupView,this);
    }
    /*关闭 加入房间弹窗*/
    public closeJoinRoomPopupView(){
        this.remove_popupView(this.joinRoomView);

    }
    //分享弹框
    public addShareView(){
        var view = new ShareView();
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //战绩
    public achievementView(model){
        var view = new H_achievementView(model);
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //回放列表
    protected achRecordView:H_achievementRecordView;
    public achievementRecordView(data){
        if(!this.achRecordView){
            this.achRecordView = new H_achievementRecordView(data);
            this.addChild(this.achRecordView);
            this.achRecordView.addEventListener("close",this.closeLayer2_popupView,this);
        }
    }
    //消息
    /*1.2.0舍弃
    public newsView(){
        var view = new H_news();
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }*/
    //代开房间
    public hall_replaceCreateRoomView(model){
        var view = new H_replaceCreateRoomView(model);
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //设置
    public setView(type,roomInfoModel=null){
        var view = new H_serView(type,roomInfoModel);
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //反馈
    public feedbackView(){
        var view = new H_feedbackView();
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //小结算
    public addSmallSettleView(data=null,isHuang,currentUserWin,currentId,roomModel,playBackModel){
        // this.removePopupViewAll(); //----tyq  为了解决在小结算界面，其他人解散房间时，当前玩家拒绝后出现无法继续请求准备的问题
        var view = new SmallSettlementView(data,isHuang,currentUserWin,currentId,roomModel,playBackModel);
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //小结算点杠人名字
    public addTipView(string,width=null,x?,y?):H_tipView{//hyh添加参数
        for(var i=0;i<this.$children.length;i++){
            if(this.$children[i].name=="H_tipView")this.removeChild(this.$children[i])
        }
        var view = new H_tipView(string,width,x,y);
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
        return view;
    }
    //大结算
    public addMaxSettleView(data=null,currentId,roomId){
        this.removePopupViewAll();
        var view = new MaxSettlementView(data,currentId,roomId);
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //帮助
    public addHelpView(){
        var view = new HelpView();
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    //聊天表情按钮
    public addChatView(model){
        var view = new ChatView(model);
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }
    protected dissolveRoomView:DissolveRoomView;
    public addKillRoomView(model,currentId){
        if(!this.dissolveRoomView){
            // this.removePopupViewAll();  2.2.7

            this.dissolveRoomView = new DissolveRoomView(model,currentId);
            this.addChild(this.dissolveRoomView);
            this.dissolveRoomView.addEventListener("close",this.closeLayer2_popupView,this);
        }
        this.dissolveRoomView.updateAgree();
    }
    /*语音录音中*/
    public recordView:Game_recordView;
    public startRecord(){
        if(this.recordView)this.remove_popupView(this.recordView);
        this.recordView=new Game_recordView();
        this.addChild(this.recordView);
        this.recordView.x=Main.stageWidth/2-this.recordView.w/2;
        this.recordView.y=Main.stageHeight/2-this.recordView.w/2;
        this.recordView.addEventListener("close",this.closeLayer2_popupView,this);
    }
    /*关闭*/
    protected closeLayer2_popupView(e:egret.Event){
        var view=e.target;
        this.remove_popupView(view);
    }
    /*清空弹出窗视图*/
    protected remove_popupView(view:PopupBaseView){
        if(view){
            view.clear();
            this.removeChild(view);
            view=null;
        }
        this.recordView=null;
        this.achRecordView=null;
        this.dissolveRoomView = null;
        this.joinRoomView=null;
    }

    /*-------------------清除游戏中所有的弹出窗视图--------------------*/
    public removePopupViewAll(){
        var i = this.numChildren-1;
        while(i>=0){
            var view:any = this.getChildAt(i);
            if(view["__types__"]){
                for(var s in view["__types__"]){
                    if(view["__types__"][s]=="PopupBaseView"){
                        this.remove_popupView(view);
                        break;
                    }
                }
            }
            i--;
        }
    }

    public getPoint(sp,speed=2){
        document.addEventListener("keydown",function(e){
            switch (e.keyCode){
                case 39:
                    sp.x+=speed;
                    break;
                case 37:
                    sp.x-=speed;
                    break;
                case 38:
                    sp.y-=speed;
                    break;
                case 40:
                    sp.y+=speed;
                    break;
            }
            MyConsole.getInstance().trace(sp.x+"--------------()"+sp.y,5);
        });
    }
}