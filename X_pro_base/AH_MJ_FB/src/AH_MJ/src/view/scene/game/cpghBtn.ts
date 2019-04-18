/**
 * Created by 伟大的周鹏斌大王 on 2017/7/19.
 * 吃碰杠胡按钮
 */
class AH_Game_cpghBtn extends AH_DoubleBtn{
    public model:CpghBtnModel;
    public constructor(model:CpghBtnModel,textureStr=null){
        if(!textureStr)textureStr="g_cpghBtn_"+model.type;
        super("g_cpghBtn_bg",textureStr);
        this.model=model;
    }
}
