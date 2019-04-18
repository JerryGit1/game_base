/**
 * Created by 韩 on 2017/7/7.
 * 用户界面系统公告
 */
class AH_H_noticeView extends BaseView{
    protected noticeTxt:egret.TextField;
    protected W;
   public constructor(){
       super();
       var bg = new egret.Bitmap(RES.getRes("h_notice"));
       this.W = bg.width;
       this.addChild(bg);
       var mask = new egret.Shape();
       mask.x = 68;
       mask.graphics.beginFill(0x000000);
       mask.graphics.drawRect(0,0,this.W*.87,bg.height);
       mask.graphics.endFill();
       this.addChild(mask);
       this.noticeTxt  = new egret.TextField();
       this.noticeTxt.size = 24;
       this.noticeTxt.stroke = 0.3;
       this.noticeTxt.strokeColor = 0x000000;
       this.noticeTxt.fontFamily = "微软雅黑";
       this.noticeTxt.y = 16;
       this.noticeTxt.textAlign = "center";
       this.addChild(this.noticeTxt);
       // 添加遮罩层
       this.noticeTxt.mask = mask;
    }
        // 让公告动起来
    public setTextPos(str:string){
        this.noticeTxt.text = str;
        this.noticeTxt.x = this.W;
        egret.Tween.removeTweens(this.noticeTxt);
        egret.Tween.get(this.noticeTxt,{loop:true}).to({x:-this.noticeTxt.textWidth},15000 + (str.length*100));
    }

    //设置多少次数后停止公告
    public setTextByTimes(str:string,num:number){
        this.noticeTxt.text = str;
        this.noticeTxt.x = this.W;
        var times = 0;
        egret.Tween.removeTweens(this.noticeTxt);
        egret.Tween.get(this.noticeTxt,{loop:true}).to({x:-this.noticeTxt.textWidth},15000 + (str.length*100)).call(function () {
            times ++;
            if(times >=num){
                egret.Tween.removeTweens(this.noticeTxt);
                this.visible = false;
            }
        },this);
    }
}