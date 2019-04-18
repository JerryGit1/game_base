var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//资源加载
var AH_LoadingUI = (function (_super) {
    __extends(AH_LoadingUI, _super);
    function AH_LoadingUI() {
        var _this = _super.call(this) || this;
        _this.barWidth = Main.stageWidth * .565;
        _this.createView();
        return _this;
    }
    AH_LoadingUI.prototype.createView = function () {
        /*背景*/
        var bit = new egret.Bitmap(RES.getRes("l_back"));
        bit.width = Main.stageWidth;
        bit.height = Main.stageHeight;
        this.addChild(bit);
        /*显示加载条背景*/
        var barBg = new egret.Bitmap(RES.getRes("l_barBg"));
        barBg.y = Main.stageHeight - barBg.height * 5;
        barBg.x = Main.stageWidth / 2 - barBg.width / 2;
        this.addChild(barBg);
        /*显示加载条*/
        this.bar = new egret.Shape();
        this.bar.y = barBg.y + barBg.height - 22;
        this.bar.x = Main.stageWidth / 2 - this.barWidth / 2;
        this.addChild(this.bar);
        /*显示小星星*/
        this.star = this.CCenterBit("l_star");
        this.star.x = this.bar.x;
        this.star.y = this.bar.y + 13;
        this.addChild(this.star);
        /*显示加载提示文本*/
        this.barTxt = new egret.TextField();
        this.barTxt.width = Main.stageWidth;
        this.barTxt.textAlign = "center";
        this.barTxt.y = barBg.y + 45;
        this.barTxt.textColor = 0xffffff;
        this.barTxt.size = 18;
        this.addChild(this.barTxt);
        //获取纹理
        var texture = RES.getRes("texture");
        var config = RES.getRes("texture_json");
        //创建 GravityParticleSystem
        this.system = new particle.GravityParticleSystem(texture, config);
        //启动粒子库
        this.system.start();
        //将例子系统添加到舞台
        this.addChild(this.system);
    };
    AH_LoadingUI.prototype.setProgress = function (current, total) {
        var matrix = new egret.Matrix();
        var w = Math.floor((current / total) * (this.barWidth));
        matrix.createGradientBox((current / total) * (this.barWidth), 19, 90);
        this.bar.graphics.clear();
        this.bar.graphics.beginGradientFill(egret.GradientType.LINEAR, [0xfcf430, 0xf5a62d, 0xf06228], [1, 1, 1], [0, 125, 255], matrix);
        this.bar.graphics.drawRoundRect(0, -1, w - 2, 19, 20, 20);
        this.star.x = this.bar.x + w - 70;
        this.barTxt.text = "资源加载中,请稍后.." + Math.round((current / total) * 100) + "%";
    };
    return AH_LoadingUI;
}(BaseView));
__reflect(AH_LoadingUI.prototype, "AH_LoadingUI");
