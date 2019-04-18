/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 * 用户牌信息
 */
class AH_UserModel extends UserBaseModel{
    public sendingCardAni=false;/*是否在出牌动画中 如果是刷新手牌要慢一点*/
    public needFaPai=false;/*是否需要请求发牌*/
    public leave = false;/*是否为离开再次进入用户*/
    /*
     *"currentMjList":"List<Integer[][]>",手牌
     "chuList":"List<Integer[][]>",打出去的牌
     "chiList":"List<Integer[][]>",吃的牌
     "pengList":"List<Integer[][]>",碰的牌
     "gangListType1":"List<Integer[][]>",中发白 杠
     "gangListType2":"List<Integer[][]>",东南西北 杠
     "gangListType3":"List<Integer[][]>",明杠-（碰杠）
     "gangListType4":"List<Integer[][]>",明杠-（点杠）
     "gangListType5":"List<Integer[][]>"暗杠
     * **/
    public actionsList:Array<CpghBtnModel>=[];/*动作 吃碰杠胡*/
    protected currentMjList:Array<CardModel>=[];/*站（手）牌*/
    protected currentMJCPGList:Array<CPGCardModel>=[];/*吃碰杠的牌*/
    protected currentMJPLayList:Array<CardModel>=[];/*打出的牌*/
    public newSendCardModel:CardModel=new CardModel();/*上次出牌信息*/
    public newSystemCardInfo;//系统最新发的牌信息
    //出牌的坐标起点
    public pHandSPoint=new egret.Point();
    //吃碰杠胡的坐标
    public cpghAniPoint=new egret.Point();
    //最新顯示牌的坐标终点
    public pHandNewPoint=new egret.Point();
    //出牌的坐标终点
    public pHandEPoint=new egret.Point();
    //动画缩放比例
    public pAniScale=.8;
    /*当前玩家*/
    public curHost:boolean;
    public constructor(){
        super();
    }
    /*初始化数据*/
    public init(){
        this.actionsList=this.currentMjList=this.currentMJCPGList=this.currentMJPLayList=[];
        this.newSendCardModel=new CardModel();
        this._isUpdateStopBoard=false;
        this.stopBoardJsonStr="";
        this.lastFaPaiJsonStr="";
        this._isUpdateCpgBoard=false;
        this.cpgBoardJsonStr="";
        this._isUpdateActionBoard=false;
        this.actionJsonStr="";
        //this.clearDirtyData();
    }
    /*清理脏数据*/
    public clearDirtyData(){
        this["actions"]=null;//动作信息
        this["lastFaPai"]=null;//最新出牌信息
        this["userModel"]=null;//牌信息
    }
    /*-----------------------手牌-基础手牌-----------------------------*/
    public _isUpdateStopBoard=false;/*是否更新手牌*/
    public stopBoardJsonStr="";
    /*设置站（手）牌*/
    set stopBoard(list){
        this.currentMjList=[];
        for(var i in list){
            this.currentMjList.push(this.createCardModel(list[i][0]));
        }
        //排序
        this.stopHandOrder();
    }
    public setStopBoardNoOrder(list){//仅供小结算使用
        this.currentMjList=[];
        for(var i in list){
            this.currentMjList.push(this.createCardModel(list[i][0]));
        }
    }
    get stopBoard():Array<CardModel>{
        return this.currentMjList;
    }
    /*玩家打牌 手牌少一张牌*/
    public stopHandRemoveOneCard(type,num){
        //剔除牌
        if(!BaseModel.PLAYBACK_MODEL){
            if(this.num_id!=1){/*不处于回放模式，包括其他玩家的手牌减少*/
                type=-1;
                num=-1;
            }
        }

        for(var i in this.currentMjList){
            if(this.currentMjList[i].type==type&&this.currentMjList[i].num==num){
                this.currentMjList.splice(Number(i),1);
                //手牌排序
                this.stopHandOrder();
                //更新手牌视图
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerStopCard));
                return;
            }
        }
    }
    /*设置最新發的牌信息*/
    public lastFaPaiJsonStr="";
    public setNewSystemCard(list){
        if(list&&list[0]&&this.lastFaPaiJsonStr!=JSON.stringify(list)){
            this.lastFaPaiJsonStr=JSON.stringify(list);
            this._isUpdateStopBoard=true;//更新牌
            this.newSendCardModel=new CardModel();
            this.newSendCardModel.type=list[0][0];
            this.newSendCardModel.num=list[0][1];
        }
    }
    /*系统发牌 玩家插入一张系统刚发的牌*/
    public insertSystemStopCard(list){
        if(list&&list[0]){
            if(this.playStatus==BaseModel.PLAYER_CHU||this.playStatus==BaseModel.PLAYER_WAIT){
                if(this.currentMjList){
                    //之前牌信息
                    for(var i in this.currentMjList){
                        this.currentMjList[i]._isSystemCard=false;//之前的牌都不是系统最新牌了
                    }
                    //先排序
                    this.stopHandOrder();
                    //插入最新系统牌
                    this.newSystemCardInfo=list;
                    //插入最新牌数据
                    this.currentMjList.push(this.createCardModel(list[0],true));
                    MyConsole.getInstance().trace("更新系统最新发的手牌信息");
                    return true;
                }
            }else{
                MyConsole.getInstance().trace("重大失误 更新系统最新发的手牌时 玩家当前状态不对"+this.playStatus,0);
            }
        }
        return false;
    }
    /*手牌排序*/
    public stopHandOrder(){
        var i:any,s,len=this.currentMjList.length,num,num1,num2,type;
        /*排序*/
        for(i=0;i<len-1;i++){
            for(s=i+1;s<len;s++){
                num1=this.currentMjList[i].type*9+this.currentMjList[i].num;
                num2=this.currentMjList[s].type*9+this.currentMjList[s].num;
                if(num1>num2){
                    type=this.currentMjList[i].type;
                    num=this.currentMjList[i].num;
                    this.currentMjList[i].type=this.currentMjList[s].type;
                    this.currentMjList[i].num=this.currentMjList[s].num;
                    this.currentMjList[s].type=type;
                    this.currentMjList[s].num=num;
                }
            }
        }
        //2.1.4
        if(this.num_id==1)this.webSocketModel.setPlayStopCardInfo(this.userId,this.currentMjList);
    }
    /*-----------------------手牌-吃碰杠牌-----------------------------*/
    public _isUpdateCpgBoard=false;/*是否更新吃碰杠牌*/
    public cpgBoardJsonStr="";
    /*设置 吃碰杠牌*/
    public setCpgBoard(paiType,list,arr){
        var i,s,info,type,n;
        type = paiType;//tyq 修改
        if(list && list.length>1){
            list.sort(function (a,b) {
                return b.t - a.t;
            });
        }
        for(i in list){
            info={
                type:type,time:Number(list[i].t),l:[]
            }
            /*每一张牌*/
            if(type==7){//暗杠特殊处理
                for(s=0;s<3;s++){
                    info.l.push([-1,-1]);
                }
                if(!list[i].l){/*别人的暗杠*/
                    info.l.push([-1,-1]);
                }else{/*我自己暗杠*/
                    info.l.push(list[i].l[s][0]);
                }
            }
            else{
                if(list[i].l){
                    for(s in list[i].l){
                        for(n in list[i].l[s]){
                            info.l.push(list[i].l[s][n]);
                        }
                    }
                }else{
                    MyConsole.getInstance().trace("重大bug 没有吃碰杠L信息",0);
                }

            }
            info.l=JSON.stringify(info.l);
            arr.push(info);
        }
    }
    //设置 小杠
    public setCpgXiaoBoard(type,list,arr){
        var i,s,info,type,l;
        if(list&&list.length>0){
            info={
                type:type,time:Number(list[0].t),l:[]
            }
            for(i in list){
                for(s in list[i].l){
                    info.l.push(list[i].l[s][0]);
                }
            }
            info.l=JSON.stringify(info.l);
            arr.push(info);
        }
    }
    /*吃碰杠排序*/
    public setCPGOrder(arr){
        /*按时间顺序排序*/
        this.currentMJCPGList=[];
        var i,s,type,l,t,cpgModel:CPGCardModel;
        for(i=0; i<arr.length-1;i++){
            for(s=i+1; s<arr.length;s++){
                if(arr[i].time>=arr[s].time){/*交换数据*/
                    type=arr[i].type;
                    l=arr[i].l;
                    t=arr[i].t;
                    arr[i].type=arr[s].type;
                    arr[i].l=arr[s].l;
                    arr[i].t=arr[s].t;
                    arr[s].type=type;
                    arr[s].l=l;
                    arr[s].t=t;
                }
            }
        }
        for(i in arr){
            cpgModel=new CPGCardModel();
            cpgModel.type=arr[i].type;
            arr[i].l=JSON.parse(arr[i].l);
            for(s in arr[i].l){
                cpgModel.list.push(this.createCardModel(arr[i].l[s]));
            }
            this.currentMJCPGList.push(cpgModel);
        }
        if(this.currentMJCPGList&&this.currentMJCPGList.length>4){
            MyConsole.getInstance().trace("重大失误 居然超过了4个杠 userId"+this.userId,0);
        }
    }
    get cpgBoard():Array<CPGCardModel>{
        return this.currentMJCPGList;
    }
    /*-----------------------桌牌------------------------------------*/
    /*设置打出的牌list */
    set playHand(list){
        var i;
        this.currentMJPLayList=[];
        for(i in list){
            this.currentMJPLayList.push(this.createCardModel(list[i][0]));
        }
    }
    get playHand():Array<CardModel>{
        return this.currentMJPLayList;
    }
    /*设置当前玩家动作*/
    public _isUpdateActionBoard=false;/*是否更新当前玩家动作*/
    public actionJsonStr="";
    public setActions(list){
        this.actionsList=[];
        if(list&&this.actionJsonStr!=JSON.stringify(list)){
            if(this.playStatus==BaseModel.PLAYER_CHU||this.playStatus==BaseModel.PLAYER_WAIT){
                var arr=[1,2,3,4,0],i,s,model:CpghBtnModel;//顺序 吃 碰 杠 胡 过
                for(i in arr){
                    for(s in list){
                        if(arr[i]==Number(s)){
                            model=new CpghBtnModel();
                            model.type=arr[i];
                            //玩家自己动作牌的信息
                            model.setCardModel(list[s]);
                            this.actionsList.push(model);
                            break;
                        }
                    }
                }
                if(this.actionsList.length>0){
                    this.actionJsonStr=JSON.stringify(list);
                    this._isUpdateActionBoard=true;
                    MyConsole.getInstance().trace("----玩家有吃碰杠胡的动作");
                }
            }else{
                MyConsole.getInstance().trace("重大bug 玩家 有吃碰杠胡指令动作但是状态不对"+this.playStatus,0);
            }
        }
    }
    /*玩家打牌 桌牌中添加一张牌[1,2]*/
    public playHandAddOneCard(list){
        if(list){
            this.currentMJPLayList.push(this.createCardModel(list));
        }
    }
    /*玩家打牌 被吃碰杠了 从桌牌移除*/
    public playHandRemoveOneCard(){
        if(this.currentMJPLayList){
            this.currentMJPLayList.pop();
        }
    }
    /*--------------------------------------------------------*/
    /*创建一张牌 基础model*/
    protected createCardModel(list,_isSystemCard=false):CardModel{
        var cardModel=new CardModel();
        cardModel.type=Number(list[0]);
        cardModel.num=Number(list[1]);
        cardModel._isSystemCard=_isSystemCard;
        return cardModel;
    }
    /*清理数据*/
    public clear(){
        this.actionsList=this.currentMjList=this.currentMJCPGList=this.currentMJPLayList=this.newSendCardModel=this.newSystemCardInfo=null;
    }
}