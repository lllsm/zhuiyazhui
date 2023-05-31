import { AppBase } from "../../appbase";
import {
  FeedbackApi
} from "../../apis/feedback.api.js";
import {
  KaceApi
} from "../../apis/kace.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: "意见反馈"
  })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fffff',
  })
    this.Base.setMyData({
      maxNumber:100,
      number:0,
      tapTime: '',
      flag:false
    })
  }
  onMyShow() {
    var that = this;
    var kaceapi = new KaceApi();
    var feedbackapi = new FeedbackApi();
    var xilieidx = this.Base.getMyData
    kaceapi.kaceprompt({
      id: this.Base.options.id
    }, (kaceprompt) => {
      this.Base.setMyData({
        kaceprompt
      })
    })
    feedbackapi.feedbacktanchuang({
      id: this.Base.options.id
    }, (feedbacktanchuang) => {
      this.Base.setMyData({
        feedbacktanchuang
      })
    })

   
  }
  inputText (e) { //监听输入，实时改变已输入字数
    let value = e.detail.value;//获取textarea的内容，
    let len = value.length;//获取textarea的内容长度
    this.Base.setMyData({
      number: len
    })
  }
  formSubmit(e){
    var nowTime = new Date();
    console.log(nowTime);
    if (nowTime - this.data.tapTime < 3000) {
        console.log('阻断')
        return;
    }
    console.log('执行')
    this.Base.setMyData({ tapTime: nowTime });

    console.log(e.detail.value)
    var that = this;
    var content = e.detail.value.yijian;
    var lianxi = e.detail.value.lianxi;
    console.log(content, lianxi);
    if(lianxi == ""){
      this.Base.toast('请输入联系方式');
      return
    }
    if(content == ""){
      this.Base.toast('请输入内容');
      return
    }
    var feedbackapi = new FeedbackApi();
    if (content != "") {
      feedbackapi.updatafeedback({
        lian: lianxi,
        idea: content,
        primary_id:""
      }, (ret) => {
        console.log(ret)
        if (ret) {
          wx.showToast({
            title: '意见提交成功',
            icon: 'none'
          })
          this.Base.setMyData({
            flag:true
          });
          // setTimeout(() => {
          //  wx.navigateTo({
          //   url: '/pages/fankuisucceed/fankuisucceed',
          //  })
          // }, 2000)

        }
      })
    }





  }
  binoff(){
    this.Base.setMyData({
      flag:false
    });
    wx.reLaunch({
      url: '/pages/home/home'
    })
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.inputText = content.inputText;
body.formSubmit = content.formSubmit;
body.binoff = content.binoff;
Page(body)