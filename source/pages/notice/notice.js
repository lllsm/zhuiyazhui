import { AppBase } from "../../appbase";
import {ApiUtil} from "../../apis/apiutil.js";
var WxParse = require('../../wxParse/wxParse');
class Content extends AppBase {
  constructor() {super();}
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    let cont = wx.getStorageSync("content")||AppBase.instinfo.content||this.Base.getMyData().instinfo.content;
    let content = ApiUtil.HtmlDecode(cont);
    console.log(content)
    WxParse.wxParse('content', 'html',content, that, 10);
    this.Base.setMyData({})
  }
  onMyShow() {
    var that = this;
    let cont = wx.getStorageSync("content")||this.Base.getMyData().instinfo.content;
    let content = ApiUtil.HtmlDecode(cont);
    console.log(content)
    WxParse.wxParse('content', 'html',content, that, 10);
    this.Base.setMyData({})
  }
  onUnload(){
  }
  onShareTimeline() {
    let data ={};
    data.imageUrl="https://college.cllsm.top/uploads/20221124/6542156492720249eb1cfba0ca64d803.png";
    data.title=this.Base.getMyData().instinfo.slogen;
    console.log(data)
    return data;
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.onUnload = content.onUnload;
body.onShareTimeline = content.onShareTimeline;
Page(body)