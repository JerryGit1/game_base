/**
 * Created by 伟大的周鹏斌大王 on 2017/8/6.
 */
class AH_UserGroupModel extends AH_BaseModel{

    /*玩家1信息*/
    public user1Model:UserModel;/*恒定是当前玩家自己*/
    public user2Model:UserModel;/*玩家2信息*/
    public user3Model:UserModel;/*玩家3信息*/
    public user4Model:UserModel;/*玩家4信息*/
    public constructor() {
        super();
        this.initUserModel1();
        //接收 玩家上线或者掉线状态
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_onLineState,this.updatePlayerOnLineState.bind(this));
    }
    /*初始化第一人称视角玩家数据*/
    public initUserModel1(){
        this.user1Model = new UserModel();
    }
    /*初始化其他玩家数据*/
    public initOtherModel(){
        this.user2Model=new UserModel();
        this.user3Model=new UserModel();
        this.user4Model=new UserModel();
        /*初始化小局*/
        this.initUserCardInfo();
    }


    //每一小局初始化 玩家牌数据
    public initUserCardInfo(){
        this.user1Model.init();
        this.user2Model.init();
        this.user3Model.init();
        this.user4Model.init();
    }
    //设置玩家自己基础信息更新
    public setSelfBaseInfo(playerInfo){
        /*更新玩家自己信息*/
        this.user1Model.setParams(playerInfo);
        /*获取后端版本号*/
        BaseModel.SERVICE_VERSION=playerInfo.version;
        //测试
        if(this.user1Model.zhuang){
            egret["AH_setSystemSendCard"]=this.webSocketModel.setSystemSendCard.bind(this.webSocketModel);
        }
        //分享用户信息
        WeiXinJSSDK.getInstance().userModel=this.user1Model;
    }
    //获取玩家当前状态
    public getSelfStatus(){
        return this.user1Model.playStatus;
    }
    //设置其他玩家基础信息
    public setBaseInfo(oPlayerInfo){
        var id=this.user1Model.position,pointList=[],i:any;
        for(i=2;i<=4;i++){
            id++;if(id>4)id=1;
            pointList.push({
                id:id,model:this.numIdGetUserModel(i),num:i
            });
        }
        /*更新其他玩家*/
        for(i in pointList){
            var info=pointList[i];
            var _isAdd=false;/*是否有玩家*/
            var _isNone=false;
            if(info.model.playStatus==BaseModel.PLAYER_NONE){
                _isNone=true;
            }
            for(var s in oPlayerInfo){
                if(oPlayerInfo[s].position==info.id){
                    oPlayerInfo[s]["num_id"]=info.num;
                    info.model.setParams(oPlayerInfo[s]);
                    _isAdd=true;
                    break;
                }
            }
            if(!_isAdd){/*这个位置没玩家*/
                info.model.playStatus=BaseModel.PLAYER_NONE;
                if(!_isNone&&info.model.openName){
                    this.dispatchEventWith("leaveRoom",false,{name:info.model.openName});
                    BaseModel.getInstance().dispatchEventWith(BaseModel.PORT_DATA_CONFIG.game_quitRoom,false,{"data":info.model.openName});
                    info.model["leave"]=true;//hyh
                }
            }else if(_isNone){//新加入的玩家 加入提示
                info.model["leave"]=false;//hyh
                if(info.model.num_id!=1&&info.model.joinIndex>this.user1Model.joinIndex){
                    this.dispatchEventWith("newJoinRoom",false,{name:info.model.openName});
                }
            }
        }
        this.updateBaseInfo();//解决小结算刷新时，上一局的庄信息未及时更新
    }
    //集体刷新玩家牌信息 _isConstraintUpdate强制刷新
    public setCardInfo(_isConstraintUpdate=false){
        var i:any,p:any,userModel:UserModel,cardInfo,arr,len,actions,lastFaPai,stopUpdate,cpgUpdate;
        for(i=1;i<=4;i++){
            userModel=this.numIdGetUserModel(i);
            userModel._isUpdateStopBoard=_isConstraintUpdate;/*手牌是否更新*/
            userModel._isUpdateActionBoard=_isConstraintUpdate;/*吃碰杠胡动作更新*/
            if(userModel.playStatus!=BaseModel.PLAYER_NONE){
                actions=userModel["actions"];//动作信息
                lastFaPai=userModel["lastFaPai"];//最新出牌信息
                cardInfo=userModel["paiInfos"];//牌信息
                //更新桌牌手牌
                this.updateAssignUserCardInfo(userModel,cardInfo,lastFaPai);
                 //更新吃碰杠胡动作
                if(i==1)this.updateUserCPGHInfo(actions);
                /*销毁临时数据*/
                delete userModel["actions"];//动作信息
                delete userModel["lastFaPai"];//最新出牌信息
                delete userModel["paiInfos"];//牌信息
            }else{
                MyConsole.getInstance().trace("重大失误 此阶段应该每个玩家信息都有",0);
            }
        }
    }
    /*刷新单个玩家 桌牌 手牌 信息 */
    public updateAssignUserCardInfo(userModel,cardInfo,lastFaPai,action=-1){
        /*------------------手牌更新----------------------*/
        /*设置其他玩家手牌*/
        if(userModel.num_id!=1&&cardInfo&&!BaseModel.PLAYBACK_MODEL){/*后端只给了数量 只能看到别的玩家手牌数量*/
            var len=Number(cardInfo.currentMjList);//模拟数据
            cardInfo.currentMjList=[];
            for(var p=0;p<len;p++){
                cardInfo.currentMjList.push([[-1,-1]]);
            }
        }
        //手牌信息 更新 但是在过动作时 不更新因为没变化
        if(action==-1||action!=0){
            userModel.stopBoardJsonStr=JSON.stringify(cardInfo.currentMjList);
            userModel._isUpdateStopBoard=true;//更新牌
            //手牌信息
            userModel.stopBoard=cardInfo.currentMjList;
            if(lastFaPai){
                //设置最新系统手牌信息
                userModel.setNewSystemCard(lastFaPai);
                //插入最新系统手牌信息
                userModel.insertSystemStopCard(lastFaPai);
            }
        }
        /*------------------桌牌更新----------------------*/
        /*设置打出去的牌*/
        userModel.playHand=cardInfo.chuList;
        /*------------------吃碰杠胡动作更新----------------------*/
        if(userModel.cpgBoardJsonStr!=JSON.stringify(cardInfo)){
            userModel.cpgBoardJsonStr=JSON.stringify(cardInfo);
            userModel._isUpdateStopBoard=true;/*刷新*/
            var arr=[];
            userModel.setCpgBoard(1,cardInfo.chiList,arr);//吃
            userModel.setCpgBoard(2,cardInfo.pengList,arr);//碰
            userModel.setCpgXiaoBoard(3,cardInfo.gangListType1,arr);//中发白 杠
            userModel.setCpgXiaoBoard(4,cardInfo.gangListType2,arr);//东南西北 杠
            userModel.setCpgBoard(5,cardInfo.gangListType3,arr);//明杠-（碰杠）
            userModel.setCpgBoard(6,cardInfo.gangListType4,arr);//明杠-（点杠）
            userModel.setCpgBoard(7,cardInfo.gangListType5,arr);//暗杠
            userModel.setCPGOrder(arr);/*排序*/
        }
        if(action==0)userModel._isUpdateStopBoard=false;//过的时候 完全不刷新手牌
        /*-----------------------------------------------*/
        /*派发更新事件*/
        //更新桌牌
        userModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerPlayCard));
        //更新手牌
        if(userModel._isUpdateStopBoard){
            userModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerStopCard));
            userModel._isUpdateStopBoard=false;
        }
    }
    /*设置玩家自己吃碰杠胡可操作信息*/
    public updateUserCPGHInfo(actions,_isConstraintUpdate=false){
        //设置动作信息
        this.user1Model._isUpdateActionBoard=_isConstraintUpdate;
        if(actions)this.user1Model.setActions(actions);
        //数据有变化
        if(this.user1Model._isUpdateActionBoard){
            this.user1Model._isUpdateActionBoard=false;
            this.user1Model.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerChooseAction));//更新动作
        }
    }
    /*集体更新玩家状态*/
    public updateUsersPlayStatus(list){
        if(list)
        for(var i in list){
            var model=this.userIdGetUserModel(list[i].userId);
            if(model){
                model.playStatus=list[i].playStatus;
            }
        }
    }
    /*集体更新玩家分数*/
    public updateUsersPlayScore(list){
        if(list)
            for(var i in list){
                var model=this.userIdGetUserModel(list[i].userId);
                if(model){
                    model.score=list[i].score;
                }
            }
    }
    /*更新玩家掉线 上线状态*/
    public updatePlayerOnLineState(info){
        if(info.userId){
            var model:UserModel=this.userIdGetUserModel(info.userId);
            if(model){
                model.status=info.status;
                model.playStatus=info.playStatus;
            }
        }
    }
    /*因为在游戏界面不必每次都刷新头像基础信息 但断线重连可能需要更新一次*/
    /*主动更新头像信息*/
    public updateBaseInfo() {
        var ids: Array<any> = [], userModel:UserModel;
        for (var i = 1; i <= 4; i++) {
            userModel = this.numIdGetUserModel(i);
            userModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo));
            userModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerLineState));
            if(this.numIdGetUserModel(1).houseOwner) userModel.curHost = true;
            else userModel.curHost = false;
            if (userModel.ip) ids.push({IP: userModel.ip, name: userModel.openName});
        }
    }
    /*獲ip冲突信息*/
    public getIpInfo(){
        var ids: Array<any> = [], userModel,idList: Array<any> = [],str="";
        for (var i = 1; i <= 4; i++) {
            userModel = this.numIdGetUserModel(i);
            if(userModel.leave==true)continue;//hyh
            if(userModel.userId&&idList.indexOf(userModel.userId)==-1) {
                idList.push(userModel.userId);
                ids.push({IP: userModel.ip, name: userModel.openName});
            };
        }
        /*IP冲突弹框*/
        str = this.checkIpSame(ids);
        return str;
    }
    /*判断Ip冲突*/
    protected checkIpSame(arr:Array<any>){
        var str = "";
        var str2 = "";
        for(var i=0;i<arr.length;i++){
            if(str.indexOf(arr[i].name)<0){
                for(var j=i+1;j<arr.length;j++){
                    if(arr[i].IP == arr[j].IP){
                        if(str.indexOf(arr[i].name)>-1){
                            str += ","+arr[j].name;
                            if(arr[j].name.lengh>5){
                                str2 += arr[j].name.substring(0,4)+"...";
                            }
                        }else{
                            if(str != "") str += ";";
                            if(str2 != "") str2 += ";";
                            str += arr[i].name+","+arr[j].name;

                            var tempI = arr[i].name.length>5?arr[i].name.substring(0,4)+"...":arr[i].name;
                            var tempJ = arr[j].name.length>5?arr[j].name.substring(0,4)+"...":arr[j].name;
                            str2 += tempI+","+tempJ;
                        }
                    }
                }
            }
        }
        return str;
    }
    //填充用户数据
    public setSettlementUserInfo(info){
        var userModel:UserModel,huUserId;
        var smModels=[];
        /*填充数据*/
        for(var i in info){
            userModel=this.userIdGetUserModel(info[i].userId);
            info[i]["userName"]=userModel.openName;
            info[i]["userImg"]=userModel.openImg;
            info[i]["zhuang"]=userModel.zhuang;
            if(info[i]["isWin"]){
                huUserId=userModel.userId;
            }
            smModels.push(new SmallSettleModel(info[i]));
        }
        return [{userId:huUserId,action:4},smModels];//  huUserId
    }
    //设置玩家播放语音状态
    public setUserIsPlayingVoice(id,_is){
        var userModel = this.userIdGetUserModel(id);
        userModel.chatVoiceStatus = _is;
    }
    /*判断 等待开局阶段玩家是否凑齐*/
    public playerTogetherInfo(){
        if(this.user1Model.houseOwner){//房主 要显示开局按钮
            for(var i=1;i<=4;i++){
                var info=this.numIdGetUserModel(i);
                if(!info||info.playStatus==BaseModel.PLAYER_NONE){
                    this.dispatchEvent(new egret.Event("playerTogetherNo"));
                    return;
                }
            }
            this.dispatchEvent(new egret.Event("playerTogetherOk"));
        }
    }
    /*獲取房主信息 zpb 1.9.6*/
    public getHomeOwnerModel(userId=null):UserModel{
        for(var i=1;i<=4;i++){
            if(this["user"+i+"Model"]){
                if((userId&&this["user"+i+"Model"].userId==userId)||(this["user"+i+"Model"].houseOwner))
                return this["user"+i+"Model"];
            }
        }
    }
    /*userId查找用户 userModel信息*/
    public userIdGetUserModel(userId):UserModel{
        for(var i=1;i<=4;i++){
            if(this["user"+i+"Model"] && this["user"+i+"Model"].playStatus!=BaseModel.PLAYER_NONE&&this["user"+i+"Model"].userId==Number(userId)){
                return this["user"+i+"Model"];
            }
        }
        MyConsole.getInstance().trace("重大失误 userId"+userId+"没有查到用户userModel信息",0);
    }
    /*num_id 获取玩家信息*/
    public numIdGetUserModel(num_id){
        return this["user"+num_id+"Model"];
    }
    /*回放功能 获取是否有需要系统出牌的玩家 2.1.4*/
    public selectNeedFaPaiUser(){
        for(var i=1;i<=4;i++){
            if(this["user"+i+"Model"] && this["user"+i+"Model"].needFaPai){
                return this["user"+i+"Model"];
            }
        }
        return null;
    }
    /*回放功能 获取是否有需要打牌的玩家 2.1.4*/
    public selectNeedChuUser(){
        for(var i=1;i<=4;i++){
            if(this["user"+i+"Model"] && this["user"+i+"Model"].playStatus==BaseModel.PLAYER_CHU){
                return this["user"+i+"Model"];
            }
        }
        return null;
    }
    /*回放功能 设置need 2.1.4*/
    public setNeedFaPaiUser(){
        for(var i=1;i<=4;i++){
            this["user"+i+"Model"].needFaPai=false;
        }
    }
    /*回放功能 设置need 2.1.4*/
    public setNeedChuUser(){
        for(var i=1;i<=4;i++){
            this["user"+i+"Model"].playStatus=BaseModel.PLAYER_WAIT;
        }
    }
    /*发牌后 打牌后 动作后 设置玩家最近状态 2.1.4*/
    public setPlayerStatus(cPlayStatus,actionUserId){
        if(BaseModel.PLAYBACK_MODEL){ //回放模式下 其他人的 状态也需要改变
            if (cPlayStatus&&actionUserId){
                var actionUserModel=this.userIdGetUserModel(actionUserId);
                actionUserModel.playStatus = cPlayStatus;
            }
        }else if(cPlayStatus){//正常模式下只设置自己
            this.user1Model.playStatus = cPlayStatus;
        }
    }

    /*回放模式下 清理玩家数据 2.1.4*/
    public clearUserModel(){
        for(var i=1;i<=4;i++){
            if(this["user"+i+"Model"]){
                this["user"+i+"Model"].clear();
            }
        }
    }
}