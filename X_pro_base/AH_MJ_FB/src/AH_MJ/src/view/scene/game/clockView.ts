/**
 * Created by 周鹏斌大王 on 2017/7/16.
 *
 * 风向组件
 */
class AH_Game_clockView extends BaseView{
    //东南西北指向背景
    protected bg:egret.Bitmap;
    //高亮方向
    protected hand:egret.Bitmap;
    public constructor(){
        super();
        this.bg=this.CCenterBit("g_clockBg1");
        this.addChild(this.bg);
        this.hand=new egret.Bitmap();
        this.hand.texture = RES.getRes("g_clock_east");
        this.hand.anchorOffsetX=this.hand.width/2;
        this.hand.anchorOffsetY=this.hand.height/2;
        this.addChild(this.hand);
    }
    /*更新风向旋转 不同玩家风向不同*/
    public setRotation(position){
        this.bg.texture = RES.getRes("g_clockBg"+position);
    }
    //更新出牌指针方向
    public updateHand(position,hand){//position:用户所在的方位 hand 当前出牌的用户
        switch (position){
            case 1:
                this.hand.texture = RES.getRes("g_clock_east"+hand);
                break;
            case 2:
                this.hand.texture = RES.getRes("g_clock_south"+hand);
                break;
            case 3:
                this.hand.texture = RES.getRes("g_clock_west"+hand);
                break;
            case 4:
                this.hand.texture = RES.getRes("g_clock_north"+hand);
                break;
        }
    }
    //剩余2秒时 闪烁动画
    public twinkleAni(bloor,playCountdown){
        egret.Tween.get(this.hand).to({"alpha":0.7},200).wait(100).to({"alpha":1},200);//,{"loop":true}
        // 韩月辉
        if(bloor&&playCountdown==3){
            SoundModel.playSoundEffect("timeup");
        }
    }
}
