// pages/content/content.js
import { AppBase } from "../../appbase";
import {CollegeApi} from "../../apis/college.api.js";
import Notify from '@vant/weapp/notify/notify';
import {
  ApiUtil
} from "../../apis/apiutil.js";
var WxParse = require('../../wxParse/wxParse');
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;

    console.log(this.Base.Page,'--------------------')
    super.onLoad(options);
    this.Base.setMyData({
    });
    var that = this;
    var collegeapi = new CollegeApi();
    collegeapi.newsdetails({id:this.Base.options.id},(newsdetails)=>{
      this.Base.setMyData({
        newsdetails:newsdetails.data
      })
      let cont = newsdetails.data.content;
      let content = ApiUtil.HtmlDecode(cont);
       WxParse.wxParse('content', 'html',content, that, 10);
    })
    collegeapi.updatenews({id:this.Base.options.id},(updatenews)=>{
      this.Base.setMyData({
        updatenews:updatenews.data
      })
    })
  }
  onMyShow() {
    var that = this;
    var collegeapi = new CollegeApi();

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
  onShareTimeline(){
    let imageUrl = this.Base.getMyData().uploadpath+this.Base.getMyData().newsdetails.image
    return {
      title: this.Base.getMyData().newsdetails.title,
      query: 'id='+this.Base.options.id+'&title='+this.Base.getMyData().newsdetails.title,
      imageUrl:imageUrl 
    }
  }
  onShareAppMessage() {
    return {
      title: this.Base.getMyData().newsdetails.title,
      path: '/pages/newsdetails/newsdetails?id='+this.Base.options.id,
    }
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bincopy = content.bincopy;
body.onShareTimeline= content.onShareTimeline;
body.onShareAppMessage = content.onShareAppMessage;
Page(body)