/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 * 弹框类 基础类
 */
class PopupBaseView extends BaseView{
    /*遮罩*/
    protected maskShape:egret.Shape;
    /*关闭按钮*/
    protected closeBtn:MyButton;
    /*中心区域*/
    protected centerSp:egret.Sprite;
    protected centerWidth=0;//2.0.3 zpb
    protected centerHeight=0;
    public constructor(isEmptyClose=true,showBackMask=true){
        super();
        if(showBackMask) this.addBackMask(isEmptyClose);
        this.centerSp=new egret.Sprite();
        this.centerSp.touchEnabled = true;
        this.addChild(this.centerSp);
    }
    /*----------------------基础视图-------------------------*/
    /*显示遮罩*/
    protected addBackMask(isEmptyClose){
        //遮罩
        this.maskShape = new egret.Shape();
        this.maskShape.graphics.beginFill(0x000000,.8);
        this.maskShape.graphics.drawRect(0,0,Main.stageWidth,Main.stageHeight);
        this.maskShape.graphics.endFill();
        this.maskShape.touchEnabled=true;
        this.addChild(this.maskShape);
        if(isEmptyClose){
            this.maskShape.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeClick,this);
        }
    }
    /**
     * 添加背景
     * 1.結算弹框背景
     * */
    protected addSettleBg(w?,h?:number,str="g_settle_bg1"){
        var bg=new egret.Bitmap(RES.getRes(str));
        bg.scale9Grid = new egret.Rectangle(3,12,48,74);
        bg.width = w || bg.width;
        bg.height = h || bg.height;
        // bg.scale9Grid = new egret.Rectangle(142,90,852,540);
        this.centerSp.addChild(bg);
        this.setCenterPoint(bg.width,bg.height);
        this.centerHeight=bg.height;
        this.centerWidth=bg.width;
        return bg;
    }
    /**
     * 添加通用背景
     * */
    protected addMsgBg(w?,h?:number,str="b_p_bg"){
        var bg=new egret.Bitmap(RES.getRes(str));
        bg.width = w || bg.width;
        bg.height = h || bg.height;
        if(str == "b_p_bg") bg.scale9Grid = new egret.Rectangle(106,58,636,352);
        if(str == "b_p_hitBg") bg.scale9Grid = new egret.Rectangle(24,60,646,279);
        this.centerSp.addChild(bg);
        this.setCenterPoint(bg.width,bg.height);
        this.centerHeight=bg.height;
        this.centerWidth=bg.width;
        return bg;
    }
    /*显示标题*/
    protected addTitle(str,x=null,y=null){
        var title=new egret.Bitmap(RES.getRes(str));
        title.anchorOffsetX = title.width/2;
        title.anchorOffsetY = title.height/2;
        if(!y)y=-this.centerSp.height*.48+this.centerSp.height/2+12;
        title.y=y;
        if(!x)x=this.centerSp.width/2;
        title.x=x;
        this.centerSp.addChild(title);
        return title;
    }
    // 文字类显示的标题
    protected addStrTitle(str,x=null,y=null){
        var title=new egret.TextField();
        title.textFlow = (new egret.HtmlTextParser()).parse(str);
        title.size = 30;
        title.fontFamily = "微软雅黑";
        title.stroke = 1;
        title.strokeColor = 0xAB4B05;
        title.anchorOffsetX = title.width/2;
        title.anchorOffsetY = title.height/2;
        if(!y)y=title.height*2;
        title.y=y;
        if(!x)x=this.centerSp.width/2;
        title.x=x;
        this.centerSp.addChild(title);
        return title;
    }
    // 带有卷轴的弹框
    protected addPopupText(str,w,h){
        var tt = new egret.TextField();
        tt.textColor = 0xffffff;
        tt.lineSpacing=10;
        tt.width=w*.6;
        tt.height=h*.6;
        tt.fontFamily = "微软雅黑";
        tt.size = 23;
        tt.text = str;
        tt.x = w*.1;
        tt.y = h*.15;
        this.centerSp.addChild(tt);
    }
    /*设置中心区域中心*/
    protected setCenterPoint(w,h){
        this.centerSp.anchorOffsetX=w/2;
        this.centerSp.anchorOffsetY=h/2;
        this.centerSp.x=Main.stageWidth/2;
        this.centerSp.y=Main.stageHeight/2;
    }
    /*显示关闭按钮*/
    protected addCloseBtn(x,y,textureName="b_p_closeBtn"){
        this.closeBtn=new MyButton(textureName);
        this.centerSp.addChild(this.closeBtn);
        this.closeBtn.addTouchEvent();
        this.closeBtn.addEventListener("click",this.closeClick,this);
        this.closeBtn.x=x;
        this.closeBtn.y=y;
    }

    /*---------------动画-----------------*/
    protected openAni(){
        this.centerSp.scaleX=this.centerSp.scaleY=.8;
        this.centerSp.alpha=0;
        egret.Tween.get(this.centerSp).to({scaleX:1.1,scaleY:1.1,alpha:1},200).to({scaleX:.95,scaleY:.95},100).to({scaleX:1,scaleY:1},100);
    }
    /*---------------事件--------------------*/
    /*关闭按钮事件*/
    protected closeClick(){
        this.dispatchEvent(new egret.Event("close"));
    }
    public clear(){
        if(this.closeBtn){
            this.closeBtn.clear();
            this.closeBtn.removeEventListener("click",this.closeClick,this);
        }
    }
}
