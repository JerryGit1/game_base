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
var AH_Game_user_infoView = (function (_super) {
    __extends(AH_Game_user_infoView, _super);
    function AH_Game_user_infoView() {
        var _this = _super.call(this) || this;
        var bg = _this.CCenterBit("g_userInfoBg");
        bg.x = 5;
        bg.y = 8;
        // this.addChild(bg);
        //昵称
        /* 1.2.0 删除
        var nickNameTxt=new egret.TextField();
        this.addChild(nickNameTxt);
        nickNameTxt.size=16;
        nickNameTxt.textColor=0xffffff;
        nickNameTxt.multiline=true;
        nickNameTxt.textAlign="center";
        nickNameTxt.verticalAlign="middle";
        nickNameTxt.width=bg.width;
        nickNameTxt.x=-66;
        nickNameTxt.y=-23;
        this.setPointY(nickNameTxt);
        nickNameTxt.fontFamily="微软雅黑";
        this.nickNameTxt=nickNameTxt;*/
        //分数
        var yuanbaoText = new egret.TextField();
        _this.addChild(yuanbaoText);
        yuanbaoText.textColor = 0xf0b921;
        yuanbaoText.multiline = true;
        yuanbaoText.textAlign = "center";
        yuanbaoText.verticalAlign = "middle";
        yuanbaoText.width = bg.width;
        yuanbaoText.fontFamily = "微软雅黑";
        yuanbaoText.size = 22;
        yuanbaoText.x = -50;
        yuanbaoText.y = 0;
        _this.setPointY(yuanbaoText);
        _this.yuanbaoText = yuanbaoText;
        return _this;
    }
    /*更新数据*/
    AH_Game_user_infoView.prototype.updateInfo = function (yuanBao, nickNameStr) {
        if (yuanBao === void 0) { yuanBao = null; }
        if (nickNameStr === void 0) { nickNameStr = null; }
        if (yuanBao != null) {
            if (this.yuanbaoText.text) {
                var num = Number(this.yuanbaoText.text);
                if (num < yuanBao)
                    this.increaseScore(num, yuanBao);
                if (num > yuanBao)
                    this.decreaseScore(num, yuanBao);
            }
            else
                this.yuanbaoText.text = yuanBao;
        }
        /* 1.2.0 删除
        if(nickNameStr!=null){
            if(nickNameStr.length>6)nickNameStr=nickNameStr.substr(0,6)+"...";
            this.nickNameTxt.text=decodeURI(nickNameStr);
        }*/
    };
    AH_Game_user_infoView.prototype.increaseScore = function (startNum, endNum) {
        var num = startNum;
        var self = this;
        var handle = setInterval(function () {
            num += 2;
            self.yuanbaoText.text = "" + num;
            if (num == endNum) {
                clearInterval(handle);
            }
        }, 20);
    };
    AH_Game_user_infoView.prototype.decreaseScore = function (startNum, endNum) {
        var num = startNum;
        var self = this;
        var handle = setInterval(function () {
            num -= 2;
            self.yuanbaoText.text = "" + num;
            if (num == endNum) {
                clearInterval(handle);
            }
        }, 20);
    };
    return AH_Game_user_infoView;
}(BaseView));
__reflect(AH_Game_user_infoView.prototype, "AH_Game_user_infoView");
