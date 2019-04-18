var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Admin on 2015/12/22.
 */
var MyButton = (function (_super) {
    __extends(MyButton, _super);
    function MyButton(st1) {
        var _this = _super.call(this) || this;
        _this.str1 = "";
        _this.str1 = st1;
        _this.addCard(_this.str1);
        return _this;
    }
    //添加事件
    MyButton.prototype.addTouchEvent = function () {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
    };
    //取消事件
    MyButton.prototype.cutTouchEvent = function () {
        this.touchEnabled = false;
    };
    //鼠标按下事件
    MyButton.prototype.touchBegin = function (e) {
        if (this.btnChannel) {
            this.btnChannel.stop();
        }
        if (RES.getRes(this.str1 + "_2")) {
            this.changTexture(this.str1 + "_2");
        }
        egret.Tween.get(this).to({ scaleX: 1.1, scaleY: 1.1 }, 70);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEnd, this);
    };
    //鼠标弹起
    MyButton.prototype.touchEnd = function (e) {
        this.changTexture(this.str1);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 50);
        //播放音效
        SoundModel.playSoundEffect("btnClick");
        //派发点击事件
        this.dispatchEvent(new egret.Event("click"));
    };
    //销毁
    MyButton.prototype.clear = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
    };
    MyButton.prototype.addCard = function (str) {
        if (this.card == null) {
            this.card = new egret.Bitmap();
            this.addChild(this.card);
        }
        this.card.texture = RES.getRes(str);
        this.card.x = -this.card.width / 2;
        this.card.y = -this.card.height / 2;
    };
    //改变纹理
    MyButton.prototype.changTexture = function (str) {
        this.card.texture = RES.getRes(str);
    };
    //缩放大小
    MyButton.prototype.changeSize = function (scaleX, scaleY) {
        this.card.scaleX = scaleX;
        this.card.scaleY = scaleY;
        this.card.x += this.card.width * ((1 - scaleX) / 2);
        this.card.y += this.card.height * ((1 - scaleY) / 2);
    };
    return MyButton;
}(BaseView));
__reflect(MyButton.prototype, "MyButton");
