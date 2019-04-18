var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/19.
 */
var AH_Game_RoomInfoModel = (function (_super) {
    __extends(AH_Game_RoomInfoModel, _super);
    function AH_Game_RoomInfoModel() {
        var _this = _super.call(this) || this;
        _this._openName = ""; /*房主昵稱*/
        _this._circleWind = 1; /*圈风 1东风圈 2西风圈 3北风圈 4南风圈*/
        _this._totalNum = 0; /*房间总圈数*/
        _this._lastNum = 0; /*房间剩余圈数*/
        _this._cnrrMJNum = 0; /*麻将剩余数量*/
        return _this;
    }
    /*开局初始化*/
    AH_Game_RoomInfoModel.prototype.initData = function () {
        this.killRoomModel = new Game_killRoomModel();
        this.initLastCardModel();
    };
    /*初始化最新出牌玩家信息*/
    AH_Game_RoomInfoModel.prototype.initLastCardModel = function () {
        this.lastPaiModel = new CardModel();
        this.lastUserId = null;
    };
    /*更新最新出牌玩家信息*/
    AH_Game_RoomInfoModel.prototype.setNewPlayHandUserInfo = function (lastPai, userId) {
        if (userId === void 0) { userId = null; }
        if (userId && lastPai) {
            this.lastUserId = Number(userId);
            this.lastPaiModel.type = lastPai[0][0];
            this.lastPaiModel.num = lastPai[0][1];
        }
        else {
            this.lastUserId = null;
        }
    };
    Object.defineProperty(AH_Game_RoomInfoModel.prototype, "circleWind", {
        get: function () {
            return this._circleWind;
        },
        set: function (value) {
            /*刷新*/
            if (this.circleWind != value) {
                this._circleWind = value;
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_circleWind));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_Game_RoomInfoModel.prototype, "totalNum", {
        get: function () {
            return this._totalNum;
        },
        set: function (value) {
            this._totalNum = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_Game_RoomInfoModel.prototype, "openName", {
        get: function () {
            return this._openName;
        },
        set: function (value) {
            this._openName = decodeURIComponent(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_Game_RoomInfoModel.prototype, "lastNum", {
        get: function () {
            return this._lastNum;
        },
        set: function (value) {
            /*刷新*/
            if (this._lastNum != value) {
                this._lastNum = value;
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_lastNum));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_Game_RoomInfoModel.prototype, "cnrrMJNum", {
        get: function () {
            return this._cnrrMJNum;
        },
        set: function (value) {
            /*刷新*/
            if (this._cnrrMJNum != value && this._cnrrMJNum >= 0) {
                this._cnrrMJNum = value;
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_cnrrMJNum));
            }
        },
        enumerable: true,
        configurable: true
    });
    /*更新解散房间信息*/
    AH_Game_RoomInfoModel.prototype.updateKillRoomInfo = function (data, userId) {
        if (data) {
            this.killRoomModel.dissolveTime = data.dissolveTime;
            this.killRoomModel.userId = data.userId;
            this.killRoomModel.userName = data.userName;
            this.killRoomModel.userImg = data.userImg;
            //其他人操作信息
            this.killRoomModel.othersAgree = data.othersAgree;
            //是否是发起人
            this.killRoomModel._isInitiator = false;
            if (userId == this.killRoomModel.userId) {
                this.killRoomModel._isInitiator = true;
            }
            //是否有过操作
            this.killRoomModel._isHandle = false;
            for (var i in this.killRoomModel.othersAgree) {
                if (this.killRoomModel.othersAgree[i].userId == userId && this.killRoomModel.othersAgree[i]["agree"] != 0) {
                    this.killRoomModel._isHandle = true;
                    break;
                }
            }
            //弹出解散房间框框
            PopupLayer.getInstance().addKillRoomView(this.killRoomModel, userId);
        }
    };
    return AH_Game_RoomInfoModel;
}(AH_BaseModel));
__reflect(AH_Game_RoomInfoModel.prototype, "AH_Game_RoomInfoModel");
