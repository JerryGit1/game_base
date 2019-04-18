var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/10.
 * 战绩弹框
 */
var AH_H_achievementView = (function (_super) {
    __extends(AH_H_achievementView, _super);
    function AH_H_achievementView(data) {
        var _this = _super.call(this) || this;
        var bg = _this.addMsgBg(Main.stageWidth * .8, Main.stageHeight * .7); //"b_p_hitBg"
        var x = bg.width - 7;
        var y = 5;
        _this.addCloseBtn(x, y, "b_p_closeBtn");
        _this.addTitle("h_achievement_title", _this.centerSp.width / 2, 35);
        _this.openAni();
        _this.addDateView(data, bg);
        return _this;
    }
    AH_H_achievementView.prototype.addDateView = function (data, bg) {
        var inningsBg; //局数背景
        var innings; //局数
        var roomNum; //房间号
        var date; //时间
        var performanceBg; //成绩背景
        var performance; //成绩
        var content = new egret.DisplayObjectContainer();
        var lineH = 125;
        // 成绩
        if (data.infos) {
            MyConsole.getInstance().trace(data == null);
            for (var i = 0; i < data.infos.length; i++) {
                var k = -1;
                var userGrade = data.infos[i].userInfos;
                // 战绩背景
                var title = new egret.Bitmap(RES.getRes("h_settlement_bg"));
                title.anchorOffsetX = title.width / 2;
                title.anchorOffsetY = title.height / 2;
                title.y = 66 + i * lineH;
                title.x = 434;
                title.scaleX = title.scaleY = 1.2;
                content.addChild(title);
                // 局数背景
                inningsBg = new egret.Bitmap(RES.getRes("h_numBg"));
                inningsBg.x = 45;
                inningsBg.y = title.y - inningsBg.height / 2;
                content.addChild(inningsBg);
                // 局数
                innings = new egret.TextField();
                innings.width = inningsBg.width;
                innings.height = 45;
                innings.size = 25;
                innings.textAlign = "center";
                innings.verticalAlign = "middle";
                innings.textColor = 0xdbb683;
                innings.bold = true;
                innings.text = i + 1;
                innings.x = inningsBg.x;
                innings.y = title.y - inningsBg.height / 2 + 2;
                content.addChild(innings);
                // 房间号
                roomNum = new egret.TextField();
                roomNum.width = 160;
                roomNum.height = 25;
                roomNum.size = 16;
                roomNum.textAlign = "left";
                roomNum.verticalAlign = "middle";
                roomNum.text = "房间号:" + data.infos[i].roomId;
                roomNum.textColor = 0x9ab3cf;
                roomNum.x = 165;
                roomNum.y = 35 + i * lineH;
                roomNum.alpha = 0.8;
                content.addChild(roomNum);
                //时间
                date = new egret.TextField();
                date.width = 190;
                date.height = 25;
                date.size = 17;
                date.textAlign = "left";
                date.verticalAlign = "middle";
                date.text = this.getTime(Number(data.infos[i].startTimne));
                date.x = 165;
                date.y = 65 + i * lineH;
                date.textColor = 0x9c9ca1;
                date.alpha = 0.8;
                content.addChild(date);
                //隔开条
                for (var i1 = 0; i1 < 2; i1++) {
                    var tiaoBg = new egret.Bitmap(RES.getRes("tiao"));
                    tiaoBg.x = 300 + 330 * i1;
                    tiaoBg.y = 35 + i * lineH;
                    content.addChild(tiaoBg);
                }
                //分享按钮
                var shareBtn = new MyButton("sharesmallBtn");
                content.addChild(shareBtn);
                shareBtn.x = 760;
                shareBtn.y = 65 + i * lineH;
                shareBtn.addTouchEvent();
                shareBtn.addEventListener("click", this.share, this);
                // 玩家成绩
                var arr = [];
                for (var key in userGrade) {
                    k++;
                    var tempKey = key;
                    //名字
                    var performance_1 = new egret.TextField();
                    performance_1.x = 320 + 150 * (k % 2);
                    performance_1.y = 35 + 30 * Math.floor(k / 2) + i * lineH;
                    performance_1.size = 16;
                    performance_1.textAlign = "center";
                    performance_1.verticalAlign = "middle";
                    performance_1.textColor = 0x897050;
                    performance_1.height = 24;
                    arr.push({ userName: decodeURIComponent(key), score: userGrade[key] });
                    key = decodeURIComponent(key);
                    if (key.length >= 6) {
                        performance_1.text = key.substring(0, 4) + "..." + "：";
                    }
                    else {
                        performance_1.text = key;
                    }
                    content.addChild(performance_1);
                    //=======分数
                    //背景
                    var fenBg = this.CCenterBit("h_fenBg");
                    fenBg.x = 414 + 150 * (k % 2);
                    fenBg.y = 47 + 30 * Math.floor(k / 2) + i * lineH;
                    content.addChild(fenBg);
                    //数字
                    var grade = new egret.TextField();
                    grade.size = 16;
                    grade.textAlign = "center";
                    grade.verticalAlign = "middle";
                    grade.textColor = 0xcae5fa;
                    grade.height = 24;
                    grade.x = 410 + 150 * (k % 2);
                    grade.y = 35 + 30 * Math.floor(k / 2) + i * lineH;
                    grade.text = userGrade[tempKey];
                    content.addChild(grade);
                }
                shareBtn["info"] = {
                    userInfo: arr, roomId: data.infos[i].roomId
                };
            }
        }
        else {
            var tt = new egret.TextField();
            tt.textColor = 0xCB6F01;
            tt.textAlign = "center";
            tt.lineSpacing = 10;
            tt.width = bg.width * .8;
            tt.height = bg.height * .8;
            tt.verticalAlign = "middle";
            tt.fontFamily = "微软雅黑";
            tt.size = 30;
            tt.text = "你还没有战绩哦 快去玩玩游戏吧";
            tt.x = bg.width * .1;
            content.addChild(tt);
        }
        content.x = 22;
        content.height += 20;
        var myscrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = bg.width;
        myscrollView.height = bg.height - 90;
        myscrollView.y = 68;
        this.centerSp.addChild(myscrollView);
    };
    //分享
    AH_H_achievementView.prototype.share = function (e) {
        var data = e.currentTarget["info"];
        var userInfo = data.userInfo;
        //数据排序
        for (var i = 0; i < userInfo.length - 1; i++) {
            for (var s = i + 1; s < userInfo.length; s++) {
                if (userInfo[i].score < userInfo[s].score) {
                    var score = userInfo[i].score;
                    var name = userInfo[i].name;
                    userInfo[i].score = userInfo[s].score;
                    userInfo[i].name = userInfo[s].name;
                    userInfo[s].score = score;
                    userInfo[s].name = name;
                }
            }
        }
        /*设置分享*/
        WeiXinJSSDK.getInstance().settlementShare(data.roomId, userInfo);
        /*分享提示*/
        PopupLayer.getInstance().addShareView();
    };
    // 格式化时间
    AH_H_achievementView.prototype.getTime = function (date) {
        var dateTime = new Date(date);
        var year = dateTime.getFullYear();
        var month = this.addPreZero(dateTime.getMonth() + 1);
        var day = this.addPreZero(dateTime.getDate());
        var hours = this.addPreZero(dateTime.getHours());
        var minutes = this.addPreZero(dateTime.getMinutes());
        var seconds = this.addPreZero(dateTime.getSeconds());
        var createTime = month + "-" + day + "   " + hours + ":" + minutes;
        return createTime;
    };
    // 补零方法
    AH_H_achievementView.prototype.addPreZero = function (num) {
        if (num < 10) {
            return '0' + num;
        }
        else {
            return num;
        }
    };
    return AH_H_achievementView;
}(PopupBaseView));
__reflect(AH_H_achievementView.prototype, "AH_H_achievementView");
