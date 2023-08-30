import {
  AppBase
} from "../../appbase";
var WxParse = require('../../wxParse/wxParse');
import {
  WechatApi
} from '../../apis/wechat.api';
import { CollegeApi } from "../../apis/college.api.js";
import {
  MemberApi
} from "../../apis/member.api.js";
const hexRgb = require('./hex-rgb')
let canOnePointMove = false
const app = getApp();
// 在页面中定义插屏广告
let interstitialAd = null;
// 在页面中定义激励视频广告
let videoAd = null
let onePoint = {
  x: 0,
  y: 0
}
let twoPoint = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
}
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    var that = this;
    super.onLoad(options);
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-90c6231e75da2c65'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
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
    this.Base.setMyData({
      object: "A",
      switchover: true,
      imageData: {
        height: 431,
        width: 295,
        name: '一寸',
        tmpOriginImgSrc: ''
      },
      filePath: '',
      showScale: 480 / 295,
      rpxRatio: 1, //此值为你的屏幕CSS像素宽度/750，单位rpx实际像素
      showColorPicker: false,
      colorData: {
        //基础色相，即左侧色盘右上顶点的颜色，由右侧的色相条控制
        hueData: {
          colorStopRed: 255,
          colorStopGreen: 0,
          colorStopBlue: 0,
        },
        //选择点的信息（左侧色盘上的小圆点，即你选择的颜色）
        pickerData: {
          x: 0, //选择点x轴偏移量
          y: 480, //选择点y轴偏移量
          red: 0,
          green: 0,
          blue: 0,
          hex: '#000000'
        },
        //色相控制条的位置
        barY: 0
      },
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      initImgWidth: 0,
      initImgHeight: 0,
      originImgWidth: 0,
      originImgHeight: 0,
      scale: 1,
      rotate: 0,
      bgc: '#ffffff',
      photoBg: '#ffffff',
      clothes: [],
      hairs: [],
      cloth: {
        show: false,
        src: '',
        initImgWidth: 0,
        initImgHeight: 0,
        originImgWidth: 0,
        originImgHeight: 0,
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        scale: 1,
        rotate: 0,
      },
      hair: {
        show: false,
        src: '',
        initImgWidth: 0,
        initImgHeight: 0,
        originImgWidth: 0,
        originImgHeight: 0,
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        scale: 1,
        rotate: 0,
      }
    })
    if (this.Base.options.imageData) {
      this.Base.setMyData({
        imageData: JSON.parse(decodeURIComponent(this.Base.options.imageData))
      })
    }
    that.setRpxRatio();
    that.getClothes();
    that.getHairs()
    that.getImageData();

  }
  onMyShow() {
    var that = this;


  }
  // 接受参数 拿图片
  getImageData() {
    this.Base.setMyData({
      imageData: this.Base.getMyData().imageData,
      showScale: (480 / (+this.Base.getMyData().imageData.width)),
      filePath: this.Base.getMyData().imageData.tmpOriginImgSrc
    })
  }

  // 图片显示成功处理
  bindload(e) {
    wx.hideLoading({})
    const that = this
    const photoSizeObj = {
      width: this.Base.getMyData().imageData.width,
      height: this.Base.getMyData().imageData.height
    }
    const {
      width,
      height
    } = e.detail
    const _width = photoSizeObj.width
    const _height = _width * height / width

    const imgLoadSetData = {
      originImgWidth: width,
      originImgHeight: height,
      initImgWidth: _width,
      initImgHeight: _height,
      width: _width,
      height: _height,
      left: _width / 2,
      top: _height / 2 + photoSizeObj.height - _height + 120
    }
    const outerDataName = e.currentTarget.dataset.dataname
    this.Base.setMyData(outerDataName ? {
      [outerDataName]: {
        ...that.data[outerDataName],
        ...imgLoadSetData
      }
    } : imgLoadSetData)
  }

  // 设置屏幕宽度比例
  setRpxRatio() {
    const _this = this
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          rpxRatio: res.screenWidth / 750
        })
      }
    })
  }

  touchstart(e) {
    var that = this
    console.log(e, '__________________')
    if (e.currentTarget.dataset.dataname == "cloth") {
      this.Base.setMyData({
        object: 'B'
      })
    } else if (e.currentTarget.dataset.dataname == "hair") {
      this.Base.setMyData({
        object: 'C'
      })
    } else {
      this.Base.setMyData({
        object: 'A'
      })
    }
    if (e.touches.length < 2) {
      canOnePointMove = true
      onePoint.x = e.touches[0].pageX * 2
      onePoint.y = e.touches[0].pageY * 2
    } else {
      twoPoint.x1 = e.touches[0].pageX * 2
      twoPoint.y1 = e.touches[0].pageY * 2
      twoPoint.x2 = e.touches[1].pageX * 2
      twoPoint.y2 = e.touches[1].pageY * 2
    }
  }
  touchmove(e) {
    var that = this
    const outerDataName = e.currentTarget.dataset.dataname
    const thatData = outerDataName ? this.data[outerDataName] : that.data

    if (e.touches.length < 2 && canOnePointMove) {
      var onePointDiffX = e.touches[0].pageX * 2 - onePoint.x
      var onePointDiffY = e.touches[0].pageY * 2 - onePoint.y
      const imgSetData = {
        msg: '单点移动',
        left: thatData.left + onePointDiffX,
        top: thatData.top + onePointDiffY
      }
      that.Base.setMyData(outerDataName ? {
        [outerDataName]: {
          ...that.data[outerDataName],
          ...imgSetData
        }
      } : imgSetData)
      onePoint.x = e.touches[0].pageX * 2
      onePoint.y = e.touches[0].pageY * 2
    } else if (e.touches.length > 1) {
      var preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
      twoPoint.x1 = e.touches[0].pageX * 2
      twoPoint.y1 = e.touches[0].pageY * 2
      twoPoint.x2 = e.touches[1].pageX * 2
      twoPoint.y2 = e.touches[1].pageY * 2
      // 计算角度，旋转(优先)
      var perAngle = Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180 / Math.PI
      var curAngle = Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 180 / Math.PI
      if (Math.abs(perAngle - curAngle) > 1) {
        // that.setData({
        // 	msg: '旋转',
        // 	rotate: thatData.rotate + (curAngle - perAngle)
        // })
      } else {
        // 计算距离，缩放
        var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
        var curDistance = Math.sqrt(Math.pow((twoPoint.x1 - twoPoint.x2), 2) + Math.pow((twoPoint.y1 - twoPoint.y2), 2))
        const imgSetData = {
          msg: '缩放',
          scale: thatData.scale + (curDistance - preDistance) * 0.005
        }
        that.Base.setMyData(outerDataName ? {
          [outerDataName]: {
            ...that.data[outerDataName],
            ...imgSetData
          }
        } : imgSetData)
      }
    }
  }
  touchend(e) {
    var that = this
    canOnePointMove = false
  }

  // 获取衣服数据
  async getClothes() {
    var collegeapi = new CollegeApi();
    collegeapi.clotheslist({ checkstate: "" }, (clotheslist) => {
      this.Base.setMyData({
        clothes: clotheslist.data
      })
    })
  }

  // 选择衣服
  selectClothes(e) {
    this.setData({
      cloth: {
        ...this.data.cloth,
        src: e.currentTarget.dataset.url,
        show: true
      }
    })
  }

  // 获取发型数据
  async getHairs() {
    var collegeapi = new CollegeApi();
    collegeapi.hairlist({ checkstate: "" }, (hairlist) => {
      this.Base.setMyData({
        hairs: hairlist.data
      })
    })
  }

  // 选择发型
  selectHairs(e) {
    console.log(e)
    this.setData({
      hair: {
        ...this.data.hair,
        src: e.currentTarget.dataset.url,
        show: true
      }
    })
  }



  // 切换背景
  toggleBg(e) {
    const bgc = e.currentTarget.dataset.color;
    const showColorPicker = bgc === 'custom';
    const photoBg = showColorPicker ? this.data.colorData.pickerData.hex : {
      red: '#F80100',
      blue: '#438edb',
      white: '#ffffff',
      transparent: 'transparent'
    }[bgc]
    this.setData({
      bgc,
      photoBg,
      showColorPicker
    })
  }

  //关闭拾色器
  closeColorPicker() {
    this.setData({
      showColorPicker: false
    })
  }

  //选择改色时触发（在左侧色盘触摸或者切换右侧色相条）
  onChangeColor(e) {
    //返回的信息在e.detail.colorData中
    this.setData({
      colorData: e.detail.colorData,
      photoBg: e.detail.colorData.pickerData.hex
    })
  }

  // 图片合成
  async composeImage() {
    var that = this;
    wx.showLoading({
      title: '制作中...',
    })
    const {
      photoBg,
      filePath,
      cloth,
      hair
    } = this.data
    const {
      width,
      height
    } = this.data.imageData


    // 将颜色转为 rgba值
    const bgc = hexRgb(photoBg, {
      format: 'array'
    })
    // 底图
    const baseImg = {
      bgc,
      width,
      height
    }
    // 人像图
    const peopleImg = {
      imgId: filePath,
      src: filePath,
      imgbase: wx.getFileSystemManager().readFileSync(await that.downloadImg2(filePath), 'base64'),
      ...this.computedXY(baseImg, this.data)
    }
    // 发饰图
    const hairImg = {
      imgId: hair.src,
      src: hair.src,
      imgbase: hair.src ? wx.getFileSystemManager().readFileSync(await that.downloadImg2(hair.src), 'base64') : "",
      ...this.computedXY(baseImg, hair)
    }
    // 衣服图
    const clothImg = {
      imgId: cloth.src,
      src: cloth.src,
      imgbase: cloth.src ? wx.getFileSystemManager().readFileSync(await that.downloadImg2(cloth.src), 'base64') : "",
      ...this.computedXY(baseImg, cloth)
    }
    console.log(baseImg, peopleImg, hairImg, clothImg)
    // 组合图片顺序
    const data = [baseImg, peopleImg, clothImg, hairImg]
    // 合成图片 返回url

    console.log(data)

    var that = this;
    var wechatApi = new WechatApi();
    wx.showLoading({
      title: '抠图中',
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
          // 发送POST请求
          wx.showLoading({
            title: '制作中',
          })
          wx.request({
            url: 'https://gpt.cllsm.top:4080/composite',
            method: 'POST',
            data: {
              data: JSON.stringify(data),
              type_s: 'A'
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideLoading()
              // 请求成功，获取抠图结果
              const path = res.data.composite_image;
              if (res.data.composite_image) {
                that.Base.setMyData({
                  composite_image: `https://gpt.cllsm.top:4080/image/${path}`
                })
                wx.setClipboardData({
                  data: `https://gpt.cllsm.top:4080/image/${path}`,
                  success(res) {
                    wx.showToast({
                      title: '下载链接已复制',
                      icon: 'none'
                    })
                  }
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

        }
      })
      .catch((error) => {
        console.log(error);
        that.Base.toast("转换失败请稍后重试！");
        // 在这里处理错误
      });




    // this.downloadAndToComplate(result.value)

  }

  // 下载并跳转
  async downloadAndToComplate(url) {
    let msg = ''
    try {
      // 下载图片到本地
      const {
        tempFilePath,
        dataLength
      } = await this.downloadImg(url)
      const {
        width,
        height,
        name
      } = this.data.imageData
      const size = (dataLength / 1024).toFixed(2)
      msg = `图片像素${width + ' * ' + height}，图片大小${size}kb`

      // 保存图片到相册
      await this.saveImage(tempFilePath)

      // 存入数据库
      const db = wx.cloud.database()
      db.collection('works').add({
        data: {
          name,
          width,
          height,
          size,
          tempFilePath,
          date: this.processDate(new Date())
        }
      }).then(res => {
        console.log(res)
      })

      wx.redirectTo({
        url: './complete/index?msg=' + msg + '&tempFilePath=' + tempFilePath + '&url=' + url,
      })


    } catch (error) {
      console.log(error)
      msg = '下载失败，点击下图预览保存图片。'
      wx.redirectTo({
        url: '../complete/index?msg=' + msg + '&tempFilePath=' + url + '&url=' + url,
      })
    }
  }

  // 计算相对底图的 x ， y
  computedXY(baseImg, imgData) {
    const left = (imgData.left - imgData.initImgWidth / 2)
    const top = (imgData.top - imgData.initImgHeight / 2)
    const noScaleImgHeight = baseImg.width * imgData.initImgHeight / imgData.initImgWidth
    const resultImgWidth = baseImg.width * imgData.scale
    const resultImgHeight = noScaleImgHeight * imgData.scale
    const scaleChangeWidth = (resultImgWidth / 2 - baseImg.width / 2)
    const scaleChangeHeight = (resultImgHeight / 2 - noScaleImgHeight / 2)
    const x = left - scaleChangeWidth
    const y = top - scaleChangeHeight
    return {
      x,
      y,
      width: resultImgWidth,
      height: resultImgHeight
    }
  }

  // 将远端图片，下载到本地
  downloadImg(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url, //仅为示例，并非真实的资源
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            console.log(res)
            resolve(res)
          } else {
            reject(res)
          }
        },
        fail(error) {
          reject(error)
        }
      })
    })
  }

  // 保存图片到相册
  saveImage(tempFilePath, isVip) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          this.setData({
            downloadSuccess: true
          })
          wx.showToast({
            title: '下载成功'
          })
          resolve()
        },
        fail(res) {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                wx.showToast({
                  title: '下载失败，点击帮助',
                  icon: 'none'
                })
                reject(new Error('错误'))
              } else {
                wx.openSetting({
                  success() { },
                  fail(res) {
                    wx.showToast({
                      title: '失败，写入相册权限未授权',
                      icon: 'none'
                    })
                    reject(new Error('错误'))
                  }
                })
              }
            },
            fail() {
              reject(new Error('错误'))
            }
          })
        },
      })
    })
  }



  processDate(_date) {
    var y = _date.getFullYear();
    var m = _date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = _date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = _date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = _date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = _date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
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
  downloadImg2(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url, //仅为示例，并非真实的资源
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            console.log(res)
            resolve(res.tempFilePath)
          } else {
            reject(res)
          }
        },
        fail(error) {
          reject(error)
        }
      })
    })
  }
  magnifyimg() {
    var e = this.Base.getMyData().object;
    if (e == "B") {
      let cloth = this.Base.getMyData().cloth;
      cloth.scale= cloth.scale + 0.05
      this.Base.setMyData({cloth})
    } else if (e == 'C') {
      let hair = this.Base.getMyData().hair;
      hair.scale= hair.scale + 0.05
      this.Base.setMyData({hair})
    } else {
      this.Base.setMyData({
        scale: this.Base.getMyData().scale + 0.05
      })
    }

  }
  reduceimg() {
    var e = this.Base.getMyData().object;
    if (e == "B") {
      let cloth = this.Base.getMyData().cloth;
      cloth.scale= cloth.scale - 0.05
      this.Base.setMyData({cloth})
    } else if (e == 'C') {
      let hair = this.Base.getMyData().hair;
      hair.scale= hair.scale - 0.05
      this.Base.setMyData({hair})
    } else {
      this.Base.setMyData({
        scale: this.Base.getMyData().scale - 0.05
      })
    }
  }
  displacementImg(data) {
    var e = this.Base.getMyData().object;
    console.log(data.currentTarget.id)
    var type = data.currentTarget.id;
    if (e == "B") {
      let cloth = this.Base.getMyData().cloth;
      if (type == 'top') {
        cloth.top= cloth.top - 1
      }
      if (type == 'bottom') {
        cloth.top= cloth.top + 1
      }
      if (type == 'left') {
        cloth.left= cloth.left - 1
      }
      if (type == 'right') {
        cloth.left= cloth.left + 1
      }
      this.Base.setMyData({cloth})
    } else if (e == 'C') {
      let hair = this.Base.getMyData().hair;
      if (type == 'top') {
        hair.top= hair.top - 1
      }
      if (type == 'bottom') {
        hair.top= hair.top + 1
      }
      if (type == 'left') {
        hair.left= hair.left - 1
      }
      if (type == 'right') {
        hair.left= hair.left + 1
      }
      this.Base.setMyData({hair})
    } else {
      if (type == 'top') {
        this.Base.setMyData({
          top: this.Base.getMyData().top - 1
        })
      }
      if (type == 'bottom') {
        this.Base.setMyData({
          top: this.Base.getMyData().top + 1
        })
      }
      if (type == 'left') {
        this.Base.setMyData({
          left: this.Base.getMyData().left - 1
        })
      }
      if (type == 'right') {
        this.Base.setMyData({
          left: this.Base.getMyData().left + 1
        })
      }
    }





  }
  bntswitchover() {
    this.Base.setMyData({
      switchover: !this.Base.getMyData().switchover
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getImageData = content.getImageData;
body.setRpxRatio = content.setRpxRatio;
body.getClothes = content.getClothes;
body.getHairs = content.getHairs;
body.bindload = content.bindload;
body.touchstart = content.touchstart;
body.touchmove = content.touchmove;
body.touchend = content.touchend;
body.toggleBg = content.toggleBg;
body.clickTab = content.clickTab;
body.composeImage = content.composeImage;
body.computedXY = content.computedXY;
body.showvideoAd = content.showvideoAd;
body.checkscore = content.checkscore;
body.onChangeColor = content.onChangeColor;
body.closeColorPicker = content.closeColorPicker;
body.downloadImg = content.downloadImg;
body.downloadImg2 = content.downloadImg2;
body.selectClothes = content.selectClothes;
body.selectHairs = content.selectHairs;
body.magnifyimg = content.magnifyimg;
body.reduceimg = content.reduceimg;
body.displacementImg = content.displacementImg;
body.bntswitchover = content.bntswitchover;
Page(body)