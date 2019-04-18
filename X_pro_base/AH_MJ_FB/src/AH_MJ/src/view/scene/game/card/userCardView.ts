/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 */
class AH_Game_userCardView extends BaseView{


    protected model:UserModel;
    /*打出去牌每一行列数*/
    public playRow:number=7;
    public playCol:number=3;
    /*手牌大小*/
    protected stopCardWidth:number=BaseModel.USER_CARD_WIDTH;
    protected stopCardDis:number=Math.floor(BaseModel.USER_CARD_WIDTH*.9);
    public stopCardSkewing:number;//2 4 号玩家桌牌偏移量
    /*打出去牌大小*/
    public playCardWidth:number=Main.stageWidth/40;
    public playCardDis:number;//打出牌的间距
    public playCardSkewing:number;//2 4 号玩家桌牌偏移量
    /*第一张手牌坐标*/
    protected stopInitPoint:egret.Point=new egret.Point();
    /*第一张打出去牌坐标*/
    public playInitPoint:egret.Point=new egret.Point();
    /*打出去的牌*/
    protected playCardViews:Array<Game_cardView>=[];
    /*吃碰杠的牌*/
    protected cpgCardViews:Array<Game_cpgCardView>=[];
    protected cpgCardDis:number=10;

    /*剩余手牌*/
    protected stopCardViews:Array<Game_stopCardView>=[];

    protected bg:egret.Shape;/*背景 拖動的時候更便捷 zpb*/

    public constructor(model){
        super();
        this.model=model;
        //刷新桌牌显示-单个更新
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerPlayCard,this.updatePlayCardList,this);
        //刷新手牌显示--单个更新
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerStopCard,this.updateStopCardList,this);
    }
    /*设置坐标*/
    public setPoint(a=null,b=null,c=null,d=null,e=null){

    }
    /*创建桌面牌视图*/
    public createPlayCardList(){

    }
    /*更新手牌数据*/
    public updateStopCardList(){
        /*先设置吃碰杠*/

        /*显示剩余手牌*/
    }

    /*隐藏多余的吃碰杠*/
    protected setOntherCPGCard(){
        if(this.model.cpgBoard.length<this.cpgCardViews.length){
            for(var i=this.model.cpgBoard.length;i<this.cpgCardViews.length;i++){
                this.cpgCardViews[i].setCardData(null);
            }
        }
    }
    /*更新打出去的牌数据*/
    public updatePlayCardList(){
        if(this.model.sendingCardAni)return;
        this.setPlayHandAniPoint(this.playCardViews[0]);
        if(this.model.playHand){
            var list=this.model.playHand,i,len=list.length,card:Game_cardView;
            for(i in this.playCardViews){
                card=this.playCardViews[i];
                if(len>Number(i)){
                    card.setNewCard(list[i].type,list[i].num);/*显示刷新牌*/
                    this.model.pHandNewPoint.x=card.x;
                    this.model.pHandNewPoint.y=card.y;
                }else{
                    if(Number(i)==len){/*出牌动画 需要下一张牌的坐标*/
                        this.setPlayHandAniPoint(card);
                    }
                    card.setNewCard(null);/*不显示牌*/
                }
            }
        }
        //更新箭頭
        BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_updatePLayCardArrows);
    }
    //设置出牌动画终点坐标
    protected setPlayHandAniPoint(card){
        //默认动画坐标防止出错
        this.model.pHandEPoint.x=card.x;
        this.model.pHandEPoint.y=card.y;
    }

    /*创建单张吃碰杠牌*/
    protected createCPGCardView(cpgView,data,w=this.stopCardWidth*.9,stopCardSkewing=0,_isFaiPai=false){
        if(!cpgView){
            cpgView=new Game_cpgCardView();
            this.addChild(cpgView);
            this.cpgCardViews.push(cpgView);
        }
        cpgView.setCardData(data,this.model.num_id,w,stopCardSkewing);
        return cpgView;
    }
    /*创建单张 手牌*/
    protected createStopCardView(data,_isTouch=false,w=this.stopCardWidth,_isFaiPai=false){
        if(this.stopCardViews.length>13){
            MyConsole.getInstance().trace("重大bug手牌大于13张了",0);
            return;
        }
        var bgType:any=this.model.num_id;
        if(_isFaiPai){
            /*回放时候特殊处理 2.1.4*/
            if(bgType==2||bgType==3||bgType==4){
                //回放时候其他3家手牌
                bgType="cpMG_"+bgType;
            }
        }
        var card=new Game_stopCardView(bgType,w,_isTouch);
        card.setNewCard(data.type,data.num);
        this.stopCardViews.push(card);
        if(_isTouch){//玩家自己
            //牌点击
            card.addEventListener(egret.TouchEvent.TOUCH_TAP,this.stopCardTouch,this);
            //牌拖动
            card.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.stopCardBegin,this);
        }
        if(bgType==2){
            card.scaleX=-Math.abs(card.scaleX);
        }
        return card;
    }
    /*手牌点击*/
    protected stopCardTouch(e:egret.TouchEvent){

    }
    /*手牌拖动*/
    protected stopCardBegin(e:egret.TouchEvent){

    }
    /*清空手牌*/
    protected clearStopCard(){
        for(var i in this.stopCardViews){
            this.stopCardViews[i].removeEventListener(egret.TouchEvent.TOUCH_TAP,this.stopCardTouch,this);
            this.stopCardViews[i].removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.stopCardBegin,this);
            this.removeChild(this.stopCardViews[i]);
            this.stopCardViews[i]=null;
        }
        this.stopCardViews=[];
    }
    public clear(){
        //刷新桌牌显示-单个更新
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerPlayCard,this.updatePlayCardList,this);
        //刷新手牌显示--单个更新
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerStopCard,this.updateStopCardList,this);
        this.model=null;
        /*一處拖動背景 zpb*/
        if(this.bg){
            this.removeChild(this.bg);
            this.bg=null;
        }
        this.clearStopCard();
    }

    //与当前出牌一致时，桌牌、吃碰杠牌高亮提示
    public setCPGCardHighLight(card:Game_stopCardView){
        for(var i:number=0;i<this.playCardViews.length;i++){
            if(this.playCardViews[i].type== card.type && this.playCardViews[i].num == card.num){
                this.playCardViews[i].setHighLight(true);
            }
        }

        for(var j:number=0;j<this.cpgCardViews.length;j++){
            var cpgCards = this.cpgCardViews[j].cpgCards;
            for(var j1:number=0;j1<cpgCards.length;j1++){
                if(cpgCards[j1].type== card.type && cpgCards[j1].num == card.num){
                    cpgCards[j1].setHighLight(true);
                }
            }
        }
    }
    //取消全部出牌高亮提示
    public setCPGCardHighLightDisabled(){
        for(var i:number=0;i<this.playCardViews.length;i++){
            this.playCardViews[i].setHighLight(false);
        }

        for(var j:number=0;j<this.cpgCardViews.length;j++){
            var cpgCards = this.cpgCardViews[j].cpgCards;
            for(var j1:number=0;j1<cpgCards.length;j1++){
                cpgCards[j1].setHighLight(false);
            }
        }
    }
    /*背景拖動的時候 更流暢 zpb*/
    protected addMoveBg(_isAdd){
        if(!this.bg){
            this.bg=new egret.Shape();
            this.addChildAt(this.bg,0);
            this.bg.graphics.beginFill(0x00ff00,0);
            this.bg.graphics.drawRect(0,0,Main.stageWidth,Main.stageHeight);
        }
        this.bg.touchEnabled=this.bg.visible=_isAdd;
    }
}