var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var systemRenderer = egret.sys.systemRenderer;
/**
 * Created by 韩 on 2017/7/10.
 * 消息弹框
 */
var H_news = (function (_super) {
    __extends(H_news, _super);
    function H_news() {
        return _super.call(this) || this;
    }
    return H_news;
}(AH_H_news));
__reflect(H_news.prototype, "H_news");
