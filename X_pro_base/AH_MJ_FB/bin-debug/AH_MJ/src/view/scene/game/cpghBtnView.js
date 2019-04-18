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
var AH_Game_cpghBtnView = (function (_super) {
    __extends(AH_Game_cpghBtnView, _super);
    function AH_Game_cpghBtnView() {
        var _this = _super.call(this) || this;
        _this.btnY = Main.stageHeight - BaseModel.USER_CARD_WIDTH * 3;
        _this.graphics.beginFill(0x00ff00, 0);
        _this.graphics.drawRect(0, 0, Main.stageWidth, Main.stageHeight);
        _this.graphics.endFill();
        _this.touchEnabled = true;
        return _this;
    }
    /*显示吃碰杠胡按钮*/
    AH_Game_cpghBtnView.prototype.addBtnList = function (list) {
        this.clearPage();
        var x = Main.stageWidth - 70 - list.length * 100, vy = Main.stageHeight - BaseModel.USER_CARD_WIDTH * 2.1;
        for (var i in list) {
            var btn = new Game_cpghBtn(list[i]);
            btn.x = x;
            if (Number(i) == list.length - 1)
                btn.x += 20;
            btn.y = vy + btn.height / 2;
            btn.alpha = 0;
            x += 100;
            this.addChild(btn);
            /*出场动画*/
            egret.Tween.get(btn).wait(Number(i) * 130).to({ y: vy - 10, alpha: 1 }, 300).to({ y: vy }, 120).call(function (btn) {
                btn.addTouchEvent();
            }, this, [btn]);
            /*事件*/
            btn.addEventListener("click", this.btnClick, this);
            /*存一哈过得数据 多个吃选择时用*/
            if (list[i].type == 0) {
                this.guoModel = list[i];
            }
        }
    };
    /*点击吃碰杠胡操作按钮*/
    AH_Game_cpghBtnView.prototype.btnClick = function (e) {
        var btn = e.currentTarget;
        this.clearPage();
        if ((btn.model.type == 1 || btn.model.type == 3) && btn.model.cardList) {
            //多个吃选择 && 添加多个杠的选择
            this.addMoreChiCardGroup(btn.model);
        }
        else {
            //选择成功
            this.visible = false;
            BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_playerChooseActionOk, btn.model);
        }
    };
    /*显示多个吃or杠选择*/
    AH_Game_cpghBtnView.prototype.addMoreChiCardGroup = function (model) {
        var w = BaseModel.USER_CARD_WIDTH * .7, x = (Main.stageWidth - model.cardList.length * w * 3) / 2, i, vy = this.btnY, chiView;
        this.cGroupModel = model;
        for (i in model.cardList) {
            chiView = new Game_chiCardGroupView(model.cardList[i], this.cActionCardModel, BaseModel.USER_CARD_WIDTH * .7, model.type);
            this.addChild(chiView);
            chiView.x = x;
            chiView.y = vy + chiView.h / 2;
            x += chiView.w + 14; /*间隔*/
            chiView.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseChiGroupOk, this);
        }
        /*显示取消按钮*/
        var clearBtn = new Game_cpghBtn(this.guoModel, "g_cpghBtn_0");
        clearBtn.x = x + clearBtn.width / 2 + 10;
        clearBtn.y = vy + clearBtn.height / 2 + 5;
        this.addChild(clearBtn);
        clearBtn.addTouchEvent();
        clearBtn.addEventListener("click", this.btnClick, this);
    };
    /*多个吃选择完毕*/
    AH_Game_cpghBtnView.prototype.chooseChiGroupOk = function (e) {
        var btn = e.currentTarget;
        this.clearPage();
        /*设置吃的数据*/
        this.cGroupModel.setChiJsonStr(btn.list);
        //选择成功
        this.visible = false;
        BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_playerChooseActionOk, this.cGroupModel);
    };
    /*清空页面*/
    AH_Game_cpghBtnView.prototype.clearPage = function () {
        var len = this.numChildren;
        for (var i = 0; i < len; i++) {
            this.removeChildAt(0);
        }
    };
    return AH_Game_cpghBtnView;
}(BaseView));
__reflect(AH_Game_cpghBtnView.prototype, "AH_Game_cpghBtnView");
