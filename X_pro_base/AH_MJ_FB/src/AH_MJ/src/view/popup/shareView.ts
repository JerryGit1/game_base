/**
 * Created by TYQ on 2017/7/7.
 * 分享弹框
 */
class AH_ShareView extends PopupBaseView{
    public constructor(){
        super();
        var bg:egret.Bitmap = this.addMsgBg(null,null,"b_shareInfo");
        bg.touchEnabled = true;
        bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeClick,this);
    }
}