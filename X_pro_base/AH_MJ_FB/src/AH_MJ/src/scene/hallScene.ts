/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 大厅场景主类
 */
class AH_HallScene extends BaseScene{

    protected model:HallModel;
    /*用户信息栏*/
    protected userInfoView:H_userInfoView;
    /*跑马灯*/
    protected noticeView:H_noticeView;
    /*右侧按钮列表*/
    protected btnGroup:H_btnGroupView;
    /*底部按钮创建房间按钮和加入房间按钮*/
    protected createRoomBtn:H_createRoom;
    protected joinRoomBtn:H_joinRoom;
    protected system1;
    protected system2;
    protected system3;/*粒子系统*/
    protected title:egret.Bitmap;/*标题*/
    public constructor(model){
        super(model);
        /*某个房间回放记录列表*/
        this.model.addEventListener("addRoomPlaybackListPopupView",this.addRoomPlaybackListPopupView,this);
        // 反馈成功弹框
        this.model.addEventListener("alertMsg",this.alertMsg,this);
        this.initView();
    }
    //初始化页面视图
    public initView(){
        //背景
        this.initBg();
        //用户信息栏
        this.userInfoView = new H_userInfoView(this.model.userModel);
        this.userInfoView.x = 56;
        this.userInfoView.y = 56;

        //跑马灯
        this.noticeView = new H_noticeView();
        this.noticeView.x = 266;
        this.noticeView.y = 14;

        this.noticeView.setTextPos(this.model.userModel.notice);
        //右侧按钮列表
        this.btnGroup = new H_btnGroupView(this.model);

        this.btnGroup.x=Main.stageWidth-this.btnGroup.width;
        //标题
        var title=this.CCenterBit("h_title",false);
        title.scaleY=title.scaleX=(this.btnGroup.width*.66/title.width);
        var y=Main.stageHeight-title.height*title.scaleY;
        title.y=y;
        this.title=title;
        egret.Tween.get(title,{loop:true}).to({y:y-5},1300).to({y:y},1300);
        this.addChild(this.btnGroup);
        this.addChild(title);
        this.addChild(this.userInfoView);
        this.addChild(this.noticeView);
        /*粒子系统*/
        this.addSystem1();
        //创建 or 加入房间
        this.addMainBtns();
        //自定义分享
        WeiXinJSSDK.getInstance().hallShare();
        //播放背景音效
        SoundModel.playBackSound("dating");

        /*需要主动弹出的界面 2.1.4*/
        if(!this.model.userModel.userAgree){
            PopupLayer.getInstance().adduserAgreementView();
        }else if(this.model.playbackRoomId){
            //弹出某个房间具体回放信息界面 2.1.4
            BaseModel.getInstance().eventRadio("getRoomPlaybackList",{roomSn:this.model.playbackRoomId,"createTime":this.model.playbackRoomCreateTime});
            this.model.playbackRoomId=null;
        }
    }
    protected addMainBtns(){
        /*创建房间按钮和加入房间按钮*/
        this.createRoomBtn = new H_createRoom();
        // this.createRoomBtn.width = Main.stageWidth/5;
        this.createRoomBtn.x = 830;
        this.createRoomBtn.y = Main.stageHeight/2 -this.createRoomBtn.height/2+30;
        this.addChild(this.createRoomBtn);
        // 加入房间
        this.joinRoomBtn = new H_joinRoom();
        var initH=Main.stageHeight-114*3;

        this.joinRoomBtn.x = 800;
        this.joinRoomBtn.y = Main.stageHeight/2 + this.joinRoomBtn.height/2-10;
        this.addChild(this.joinRoomBtn);
    }
    //实例化背景
    protected initBg(){
        var h_back = new egret.Bitmap(RES.getRes("h_back"));
        this.addChild(h_back);
    }
    /*显示用户信息弹框*/
    protected addUserInfoView(){

    }
    /*点击元宝或者加号弹窗*/
    protected payTipsView(){

    }
    /*显示加入房间弹框*/
    protected addRoomView(e){

    }
    /*显示创建房间弹框*/
    protected createRoomView(e){

    }
    /*显示房间回放记录列表 2.1.4*/
    protected addRoomPlaybackListPopupView(e:egret.Event){
        var data=e.data;
        PopupLayer.getInstance().achievementRecordView(data);
    }
    // 显示反馈回调弹框
    protected alertMsg(e:egret.Event){
        var data=e.data.content;
        PopupLayer.getInstance().addHintView(data,null,true,"min");
    }
    protected addSystem1(){
        //获取纹理
        var texture1 = RES.getRes("lizi_back1");
        var texture2 = RES.getRes("lizi_back2");
        var config = RES.getRes("lizi_back1_json");
        if(config){
            //创建 GravityParticleSystem
            this.system1 = new particle.GravityParticleSystem(texture1, config);
            this.system1.maxParticles=11;
            //启动粒子库
            this.system1.start();
            //将例子系统添加到舞台
            this.addChildAt(this.system1,1);

            //创建 GravityParticleSystem
            this.system2 = new particle.GravityParticleSystem(texture2, config);
            this.system2.maxParticles=8;
            this.system2.y=-20;
            //启动粒子库
            this.system2.start();
            //将例子系统添加到舞台
            this.addChildAt(this.system2,1);

            //创建 GravityParticleSystem
            this.system3 = new particle.GravityParticleSystem(texture2, config);
            this.system3.maxParticles=5;
            this.system3.y=20;
            //启动粒子库
            this.system3.start();
            //将例子系统添加到舞台
            this.addChildAt(this.system3,10);
        }
    }

    public clear(){
        super.clear();
        // 反馈成功弹框
        this.model.removeEventListener("alertMsg",this.alertMsg,this);

        this.userInfoView.clear();
        if(this.system1){
            this.system1.stop(true);
            this.system2.stop(true);
            this.system3.stop(true);
        }
        egret.Tween.removeTweens(this.title);
    }
}
