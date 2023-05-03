// pages/content/content.js
import { AppBase } from "../../appbase";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      flag: false
    });
  }
  onMyShow() {
    var that = this;

  }
  mymember(e) {
    let list = e.currentTarget.dataset.list;
    console.log(list.name)
    wx.navigateTo({
      url: '/pages/mymember/mymember?id=' + list.id + "&nickName=" + list.nickName,
    })
  }
  mycourse(e) {
    let list = e.currentTarget.dataset.list;
    console.log(list.name)
    wx.navigateTo({
      url: '/pages/mycourse/mycourse?id=' + list.id + "&nickName=" + list.nickName,
    })
  }
  lxkfbin(e) {
    this.Base.setMyData({
      flag: true
    });
  }
  binoff() {
    this.Base.setMyData({
      flag: false
    });
  }
  advertising() {
    console.log(this.Base.getMyData().myadvertising[0].address);
    wx.navigateTo({
      url: `/${this.Base.getMyData().myadvertising[0].address}`
    })

  }
  hh(e) {
    var url = e.target.dataset.src;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  }
  About() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  }
  cookbook() {
    wx.navigateToMiniProgram(
      {
        appId: "wx5d9f496252c25e4e",
        path: "/pages/index/index",
      }
    )
  }
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.About = content.About;
body.cookbook = content.cookbook;
Page(body)