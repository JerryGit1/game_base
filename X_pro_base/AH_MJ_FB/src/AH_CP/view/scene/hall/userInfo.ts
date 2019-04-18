/**
 * Created by 韩 on 2017/7/7.
 * 用户信息
 * 1.用户头像
 * 2.用户昵称
 * 3.元宝
 * 4.充值按钮
 */
class H_userInfoView extends AH_H_userInfoView{

    public constructor(model){
        super(model);
    }
    //点击加号事件
    protected addHitView(e){
        PopupLayer.getInstance().addHintView("代理咨询请联系群主：微信dfmjkf01，客服微信dfmjkf007",null,true,"min");
    }
}