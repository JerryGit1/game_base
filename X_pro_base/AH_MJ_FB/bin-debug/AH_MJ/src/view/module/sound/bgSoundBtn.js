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
var BgSoundBtn = (function (_super) {
    __extends(BgSoundBtn, _super);
    function BgSoundBtn(bgTexture, openTexture, closeTexture) {
        var _this = this;
        var volume = SoundModel.getBackSoundVolume();
        _this = _super.call(this, bgTexture, openTexture, closeTexture, volume) || this;
        return _this;
    }
    BgSoundBtn.prototype.click = function (e) {
        SoundModel.setBgSound();
        _super.prototype.click.call(this, e);
    };
    //改变纹理
    BgSoundBtn.prototype.changTexture = function () {
        this.btn.texture = RES.getRes(SoundModel.getBgSound() ? this.openTexture : this.closeTexture);
        _super.prototype.changTexture.call(this, SoundModel.getBgSound());
    };
    //设置音量
    BgSoundBtn.prototype.setVolume = function (volume) {
        SoundModel.setBackSoundVolume(volume);
    };
    return BgSoundBtn;
}(SoundBtn));
__reflect(BgSoundBtn.prototype, "BgSoundBtn");
