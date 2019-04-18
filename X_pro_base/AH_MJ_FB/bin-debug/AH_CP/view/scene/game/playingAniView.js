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
 *
 * 游戏中动画层
 * 出牌 放最底下
 * 吃碰杠胡
 */
var Game_playingAniView = (function (_super) {
    __extends(Game_playingAniView, _super);
    function Game_playingAniView(model) {
        return _super.call(this, model) || this;
    }
    return Game_playingAniView;
}(AH_Game_playingAniView));
__reflect(Game_playingAniView.prototype, "Game_playingAniView");
