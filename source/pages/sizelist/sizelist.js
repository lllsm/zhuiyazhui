// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  CollegeApi
} from "../../apis/college.api.js";
import Notify from '@vant/weapp/notify/notify';
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      active: 1,
      category: "1",
      page: 0,
      photoSizeList: [],
    });
    wx.setNavigationBarTitle({
      title: "常用尺寸"
    })
    this.getSizeList()
    this.Base.setMyData({
      sizeList: this.Base.getMyData().photoSizeList
    })

  }
  onMyShow() {
    var that = this;
  }
  //获取数据
  getSizeList() {
    var aa = [{
      "pxHeight": 413,
      "mmHeight": 35,
      "pxWidth": 295,
      "mmWidth": 25,
      "color": "red",
      "name": "一寸",
      "_id": 3,
      "sort": 3,
      "status": 1,
      "type": 1
    }, {
      "pxHeight": 378,
      "mmHeight": 32,
      "pxWidth": 260,
      "mmWidth": 22,
      "color": "red",
      "name": "小一寸",
      "_id": 6,
      "sort": 6,
      "status": 1,
      "type": 1
    }, {
      "pxHeight": 567,
      "mmHeight": 48,
      "pxWidth": 390,
      "mmWidth": 33,
      "color": "red",
      "name": "大一寸",
      "_id": 9,
      "sort": 9,
      "status": 1,
      "type": 1
    }, {
      "pxHeight": 579,
      "mmHeight": 49,
      "pxWidth": 413,
      "mmWidth": 35,
      "color": "red",
      "name": "二寸",
      "_id": 12,
      "sort": 12,
      "status": 1,
      "type": 1
    }, {
      "pxHeight": 531,
      "mmHeight": 45,
      "pxWidth": 413,
      "mmWidth": 35,
      "color": "red",
      "name": "小二寸",
      "_id": 15,
      "sort": 15,
      "status": 1,
      "type": 1
    }, {
      "pxHeight": 991,
      "mmHeight": 84,
      "pxWidth": 649,
      "mmWidth": 55,
      "color": "red",
      "name": "三寸",
      "_id": 18,
      "sort": 18,
      "status": 1,
      "type": 1
    }, {
      "pxHeight": 1499,
      "mmHeight": 127,
      "pxWidth": 1050,
      "mmWidth": 89,
      "color": "red",
      "name": "五寸",
      "_id": 21,
      "sort": 21,
      "status": 1,
      "type": 1
    }, {
      "pxHeight": 531,
      "mmHeight": 45,
      "pxWidth": 413,
      "mmWidth": 35,
      "color": "",
      "name": "国考（二寸）",
      "_id": 22,
      "sort": 22,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 192,
      "mmHeight": 16,
      "pxWidth": 144,
      "mmWidth": 12,
      "color": "",
      "name": "英语四六级考试（144×192，0~10kb）",
      "_id": 23,
      "sort": 23,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 320,
      "mmHeight": 27,
      "pxWidth": 240,
      "mmWidth": 20,
      "color": "",
      "name": "英语四六级考试（240×320，20~30kb）",
      "_id": 24,
      "sort": 24,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 567,
      "mmHeight": 48,
      "pxWidth": 390,
      "mmWidth": 33,
      "color": "",
      "name": "普通话水平测试（大一寸，0~20kb）",
      "_id": 25,
      "sort": 25,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 320,
      "mmHeight": 27,
      "pxWidth": 240,
      "mmWidth": 20,
      "color": "",
      "name": "英语四六级考试（240×320，0~20kb）",
      "_id": 26,
      "sort": 26,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 192,
      "mmHeight": 16,
      "pxWidth": 144,
      "mmWidth": 12,
      "color": "",
      "name": "全国计算机等级考试（大一寸，144×192，25~200kb）",
      "_id": 27,
      "sort": 27,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 567,
      "mmHeight": 48,
      "pxWidth": 390,
      "mmWidth": 33,
      "color": "",
      "name": "中国护照（大一寸）",
      "_id": 28,
      "sort": 28,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 320,
      "mmHeight": 27,
      "pxWidth": 240,
      "mmWidth": 20,
      "color": "",
      "name": "全国计算机等级考试（240×320）",
      "_id": 29,
      "sort": 29,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 763,
      "mmHeight": 65,
      "pxWidth": 545,
      "mmWidth": 46,
      "color": "",
      "name": "高考报名（545×763）",
      "_id": 30,
      "sort": 30,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 413,
      "mmHeight": 35,
      "pxWidth": 295,
      "mmWidth": 25,
      "color": "",
      "name": "中小学生教师资格证（一寸）",
      "_id": 31,
      "sort": 31,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 320,
      "mmHeight": 27,
      "pxWidth": 240,
      "mmWidth": 20,
      "color": "",
      "name": "全国计算机等级考试（240×320）",
      "_id": 32,
      "sort": 32,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 175,
      "mmHeight": 15,
      "pxWidth": 125,
      "mmWidth": 11,
      "color": "",
      "name": "小学登记报名",
      "_id": 33,
      "sort": 33,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 626,
      "mmHeight": 53,
      "pxWidth": 413,
      "mmWidth": 35,
      "color": "",
      "name": "国家司法考试",
      "_id": 34,
      "sort": 34,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 320,
      "mmHeight": 27,
      "pxWidth": 240,
      "mmWidth": 20,
      "color": "",
      "name": "初级会计职称考试（240×320）",
      "_id": 35,
      "sort": 35,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 378,
      "mmHeight": 32,
      "pxWidth": 260,
      "mmWidth": 22,
      "color": "",
      "name": "驾驶证、驾照（无回执，小一寸）",
      "_id": 36,
      "sort": 36,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 441,
      "mmHeight": 32,
      "pxWidth": 358,
      "mmWidth": 26,
      "color": "",
      "name": "身份证（无回执）",
      "_id": 37,
      "sort": 37,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 413,
      "mmHeight": 35,
      "pxWidth": 295,
      "mmWidth": 25,
      "color": "",
      "name": "健康证（一寸）",
      "_id": 38,
      "sort": 38,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 413,
      "mmHeight": 35,
      "pxWidth": 295,
      "mmWidth": 25,
      "color": "",
      "name": "社会工作者资格证（一寸）",
      "_id": 39,
      "sort": 39,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 300,
      "mmHeight": 25,
      "pxWidth": 215,
      "mmWidth": 18,
      "color": "",
      "name": "二级建造师证（215×300）",
      "_id": 40,
      "sort": 40,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 576,
      "mmHeight": 49,
      "pxWidth": 400,
      "mmWidth": 34,
      "color": "",
      "name": "成人自考（400×576）",
      "_id": 41,
      "sort": 41,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 192,
      "mmHeight": 16,
      "pxWidth": 144,
      "mmWidth": 12,
      "color": "",
      "name": "普通话水平测试（144×192）",
      "_id": 42,
      "sort": 42,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 567,
      "mmHeight": 48,
      "pxWidth": 390,
      "mmWidth": 33,
      "color": "",
      "name": "雅思考试（大一寸）",
      "_id": 43,
      "sort": 43,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 441,
      "mmHeight": 32,
      "pxWidth": 358,
      "mmWidth": 26,
      "color": "",
      "name": "社保证（350dpi， 无回执，15~35kb）",
      "_id": 44,
      "sort": 44,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 567,
      "mmHeight": 48,
      "pxWidth": 390,
      "mmWidth": 33,
      "color": "",
      "name": "在职研究生考试（大一寸）",
      "_id": 45,
      "sort": 45,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 385,
      "mmHeight": 33,
      "pxWidth": 285,
      "mmWidth": 23,
      "color": "",
      "name": "导游证",
      "_id": 46,
      "sort": 46,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 160,
      "mmHeight": 14,
      "pxWidth": 160,
      "mmWidth": 14,
      "color": "",
      "name": "大学个人档案（二寸）",
      "_id": 47,
      "sort": 47,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 210,
      "mmHeight": 18,
      "pxWidth": 150,
      "mmWidth": 13,
      "color": "",
      "name": "校园卡",
      "_id": 48,
      "sort": 48,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 441,
      "mmHeight": 32,
      "pxWidth": 358,
      "mmWidth": 26,
      "color": "",
      "name": "特岗教师",
      "_id": 49,
      "sort": 49,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 170,
      "mmHeight": 14,
      "pxWidth": 130,
      "mmWidth": 11,
      "color": "",
      "name": "护士执业资格考试（130×170）",
      "_id": 50,
      "sort": 50,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 156,
      "mmHeight": 13,
      "pxWidth": 114,
      "mmWidth": 10,
      "color": "",
      "name": "会计从业资格证（114×156，0~10kb）",
      "_id": 51,
      "sort": 51,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 567,
      "mmHeight": 48,
      "pxWidth": 390,
      "mmWidth": 14,
      "color": "",
      "name": "硕士研究生考试（大一寸）",
      "_id": 52,
      "sort": 52,
      "status": 1,
      "type": 3
    }, {
      "pxHeight": 480,
      "mmHeight": 41,
      "pxWidth": 360,
      "mmWidth": 30,
      "color": "",
      "name": "出入境申请表",
      "_id": 53,
      "sort": 53,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 600,
      "mmHeight": 51,
      "pxWidth": 400,
      "mmWidth": 34,
      "color": "red",
      "name": "党员证（红底）",
      "_id": 54,
      "sort": 54,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 480,
      "mmHeight": 41,
      "pxWidth": 388,
      "mmWidth": 33,
      "color": "",
      "name": "记者照片",
      "_id": 55,
      "sort": 55,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 567,
      "mmHeight": 48,
      "pxWidth": 390,
      "mmWidth": 33,
      "color": "",
      "name": "义工证",
      "_id": 56,
      "sort": 56,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 441,
      "mmHeight": 32,
      "pxWidth": 358,
      "mmWidth": 26,
      "color": "",
      "name": "二代身份证照",
      "_id": 57,
      "sort": 57,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 370,
      "mmHeight": 31,
      "pxWidth": 210,
      "mmWidth": 18,
      "color": "",
      "name": "保险从业",
      "_id": 58,
      "sort": 58,
      "status": 1,
      "type": 2
    }, {
      "pxHeight": 441,
      "mmHeight": 32,
      "pxWidth": 358,
      "mmWidth": 26,
      "color": "",
      "name": "全国中小学生学籍",
      "_id": 59,
      "sort": 59,
      "status": 1,
      "type": 3
    }];

    wx.hideLoading()
    this.setData({
      photoSizeList: aa
    });
  }

  // 去尺寸详情
  goNextPage(e) {
    wx.navigateTo({
      url: '/pages/selectimg/selectimg?index=' + e.currentTarget.dataset.index + '&data=' + JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index])
    })
  }
  clickTab(e) {
    let type = e.detail.name || '0';
    let list = this.Base.getMyData().photoSizeList;
    let sizeList = list.filter(item => {
      if (type == '0') {
        return item
      } else {
        return item.type == type
      }
    })
    console.log('filter', list)
    this.Base.setMyData({
      sizeList
    })

  }
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getSizeList = content.getSizeList;
body.clickTab = content.clickTab;
body.goNextPage = content.goNextPage;
Page(body)