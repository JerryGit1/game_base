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
var AH_Game_clockView = (function (_super) {
    __extends(AH_Game_clockView, _super);
    function AH_Game_clockView() {
        var _this = _super.call(this) || this;
        _this.bg = _this.CCenterBit("g_clockBg1");
        _this.addChild(_this.bg);
        _this.hand = new egret.Bitmap();
        _this.hand.texture = RES.getRes("g_clock_east");
        _this.hand.anchorOffsetX = _this.hand.width / 2;
        _this.hand.anchorOffsetY = _this.hand.height / 2;
        _this.addChild(_this.hand);
        return _this;
    }
    /*更新风向旋转 不同玩家风向不同*/
    AH_Game_clockView.prototype.setRotation = function (position) {
        this.bg.texture = RES.getRes("g_clockBg" + position);
    };
    //更新出牌指针方向
    AH_Game_clockView.prototype.updateHand = function (position, hand) {
        switch (position) {
            case 1:
                this.hand.texture = RES.getRes("g_clock_east" + hand);
                break;
            case 2:
                this.hand.texture = RES.getRes("g_clock_south" + hand);
                break;
            case 3:
                this.hand.texture = RES.getRes("g_clock_west" + hand);
                break;
            case 4:
                this.hand.texture = RES.getRes("g_clock_north" + hand);
                break;
        }
    };
    //剩余2秒时 闪烁动画
    AH_Game_clockView.prototype.twinkleAni = function (bloor, playCountdown) {
        egret.Tween.get(this.hand).to({ "alpha": 0.7 }, 200).wait(100).to({ "alpha": 1 }, 200); //,{"loop":true}
        // 韩月辉
        if (bloor && playCountdown == 3) {
            SoundModel.playSoundEffect("timeup");
        }
    };
    return AH_Game_clockView;
}(BaseView));
__reflect(AH_Game_clockView.prototype, "AH_Game_clockView");
