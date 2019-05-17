import { Activity } from "../../service/activity"
import { Config } from "../../utils/config"
const act = new Activity()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        act_array: [],
        Config
    },
    showDetail: function() {
        wx.navigateTo({
            url: '../activity_detail/activity_detail',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.id = options.id
        this.getAct()
    },
    onShow() {
        this.getAct()
    },
    getAct() {
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID

        let data = {
            action: "get_caller_index",
            pageIndex: "1",
            pageSize: "10",
            is_all: "0",
            activity_id: this.data.id,
            user_id: userid
        };
        act.getAct(data).then(res => {
            console.log(res, "oooooo");
            if (res.length != 0) {
                res.forEach(item => {
                    switch (item.STATE) {
                        case "0":
                            item.STATETEXT = "不可挖掘客";
                            break;
                        case "1":
                            item.STATETEXT = "未跟进";
                            break;
                        case "2":
                            item.STATETEXT = "已跟进";
                            break;
                    }
                    let imgList = []
                    if (item.IMG.indexOf(",") != -1) {
                        let temp = item.IMG.split(",");
                        console.log(temp, "jsjsjjsjsjsj")
                        temp.forEach(item => {
                            imgList.push(`${Config.serverUrl}${item}`);
                        });
                    } else {
                        imgList.push(`${Config.serverUrl}${item.IMG}`);
                    }
                    item.imgList = imgList
                });
            }
            this.setData({
                visitorList: res
            })
        });

    },
    // 查看访客
    visitorTap() {
        wx.navigateTo({
            url: `/pages/addvisitor/addvisitor?id=${this.data.id}`
        })
    },
    deleteTap(e) {
        console.log(e.target.id)
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        act.getAct({
            action: 'del_caller_index',
            pkVal: e.target.id,
            user_id: userid
        }).then(res => {
            console.log(res)
            wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500,
                mask: true,
                success: () => {
                    this.getAct()
                }
            })
        })
    }
})