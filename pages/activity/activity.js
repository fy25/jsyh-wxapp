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
        this.data.lat = options.lat
        this.data.long = options.long
    },
    onShow() {
        this.getAct()

    },
    getAct() {
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        act.getAct({
            action: 'get_activity_index',
            pageIndex: '1',
            pageSize: '10',
            is_all: '1',
            user_id: userid,
            sign_id: this.data.SIGN_ID
        }).then(res => {
            res.forEach(item => {
                item.REMARK = decodeURI(item.REMARK)
                item.BEGIN_DATE = this.crtTimeFtt(item.BEGIN_DATE)
                item.CREATEDATE = this.crtTimeFtt(item.CREATEDATE)
                let imgList = []
                if (item.IMG != "&nbsp;") {
                    if (item.IMG.indexOf(",") != -1) {
                        let temp = item.IMG.split(",");
                        temp.forEach(item => {
                            if (item.indexOf('https') == -1) {
                                imgList.push(`${Config.serverUrl}${item}`);
                            } else {
                                imgList.push(`${item}`);
                            }
                        });
                    } else {
                        if (item.IMG.indexOf('https') == -1) {
                            imgList.push(`${Config.serverUrl}${item.IMG}`);
                        } else {
                            imgList.push(`${item.IMG}`);
                        }
                    }
                    item.imgList = imgList

                } else {
                    item.IMG = []
                }
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

    copyTap(e) {
        let { url } = e.currentTarget.dataset
        wx.setClipboardData({
            data: url,
            success: (res) => {
                wx.getClipboardData({
                    success: (res) => {
                        console.log(res)
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
    },

    deleteTap(e) {
        console.log(e.target.id)
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        wx.showModal({
            title: '提示',
            content: '确定删除？',
            success: (res) => {
                if (res.confirm) {
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
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    previewTap(e) {
        wx.previewImage({
            current: e.currentTarget.dataset.img, // 当前显示图片的http链接
            urls: [e.currentTarget.dataset.img]
        })
    },

    // 添加活动
    goWhere() {
        let { lat, long } = this.data
        wx.navigateTo({
            url: `/pages/add/add?lat=${lat}&long=${long}&SIGN_ID=${this.data.SIGN_ID}`
        })
    },

    // 编辑活动
    editTap(e) {
        let { lat, long } = this.data
        wx.navigateTo({
            url: `/pages/add/add?lat=${lat}&long=${long}&SIGN_ID=${this.data.SIGN_ID}&id=${e.currentTarget.id}`
        })
    },

    // 时间格式化
    crtTimeFtt(val, row) {
        if (val != null) {
            var date = new Date(val);
            return (
                date.getFullYear() +
                "-" +
                (date.getMonth() + 1) +
                "-" +
                date.getDate()
            );
        }
    },
})