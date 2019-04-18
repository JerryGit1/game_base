/**
 * 创建者 伟大的周鹏斌大王  on 2017/10/25.
 */
class LoadAni2View extends egret.Sprite{


    public constructor(bit){
        super();
        bit=new egret.Bitmap(bit);
        var renderTexture:egret.RenderTexture;
        var w=50,row=Math.ceil(Main.stageWidth/w),col=Math.ceil(Main.stageHeight/w);
        for(var i=0;i<row;i++){
            for(var s=0;s<col;s++){
                renderTexture= new egret.RenderTexture();
                renderTexture.drawToTexture(bit,new egret.Rectangle(i*w,s*w,w,w));
                var pic=new egret.Bitmap(renderTexture);
                this.addChild(pic);
                pic.anchorOffsetX=pic.anchorOffsetY=w/2;
                pic.x=i*w+w/2;
                pic.y=s*w+w/2;
                var tween=egret.Tween.get(pic).wait((i+s)*40).to({scaleX:1.4,scaleY:1.4},200).to({scaleX:.3,scaleY:.3},200).to({rotation:(i+s)*1,scaleX:0,scaleY:0,alpha:0},200);
                if(i==row-1&&s==col-1){
                    tween.call(function () {
                        this.parent.removeChild(this);
                    },this);
                }
            }
        }
    }
}