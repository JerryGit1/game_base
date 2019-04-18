/**
 * Created by Tang on 2017/8/24.
 * 代开房间弹框
 */
class AH_H_replaceCreateRoomView extends PopupBaseView{
    protected contentBg:egret.Bitmap;
    protected currentRoomBtn:MyButton;/*已开房间*/
    protected historyRoomBtn:MyButton;/*历史记录*/
    protected curType="current";//当前按钮类型
    protected roomBtns:Array<any> = [];
    protected currentPage:Array<any> = [];
    protected historyPage:Array<any> = [];
    protected historyPageCount:number;//历史记录总页数
    protected historyPageNum:number=1;//历史记录当前页数
    protected isHistoryReduce:boolean=false;//历史记录是否减少
    protected isHistoryAdd:boolean=false;//历史记录是否增加
    protected myscrollView:egret.ScrollView;
    protected moveSprite:egret.Sprite;
    protected contentSprite:egret.Sprite;
    protected model:HallModel;
    protected tipView:H_tipView;/*提示层*/
    protected tipBtn:MyButton;/*规则提示按钮*/
    protected ruleView:H_tipView;/*玩法提示*/
    protected maskShape1;
    protected moveTop:number=0;/*当前移动位置*/
    public constructor(model){
        super();
        this.model = model;
        this.addMsgBg(null,null,"b_layerBg");
        this.addCloseBtn(36,45,"h_replace_closeBtn");
        this.addTitle("h_replace_title",this.centerSp.width/2,73);
        // this.openAni();
        this.initContent();
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_currentReplace,this.createCurrentPage,this);//获取未结束代开房间
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_historyReplace,this.createHistoryPage,this);//获取已结束代开房间
        this.model.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_dissolveReplaceRoom,this.refreshContent.bind(this));//解散代开房间
        this.model.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_deleteUser,this.refreshContent.bind(this));//踢人
        this.model.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_orderDissolveReplaceRoom,this.refreshContent.bind(this));//强制解散

        //默认首先获取未结束代开房间信息
        this.model.getCurrentReplaceInfo();
    }
    protected initContent(){
        var line = new egret.Bitmap(RES.getRes("h_replace_line"));
        line.y = 112;
        this.centerSp.addChild(line);

        this.addBtns();
        //添加按钮事件
        this.currentRoomBtn.addTouchEvent();
        this.currentRoomBtn.addEventListener("click",this.getRoomListBtnClick,this);
        this.historyRoomBtn.addTouchEvent();
        this.historyRoomBtn.addEventListener("click",this.getRoomListBtnClick,this);
    }
    protected addBtns(){
        /*
         h_ContactUsBtn：已开房间按钮未选中    h_ContactUsBtn_select：已开房间按钮选中
         h_systemNewsBtn：历史记录按钮未选中   h_systemNewsBtn_selected：历史纪录按钮选中
        * */
        this.currentRoomBtn = new MyButton("h_replace_currentOnBtn");
        this.currentRoomBtn.x = 196;
        this.currentRoomBtn.y = 155;
        this.currentRoomBtn.changeSize(1.2,1.2);
        this.currentRoomBtn["type"] = "current";
        this.centerSp.addChild(this.currentRoomBtn);
        this.roomBtns.push(this.currentRoomBtn);

        this.historyRoomBtn = new MyButton("h_replace_historyOffBtn");
        this.historyRoomBtn.x = 428;
        this.historyRoomBtn.y = 155;
        this.historyRoomBtn.changeSize(1.2,1.2);
        this.historyRoomBtn["type"] = "history";
        this.centerSp.addChild(this.historyRoomBtn);
        this.roomBtns.push(this.historyRoomBtn);
    }
    //按钮点击 （按钮背景图切换）
    protected getRoomListBtnClick(e:egret.Event){
        var btn = e.currentTarget;
        if(btn.type != this.curType){
            for(var i in this.roomBtns){
                if(this.roomBtns[i].type == btn.type){
                    var str = "h_replace_"+btn.type+"OnBtn";
                    this.roomBtns[i].changTexture(str);
                }else{
                    var str = "h_replace_"+this.curType+"OffBtn";
                    this.roomBtns[i].changTexture(str);
                }
            }
            this.curType = btn.type;
            switch (this.curType){
                case "current":this.model.getCurrentReplaceInfo();break;
                case "history":this.model.getHistoryReplaceInfo(this.historyPageNum);break;
                default:break;
            }
        }
    }
    //未结束代开房间展示页
    protected createCurrentPage(e){
        this.clearPage();
        //创建已代开房间
        var moveSprite = new egret.Sprite();
        moveSprite.width = Main.stageWidth;
        this.model.currentReplaceRoomModelGroup.sort(function (a,b) {
            return b.createTime - a.createTime;
        });
        for(var i:number=0;i<this.model.currentReplaceRoomModelGroup.length;i++){
            var listSprite = new egret.Sprite();
            listSprite.y = 12+140*i;
            moveSprite.addChild(listSprite);
            this.addReplaceRoom(listSprite,this.model.currentReplaceRoomModelGroup[i],i,"current");
        }
        //无代开房间时
        if(this.model.currentReplaceRoomModelGroup.length == 0){
            var tt = new egret.TextField();
            tt.textColor = 0xFAFAFA;
            tt.textAlign = "center";
            tt.verticalAlign = "middle";
            tt.fontFamily = "微软雅黑";
            tt.size = 30;
            tt.text = "您当前还没有代开房间，快到游戏大厅中创建吧！";
            tt.anchorOffsetX = tt.width/2;
            tt.anchorOffsetY = tt.height/2;
            tt.x = this.centerSp.width/2+130;
            tt.y = this.centerSp.height/2;
            this.contentSprite.addChild(tt);
            this.currentPage.push(tt);
        }
        //提示按钮
        var tipBtn = new MyButton("h_replace_ruleBtn");
        tipBtn.x = 990;
        tipBtn.y = 86;
        this.contentSprite.addChild(tipBtn);
        this.currentPage.push(tipBtn);
        this.tipBtn = tipBtn;
        this.tipBtn.addTouchEvent();
        this.tipBtn.addEventListener("click",this.showTips,this);
        //刷新按钮
        var freshBtn = new MyButton("h_replace_refreshBtn");
        freshBtn.x = 1060;
        freshBtn.y = 86;
        this.contentSprite.addChild(freshBtn);
        this.currentPage.push(freshBtn);
        freshBtn.addTouchEvent();
        freshBtn.addEventListener("click",this.refreshContent,this);

        moveSprite.height += 20;
        moveSprite.graphics.beginFill(0x00ff00,0);
        moveSprite.graphics.drawRect(0,0,this.centerWidth,moveSprite.height);
        moveSprite.graphics.endFill();

        this.myscrollView = new egret.ScrollView();
        this.myscrollView.setContent(moveSprite);
        this.centerSp.addChild(this.myscrollView);
        this.myscrollView.scrollTop = this.moveTop;
        this.myscrollView.y=212;
        this.myscrollView.width=1136;
        this.myscrollView.height=460;

        //未结束代开房间数量
        var tt = new egret.TextField();
        tt.x = 930;
        tt.y = 678;
        tt.fontFamily="微软雅黑";
        tt.size=18;
        tt.textColor=0xeec77d;
        tt.textAlign="center";
        tt.verticalAlign="middle";
        tt.text = "当前房间数量："+this.model.currentReplaceRoomModelGroup.length+"/10";
        this.contentSprite.addChild(tt);
        this.currentPage.push(tt);
    }
    //已结束代开房间展示页
    protected createHistoryPage(e){
        //无代开记录时
        if(e.data == 0){
            this.clearPage();
            var tt = new egret.TextField();
            tt.textColor = 0xFAFAFA;
            tt.textAlign = "center";
            tt.verticalAlign = "middle";
            tt.fontFamily = "微软雅黑";
            tt.size = 30;
            tt.text = "您当前还没有代开记录！";
            tt.anchorOffsetX = tt.width/2;
            tt.anchorOffsetY = tt.height/2;
            tt.x = this.centerSp.width/2+130;
            tt.y = this.centerSp.height/2;
            this.contentSprite.addChild(tt);
            this.currentPage.push(tt);

            return ;
        }
        if(this.historyPageNum == 1){
            this.clearPage();
            this.moveSprite = new egret.Sprite();
            this.moveSprite.width = Main.stageWidth;

            this.addHistoryContent(e.data);

            this.myscrollView = new egret.ScrollView();
            this.centerSp.addChild(this.myscrollView);
            this.myscrollView.y=212;
            this.myscrollView.width=1136;
            this.myscrollView.height=460;
            // this.myscrollView.setContent(this.moveSprite);
        }else{
            this.addHistoryContent(e.data);
        }
        this.myscrollView.setContent(this.moveSprite);
        this.myscrollView.addEventListener(egret.Event.CHANGE,this.refreshHistory,this);

        // this.addChangePageBtns();
    }
    protected refreshHistory(){
        if(this.myscrollView.scrollTop > 945*this.historyPageNum){
            var num = this.historyPageNum+1;
            this.model.getHistoryReplaceInfo(num);
            this.historyPageNum = num;
            this.myscrollView.removeEventListener(egret.Event.CHANGE,this.refreshHistory,this);
        }
    }
    protected addHistoryContent(pages){
        this.historyPageCount = pages;
        // this.changeHistoryPageNum(e.data);
        this.model.historyReplaceRoomModelGroup.sort(function (a,b) {
            return b.createTime - a.createTime;
        });
        for(var i:number=0;i<this.model.historyReplaceRoomModelGroup.length;i++){
            var listSprite = new egret.Sprite();
            var idx = (this.historyPageNum-1)*10+i;
            listSprite.y = 12+140*idx;
            this.moveSprite.addChild(listSprite);
            this.addReplaceRoom(listSprite,this.model.historyReplaceRoomModelGroup[i],idx,"history");
        }
        /*===》 tyq  2.2.5 删除*/
        // this.moveSprite.graphics.beginFill(0x00ff00,0);
        // this.moveSprite.graphics.drawRect(0,0,this.centerWidth,this.moveSprite.height);
        // this.moveSprite.graphics.endFill();
    }
    //更新历史记录页数
    protected changeHistoryPageNum(pages){
        this.historyPageCount = pages;
        //当前页数减少
        if(this.isHistoryReduce){
            this.isHistoryReduce = false;
            this.historyPageNum --;
        }
        //当前页数增加
        if(this.isHistoryAdd){
            this.isHistoryAdd = false;
            this.historyPageNum ++;
        }
    }
    //历史记录跳转页面
    protected addChangePageBtns(){
        //上一页
        var reduceBtn = new MyButton("h_replace_reduceBtn");
        reduceBtn.x = 515;
        reduceBtn.y = 698;
        reduceBtn.addTouchEvent();
        reduceBtn.addEventListener("click",function (e) {
            var num = this.historyPageNum-1;
            if(num>=1){
                this.model.getHistoryReplaceInfo(num);
                this.isHistoryReduce = true;
            }
        }.bind(this),this);
        this.contentSprite.addChild(reduceBtn);
        this.historyPage.push(reduceBtn);
        //下一页
        var addBtn = new MyButton("h_replace_reduceBtn");
        addBtn.x = 610;
        addBtn.y = 698;
        addBtn.scaleX = -1;
        addBtn.addTouchEvent();
        addBtn.addEventListener("click",function (e) {
            if(this.historyPageNum<this.historyPageCount){
                var num = this.historyPageNum+1;
                this.model.getHistoryReplaceInfo(num);
                this.isHistoryAdd = true;
            }
        }.bind(this),this);
        this.contentSprite.addChild(addBtn);
        this.historyPage.push(addBtn);

    }
    //显示玩法
    protected showRuleView(e){
        var roomInfo = e.currentTarget.roomInfo;
        var index = e.currentTarget.index;
        if(!this.ruleView){
            var string = roomInfo.circleNum+"圈"+"  "+roomInfo.maxScore+"封顶";

            var tt = new egret.TextField();
            tt.text = string;
            var width = tt.textWidth;
            var view = PopupLayer.getInstance().addTipView(string,width,20,25);//hyh添加参数xy
            view.x = 322;
            view.y = 248+index*140-this.myscrollView.scrollTop;

            // var view = PopupLayer.getInstance().addTipView(string);
            // view.x = 204;
            // view.y = 148+index*140-this.myscrollView.scrollTop;

            this.ruleView = view;
            //遮罩
            this.maskShape1 = new egret.Shape();
            this.maskShape1.graphics.beginFill(0x000000,0);
            this.maskShape1.graphics.drawRect(0,0,Main.stageWidth,Main.stageHeight);
            this.maskShape1.graphics.endFill();
            this.maskShape1.touchEnabled=true;
            this.centerSp.addChild(this.maskShape1);
            this.maskShape1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.removeRuleView,this);
        }
    }
    //取消玩法提示
    protected removeRuleView(e){
        this.ruleView.dispatchEvent(new egret.Event("close"));
        this.ruleView = null;
        if(this.maskShape1) {
            this.centerSp.removeChild(this.maskShape1);
            this.maskShape1 = null;
        }
    }
    //显示代开房间规则提示
    protected showTips(){
        if(!this.tipView){
            var string = "1.账号内房卡数达到100张才能使用代开启功能\n2.最多只能同时代开10个房间\n3.未开始的牌局会在创建40分钟后自动解散，已开始的牌局不受影响";
            var view = PopupLayer.getInstance().addTipView(string,300);
            view.x = 954;
            view.y = 218;
            this.tipView = view;

            //遮罩
            this.maskShape1 = new egret.Shape();
            this.maskShape1.graphics.beginFill(0x000000,0);
            this.maskShape1.graphics.drawRect(0,0,Main.stageWidth,Main.stageHeight);
            this.maskShape1.graphics.endFill();
            this.maskShape1.touchEnabled=true;
            this.centerSp.addChild(this.maskShape1);
            this.maskShape1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.removeTips,this);
        }
    }
    //取消规则提示
    protected removeTips(){
        this.tipView.dispatchEvent(new egret.Event("close"));
        this.tipView = null;
        if(this.maskShape1) {
            this.centerSp.removeChild(this.maskShape1);
            this.maskShape1 = null;
        }
    }
    //刷新已代开房间内容
    protected refreshContent(){
        if(this.myscrollView){
            this.moveTop = this.myscrollView.scrollTop;
        }
        this.model.getCurrentReplaceInfo();
    }
    //显示代开房间信息
    protected addReplaceRoom(sprite,roomInfo,index,type){
        var idxStr = ""+(index+1);
        if(idxStr.length>1){
            for(var i:number=0;i<idxStr.length;i++){
                var idx = new egret.Bitmap(RES.getRes("h_num"+idxStr[i]));
                if(idxStr.length==2){
                    idx.x = 48+i*20;
                }else if(idxStr.length==3){
                    idx.x = 38+i*20;
                }
                idx.y = 21;
                sprite.addChild(idx);
            }
        }else{
            var idxPic = new egret.Bitmap(RES.getRes("h_num"+(index+1)));
            idxPic.x = 58;
            idxPic.y = 20;
            sprite.addChild(idxPic);
        }
        //房间
        var roomT = new egret.TextField();
        roomT.x = 136;
        roomT.y = -12;
        roomT.fontFamily="微软雅黑";
        roomT.size=22;
        roomT.textColor=0xffce94;
        roomT.textAlign="center";
        roomT.verticalAlign="middle";
        roomT.text = "房间："+roomInfo.roomId;
        sprite.addChild(roomT);
        //房卡
        var kaT = new egret.TextField();
        kaT.x = 136;
        kaT.y = 32;
        kaT.fontFamily="微软雅黑";
        kaT.size=18;
        kaT.textColor=0x727f85;
        kaT.textAlign="center";
        kaT.verticalAlign="middle";
        var kaN = Number(roomInfo.circleNum)*2;
        kaT.text = "房卡："+kaN;
        sprite.addChild(kaT);
        //玩法文字
        var infoT = new egret.TextField();
        infoT.x = 136;
        infoT.y = 68;
        infoT.fontFamily="微软雅黑";
        infoT.size=18;
        infoT.textColor=0x727f85;
        infoT.textAlign="center";
        infoT.verticalAlign="middle";
        infoT.text = "玩法：";
        sprite.addChild(infoT);
        //玩法提示
        var tipBtn = new MyButton("h_replace_playInfoTipBtn");
        tipBtn.x = 205;
        tipBtn.y = 80;
        tipBtn["roomInfo"] = roomInfo;
        tipBtn["index"] = index;
        sprite.addChild(tipBtn);
        tipBtn.addTouchEvent();
        tipBtn.addEventListener("click",this.showRuleView,this);
        //根据房间状态，显示不同按钮
        if(type == "current"){
            if(Number(roomInfo.status)<2){
                //解散房间按钮
                var dissolveRoomBtn = new MyButton("h_replace_dissolveBtn");
                dissolveRoomBtn.x = 856;
                dissolveRoomBtn.y = 22;
                dissolveRoomBtn.addTouchEvent();
                dissolveRoomBtn.addEventListener("click",function (e) {
                    this.model.dissolveReplaceRoom(roomInfo.roomId);
                },this);
                sprite.addChild(dissolveRoomBtn);
                //分享按钮
                var currentShareBtn = new MyButton("h_replace_shareBtn");
                currentShareBtn.x = 1016;
                currentShareBtn.y = 22;
                currentShareBtn["roomInfo"] = roomInfo;
                currentShareBtn.addTouchEvent();
                currentShareBtn.addEventListener("click",this.currentShareBtnClick,this);
                sprite.addChild(currentShareBtn);
            }else{
                //已开启
                var haveOpen = new egret.Bitmap(RES.getRes("h_replace_haveOpen"));
                haveOpen.anchorOffsetX = haveOpen.width/2;
                haveOpen.anchorOffsetY = haveOpen.height/2;
                haveOpen.x = 880;
                haveOpen.y = 40;
                sprite.addChild(haveOpen);

                //强制解散
                var orderDisBtn = new MyButton("h_replace_orderDisBtn");
                orderDisBtn.anchorOffsetX = orderDisBtn.width/2;
                orderDisBtn.anchorOffsetY = orderDisBtn.height/2;
                orderDisBtn.x = 1090;
                orderDisBtn.y = 65;
                orderDisBtn["roomId"] = Number(roomInfo.roomId);
                sprite.addChild(orderDisBtn);

                orderDisBtn.addTouchEvent();
                orderDisBtn.addEventListener("click",this.orderDisBtnClick,this);
            }
        }else{
            //分享按钮
            var historyShareBtn = new MyButton("h_playBack_shareBtn");
            historyShareBtn.x = 912;
            historyShareBtn.y = 10;
            historyShareBtn["roomInfo"] = roomInfo;
            historyShareBtn.addTouchEvent();
            historyShareBtn.addEventListener("click",this.historyShareBtnClick,this);
            sprite.addChild(historyShareBtn);

            //回放记录
            var newTime=new Date().getTime();//egret.getTimer();
            if(newTime-roomInfo.createTime<1000*60*60*72){
                var recordBtn=new MyButton("h_playBack_recordBtn");
                sprite.addChild(recordBtn);
                recordBtn.x=912;
                recordBtn.y=60;
                recordBtn["roomSn"] = roomInfo.roomId;
                recordBtn["createTime"] = roomInfo.createTime;
                recordBtn.addTouchEvent();
                recordBtn.addEventListener("click",this.getRecord,this);
            }
        }
        //玩家头像
        var position = [];
        var deletedBtns:Array<MyButton> = [];
        for(var i:number=0;i<4;i++){
            var headSprite = new egret.Sprite();
            sprite.addChild(headSprite);
            if(roomInfo.playerInfo && roomInfo.playerInfo[i]){
                this.setRealHead(roomInfo.playerInfo[i].openImg,headSprite);
                var pos= Number(roomInfo.playerInfo[i].position)-1;
                //名字
                var nameT = new egret.TextField();
                nameT.x = 378+100*pos;
                nameT.y = 64;
                nameT.fontFamily="微软雅黑";
                nameT.size=18;
                nameT.textColor=0x78787e;
                nameT.textAlign="center";
                nameT.verticalAlign="middle";
                var nT = roomInfo.playerInfo[i].openName;
                if (nT.length>=6){
                    nameT.text = nT.substring(0,4)+"...";
                }else{
                    nameT.text = nT;
                }
                nameT.anchorOffsetX = nameT.width/2;
                nameT.anchorOffsetY = nameT.height/2;
                sprite.addChild(nameT);
                //状态 or 分数
                var statusT = new egret.TextField();
                statusT.x = 354+100*pos;
                statusT.y = 80;
                statusT.fontFamily="微软雅黑";
                statusT.size = 18;
                statusT.textColor=0x78787e;
                statusT.textAlign="center";
                statusT.verticalAlign="middle";
                var tt = "";
                if(type == "current"){
                    tt = roomInfo.playerInfo[i].status=="inline"?"(在线)":"(不在线)";
                }else{
                    tt = roomInfo.playerInfo[i].score;
                }
                statusT.text = tt;
                sprite.addChild(statusT);
                //踢人按钮
                var self = this;
                if(type == "current" && Number(roomInfo.status)<2){
                    var playerId = roomInfo.playerInfo[i].userId;
                    var playerName = roomInfo.playerInfo[i].openName;
                    var roomId = roomInfo.roomId;
                    var deleteUserBtn = new MyButton("h_replace_deletePlayerBtn");
                    deleteUserBtn.x = 378+100*pos;
                    deleteUserBtn.y = 20;
                    sprite.addChild(deleteUserBtn);
                    if(i == 0){
                        deleteUserBtn.alpha = 1;
                    }else{
                        deleteUserBtn.alpha = 0;
                    }
                    deleteUserBtn.addTouchEvent();
                    deletedBtns.push(deleteUserBtn);
                    (function (userId,userName,roomId) {
                        deleteUserBtn.addEventListener("click",function (e) {
                            if(e.currentTarget.alpha == 0){
                                for(var idx in deletedBtns) {
                                    deletedBtns[idx].alpha = 0;
                                }
                                e.currentTarget.alpha = 1;
                            }
                            else if(e.currentTarget.alpha == 1) self.model.deleteUser(userId,userName,roomId);
                        },self);
                    })(playerId,playerName,roomId);
                }
                headSprite.x = 378+100*pos;
                headSprite.y = 20;
                position.push(pos);
            }
        }
        for(var i=0;i<4;i++){
            if(position.indexOf(i)<0){
                var headSprite = new egret.Sprite();
                sprite.addChild(headSprite);
                this.setDefaultHead(headSprite);
                headSprite.x = 378+100*i;
                headSprite.y = 20;
            }
        }

        //时间
        var dateT  = new egret.TextField();
        dateT.width = 190;
        dateT.height = 20;
        dateT.size = 14;
        dateT.textAlign = "center";
        dateT.verticalAlign = "middle";
        dateT.text =this.getTime(Number(roomInfo.createTime));
        dateT.x = 906;
        dateT.y = 84;
        sprite.addChild(dateT);

        var line = new egret.Bitmap(RES.getRes("h_replace_line"));
        line.x = -14;
        line.y = 106;
        sprite.addChild(line);
    }
    //回放
    protected getRecord(e){
        var data = {"roomSn":e.currentTarget.roomSn,"createTime":e.currentTarget.createTime};
        BaseModel.getInstance().eventRadio("getRoomPlaybackList",data);
    }
    //强制解散
    protected orderDisBtnClick(e){
        var roomSn = e.currentTarget.roomId;
        PopupLayer.getInstance().addHintView("当前房间已开局，强制解散可能会导致玩家数据丢失，请谨慎执行该操作！",function () {
            BaseModel.getInstance().eventRadio("orderDisRoom",roomSn);
        });
    }
    //未结束房间分享点击
    protected currentShareBtnClick(e){
        var roomInfo = e.currentTarget.roomInfo;
        WeiXinJSSDK.getInstance().gameShare(roomInfo.roomId,roomInfo.circleNum,roomInfo.maxScore,this.model.userModel.openName,"replace");
        PopupLayer.getInstance().addShareView();
    }
    //历史记录分享点击
    protected historyShareBtnClick(e){
        var roomInfo = e.currentTarget.roomInfo;
        var data:Array<any> = [];
        for(var i=0;i<4;i++){
            data.push({userName:roomInfo.playerInfo[i].openName,score:Number(roomInfo.playerInfo[i].score)});
        }
        data.sort(function (a,b) {
            return b.score-a.score;
        });
        WeiXinJSSDK.getInstance().settlementShare(roomInfo.roomId,data,"replace");
        PopupLayer.getInstance().addShareView();
    }
    //创建默认头像
    protected setDefaultHead(sprite){
        var headBg = new egret.Bitmap(RES.getRes("h_replace_headBg"));
        headBg.anchorOffsetX = headBg.width/2;
        headBg.anchorOffsetY = headBg.height/2;
        sprite.addChild(headBg);
    }
    /*创建真实头像信息*/
    protected setRealHead(headImgUrl=null,sprite){
        if(headImgUrl){
            var headImg = new egret.Bitmap();
            headImg.width = 62;
            headImg.height = 62;
            headImg.anchorOffsetX = headImg.width/2;
            headImg.anchorOffsetY = headImg.height/2;
            LoadLayer.getInstance().loadExternalBit(headImg,headImgUrl);
            sprite.addChild(headImg);
        }else{
            this.setDefaultHead(sprite);
        }
    }
    //清除展示页
    protected clearPage(){
        if(this.myscrollView) {
            this.centerSp.removeChild(this.myscrollView);
            this.myscrollView = null;
        }
        this.moveSprite = null;
        if(this.currentPage.length>0){
            for(var j in this.currentPage){
                this.contentSprite.removeChild(this.currentPage[j]);
                this.currentPage[j]=null;
            }
        }
        this.currentPage=[];
        if(this.historyPage.length>0){
            for(var j1 in this.historyPage){
                this.contentSprite.removeChild(this.historyPage[j1]);
                this.historyPage[j1]=null;
            }
        }
        this.historyPage=[];
        this.contentSprite = null;
        this.historyPageNum = 1;

        //实例化可滑动的显示数据框
        this.contentSprite=new egret.Sprite();
        this.centerSp.addChild(this.contentSprite);
    }
    public clear(){
        super.clear();
        //重置分享
        WeiXinJSSDK.getInstance().hallShare();
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_currentReplace,this.createCurrentPage,this);
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_historyReplace,this.createHistoryPage,this);
    }
    // 格式化时间
    protected getTime(date):string{
        var dateTime = new Date(date);
        var year = dateTime.getFullYear();
        var month = this.addPreZero(Number(dateTime.getMonth())+1);
        var day = this.addPreZero(dateTime.getDate());

        var hours = this.addPreZero(dateTime.getHours());
        var minutes = this.addPreZero(dateTime.getMinutes());
        var seconds = this.addPreZero(dateTime.getSeconds());
        var createTime = year + "-" + month + "-" + day + "   " + hours + ":" + minutes + ":" + seconds;
        return createTime;
    }
    // 补零方法
    protected addPreZero(num){
        if(num<10){
            return '0'+num;
        }else {
            return num;
        }
    }
}