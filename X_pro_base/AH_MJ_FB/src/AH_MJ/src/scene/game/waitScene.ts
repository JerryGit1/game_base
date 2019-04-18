/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 一局结束到下一局等待场景
 */
class AH_WaitScene extends AH_GameBaseScene{
    protected model:Game_backLayerModel;
    protected btnList:Array<Game_waitBtnView>=[];
    public constructor(model){
        super(model);
        var  i,btn;
        var list = [
            {"x":Main.stageWidth*0.5,"y":Main.stageHeight*0.8},
            {"x":Main.stageWidth*0.72,"y":Main.stageHeight*0.5},
            {"x":Main.stageWidth*0.5,"y":Main.stageHeight*0.2},
            {"x":Main.stageWidth*0.28,"y":Main.stageHeight*0.5},
        ];
        for(i=1;i<=4;i++){
            btn=new Game_waitBtnView("g_readyBtn",this.model.userGroupModel.numIdGetUserModel(i));
            btn.x=list[i-1].x;
            btn.y=list[i-1].y;
            this.addChild(btn);
            this.btnList.push(btn);
        }
    }
    public clear(){
        super.clear();
        for(var i in this.btnList){
            this.btnList[i].clear();
        }
        this.btnList=null;
    }
}