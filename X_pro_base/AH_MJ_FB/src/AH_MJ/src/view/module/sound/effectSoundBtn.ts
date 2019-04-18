/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
/*-tyq:去掉AH_EffectSoundBtn，改为EffectSoundBtn*/
class EffectSoundBtn extends SoundBtn{

    public constructor(bgTexture,openTexture,closeTexture){
        var volume = SoundModel.getEffectVolume();
        super(bgTexture,openTexture,closeTexture,volume);
    }
    protected click(e){
        SoundModel.setEffectSound();
        super.click(e);
    }
    //改变纹理
    protected changTexture(){
        this.btn.texture=RES.getRes(SoundModel.getEffectSound()?this.openTexture:this.closeTexture);
        super.changTexture(SoundModel.getEffectSound());
    }
    //设置音量
    protected setVolume(volume){
        SoundModel.setEffectVolume(volume);
    }
}