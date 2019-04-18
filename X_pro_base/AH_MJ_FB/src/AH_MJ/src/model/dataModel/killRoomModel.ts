/**
 * Created by 伟大的周鹏斌大王 on 2017/7/27.
 *
 * 解散房间信息
 */
class AH_Game_killRoomModel extends AH_BaseModel{
    public dissolveTime:number;/*发起时间*/
    public userId:number;/*发起人id*/
    public userName;/*发起人昵称*/
    public userImg;/*发起人头像*/
    public _isInitiator:boolean=false;/*是否是发起人*/
    public _isHandle:boolean=false;/*是否有过操作了*/
    protected _othersAgree:Array<any>;/*其他人信息*/
    public agree=0;/*解散房间整体状况 0 还没定 1解散成功 2解散失败*/
    public constructor(){
        super();
    }
    get othersAgree(): Array<any> {
        return this._othersAgree;
    }
    set othersAgree(value: Array<any>) {
        this._othersAgree=value;
        this.agree=1;
        for(var i in this._othersAgree){
            if(Number(this._othersAgree[i]["agree"])==0){/*没操作*/
                this.agree=0;
            }else if(Number(this._othersAgree[i]["agree"])==2){/*不同意*/
                this.agree=2;
                break;
            }
        }
    }

}
