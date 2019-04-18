var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 周鹏斌大王 on 2017/7/16.
 *
 * 风向组件
 */
var Game_clockView = (function (_super) {
    __extends(Game_clockView, _super);
    function Game_clockView() {
        return _super.call(this) || this;
    }
    return Game_clockView;
}(AH_Game_clockView));
__reflect(Game_clockView.prototype, "Game_clockView");
