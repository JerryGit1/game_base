/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 */
class AH_Game_user3CardsView extends Game_userCardView{

    public constructor(model){
        super(model);
        this.playRow=10;/*桌牌列数*/
        this.playCol=2;/*行数*/
        //手牌大小
        this.stopCardWidth=Math.floor((Main.stageWidth-(BaseModel.USER_CARD_WIDTH*6))/15);
        this.stopCardDis=Math.floor(this.stopCardWidth*.82);//手牌间距
        //桌牌大小
        this.playCardWidth=Math.floor(Main.stageWidth/21);
        this.playCardDis = Math.floor(this.playCardWidth*.8);
        //手牌起始坐标
        this.stopInitPoint=new egret.Point(Main.stageWidth-310,190);
        //打出去的牌起始坐标
        this.playInitPoint=new egret.Point(Main.stageWidth/2+(this.playRow-1)*this.playCardDis/2,Main.stageHeight/2-BaseModel.USER_CARD_WIDTH*1.5);
        //吃碰杠的坐标
        this.model.cpghAniPoint = new egret.Point(Main.stageWidth/2,Main.stageHeight/2-150);

        //出牌动画坐标 1号玩家 回放时候需要
        if(BaseModel.PLAYBACK_MODEL){
            this.model.pHandSPoint.x=Main.stageWidth/2;
            this.model.pHandSPoint.y=this.stopInitPoint.y;
        }else{
            //正常模式下
            //出牌动画坐标
            this.model.pHandSPoint.x=this.stopInitPoint.x-this.stopCardWidth*13/2;
            this.model.pHandSPoint.y=this.stopInitPoint.y;
        }
    }
    /*设置坐标*/
    public setPoint(point){
        this.playInitPoint.y=Main.stageHeight/2-(point.y-Main.stageHeight/2)-10;
        this.stopInitPoint.y=this.playInitPoint.y-this.playCardWidth*this.playCol-this.stopCardWidth/2;
        if(this.stopInitPoint.y<=125){
            this.stopInitPoint.y=125;
        }else if(this.stopInitPoint.y>180){
            this.stopInitPoint.y=180;
        }
        super.setPoint();
    }
    /*创建桌面牌*/
    public createPlayCardList(){
        var i:any,x:number,y:number,card,len=this.playRow*this.playCol+5;
        for(i=0;i<len;i++){
            card=new Game_cardView("cpMG_3",this.playCardWidth);
            card.h=Math.floor(card.h*.65);
            x=-(i%this.playRow);
            y=-Math.floor(i/this.playRow);
            y*=card.h;
            x*=this.playCardDis;
            card.x=x+this.playInitPoint.x;
            card.y=y+this.playInitPoint.y;
            this.addChildAt(card,0);
            card.setNewCard(null);
            this.playCardViews.push(card);
        }
    }
    /*更新手牌数据*/
    public updateStopCardList(){
        //是否翻开牌
        var _isFaiPai=BaseModel.PLAYBACK_MODEL;
        /*先设置吃碰杠*/
        var i,cpgView,x=this.stopInitPoint.x,cardView:Game_cardView;
        for(i in this.model.cpgBoard){
            cpgView=this.createCPGCardView(this.cpgCardViews[i],this.model.cpgBoard[i],this.stopCardWidth*.9,0,_isFaiPai);
            //设置坐标
            cpgView.x=x;
            cpgView.y=this.stopInitPoint.y-cpgView.h/2;
            x-=cpgView.w;
            x-=this.cpgCardDis;//牌间距
            this.addChildAt(cpgView,0);
        }
        x-=this.cpgCardDis*2;//牌间距
        this.setOntherCPGCard();/*以防万一*/

        /*更新手牌*/
        this.clearStopCard();
        for(i in this.model.stopBoard){
            cardView=this.createStopCardView(this.model.stopBoard[i],false,this.stopCardWidth,_isFaiPai);
            this.addChildAt(cardView,0);
            cardView.x=x;
            cardView.y=this.stopInitPoint.y-cardView.h/2;
            //系统最新发的手牌
            if(this.model.stopBoard[i]._isSystemCard){
                cardView.x=x-this.stopCardWidth/3;
                cardView.alpha=0;
                egret.Tween.get(cardView).to({alpha:1},300);
                this.model.stopBoard[i]._isSystemCard=false;
            }
            x-=this.stopCardDis;
        }
    }

}