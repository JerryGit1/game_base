/**
 * Created by Tang on 2017/10/25.
 */
class AH_H_achievementRecordView extends PopupBaseView{
    public constructor(data){
        super();
        let bg:egret.Bitmap = this.addMsgBg(Main.stageWidth*.8,Main.stageHeight*.7);
        var x = bg.width - 7;
        var y = 5;
        this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addTitle("h_playBack_title",this.centerSp.width/2,45);
        this.openAni();
        if(data.num != 0){
            data.sort(function (a,b) {
                return a.idx - b.idx;
            });
        }
        this.addDateView(data,bg);
    }
    protected addDateView(data,bg){
        let inningsBg;//局数背景
        let innings;//局数
        let roomNum;//房间号
        let date;//时间
        var content = new egret.DisplayObjectContainer();
        var lineH = 125;
        // 成绩
        if (!data.num && data.num != 0){
            for (let i=0; i<data.length;i++){
                let k = -1;
                let userGrade = data[i].userInfos;
                // 战绩背景
                var title=new egret.Bitmap(RES.getRes("h_settlement_bg"));
                title.anchorOffsetX = title.width/2;
                title.anchorOffsetY = title.height/2;
                title.y=66+i*lineH;
                title.x=434;
                // title.scaleX=title.scaleY=1.2;
                content.addChild(title);

                // 局数背景
                inningsBg  = new egret.Bitmap(RES.getRes("h_numBg"));
                inningsBg.x = 75;
                inningsBg.y =title.y -inningsBg.height/2;
                content.addChild(inningsBg);

                // 局数
                innings  = new egret.TextField();
                innings.width = inningsBg.width;
                innings.height = 45;
                innings.size = 25;
                innings.textAlign = "center";
                innings.verticalAlign = "middle";
                innings.textColor = 0xdbb683;
                innings.bold = true;
                innings.text = i + 1;
                innings.x = inningsBg.x;
                innings.y = title.y -inningsBg.height/2+2;
                content.addChild(innings);

                // 房间号
                roomNum  = new egret.TextField();
                roomNum.width = 160;
                roomNum.height = 25;
                roomNum.size = 16;
                roomNum.textAlign = "left";
                roomNum.verticalAlign = "middle";
                roomNum.text ="房间号:"+ data[i].roomId;
                roomNum.textColor = 0x9ab3cf;
                roomNum.x = 165;
                roomNum.y = 35+i*lineH;
                roomNum.alpha = 0.8;
                content.addChild(roomNum);

                //时间
                date  = new egret.TextField();
                date.width = 190;
                date.height = 25;
                date.size = 17;
                date.textAlign = "left";
                date.verticalAlign = "middle";
                date.text =this.getTime(Number(data[i].createTime));
                date.x = 165;
                date.y = 65+i*lineH;
                date.textColor = 0x9c9ca1;
                date.alpha = 0.8;
                content.addChild(date);
                //隔开条
                for(var i1=0;i1<2;i1++){
                    var tiaoBg = new egret.Bitmap(RES.getRes("tiao"));
                    tiaoBg.x = 300+330*i1;
                    tiaoBg.y = 35+i*lineH;
                    content.addChild(tiaoBg);
                }

                // //分享按钮
                // var shareBtn=new MyButton("h_playBack_shareBtn");
                // content.addChild(shareBtn);
                // shareBtn.x=760;
                // shareBtn.y=45+i*lineH;
                // shareBtn.addTouchEvent();
                // shareBtn.addEventListener("click",this.share,this);
                // 玩家成绩
                var arr=[];
                for (var key in userGrade){
                    k++;
                    var tempKey = key;
                    //名字
                    let performance  = new egret.TextField();
                    performance.x = 320+150*(k%2);
                    performance.y = 35+30*Math.floor(k/2)+i*lineH;
                    performance.size = 16;
                    performance.textAlign = "center";
                    performance.verticalAlign = "middle";
                    performance.textColor = 0x897050;
                    performance.height = 24;
                    userGrade[key].name=decodeURIComponent(userGrade[key].name);
                    // arr.push({userName:decodeURIComponent(key).split("_")[0],score:Number(userGrade[key])});
                    arr.push({userName:userGrade[key].name,score:Number(userGrade[key].score)});
                    // var nameKey:string = decodeURIComponent(key);
                    // var names = nameKey.split("_");
                    var name = userGrade[key].name;//names[0];
                    if (name.length>=6){
                        performance.text = name.substring(0,4)+"...";
                    }else{
                        performance.text = name;
                    }
                    content.addChild(performance);
                    //=======分数
                    //背景
                    var fenBg = this.CCenterBit("h_fenBg");
                    fenBg.x = 414+150*(k%2);
                    fenBg.y = 47+30*Math.floor(k/2)+i*lineH;
                    content.addChild(fenBg);
                    //数字
                    let grade  = new egret.TextField();
                    grade.size = 16;
                    grade.textAlign = "center";
                    grade.verticalAlign = "middle";
                    grade.textColor = 0xcae5fa;
                    grade.height = 24;
                    grade.x = 410+150*(k%2);
                    grade.y = 35+30*Math.floor(k/2)+i*lineH;
                    grade.text = userGrade[tempKey].score;
                    content.addChild(grade);
                }
                // shareBtn["info"]={
                //     userInfo:arr,roomId:data[i].roomId
                // };

                //回放记录
                var recordBtn=new MyButton("h_playBack_reviewBtn");
                content.addChild(recordBtn);
                recordBtn.x=726;
                recordBtn.y=40+i*lineH;
                recordBtn["url"] = data[i].url;
                recordBtn["roomId"] = data[i].roomId;
                recordBtn["createTime"] = data[i].createTime;
                recordBtn["index"] = data[i].idx;
                recordBtn.addTouchEvent();
                recordBtn.addEventListener("click",this.getRecord,this);
                recordBtn.scaleY=recordBtn.scaleX=.74;
                //分享按钮
                var shareBtn=new MyButton("h_playBack_shareBtn");
                content.addChild(shareBtn);
                shareBtn.x=726;
                shareBtn.y=90+i*lineH;
                shareBtn["url"] = data[i].url;
                shareBtn["time"]=date.text;
                shareBtn["roomId"]=data[i].roomId;
                shareBtn["num"]=data[i].idx;
                shareBtn.addTouchEvent();
                shareBtn.addEventListener("click",this.share,this);
            }
        }else{
            var tt = new egret.TextField();
            tt.textColor = 0xFAFAFA;
            tt.textAlign = "center";
            tt.lineSpacing=10;
            tt.width=bg.width*.8;
            tt.height=bg.height*.8;
            tt.verticalAlign = "middle";
            tt.fontFamily = "微软雅黑";
            tt.size = 30;
            tt.text = "该房间没有回放记录！请返回查看其他战绩信息！";
            tt.x = bg.width*.1;
            content.addChild(tt);
        }
        content.x = 22;
        content.height += 20;
        var myscrollView:egret.ScrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = bg.width;
        myscrollView.height = bg.height - 90;
        myscrollView.y = 68;
        this.centerSp.addChild(myscrollView);

    }
    //分享
    protected share(e:egret.Event){
        var data=e.currentTarget["info"];
        /*设置分享*/
        WeiXinJSSDK.getInstance().playbackShare(e.currentTarget["roomId"],e.currentTarget["num"],e.currentTarget["time"],e.currentTarget["url"]);
        /*分享提示*/
        PopupLayer.getInstance().addShareView();
    }

    //回放
    protected getRecord(e){
        var roomId = e.currentTarget.roomId;
        var cTime = e.currentTarget.createTime;
        var idx = e.currentTarget.index;
        var Url = e.currentTarget.url; //"resource/20171024181557-578547"+"-"+idx+".txt";//
        BaseModel.getInstance().dispatchEventWith("playBack",false,{url:Url,roomSn:roomId,createTime:cTime,index:idx});
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