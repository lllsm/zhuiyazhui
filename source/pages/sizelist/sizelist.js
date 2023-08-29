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

  }
  onMyShow() {
    var that = this;
  }
  //获取数据
  getSizeList() {
    var aa = [{
      "_id": "41ae62ef6218d8f308e5344b7ccac038",
      "name": "一寸",
      "px": "295*413 px",
      "size": "25*35 mm",
      "width": 295.0,
      "height": 413.0,
      "category_id": "1"
    }, {
      "_id": "bf4a0bf26218dbe91163d3902f378512",
      "category_id": "2",
      "name": "简历照片",
      "height": 413.0,
      "width": 295.0,
      "px": "295*413 px",
      "size": "25*35 mm"
    }, {
      "_id": "bf4a0bf26218dcf81163f7066cd32c21",
      "category_id": "2",
      "name": "教师资格证",
      "height": 413.0,
      "width": 295.0,
      "px": "295*413 px",
      "size": "25*35 mm"
    }, {
      "_id": "54ad1eea6218ddd912df9af32490ff8b",
      "name": "二寸",
      "width": 413.0,
      "height": 579.0,
      "category_id": "1",
      "px": "413*579 px",
      "size": "35*49 mm"
    }, {
      "_id": "41ae62ef6219ab1c08fba665696aa633",
      "name": "小一寸",
      "width": 260.0,
      "height": 378.0,
      "category_id": "1",
      "size": "22*32 mm",
      "px": "260*378 px"
    }, {
      "_id": "bf4a0bf26219abf7117796d0225b9dca",
      "category_id": "1",
      "name": "小二寸",
      "width": 413.0,
      "height": 531.0,
      "px": "413*531 px",
      "size": "35*45 mm"
    }, {
      "_id": "41ae62ef6219ad1b08fbed282f9fee85",
      "name": "大一寸",
      "px": "390*567 px",
      "size": "33*48 mm",
      "width": 390.0,
      "height": 567.0,
      "category_id": "1"
    }, {
      "_id": "5b049cc86219adcc0e54b5fb1251a0f1",
      "px": "413*626 px",
      "size": "35*53 mm",
      "width": 413.0,
      "category_id": "1",
      "height": 626.0,
      "name": "大二寸"
    }, {
      "_id": "54ad1eea6219aef012f4cf5f16618536",
      "height": 413.0,
      "name": "健康证",
      "px": "295*413 px",
      "size": "25*35 mm",
      "width": 295.0,
      "category_id": 2.0
    }, {
      "_id": "5b049cc86219b0090e54e11a3ea1ba4f",
      "category_id": "3",
      "height": 630.0,
      "name": "学籍网",
      "px": "472*630 px",
      "size": "80*107 mm",
      "width": 472.0
    }, {
      "_id": "17e3426e6219b0ad10ba62d1132ba05a",
      "category_id": "3",
      "height": 640.0,
      "name": "学信网",
      "px": "480*640 px",
      "size": "41*54 mm",
      "width": 480.0
    }, {
      "_id": "17e3426e6219b11710ba6bc358704967",
      "width": 390.0,
      "category_id": "3",
      "height": 567.0,
      "name": "普通话水平测试",
      "px": "390*567 px",
      "size": "33*48 mm"
    }, {
      "_id": "17e3426e6219b15110ba70e2017bfc3b",
      "category_id": "3",
      "height": 280.0,
      "name": "计算机二级考试",
      "px": "210*280 px",
      "size": "18*24 mm",
      "width": 210.0
    }, {
      "_id": "5b049cc86219b18e0e54fe057ff91aa0",
      "category_id": "3",
      "height": 567.0,
      "name": "英语四六级考试",
      "px": "390*567 px",
      "size": "33*48 mm",
      "width": 390.0
    }, {
      "_id": "efbc6d7162496303044b0f18423c27d3",
      "size": "25*35 mm",
      "width": 295.0,
      "_openid": "oZmZA5aPkSxdoQDJkd8CjE2oHdUE",
      "category_id": "4",
      "height": 413.0,
      "name": "我的一寸",
      "px": "295*413 px"
    }, {
      "_id": "d4107ab1624ba0ca04db8bd5089e6b3e",
      "_openid": "oZmZA5SN4X1OKoGtn7_W0wAYqXp0",
      "category_id": "4",
      "height": 441.0,
      "name": "1",
      "px": "358*441 px",
      "size": "30*37 mm",
      "width": 358.0
    }, {
      "_id": "1fee1e97625d8edb00af257a4cf9c19c",
      "category_id": "4",
      "height": 200.0,
      "name": "我的定制",
      "px": "100*200 px",
      "size": "8*16 mm",
      "width": 100.0,
      "_openid": "oZmZA5aPkSxdoQDJkd8CjE2oHdUE"
    }, {
      "_id": "1cf827d062616923013ce04f46e8fca8",
      "_openid": "oZmZA5aPkSxdoQDJkd8CjE2oHdUE",
      "category_id": "4",
      "height": 413.0,
      "name": "111",
      "px": "295*413 px",
      "size": "25*35 mm",
      "width": 295.0
    }, {
      "_id": "5464a2946261715f01db57684e1afd03",
      "px": "295*413 px",
      "size": "25*35 mm",
      "width": 295.0,
      "_openid": "oZmZA5aPkSxdoQDJkd8CjE2oHdUE",
      "category_id": "4",
      "height": 413.0,
      "name": "22"
    }];

    wx.hideLoading()
    this.setData({
      photoSizeList: aa
    });
  }
  //点击切换 
  clickTab(e) {
    // this.setData({
    //   photoSizeList: [],
    //   category: e.detail.name
    // });
    // this.getSizeList()
  }
  // 去尺寸详情
  goNextPage(e) {
    wx.navigateTo({
      url: '/pages/selectimg/selectimg?index=' + e.currentTarget.dataset.index + '&data=' + JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index])
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