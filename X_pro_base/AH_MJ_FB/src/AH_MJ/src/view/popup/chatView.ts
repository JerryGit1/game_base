
/**
 * Created by TYQ on 2017/7/12.
 */
class AH_ChatView extends PopupBaseView{
    protected model:UserModel;
    protected springBtn:MyButton;
    protected faceBtn:MyButton;
    protected faceBg:egret.Bitmap;
    protected springBtnArr = [];
    protected curType:string = "spring";
    protected chatTextArr = [];
    protected chatFaceArr = [];
    protected myscrollView:egret.ScrollView;
    protected messageSprite:egret.Sprite;
    public constructor(model){
        super();
        this.model = model;
        this.initBg();
        this.addBtns();
        //添加按钮事件
        this.springBtn.addTouchEvent();
        this.springBtn.addEventListener("click",this.chatBtnClick,this);
        this.faceBtn.addTouchEvent();
        this.faceBtn.addEventListener("click",this.chatBtnClick,this);

        this.createSpringChild(this.springBtn);
        this.openAni();
    }
    protected initBg(){
        /*背景*/
        var bg:egret.Bitmap = this.addMsgBg(Main.stageWidth*0.7,Main.stageHeight*0.6);//"b_p_bg",
        // var x = bg.width-27;
        // var y = 7;
        var x = bg.width-7;
        var y = 5;
        this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addTitle("g_chat_titleBg",this.centerSp.width/2,45);
    }
    protected addBtns(){
        //聊天按钮
        this.springBtn = new MyButton("g_chat_springOnBtn");
        this.springBtn.x = 304;
        this.springBtn.y = 45;
        this.springBtn["type"] = "spring";
        this.centerSp.addChild(this.springBtn);
        this.springBtnArr.push(this.springBtn);

        //表情按钮
        this.faceBtn = new MyButton("g_chat_faceOffBtn");
        this.faceBtn.x = 520;
        this.faceBtn.y = 45;
        this.faceBtn["type"] = "face";
        this.centerSp.addChild(this.faceBtn);
        this.springBtnArr.push(this.faceBtn);
    }
    protected chatBtnClick(e){
        var btn = e.currentTarget;
        if(btn.type != this.curType){
            for(var i in this.springBtnArr){
                if(this.springBtnArr[i].type == btn.type){
                    var str = "g_chat_"+btn.type+"OnBtn";
                    this.springBtnArr[i].changTexture(str);
                }else{
                    var str = "g_chat_"+this.curType+"OffBtn";
                    this.springBtnArr[i].changTexture(str);
                }
            }
            this.curType = btn.type;
            this.createSpringChild(btn);
        }
    }
    //聊天弹框的点击事件
    protected createSpringChild(btn){
        //首先如果存在，先移除
        if(this.chatTextArr.length>0){
            for(var j in this.chatTextArr){
                this.messageSprite.removeChild(this.chatTextArr[j]);
                this.chatTextArr[j]=null;
            }
        }
        this.chatTextArr=[];
        if(this.chatFaceArr.length>0){
            for(var j1 in this.chatFaceArr){
                this.messageSprite.removeChild(this.chatFaceArr[j1]);
                this.chatFaceArr[j1]=null;
            }
        }
        this.chatFaceArr=[];
        if(this.faceBg) {
            this.centerSp.removeChild(this.faceBg);
            this.faceBg = null;
        }

        //实例化可滑动的显示数据框
        this.messageSprite=new egret.Sprite();
        this.centerSp.addChild(this.messageSprite);

        var self=this;
        if(btn.type == "spring"){
            for(var i:number=1;i<=5;i++){
                var chatBtn1 = new DoubleBtn("g_chat_springBg","g_chat_sp"+Number(i));
                // chatBtn1.changeSize(0.8,0.7);
                chatBtn1.x = 392;
                chatBtn1.y = -15+80*Number(i);
                chatBtn1["value"] = Number(i);
                this.messageSprite.addChild(chatBtn1);

                chatBtn1.addTouchEvent();
                chatBtn1.addEventListener("click",function (e) {
                    var value = e.target.value;
                    var parent=e.target.parent.parent.parent;
                    self.onRemoveAni(e,parent);
                    BaseModel.getInstance().eventRadio("changeChatStatus",{
                        "type":2,
                        "idx":value
                    });

                },this);
                this.chatTextArr.push(chatBtn1);
            }
        }else{
            //表情
            var bg3 = this.CCenterBit("h_textBoxBg");
            bg3.scale9Grid = new egret.Rectangle(94,28,566,172);
            bg3.x = 372;
            bg3.y = 230;
            bg3.width=740;
            bg3.height=330;
            this.faceBg = bg3;
            this.centerSp.addChild(this.faceBg);


            var baseX=114,baseY=50;
            for(var k =1;k<=32;k++){
                var chatBtn2 = new MyButton("game_face"+Number(k));
                chatBtn2.x = baseX;
                chatBtn2.y = baseY;
                baseX+=(63+chatBtn2.width);
                if(Number(k)%5==0){
                    baseX = 114;
                    baseY += chatBtn2.height*1.09;
                }
                chatBtn2["value"]=Number(k);
                this.messageSprite.addChild(chatBtn2);

                chatBtn2.addTouchEvent();
                chatBtn2.addEventListener("click",function (e) {
                    var parent=e.currentTarget.parent.parent.parent;
                    self.onRemoveAni(e,parent);
                    var value = e.currentTarget.value;
                    BaseModel.getInstance().eventRadio("changeChatStatus", {
                        "type":1,
                        "idx":value
                    })
                },this);
                this.chatFaceArr.push(chatBtn2);
            }
        }
        this.messageSprite.height += 40;
        /*便于无差别拖动*/
        this.messageSprite.graphics.beginFill(0x00ff00,0);
        this.messageSprite.graphics.drawRect(0,0,this.centerWidth,this.messageSprite.height);
        this.messageSprite.graphics.endFill();

        this.myscrollView = new egret.ScrollView();
        this.myscrollView.setContent(this.messageSprite);
        this.myscrollView.x=0;
        this.myscrollView.y=90;
        this.myscrollView.width=800;
        this.myscrollView.height=this.centerHeight-120;
        this.centerSp.addChild(this.myscrollView);
    }

    public onRemoveAni(e:egret.Event=null,sp1=null):void {
        var sp;
        if(sp1==null){
            sp=e.currentTarget.parent;
        }else{
            sp=sp1;
        }
        var self=this;
        egret.Tween.get(sp).to({alpha:0},100).call(function(){
            if(self.chatTextArr.length>0){
                for(var j1 in self.chatTextArr){
                    self.messageSprite.removeChild(self.chatTextArr[j1]);
                    self.chatTextArr[j1]=null;
                }
            }
            self.chatTextArr=[];

            if(this.chatFaceArr.length>0){
                for(var j1 in this.chatFaceArr){
                    self.messageSprite.removeChild(this.chatFaceArr[j1]);
                    this.chatFaceArr[j1]=null;
                }
            }
            this.chatFaceArr=[];

            if(self.messageSprite){
                sp.removeChild(self.myscrollView);
                self.myscrollView=null;
                self.messageSprite=null;
            }
            this.dispatchEvent(new egret.Event("close"));
        },this);
    }

    public clear(){
        super.clear();
        this.springBtn.clear();
        this.springBtn.removeEventListener("click",this.chatBtnClick,this);
        this.faceBtn.clear();
        this.faceBtn.removeEventListener("click",this.chatBtnClick,this);
    }

}