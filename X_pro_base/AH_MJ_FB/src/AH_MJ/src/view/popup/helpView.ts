/**
 * Created by TYQ on 2017/7/12.
 */
class AH_HelpView extends PopupBaseView{
    public constructor() {
        super();
        var bg:egret.Bitmap = this.addMsgBg();//"b_p_hitBg"
        // var x = bg.width - 27;
        // var y = 7;
        var x = bg.width-7;
        var y = 5;
        this.addCloseBtn(x,y);
        this.addTitle("h_gameMsg",this.centerSp.width/2,45);
        this.showHelpInfo("help_txt",this.centerSp,bg.width,bg.height);
        this.openAni();
    }
    protected showHelpInfo(str,sp,width,height){
        var shape1:egret.Shape;
        //实例化可滑动的显示数据框
        var messageSprite=new egret.Sprite();
        var text=RES.getRes(str);
        var messageTxt=new egret.TextField();
        messageSprite.addChild(messageTxt);
        messageTxt.size=20;
        messageTxt.textColor=0xFAFAFA;
        // messageTxt.stroke=2;
        // messageTxt.strokeColor=0xCB6F01;
        messageTxt.multiline=true;
        messageTxt.wordWrap = true;
        messageTxt.textAlign="left";
        messageTxt.verticalAlign="middle";
        messageTxt.width=sp.width*.84;
        messageTxt.lineSpacing=15;
        messageTxt.text=text;
        sp.addChild(messageSprite);
        //透明遮罩，为了整体能够滑动
        shape1=new egret.Shape();
        shape1.graphics.beginFill(0x1102cc,0);
        shape1.graphics.drawRect(0,0,messageTxt.width,(messageTxt.height+3));
        shape1.graphics.endFill();
        messageSprite.addChild(shape1);

        var myscrollView = new egret.ScrollView();
        myscrollView.setContent(messageSprite);
        myscrollView.bounces = false;
        myscrollView.horizontalScrollPolicy="off";
        sp.addChild(myscrollView);
        myscrollView.x=60;
        myscrollView.y=65;
        myscrollView.width=width*.9;
        myscrollView.height=height*.75;
    }

}