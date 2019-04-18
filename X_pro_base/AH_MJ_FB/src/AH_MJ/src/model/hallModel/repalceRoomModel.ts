/**
 * Created by Tang on 2017/8/24.
 */
class AH_H_replaceRoomModel extends AH_BaseModel{
    public roomId:number;/*房间Id*/
    public _createTime:number;/*创建时间*/
    public circleNum:number;/*圈数*/
    // private _maxScore:number;/*封顶分*/
    // private _lastNum:number;/*剩余圈数*/
    public status:string;/*房间状态*/
    protected _playerInfo:Array<UserBaseModel> = [];
    protected curStr = "";
    public constructor(){
        super();
    }
    get createTime():number{
        return this._createTime;
    }
    set createTime(value){
        this._createTime = Number(value);
    }
    get playerInfo():Array<UserBaseModel>{
        return this._playerInfo;
    }
    set playerInfo(value) {
        var currValue = JSON.stringify(value);
        if(this.curStr != currValue){
            this.curStr = currValue;
            for(var i in value){
                var model = new UserBaseModel();
                model.setParams(value[i]);
                this._playerInfo.push(model);
            }
        }
    }
}