/**
 * Created by 韩 on 2017/7/7.
 * 大厅按钮组
 */
class AH_H_btnGroupView extends BaseView{
    protected btnGroopBg :egret.Bitmap;//按钮组背景
    protected shareBtn: MyButton; //分享按钮
    protected achievementBtn: MyButton;//战绩按钮
    // private newsBtn: MyButton;//消息按钮 1.2.0舍弃
    protected helpBtn: MyButton;//帮助按钮
    protected replaceCreateRoomBtn: MyButton;//代开房间按钮
    protected setBtn: MyButton;//设置按钮
    // private feedbackBtn: MyButton;//反馈按钮 1.2.0舍弃
    protected model:HallModel;//大厅信息
    public constructor(model) {
        super();
        this.model = model;
        this.btnGroopBg = new egret.Bitmap(RES.getRes("h_btnGroupBg"));
        this.addChild(this.btnGroopBg);
        /*----------显示按钮--------*/
        this.addBtns();
    }
    protected addBtns(){
        this.btnGroopBg.y = Main.stageHeight - this.btnGroopBg.height;
        var  Y:number = this.btnGroopBg.y +this.btnGroopBg.height/2;//每个按钮所占据的高度
        var  X:number = this.btnGroopBg.width/7;//每个按钮所占据的宽度
        var initX=this.btnGroopBg.width+X/2-60;
        //显示按钮
       /* //反馈按钮
       1.2.0舍弃
        this.feedbackBtn = new MyButton("h_feedbackBtn");
        this.feedbackBtn.addTouchEvent();
        this.feedbackBtn.y = Y;
        this.feedbackBtn.x=X*6;
        this.feedbackBtn.addEventListener("click",function(){
            PopupLayer.getInstance().feedbackView();
        },this);
        this.addChild(this.feedbackBtn);*/
        //代开按钮
        this.replaceCreateRoomBtn = new MyButton("h_daikaiBtn");
        this.replaceCreateRoomBtn.addTouchEvent();
        this.replaceCreateRoomBtn.y = Y;
        this.replaceCreateRoomBtn.x =initX-X*5;
        this.replaceCreateRoomBtn.addEventListener("click",function(){
            // this.model.receiveCurrentReplaceInfo();//发起获取已代开房间信息
            PopupLayer.getInstance().hall_replaceCreateRoomView(this.model);
        },this);
        this.addChild(this.replaceCreateRoomBtn);

        //消息按钮
        /*1.2.0舍弃
        this.newsBtn = new MyButton("h_messageBtn");
        this.newsBtn.addTouchEvent();
        this.newsBtn.x = X ;
        this.newsBtn.y = Y;
        this.newsBtn.addEventListener("click",function(){
            PopupLayer.getInstance().newsView();
        },this);
        this.addChild(this.newsBtn);*/

        //战绩按钮
        this.achievementBtn = new MyButton("h_resultBtn");
        this.achievementBtn.addTouchEvent();
        this.achievementBtn.y = Y;
        this.achievementBtn.x=initX-X*4;
        this.achievementBtn.addEventListener("click",function(){
            PopupLayer.getInstance().achievementView(this.model);
        },this);
        this.addChild(this.achievementBtn);

        //分享按钮
        this.shareBtn = new MyButton("h_shareBtn");
        this.shareBtn.addTouchEvent();
        this.shareBtn.y = Y;
        this.shareBtn.x =initX-X*3;
        this.shareBtn.addEventListener("click",function(){
            PopupLayer.getInstance().addShareView();
        },this);
        this.addChild(this.shareBtn);

        //帮助按钮
        this.helpBtn = new MyButton("h_helpBtn");
        this.helpBtn.addTouchEvent();
        this.helpBtn.y = Y;
        this.helpBtn.x= initX-X*2;
        this.helpBtn.addEventListener("click",function(){
            PopupLayer.getInstance().addHelpView();
        },this);
        this.addChild(this.helpBtn);

        //设置按钮
        this.setBtn = new MyButton("h_setupBtn");
        this.setBtn.addTouchEvent();
        this.setBtn.y = Y;
        this.setBtn.x =initX-X;
        this.setBtn.addEventListener("click",function(){
            PopupLayer.getInstance().setView("dating");
        },this);
        this.addChild(this.setBtn);
    }
}
