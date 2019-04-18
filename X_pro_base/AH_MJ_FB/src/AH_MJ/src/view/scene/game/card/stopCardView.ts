/**
 * Created by 伟大的周鹏斌大王 on 2017/7/20.
 * 玩家手牌 类
 */
class AH_Game_stopCardView extends Game_cardView{


    /**
     * 状态
     * 0 等待操作状态
     * 1 点击激活状态
     * 2 拖动状态
     * 3邊界内
     * */
    protected _currentType=0;
    /*初始坐标*/
    public initY=0;
    public initX=0;
    /*是否超出边界*/
    public _isOut=false;
    public constructor(bgType,w,_isTouch){
        super(bgType,w);
        if(_isTouch){
            this.bg.touchEnabled=true;
        }
    }
    get currentType(): number {
        return this._currentType;
    }

    set currentType(value: number) {
        if(this._currentType!=value||this._isOut){
            this._currentType = value;
            //起立动画
            egret.Tween.removeTweens(this);
            if(this._currentType==1){
                egret.Tween.get(this).to({y:this.initY-BaseModel.USER_CARD_WIDTH*.3,x:this.initX},100);
            }else if(this._currentType==0){
                egret.Tween.get(this).to({y:this.initY,x:this.initX},50);
            }
        }
    }
}