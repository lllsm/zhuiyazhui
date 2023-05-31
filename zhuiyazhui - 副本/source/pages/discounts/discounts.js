import { AppBase } from "../../appbase";
import {CollegeApi} from "../../apis/college.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      pageNum:1,
      activitylist:[],
      totallPages:''
    })
  }
  onMyShow() {
    var that = this;
    this.activityData()
  }
  onReachBottom() {
    console.log("rrrrrrrrrrrr")
    if( this.Base.getMyData().totallPages &&  this.Base.getMyData().pageNum <  this.Base.getMyData().totallPages){
      console.log("捡来")
       this.Base.getMyData().pageNum += 1
      this.activityData() // 调用列表接口
    }else if( this.Base.getMyData().totallPages){
      wx.showToast({
        title: "没有更多了",
        icon: "none"
      })
    }
  }

  activityData(){
    var that = this;
        // 活动接口调用示例
        var collegeapi = new CollegeApi();
        collegeapi.activitylist({
          apikey:"QwFMS5eLS29Dikp6kAi6zhwEouTh5xUY",
          page:`${that.data.pageNum}`,
          pageSize:10
        },(activitylist)=>{
          that.Base.setMyData({
            activitylist:[...that.data.activitylist,...activitylist.data.data],
            totallPages:activitylist.data.last_page
          })
        })
  }


  shengquan(e){
    var that =this;
    var collegeapi = new CollegeApi();
    console.log(e.currentTarget.dataset.item);
    let act_id = e.currentTarget.dataset.item;
    collegeapi.activitydetails({
      apikey:"QwFMS5eLS29Dikp6kAi6zhwEouTh5xUY",
      sid:act_id,
      act_id,
      channels:1
    },(activitydetails)=>{

      if(activitydetails.data.we_app_info != "" || activitydetails.data.we_app_info !=undefined){
        wx.navigateToMiniProgram({
          appId: activitydetails.data.we_app_info.app_id,
          path: activitydetails.data.we_app_info.page_path,
        })
      }
      that.Base.setMyData({
        activitydetails:activitydetails.data.we_app_info
      })
    })
  }



}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.activityData = content.activityData;
body.shengquan = content.shengquan;
body.onReachBottom = content.onReachBottom;
Page(body)