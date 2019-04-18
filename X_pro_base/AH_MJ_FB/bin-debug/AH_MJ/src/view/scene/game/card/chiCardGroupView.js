var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/20.
 *
 * 吃牌组合
 * 多个吃牌
 */
var AH_Game_chiCardGroupView = (function (_super) {
    __extends(AH_Game_chiCardGroupView, _super);
    function AH_Game_chiCardGroupView(list, cChiCardModel, w, type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        /*这以后要加个背景*/
        /*调整牌列表*/
        var i, cardView;
        var newCardList = list;
        if (_this.type == 1) {
            newCardList = _this.getNewCardList(list, cChiCardModel);
        }
        /*显示牌列表*/
        for (i in newCardList) {
            cardView = new Game_cardView(1, w);
            cardView.setNewCard(newCardList[i].type, newCardList[i].num);
            _this.addChild(cardView);
            cardView.x = 1 + Number(i) * w + w / 2;
            _this.h = cardView.h + 6;
        }
        _this.w = newCardList.length * w;
        _this.list = list;
        _this.graphics.beginFill(0x111111, .9);
        _this.graphics.drawRoundRect(-3, -_this.h / 2 - 2, _this.w + 10, _this.h + 4, 10, 10);
        _this.graphics.endFill();
        _this.touchEnabled = true;
        return _this;
    }
    /*调整新的牌列表*/
    AH_Game_chiCardGroupView.prototype.getNewCardList = function (list, cChiCardModel) {
        var arr = [], i, s, num, newCardList = [], _is;
        //加入最新那张牌
        for (i in list) {
            arr.push(list[i].num);
        }
        arr.push(cChiCardModel.num);
        //由大到小排序
        for (i = 0; i < arr.length - 1; i++) {
            for (s = i + 1; s < arr.length; s++) {
                if (arr[i] > arr[s]) {
                    num = arr[i];
                    arr[i] = arr[s];
                    arr[s] = num;
                }
            }
        }
        for (i in arr) {
            _is = false;
            for (s in list) {
                if (list[s].num == arr[i]) {
                    newCardList.push(list[s]);
                    _is = true;
                    break;
                }
            }
            if (!_is) {
                newCardList.push(cChiCardModel);
            }
        }
        return newCardList;
    };
    return AH_Game_chiCardGroupView;
}(BaseView));
__reflect(AH_Game_chiCardGroupView.prototype, "AH_Game_chiCardGroupView");
