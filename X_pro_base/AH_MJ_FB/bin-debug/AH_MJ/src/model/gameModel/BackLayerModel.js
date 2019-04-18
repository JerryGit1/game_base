var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/14.
 */
var AH_Game_backLayerModel = (function (_super) {
    __extends(AH_Game_backLayerModel, _super);
    function AH_Game_backLayerModel(roomInfoModel, userGroupModel) {
        var _this = _super.call(this) || this;
        /*玩家头像坐标*/
        _this.headPos = [
            { "x": 45, "y": Main.stageHeight - BaseModel.USER_CARD_WIDTH * 2 },
            { "x": Main.stageWidth - 45, "y": Main.stageHeight / 2 - BaseModel.USER_CARD_WIDTH },
            { "x": Main.stageWidth - 210, "y": 55 },
            { "x": 45, "y": Main.stageHeight / 2 - BaseModel.USER_CARD_WIDTH }
        ];
        _this.playCountdownMaxNum = 10;
        _this.playCountdown = 0; //出牌倒计时
        _this.lastChatTime = 0; //上次发表情的时间
        _this.roomInfoModel = roomInfoModel;
        _this.userGroupModel = userGroupModel;
        //更新风向
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_updateClock, _this.updateClock, _this);
        return _this;
    }
    /*更新玩家信息*/
    AH_Game_backLayerModel.prototype.updatePlayerInfo = function (oPlayerInfo) {
        this.userGroupModel.setBaseInfo(oPlayerInfo);
        //更新风向
        this.updateClock();
    };
    //更新风向
    AH_Game_backLayerModel.prototype.updateClock = function () {
        var userModel, i;
        for (i = 1; i <= 4; i++) {
            userModel = this.userGroupModel.numIdGetUserModel(i);
            if (userModel.playStatus == BaseModel.PLAYER_CHU) {
                /*更新出牌风向位置*/
                if (this.windDirection != userModel.position) {
                    this.windDirection = userModel.position;
                    MyConsole.getInstance().trace("更新风向" + this.windDirection);
                    this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_clock));
                    this.setPlayCountdown(); //设置出牌倒计时
                }
            }
            //房主
            userModel.houseOwner = false;
            if (userModel.userId == Number(this.roomInfoModel.userId)) {
                userModel.houseOwner = true;
            }
        }
    };
    //出牌倒计时
    AH_Game_backLayerModel.prototype.setPlayCountdown = function () {
        if (this.playCountdownTime) {
            clearInterval(this.playCountdownTime);
        }
        this.playCountdown = this.playCountdownMaxNum;
        this.playCountdownTime = setInterval(function () {
            if (this.playCountdown >= 1) {
                this.playCountdown--;
                if (this.playCountdown <= 3) {
                    this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_twinkleAni));
                }
                this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_countdown));
            }
            else {
                clearInterval(this.playCountdownTime);
            }
        }.bind(this), 1000);
    };
    return AH_Game_backLayerModel;
}(AH_BaseModel));
__reflect(AH_Game_backLayerModel.prototype, "AH_Game_backLayerModel");
