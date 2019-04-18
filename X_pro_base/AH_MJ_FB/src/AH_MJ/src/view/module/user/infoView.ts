/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
class AH_Game_user_infoView extends BaseView{
    /*昵称*/
    // private nickNameTxt:egret.TextField; 1.2.0 删除
    /*分数*/
    private yuanbaoText:egret.TextField;
    public constructor(){
        super();
        var bg = this.CCenterBit("g_userInfoBg");
        bg.x = 5;
        bg.y = 8;
        // this.addChild(bg);
        //昵称
        /* 1.2.0 删除
        var nickNameTxt=new egret.TextField();
        this.addChild(nickNameTxt);
        nickNameTxt.size=16;
        nickNameTxt.textColor=0xffffff;
        nickNameTxt.multiline=true;
        nickNameTxt.textAlign="center";
        nickNameTxt.verticalAlign="middle";
        nickNameTxt.width=bg.width;
        nickNameTxt.x=-66;
        nickNameTxt.y=-23;
        this.setPointY(nickNameTxt);
        nickNameTxt.fontFamily="微软雅黑";
        this.nickNameTxt=nickNameTxt;*/
        //分数
        var yuanbaoText=new egret.TextField();
        this.addChild(yuanbaoText);
        yuanbaoText.textColor=0xf0b921;
        yuanbaoText.multiline=true;
        yuanbaoText.textAlign="center";
        yuanbaoText.verticalAlign="middle";
        yuanbaoText.width=bg.width;
        yuanbaoText.fontFamily="微软雅黑";
        yuanbaoText.size=22;
        yuanbaoText.x=-50;
        yuanbaoText.y=0;
        this.setPointY(yuanbaoText);
        this.yuanbaoText=yuanbaoText;
    }
    /*更新数据*/
    public updateInfo(yuanBao=null,nickNameStr=null){
        if(yuanBao!=null){
            if(this.yuanbaoText.text){
                var num = Number(this.yuanbaoText.text);
                if(num < yuanBao) this.increaseScore(num,yuanBao);
                if(num > yuanBao) this.decreaseScore(num,yuanBao);
            }else
                this.yuanbaoText.text = yuanBao;
        }
        /* 1.2.0 删除
        if(nickNameStr!=null){
            if(nickNameStr.length>6)nickNameStr=nickNameStr.substr(0,6)+"...";
            this.nickNameTxt.text=decodeURI(nickNameStr);
        }*/

    }
    private increaseScore(startNum,endNum){//分数增加动画
        var num = startNum;
        var tN = Math.ceil((endNum-startNum)/10);
        var self = this;
        var handle = setInterval(function () {
            if(num != endNum){
                num += tN;
                if(num >= endNum)  num = endNum;
                self.yuanbaoText.text = "" + num;
            }else{
                clearInterval(handle);
            }
        }, 20);
    }
    private decreaseScore(startNum,endNum){//分数减少动画
        var num = startNum;
        var self = this;
        var tN = Math.ceil((startNum-endNum)/10);
        var handle = setInterval(function () {
            if(num != endNum){
                num -= tN;
                if(num <= endNum)  num = endNum;
                self.yuanbaoText.text = "" + num;
            }else{
                clearInterval(handle);
            }
        }, 20);
    }
}