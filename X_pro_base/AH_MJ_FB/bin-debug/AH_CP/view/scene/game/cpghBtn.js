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
 * 吃碰杠胡按钮
 */
var Game_cpghBtn = (function (_super) {
    __extends(Game_cpghBtn, _super);
    function Game_cpghBtn(model, textureStr) {
        if (textureStr === void 0) { textureStr = null; }
        return _super.call(this, model, textureStr) || this;
    }
    return Game_cpghBtn;
}(AH_Game_cpghBtn));
__reflect(Game_cpghBtn.prototype, "Game_cpghBtn");
