var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/7.
 * 大厅按钮组
 */
var AH_H_btnGroupView = (function (_super) {
    __extends(AH_H_btnGroupView, _super);
    function AH_H_btnGroupView(model) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.btnGroopBg = new egret.Bitmap(RES.getRes("h_btnGroupBg"));
        _this.addChild(_this.btnGroopBg);
        /*----------显示按钮--------*/
        _this.addBtns();
        return _this;
    }
    AH_H_btnGroupView.prototype.addBtns = function () {
        this.btnGroopBg.y = Main.stageHeight - this.btnGroopBg.height;
        var Y = this.btnGroopBg.y + this.btnGroopBg.height / 2; //每个按钮所占据的高度
        var X = this.btnGroopBg.width / 7; //每个按钮所占据的宽度
        var initX = this.btnGroopBg.width + X / 2;
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
        this.replaceCreateRoomBtn.x = initX - X * 5;
        this.replaceCreateRoomBtn.addEventListener("click", function () {
            // this.model.receiveCurrentReplaceInfo();//发起获取已代开房间信息
            PopupLayer.getInstance().hall_replaceCreateRoomView(this.model);
        }, this);
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
        this.achievementBtn.x = initX - X * 4;
        this.achievementBtn.addEventListener("click", function () {
            BaseModel.getInstance().eventRadio("getRecordInfo");
        }, this);
        this.addChild(this.achievementBtn);
        //分享按钮
        this.shareBtn = new MyButton("h_shareBtn");
        this.shareBtn.addTouchEvent();
        this.shareBtn.y = Y;
        this.shareBtn.x = initX - X * 3;
        this.shareBtn.addEventListener("click", function () {
            PopupLayer.getInstance().addShareView();
        }, this);
        this.addChild(this.shareBtn);
        //帮助按钮
        this.helpBtn = new MyButton("h_helpBtn");
        this.helpBtn.addTouchEvent();
        this.helpBtn.y = Y;
        this.helpBtn.x = initX - X * 2;
        this.helpBtn.addEventListener("click", function () {
            PopupLayer.getInstance().addHelpView();
        }, this);
        this.addChild(this.helpBtn);
        //设置按钮
        this.setBtn = new MyButton("h_setupBtn");
        this.setBtn.addTouchEvent();
        this.setBtn.y = Y;
        this.setBtn.x = initX - X;
        this.setBtn.addEventListener("click", function () {
            PopupLayer.getInstance().setView("dating");
        }, this);
        this.addChild(this.setBtn);
    };
    return AH_H_btnGroupView;
}(BaseView));
__reflect(AH_H_btnGroupView.prototype, "AH_H_btnGroupView");
