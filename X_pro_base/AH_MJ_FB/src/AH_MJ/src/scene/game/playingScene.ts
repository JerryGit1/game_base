/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 游戏中 打牌中场景
 */
class AH_PlayingScene extends AH_GameBaseScene{
    protected model:Game_playingModel;
    /*每个玩家的牌*/
    protected cardSp:egret.Sprite;
    protected playCardList:Array<Game_userCardView>=[];
    //吃碰杠胡按钮和选择多个吃视图
    protected cpghBtnView:Game_cpghBtnView;

    public constructor(model){
        super(model);

        /*事件侦听*/
        //更新玩家手牌视图--集体更新--1.5舍弃
        //this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerStopCard,this.updatePlayerCard,this);
        //更新玩家桌牌视图--集体更新--1.5舍弃
        //this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerPlayCard,this.updatePlayerCard,this);
        //玩家选择吃碰杠胡动作 弹出视图
        this.model.userGroupModel.user1Model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerChooseAction,this.addChooseAction,this);
        //桌牌、吃碰杠牌与出牌一致时，高亮提示
        BaseModel.getInstance().addEventListener("cardHighEnable",this.setCardHighEnable,this);
        //取消桌牌、吃碰杠牌与出牌一致时的高亮提示
        BaseModel.getInstance().addEventListener("cardHighDisabled",this.setCardHighDisabled,this);
        /*初始化*/
        this.initCardSp();
        /*吃碰杠胡按钮选择层*/
        this.initCpghView();
        /*吃碰杠胡动画层 1.9.0舍弃*/
        // this.initCpghAniSp();
        /*主动刷新牌视图*/
        //this.updatePlayerCard();舍弃
    }
    //ip衝突提示/
    public ipSameTips(){
        var str=this.model.userGroupModel.getIpInfo();
        if(str)PopupLayer.getInstance().floatAlert("本房间 <font color='#ffff00'>"+str+"</font> IP相同",1900);
    }
    /*-----------------牌层--------------------*/
    protected initCardSp(){
        this.cardSp=new egret.Sprite();
        this.addChild(this.cardSp);
        //实例化打出去的牌和手牌视图
        var userCardModel:UserModel,playView,i;
        for(i=1;i<=4;i++){
            userCardModel=this.model.userGroupModel.numIdGetUserModel(i);
            switch(i){
                case 1:
                    playView=new Game_user1CardsView(userCardModel);
                    break;
                case 2:
                    playView=new Game_user2CardsView(userCardModel);
                    break;
                case 3:
                    playView=new Game_user3CardsView(userCardModel);
                    break;
                case 4:
                    playView=new Game_user4CardsView(userCardModel);
                    break;
            }
            this.cardSp.addChildAt(playView,0);
            this.playCardList.push(playView);
        }
        /*玩家1的桌牌调整*/
        this.playCardList[0].setPoint();
        /*玩家2的桌牌调整*/
        playView=this.playCardList[0];
        var  X= playView.playInitPoint.x+(playView.playRow)*playView.playCardDis;
        var w = (playView.playInitPoint.y - this.playCardList[2].playInitPoint.y)+playView.playCardWidth*2;
        var p3Point:any=this.playCardList[1].setPoint(playView.playInitPoint.y,X,playView.playCardWidth,w);
        /*玩家3的桌牌调整*/
        playView=this.playCardList[0];
        this.playCardList[2].setPoint(playView.playInitPoint);
        /*玩家4的桌牌调整*/
        playView=this.playCardList[2];
        X = Main.stageWidth/2-p3Point.x;
        this.playCardList[3].setPoint(p3Point.y,X,playView.playCardWidth,w);
        /*创建桌牌*/
        for(i in this.playCardList){
            this.playCardList[i].createPlayCardList();
        }
    }
    /*更新填充牌数据*/
    protected updatePlayerCard(e){
        var i=this.playCardList.length-1;
        for(i;i>=0;i--){
            if(e.type==BaseModel.GAME_CHANGE_VIEW_playerStopCard){
                /*更新手牌*/
                this.playCardList[i].updateStopCardList();
            }else if(e.type==BaseModel.GAME_CHANGE_VIEW_playerPlayCard){
                /*更新桌牌*/
                this.playCardList[i].updatePlayCardList();
            }
        }
    }
    /*-----------------开局发牌动画--------------------*/
    public startLicensingAnimation(){
        //以后加动画

        //请求出牌
        BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_requestSendCard);
    }
    /*---------------吃碰杠胡按钮层------------*/
    protected initCpghView(){
        this.cpghBtnView=new Game_cpghBtnView();
        this.addChild(this.cpghBtnView);
        this.cpghBtnView.visible=false;
    }
    /*吃碰杠胡过显示*/
    protected addChooseAction(){
        this.cpghBtnView.visible=true;
        //传入最后一张牌信息
        this.cpghBtnView.cActionCardModel=this.model.roomInfoModel.lastPaiModel;
        /*显示操作按钮*/
        this.cpghBtnView.addBtnList(this.model.userGroupModel.user1Model.actionsList);
    }
    //桌牌、吃碰杠牌与出牌一致时，高亮提示
    protected setCardHighEnable(e){
        for(var i in this.playCardList){
            this.playCardList[i].setCPGCardHighLight(e.data);
        }
    }
    //取消桌牌、吃碰杠牌与出牌一致时的高亮提示
    protected setCardHighDisabled(e){
        for(var i in this.playCardList){
            this.playCardList[i].setCPGCardHighLightDisabled();
        }
    }
    /*---------------------------------------*/
    public clear(){
        super.clear();
        /*事件侦听*/
        //更新玩家手牌视图--集体更新
        //this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerStopCard,this.updatePlayerCard,this);
        //更新玩家桌牌视图--集体更新
        //this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerPlayCard,this.updatePlayerCard,this);
        //玩家选择吃碰杠胡动作 弹出视图
        this.model.userGroupModel.user1Model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerChooseAction,this.addChooseAction,this);

        //桌牌、吃碰杠牌与出牌一致时，高亮提示
        BaseModel.getInstance().removeEventListener("cardHighEnable",this.setCardHighEnable,this);
        //取消桌牌、吃碰杠牌与出牌一致时的高亮提示
        BaseModel.getInstance().removeEventListener("cardHighDisabled",this.setCardHighDisabled,this);


        /*牌*/
        for(var i in this.playCardList){
            this.playCardList[i].clear();
        }
        /*吃碰杠选择*/
        this.cpghBtnView.clear();
    }
}