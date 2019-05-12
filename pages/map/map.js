import util from "../../utils/util"
import { Map } from "../../service/map"
const map = new Map()
Page({
    data: {
        tmp_lat: '',
        tmp_long: '',
        selected_lat: '',
        selected_long: '',
        selected_name: '',
        selected_remark: '',
        selected_address: '',
        active_index: -1,
        markers: [],
        polyline: [{
            points: [{
                longitude: 113.3245211,
                latitude: 23.10229
            }, {
                longitude: 113.324520,
                latitude: 23.21229
            }],
            color: '#FF0000DD',
            width: 2,
            dottedLine: true
        }]
    },
    onLoad() {
        this.getCurrentLocation()

    },
    onShow() {
        this.getMarkers()
    },
    regionchange(e) {
        if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
            var that = this;
            let mapCtx = wx.createMapContext("map");
            mapCtx.getCenterLocation({
                type: 'gcj02',
                success: function(res) {
                    that.setData({
                        tmp_lat: res.latitude,
                        tmp_long: res.longitude
                    })
                }
            })
        }
    },
    markertap(e) {
        let id = e.markerId
        if (this.data.active_index != -1 && id != this.data.active_id) {
            var t = 'markers[' + this.data.active_index + '].iconPath'
            this.setData({
                [t]: '/images/location.png'
            })
        }
        console.log(this.data.markers)
        for (let i = 0; i < this.data.markers.length; i++) {
            if (id == this.data.markers[i].id) {
                var markers = 'markers[' + i + '].iconPath';
                this.setData({
                    [markers]: '/images/point.png',
                    active_index: i,
                    active_id: id,
                    selected_lat: this.data.markers[i].latitude,
                    selected_long: this.data.markers[i].longitude,
                    selected_name: this.data.markers[i].SIGN_NAME,
                    SIGN_ID: this.data.markers[i].SIGN_ID,
                    selected_address: this.data.markers[i].STREET,
                    selected_remark: this.data.markers[i].REMARK,

                })
                break
            }
        }
    },


    controltap(e) {

    },
    //获取标记
    getMarkers() {
        if (this.data.markers.length > 0) {
            this.setData({
                markers: [],
                selected_lat: '',
                selected_name: '',
                selected_address: ''
            })
        } else {
            let that = this
            let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
            map.getMarkers({
                action: 'get_sign_index',
                pageIndex: '1',
                pageSize: '100',
                is_all: '0',
                user_id: userid
            }).then(res => {
                console.log(res)
                let t = []
                for (let i = 0; i < res.length; i++) {
                    t.push({
                        id: res[i].SIGN_ID,
                        latitude: res[i].LATITUDE,
                        longitude: res[i].LONGITUDE,
                        SIGN_NAME: res[i].SIGN_NAME,
                        SIGN_ID: res[i].SIGN_ID,
                        STREET: res[i].STREET,
                        REMARK: res[i].REMARK,
                        iconPath: '/images/location.png'
                    })
                }
                that.setData({
                    markers: t
                })
            })
        }
    },

    //添加标记
    addPoint() {
        if (this.data.selected_lat == '') {
            wx.navigateTo({
                url: '../addPoint/addPoint?lat=' + this.data.tmp_lat + '&long=' + this.data.tmp_long + '&markers=' + JSON.stringify(this.data.markers)
            })
        } else {
            wx.navigateTo({
                url: '../add/add?lat=' + this.data.tmp_lat + '&long=' + this.data.tmp_long + '&SIGN_ID=' + this.data.SIGN_ID
            })
        }


    },
    // 定位
    getCurrentLocation() {
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                const { latitude, longitude } = res
                this.setData({
                        latitude,
                        longitude
                    })
                    // wx.openLocation({
                    //     latitude,
                    //     longitude,
                    //     scale: 18,
                    //     success: (res) => {
                    //         wx.chooseLocation({
                    //             success: (res) => {
                    //             }
                    //         })
                    //     }
                    // })
            }
        })
    },

    // 导航
    gateTap() {
        if (this.data.selected_lat == '') {
            wx.showToast({
                title: '请选择标点，再进行导航！',
                icon: 'none',
                duration: 3000
            })
        } else {
            let that = this
            wx.getLocation({
                type: 'wgs84',
                success: (res) => {
                    wx.openLocation({
                        latitude: parseFloat(this.data.selected_lat),
                        longitude: parseFloat(this.data.selected_long),
                        name: that.data.selected_name,
                        address: that.data.selected_address
                    })
                }
            })
        }
    },

    errToast() {
        this.getMarkers()
    },
    showAct() {
        if (this.data.selected_lat == '') {
            wx.showToast({
                title: '请选择标点，在进行查看！',
                icon: 'none',
                duration: 3000
            })
        } else {
            wx.navigateTo({
                url: '../activity/activity?SIGN_ID=' + this.data.SIGN_ID
            })
        }
    },


    goWhere(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url
        })
    },
    logOut() {
        wx.showModal({
            title: '提示',
            content: '确定退出？',
            success(res) {
                if (res.confirm) {
                    wx.removeStorageSync('userinfo');
                    wx.redirectTo({ url: `/pages/login/login` })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }

})