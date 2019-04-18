var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/13.
 * 单选框组件
 {"group":"jushu","arr":{"6":[true,"b_p_selected",174,82,90,40],"10":[false,"",274,82,90,40],"16":[false,"",374,82,90,40]}}
 */
var H_radioAreaView = (function (_super) {
    __extends(H_radioAreaView, _super);
    function H_radioAreaView(obj) {
        return _super.call(this, obj) || this;
    }
    return H_radioAreaView;
}(AH_H_radioAreaView));
__reflect(H_radioAreaView.prototype, "H_radioAreaView");
