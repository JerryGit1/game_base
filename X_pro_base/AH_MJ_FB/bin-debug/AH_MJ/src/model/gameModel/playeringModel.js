var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/6.
 */
var AH_Game_playingModel = (function (_super) {
    __extends(AH_Game_playingModel, _super);
    function AH_Game_playingModel(roomInfoModel, userGroupModel) {
        var _this = _super.call(this) || this;
        _this.roomInfoModel = roomInfoModel;
        _this.userGroupModel = userGroupModel;
        //请求系统发牌
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_requestSendCard, _this.requestSystemSendHand, _this);
        //玩家出牌
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_playerSendCard, _this.playerSendCard, _this);
        //吃碰杠胡 操作完毕 告诉后台
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_playerChooseActionOk, _this.addChooseActionOk, _this);
        //更新 桌牌箭頭提示
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_updatePLayCardArrows, _this.updatePLayCardArrows, _this);
        //接收---玩家吃碰杠胡操作指令
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_CPGHAction, _this.cpghAction.bind(_this));
        //接收---其他玩家吃碰杠操作 播放动画
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_CPGAni, _this.cpgMessage.bind(_this));
        //接收---玩家出牌消息 播放动画
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_playHandAni, _this.playerPlayHand.bind(_this));
        //接收---系统发牌消息 播放动画
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_systemSendHandHandAni, _this.playerSystemSendHand.bind(_this));
        return _this;
    }
    /*---------------------更新玩家牌信息------------------------*/
    AH_Game_playingModel.prototype.updatePlayerInfo = function () {
        //牌信息
        this.userGroupModel.setCardInfo();
        //显示最新出的牌
        this.addNewPlayCard();
    };
    /*----------------------出牌操作-------------------------*/
    //玩家选择打出一张牌
    AH_Game_playingModel.prototype.playerSendCard = function (e) {
        var info = e.data;
        //判断玩家是否是出牌状态
        if (info && this.userGroupModel.getSelfStatus() == BaseModel.PLAYER_CHU && !this.userGroupModel.user1Model.needFaPai) {
            info = [[info.type, info.num]];
            var data = {
                "roomSn": this.roomInfoModel.roomSn,
                "userId": this.userGroupModel.user1Model.userId,
                "paiInfo": JSON.stringify(info)
            };
            /*出牌暂停闪烁动画 停止倒计时 停止声音 hyh*/
            SoundModel.stopAllBackEffect();
            /*出牌动画 1.9.6 再次还原*/
            this.playerPlayHand(data, null, true);
            //发送牌数据
            this.webSocketModel.playHand(data);
        }
        else {
            //还不能出牌
            this.userGroupModel.user1Model.dispatchEvent(new egret.Event("noneSendCard"));
        }
    };
    /*接收---玩家出牌消息 出牌动画*/
    AH_Game_playingModel.prototype.playerPlayHand = function (info, interfaceId, _isInitiative) {
        if (interfaceId === void 0) { interfaceId = null; }
        if (_isInitiative === void 0) { _isInitiative = false; }
        if (info && info.paiInfo) {
            var paiInfo;
            if (_isInitiative) {
                //自己调用 因为等待玩家出牌消息回应 会有一段时间 如果等回应完了在出动画 会有卡顿显示
                //玩家出牌-》自己调用出牌动画 -》系统告诉玩家自己出牌了
                //其他玩家出牌-》系统告诉玩家他出牌了
                _isInitiative = 1; //玩家自己调用
                paiInfo = JSON.parse(info.paiInfo);
            }
            else {
                if (this.userGroupModel.user1Model.userId == Number(info.userId)) {
                    //销毁上张牌信息
                    this.userGroupModel.user1Model.newSendCardModel = null;
                    this.userGroupModel.user1Model.lastFaPaiJsonStr = "";
                    _isInitiative = 2; //玩家自己发牌 收到回应
                }
                else {
                    _isInitiative = 3; //其他玩家自己发牌 收到回应
                }
                paiInfo = info.paiInfo;
            }
            //其他人出牌 或者自己主动调用出牌接口
            var cardModel = this.userGroupModel.userIdGetUserModel(info.userId);
            if (cardModel) {
                var aniData = {
                    cardInfo: paiInfo,
                    userCardInfo: cardModel,
                    _isAction: false
                };
                if (_isInitiative == 1 || _isInitiative == 3) {
                    //销毁系统发的最新牌信息
                    cardModel.newSystemCardInfo = null;
                    //减少手牌
                    cardModel.stopHandRemoveOneCard(aniData.cardInfo[0][0], aniData.cardInfo[0][1]);
                    //增加桌牌
                    cardModel.playHandAddOneCard(aniData.cardInfo[0]);
                    //提示最新出的牌
                    aniData["_isAddMoveCardAni"] = true; //出牌动画
                    aniData["_isAddMaxCardAni"] = false; //大牌动画
                    aniData["_isUpdateCard"] = true; //是否更新牌
                    if (_isInitiative == 1)
                        this.addNewPlayCard(aniData); //只播放出牌动画
                }
                if (_isInitiative == 2 || _isInitiative == 3) {
                    /*切换玩家最新状态*/
                    if (info.playStatus)
                        this.userGroupModel.user1Model.playStatus = info.playStatus;
                    //更新房间信息里的最新出的牌信息
                    this.roomInfoModel.setNewPlayHandUserInfo(aniData.cardInfo, info.userId);
                    //吃碰杠胡动作提示
                    aniData._isAction = this.cpghAction(info.actionInfo);
                    //请求发牌判定
                    this.requestSystemSendHand(null, info.needFaPai, 500); //MyConsole.getInstance().trace("请求系统发牌-发牌后" + info.needFaPai, "custom3");
                    //更新所有玩家状态
                    this.dispatchEventWith("changePlayerStatus", false, { type: "userPlayHand", userId: cardModel.userId });
                    //提示最新出的牌
                    aniData["_isAddMoveCardAni"] = false; //出牌动画
                    aniData["_isAddMaxCardAni"] = true; //大牌动画
                    aniData["_isUpdateCard"] = false; //是否更新牌
                    if (_isInitiative == 3) {
                        aniData["_isAddMoveCardAni"] = true; //出牌动画
                        aniData["_isUpdateCard"] = true;
                    } //是否更新牌
                    this.addNewPlayCard(aniData);
                }
            }
        }
        else {
            MyConsole.getInstance().trace("重大失误 该接口--没有玩家出牌信息", 0);
        }
    };
    /*最新出的牌 放大提示*/
    AH_Game_playingModel.prototype.addNewPlayCard = function (aniData) {
        if (aniData === void 0) { aniData = null; }
        if (!aniData) {
            if (this.roomInfoModel.lastUserId && this.roomInfoModel.lastUserId != this.userGroupModel.user1Model.userId) {
                aniData = {
                    cardInfo: [[this.roomInfoModel.lastPaiModel.type, this.roomInfoModel.lastPaiModel.num]],
                    userCardInfo: this.userGroupModel.userIdGetUserModel(this.roomInfoModel.lastUserId),
                    _isAddMoveCardAni: true,
                    _isAddMaxCardAni: true,
                    _isUpdateCard: true
                };
            }
        }
        //播放出牌动画
        if (aniData && aniData.userCardInfo)
            this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_playerSendCardAni, false, aniData);
    };
    /*最新出的牌 箭頭提示*/
    AH_Game_playingModel.prototype.updatePLayCardArrows = function () {
        var pHandNewPoint = null;
        if (this.roomInfoModel.lastUserId) {
            var model = this.userGroupModel.userIdGetUserModel(this.roomInfoModel.lastUserId);
            pHandNewPoint = model.pHandNewPoint;
        }
        this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_updatePLayCardArrows, false, pHandNewPoint);
    };
    /*----------------------系统发牌操作-------------------------*/
    /*请求----系统发牌*/
    AH_Game_playingModel.prototype.requestSystemSendHand = function (e, needFaPai, delayTimer) {
        if (needFaPai === void 0) { needFaPai = -1; }
        if (delayTimer === void 0) { delayTimer = 100; }
        if (needFaPai != -1)
            this.userGroupModel.user1Model.needFaPai = needFaPai;
        if (this.userGroupModel.user1Model.needFaPai) {
            MyConsole.getInstance().trace("请求系统发牌-总", "custom3");
            //延迟发送 体验好点
            setTimeout(function () {
                this.webSocketModel.requestSystemSendHand({
                    userId: this.userGroupModel.user1Model.userId
                });
            }.bind(this), delayTimer);
        }
    };
    /*接收---系统发牌消息*/
    AH_Game_playingModel.prototype.playerSystemSendHand = function (info) {
        if (info) {
            if (info.reqState && info.reqState == 1) {
                //牌发完了
                return;
            }
            var cardModel = this.userGroupModel.userIdGetUserModel(info.userId);
            if (cardModel) {
                var data;
                if (cardModel.userId == this.userGroupModel.user1Model.userId) {
                    if (info.pai) {
                        //玩家自己要显示牌
                        data = {
                            type: info.pai[0][0],
                            num: info.pai[0][1],
                        };
                        //设置最新系统手牌信息
                        cardModel.setNewSystemCard([[data.type, data.num]]);
                        //插入最新系统手牌信息
                        cardModel.insertSystemStopCard([[data.type, data.num]]);
                        //測試更新牌
                        this.webSocketModel.systemSendCardOk(this.roomInfoModel.roomSn, this.userGroupModel.user1Model.position);
                    }
                    else {
                        MyConsole.getInstance().trace("重大失误 该接口--判断出系统给当前这个玩家发牌 但没有牌具体信息", 0);
                    }
                }
                else {
                    //其他玩家加张牌就好了
                    //设置系统手牌信息
                    cardModel.insertSystemStopCard([[-1, -1]]);
                }
                /*切换玩家最新状态*/
                if (info.playStatus)
                    this.userGroupModel.user1Model.playStatus = info.playStatus;
                //剩余牌减少
                this.roomInfoModel.cnrrMJNum--;
                //更新所有玩家状态和风向
                this.dispatchEventWith("changePlayerStatus", false, { type: "systemSendHand", userId: cardModel.userId });
                //更新视图 玩家手牌边边多一张 距离稍微远一点
                //更新手牌视图
                cardModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerStopCard));
                //吃碰杠胡动作提示
                if (this.cpghAction(info.actionInfo)) {
                    //移除桌面提示的大牌
                    if (info.actionInfo.userId && Number(info.actionInfo.userId) == this.userGroupModel.user1Model.userId)
                        this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_removeSendCardAni, false);
                }
                //请求发牌判定
                this.requestSystemSendHand(null, info.needFaPai, 100);
            }
        }
        else {
            MyConsole.getInstance().trace("重大失误 该接口--没有系统发牌信息", 0);
        }
    };
    /*----------------------吃碰杠胡操作-------------------------*/
    /*选择吃碰杠胡*/
    AH_Game_playingModel.prototype.cpghAction = function (info) {
        if (info && info.userId) {
            if (Number(info.userId) == this.userGroupModel.user1Model.userId && info.actions) {
                //更新动作信息
                this.userGroupModel.updateUserCPGHInfo(info.actions);
            }
            else {
            }
        }
        if (info)
            return true; //有动作的话放大提示的牌应对一直出现 没动作就2秒消失
        return false;
    };
    /*操作选择ok  告诉后台*/
    AH_Game_playingModel.prototype.addChooseActionOk = function (e) {
        var model = e.data, pais, toUserId, data, huType, selfUserModel = this.userGroupModel.user1Model;
        if (model.huPaiUserId && model.huPaiUserId == selfUserModel.userId) {
            toUserId = model.huPaiUserId;
            pais = [[selfUserModel.newSendCardModel.type, selfUserModel.newSendCardModel.num]];
            huType = 1; /*自摸*/
        }
        else {
            toUserId = this.roomInfoModel.lastUserId;
            pais = [[this.roomInfoModel.lastPaiModel.type, this.roomInfoModel.lastPaiModel.num]];
            huType = 2; /*点炮*/
        }
        /*后端数据*/
        data = {
            roomSn: this.roomInfoModel.roomSn,
            userId: selfUserModel.userId,
            action: model.type,
            toUserId: toUserId,
            actionPai: JSON.stringify(pais),
            pais: model.cardJsonInfo,
            huType: huType
        };
        //播放动画
        this.cpgMessage(data, null, true);
        //发送消息
        this.webSocketModel.cpghAction(data);
    };
    /*接收--其他玩家吃碰杠胡*/
    AH_Game_playingModel.prototype.cpgMessage = function (info, interfaceId, _isInitiative) {
        if (interfaceId === void 0) { interfaceId = null; }
        if (_isInitiative === void 0) { _isInitiative = false; }
        if (info && info.userId) {
            if (_isInitiative) {
                //自己调用 因为等待玩家出牌消息回应 会有一段时间 如果等回应完了在出动画 会有卡顿显示
                //玩家出牌-》自己调用出牌动画 -》系统告诉玩家自己出牌了
                //其他玩家出牌-》系统告诉玩家他出牌了
                _isInitiative = 1; //玩家自己调用
            }
            else {
                if (this.userGroupModel.user1Model.userId == Number(info.userId)) {
                    //清空这个人吃碰杠胡动作信息
                    this.userGroupModel.user1Model.actionsList = [];
                    this.userGroupModel.user1Model.actionJsonStr = "";
                    //清空最新系统牌信息
                    if (Number(info.action) != 0)
                        this.userGroupModel.user1Model.newSystemCardInfo = null;
                    _isInitiative = 2; //玩家自己发牌 收到回应
                }
                else {
                    _isInitiative = 3; //其他玩家自己发牌 收到回应
                }
            }
            var cardModel = this.userGroupModel.userIdGetUserModel(info.userId);
            if (cardModel) {
                if (_isInitiative == 2 || _isInitiative == 3) {
                    //刷新操作的人牌信息
                    if (info.paiInfos) {
                        //更新出牌状态
                        if (info.playStatus)
                            this.userGroupModel.user1Model.playStatus = info.playStatus;
                        //更新手牌信息
                        this.userGroupModel.updateAssignUserCardInfo(cardModel, info.paiInfos, cardModel.newSystemCardInfo, Number(info.action));
                    }
                    //更新all玩家状态
                    this.userGroupModel.updateUsersPlayStatus(info.playStatusInfo);
                    //更新all玩家分数
                    this.userGroupModel.updateUsersPlayScore(info.gangScoreInfo);
                    //连续吃碰杠胡动作提示
                    this.cpghAction(info.actionInfo);
                    //更新风向
                    this.eventRadio(BaseModel.GAME_CHANGE_VIEW_updateClock);
                    //请求发牌判定
                    //MyConsole.getInstance().trace("请求系统发牌-动作后"+info.needFaPai,"custom3");
                    this.requestSystemSendHand(null, info.needFaPai, 500);
                }
                if (_isInitiative == 1 || _isInitiative == 3) {
                    //刷新被吃碰杠人的桌牌信息
                    if (Number(info.action) != 0 && info.toUserId) {
                        //移除上家出牌人（牌被操作了）
                        this.roomInfoModel.setNewPlayHandUserInfo(null);
                        //从桌牌减少
                        var toCardModel = this.userGroupModel.userIdGetUserModel(info.toUserId);
                        if (toCardModel) {
                            toCardModel.playHandRemoveOneCard();
                            //更新桌牌
                            toCardModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerPlayCard));
                        }
                    }
                    //播放动画
                    this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_playerCPGHAni, false, { num_id: cardModel.num_id, action: info.action, point: cardModel.cpghAniPoint, gender: cardModel.gender, type: info.huType });
                }
            }
        }
        else {
            MyConsole.getInstance().trace("重大失误 该接口--没有吃碰杠胡用户信息", 0);
        }
    };
    return AH_Game_playingModel;
}(AH_BaseModel));
__reflect(AH_Game_playingModel.prototype, "AH_Game_playingModel");
