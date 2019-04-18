/**
 * Created by 韩 on 2017/7/14.
 * 用户个人信息弹框
 */
class AH_H_userInfoPopupView extends PopupBaseView{
    protected userHeader:Game_headCirceView;
    protected model:UserModel;
    // 标题
    protected userTextTitle:egret.TextField;
    // 昵称 id ip 分值
    protected userText:egret.TextField;
    public constructor(model,isGaming){
        super();
        this.model=model;
        var bg:egret.Bitmap = this.addMsgBg(Main.stageWidth*.7,Main.stageHeight*.6);//"b_p_hitBg",
        // var x = bg.width-27;
        // var y = 7;
        var x = bg.width-7;
        var y = 5;
        this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addTitle("h_userInfo",this.centerSp.width/2,45);
        this.openAni();
        this.initUserContent(bg);
        if(isGaming && this.model.curHost && this.model.num_id != 1) this.addBtn();
    }
    protected initUserContent(bg){
        this.userHeader = new Game_headCirceView();
        this.userHeader.setHead(this.model.openImg);
        this.userHeader.scaleX = 2;
        this.userHeader.scaleY = 2;
        this.userHeader.x = this.userHeader.width*2;
        this.userHeader.y = bg.height/2;
        // 昵称 ID IP 背景
        var userInfoBg;
        for(var i =0 ;i<5;i++){
            userInfoBg = new egret.Bitmap(RES.getRes("h_userInfoBg"));
            userInfoBg.x = bg.width/2+60;
            userInfoBg.y = 105+i*50;
            this.centerSp.addChild(userInfoBg);
            var str;
            this.userTextTitle = new egret.TextField();
            this.userTextTitle.textAlign = "center";
            this.userTextTitle.stroke = 2;
            this.userTextTitle.strokeColor = 0x000000;
            this.userTextTitle.fontFamily = "微软雅黑";
            this.userTextTitle.size = 30;
            this.userTextTitle.y = 105+i*50;

            this.userText = new egret.TextField();
            this.userText.textAlign = "center";
            this.userText.fontFamily = "微软雅黑";
            this.userText.textColor = 0xdbb683;
            this.userText.size = 20;
            this.userText.y = 112+i*50;
            if (i==0){
                str = this.model.openName;
                this.userTextTitle.text = "昵称：";
            }else if (i==1){
                str = this.model.userId;
                this.userTextTitle.text = "ID：";
            }else if(i==2){
                str = this.model.gender==1?"男":"女";
                this.userTextTitle.text = "性別：";
            }else if(i==3) {
                str = this.model.ip;
                this.userTextTitle.text = "IP：";
            }else if (i==4){
                str = this.model.money;
                this.userTextTitle.text = "房卡：";
            }
            this.userText.text = str;
            this.userTextTitle.x = bg.width/2 - this.userTextTitle.width+50;
            this.userText.x = bg.width/2+100;
            this.centerSp.addChild(this.userTextTitle);
            this.centerSp.addChild(this.userText);
        }
        this.centerSp.addChild(this.userHeader);
    }
    protected addBtn(){
        var deleteUserBtn = new MyButton("g_deleteUserBtn");
        deleteUserBtn.x = 170;
        deleteUserBtn.y = this.userHeader.y+this.userHeader.height/2+deleteUserBtn.height+20;
        this.centerSp.addChild(deleteUserBtn);

        deleteUserBtn.addTouchEvent();
        deleteUserBtn.addEventListener("click",this.deleteUser,this);
    }
    protected deleteUser(e){
        BaseModel.getInstance().eventRadio("deleteUser",{userId:this.model.userId,userName:this.model.openName});
    }
}