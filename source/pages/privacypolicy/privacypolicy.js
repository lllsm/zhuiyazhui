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
    this.Base.setMyData({
    });
    wx.setNavigationBarTitle({
      title: this.options.type=="A"? "用户协议" : "隐私政策"
    })

  }
  onMyShow() {
    var that = this;
    // let keyword = this.Base.getMyData().keyword;
    // var collegeapi = new CollegeApi();
    // collegeapi.collegeclass({keyword:keyword||"",checkstate:'B'},(classlist)=>{
    //   this.Base.setMyData({
    //     classlist:classlist.data
    //   })
    // })
  }
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)