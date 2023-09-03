// pages/content/content.js
import { AppBase } from "../../appbase";
import {CollegeApi} from "../../apis/college.api.js";
import Notify from '@vant/weapp/notify/notify';
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    this.Base.setMyData({
      height:decodeURIComponent(this.Base.options.height),
      width: decodeURIComponent(this.Base.options.width),
      mmHeight:decodeURIComponent(this.Base.options.mmHeight),
      mmWidth: decodeURIComponent(this.Base.options.mmWidth),
      tempFilePath: decodeURIComponent(this.Base.options.tempFilePath),
      url: decodeURIComponent(this.Base.options.url)
    });
  }
  onShareTimeline() {
    let data ={};
    data.imageUrl="https://college.cllsm.top/uploads/20221124/6542156492720249eb1cfba0ca64d803.png";
    data.title='我刚刚制作了一张属于自己的证件照，你也快来试试吧！';
    console.log(data)
    return data;
  }
  preView() {
    wx.previewImage({
      urls: [this.data.url],
      current: this.data.url
    })
  }
  goHome() {
    wx.reLaunch({
      url: '/pages/home/home'
    })
  }
  
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.preView = content.preView;
body.goHome = content.goHome;
Page(body)