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
 *
 * 一局结束到下一局等待场景
 */
var AH_WaitScene = (function (_super) {
    __extends(AH_WaitScene, _super);
    function AH_WaitScene(model) {
        var _this = _super.call(this, model) || this;
        _this.btnList = [];
        var i, btn;
        var list = [
            { "x": Main.stageWidth * 0.5, "y": Main.stageHeight * 0.8 },
            { "x": Main.stageWidth * 0.72, "y": Main.stageHeight * 0.5 },
            { "x": Main.stageWidth * 0.5, "y": Main.stageHeight * 0.2 },
            { "x": Main.stageWidth * 0.28, "y": Main.stageHeight * 0.5 },
        ];
        for (i = 1; i <= 4; i++) {
            btn = new Game_waitBtnView("g_readyBtn", _this.model.userGroupModel.numIdGetUserModel(i));
            btn.x = list[i - 1].x;
            btn.y = list[i - 1].y;
            _this.addChild(btn);
            _this.btnList.push(btn);
        }
        return _this;
    }
    AH_WaitScene.prototype.clear = function () {
        _super.prototype.clear.call(this);
        for (var i in this.btnList) {
            this.btnList[i].clear();
        }
        this.btnList = null;
    };
    return AH_WaitScene;
}(AH_GameBaseScene));
__reflect(AH_WaitScene.prototype, "AH_WaitScene");
