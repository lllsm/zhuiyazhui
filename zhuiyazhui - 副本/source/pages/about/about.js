import { AppBase } from "../../appbase";
var WxParse = require('../../wxParse/wxParse');
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
 
    })
  }
  onMyShow() {
    var that = this;


  }
  bincall(){
    let phonecall = this.Base.getMyData().aboutuslist[0].dianhua;
    wx.makePhoneCall({
      phoneNumber: phonecall //仅为示例，并非真实的电话号码
    })
  }
  bincopy(e){
    console.log(e)

    wx.setClipboardData({
      data: e.currentTarget.dataset.data,
      success (res) {
        console.log(res);
      }
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bincall = content.bincall;
body.bincopy = content.bincopy;
Page(body)