var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/8/6.
 */
var AH_UserGroupModel = (function (_super) {
    __extends(AH_UserGroupModel, _super);
    function AH_UserGroupModel() {
        var _this = _super.call(this) || this;
        _this.user1Model = new UserModel();
        //接收 玩家上线或者掉线状态
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_onLineState, _this.updatePlayerOnLineState.bind(_this));
        return _this;
    }
    /*初始化其他玩家数据*/
    AH_UserGroupModel.prototype.initOtherModel = function () {
        this.user2Model = new UserModel();
        this.user3Model = new UserModel();
        this.user4Model = new UserModel();
        /*初始化小局*/
        this.initUserCardInfo();
    };
    //每一小局初始化 玩家牌数据
    AH_UserGroupModel.prototype.initUserCardInfo = function () {
        this.user1Model.init();
        this.user2Model.init();
        this.user3Model.init();
        this.user4Model.init();
    };
    //设置玩家自己基础信息更新
    AH_UserGroupModel.prototype.setSelfBaseInfo = function (playerInfo) {
        /*更新玩家自己信息*/
        this.user1Model.setParams(playerInfo);
        /*获取后端版本号*/
        BaseModel.SERVICE_VERSION = playerInfo.version;
        //测试
        if (this.user1Model.zhuang) {
            egret["AH_setSystemSendCard"] = this.webSocketModel.setSystemSendCard.bind(this.webSocketModel);
        }
    };
    //获取玩家当前状态
    AH_UserGroupModel.prototype.getSelfStatus = function () {
        return this.user1Model.playStatus;
    };
    //设置其他玩家基础信息
    AH_UserGroupModel.prototype.setBaseInfo = function (oPlayerInfo) {
        var id = this.user1Model.position, pointList = [], i;
        for (i = 2; i <= 4; i++) {
            id++;
            if (id > 4)
                id = 1;
            pointList.push({
                id: id, model: this.numIdGetUserModel(i), num: i
            });
        }
        /*更新其他玩家*/
        for (i in pointList) {
            var info = pointList[i];
            var _isAdd = false; /*是否有玩家*/
            var _isNone = false;
            if (info.model.playStatus == BaseModel.PLAYER_NONE) {
                _isNone = true;
            }
            for (var s in oPlayerInfo) {
                if (oPlayerInfo[s].position == info.id) {
                    oPlayerInfo[s]["num_id"] = info.num;
                    info.model.setParams(oPlayerInfo[s]);
                    _isAdd = true;
                    break;
                }
            }
            if (!_isAdd) {
                info.model.playStatus = BaseModel.PLAYER_NONE;
                if (!_isNone && info.model.openName) {
                    this.dispatchEventWith("leaveRoom", false, { name: info.model.openName });
                }
            }
            else if (_isNone) {
                if (info.model.num_id != 1 && info.model.joinIndex > this.user1Model.joinIndex) {
                    this.dispatchEventWith("newJoinRoom", false, { name: info.model.openName });
                }
            }
        }
    };
    //集体刷新玩家牌信息 _isConstraintUpdate强制刷新
    AH_UserGroupModel.prototype.setCardInfo = function (_isConstraintUpdate) {
        if (_isConstraintUpdate === void 0) { _isConstraintUpdate = false; }
        var i, p, userModel, cardInfo, arr, len, actions, lastFaPai, stopUpdate, cpgUpdate;
        for (i = 1; i <= 4; i++) {
            userModel = this.numIdGetUserModel(i);
            userModel._isUpdateStopBoard = _isConstraintUpdate; /*手牌是否更新*/
            userModel._isUpdateActionBoard = _isConstraintUpdate; /*吃碰杠胡动作更新*/
            if (userModel.playStatus != BaseModel.PLAYER_NONE) {
                actions = userModel["actions"]; //动作信息
                lastFaPai = userModel["lastFaPai"]; //最新出牌信息
                cardInfo = userModel["paiInfos"]; //牌信息
                //更新桌牌手牌
                this.updateAssignUserCardInfo(userModel, cardInfo, lastFaPai);
                //更新吃碰杠胡动作
                if (i == 1)
                    this.updateUserCPGHInfo(actions);
                /*销毁临时数据*/
                delete userModel["actions"]; //动作信息
                delete userModel["lastFaPai"]; //最新出牌信息
                delete userModel["paiInfos"]; //牌信息
            }
            else {
                MyConsole.getInstance().trace("重大失误 此阶段应该每个玩家信息都有", 0);
            }
        }
    };
    /*刷新单个玩家 桌牌 手牌 信息 */
    AH_UserGroupModel.prototype.updateAssignUserCardInfo = function (userModel, cardInfo, lastFaPai, action) {
        if (action === void 0) { action = -1; }
        /*------------------手牌更新----------------------*/
        /*设置其他玩家手牌*/
        if (userModel.num_id != 1 && cardInfo) {
            var len = Number(cardInfo.currentMjList); //模拟数据
            cardInfo.currentMjList = [];
            for (var p = 0; p < len; p++) {
                cardInfo.currentMjList.push([[-1, -1]]);
            }
        }
        //手牌信息 更新 但是在过动作时 不更新因为没变化
        if (action == -1 || action != 0) {
            userModel.stopBoardJsonStr = JSON.stringify(cardInfo.currentMjList);
            userModel._isUpdateStopBoard = true; //更新牌
            //手牌信息
            userModel.stopBoard = cardInfo.currentMjList;
            if (lastFaPai) {
                //设置最新系统手牌信息
                userModel.setNewSystemCard(lastFaPai);
                //插入最新系统手牌信息
                userModel.insertSystemStopCard(lastFaPai);
            }
        }
        /*------------------桌牌更新----------------------*/
        /*设置打出去的牌*/
        userModel.playHand = cardInfo.chuList;
        /*------------------吃碰杠胡动作更新----------------------*/
        if (userModel.cpgBoardJsonStr != JSON.stringify(cardInfo)) {
            userModel.cpgBoardJsonStr = JSON.stringify(cardInfo);
            userModel._isUpdateStopBoard = true; /*刷新*/
            var arr = [];
            userModel.setCpgBoard(1, cardInfo.chiList, arr); //吃
            userModel.setCpgBoard(2, cardInfo.pengList, arr); //碰
            userModel.setCpgXiaoBoard(3, cardInfo.gangListType1, arr); //中发白 杠
            userModel.setCpgXiaoBoard(4, cardInfo.gangListType2, arr); //东南西北 杠
            userModel.setCpgBoard(5, cardInfo.gangListType3, arr); //明杠-（碰杠）
            userModel.setCpgBoard(6, cardInfo.gangListType4, arr); //明杠-（点杠）
            userModel.setCpgBoard(7, cardInfo.gangListType5, arr); //暗杠
            userModel.setCPGOrder(arr); /*排序*/
        }
        if (action == 0)
            userModel._isUpdateStopBoard = false; //过的时候 完全不刷新手牌
        /*-----------------------------------------------*/
        /*派发更新事件*/
        //更新桌牌
        userModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerPlayCard));
        //更新手牌
        if (userModel._isUpdateStopBoard) {
            userModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerStopCard));
            userModel._isUpdateStopBoard = false;
        }
    };
    /*设置玩家自己吃碰杠胡可操作信息*/
    AH_UserGroupModel.prototype.updateUserCPGHInfo = function (actions, _isConstraintUpdate) {
        if (_isConstraintUpdate === void 0) { _isConstraintUpdate = false; }
        //设置动作信息
        this.user1Model._isUpdateActionBoard = _isConstraintUpdate;
        if (actions)
            this.user1Model.setActions(actions);
        //数据有变化
        if (this.user1Model._isUpdateActionBoard) {
            this.user1Model._isUpdateActionBoard = false;
            this.user1Model.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerChooseAction)); //更新动作
        }
    };
    /*集体更新玩家状态*/
    AH_UserGroupModel.prototype.updateUsersPlayStatus = function (list) {
        if (list)
            for (var i in list) {
                var model = this.userIdGetUserModel(list[i].userId);
                if (model) {
                    model.playStatus = list[i].playStatus;
                }
            }
    };
    /*集体更新玩家分数*/
    AH_UserGroupModel.prototype.updateUsersPlayScore = function (list) {
        if (list)
            for (var i in list) {
                var model = this.userIdGetUserModel(list[i].userId);
                if (model && list[i].score) {
                    model.score = list[i].score;
                }
            }
    };
    /*更新玩家掉线上线状态*/
    AH_UserGroupModel.prototype.updatePlayerOnLineState = function (info) {
        if (info.userId) {
            var model = this.userIdGetUserModel(info.userId);
            if (model) {
                model.status = info.status;
            }
        }
    };
    /*因为在游戏界面不必每次都刷新头像基础信息 但断线重连可能需要更新一次*/
    /*主动更新头像信息*/
    AH_UserGroupModel.prototype.updateBaseInfo = function () {
        var ids = [], userModel;
        for (var i = 1; i <= 4; i++) {
            userModel = this.numIdGetUserModel(i);
            userModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo));
            userModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerLineState));
            if (userModel.ip)
                ids.push({ IP: userModel.ip, name: userModel.openName });
        }
    };
    /*獲ip冲突信息*/
    AH_UserGroupModel.prototype.getIpInfo = function () {
        var ids = [], userModel;
        for (var i = 1; i <= 4; i++) {
            userModel = this.numIdGetUserModel(i);
            if (userModel.ip)
                ids.push({ IP: userModel.ip, name: userModel.openName });
        }
        /*IP冲突弹框*/
        var str = this.checkIpSame(ids);
        return str;
    };
    /*判断Ip冲突*/
    AH_UserGroupModel.prototype.checkIpSame = function (arr) {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            if (str.indexOf(arr[i].name) < 0) {
                for (var j = i + 1; j < arr.length; j++) {
                    if (arr[i].IP == arr[j].IP) {
                        if (str.indexOf(arr[i].name) > -1) {
                            str += "," + arr[j].name;
                        }
                        else {
                            if (str != "")
                                str += ";";
                            str += arr[i].name + "," + arr[j].name;
                        }
                    }
                }
            }
        }
        return str;
    };
    //填充用户数据
    AH_UserGroupModel.prototype.setSettlementUserInfo = function (info) {
        var userModel, huUserId;
        var smModels = [];
        /*填充数据*/
        for (var i in info) {
            userModel = this.userIdGetUserModel(info[i].userId);
            info[i]["userName"] = userModel.openName;
            info[i]["userImg"] = userModel.openImg;
            info[i]["zhuang"] = userModel.zhuang;
            if (info[i]["isWin"]) {
                huUserId = userModel.userId;
            }
            smModels.push(new SmallSettleModel(info[i]));
        }
        return [{ userId: huUserId, action: 4 }, smModels]; //  huUserId
    };
    //设置玩家播放语音状态
    AH_UserGroupModel.prototype.setUserIsPlayingVoice = function (id, _is) {
        var userModel = this.userIdGetUserModel(id);
        userModel.chatVoiceStatus = _is;
    };
    /*判断 等待开局阶段玩家是否凑齐*/
    AH_UserGroupModel.prototype.playerTogetherInfo = function () {
        if (this.user1Model.houseOwner) {
            for (var i = 1; i <= 4; i++) {
                var info = this.numIdGetUserModel(i);
                if (!info || info.playStatus == BaseModel.PLAYER_NONE) {
                    this.dispatchEvent(new egret.Event("playerTogetherNo"));
                    return;
                }
            }
            this.dispatchEvent(new egret.Event("playerTogetherOk"));
        }
    };
    /*獲取房主信息 zpb 1.9.6*/
    AH_UserGroupModel.prototype.getHomeOwnerModel = function (userId) {
        if (userId === void 0) { userId = null; }
        for (var i = 1; i <= 4; i++) {
            if (this["user" + i + "Model"]) {
                if ((userId && this["user" + i + "Model"].userId == userId) || (this["user" + i + "Model"].houseOwner))
                    return this["user" + i + "Model"];
            }
        }
    };
    /*userId查找用户 userModel信息*/
    AH_UserGroupModel.prototype.userIdGetUserModel = function (userId) {
        for (var i = 1; i <= 4; i++) {
            if (this["user" + i + "Model"].playStatus != BaseModel.PLAYER_NONE && this["user" + i + "Model"].userId == Number(userId)) {
                return this["user" + i + "Model"];
            }
        }
        MyConsole.getInstance().trace("重大失误 userId" + userId + "没有查到用户userModel信息", 0);
    };
    /*num_id 获取玩家信息*/
    AH_UserGroupModel.prototype.numIdGetUserModel = function (num_id) {
        return this["user" + num_id + "Model"];
    };
    return AH_UserGroupModel;
}(AH_BaseModel));
__reflect(AH_UserGroupModel.prototype, "AH_UserGroupModel");
