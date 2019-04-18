var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shape = egret.Shape;
/**
 * Created by 韩 on 2017/7/11.
 * 创建房间弹框
 */
var AH_H_createRoomView = (function (_super) {
    __extends(AH_H_createRoomView, _super);
    function AH_H_createRoomView() {
        var _this = _super.call(this) || this;
        var bg = _this.addMsgBg(Main.stageWidth * .7, Main.stageHeight * .7); //"b_p_bg",
        // var x = bg.width-30;
        // var y = 7;
        var x = bg.width - 7;
        var y = 5;
        _this.addCloseBtn(x, y, "b_p_closeBtn");
        _this.addTitle("h_createRoom_title", _this.centerSp.width / 2, 35);
        _this.openAni();
        _this.createCheckoutbox(216, 114);
        _this.createCheckoutbox(380, 114);
        _this.createCheckoutbox(554, 114);
        _this.createCheckoutbox(216, 198);
        _this.createCheckoutbox(380, 198);
        _this.createCheckoutbox(216, 284);
        _this.createCheckoutbox(380, 284);
        // 局数
        _this.gameModel = new egret.Bitmap(RES.getRes("h_circleNum"));
        _this.gameModel.x = 66;
        _this.gameModel.y = 110;
        _this.centerSp.addChild(_this.gameModel);
        var msg = { "group": "circleNum", "arr": { "2": [true, "", 216, _this.gameModel.y - 8, 90, 40, "h_circleNum_2"], "4": [false, "", 380, _this.gameModel.y - 8, 90, 40, "h_circleNum_4"], "8": [false, "", 552, _this.gameModel.y - 8, 90, 40, "h_circleNum_8"] } };
        _this.checkoutBoxed = new H_radioAreaView(msg);
        _this.centerSp.addChild(_this.checkoutBoxed);
        // 模式
        /*"1":[true,"",210,this.gameModelTitle.y,90,40,"h_roomType_1"]   房主模式
         * ,"2":[false,"",374,this.gameModelTitle.y,90,40,"h_roomType_2"]  自由模式
         * */
        _this.gameModelTitle = new egret.Bitmap(RES.getRes("h_roomType"));
        _this.gameModelTitle.x = 66;
        _this.gameModelTitle.y = 196;
        _this.centerSp.addChild(_this.gameModelTitle);
        var msg2;
        msg2 = { "group": "roomType", "arr": { "1": [true, "", 216, _this.gameModelTitle.y - 8, 90, 40, "h_roomType_1"], "2": [false, "", 380, _this.gameModelTitle.y - 8, 90, 40, "h_roomType_2"] } };
        _this.gameModeled = new H_radioAreaView(msg2);
        _this.centerSp.addChild(_this.gameModeled);
        // 封顶分数
        _this.maxScoreTile = new egret.Bitmap(RES.getRes("h_maxScore"));
        _this.maxScoreTile.x = 66;
        _this.maxScoreTile.y = 282;
        _this.centerSp.addChild(_this.maxScoreTile);
        var msg3 = { "group": "maxScore", "arr": { "20": [true, "", 216, _this.maxScoreTile.y - 8, 90, 40, "h_maxScore_20"], "40": [false, "", 380, _this.maxScoreTile.y - 8, 90, 40, "h_maxScore_40"] } };
        _this.maxScore = new H_radioAreaView(msg3);
        _this.centerSp.addChild(_this.maxScore);
        // 确定按钮
        _this.sure = new MyButton("h_sureBtn");
        _this.sure.x = bg.width / 2;
        _this.sure.y = (bg.height - _this.sure.height) + 10;
        _this.sure.addTouchEvent();
        _this.sure.addEventListener("click", function () {
            var circleNum = this.checkoutBoxed.currentValue;
            var roomType = this.gameModeled.currentValue;
            var maxScore = this.maxScore.currentValue;
            var data = { "circleNum": circleNum, "roomType": roomType, "maxScore": maxScore };
            BaseModel.getInstance().eventRadio("createRoom", data);
            //关闭弹窗
            this.closeClick();
        }, _this);
        _this.centerSp.addChild(_this.sure);
        return _this;
    }
    AH_H_createRoomView.prototype.createCheckoutbox = function (x, y) {
        this.checkoutBox = new egret.Bitmap(RES.getRes("b_p_checkoutBox"));
        this.checkoutBox.x = x;
        this.checkoutBox.y = y;
        this.centerSp.addChild(this.checkoutBox);
    };
    return AH_H_createRoomView;
}(PopupBaseView));
__reflect(AH_H_createRoomView.prototype, "AH_H_createRoomView");
