var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Administrator on 2016/12/19.
 */
var PopupLayer = (function (_super) {
    __extends(PopupLayer, _super);
    function PopupLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PopupLayer.getInstance = function () {
        if (!this.tanchuang) {
            this.tanchuang = new PopupLayer();
        }
        return this.tanchuang;
    };
    return PopupLayer;
}(AH_PopupLayer));
__reflect(PopupLayer.prototype, "PopupLayer");
