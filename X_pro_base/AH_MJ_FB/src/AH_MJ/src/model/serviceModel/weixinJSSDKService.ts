/**
 * Created by 伟大的周鹏斌大王 on 2017/7/22.
 * 微信分享服务类
 * http://res.wx.qq.com/open/js/jweixin-1.2.0.js
 */
class AH_WeiXinJSSDK extends AH_baseService{
    protected weixin;
    protected weixinJSDKUrl="";/*授权信息获取地址*/
    protected SDKAuth=false;/*是否授权过了*/
    protected gameLink="";/*游戏登录链接*/
    public model:UrlDataModel;
    public userModel:UserModel;
    public constructor(){
        super();

        this.weixin=window["wx"];
        if(!this.weixin){
            MyConsole.getInstance().trace("没有加载微信jssdk js文件",0);
        }
        this.weixinJSDKUrl=AH_baseService.host+"login/open/us.share.index.html";
        this.gameLink=AH_baseService.host+"login/open/us.login.index.html";
    }
    /*------关闭当前页面------*/
    public closeWindow(){
        this.sdkAuthorization(function () {
            this.weixin.closeWindow();
        }.bind(this));
    }
    /*----------------------分享接口-------------------------*/
    //游戏大厅分享
    public hallShare(){
        var data={
            title:"【XX麻将】",
            link:this.gameLink+"?cId="+this.model.cId,
            imgUrl:AH_baseService.host+"game/X1/icon.png",
            desc:"XX麻将，原汁原味本地打法。无需下载，分享好友，直接组局！"
        };
        this.weixinShare(data);
    }
    //游戏中分享
    public gameShare(roomId,totalNum,maxScore,homeName,type="original"){
        var data={
            title:"XX麻将  房间号："+roomId,
            link:this.gameLink+"?cId="+this.model.cId+"&state=1_"+roomId,
            imgUrl:AH_baseService.host+"game/X1/icon.png",
            desc:"房主:"+homeName+" \n玩法:"+totalNum+"圈，"+maxScore+"封顶，点炮包三家"
        };
        this.weixinShare(data);
    }
    // 大结算分享
    public settlementShare(roomId,userList,type="original"){
        var data={
            title:"大赢家-"+getName(userList[0].userName,6)+":"+userList[0].score+"分",
            link:this.gameLink+"?cId="+this.model.cId+"&state=1_"+roomId,
            imgUrl:AH_baseService.host+"game/X1/icon.png",
            desc:getName(userList[1].userName)+"："+userList[1].score+"分"+
            "  \n"+getName(userList[2].userName)+"："+userList[2].score+"分"+
            "  \n"+getName(userList[3].userName)+"："+userList[3].score+"分"
        };
        function getName(name,len=4){
            if(name.length>len){
                name=name.substr(0,len)+".";
            }
            return name;
        }
        this.weixinShare(data);
    }
    // 回放分享/*url 数据文件地址*/
    public playbackShare(roomId,number,timer,url){
        var userName=this.userModel.openName;
        var data={
            title:"牌局回放-【"+BaseModel.GAME_NAME+"】",
            link:this.gameLink+"?cId="+this.model.cId+"&state=2_"+roomId+"_"+number+"_"+url+"_"+this.userModel.userId,
            imgUrl:AH_baseService.host+"game/X1/icon.png",
            desc:"来自:"+userName+",时间:"+timer
        };
        this.weixinShare(data);
    }
    /*----------------------语音接口-------------------------*/
    /*开始录音*/
    protected startRecording=-1;
    public startRecord(){
        this.stopRecord(null);
        if(this.startRecording==-1){
            SoundModel.setBackSoundVolume(0);
            this.startRecording=1;
            this.sdkAuthorization(function () {
                this.weixin.startRecord();
            }.bind(this));
        }
    }
    /*停止录音*/
    public stopRecord(backFun=null){
        var self=this;
        if(this.startRecording==1){
            this.startRecording=2;
            SoundModel.setBackSoundVolume(1);
            this.sdkAuthorization(function () {
                self.weixin.stopRecord({
                    success: function (res) {
                        self.startRecording=-1;
                        if(backFun){
                            self.uploadVoice(res.localId,function (localId) {
                                //传递语音消息
                                BaseModel.getInstance().eventRadio("changeChatStatus",{
                                    "type":4,
                                    "idx":localId,
                                    "local":true//本地语音直接播放不下载
                                });
                            });
                        }
                    }
                });
            }.bind(this));
        }

    }
    /*监听录音自动停止接口*/
    public onVoiceRecordEnd(backFun){
        this.sdkAuthorization(function () {
            this.weixin.onVoiceRecordEnd({
                complete: function (res) {
                    backFun(res.localId);
                }
            });
        }.bind(this));
    }
    /*播放语音接口*/
    public playVoice(id,userId){
        this.sdkAuthorization(function () {
            MyConsole.getInstance().trace("播放录音");
            SoundModel.setBackSoundVolume(0);
            BaseModel.getInstance().eventRadio("isVoicing",{Id:userId,_isVoicing:true});
            this.weixin.playVoice({
                localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
            });
            this.weixin.onVoicePlayEnd({
                success: function (res) {
                    SoundModel.setBackSoundVolume(1);
                    BaseModel.getInstance().eventRadio("isVoicing",{Id:userId,_isVoicing:false});
                }
            });
        }.bind(this));
    }
    /*上传语音接口*/
    public uploadVoice(id,backFun){
        var self=this;
        this.sdkAuthorization(function () {
            self.startRecording=101;
            this.weixin.uploadVoice({
                localId: id, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    self.startRecording=-1;
                    backFun(res.serverId);// 返回音频的服务器端ID
                }
            });
        }.bind(this));
    }
    /*下载语音接口*/
    public downloadVoice(id,userId,backFun){
        var self=this;
        this.sdkAuthorization(function () {
            self.startRecording=100;
            this.weixin.downloadVoice({
                serverId: id, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    self.startRecording=-1;
                    backFun(res.localId,userId);// 返回音频的服务器端ID
                }
            });
        }.bind(this));
    }
    /*-----------------------基础接口------------------------*/
    //基础分析设置
    protected weixinShare(shareData,_shareOk=null){
        var wx=this.weixin;
        this.sdkAuthorization(setWeiXinShare);
        /*设置分享*/
        function setWeiXinShare() {
            wx.onMenuShareTimeline({
                title: shareData["title"], // 分享标题
                link: shareData["link"], // 分享链接
                imgUrl: shareData["imgUrl"], // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareOk(1);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: shareData["title"], // 分享标题
                desc: shareData["desc"], // 分享描述
                link: shareData["link"], // 分享链接
                imgUrl: shareData["imgUrl"], // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareOk(2);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({

                title: shareData["title"], // 分享标题
                desc: shareData["desc"], // 分享描述
                link: shareData["link"], // 分享链接
                imgUrl: shareData["imgUrl"], // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareOk(3);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareWeibo({
                title: shareData["title"], // 分享标题
                desc: shareData["desc"], // 分享描述
                link: shareData["link"], // 分享链接
                imgUrl: shareData["imgUrl"], // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareOk(4);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            /*隐藏按钮*/
            wx.hideMenuItems({
                menuList: ["menuItem:copyUrl","menuItem:setFont","menuItem:share:qq","menuItem:share:weiboApp","menuItem:share:facebook","menuItem:share:QZone","menuItem:editTag","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:email"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });

        }
        /*分享成功*/
        function shareOk(num){
            //统计信息
            AH_statisticService.getInstance().share();
            if(_shareOk)_shareOk(num);
        }
    }
    /*授权jsdk*/
    protected sdkAuthorization(authOKBackFun){
        var configData,self=this,wx=this.weixin;
        if(self.SDKAuth){/*已经授权过了*/
            authOKBackFun();
            return;
        }else if(!wx)return;
        function getJSSDKData(backFun){
            self.http(self.weixinJSDKUrl,{gUrl:window.location.href,mId:self.model.mId},function(data){
                self.SDKAuth=true;
                configData=data;
                backFun();
            },false);
        }
        getJSSDKData(function(){
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: configData.appId, // 必填，公众号的唯一标识
                timestamp: configData.timestamp, // 必填，生成签名的时间戳
                nonceStr: configData.nonceStr, // 必填，生成签名的随机串
                signature: configData.signature,// 必填，签名，见附录1
                jsApiList: ["uploadImage","chooseImage","hideMenuItems","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","startRecord","stopRecord","playVoice","uploadVoice","downloadVoice"
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function(){
                self.SDKAuth=true;
                authOKBackFun();
            });
            wx.error(function(res){
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

            });
        }.bind(this));
    }
    /**向 服务器 发送数据*/
    protected selectSendInfoTips(data):void{
        /*微信数据*/
        MyConsole.getInstance().trace("微信相关接口返回数据");
        MyConsole.getInstance().trace(data,100001);//打印日志
    }
}
