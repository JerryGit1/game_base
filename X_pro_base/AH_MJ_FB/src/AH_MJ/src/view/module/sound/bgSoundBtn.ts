/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
class BgSoundBtn extends SoundBtn{

    public constructor(bgTexture,openTexture,closeTexture){
        var volume = SoundModel.getBackSoundVolume();
        super(bgTexture,openTexture,closeTexture,volume);
    }
    protected click(e){
        SoundModel.setBgSound();
        super.click(e);
    }
    //改变纹理
    protected changTexture(){
        this.btn.texture=RES.getRes(SoundModel.getBgSound()?this.openTexture:this.closeTexture);
        super.changTexture(SoundModel.getBgSound());
    }
    //设置音量
    protected setVolume(volume){
        SoundModel.setBackSoundVolume(volume);
    }
}