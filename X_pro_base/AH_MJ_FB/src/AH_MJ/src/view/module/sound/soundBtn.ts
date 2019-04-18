/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
class SoundBtn extends BaseView{

    protected btn:egret.Bitmap;
    protected closeTexture;
    protected openTexture;
    protected bar:egret.Shape;
    protected backBg:egret.Shape;
    protected volumeBtn:egret.Bitmap;
    protected barWidth;
    protected moveBeginX;//世界坐标下的移动起始位置
    protected currentX;//移动目标当前实际位置
    public constructor(titleTexture,openTexture,closeTexture,volume){
        super();
        this.openTexture=openTexture;
        this.closeTexture=closeTexture;
        /*文字标题*/
        var title=new egret.Bitmap(RES.getRes(titleTexture));
        title.x = -86;
        this.addChild(title);
        /*加载条背景*/
        var barBg=new egret.Bitmap(RES.getRes("h_progressBarBg"));
        barBg.x = 20;
        barBg.y = 2;
        this.addChild(barBg);
        this.barWidth = barBg.width;
        this.backBg=new egret.Shape();
        this.backBg.graphics.beginFill(0x00ff00,0);
        this.backBg.graphics.drawRect(barBg.x,barBg.y-barBg.height*3/2,barBg.width,barBg.height*3);
        this.backBg.graphics.endFill();
        this.addChildAt(this.backBg,0);
        this.backBg.touchEnabled=true;

        /*加载条*/
        this.bar=new egret.Shape();
        this.bar.x=22;
        this.bar.y = 8;
        this.setProgress(volume*this.barWidth);
        this.addChild(this.bar);
        /*音量按钮*/
        this.volumeBtn=new egret.Bitmap(RES.getRes("h_progressBtn"));
        this.volumeBtn.x=-2+volume*this.barWidth;
        this.addChild(this.volumeBtn);
        this.backBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.changeVolumeBegin,this);
        /*开关按钮*/
        this.btn=new egret.Bitmap();
        this.btn.touchEnabled = true;
        this.addChild(this.btn);
        this.btn.x=440;
        this.btn.y=-10;
        this.changTexture();
        this.btn.addEventListener(egret.TouchEvent.TOUCH_END,this.click,this);
    }
    protected click(e:egret.TouchEvent){
        this.changTexture();
    }
    //改变纹理
    protected changTexture(_is=null){
        if(_is!=null)this.bar.visible=this.volumeBtn.visible=_is;
    }
    private changeVolumeBegin(e:egret.TouchEvent){
        this.changeEnd(null);
        this.backBg.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.changeVolume,this);
        this.backBg.addEventListener(egret.TouchEvent.TOUCH_END,this.changeEnd,this);
        this.moveBeginX = e.stageX;
        this.currentX=e.localX;
        this.changeVolume(e);
    }
    //改变音量
    protected changeVolume(e:egret.TouchEvent){
        var moveTarget = this.volumeBtn;
        var X1 = this.currentX+Math.floor(e.stageX- this.moveBeginX);
        if(X1 >=-2 && X1 <358){
            moveTarget.x = X1;
        }else{
            if(X1<-2) moveTarget.x = -2;
            if(X1>358) moveTarget.x = 358;
        }
        var current = moveTarget.x+2;
        var volume = current/this.barWidth;
        this.setVolume(volume);
        this.setProgress(current);
    }
    protected changeEnd(e){
        this.backBg.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.changeVolume,this);
        this.backBg.removeEventListener(egret.TouchEvent.TOUCH_END,this.changeEnd,this);
    }
    //设置音量
    protected setVolume(volume){

    }
    //设置进度条宽度
    public setProgress(current:number){
        var matrix:egret.Matrix = new egret.Matrix();
        matrix.createGradientBox(current,20,90);
        this.bar.graphics.clear();
        this.bar.graphics.beginGradientFill(egret.GradientType.LINEAR,[0xfcf430,0xf5a62d,0xf06228],[1,1,1],[0,125,255],matrix);
        this.bar.graphics.drawRoundRect(0, -1,current-2,20,20,20);
    }
    public clear(){
        this.changeEnd(null);
        this.backBg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.changeVolumeBegin,this);
    }
}