/**
 * Created by 伟大的周鹏斌大王 on 2017/7/22.
 */
class AH_Game_waitBtnView extends MyButton{

    protected model:UserModel;

    public constructor(str,model){
        super(str);
        this.model=model;
        //玩家状态更新
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerState,this.updateStateInfo,this);
        this.updateStateInfo();
    }
    public updateStateInfo(e:egret.Event=null){
        if(this.model.playStatus==BaseModel.PLAYER_PREPARED){/*准备状态*/
            this.visible=true;
        }else{
            this.visible=false;
        }
    }
    public clear(){
        super.clear();
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerState,this.updateStateInfo,this);
    }
}