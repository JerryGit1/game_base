var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 * 用户牌信息
 */
var AH_UserModel = (function (_super) {
    __extends(AH_UserModel, _super);
    function AH_UserModel() {
        var _this = _super.call(this) || this;
        _this.sendingCardAni = false; /*是否在出牌动画中 如果是刷新手牌要慢一点*/
        _this.needFaPai = false; /*是否需要请求发牌*/
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
        _this.actionsList = []; /*动作 吃碰杠胡*/
        _this.currentMjList = []; /*站（手）牌*/
        _this.currentMJCPGList = []; /*吃碰杠的牌*/
        _this.currentMJPLayList = []; /*打出的牌*/
        _this.newSendCardModel = new CardModel(); /*上次出牌信息*/
        //出牌的坐标起点
        _this.pHandSPoint = new egret.Point();
        //吃碰杠胡的坐标
        _this.cpghAniPoint = new egret.Point();
        //最新顯示牌的坐标终点
        _this.pHandNewPoint = new egret.Point();
        //出牌的坐标终点
        _this.pHandEPoint = new egret.Point();
        //动画缩放比例
        _this.pAniScale = .8;
        /*-----------------------手牌-基础手牌-----------------------------*/
        _this._isUpdateStopBoard = false; /*是否更新手牌*/
        _this.stopBoardJsonStr = "";
        /*设置最新發的牌信息*/
        _this.lastFaPaiJsonStr = "";
        /*-----------------------手牌-吃碰杠牌-----------------------------*/
        _this._isUpdateCpgBoard = false; /*是否更新吃碰杠牌*/
        _this.cpgBoardJsonStr = "";
        /*设置当前玩家动作*/
        _this._isUpdateActionBoard = false; /*是否更新当前玩家动作*/
        _this.actionJsonStr = "";
        return _this;
    }
    /*初始化数据*/
    AH_UserModel.prototype.init = function () {
        this.actionsList = this.currentMjList = this.currentMJCPGList = this.currentMJPLayList = [];
        this.newSendCardModel = new CardModel();
        this._isUpdateStopBoard = false;
        this.stopBoardJsonStr = "";
        this.lastFaPaiJsonStr = "";
        this._isUpdateCpgBoard = false;
        this.cpgBoardJsonStr = "";
        this._isUpdateActionBoard = false;
        this.actionJsonStr = "";
        //this.clearDirtyData();
    };
    /*清理脏数据*/
    AH_UserModel.prototype.clearDirtyData = function () {
        this["actions"] = null; //动作信息
        this["lastFaPai"] = null; //最新出牌信息
        this["userModel"] = null; //牌信息
    };
    Object.defineProperty(AH_UserModel.prototype, "stopBoard", {
        get: function () {
            return this.currentMjList;
        },
        /*设置站（手）牌*/
        set: function (list) {
            this.currentMjList = [];
            for (var i in list) {
                this.currentMjList.push(this.createCardModel(list[i][0]));
            }
            //排序
            this.stopHandOrder();
        },
        enumerable: true,
        configurable: true
    });
    AH_UserModel.prototype.setStopBoardNoOrder = function (list) {
        this.currentMjList = [];
        for (var i in list) {
            this.currentMjList.push(this.createCardModel(list[i][0]));
        }
    };
    /*玩家打牌 手牌少一张牌（当前玩家 其他玩家不在这）*/
    AH_UserModel.prototype.stopHandRemoveOneCard = function (type, num) {
        if (this.num_id != 1) {
            type = -1;
            num = -1;
        }
        for (var i in this.currentMjList) {
            if (this.currentMjList[i].type == type && this.currentMjList[i].num == num) {
                this.currentMjList.splice(Number(i), 1);
                //手牌排序
                this.stopHandOrder();
                //更新手牌视图
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerStopCard));
                return;
            }
        }
    };
    AH_UserModel.prototype.setNewSystemCard = function (list) {
        if (list && list[0] && this.lastFaPaiJsonStr != JSON.stringify(list)) {
            this.lastFaPaiJsonStr = JSON.stringify(list);
            this._isUpdateStopBoard = true; //更新牌
            this.newSendCardModel = new CardModel();
            this.newSendCardModel.type = list[0][0];
            this.newSendCardModel.num = list[0][1];
        }
    };
    /*系统发牌 玩家插入一张系统刚发的牌*/
    AH_UserModel.prototype.insertSystemStopCard = function (list) {
        if (list && list[0]) {
            if (this.playStatus == BaseModel.PLAYER_CHU || this.playStatus == BaseModel.PLAYER_WAIT) {
                if (this.currentMjList) {
                    //之前牌信息
                    for (var i in this.currentMjList) {
                        this.currentMjList[i]._isSystemCard = false; //之前的牌都不是系统最新牌了
                    }
                    //先排序
                    this.stopHandOrder();
                    //插入最新系统牌
                    this.newSystemCardInfo = list;
                    //插入最新牌数据
                    this.currentMjList.push(this.createCardModel(list[0], true));
                    MyConsole.getInstance().trace("更新系统最新发的手牌信息");
                    return true;
                }
            }
            else {
                MyConsole.getInstance().trace("重大失误 更新系统最新发的手牌时 玩家当前状态不对" + this.playStatus, 0);
            }
        }
        return false;
    };
    /*手牌排序*/
    AH_UserModel.prototype.stopHandOrder = function () {
        var i, s, len = this.currentMjList.length, num, num1, num2, type;
        /*排序*/
        for (i = 0; i < len - 1; i++) {
            for (s = i + 1; s < len; s++) {
                num1 = this.currentMjList[i].type * 9 + this.currentMjList[i].num;
                num2 = this.currentMjList[s].type * 9 + this.currentMjList[s].num;
                if (num1 > num2) {
                    type = this.currentMjList[i].type;
                    num = this.currentMjList[i].num;
                    this.currentMjList[i].type = this.currentMjList[s].type;
                    this.currentMjList[i].num = this.currentMjList[s].num;
                    this.currentMjList[s].type = type;
                    this.currentMjList[s].num = num;
                }
            }
        }
    };
    /*设置 吃碰杠牌*/
    AH_UserModel.prototype.setCpgBoard = function (paiType, list, arr) {
        var i, s, info, type, n;
        type = paiType; //tyq 修改
        for (i in list) {
            info = {
                type: type, time: Number(list[i].t), l: []
            };
            /*每一张牌*/
            if (type == 7) {
                for (s = 0; s < 3; s++) {
                    info.l.push([-1, -1]);
                }
                if (!list[i].l) {
                    info.l.push([-1, -1]);
                }
                else {
                    info.l.push(list[i].l[s][0]);
                }
            }
            else {
                if (list[i].l) {
                    for (s in list[i].l) {
                        for (n in list[i].l[s]) {
                            info.l.push(list[i].l[s][n]);
                        }
                    }
                }
                else {
                    MyConsole.getInstance().trace("重大bug 没有吃碰杠L信息", 0);
                }
            }
            info.l = JSON.stringify(info.l);
            arr.push(info);
        }
    };
    //设置 小杠
    AH_UserModel.prototype.setCpgXiaoBoard = function (type, list, arr) {
        var i, s, info, type, l;
        if (list && list.length > 0) {
            info = {
                type: type, time: Number(list[0].t), l: []
            };
            for (i in list) {
                for (s in list[i].l) {
                    info.l.push(list[i].l[s][0]);
                }
            }
            info.l = JSON.stringify(info.l);
            arr.push(info);
        }
    };
    /*吃碰杠排序*/
    AH_UserModel.prototype.setCPGOrder = function (arr) {
        /*按时间顺序排序*/
        this.currentMJCPGList = [];
        var i, s, type, l, t, cpgModel;
        for (i = 0; i < arr.length - 1; i++) {
            for (s = i + 1; s < arr.length; s++) {
                if (arr[i].time >= arr[s].time) {
                    type = arr[i].type;
                    l = arr[i].l;
                    t = arr[i].t;
                    arr[i].type = arr[s].type;
                    arr[i].l = arr[s].l;
                    arr[i].t = arr[s].t;
                    arr[s].type = type;
                    arr[s].l = l;
                    arr[s].t = t;
                }
            }
        }
        for (i in arr) {
            cpgModel = new CPGCardModel();
            cpgModel.type = arr[i].type;
            arr[i].l = JSON.parse(arr[i].l);
            for (s in arr[i].l) {
                cpgModel.list.push(this.createCardModel(arr[i].l[s]));
            }
            this.currentMJCPGList.push(cpgModel);
        }
        if (this.currentMJCPGList && this.currentMJCPGList.length > 4) {
            MyConsole.getInstance().trace("重大失误 居然超过了4个杠 userId" + this.userId, 0);
        }
    };
    Object.defineProperty(AH_UserModel.prototype, "cpgBoard", {
        get: function () {
            return this.currentMJCPGList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserModel.prototype, "playHand", {
        get: function () {
            return this.currentMJPLayList;
        },
        /*-----------------------桌牌------------------------------------*/
        /*设置打出的牌list */
        set: function (list) {
            var i;
            this.currentMJPLayList = [];
            for (i in list) {
                this.currentMJPLayList.push(this.createCardModel(list[i][0]));
            }
        },
        enumerable: true,
        configurable: true
    });
    AH_UserModel.prototype.setActions = function (list) {
        this.actionsList = [];
        if (list && this.actionJsonStr != JSON.stringify(list)) {
            if (this.playStatus == BaseModel.PLAYER_CHU || this.playStatus == BaseModel.PLAYER_WAIT) {
                var arr = [1, 2, 3, 4, 0], i, s, model; //顺序 吃 碰 杠 胡 过
                for (i in arr) {
                    for (s in list) {
                        if (arr[i] == Number(s)) {
                            model = new CpghBtnModel();
                            model.type = arr[i];
                            //玩家自己动作牌的信息
                            model.setCardModel(list[s]);
                            this.actionsList.push(model);
                            break;
                        }
                    }
                }
                if (this.actionsList.length > 0) {
                    this.actionJsonStr = JSON.stringify(list);
                    this._isUpdateActionBoard = true;
                    MyConsole.getInstance().trace("----玩家有吃碰杠胡的动作");
                }
            }
            else {
                MyConsole.getInstance().trace("重大bug 玩家 有吃碰杠胡指令动作但是状态不对" + this.playStatus, 0);
            }
        }
    };
    /*玩家打牌 桌牌中添加一张牌[1,2]*/
    AH_UserModel.prototype.playHandAddOneCard = function (list) {
        if (list) {
            this.currentMJPLayList.push(this.createCardModel(list));
        }
    };
    /*玩家打牌 被吃碰杠了 从桌牌移除*/
    AH_UserModel.prototype.playHandRemoveOneCard = function () {
        if (this.currentMJPLayList) {
            this.currentMJPLayList.pop();
        }
    };
    /*--------------------------------------------------------*/
    /*创建一张牌 基础model*/
    AH_UserModel.prototype.createCardModel = function (list, _isSystemCard) {
        if (_isSystemCard === void 0) { _isSystemCard = false; }
        var cardModel = new CardModel();
        cardModel.type = Number(list[0]);
        cardModel.num = Number(list[1]);
        cardModel._isSystemCard = _isSystemCard;
        return cardModel;
    };
    return AH_UserModel;
}(UserBaseModel));
__reflect(AH_UserModel.prototype, "AH_UserModel");
