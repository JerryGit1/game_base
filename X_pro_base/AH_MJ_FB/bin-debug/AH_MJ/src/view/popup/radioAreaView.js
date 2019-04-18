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
var AH_H_radioAreaView = (function (_super) {
    __extends(AH_H_radioAreaView, _super);
    function AH_H_radioAreaView(obj) {
        var _this = _super.call(this) || this;
        _this.selected = [];
        _this.currentValue = "";
        var _self = _this;
        var clickArea;
        for (var key in obj.arr) {
            var b1 = obj.arr[key][0]; //默认是否远中
            var b2 = obj.arr[key][1]; //选中时的图片
            var b3 = obj.arr[key][2]; //选中图片的X坐标
            var b4 = obj.arr[key][3]; //选中图片的Y坐标
            var b5 = obj.arr[key][4]; //可点击区域的宽度
            var b6 = obj.arr[key][5]; //可点击区域的高度
            var b7 = obj.arr[key][6]; //选项名称
            clickArea = new H_selectBtn(b1, b2, b3, b4, b5, b6, b7);
            clickArea.name = key;
            clickArea.addEventListener("selected", _this.setBtns, _this);
            _this.addChild(clickArea);
            _this.selected.push(clickArea);
            if (b1) {
                clickArea.setTexture("b_p_selected");
                _this.currentValue = clickArea.name;
            }
        }
        return _this;
    }
    AH_H_radioAreaView.prototype.setBtns = function (e) {
        for (var key in this.selected) {
            this.selected[key].setTexture(null);
        }
        var btn = e.target;
        btn.setTexture("b_p_selected");
        this.currentValue = btn.name;
    };
    return AH_H_radioAreaView;
}(BaseView));
__reflect(AH_H_radioAreaView.prototype, "AH_H_radioAreaView");
