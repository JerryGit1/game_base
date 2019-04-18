/**
 * Created by 韩 on 2017/7/13.
 * 单选样式
 * selected选中的图标√
 * x,y,w,h 坐标x,y宽高
 */
class AH_H_selectBtn extends BaseView{
    protected selected:egret.Bitmap;
    protected make;
    protected lableName:egret.Bitmap;
    public constructor(make:boolean,selected,x,y,w,h,lable){
        super();
        this.selected = new egret.Bitmap();
        this.selected.texture = RES.getRes(selected);
        this.x = x;
        this.y = y + 6;
        this.width = w;
        this.height = h;
        this.lableName = new egret.Bitmap(RES.getRes(lable));
        this.lableName.x = 40;
        this.lableName.y = 6;
        this.addChild(this.lableName);
        this.graphics.beginFill(0xffffff,0);
        this.graphics.drawRect(0,0,w,h);
        this.graphics.endFill();
        this.touchEnabled = true;
        this.make = make;
        this.addEventListener("touchTap",this.touchTap,this);
        this.addChild(this.selected);
    }
    /*点击*/
    protected touchTap(e){
        this.dispatchEvent(new egret.Event("selected"));
    }
    /*改变状态*/
    public setTexture(str){
        this.selected.texture = RES.getRes(str);
    }
    public setPos(x,y){
        this.selected.x = x;
        this.selected.y = y;
    }
}
