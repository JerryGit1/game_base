/**
 * Created by 伟大的周鹏斌大王 on 2017/7/22.
 * 微信分享服务类
 * http://res.wx.qq.com/open/js/jweixin-1.2.0.js
 */
class WeiXinJSSDK extends AH_WeiXinJSSDK{
    public constructor(){
        super();
    }
    /*单例*/
    private static service:WeiXinJSSDK;
    public  static getInstance(){
        if(!this.service){
            this.service=new WeiXinJSSDK();
        }
        return this.service;
    }
    /*----------------------分享接口-------------------------*/
    //游戏大厅分享
    public hallShare(){
        var data={
            title:"【东丰麻将】",
            link:this.gameLink+"?cId="+this.model.cId,
            imgUrl:AH_baseService.host+"game/X1/icon.png",
            desc:"东丰麻将，原汁原味本地打法。无需下载，分享好友，直接组局！"
        };
        this.weixinShare(data);
    }
    //游戏中分享
    public gameShare(roomId,totalNum,maxScore,homeName,type="original"){
        var data={
            title:"东丰麻将  房间号："+roomId,
            link:this.gameLink+"?cId="+this.model.cId+"&state="+roomId,
            imgUrl:AH_baseService.host+"game/X1/icon.png",
            desc:"房主:"+homeName+" \n玩法:"+totalNum+"圈，"+maxScore+"封顶，点炮包三家"
        };
        this.weixinShare(data);
    }
    // 大结算分享
    public settlementShare(roomId,userList,type="original"){
        var data={
            title:"大赢家-"+getName(userList[0].userName,6)+":"+userList[0].score+"分",
            link:this.gameLink+"?cId="+this.model.cId+"&state="+roomId,
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
}
