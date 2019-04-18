var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/11.
 * 加入游戏弹框
 */
var AH_H_joinRoomView = (function (_super) {
    __extends(AH_H_joinRoomView, _super);
    function AH_H_joinRoomView() {
        var _this = _super.call(this) || this;
        _this.NumberBtn = ["1", "2", "3", "4", "5", "6", "7", "8", "resetBtn", "9", "0", "delBtn"];
        _this.NumberArr = [];
        _this.inputStr = "";
        var bg = _this.addMsgBg(Main.stageWidth * .6, Main.stageHeight * .65); //"b_p_bg",
        // var x = bg.width-35;
        // var y = 7;
        var x = bg.width - 7;
        var y = 5;
        _this.addCloseBtn(x, y, "b_p_closeBtn");
        _this.addTitle("h_joinRoom_title", _this.centerSp.width / 2, 35);
        _this.roomNumBg = new egret.Bitmap(RES.getRes("h_roomNumBg"));
        _this.roomNumBg.x = 65;
        _this.roomNumBg.y = 85;
        _this.centerSp.addChild(_this.roomNumBg);
        _this.openAni();
        var i = -1;
        for (var _i = 0, _a = _this.NumberBtn; _i < _a.length; _i++) {
            var btn = _a[_i];
            i++;
            var buttonG = new H_joinRoomNumBtn(btn);
            buttonG.x = 150 + i % 4 * 125;
            buttonG.y = bg.height * 0.45 + Math.floor(i / 4) * 80;
            buttonG.addTouchEvent();
            buttonG.addEventListener("click", _this.numBtnClick, _this);
            _this.centerSp.addChild(buttonG);
        }
        _this.createNum(bg);
        return _this;
    }
    AH_H_joinRoomView.prototype.numBtnClick = function (e) {
        var str = e.target.num;
        switch (str) {
            case "resetBtn":
                this.inputStr = "";
                break;
            case "delBtn":
                this.inputStr = this.inputStr.slice(0, this.inputStr.length - 1);
                break;
            default:
                if (this.inputStr.length <= 5)
                    this.inputStr += str;
                break;
        }
        this.setTxtNum();
    };
    AH_H_joinRoomView.prototype.setTxtNum = function () {
        for (var i in this.NumberArr) {
            this.NumberArr[Number(i)].text = "";
            if (this.inputStr.length - 1 >= Number(i)) {
                this.NumberArr[Number(i)].text = this.inputStr.slice(Number(i), Number(i) + 1);
            }
            ;
        }
        if (this.inputStr.length == 6) {
            BaseModel.getInstance().eventRadio("joinRoom", { roomSn: this.inputStr });
            this.inputStr = "";
            this.setTxtNum();
        }
    };
    AH_H_joinRoomView.prototype.createNum = function (bg) {
        for (var i = 0; i < 6; i++) {
            var numberBg = new egret.Bitmap(RES.getRes("h_num_downBar"));
            numberBg.x = 136 + 74 * i;
            numberBg.y = 135;
            this.centerSp.addChild(numberBg);
            var numberText = new egret.TextField();
            numberText.width = 60;
            numberText.height = 60;
            // numberText.textColor = 0x543016;
            numberText.size = 40;
            numberText.textAlign = "center";
            numberText.fontFamily = "微软雅黑";
            numberText.verticalAlign = "middle";
            numberText.x = numberBg.x - numberBg.width / 2; //bg.width*0.82 - 74*(6-i);
            numberText.y = 85;
            this.centerSp.addChild(numberText);
            this.NumberArr.push(numberText);
        }
    };
    return AH_H_joinRoomView;
}(PopupBaseView));
__reflect(AH_H_joinRoomView.prototype, "AH_H_joinRoomView");
