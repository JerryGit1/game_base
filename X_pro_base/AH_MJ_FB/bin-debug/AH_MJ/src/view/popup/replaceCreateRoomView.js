var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Tang on 2017/8/24.
 * 代开房间弹框
 */
var AH_H_replaceCreateRoomView = (function (_super) {
    __extends(AH_H_replaceCreateRoomView, _super);
    function AH_H_replaceCreateRoomView(model) {
        var _this = _super.call(this) || this;
        _this.curType = "current"; //当前按钮类型
        _this.roomBtns = [];
        _this.currentPage = [];
        _this.historyPage = [];
        _this.model = model;
        var bg = _this.addMsgBg(Main.stageWidth * 0.7, Main.stageHeight * .65); //"b_p_hitBg",
        // var x = bg.width -27;
        // var y = 7;
        var x = bg.width - 7;
        var y = 5;
        _this.addCloseBtn(x, y, "b_p_closeBtn");
        _this.addTitle("h_replace_title", _this.centerSp.width / 2, 35);
        _this.openAni();
        _this.initBg();
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_currentReplace, _this.createCurrentPage, _this); //获取未结束代开房间
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_historyReplace, _this.createHistoryPage, _this); //获取已结束代开房间
        _this.model.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_dissolveReplaceRoom, _this.refreshContent.bind(_this)); //解散代开房间
        _this.model.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_deleteUser, _this.refreshContent.bind(_this)); //踢人
        //默认首先获取未结束代开房间信息
        _this.model.getCurrentReplaceInfo();
        return _this;
    }
    AH_H_replaceCreateRoomView.prototype.initBg = function () {
        //右边内容背景
        var contentBg = this.CCenterBit("h_replace_contentBg");
        contentBg.scale9Grid = new egret.Rectangle(79, 39, 480, 240);
        contentBg.x = 472;
        contentBg.y = 238;
        contentBg.width = 600;
        contentBg.height = 320;
        this.contentBg = contentBg;
        this.centerSp.addChild(this.contentBg);
        this.addBtns();
        //添加按钮事件
        this.currentRoomBtn.addTouchEvent();
        this.currentRoomBtn.addEventListener("click", this.getRoomListBtnClick, this);
        this.historyRoomBtn.addTouchEvent();
        this.historyRoomBtn.addEventListener("click", this.getRoomListBtnClick, this);
    };
    AH_H_replaceCreateRoomView.prototype.addBtns = function () {
        /*
         h_ContactUsBtn：已开房间按钮未选中    h_ContactUsBtn_select：已开房间按钮选中
         h_systemNewsBtn：历史记录按钮未选中   h_systemNewsBtn_selected：历史纪录按钮选中
        * */
        this.currentRoomBtn = new MyButton("h_replace_currentOnBtn");
        this.currentRoomBtn.x = 84;
        this.currentRoomBtn.y = 115;
        this.currentRoomBtn["type"] = "current";
        this.centerSp.addChild(this.currentRoomBtn);
        this.roomBtns.push(this.currentRoomBtn);
        this.historyRoomBtn = new MyButton("h_replace_historyOffBtn");
        this.historyRoomBtn.x = 84;
        this.historyRoomBtn.y = 170;
        this.historyRoomBtn["type"] = "history";
        this.centerSp.addChild(this.historyRoomBtn);
        this.roomBtns.push(this.historyRoomBtn);
    };
    //按钮点击 （按钮背景图切换）
    AH_H_replaceCreateRoomView.prototype.getRoomListBtnClick = function (e) {
        var btn = e.currentTarget;
        if (btn.type != this.curType) {
            for (var i in this.roomBtns) {
                if (this.roomBtns[i].type == btn.type) {
                    var str = "h_replace_" + btn.type + "OnBtn";
                    this.roomBtns[i].changTexture(str);
                }
                else {
                    var str = "h_replace_" + this.curType + "OffBtn";
                    this.roomBtns[i].changTexture(str);
                }
            }
            this.curType = btn.type;
            switch (this.curType) {
                case "current":
                    this.model.getCurrentReplaceInfo();
                    break;
                case "history":
                    this.model.getHistoryReplaceInfo(1);
                    break;
                default: break;
            }
        }
    };
    //未结束代开房间展示页
    AH_H_replaceCreateRoomView.prototype.createCurrentPage = function (e) {
        this.clearPage();
        //创建已代开房间
        this.moveSprite = new egret.Sprite();
        this.moveSprite.x = 0;
        this.moveSprite.y = 0;
        this.moveSprite.name = "moveSprite";
        for (var i = 0; i < this.model.currentReplaceRoomModelGroup.length; i++) {
            var listSprite = new egret.Sprite();
            listSprite.x = 170;
            listSprite.y = 12 + 120 * i;
            this.moveSprite.addChild(listSprite);
            this.addReplaceRoom(listSprite, this.model.currentReplaceRoomModelGroup[i], i, "current");
        }
        //提示按钮
        var tipBtn = new MyButton("h_replace_ruleBtn");
        tipBtn.x = 640;
        tipBtn.y = 60;
        this.contentSprite.addChild(tipBtn);
        this.currentPage.push(tipBtn);
        tipBtn.changeSize(0.6, 0.6);
        tipBtn.addTouchEvent();
        tipBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.showTips, this);
        tipBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.removeTips, this);
        //刷新按钮
        var freshBtn = new MyButton("h_replace_refreshBtn");
        freshBtn.x = 700;
        freshBtn.y = 60;
        this.contentSprite.addChild(freshBtn);
        this.currentPage.push(freshBtn);
        freshBtn.addTouchEvent();
        freshBtn.addEventListener("click", this.refreshContent, this);
        this.moveSprite.height += 20;
        this.myscrollView = new egret.ScrollView();
        this.myscrollView.setContent(this.moveSprite);
        this.centerSp.addChild(this.myscrollView);
        this.myscrollView.x = 0;
        this.myscrollView.y = 80;
        this.myscrollView.width = 800;
        this.myscrollView.height = 310;
        //未结束代开房间数量
        var tt = new egret.TextField();
        tt.x = 566;
        tt.y = 416;
        tt.fontFamily = "微软雅黑";
        tt.size = 18;
        tt.textColor = 0xAA8C64;
        tt.textAlign = "center";
        tt.verticalAlign = "middle";
        tt.text = "当前房间数量：" + this.model.currentReplaceRoomModelGroup.length + "/10";
        this.contentSprite.addChild(tt);
        this.currentPage.push(tt);
    };
    //已结束代开房间展示页
    AH_H_replaceCreateRoomView.prototype.createHistoryPage = function (e) {
        this.clearPage();
        var pages = e.data;
        for (var i = 0; i < this.model.historyReplaceRoomModelGroup.length; i++) {
            var listSprite = new egret.Sprite();
            listSprite.x = 170;
            listSprite.y = 8 + 120 * i;
            this.contentSprite.addChild(listSprite);
            this.historyPage.push(listSprite);
            this.addReplaceRoom(listSprite, this.model.historyReplaceRoomModelGroup[i], i, "history");
        }
        this.contentSprite.height += 20;
        this.myscrollView = new egret.ScrollView();
        this.myscrollView.setContent(this.contentSprite);
        this.centerSp.addChild(this.myscrollView);
        this.myscrollView.x = 0;
        this.myscrollView.y = 80;
        this.myscrollView.width = 800;
        this.myscrollView.height = 310;
    };
    //显示玩法
    AH_H_replaceCreateRoomView.prototype.showRuleView = function (e) {
        var roomInfo = e.currentTarget.roomInfo;
        var index = e.currentTarget.index;
        if (!this.ruleView) {
            var string = roomInfo.circleNum + "圈" + "  " + roomInfo.maxScore + "封顶分";
            var view = PopupLayer.getInstance().addTipView(string);
            view.x = 482;
            view.y = 244 + index * 120 - this.myscrollView.scrollTop;
            this.ruleView = view;
        }
    };
    //取消玩法提示
    AH_H_replaceCreateRoomView.prototype.removeRuleView = function () {
        this.ruleView.dispatchEvent(new egret.Event("close"));
        this.ruleView = null;
    };
    //显示代开房间规则提示
    AH_H_replaceCreateRoomView.prototype.showTips = function () {
        if (!this.tipView) {
            var string = "1.账号内房卡数达到100张才能使用代开启功能\n2.最多只能同时代开10个房间\n3.未开始的牌局会在创建60分钟后自动解散，已开始的牌局不受影响";
            var view = PopupLayer.getInstance().addTipView(string);
            view.x = 810;
            view.y = 232;
            this.tipView = view;
        }
    };
    //取消规则提示
    AH_H_replaceCreateRoomView.prototype.removeTips = function () {
        this.tipView.dispatchEvent(new egret.Event("close"));
        this.tipView = null;
    };
    //刷新已代开房间内容
    AH_H_replaceCreateRoomView.prototype.refreshContent = function () {
        this.model.getCurrentReplaceInfo();
        console.log("刷新已代开房间内容");
    };
    //显示代开房间信息
    AH_H_replaceCreateRoomView.prototype.addReplaceRoom = function (sprite, roomInfo, index, type) {
        console.log("显示代开房间信息");
        var idxPic = new egret.Bitmap(RES.getRes("h_num" + (index + 1)));
        idxPic.x = 4;
        idxPic.y = 20;
        sprite.addChild(idxPic);
        //总背景
        var bg = new egret.Bitmap(RES.getRes("h_replace_listBg"));
        bg.x = 48;
        sprite.addChild(bg);
        //房间信息背景
        var bg1 = new egret.Bitmap(RES.getRes("h_replace_roomInfoBg"));
        bg1.x = 52;
        bg1.y = 8;
        sprite.addChild(bg1);
        //房间
        var roomT = new egret.TextField();
        roomT.x = 80;
        roomT.y = 15;
        roomT.fontFamily = "微软雅黑";
        roomT.size = 12;
        roomT.textColor = 0x727f85;
        roomT.textAlign = "center";
        roomT.verticalAlign = "middle";
        roomT.text = "房间：" + roomInfo.roomId;
        sprite.addChild(roomT);
        //房卡
        var kaT = new egret.TextField();
        kaT.x = 80;
        kaT.y = 32;
        kaT.fontFamily = "微软雅黑";
        kaT.size = 12;
        kaT.textColor = 0x727f85;
        kaT.textAlign = "center";
        kaT.verticalAlign = "middle";
        var kaN = Number(roomInfo.circleNum) * 2;
        kaT.text = "房卡：" + kaN;
        sprite.addChild(kaT);
        //玩法文字
        var infoT = new egret.TextField();
        infoT.x = 80;
        infoT.y = 49;
        infoT.fontFamily = "微软雅黑";
        infoT.size = 12;
        infoT.textColor = 0x727f85;
        infoT.textAlign = "center";
        infoT.verticalAlign = "middle";
        infoT.text = "玩法：";
        sprite.addChild(infoT);
        //玩法提示
        var tipBtn = new MyButton("h_replace_playInfoTipBtn");
        tipBtn.x = 143;
        tipBtn.y = 57;
        tipBtn["roomInfo"] = roomInfo;
        tipBtn["index"] = index;
        sprite.addChild(tipBtn);
        tipBtn.addTouchEvent();
        tipBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.showRuleView, this);
        tipBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.removeRuleView, this);
        //根据房间状态，显示不同按钮
        if (type == "current") {
            if (Number(roomInfo.status) < 2) {
                //解散房间按钮
                var dissolveRoomBtn = new MyButton("h_replace_dissolveBtn");
                dissolveRoomBtn.x = 516;
                dissolveRoomBtn.y = 26;
                dissolveRoomBtn.addTouchEvent();
                dissolveRoomBtn.addEventListener("click", function (e) {
                    console.log("解散房间按钮");
                    this.model.dissolveReplaceRoom(roomInfo.roomId);
                }, this);
                sprite.addChild(dissolveRoomBtn);
                //分享按钮
                var currentShareBtn = new MyButton("h_replace_shareBtn");
                currentShareBtn.x = 516;
                currentShareBtn.y = 60;
                currentShareBtn.addTouchEvent();
                currentShareBtn.addEventListener("click", function (e) {
                    console.log("分享未开始代开房间");
                    // e.data = data;
                    PopupLayer.getInstance().addShareView();
                    // BaseModel.getInstance().eventRadio("settlementShare",e.data);
                }, this);
                sprite.addChild(currentShareBtn);
            }
            else {
                //已开启
                var haveOpen = new egret.Bitmap(RES.getRes("h_replace_haveOpen"));
                haveOpen.anchorOffsetX = haveOpen.width / 2;
                haveOpen.anchorOffsetY = haveOpen.height / 2;
                haveOpen.x = 506;
                haveOpen.y = 43;
                sprite.addChild(haveOpen);
            }
        }
        else {
            //分享按钮
            var historyShareBtn = new MyButton("h_replace_shareBtn");
            historyShareBtn.x = 516;
            historyShareBtn.y = 43;
            historyShareBtn.addTouchEvent();
            historyShareBtn.addEventListener("click", function (e) {
                console.log("分享已结束房间");
                // e.data = data;
                PopupLayer.getInstance().addShareView();
                // BaseModel.getInstance().eventRadio("settlementShare",e.data);
            }, this);
            sprite.addChild(historyShareBtn);
        }
        //玩家头像
        for (var i = 0; i < 4; i++) {
            var headSprite = new egret.Sprite();
            sprite.addChild(headSprite);
            if (roomInfo.playerInfo && roomInfo.playerInfo[i]) {
                this.setRealHead(roomInfo.playerInfo[i].openImg, headSprite);
                //名字
                var nameT = new egret.TextField();
                nameT.x = 265 + 100 * (i % 2);
                nameT.y = 8 + 38 * Math.floor(i / 2);
                nameT.fontFamily = "微软雅黑";
                nameT.size = 12;
                nameT.textColor = 0x78787e;
                nameT.textAlign = "center";
                nameT.verticalAlign = "middle";
                nameT.text = roomInfo.playerInfo[i].openName;
                sprite.addChild(nameT);
                //状态 or 分数
                var statusT = new egret.TextField();
                statusT.x = 265 + 100 * (i % 2);
                statusT.y = 25 + 38 * Math.floor(i / 2);
                statusT.fontFamily = "微软雅黑";
                statusT.size = 8;
                statusT.textColor = 0x78787e;
                statusT.textAlign = "center";
                statusT.verticalAlign = "middle";
                var tt = "";
                if (type == "current") {
                    tt = roomInfo.playerInfo[i].status == "inline" ? "(在线)" : "(不在线)";
                }
                else {
                    tt = roomInfo.playerInfo[i].score;
                }
                statusT.text = tt;
                sprite.addChild(statusT);
                //踢人按钮
                if (type == "current" && Number(roomInfo.status) < 2) {
                    var playerId = roomInfo.playerInfo[i].userId;
                    var playerName = roomInfo.playerInfo[i].openName;
                    var roomId = roomInfo.roomId;
                    var self = this;
                    (function (userId, userName, roomId) {
                        var deleteUserBtn = new MyButton("h_replace_deletePlayerBtn");
                        deleteUserBtn.x = 263 + 100 * (i % 2);
                        deleteUserBtn.y = 12 + 38 * Math.floor(i / 2);
                        sprite.addChild(deleteUserBtn);
                        deleteUserBtn.addTouchEvent();
                        deleteUserBtn.addEventListener("click", function (e) {
                            console.log("房主踢人", userName);
                            self.model.deleteUser(userId, userName, roomId);
                        }, self);
                    })(playerId, playerName, roomId);
                }
            }
            else {
                this.setDefaultHead(headSprite);
            }
            headSprite.x = 245 + 100 * (i % 2);
            headSprite.y = 22 + 38 * Math.floor(i / 2);
        }
        //时间
        var dateT = new egret.TextField();
        dateT.width = 190;
        dateT.height = 20;
        dateT.size = 10;
        dateT.textAlign = "center";
        dateT.verticalAlign = "middle";
        dateT.text = this.getTime(Number(roomInfo.createTime));
        dateT.x = 408;
        dateT.y = 82;
        sprite.addChild(dateT);
        var line = new egret.Bitmap(RES.getRes("h_replace_line"));
        line.x = -14;
        line.y = 102;
        sprite.addChild(line);
    };
    //创建默认头像
    AH_H_replaceCreateRoomView.prototype.setDefaultHead = function (sprite) {
        var headBg = new egret.Bitmap(RES.getRes("h_replace_headBg"));
        headBg.anchorOffsetX = headBg.width / 2;
        headBg.anchorOffsetY = headBg.height / 2;
        sprite.addChild(headBg);
    };
    /*创建真实头像信息*/
    AH_H_replaceCreateRoomView.prototype.setRealHead = function (headImgUrl, sprite) {
        if (headImgUrl === void 0) { headImgUrl = null; }
        if (headImgUrl) {
            var headImg = new egret.Bitmap();
            headImg.width = 32;
            headImg.height = 28;
            headImg.anchorOffsetX = headImg.width / 2;
            headImg.anchorOffsetY = headImg.height / 2;
            LoadLayer.getInstance().loadExternalBit(headImg, headImgUrl);
            sprite.addChild(headImg);
        }
        else {
            this.setDefaultHead(sprite);
        }
    };
    //清除展示页
    AH_H_replaceCreateRoomView.prototype.clearPage = function () {
        if (this.myscrollView) {
            this.centerSp.removeChild(this.myscrollView);
            this.myscrollView = null;
        }
        if (this.currentPage.length > 0) {
            for (var j in this.currentPage) {
                this.contentSprite.removeChild(this.currentPage[j]);
                this.currentPage[j] = null;
            }
        }
        this.currentPage = [];
        if (this.historyPage.length > 0) {
            for (var j1 in this.historyPage) {
                this.contentSprite.removeChild(this.historyPage[j1]);
                this.historyPage[j1] = null;
            }
        }
        this.historyPage = [];
        this.contentSprite = null;
        //实例化可滑动的显示数据框
        this.contentSprite = new egret.Sprite();
        this.centerSp.addChild(this.contentSprite);
    };
    AH_H_replaceCreateRoomView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_currentReplace, this.createCurrentPage, this);
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_historyReplace, this.createHistoryPage, this);
    };
    // 格式化时间
    AH_H_replaceCreateRoomView.prototype.getTime = function (date) {
        var dateTime = new Date(date);
        var year = dateTime.getFullYear();
        var month = this.addPreZero(Number(dateTime.getMonth()) + 1);
        var day = this.addPreZero(dateTime.getDate());
        var hours = this.addPreZero(dateTime.getHours());
        var minutes = this.addPreZero(dateTime.getMinutes());
        var seconds = this.addPreZero(dateTime.getSeconds());
        var createTime = year + "-" + month + "-" + day + "   " + hours + ":" + minutes + ":" + seconds;
        return createTime;
    };
    // 补零方法
    AH_H_replaceCreateRoomView.prototype.addPreZero = function (num) {
        if (num < 10) {
            return '0' + num;
        }
        else {
            return num;
        }
    };
    return AH_H_replaceCreateRoomView;
}(PopupBaseView));
__reflect(AH_H_replaceCreateRoomView.prototype, "AH_H_replaceCreateRoomView");
