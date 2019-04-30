// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  chooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res, "-=-=-=")
        const tempFilePaths = res.tempFilePaths
        this.setData({
          tempFilePaths
        })
      }
    })
  },

  submitTap() {
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })
  }
})