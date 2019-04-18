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
var AH_EffectSoundBtn = (function (_super) {
    __extends(AH_EffectSoundBtn, _super);
    function AH_EffectSoundBtn(bgTexture, openTexture, closeTexture) {
        var _this = this;
        var volume = SoundModel.getEffectVolume();
        _this = _super.call(this, bgTexture, openTexture, closeTexture, volume) || this;
        return _this;
    }
    AH_EffectSoundBtn.prototype.click = function (e) {
        SoundModel.setEffectSound();
        _super.prototype.click.call(this, e);
    };
    //改变纹理
    AH_EffectSoundBtn.prototype.changTexture = function () {
        this.btn.texture = RES.getRes(SoundModel.getEffectSound() ? this.openTexture : this.closeTexture);
        _super.prototype.changTexture.call(this, SoundModel.getEffectSound());
    };
    //设置音量
    AH_EffectSoundBtn.prototype.setVolume = function (volume) {
        SoundModel.setEffectVolume(volume);
    };
    return AH_EffectSoundBtn;
}(SoundBtn));
__reflect(AH_EffectSoundBtn.prototype, "AH_EffectSoundBtn");
