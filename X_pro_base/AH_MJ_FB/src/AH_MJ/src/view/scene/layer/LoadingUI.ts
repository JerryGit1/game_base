//资源加载
import Bitmap = egret.Bitmap;
class AH_LoadingUI extends BaseView {


    protected bar;
    protected star:egret.Bitmap;
    protected barWidth=Main.stageWidth*.565;
    protected type;
    protected system;
    public constructor(loadingType) {
        super();
        this.type = loadingType;
        this.createView();
    }
    protected createView():void {
        /*背景*/
        var bit:egret.Bitmap=new egret.Bitmap(RES.getRes("l_back"));
        bit.width = Main.stageWidth;
        bit.height = Main.stageHeight;
        this.addChild(bit);
        /*显示加载条背景*/
        var barBg=new egret.Bitmap(RES.getRes("l_barBg"));
        barBg.y=Main.stageHeight - barBg.height*5+10;
        barBg.x = Main.stageWidth/2 - barBg.width/2;
        this.barWidth = barBg.width-4;
        this.addChild(barBg);
        /*显示加载条*/
        this.bar = new egret.Bitmap(RES.getRes("l_buleBar"));
        this.bar.y = barBg.y +barBg.height-26;
        this.bar.x = Main.stageWidth/2-this.barWidth/2;
        this.bar.scale9Grid = new egret.Rectangle(43,2,260,18);
        this.bar.width = this.barWidth/5;
        this.addChild(this.bar);

        /*显示小星星*/
        this.star=this.CCenterBit("l_star");
        this.star.x=this.bar.x;
        this.star.y=this.bar.y+13;
        this.star.visible=false;
        egret.Tween.get(this.star,{loop:true}).to({alpha:.6},300).to({alpha:1},300);
        this.addChild(this.star);
        /*显示加载提示文本*/
        var barTxtImg = new egret.Bitmap(RES.getRes("l_text"));
        barTxtImg.anchorOffsetX = barTxtImg.width/2;
        barTxtImg.anchorOffsetY = barTxtImg.height/2;
        barTxtImg.x = Main.stageWidth/2;
        barTxtImg.y = this.bar.y+70;
        this.addChild(barTxtImg);

        //获取纹理
        var texture = RES.getRes("lizi_loading");
        var config = RES.getRes("lizi_loading_json");
        if(config){
            //创建 GravityParticleSystem
            this.system = new particle.GravityParticleSystem(texture, config);
            //启动粒子库
            this.system.start();
            //将例子系统添加到舞台
            this.addChildAt(this.system,3);
            this.system.y=this.star.y-10;
        }
    }
    public setProgress(current:number, total:number):void {
        var w=Math.floor((current/total)*(this.barWidth));
        // zpb 这么写 this.bar.width = w<=this.barWidth/5?this.barWidth/5:w; 会出现进度条和小星星不匹配
        if(w<this.star.width)w=this.star.width;
        this.bar.width=w;
        this.setStarPoint(w);
        if(this.system){
            this.system.x=this.star.x+40;
        }

    }
    /*设置小星星位置 其他项目需要在cp下重写 zpb*/
    protected setStarPoint(w){
        this.star.visible=true;
        this.star.x=this.bar.x+w-this.star.width/2+10;
    }
    public clear(){
        egret.Tween.removeTweens(this.star);
        this.system.stop(true);
        this.system=null;
    }

}
