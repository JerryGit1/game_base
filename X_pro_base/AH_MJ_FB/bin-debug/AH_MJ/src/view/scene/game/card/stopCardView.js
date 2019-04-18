var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/20.
 * 玩家手牌 类
 */
var AH_Game_stopCardView = (function (_super) {
    __extends(AH_Game_stopCardView, _super);
    function AH_Game_stopCardView(bgType, w, _isTouch) {
        var _this = _super.call(this, bgType, w) || this;
        /**
         * 状态
         * 0 等待操作状态
         * 1 点击激活状态
         * 2 拖动状态
         * */
        _this._currentType = 0;
        /*初始坐标*/
        _this.initY = 0;
        _this.initX = 0;
        /*是否超出边界*/
        _this._isOut = false;
        if (_isTouch) {
            _this.bg.touchEnabled = true;
        }
        return _this;
    }
    Object.defineProperty(AH_Game_stopCardView.prototype, "currentType", {
        get: function () {
            return this._currentType;
        },
        set: function (value) {
            if (this._currentType != value || this._isOut) {
                this._currentType = value;
                //起立动画
                egret.Tween.removeTweens(this);
                if (this._currentType == 1) {
                    egret.Tween.get(this).to({ y: this.initY - BaseModel.USER_CARD_WIDTH * .3, x: this.initX }, 100);
                }
                else if (this._currentType == 0) {
                    egret.Tween.get(this).to({ y: this.initY, x: this.initX }, 50);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return AH_Game_stopCardView;
}(Game_cardView));
__reflect(AH_Game_stopCardView.prototype, "AH_Game_stopCardView");
