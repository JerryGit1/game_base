var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Duo Nuo on 2017/1/4.
 * 数据加载
 * 资源加载
 */
var LoadLayer = (function (_super) {
    __extends(LoadLayer, _super);
    function LoadLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadLayer.getInstance = function () {
        if (!this.view) {
            this.view = new LoadLayer();
        }
        return this.view;
    };
    return LoadLayer;
}(AH_LoadLayer));
__reflect(LoadLayer.prototype, "LoadLayer");
