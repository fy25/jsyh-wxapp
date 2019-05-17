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
        this.setData({
            SIGN_ID: options.SIGN_ID
        })
        this.getAct()
    },
    getAct() {
        let that = this
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        act.getAct({
            action: 'get_activity_index',
            pageIndex: '1',
            pageSize: '10',
            is_all: '0',
            user_id: userid
        }).then(res => {
            console.log(res)
            res.forEach(item => {
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
            this.setData({ act_array: res })
        })
    },
    // 查看访客
    visitorTap(e) {
        wx.navigateTo({
            url: `/pages/visitor/visitor?id=${e.target.id}`
        })
    },
    deleteTap(e) {
        console.log(e.target.id)
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        act.getAct({
            action: 'del_activity_index',
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