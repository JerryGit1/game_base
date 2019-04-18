/**
 * Created by 韩 on 2017/7/7.
 * 用户信息
 * 1.用户头像
 * 2.用户昵称
 * 3.元宝
 * 4.充值按钮
 */
class AH_H_userInfoView extends BaseView{
    // 用户头像
    protected userHead:Game_headCirceView;
    // 昵称
    protected nikeName:egret.TextField;
    // 昵称背景
    protected nikeNameBg:egret.Bitmap;
    // 元宝数量
    protected yuanBao:egret.TextField;
    // 元宝背景
    protected yuanBaoBg:egret.Bitmap;
    // + 按钮
    protected btnAdd:MyButton;
    // 用户ID
    protected userId:egret.TextField;

    protected model:UserModel;
    public constructor(model){
        super();
        this.model=model;
        this.model.addEventListener("updateMoney",this.updateMoney,this);
        this.init()
    }
    protected init(){
        this.userHead = new Game_headCirceView();
        this.userHead.setHead(this.model.openImg);
        this.userHead.touchEnabled = true;
        this.userHead.addEventListener("touchTap",function () {
            PopupLayer.getInstance().userinfo(this.model);
        },this);
        this.addChild(this.userHead);
        this.userNikeName(this.model.openName);
        this.setUserId(this.model.userId);
        this.userSum();
        this.addBtn();
        this.updateMoney();
    }
    // 用户昵称
    protected userNikeName (str:string){
        this.nikeName = new egret.TextField();
        this.nikeName.x = 56;
        this.nikeName.y = -32;
        this.nikeName.textColor=0xdbb683;
        this.nikeName.textAlign = "center";
        this.nikeName.border = false;
        this.nikeName.size = 28;
        if(str.length>5)str=str.substr(0,5)+"..";
        this.nikeName.text = str;
        this.addChild(this.nikeName);
    }
    protected setUserId(str){
        this.userId = new egret.TextField();
        this.userId.x = 56;
        this.userId.y = 10;
        this.userId.textAlign = "center";
        this.userId.border = false;
        this.userId.size = 25;
        if(str.length>5)str=str.substr(0,5)+"..";
        this.userId.text = "ID:" + str;
        this.addChild(this.userId);
    }
    // 用户金额
    protected userSum(){
        this.yuanBaoBg = new egret.Bitmap(RES.getRes("h_yuanbaoBar"));
        this.yuanBaoBg.x = Main.stageWidth-this.yuanBaoBg.width-70;
        this.yuanBaoBg.y = -45;
        this.addChild(this.yuanBaoBg);

        this.yuanBao = new egret.TextField();
        this.yuanBao.size = 26;
        this.yuanBao.width = 100;
        this.yuanBao.textColor = 0xdbb683;
        this.yuanBao.x = Main.stageWidth-this.yuanBao.width*2-30;
        this.yuanBao.textAlign = "center";
        this.yuanBao.verticalAlign=egret.VerticalAlign.MIDDLE;
        this.yuanBao.height=this.yuanBaoBg.height;
        this.addChild(this.yuanBao);
        this.yuanBao.y=this.yuanBaoBg.y;
    }
    // 加号按钮
    protected addBtn(){
        this.btnAdd = new MyButton("h_plusBtn");
        this.btnAdd.x = Main.stageWidth-this.btnAdd.width-55;
        this.btnAdd.y =this.yuanBao.y+this.yuanBaoBg.height/2;

        this.btnAdd.addTouchEvent();
        this.btnAdd.addEventListener("click",this.addHitView,this);
        this.addChild(this.btnAdd);
    }
    // 更新用户信息视图层
    public updateMoney (){
        if(Number(this.model.money)>=10000){
            this.yuanBao.text =Number(this.model.money)/10000+" 万张";
        }else{
            this.yuanBao.text =this.model.money+" 张";
        }

    }


    /*事件*/
    //点击加号事件
    protected addHitView(e){
        PopupLayer.getInstance().addHintView("代理咨询请联系群主：微信dfmjkf01，客服微信dfmjkf007",null,true,"min");
    }

    //清除事件
    public clear(){
        super.clear();
        this.model.removeEventListener("updateMoney",this.updateMoney,this);
    }
}