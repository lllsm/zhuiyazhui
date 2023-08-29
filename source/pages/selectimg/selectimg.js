// pages/content/content.js
import { AppBase } from "../../appbase";
import Notify from '@vant/weapp/notify/notify';
import {
  CollegeApi
} from "../../apis/college.api.js";
import {
  WechatApi
} from '../../apis/wechat.api';
import {
  MemberApi
} from "../../apis/member.api.js";
const app = getApp();
// 在页面中定义插屏广告
let interstitialAd = null;
// 在页面中定义激励视频广告
let videoAd = null
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      autoplay: true,
      interval: 3000,
      duration: 1200,
      detail: {}
    });
    const sizeDetail = JSON.parse(decodeURIComponent(this.Base.options.data))
    this.setData({
      detail: sizeDetail
    })
    const data = {
      "swiperDatas": [{
          "id": 1,
          "imgurl": "./needs/1.jpg"
        },
        {
          "id": 2,
          "imgurl": "./needs/2.jpg"
        },
        {
          "id": 3,
          "imgurl": "./needs/3.jpg"
        }
      ]
    };
    this.setData({
      swiperDatas: data.swiperDatas
    })
    var that = this;
    
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-90c6231e75da2c65'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-ca124a881e9783bf'
      })
      videoAd.onLoad(() => {
        console.log('激励视频 广告加载成功')
      })
      videoAd.onError((err) => {
        console.log('激励视频 广告加载失败')
        rewardedVideoAd.load()
          .then(() => rewardedVideoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          this.Base.toast("积分发放成功！")
          var memberapi = new MemberApi();
          memberapi.updatescore({}, (updatescore) => {
            console.log(updatescore)
            that.onMyShow()
            that.onShow();
          })
          that.onMyShow()

        } else {
          this.Base.toast("播放中途退出，积分发放失败！")
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
  }
  onMyShow() {
    var that = this;
  }

  
  // 相册选择
  remove_background() {
    var that = this;
    var wechatApi = new WechatApi();
    wx.showLoading({
      title: '处理中',
    })
    that.checkscore()
    .then((score) => {
      if (score <= 0) {
        console.log("积分不足")
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '您所剩的积分不足，请获取积分，当前积分' + score,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.showvideoAd()
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.chooseMedia({
          count: 1,
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          maxDuration: 30,
          camera: 'back',
          success(res) {
            console.log(res)
            console.log(res.tempFiles[0].tempFilePath)
            that.Base.setMyData({
              originaljpg:res.tempFiles[0].tempFilePath
            })
            // 将图像数据转换为base64编码字符串
            const base64Image = wx.getFileSystemManager().readFileSync(res.tempFiles[0].tempFilePath, 'base64');
            // 发送POST请求
            wx.showLoading({
              title: '智能图像处理中，请耐心等待一会',
            })
            wx.request({
              url: 'https://gpt.cllsm.top:4080/removebackground',
              method: 'POST',
              data: {
                image: base64Image,
                type_s:'portrait'
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                wx.hideLoading()
                // 请求成功，获取抠图结果
                const path = res.data.path;
                if(res.data.path){
                  that.goEditPage(`https://gpt.cllsm.top:4080/image/${path}`)
                  that.Base.setMyData({
                    returnbgpng:`https://gpt.cllsm.top:4080/image/${path}`
                  })
                  wechatApi.reducescore({
                    openid: that.Base.getMyData().UserInfo.openid,
                  }, (res) => {
                    that.onShow();
                    console.log(res)
                  })
                }
    
                // TODO: 处理抠图结果
              },
              fail: function (res) {
                // 请求失败
                console.log('请求失败', res);
                wx.hideLoading()
              }
            });
    
    
          },
          fail(err){
            console.log(err)
          }
        })
      }
    })
    .catch((error) => {
      console.log(error);
      that.Base.toast("转换失败请稍后重试！");
      // 在这里处理错误
    });
  }
  // 相机拍照
  chooseCamera() {
    var that = this;
    const {
      width,
      height,
      name
    } = this.data.detail
    //选择相机拍照
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.camera']) {
          wx.navigateTo({
            url: '/pages/camera/camera?detail='+ JSON.stringify(that.Base.getMyData().detail),
            success: function (res) {
              res.eventChannel.emit('chooseCamera', {
                width,
                height,
                name
              })
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success() {},
            fail() {
              that.openConfirm()
            }
          })
        }
      },
      fail() {}
    })
  }

  // 开启摄像头
  openConfirm() {
    wx.showModal({
      content: '检测到您没打开访问摄像头权限，是否打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => {}
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  }

  // 编辑图片
  goEditPage(e) {
    const {
      width,
      height,
      name,
    } = this.data.detail
    this.data.detail.tmpOriginImgSrc = e
    wx.navigateTo({
      url: '/pages/photo/photo?imageData='+JSON.stringify(this.data.detail),
      success: function (res) {
      }
    })
  }
  showvideoAd() {
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  }
  checkscore() {
    // 积分查验
    var wechatApi = new WechatApi();
    var that = this;
    return new Promise(function (resolve, reject) {
      wechatApi.checkscore({
        openid: that.Base.getMyData().UserInfo.openid,
      }, (data) => {
        if (data.code == 0) { // error checking
          reject(new Error("msgseccheck error"));
          return;
        }
        console.log(data.data, "------------------")
        resolve(data.data);
      })
    });
  }

}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.chooseImage = content.chooseImage;
body.chooseCamera = content.chooseCamera;
body.openConfirm = content.openConfirm;
body.remove_background = content.remove_background;
body.checkscore = content.checkscore;
body.showvideoAd = content.showvideoAd;
body.goEditPage = content.goEditPage;


Page(body)