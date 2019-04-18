var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/19.
 */
var AH_CpghBtnModel = (function (_super) {
    __extends(AH_CpghBtnModel, _super);
    function AH_CpghBtnModel() {
        return _super.call(this) || this;
    }
    /*设置吃碰杠牌数据*/
    AH_CpghBtnModel.prototype.setCardModel = function (list) {
        this.huPaiUserId = null;
        if (list)
            this.cardJsonInfo = JSON.stringify(list[0]); //传给后端数据
        if (this.type == 1 || this.type == 3) {
            if (list.length > 1) {
                var i, cardModel;
                this.cardList = [];
                for (i in list) {
                    this.cardList[i] = [];
                    for (var s in list[i]) {
                        cardModel = new CardModel();
                        cardModel.type = list[i][s][0];
                        cardModel.num = list[i][s][1];
                        this.cardList[i].push(cardModel);
                    }
                }
            }
        }
        else if (this.type == 4) {
            this.huPaiUserId = Number(list);
        }
    };
    /*单独设置多个吃牌json数据*/
    AH_CpghBtnModel.prototype.setChiJsonStr = function (info) {
        var arr = [], brr;
        for (var i in info) {
            brr = [info[i].type, info[i].num];
            arr.push(brr);
        }
        this.cardJsonInfo = JSON.stringify(arr);
    };
    return AH_CpghBtnModel;
}(AH_BaseModel));
__reflect(AH_CpghBtnModel.prototype, "AH_CpghBtnModel");
