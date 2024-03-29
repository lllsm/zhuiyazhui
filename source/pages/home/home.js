import {
  AppBase
} from "../../appbase";
import {
  CollegeApi
} from "../../apis/college.api.js";
import Notify from '@vant/weapp/notify/notify';
import Dialog from '@vant/weapp/dialog/dialog';
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    wx.setBackgroundColor({
      backgroundColor: '#ffffff'
    })
    console.log(this.Base.Page, '--------------------')
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      flag: false,
      show: false,
      class_key: "",
      remind: '加载中',
      angle: 0,
      timeData: {},
    });
    const {
      height,
      top
    } = wx.getMenuButtonBoundingClientRect();
    this.Base.setMyData({
      margintop: top,
      funcrowheight: height
    })
    var collegeapi = new CollegeApi();
    collegeapi.indexbanner({}, (indexbanner) => {
      this.Base.setMyData({
        indexbanner: indexbanner.data
      })
    })

  }
  onMyShow() {
    var that = this;
    let keyword = this.Base.getMyData().keyword;
    var collegeapi = new CollegeApi();
    collegeapi.collegeclass({
      keyword: keyword || "",
      checkstate: 'B',
      isd: "new"
    }, (classlist) => {
      this.Base.setMyData({
        classlist: classlist.data
      })
    })
    collegeapi.information({
      type: "2"
    }, (informationlist) => {
      this.Base.setMyData({
        informationlist: informationlist.data
      })
    })
    that.Base.setMyData({
      time: new Date('2023-12-25 00:00:00').getTime() - new Date().getTime()
    })




    wx.downloadFile({
      url: 'https://gpt.cllsm.top:4080/image/4e5f8b61-8116-4ce7-a891-baea207044a6.png', //仅为示例，并非真实的资源
      success (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log(res,'wlllllllll')
        }
      }
    })

  }
  onReady() {
    var that = this;
    setTimeout(function () {
      that.Base.setMyData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (that.Base.getMyData().angle !== angle) {
        that.Base.setMyData({
          angle: angle
        });
      }
    });
  }
  onShareTimeline() {
    let imageUrl = 'https://college.cllsm.top/uploads/20221124/6542156492720249eb1cfba0ca64d803.png';
    return {
      title: '幸运是努力了好久发出的光，快快加入我们吧！',
      // query: 'id='+this.Base.options.id+'&title='+this.options.title,
      imageUrl: imageUrl
    }
  }
  search(e) {
    let keyword = e.detail.value;
    this.Base.toast(keyword)
    this.Base.setMyData({
      keyword
    })
    this.onMyShow();
  }
  showPopup() {
    this.Base.setMyData({
      show: true
    });
  }
  onClose() {
    this.Base.setMyData({
      show: false
    });
  }
  bin_indexbanner(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item;
    if (item.switch == 1) {
      wx.navigateToMiniProgram({
        appId: item.appid,
        path: item.address_page,
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else {
      wx.navigateTo({
        url: item.address_page,
        success: function (res) {}
      })
    }
  }
  btn_details(e) {
    console.log(e.currentTarget.dataset.item);
    let item = e.currentTarget.dataset.item;
    var that = this;
    console.log(that.Base.getMyData().memberinfo);
    let memberinfo = that.Base.getMyData().memberinfo;
    if (memberinfo.nickname == memberinfo.username || memberinfo.nickname == "微信昵称") {
      wx.showModal({
        title: '提示',
        content: '请先修改系统默认昵称',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/myinfo/myinfo?mobile=' + memberinfo.mobile + '&nickName=' + memberinfo.nickname,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (item.is_pas_switch == 1) {
      this.Base.setMyData({
        show: true,
        class_key: item.class_pas,
        class_id: item.id,
        class_name: item.class_name
      })
    } else {
      console.log(item.class_name)
      wx.navigateTo({
        url: '/pages/classdetails/classdetails?id=' + item.id + '&title=' + item.class_name,
      })
    }
  }
  bin_key(e) {
    console.log(e.detail.value)
    if (e.detail.value == this.Base.getMyData().class_key) {
      // 成功通知
      Notify({
        type: 'success',
        message: '口令通过'
      });
      this.Base.toast("口令通过");
      wx.navigateTo({
        url: '/pages/classdetails/classdetails?id=' + this.Base.getMyData().class_id + '&title=' + this.Base.getMyData().class_name,
      })
    } else {
      // 危险通知
      Notify({
        type: 'danger',
        message: '口令错误',
        safeAreaInsetTop: true
      });
      this.Base.toast("口令错误");
    }
  }
  to_addclass() {
    var that = this;
    console.log(that.Base.getMyData().memberinfo);
    let memberinfo = that.Base.getMyData().memberinfo;
    if (memberinfo.nickname == memberinfo.username || memberinfo.nickname == "微信昵称") {
      wx.showModal({
        title: '提示',
        content: '请先修改系统默认昵称',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/myinfo/myinfo?mobile=' + memberinfo.mobile + '&nickName=' + memberinfo.nickname,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/addclass/addclass',
      })
    }
  }
  btn_newsdetails(e) {
    console.log(e.currentTarget.id)
    // return
    wx.navigateTo({
      url: '/pages/newsdetails/newsdetails?id=' + e.currentTarget.id,
    })
  }
  btnvideo() {
    wx.navigateTo({
      url: '/pages/video/video',
    })
  }
  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.onReady = content.onReady;
body.search = content.search;
body.showPopup = content.showPopup;
body.onClose = content.onClose;
body.btn_details = content.btn_details;
body.bin_key = content.bin_key;
body.to_addclass = content.to_addclass;
body.bin_indexbanner = content.bin_indexbanner;
body.btn_newsdetails = content.btn_newsdetails;
body.onShareTimeline = content.onShareTimeline;
body.btnvideo = content.btnvideo;
body.onChange = content.onChange;
Page(body)