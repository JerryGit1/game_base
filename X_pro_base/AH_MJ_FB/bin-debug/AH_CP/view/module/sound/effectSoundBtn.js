var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
var EffectSoundBtn = (function (_super) {
    __extends(EffectSoundBtn, _super);
    function EffectSoundBtn(bgTexture, openTexture, closeTexture) {
        return _super.call(this, bgTexture, openTexture, closeTexture) || this;
    }
    return EffectSoundBtn;
}(AH_EffectSoundBtn));
__reflect(EffectSoundBtn.prototype, "EffectSoundBtn");
