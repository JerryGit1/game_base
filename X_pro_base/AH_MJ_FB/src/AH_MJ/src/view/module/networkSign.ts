/**
 * Created by Tang on 2017/12/19.
 * 网络质量标识
 */
class AH_NetWorkSign extends BaseView{
    protected sign:egret.Bitmap;
    protected curLevel:number=1;
    protected badSignNum:number=0;
    public constructor(){
        super();
        this.addBg();
    }
    //背景
    protected addBg(){
        var bg = this.CCenterBit("g_network_bg");
        this.addChild(bg);

        //初始网络质量
        this.sign = this.CCenterBit("g_network_level"+1);
        this.addChild(this.sign);
    }
    //网络质量
    public changeSign(info){
        var l = Number(info.level);
        if(l != this.curLevel){
            this.curLevel = l;
            this.sign.texture = RES.getRes("g_network_level"+info.level);

            if(l == 3){
                egret.Tween.get(this.sign,{loop:true}).to({alpha:.5},500).to({alpha:1},500);
                this.badSignNum++
            }else{
                egret.Tween.removeTweens(this.sign);
            }
        }else if(this.curLevel==3){
            this.badSignNum ++;
            if(this.badSignNum ==5){
                this.badSignNum = 0;
                BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_playerBadNet,info.userId);
            }
        }
    }
}