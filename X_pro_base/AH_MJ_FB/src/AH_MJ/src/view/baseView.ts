/**
 * Created by 伟大的周鹏斌大王 on 2017/7/6.
 *
 * 基础视图类 包括 scene view popup
 */
class BaseView extends egret.Sprite{

    public constructor(){
        super();
    }
    /*调整y坐标适配*/
    public setPointY(sp){
        sp.y=sp.y/(Main.stageHeight/640);
    }
    /*创建一个居中的bit对象*/
    public CCenterBit(str,_isCenter=true){
        var bit=new egret.Bitmap(RES.getRes(str));
        if(_isCenter){
            bit.anchorOffsetX=bit.width/2;
            bit.anchorOffsetY=bit.height/2;
        }
        return bit;
    }
    /*清理*/
    public clear(){

    }
}