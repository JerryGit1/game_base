/**
 * Created by TYQ on 2017/7/7.
 * 小提示框
 * 修改：韩月辉 2017
 */
class AH_Hint_View extends PopupBaseView{
    protected str:string;
    protected backFunc:any;
    protected confirmBtn:MyButton;
    protected runBackFunc:any;//不管什么情况都执行的回调
    //_isAddCloseBtn 是否显示关闭按钮 true false;
    // type 默认 min 可选值 max
    public constructor(str,backFunc=null,_isAddCloseBtn =true,type="min",runBackFunc=null){
        super(false);
        this.str = str;
        this.runBackFunc = runBackFunc;
        //=========> tyq 修改
        var bg:egret.Bitmap;
        if(type =="max"){
            bg = this.addMsgBg(Main.stageWidth*.8,Main.stageHeight*.7);//,"b_p_hitBg"
        }else{
            bg = this.addMsgBg(Main.stageWidth*.6,Main.stageHeight*.6);//,"b_p_hitBg";
        }
        //tyq 修改<===========
        this.addTitle("hint_title",this.centerSp.width/2,45);
        var x = bg.width - 27;
        var y = 7;
        if (_isAddCloseBtn )this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addText(bg.width,bg.height);

        if(backFunc){
            this.backFunc = backFunc;
            this.addCurrentBtn(bg.width,bg.height);
        }
        this.openAni();
    }
    protected closeClick(){
        super.closeClick();
        if(this.runBackFunc) this.runBackFunc();
    }
    protected addText(w,h){
        var tt = new egret.TextField();
        tt.textColor = 0xffffff;

        tt.lineSpacing=10;
        tt.verticalAlign = "middle";
        tt.fontFamily = "微软雅黑";
        tt.size = 30;
        tt.textFlow = (new egret.HtmlTextParser()).parser(this.str);
        if(tt.width<=w*.75){
            tt.textAlign = "center";
        }else{
            tt.textAlign = "left";
            tt.width=w*.75;
        }
        tt.multiline = true;
        tt.anchorOffsetX = tt.width/2;
        tt.anchorOffsetY = tt.height/2;
        tt.x = this.centerSp.width/2;
        tt.y = this.centerSp.height/2;
        this.centerSp.addChild(tt);
    }
    protected addCurrentBtn(w,h){
        this.confirmBtn = new MyButton("h_sureBtn");
        this.confirmBtn.x = w/2;
        this.confirmBtn.y = h*0.8;
        this.centerSp.addChild(this.confirmBtn);
        this.confirmBtn.addTouchEvent();
        this.confirmBtn.addEventListener("click",this.confirmBtnClick,this);
    }
    protected confirmBtnClick(){
        this.dispatchEvent(new egret.Event("close"));
        if(this.backFunc) this.backFunc();
    }

    public clear(){
        super.clear();
        if(this.confirmBtn){
            this.confirmBtn.clear();
            this.confirmBtn.removeEventListener("click",this.confirmBtnClick,this);
        }
    }
}