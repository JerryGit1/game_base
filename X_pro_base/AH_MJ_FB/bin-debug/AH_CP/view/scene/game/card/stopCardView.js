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
var Game_stopCardView = (function (_super) {
    __extends(Game_stopCardView, _super);
    function Game_stopCardView(bgType, w, _isTouch) {
        return _super.call(this, bgType, w, _isTouch) || this;
    }
    return Game_stopCardView;
}(AH_Game_stopCardView));
__reflect(Game_stopCardView.prototype, "Game_stopCardView");
