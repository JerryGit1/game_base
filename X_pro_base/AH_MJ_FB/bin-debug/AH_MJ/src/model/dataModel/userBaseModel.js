var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/13.
 * 用户基础信息
 */
var AH_UserBaseModel = (function (_super) {
    __extends(AH_UserBaseModel, _super);
    function AH_UserBaseModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.num_id = 1; /*房间位置id 1玩家自己 2玩家下家 3对家 4上家*/
        _this.houseOwner = false; //是否是房主
        _this.joinIndex = 0; //加入顺序1.6.8新增
        _this._userAgree = true; /*用户协议是否通过*/
        _this._chatVoiceStatus = false; /*玩家是否在播放语音状态*/
        /*
        * playStatus的值有
         dating         用户在大厅中
         in                  刚进入房间，等待状态
         prepared    准备状态
         chu               出牌状态（该出牌了）
         wait              等待状态（非出牌状态）
         xjs                 小结算
         none            这个位置没人（等待阶段 掉线或者退出房间）
        * **/
        _this._playStatus = "";
        return _this;
    }
    Object.defineProperty(AH_UserBaseModel.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "openName", {
        get: function () {
            return this._openName;
        },
        set: function (value) {
            if (this._openName != value) {
                this._openName = value;
                this._openName = String(decodeURIComponent(this._openName));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "openImg", {
        get: function () {
            return this._openImg;
        },
        set: function (value) {
            this._openImg = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "userAgree", {
        get: function () {
            return this._userAgree;
        },
        set: function (value) {
            this._userAgree = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "money", {
        get: function () {
            return this._money;
        },
        set: function (value) {
            if (this._money != value) {
                this._money = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (value) {
            if (!this._score || this._score != value) {
                this._score = value;
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "notice", {
        get: function () {
            return this._notice;
        },
        set: function (value) {
            this._notice = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        set: function (value) {
            if (this._userId != Number(value)) {
                this._userId = Number(value);
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "playStatus", {
        get: function () {
            return this._playStatus;
        },
        set: function (value) {
            if (this._playStatus != value) {
                this._playStatus = value;
                setTimeout(function () {
                    this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerState));
                }.bind(this), 300);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (value) {
            if (this._status != value) {
                this._status = value;
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerLineState));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "ip", {
        get: function () {
            return this._ip;
        },
        set: function (value) {
            this._ip = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "zhuang", {
        get: function () {
            return this._zhuang;
        },
        set: function (value) {
            this._zhuang = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UserBaseModel.prototype, "chatVoiceStatus", {
        get: function () {
            return this._chatVoiceStatus;
        },
        set: function (value) {
            if (this._chatVoiceStatus != value) {
                this._chatVoiceStatus = value;
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_chatVoiceStatus));
            }
        },
        enumerable: true,
        configurable: true
    });
    return AH_UserBaseModel;
}(AH_BaseModel));
__reflect(AH_UserBaseModel.prototype, "AH_UserBaseModel");
