/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 */
class AH_Game_user2CardsView extends Game_userCardView{

    public constructor(model){
        super(model);
        this.playRow=11;/*桌牌列数*/
        this.playCol=2;
        this.cpgCardDis=20;
        this.stopCardWidth=Math.floor((Main.stageHeight-(BaseModel.USER_CARD_WIDTH*3))/8);
        this.stopCardDis = Math.floor(this.stopCardWidth*.45);
        this.stopCardSkewing =  Math.floor(this.stopCardWidth*.9)/10;
        //手牌起始坐标
        this.stopInitPoint=new egret.Point(Main.stageWidth-80,Main.stageHeight-BaseModel.USER_CARD_WIDTH*2.7);
        //桌牌大小
        this.playInitPoint=new egret.Point(Main.stageWidth/2+140,Main.stageHeight/2+110);
        this.playCardWidth=Math.floor(Main.stageWidth/20);
        this.playCardDis=Math.floor(this.playCardWidth*.8);
        //吃碰杠的坐标
        this.model.cpghAniPoint = new egret.Point(Main.stageWidth-200,Main.stageHeight/2);
        //出牌动画坐标

        //出牌动画坐标 1号玩家 回放时候需要
        if(BaseModel.PLAYBACK_MODEL){
            this.model.pHandSPoint.x=this.stopInitPoint.x;
            this.model.pHandSPoint.y=Main.stageHeight/2;
        }else{
            //正常模式下
            this.model.pHandSPoint.x=this.stopInitPoint.x;
            this.model.pHandSPoint.y=this.stopInitPoint.y-this.stopCardWidth*13/2;
        }
    }
    /*设置坐标*/
    public setPoint(y,x,w,maxDis):any{
        this.playInitPoint.y=y+w/2;
        this.playInitPoint.x=x+w;
        this.playCardDis= Math.floor(maxDis/this.playRow);
        this.playCardWidth=Math.floor(this.playCardDis/.52);
        this.playCardSkewing = Math.floor(this.playCardDis*.2)+.2;
        super.setPoint();

        return {x:(this.playInitPoint.x-this.playCardSkewing*this.playRow)-Main.stageWidth/2,y:this.playInitPoint.y-this.playCardDis*this.playRow};

    }
    /*创建桌面牌*/
    public createPlayCardList(){
        var i:any,x:number,y:number,card,col,len=this.playRow*this.playCol+3;
        for(i=0;i<len;i++){
            card=new Game_cardView("cpMG_2",this.playCardWidth);
            card.setPlayCardRotation(2);
            col = (i%this.playRow);
            var row=Math.floor(i/this.playRow);
            if(row>1){
                row=1;
                col=(col+this.playRow);
            }
            y=-col;
            x=row;
            x*=Math.floor(card.h*.8);
            y*=this.playCardDis;
            card.x=x+this.playInitPoint.x-col*this.playCardSkewing;
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
        if(_isFaiPai){
            this.stopCardSkewing =  Math.floor(this.stopCardWidth)/11;
            this.stopCardDis = Math.floor(this.stopCardWidth*.5);
        }
        /*先设置吃碰杠*/
        var r,i,cpgView,y=this.stopInitPoint.y,cardView:Game_cardView,x=this.stopInitPoint.x;
        var w=Math.floor(this.stopCardWidth*.9);
        if(this.model.cpgBoard.length!=0){
            y=this.stopInitPoint.y+BaseModel.USER_CARD_WIDTH;
        }
        for(i in this.model.cpgBoard){
            cpgView=this.createCPGCardView(this.cpgCardViews[i],this.model.cpgBoard[i],w,this.stopCardSkewing,_isFaiPai);
            //设置坐标
            cpgView.y=y;
            cpgView.x=x;
            y-=cpgView.w;
            y-=this.cpgCardDis;//牌间距
            x-=cpgView.maxSkewing;//偏移量
            // w-=3;
            this.addChildAt(cpgView,0);
        }
        this.setOntherCPGCard();/*以防万一*/
        /*更新手牌*/
        this.clearStopCard();
        // y-=this.cpgCardDis;//牌间距
        for(i in this.model.stopBoard){
            cardView=this.createStopCardView(this.model.stopBoard[i],false,this.stopCardWidth,_isFaiPai);
            this.addChildAt(cardView,0);
            cardView.y=y;
            cardView.x=x-i*this.stopCardSkewing*1.22;
            //系统最新发的手牌
            if(this.model.stopBoard[i]._isSystemCard){
                cardView.y=y-this.stopCardWidth/2;
                cardView.alpha=0;
                egret.Tween.get(cardView).to({alpha:1},300);
                this.model.stopBoard[i]._isSystemCard=false;
            }
            y-=(this.stopCardDis-2);
            if(_isFaiPai){
                cardView.rotation=-90;
            }
        }
    }
}