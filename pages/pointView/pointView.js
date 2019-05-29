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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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
    deleteTap(e) {
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
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
    }
})