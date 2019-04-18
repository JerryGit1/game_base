/**
 * Created by 周鹏斌大王 on 2017-12-16.
 * 检测网络质量。
 */
class AH_networkQualityModel extends BaseModel{

    private networkInterval;//循环判断网络状态
    private reNetworkInterval;//循环判断 网络断开后 是否连上了
    private speedInterval;//循环检测网速
    private time:number=5000;//5秒检测一次
    public constructor(){
        super();
        //监听后端通知 其他玩家包括自己的网络情况
    }
    /*进入房间后 开始检测网络*/
    public start(){
        this.startNetwork();//
        this.startSpeed();
    }
    /*大结算后   关闭检测*/
    public stop(){
        this.endSpeed();
        this.endNetwork();
    }
    /*本地得到测试结果 ms 通知后端*/
    private setCurrentSpeed(speed:number=0){
        var speedLevel=0;
        if(speed&&speed<200){
            if(speed<100){
                //网速好
                speedLevel=1;
            }else{
                //网速中等
                speedLevel=2;
            }
        }else{
            //网速糟糕
            window.setTimeout(function(){
                if(this.getConnectState() == 1) {
                    window.clearInterval(this.networkInterval);
                    this.networkInterval = null;
                    this.startSpeed();
                } else {
                    this.disconnect();
                }
            }.bind(this), 2 * this.time);
            speedLevel=3;
        }

        //走后端接口告诉后端信号质量 ===>>> 改为只显示自己 唐山 2.2.3 alpha 修改
        // this.eventRadio(BaseModel.GAME_CHANGE_VIEW_checkNetWork,speedLevel);
        this.getNetworkOk(speedLevel)
    }
    /*线上得到其他玩家结果 刷新前端视图*/
    public getNetworkOk(level){
        //刷新视图
        // this.eventRadio(BaseModel.GAME_CHANGE_VIEW_network,{level:data.idx,userId:data.userId}); // 刷新其他玩家
        this.eventRadio(BaseModel.GAME_CHANGE_VIEW_network,level);
    }
    /**
     * 开启网络连接监测
     */
    private startNetwork(){
        if (this.getConnectState() == 1) {
            this.networkInterval = window.setInterval(function(){
                if (this.getConnectState() == 0) {
                    this.disconnect();
                }
            }.bind(this), this.time);
        } else{
            this.disconnect();
        }
    }
    /**
     * 开启速度监测
     */
    private startSpeed(){
        window.clearInterval(this.speedInterval);
        this.speedInterval = null;
        if(this.getConnectState() == 1) {
            this.speedInterval = window.setInterval(function(){
                var start = new Date().getTime();
                if (this.getConnectState() == 1) {
                    var img = document.getElementById("networkSpeedImage");
                    if (!!!img) {
                        img = document.createElement("IMG");
                        img.id = "networkSpeedImage";
                        img.style.display = "none";
                        document.body.appendChild(img);
                    }
                    try {
                        img["src"] = "http://www.baidu.com/img/baidu_jgylogo3.gif?_t=" + new Date().getTime();
                        img.onload = function(){
                            this.setCurrentSpeed(new Date().getTime()-start);
                        }.bind(this);
                    } catch(e){
                        this.setCurrentSpeed(null);
                    }
                } else {
                    // TODO 网络断开
                    this.disconnect();
                }
            }.bind(this), this.time);
        }else {
            // TODO 网络断开
            this.disconnect();
        }
    }
    /**
     * 获取网络连接状态
     */
    private getConnectState(){
        return navigator.onLine ? 1 : 0;
    }
    private disconnect(){
        window.clearInterval(this.reNetworkInterval);
        this.reNetworkInterval = null;
        this.endSpeed();
        this.endNetwork();
        window.setTimeout(function(){
            this.reNetworkInterval = window.setInterval(function(){
                if (this.getConnectState() == 1) {
                    window.clearInterval(this.reNetworkInterval);
                    this.reNetworkInterval = null;
                    this.startSpeed();
                    this.startNetwork();
                } else {
                    window.clearInterval(this.reNetworkInterval);
                    this.reNetworkInterval = null;
                    this.disconnect();
                }
            }.bind(this), this.time);
        }, 2 * this.time);
    }
    private endSpeed(){
        window.clearInterval(this.speedInterval);
        this.speedInterval = null;
    }
    private endNetwork(){
        window.clearInterval(this.networkInterval);
        this.networkInterval = null;
    }
}