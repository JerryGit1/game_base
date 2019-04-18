/**
 * Created by 韩 on 2017/7/10.
 * 战绩弹框
 */
class AH_H_achievementView extends PopupBaseView{
    protected model:HallModel;
    protected myscrollView:egret.ScrollView;
    protected pageNum:number = 1;
    protected pageAll:number;
    protected content:egret.Sprite;
    public constructor(model){
        super();
        this.model = model;
        var bg:egret.Bitmap = this.addMsgBg(Main.stageWidth*.8,Main.stageHeight*.7);
        var x = bg.width - 7;
        var y = 5;
        this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addTitle("h_achievement_title",this.centerSp.width/2,45);
        /*接收 战绩信息*/
        this.model.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_achievement,this.addListView.bind(this));
        /*发起 获取战绩单页的信息*/
        this.model.getRecordInfo(this.pageNum);
        this.openAni();
    }
    protected addListView(data){
        this.pageAll = data.pages;
        // 成绩
        if (data.infos){
            if(this.pageNum == 1){
                if(this.myscrollView) {
                    this.centerSp.removeChild(this.myscrollView);
                    this.myscrollView = null;
                }
                this.content = null;

                this.content = new egret.Sprite();
                this.content.x = 22;
                this.addList(data.infos);

                this.myscrollView = new egret.ScrollView();
                this.myscrollView.width = Main.stageWidth*.8;
                this.myscrollView.height = Main.stageHeight*.7 - 90;
                this.myscrollView.y = 68;
                this.centerSp.addChild(this.myscrollView);
            }else{
                this.addList(data.infos);
            }
            this.myscrollView.setContent(this.content);
            this.myscrollView.addEventListener(egret.Event.CHANGE,this.updateListView,this);
        }else{
            var tt = new egret.TextField();
            tt.textColor = 0x514374;
            tt.textAlign = "center";
            tt.verticalAlign = "middle";
            tt.fontFamily = "微软雅黑";
            tt.size = 30;
            tt.text = "你还没有战绩哦 快去玩玩游戏吧";
            tt.width = this.centerSp.width;
            tt.y = this.centerSp.height/2;
            this.centerSp.addChild(tt);
        }
    }
    protected addList(infos){
        infos.sort(function (a,b) {
            return b.startTimne - a.startTimne;
        });
        for(var i:number=0;i<infos.length;i++){
            var listSprite = new egret.Sprite();
            var idx = (this.pageNum-1)*10+i;
            listSprite.y = 12+125*idx;
            this.content.addChild(listSprite);
            this.addOneList(listSprite,infos[i],idx);
        }
    }
    protected addOneList(sprite,data,idx){
        var userGrade = data.userInfos;
        // 战绩背景
        var title=new egret.Bitmap(RES.getRes("h_settlement_bg"));
        title.anchorOffsetX = title.width/2;
        title.anchorOffsetY = title.height/2;
        title.y=66;
        title.x=434;
        sprite.addChild(title);

        // 局数背景
        var inningsBg  = new egret.Bitmap(RES.getRes("h_numBg"));
        inningsBg.x = 75;
        inningsBg.y =title.y -inningsBg.height/2;
        sprite.addChild(inningsBg);

        // 局数
        var innings  = new egret.TextField();
        innings.width = inningsBg.width;
        innings.height = 45;
        innings.size = 25;
        innings.textAlign = "center";
        innings.verticalAlign = "middle";
        innings.textColor = 0xdbb683;
        innings.bold = true;
        innings.text = idx + 1;
        innings.x = inningsBg.x;
        innings.y = title.y -inningsBg.height/2+2;
        sprite.addChild(innings);

        // 房间号
        var roomNum  = new egret.TextField();
        roomNum.width = 160;
        roomNum.height = 25;
        roomNum.size = 16;
        roomNum.textAlign = "left";
        roomNum.verticalAlign = "middle";
        roomNum.text ="房间号:"+ data.roomId;
        roomNum.textColor = 0x9ab3cf;
        roomNum.x = 165;
        roomNum.y = 35;
        roomNum.alpha = 0.8;
        sprite.addChild(roomNum);

        //时间
        var date  = new egret.TextField();
        date.width = 190;
        date.height = 25;
        date.size = 17;
        date.textAlign = "left";
        date.verticalAlign = "middle";
        date.text =this.getTime(Number(data.startTimne));
        date.x = 165;
        date.y = 65;
        date.textColor = 0x9c9ca1;
        date.alpha = 0.8;
        sprite.addChild(date);
        //隔开条
        for(var i1=0;i1<2;i1++){
            var tiaoBg = new egret.Bitmap(RES.getRes("tiao"));
            tiaoBg.x = 300+330*i1;
            tiaoBg.y = 35;
            sprite.addChild(tiaoBg);
        }

        //分享按钮
        var shareBtn=new MyButton("h_playBack_shareBtn");
        sprite.addChild(shareBtn);
        shareBtn.x=730;
        shareBtn.y=45;
        shareBtn.addTouchEvent();
        shareBtn.addEventListener("click",this.share,this);
        // 玩家成绩
        var arr=[];
        var k = -1;
        for (var key in userGrade){
            k++;
            var tempKey = key;
            //名字
            var performance  = new egret.TextField();
            performance.x = 320+150*(k%2);
            performance.y = 35+30*Math.floor(k/2);
            performance.size = 16;
            performance.textAlign = "center";
            performance.verticalAlign = "middle";
            performance.textColor = 0x897050;
            performance.height = 24;
            arr.push({userName:decodeURIComponent(key).split("_")[0],score:Number(userGrade[key])});
            var nameKey:string = decodeURIComponent(key);
            var names = nameKey.split("_");
            var name = names[0];
            if (name.length>=6){
                performance.text = name.substring(0,4)+"...";
            }else{
                performance.text = name;
            }
            sprite.addChild(performance);
            //=======分数
            //背景
            var fenBg = this.CCenterBit("h_fenBg");
            fenBg.x = 414+150*(k%2);
            fenBg.y = 47+30*Math.floor(k/2);
            sprite.addChild(fenBg);
            //数字
            var grade  = new egret.TextField();
            grade.size = 16;
            grade.textAlign = "center";
            grade.verticalAlign = "middle";
            grade.textColor = 0xcae5fa;
            grade.height = 24;
            grade.x = 410+150*(k%2);
            grade.y = 35+30*Math.floor(k/2);
            grade.text = userGrade[tempKey];
            sprite.addChild(grade);
        }
        shareBtn["info"]={
            userInfo:arr,roomId:data.roomId
        };

        var newTime=new Date().getTime();//egret.getTimer();
        if(newTime-data.startTimne<1000*60*60*72){
            //回放记录
            var recordBtn=new MyButton("h_playBack_recordBtn");
            sprite.addChild(recordBtn);
            recordBtn.x=730;
            recordBtn.y=90;
            recordBtn["roomSn"] = data.roomId;
            recordBtn["createTime"] = data.startTimne;
            recordBtn.addTouchEvent();
            recordBtn.addEventListener("click",this.getRecord,this);
        }
    }
    protected updateListView(){
        if(this.myscrollView.scrollTop > 865*this.pageNum){
            var num = this.pageNum +1;
            if(num <= this.pageAll){
                this.model.getRecordInfo(num);
                this.pageNum = num;
                this.myscrollView.removeEventListener(egret.Event.CHANGE,this.updateListView,this);
            }
        }
    }
    //分享
    protected share(e:egret.Event){
        var data=e.currentTarget["info"];
        var userInfo=data.userInfo;
        userInfo.sort(function (a,b) {
            return b.score -a.score;
        });
        /*设置分享*/
        WeiXinJSSDK.getInstance().settlementShare(data.roomId,userInfo);
        /*分享提示*/
        PopupLayer.getInstance().addShareView();
    }
    //回放
    protected getRecord(e){
        var data = {"roomSn":e.currentTarget.roomSn,"createTime":e.currentTarget.createTime};
        BaseModel.getInstance().eventRadio("getRoomPlaybackList",data);
    }

    // 格式化时间
    protected getTime(date){
        let dateTime = new Date(date);
        let year = dateTime.getFullYear();
        let month = this.addPreZero(dateTime.getMonth()+1);
        let day = this.addPreZero(dateTime.getDate());

        let hours = this.addPreZero(dateTime.getHours());
        let minutes = this.addPreZero(dateTime.getMinutes());
        let seconds = this.addPreZero(dateTime.getSeconds());
        let createTime = month + "-" + day + "   " + hours + ":" + minutes;
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
    public clear(){
        super.clear();
        //重置分享
        WeiXinJSSDK.getInstance().hallShare();
    }
}
