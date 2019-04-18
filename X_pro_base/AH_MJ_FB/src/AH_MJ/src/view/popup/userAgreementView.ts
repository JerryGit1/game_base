/**
 * Created by 韩 on 2017/7/26.
 * 用户协议弹框
 */
class AH_H_userAgreementView extends PopupBaseView{
    protected refuseBtn:MyButton;
    protected agreeBtn:MyButton;
    //弹框背景相对于舞台的缩放比例
    protected Scale = .8;
    public constructor() {
        super(false);
        var H = Main.stageHeight*this.Scale;
        var bg:egret.Bitmap = this.addMsgBg(null,H);//"b_p_bg",
        var x = bg.width-70;
        var y = 90*this.Scale;
        this.addStrTitle("用户协议");
        this.openAni();
        var content = new egret.DisplayObjectContainer();
        var contentText = new egret.TextField();
        contentText.width = bg.width*.85;
        contentText.wordWrap = true;
        contentText.lineSpacing = 15;
        contentText.size = 20;
        // contentText.stroke = 0.5;
        contentText.textColor = 0xffffff;
        // contentText.strokeColor = 0x000000;
        contentText.fontFamily = "微软雅黑";

        contentText.text = RES.getRes("userAgreement_txt");
        content.addChild(contentText);
        var myscrollView:egret.ScrollView = new egret.ScrollView();
        myscrollView.horizontalScrollPolicy = "off";
        myscrollView.setContent(content);
        myscrollView.width = bg.width*.9;
        myscrollView.height = bg.height*.6;
        myscrollView.y = 100;
        myscrollView.x = 50;
        this.centerSp.addChild(myscrollView);

        // // 拒绝按钮
        // this.refuseBtn = new MyButton("refuseBtn");
        // this.refuseBtn.x = bg.width/2 - this.refuseBtn.width/2;
        // this.refuseBtn.y = (bg.height - this.refuseBtn.height) - 20;
        // this.refuseBtn.addTouchEvent();
        // this.refuseBtn.addEventListener("click",function () {
        //     //关闭弹窗
        //     this.closeClick();
        // },this);
        // this.centerSp.addChild(this.refuseBtn);

        // 同意按钮
        this.agreeBtn = new MyButton("agreeBtn");
        this.agreeBtn.x = bg.width/2;
        this.agreeBtn.y = (bg.height - this.agreeBtn.height) - 20;

        this.agreeBtn.addTouchEvent();
        this.agreeBtn.addEventListener("click",function () {
            BaseModel.getInstance().eventRadio("consentUA");
            this.closeClick();
        },this);
        this.centerSp.addChild(this.agreeBtn);

    }
}