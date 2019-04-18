/**
 * 创建者 伟大的周鹏斌大王  on 2017/10/25.
 */
class LoadAni1View extends egret.Sprite{


    public constructor(bit){
        super();
        bit=new egret.Bitmap(bit);
        var renderTexture:egret.RenderTexture;
        var len=60;
        var w=Math.round(Main.stageWidth/len);
        for(var i=0;i<len;i++){
            renderTexture= new egret.RenderTexture();
            renderTexture.drawToTexture(bit,new egret.Rectangle(i*w,0,w,Main.stageHeight));
            var pic=new egret.Bitmap(renderTexture);
            this.addChild(pic);
            pic.x=i*w;
            var tween=egret.Tween.get(pic).wait(i*10).to({alpha:0},200);
            if(i==len-1){
                tween.call(function () {
                    this.parent.removeChild(this);
                },this);
            }
        }
    }
}