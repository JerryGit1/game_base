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
var AH_Game_cpghBtn = (function (_super) {
    __extends(AH_Game_cpghBtn, _super);
    function AH_Game_cpghBtn(model, textureStr) {
        if (textureStr === void 0) { textureStr = null; }
        var _this = this;
        if (!textureStr)
            textureStr = "g_cpghBtn_" + model.type;
        _this = _super.call(this, "g_cpghBtn_bg", textureStr) || this;
        _this.model = model;
        return _this;
    }
    return AH_Game_cpghBtn;
}(AH_DoubleBtn));
__reflect(AH_Game_cpghBtn.prototype, "AH_Game_cpghBtn");
