var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
var SoundModel = (function (_super) {
    __extends(SoundModel, _super);
    function SoundModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SoundModel.getLocalStorage = function () {
        /*背景*/
        this.bgSound_isPlay = true;
        if (egret.localStorage.getItem("bgSound_isPlay") != null) {
            if (egret.localStorage.getItem("bgSound_isPlay") == "false") {
                this.bgSound_isPlay = false;
            }
        }
        /*音效*/
        this.effectSound_isPlay = true;
        if (egret.localStorage.getItem("effectSound_isPlay") != null) {
            if (egret.localStorage.getItem("effectSound_isPlay") == "false") {
                this.effectSound_isPlay = false;
            }
        }
        /*背景音量*/
        if (egret.localStorage.getItem("musicVolume") != null) {
            this.musicVolume = Number(egret.localStorage.getItem("musicVolume"));
        }
        /*音效音量*/
        if (egret.localStorage.getItem("soundVolume") != null) {
            this.soundVolume = Number(egret.localStorage.getItem("soundVolume"));
        }
    };
    /*===================背景音乐===================*/
    /*设置背景音乐开关*/
    SoundModel.setBgSound = function () {
        this.bgSound_isPlay = !this.bgSound_isPlay;
        if (this.bgSound_isPlay) {
            this.playBackSound(this.currentBackSoundName);
        }
        else {
            this.stopBackSound();
        }
        egret.localStorage.setItem("bgSound_isPlay", String(this.bgSound_isPlay));
    };
    /*获取背景音乐开关*/
    SoundModel.getBgSound = function () {
        return this.bgSound_isPlay;
    };
    SoundModel.playBackSound = function (name) {
        this.currentBackSoundName = name;
        if (name && this.bgSound_isPlay) {
            this.stopBackSound();
            var sound = RES.getRes(name);
            if (sound) {
                this.backSoundChannel = sound.play();
                this.backSoundChannel.volume = this.musicVolume;
            }
        }
    };
    /*暂停背景音乐*/
    SoundModel.stopBackSound = function () {
        if (this.backSoundChannel) {
            this.backSoundChannel.stop();
            this.backSoundChannel = null;
        }
    };
    /*设置背景音乐音量大小*/
    SoundModel.setBackSoundVolume = function (volume) {
        if (this.backSoundChannel) {
            this.backSoundChannel.volume = volume;
        }
        this.musicVolume = volume;
        egret.localStorage.setItem("musicVolume", String(volume));
    };
    /*获取背景音乐音量大小*/
    SoundModel.getBackSoundVolume = function () {
        return this.musicVolume;
    };
    /*===================音效===================*/
    /*设置音效开关*/
    SoundModel.setEffectSound = function () {
        this.effectSound_isPlay = !this.effectSound_isPlay;
        egret.localStorage.setItem("effectSound_isPlay", String(this.effectSound_isPlay));
    };
    /*获取置音声音开关*/
    SoundModel.getEffectSound = function () {
        return this.effectSound_isPlay;
    };
    /*播放音效*/
    SoundModel.playSoundEffect = function (name, soundChannel, baseUrl) {
        if (soundChannel === void 0) { soundChannel = null; }
        if (baseUrl === void 0) { baseUrl = "resource/AH_MJ/sound/"; }
        if (this.effectSound_isPlay) {
            if (this.soundLib[name]) {
                var soundChannel = this.soundLib[name].play(0, 1);
                soundChannel.volume = this.soundVolume;
            }
            else {
                LoadLayer.getInstance().loadExternalSound(baseUrl + name + ".mp3", function (sound) {
                    this.soundLib[name] = sound;
                    var soundChannel = this.soundLib[name].play(0, 1);
                    soundChannel.volume = this.soundVolume;
                }.bind(this));
            }
        }
    };
    /*播放音效*/
    SoundModel.playSoundEffect_audio = function (name, soundChannel, baseUrl) {
        if (soundChannel === void 0) { soundChannel = null; }
        if (baseUrl === void 0) { baseUrl = "resource/AH_MJ/sound/"; }
        if (this.effectSound_isPlay) {
            if (this.soundLib[name]) {
                this.soundLib[name].play();
                this.soundLib[name].volume = this.soundVolume;
            }
            else {
                LoadLayer.getInstance().loadExternalSound_audio(baseUrl + name + ".mp3", function (sound) {
                    this.soundLib[name] = sound;
                    this.soundLib[name].play();
                    this.soundLib[name].volume = this.soundVolume;
                }.bind(this));
            }
        }
    };
    /*暂停音效*/
    SoundModel.stopAllBackEffect = function () {
        // for(var i in this.soundChannelLib){
        //     if(this.soundChannelLib[i]){
        //         this.soundChannelLib[i].stop();
        //         this.soundChannelLib[i]=null;
        //     }
        // }
        // this.soundChannelLib=[];
    };
    /*设置音效音量大小*/
    SoundModel.setEffectVolume = function (volume) {
        this.soundVolume = volume;
        egret.localStorage.setItem("soundVolume", String(volume));
    };
    /*获取背景音乐音量大小*/
    SoundModel.getEffectVolume = function () {
        return this.soundVolume;
    };
    return SoundModel;
}(BaseModel));
/*----------------------声音控制---------------------------*/
SoundModel.bgSound_isPlay = true;
SoundModel.effectSound_isPlay = true;
SoundModel.soundLib = {};
// private static soundChannelLib={};
SoundModel.soundVolume = 1;
SoundModel.musicVolume = 1;
__reflect(SoundModel.prototype, "SoundModel");
