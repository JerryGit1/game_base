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
 */
var Game_user3CardsView = (function (_super) {
    __extends(Game_user3CardsView, _super);
    function Game_user3CardsView(model) {
        return _super.call(this, model) || this;
    }
    return Game_user3CardsView;
}(AH_Game_user3CardsView));
__reflect(Game_user3CardsView.prototype, "Game_user3CardsView");
