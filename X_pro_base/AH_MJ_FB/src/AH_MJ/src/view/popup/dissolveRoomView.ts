/**
 * Created by TYQ on 2017/7/18.
 */
class AH_DissolveRoomView extends PopupBaseView{
    protected model:Game_killRoomModel;
    protected bg:egret.Bitmap;
    protected signs:any =[];
    protected agreeBtn:MyButton;
    protected disAgreeBtn:MyButton;
    protected currentId;
    //韩月辉
    protected headImg:Game_headCirceView; //用户头像
    public num:Number ;//倒计时
    public nickNameTxt:egret.TextField ;//用户昵称
    //弹框背景相对于舞台的缩放比例
    protected Scale = .6;
    public constructor(model,currentId){
        super(false,true);
        this.model = model;
        this.currentId = currentId;
        var H = Main.stageHeight*this.Scale;
        this.bg = this.addMsgBg(null,H);
        var str = "<font color='#ff8c00'>"+this.model.userName+"</font>发起投票解散对局";
        this.addStrTitle(str);
        this.addUsers();
        this.addBtns();
        this.addTip();
        this.countdown();

        /*出牌暂停闪烁动画 停止倒计时 停止声音 hyh*/
        SoundModel.stopAllBackEffect();
    }
    protected addUsers(){
        //发起人
        this.addInitiator();
        //其他人：
        for (var i:number=1; i <=this.model.othersAgree.length; i++) {
            var uInfo=this.model.othersAgree[i-1];
            this.createHead(uInfo,i);

            /*同意或者拒绝提示*/
            var sign = this.createSign(i);
            this.signs.push(sign);
        }
    }
    /*创建发起人*/
    protected addInitiator(){
        var uData = {
            userId:this.model.userId,
            userImg:this.model.userImg,
            userName:this.model.userName
        };
        this.createHead(uData,0);
        var sign = this.createSign(0);
        sign.texture=RES.getRes("g_agreeSign");
        sign.anchorOffsetX = sign.width/2;
        sign.anchorOffsetY = sign.width/2;
        sign.y = this.nickNameTxt.y + 12;
    }
    /*创建头像*/
    protected createHead(uInfo,index){
        this.headImg = new Game_headCirceView();
        this.headImg.setHead(uInfo.userImg);
        this.headImg.width = 80;
        this.headImg.height = 80;
        this.headImg.x = (this.bg.width*.8)/4*index + (this.bg.width*.8)/8+ this.headImg.width;
        this.headImg.y = this.bg.height*0.35;
        this.centerSp.addChild(this.headImg);
        this.createNameText(uInfo,index,this.headImg);
    }
    /*创建昵称*/
    protected createNameText(uInfo,index,headImg){
        this.nickNameTxt=new egret.TextField();
        this.nickNameTxt.size=18;
        this.nickNameTxt.textColor=0xCB6F01;
        this.nickNameTxt.multiline=true;
        this.nickNameTxt.textAlign="center";
        this.nickNameTxt.verticalAlign="middle";
        this.nickNameTxt.width=76;
        this.nickNameTxt.x=(this.bg.width*.8)/4*index + (this.bg.width*.8)/8 + this.nickNameTxt.width/2;
        this.nickNameTxt.y=this.headImg.y + 60;
        this.nickNameTxt.fontFamily="微软雅黑";
        this.nickNameTxt.text = uInfo.userName;
        this.centerSp.addChild(this.nickNameTxt);
    }
    /*创建同意或者拒绝提示*/
    protected createSign(index):egret.Bitmap{
        var sign:egret.Bitmap = new egret.Bitmap();
        sign.x = this.bg.width*0.2+this.bg.width*0.2*index;
        sign.y = this.nickNameTxt.y + 12;
        this.centerSp.addChild(sign);
        return sign;
    }
    protected addBtns(){
        //同意解散
        this.agreeBtn = new MyButton("h_closeGame");
        this.agreeBtn.x = this.bg.width*0.65;
        this.agreeBtn.y = this.bg.height*0.86;
        this.centerSp.addChild(this.agreeBtn);

        //拒绝解散
        this.disAgreeBtn = new MyButton("g_disagree");
        this.disAgreeBtn.x = this.bg.width*0.3;
        this.disAgreeBtn.y = this.bg.height*0.86;
        this.centerSp.addChild(this.disAgreeBtn);
        if(this.model._isInitiator){//发起人
            this.setButtonEnabled();
        }else{
            this.agreeBtn.addTouchEvent();
            this.agreeBtn.addEventListener("click",this.agreeBtnClick,this);
            this.disAgreeBtn.addTouchEvent();
            this.disAgreeBtn.addEventListener("click",this.disAgreeBtnClick,this);
        }
    }
    /*刷新是否同意消息*/
    public updateAgree(){
        for (var i=0; i <this.model.othersAgree.length; i++){
            if(this.signs[i]){
                switch(this.model.othersAgree[i].agree){
                    case 0://还没动作
                        break;
                    case 1://同意
                        this.signs[i].texture=RES.getRes("g_agreeSign");
                        break;
                    case 2://拒绝
                        this.signs[i].texture=RES.getRes("g_dissagreeSign");
                        break;
                }
                this.signs[i].anchorOffsetX = this.signs[i].width/2;
                this.signs[i].anchorOffsetY = this.signs[i].width/2;
            }
        }
        /*是否有过操作了*/
        if(this.model._isHandle){
            this.setButtonEnabled();
        }
        /*其他动作*/
        if(this.model.agree==1){
            //所有人都同意解散房间了
            //停顿1秒
            this.setButtonEnabled();
            setTimeout(function () {
                this.closeClick();
                PopupLayer.getInstance().floatAlert("房间解散成功");
                //发起大结算
                BaseModel.getInstance().eventRadio("sponsorBigSettlement");
            }.bind(this),1000);

        }else if(this.model.agree==2){
            //有人拒绝了
            //停顿1秒
            this.setButtonEnabled();
            setTimeout(function () {
                this.closeClick();
                PopupLayer.getInstance().floatAlert("房间解散失败");
            }.bind(this),1000);
        }
    }
    /*同意*/
    protected agreeBtnClick(){
        this.setButtonEnabled();
        BaseModel.getInstance().eventRadio("agreeDissolveRoom",{agree:1});
    }
    /*拒绝*/
    protected disAgreeBtnClick(){
        this.setButtonEnabled();
        BaseModel.getInstance().eventRadio("agreeDissolveRoom",{agree:2});
    }
    /*设置按钮不可用*/
    protected setButtonEnabled(){
        this.agreeBtn.touchEnabled = false;
        this.agreeBtn.changTexture("g_agree1");
        this.disAgreeBtn.touchEnabled = false;
        this.disAgreeBtn.changTexture("g_dissagree1");
    }
    // 300s无操作自动解散房间 HYH
    protected tipTxt;
    protected addTip(){
        //提示
        var tipInfo  = new egret.TextField();
        tipInfo.size = 24;
        tipInfo.textColor = 0xfafafa;
        tipInfo.textAlign = "center";
        tipInfo.verticalAlign = "middle";
        tipInfo.fontFamily = "微软雅黑";
        tipInfo.text = "所有人同意才会解散，解散后将根据目前的分进行最终结算";
        tipInfo.x = this.centerSp.width/2-tipInfo.width/2;
        tipInfo.y = 270;
        this.centerSp.addChild(tipInfo);

        //倒计时
        var tipTxt=new egret.TextField();
        tipTxt.size=24;
        tipTxt.textColor=0xfafafa;
        tipTxt.multiline=true;
        tipTxt.textAlign="center";
        tipTxt.verticalAlign = "middle";
        tipTxt.width = this.bg.width;
        tipTxt.y=310;
        tipTxt.fontFamily="微软雅黑";

        this.tipTxt=tipTxt;
        this.centerSp.addChild(tipTxt);
        this.onTimer()
    }
    // 倒计时
    protected timer:egret.Timer;
    protected countdown(){
        this.timer = new egret.Timer(1000,301);
        this.timer.start();
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc,this);
    }
    protected onTimer(){
        var starTime = this.model.dissolveTime;
        var nowTime = (new Date()).getTime();
        var time = Math.floor(((starTime+300000) - nowTime)/1000);
        time--;
        if(time>=0)this.tipTxt.textFlow = new egret.HtmlTextParser().parser("剩余 <font color='#dc143c'>"+time+"</font> s");
    }
    protected timerComFunc(){
        this.timer.stop();
    }
    public clear(){
        super.clear();
        this.agreeBtn.clear();
        this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
        this.agreeBtn.removeEventListener("click",this.agreeBtnClick,this);
        this.disAgreeBtn.clear();
        this.disAgreeBtn.removeEventListener("click",this.disAgreeBtnClick,this);
    }
}