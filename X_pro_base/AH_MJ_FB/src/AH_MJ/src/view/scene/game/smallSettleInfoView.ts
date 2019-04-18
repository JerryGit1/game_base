/**
 * Created by TYQ on 2017/7/22.
 */
class AH_SmallSettleInfoView extends BaseView{
    protected model:SmallSettleModel;
    protected currentId;
    public constructor(model,currentId,currentUserWin,isHuang){
        super();
        this.model = model;
        this.currentId = currentId;
        this.initSettleInfo(currentUserWin,isHuang);
    }
    protected initSettleInfo(isWin,isHuang){
        //用户信息
        this.initUserInfo(isWin,isHuang);
        //牌的信息
        this.initCardInfo();
    }
    protected initUserInfo(isWin,isHuang){
        //头像
        var headView=new Game_headView();
        headView.x = 32;
        headView.y = -6;
        headView.setHead(this.model.userImg);
        headView.setOffLine(false);
        headView.setHighLight(false);
        if(this.model.userId == this.currentId){//玩家自己特殊处理
            // 添加赢牌or输牌听到的声音 and 流局
            if(!isHuang){
                SoundModel.stopAllBackEffect();
                isWin?SoundModel.playSoundEffect("champion_sound"):SoundModel.playSoundEffect("other_sound");
            }else{
                SoundModel.stopAllBackEffect();
                SoundModel.playSoundEffect("result_loss");
            }
            // headView.setChuStatus(true);
            headView.setHighLight(true);
        }
        headView.scaleX = 0.7;
        headView.scaleY = 0.7;
        this.addChild(headView);
        //名字
        var nameT = new egret.TextField();
        nameT.size = 16;
        if(this.model.userId == this.currentId){//玩家自己特殊处理
            nameT.textColor = 0xffff00;
        }else{
            nameT.textColor = 0xffffff;
        }
        nameT.multiline = true;
        nameT.textAlign = "center";
        nameT.verticalAlign = "middle";
        var str = this.model.userName;
        // if(str.length>4)str=str.substr(0,4)+"...";
        nameT.text=decodeURI(str);
        nameT.x = headView.x-nameT.width/2;
        nameT.y = headView.y+headView.height/2-12;
        this.addChild(nameT);
        //=====================分数=====================
        var sT_x = 869;
        var sn_x = 925;
        var tt_y = -34;

        var tColor = 0xFAFAFA;
        var nColor = 0xA7C4EF;
        //胡得分
        var huT = new egret.TextField();
        huT.size = 20;
        huT.textColor = tColor;
        huT.textAlign = "center";
        huT.x = sT_x;
        huT.y = tt_y;
        huT.text = "胡分";
        this.addChild(huT);

        var hu = new egret.TextField();
        hu.size = 21;
        hu.textColor = tColor;
        hu.textAlign = "right";
        hu.x = sn_x;
        hu.y = tt_y;
        hu.text = ""+this.model.winScore;
        this.addChild(hu);

        tt_y += 26;
        //杠得分
        var gangT = new egret.TextField();
        gangT.size = 20;
        gangT.textColor = tColor;
        gangT.textAlign = "center";
        gangT.x = sT_x;
        gangT.y = tt_y;
        gangT.text = "杠分";
        this.addChild(gangT);

        var gang = new egret.TextField();
        gang.size = 21;
        gang.textColor = tColor;
        gang.textAlign = "right";
        gang.x = sn_x;
        gang.y = tt_y;
        gang.text = ""+this.model.gangScore;
        this.addChild(gang);

        tt_y += 34;
        //总分
        var totalT = new egret.TextField();
        totalT.size = 24;
        totalT.textColor = 0xF2CC51;
        totalT.textAlign = "center";
        totalT.x = sT_x;
        totalT.y = tt_y;
        totalT.text = "总计";
        this.addChild(totalT);

        var total = new egret.TextField();
        total.size = 26;
        total.textColor = 0xF2CC51;
        total.textAlign = "right";
        total.x = sn_x;
        total.y = tt_y;
        total.text = ""+(Number(this.model.winScore)+Number(this.model.gangScore));
        this.addChild(total);

        //胡Icon
        if(this.model.isWin){
            var huIcon = this.CCenterBit("g_settle_huIcon");
            huIcon.x = 1030;
            this.addChild(huIcon);
        }
        //庄Icon
        if(this.model.zhuang){
            var zhuang=this.CCenterBit("g_zhuang");
            zhuang.scaleX = 0.8;
            zhuang.scaleY = 0.8;
            zhuang.x = 8;
            zhuang.y =headView.y-headView.height/2+zhuang.height/2+2;
            this.addChild(zhuang);
        }
        //胡的类型
        if(this.model.winInfo){
            var huT = new egret.TextField();
            huT.size = 20;
            huT.textColor = 0xffffff;
            huT.multiline = true;
            huT.textAlign = "left";
            huT.verticalAlign = "middle";
            huT.x = 100;
            huT.y = -50;

            var str="";
            switch (Number(this.model.winInfo)){
                case 1:str = "平胡";break;
                case 2:str = "夹胡";break;
                case 3:str = "单吊";break;
                case 4:str = "飘胡";break;
            }
            huT.text = str;
            this.addChild(huT);
        }
        //胡的番的类型
        if(this.model.fanInfo){
            var arr = [],str1="";
            for(var i:number=0;i<this.model.fanInfo.length;i++){
                arr.push(Number(this.model.fanInfo[i]));
            }
            var x=170;
            for(var j:number=0;j<arr.length;j++){
                var fanT = new egret.TextField();
                fanT.size = 20;
                fanT.textColor = 0xffffff;
                fanT.multiline = true;
                fanT.textAlign = "left";
                fanT.verticalAlign = "middle";
                fanT.x = x;
                fanT.y = -50;
                switch (arr[j]){
                    case 1:str1="自摸";break;
                    case 2:str1="门清";break;
                    case 3:str1="三家清";break;
                    case 4:str1="四家清";break;
                    case 5:str1="二八坐掌";break;
                }
                fanT.text = str1;
                this.addChild(fanT);
                x+=fanT.width+20;
            }
        }
        //点炮
        if(this.model.isDian){
            var dianIcon = this.CCenterBit("g_settle_dianIcon");
            dianIcon.x = 1030;
            this.addChild(dianIcon);
        }
    }
    protected initCardInfo(){
        var vx = 98;
        var i = 0;
        //吃碰杠牌
        for(var j=0;j<this.model.cpgBoard.length;j++){
            (function (index,model,_self) {
                var cpgView=new Game_cpgCardView();
                cpgView.setCardData(model.cpgBoard[index],1,BaseModel.USER_CARD_WIDTH*.7,0);
                cpgView.x = vx;
                cpgView.y = 24;
                if (model.cpgBoard[index].type == 6){
                    if(model.gangListType4){
                        cpgView.touchEnabled = true;
                        var dian_userId = model.gangListType4[i].toUserId;
                        i++;
                        cpgView.addEventListener(egret.TouchEvent.TOUCH_TAP,function (e) {
                            var data = {"dian_userId":dian_userId,"x":e.$stageX,"y":e.$stageY};
                            BaseModel.getInstance().eventRadio("searchName",data);
                        },_self);
                    }
                }
                _self.addChild(cpgView);
                vx += (cpgView.w*1.15);
            })(j,this.model,this)
        }
        //手牌
        for(var i=0;i<this.model.stopBoard.length;i++){
            var card = new Game_cardView(1,BaseModel.USER_CARD_WIDTH*0.67);
            card.x = vx;
            card.y = 16;
            var cInfo = this.model.stopBoard[i];
            card.setNewCard(cInfo.type,cInfo.num);
            this.addChild(card);
            //添加“胡”的标志
            if(i==this.model.stopBoard.length-1 && this.model.isWin){
                var sign = new egret.Bitmap(RES.getRes("g_settle_pai_hu"));
                sign.x = card.x-sign.width/2+10;
                sign.y = card.y-sign.height/2-20;
                this.addChild(sign);
            }
            //最后一张胡牌需要隔开
            if(i==this.model.stopBoard.length-2 && this.model.isWin)
                vx += (card.w*1.2);
            else
                vx += (card.w*.9);
        }

    }
}