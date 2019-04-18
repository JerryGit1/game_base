var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/22.
 */
var AH_Game_waitBtnView = (function (_super) {
    __extends(AH_Game_waitBtnView, _super);
    function AH_Game_waitBtnView(str, model) {
        var _this = _super.call(this, str) || this;
        _this.model = model;
        //玩家状态更新
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerState, _this.updateStateInfo, _this);
        _this.updateStateInfo();
        return _this;
    }
    AH_Game_waitBtnView.prototype.updateStateInfo = function (e) {
        if (e === void 0) { e = null; }
        if (this.model.playStatus == BaseModel.PLAYER_PREPARED) {
            this.visible = true;
        }
        else {
            this.visible = false;
        }
    };
    AH_Game_waitBtnView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerState, this.updateStateInfo, this);
    };
    return AH_Game_waitBtnView;
}(MyButton));
__reflect(AH_Game_waitBtnView.prototype, "AH_Game_waitBtnView");
