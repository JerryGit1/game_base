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
var SoundBtn = (function (_super) {
    __extends(SoundBtn, _super);
    function SoundBtn(titleTexture, openTexture, closeTexture, volume) {
        var _this = _super.call(this) || this;
        _this.openTexture = openTexture;
        _this.closeTexture = closeTexture;
        /*文字标题*/
        var title = new egret.Bitmap(RES.getRes(titleTexture));
        title.x = -86;
        _this.addChild(title);
        /*加载条背景*/
        var barBg = new egret.Bitmap(RES.getRes("h_progressBarBg"));
        barBg.x = 36;
        _this.addChild(barBg);
        _this.barWidth = barBg.width;
        _this.backBg = new egret.Shape();
        _this.backBg.graphics.beginFill(0x00ff00, 0);
        _this.backBg.graphics.drawRect(barBg.x, barBg.y - barBg.height * 3 / 2, barBg.width, barBg.height * 3);
        _this.backBg.graphics.endFill();
        _this.addChildAt(_this.backBg, 0);
        _this.backBg.touchEnabled = true;
        /*加载条*/
        _this.bar = new egret.Shape();
        _this.bar.x = 38;
        _this.bar.y = 6;
        _this.setProgress(volume * _this.barWidth);
        _this.addChild(_this.bar);
        /*音量按钮*/
        _this.volumeBtn = new egret.Bitmap(RES.getRes("h_progressBtn"));
        _this.volumeBtn.x = 22 + volume * _this.barWidth;
        _this.addChild(_this.volumeBtn);
        _this.backBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.changeVolumeBegin, _this);
        /*开关按钮*/
        _this.btn = new egret.Bitmap();
        _this.btn.touchEnabled = true;
        _this.addChild(_this.btn);
        _this.btn.x = 440;
        _this.btn.y = -10;
        _this.changTexture();
        _this.btn.addEventListener(egret.TouchEvent.TOUCH_END, _this.click, _this);
        return _this;
    }
    SoundBtn.prototype.click = function (e) {
        this.changTexture();
    };
    //改变纹理
    SoundBtn.prototype.changTexture = function (_is) {
        if (_is === void 0) { _is = null; }
        if (_is != null)
            this.bar.visible = this.volumeBtn.visible = _is;
    };
    SoundBtn.prototype.changeVolumeBegin = function (e) {
        this.changeEnd(null);
        this.backBg.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.changeVolume, this);
        this.backBg.addEventListener(egret.TouchEvent.TOUCH_END, this.changeEnd, this);
        this.moveBeginX = e.stageX;
        this.currentX = e.localX;
        this.changeVolume(e);
    };
    //改变音量
    SoundBtn.prototype.changeVolume = function (e) {
        var moveTarget = this.volumeBtn;
        var X1 = this.currentX + Math.floor(e.stageX - this.moveBeginX);
        if (X1 >= 22 && X1 < 382) {
            moveTarget.x = X1;
        }
        else {
            if (X1 < 22)
                moveTarget.x = 22;
            if (X1 > 382)
                moveTarget.x = 382;
        }
        var current = moveTarget.x - 22;
        var volume = current / this.barWidth;
        this.setVolume(volume);
        this.setProgress(current);
    };
    SoundBtn.prototype.changeEnd = function (e) {
        this.backBg.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.changeVolume, this);
        this.backBg.removeEventListener(egret.TouchEvent.TOUCH_END, this.changeEnd, this);
    };
    //设置音量
    SoundBtn.prototype.setVolume = function (volume) {
    };
    //设置进度条宽度
    SoundBtn.prototype.setProgress = function (current) {
        var matrix = new egret.Matrix();
        matrix.createGradientBox(current, 20, 90);
        this.bar.graphics.clear();
        this.bar.graphics.beginGradientFill(egret.GradientType.LINEAR, [0xfcf430, 0xf5a62d, 0xf06228], [1, 1, 1], [0, 125, 255], matrix);
        this.bar.graphics.drawRoundRect(0, -1, current - 2, 20, 20, 20);
    };
    SoundBtn.prototype.clear = function () {
        this.changeEnd(null);
        this.backBg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.changeVolumeBegin, this);
    };
    return SoundBtn;
}(BaseView));
__reflect(SoundBtn.prototype, "SoundBtn");
