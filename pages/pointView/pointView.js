import { Add } from "../../service/add"
const add = new Add()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        this.getOne(options.id)
    },

    // 获取数据
    getOne(id) {
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        let data = {
            action: 'get_sign_object',
            _key: id,
            user_id: userid
        }
        add.addAct(data).then(res => {
            console.log(res)
            res.REMARK = decodeURI(res.REMARK)
            this.setData({
                data: res
            })
        })
    },

    // 删除标记
    deleteTap(e) {
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        wx.showModal({
            title: '提示',
            content: '确定删除？',
            success: (res) => {
                if (res.confirm) {
                    add.addAct({
                        action: 'del_sign_index',
                        pkVal: e.currentTarget.id,
                        user_id: userid
                    }).then(res => {
                        console.log(res)
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 1500,
                            mask: true,
                            success: () => {
                                setTimeout(() => {
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }, 1500)
                            }
                        })
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    // 编辑标记
    editTap(e) {
        let { data } = this.data
        wx.navigateTo({
            url: `/pages/addPoint/addPoint?id=${e.currentTarget.id}&ispublic=${data.ISPUBLIC}&lat=${data.LATITUDE}&long=${data.LONGITUDE}`
        })
    },

    // 查看活动
    activityTap(e) {
        console.log(this.data.data)
        let { LATITUDE, LONGITUDE } = this.data.data
        wx.navigateTo({
            url: `/pages/activity/activity?SIGN_ID=${e.currentTarget.id}&lat=${LATITUDE}&long=${LONGITUDE}`
        })
    },

    // 添加活动
    addActivity(e) {
        let { LATITUDE, LONGITUDE, SIGN_ID } = this.data.data
        wx.navigateTo({
            url: `/pages/add/add?lat=${LATITUDE}&long=${LONGITUDE}&SIGN_ID=${SIGN_ID}`
        })
    },
})