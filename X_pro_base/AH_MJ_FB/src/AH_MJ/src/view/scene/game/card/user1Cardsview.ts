/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 * 打出去的牌
 */
class AH_Game_user1CardsView extends Game_userCardView{

    /*当前拖动的牌*/
    protected cMoveCardView:Game_stopCardView;

    /*出牌边界*/
    protected sendCardMaxY=Math.floor(Main.stageHeight-BaseModel.USER_CARD_WIDTH*2.2);
    public constructor(model){
        super(model);
        this.playRow=10;/*桌牌列数*/
        this.playCol=2;

        //手牌大小
        this.stopCardDis=Math.floor(this.stopCardWidth*.9);//手牌间距
        //更新玩家手牌初始化状态
        this.model.addEventListener("noneSendCard",this.initStopCardType,this);
        //桌牌大小
        this.playCardWidth=Math.floor(Main.stageWidth/18);
        this.playCardDis=Math.floor(this.playCardWidth*.8);
        //打出去的牌起始坐标
        this.playInitPoint=new egret.Point(Main.stageWidth/2-(this.playRow-1)*this.playCardDis/2,Main.stageHeight-BaseModel.USER_CARD_WIDTH*1.5-this.playCardWidth*1.5*this.playCol);
        if(this.playInitPoint.y<Main.stageHeight/2+115){
            this.playInitPoint.y=Main.stageHeight/2+115;
        }
        //手中牌起始坐标
        this.stopInitPoint=new egret.Point(Main.stageWidth-this.stopCardDis*15,Main.stageHeight);
        //吃碰杠的坐标
        this.model.cpghAniPoint = new egret.Point(Main.stageWidth/2,Main.stageHeight/2+150);

        //出牌动画坐标 1号玩家 回放时候需要
        if(BaseModel.PLAYBACK_MODEL){
            this.model.pHandSPoint.x=Main.stageWidth/2;
            this.model.pHandSPoint.y=Main.stageHeight-BaseModel.USER_CARD_WIDTH*2;
        }
    }
    /*设置坐标*/
    public setPoint(){
        super.setPoint();
    }
    /*创建桌面牌*/
    public createPlayCardList(){
        var i:any,x:number,y:number,card,len=this.playRow*this.playCol+5;
        for(i=0;i<len;i++){
            card=new Game_cardView("cpMG_1",this.playCardWidth);
            card.h=Math.floor(card.h*.65);
            x=(i%this.playRow);
            y=Math.floor(i/this.playRow);
            y*=card.h;
            x*=this.playCardDis;
            card.x=x+this.playInitPoint.x;
            card.y=y+this.playInitPoint.y;
            this.addChild(card);
            card.setNewCard(null);
            this.playCardViews.push(card);
        }
    }
    /*更新手牌数据*/
    public updateStopCardList(){
        /*1-先设置吃碰杠牌 列表*/
        var i,cpgView,x=this.stopInitPoint.x,cardView:Game_stopCardView;
        for(i in this.model.cpgBoard){
            cpgView=this.createCPGCardView(this.cpgCardViews[i],this.model.cpgBoard[i]);
            /*设置坐标*/
            cpgView.x=x;
            cpgView.y=this.stopInitPoint.y-cpgView.h/2;
            x+=cpgView.w;
            x+=this.cpgCardDis;//牌间距
        }
        x+=this.cpgCardDis*2;//牌间距
        this.setOntherCPGCard();/*以防万一*/
        /*2-显示剩余手牌*/
        this.clearStopCard();/*清空手牌*/
        this.card_end("clearCard");/*清空拖动的牌*/
        for(i in this.model.stopBoard){
            cardView=this.createStopCardView(this.model.stopBoard[i],true);
            this.addChild(cardView);
            cardView.initX=cardView.x=x;
            cardView.initY=cardView.y=this.stopInitPoint.y-cardView.h/2;

            //系统最新发的手牌
            if(this.model.stopBoard[i]._isSystemCard){
                MyConsole.getInstance().trace("系统手牌 视图刷新");
                cardView.initX=cardView.x=x+this.stopCardWidth/2;
                cardView.alpha=0;
                cardView.y-=30;
                egret.Tween.removeTweens(cardView);
                egret.Tween.get(cardView).to({alpha:1,y:cardView.initY+5},300).to({alpha:1,y:cardView.initY},100);
                this.model.stopBoard[i]._isSystemCard=false;
            }
            x+=this.stopCardDis;
        }
    }
    /*手牌点击*/
    protected stopCardTouch(e:egret.Event){
        if(this.cMoveCardView)return;
        this.card_end("click");
        var card:Game_stopCardView=e.currentTarget;
        if(card.currentType==0){//当前牌属于未激活状态
            this.initStopCardType();
            BaseModel.getInstance().eventRadio("cardHighEnable",card);
            card.currentType=1;
        }else if(card.currentType==1){
            //此处该发牌逻辑了
            BaseModel.getInstance().eventRadio("cardHighDisabled"); //桌牌、吃碰杠牌与出牌一致时的高亮提示
            this.sendCard(card);
        }
    }
    /*手牌移动-侦听*/
    protected beginTimer=0;
    protected _isMoveing=false;
    protected beginPoint=new egret.Point();
    protected stopCardBegin(e:egret.TouchEvent){
        if(this.cMoveCardView)return;
        this.beginTimer=(new Date()).valueOf();
        this.card_end("begin");
        this.cMoveCardView=e.currentTarget;
        this.cMoveCardView._isOut=false;
        this.beginPoint.x=e.stageX;
        this.beginPoint.y=e.stageY;
        this._isMoveing=false;
        this.addChild(this.cMoveCardView);//提高层级

        this.addEventListener(egret.TouchEvent.TOUCH_END,this.card_end,this);
        //只有在可出牌情况下才能拖 甩
        if(!this.model.needFaPai&&this.model.playStatus==BaseModel.PLAYER_CHU){
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.card_move,this);
        }
        BaseModel.getInstance().eventRadio("cardHighEnable",this.cMoveCardView); //桌牌、吃碰杠牌与出牌一致时的高亮提示
        BaseModel.getInstance().eventRadio("setUpViewTouchEvent",false);//消除顶层按钮事件侦听

    }
    /*移动拖动事件*/
    protected card_move(e:egret.TouchEvent){
        if(this.cMoveCardView){
            var x=e.stageX,y=e.stageY;
            if(!this._isMoveing){
                if(egret.Point.distance(this.beginPoint,new egret.Point(x,y))<10){
                    return;
                }
            }
            this._isMoveing=true;
            this.addMoveCardTips();
            if(x>BaseModel.USER_CARD_WIDTH/2&&x<Main.stageWidth-BaseModel.USER_CARD_WIDTH/2&&y>BaseModel.USER_CARD_WIDTH){
                this.cMoveCardView.x=x;
                this.cMoveCardView.y=y;
                this.cMoveCardView.currentType=3;
                return;
            }else{
                this.cMoveCardView._isOut=true;
            }
        }
        this.card_end("move");
    }
    protected card_end(e:any=null){
        this.touchEnabled=false;
        this.graphics.clear();
        this.removeEventListener(egret.TouchEvent.TOUCH_END,this.card_end,this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.card_move,this);
        if(e!="clearCard"&&this.cMoveCardView&&this.cMoveCardView.currentType==3){
            if(!this.cMoveCardView._isOut&&this.cMoveCardView.y<this.sendCardMaxY){
                this.sendCard(this.cMoveCardView);
            }else{
                this.cMoveCardView.currentType=0;
            }
        }
        this.cMoveCardView=null;
        BaseModel.getInstance().eventRadio("cardHighDisabled");//桌牌、吃碰杠牌与出牌一致时的高亮提示
        if(e!="begin")BaseModel.getInstance().eventRadio("setUpViewTouchEvent",true);//恢复顶层按钮事件侦听
    }
    /*----------------确认打出一张牌------------*/
    protected sendCard(card:Game_stopCardView){
        this.model.pHandSPoint.x=card.x;
        this.model.pHandSPoint.y=card.y;
        if(card)BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_playerSendCard,{type:card.type,num:card.num});
    }
    protected addMoveCardTips(){
        if(!this.touchEnabled){
            this.touchEnabled=true;
            this.graphics.clear();
            this.graphics.beginFill(0x111111,.08);
            this.graphics.drawRect(0,0,Main.stageWidth,Main.stageHeight);
            this.graphics.lineStyle(1,0xffffff,.4);
            this.graphics.moveTo(0,this.sendCardMaxY);
            this.graphics.lineTo(Main.stageWidth,this.sendCardMaxY);
            this.graphics.endFill();
        }
    }
    /*恢复所有牌 初始状态*/
    protected initStopCardType(){
        //先恢复所有牌状态
        for(var i in this.stopCardViews){
            this.stopCardViews[i].currentType=0;
        }
    }
    public clear(){
        super.clear();
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.card_move,this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END,this.card_end,this);
    }
}