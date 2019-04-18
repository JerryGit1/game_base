/**
 * Created by 韩 on 2017/7/10.
 * 消息弹框
 */
class AH_H_news extends PopupBaseView{
    protected systemNewsBtn:MyButton;
    protected contactUsBtn:MyButton;
    protected myscrollView:egret.ScrollView = new egret.ScrollView();
    protected textSp:egret.Sprite;
    public str1:String = "";
    protected bg = this.addMsgBg(null,Main.stageHeight*.7);
    public constructor(){
        super();
        // 接收到系统消息
        BaseModel.getInstance().addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_managerList,this.setManagerListInfo.bind(this));
        // 接收到 联系我们消息
        BaseModel.getInstance().addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_contactUs,this.setContactUsInfo.bind(this));

        var bg:egret.Bitmap = this.addMsgBg(null,Main.stageHeight*.7);//"b_p_hitBg",
        // var x = bg.width-70;
        // var y = 6;
        var x = bg.width-7;
        var y = 5;
        this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addTitle("h_news_title");

        // 系统消息按钮
        this.systemNewsBtn = new MyButton("h_systemNewsBtn");
        this.systemNewsBtn.x = bg.width/2 + this.systemNewsBtn.width/2;
        this.systemNewsBtn.y = 4;
        this.systemNewsBtn.addTouchEvent();
        this.systemNewsBtn.addEventListener("click",function () {
            this.contactUsBtn.changTexture("h_ContactUsBtn");
            this.systemNewsBtn.changTexture("h_systemNewsBtn_selected");
            //广播获取系统消息
            BaseModel.getInstance().eventRadio("getNewsInfo");
        },this);
        this.centerSp.addChild(this.systemNewsBtn);
        //联系我们按钮
        this.contactUsBtn = new MyButton("h_ContactUsBtn_select");
        this.contactUsBtn.x = bg.width/2 - this.contactUsBtn.width/2;
        this.contactUsBtn.y = 4;
        this.contactUsBtn.addTouchEvent();
        this.contactUsBtn.addEventListener("click",function () {
            this.contactUsBtn.changTexture("h_ContactUsBtn_select");
            this.systemNewsBtn.changTexture("h_systemNewsBtn");
            //广播获取联系我们消息
            BaseModel.getInstance().eventRadio("getUsInfo");
        },this);
        this.centerSp.addChild(this.contactUsBtn);
        this.openAni();
        this.textSp=new egret.Sprite();
        this.centerSp.addChild(this.textSp);


        this.myscrollView.setContent(this.textSp);
        this.myscrollView.width = bg.width-140;
        this.myscrollView.height = bg.height - 125;
        this.myscrollView.horizontalScrollPolicy="off";
        this.myscrollView.x = 70;
        this.myscrollView.y = 80;
        this.centerSp.addChild(this.myscrollView);

        //广播获取系统消息
        BaseModel.getInstance().eventRadio("getUsInfo");
    }
    /*接收到系统消息数据*/
    protected setManagerListInfo(info){
        //清空文本
        this.clearTxt();
        var data = info.infos;
        var y=0;
        for(var i in data){
            var txt=this.addTxt( data[i]);
            txt.y=y;
            y+=txt.textHeight+10;
        }
    }
    /*接收到联系我们数据*/
    protected setContactUsInfo(info){
        //清空文本
        this.clearTxt();
        this.addTxt(info.connectionInfo);
    }
    /*添加一条记录*/
    protected addTxt(str){
        var txt=new egret.TextField();
        txt.width = this.bg.width *.8;
        txt.text=str;
        txt.lineSpacing = 10;
        txt.size=30;
        txt.textColor = 0xfafafa;
        txt.wordWrap = true;
        txt.verticalAlign = "middle";
        // txt.strokeColor = 0x000000;
        txt.fontFamily = "微软雅黑";
        // txt.stroke = 2;
        this.textSp.addChild(txt);
        return txt;
    }


    /*清空文本*/
    protected clearTxt(){
        var len=this.textSp.numChildren;
        for(var i=0;i<len;i++){
            this.textSp.removeChildAt(0);
        }
    }


    public clear(){
        //移除广播事件
        // 接收到系统消息
        BaseModel.getInstance().clearEvent(this.setManagerListInfo);
        // 接收到 联系我们消息
        BaseModel.getInstance().clearEvent(this.setContactUsInfo);
    }

}
