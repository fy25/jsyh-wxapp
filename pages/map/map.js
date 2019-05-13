import util from "../../utils/util"
import { Map } from "../../service/map"
import { Config } from "../../utils/config"
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
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
        }],
        Config
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
        console.log(this.data)
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
    },

    // 搜索
    searchTap(e) {
        var qqmapsdk = new QQMapWX({
            key: this.data.Config.mapKey // 必填
        });
        let _this = this
        qqmapsdk.geocoder({
            //获取表单传入地址
            address: e.detail.value, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
            success: function(res) { //成功后的回调
                console.log(res);
                _this.setData({
                        latitude: res.result.location.lat,
                        longitude: res.result.location.lng,
                        tmp_lat: res.result.location.lat,
                        tmp_long: res.result.location.lng,
                    })
                    // var res = res.result;
                    // var latitude = res.location.lat;
                    // var longitude = res.location.lng;
                    // //根据地址解析在地图上标记解析地址位置
                    // _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
                    //     markers: [{
                    //         id: 0,
                    //         title: res.title,
                    //         latitude: latitude,
                    //         longitude: longitude,
                    //         iconPath: './resources/placeholder.png', //图标路径
                    //         width: 20,
                    //         height: 20,
                    //         callout: { //可根据需求是否展示经纬度
                    //             content: latitude + ',' + longitude,
                    //             color: '#000',
                    //             display: 'ALWAYS'
                    //         }
                    //     }],
                    //     poi: { //根据自己data数据设置相应的地图中心坐标变量名称
                    //         latitude: latitude,
                    //         longitude: longitude
                    //     }
                    // });
            },
            fail: function(error) {
                console.error(error);
            },
            complete: function(res) {
                console.log(res);
            }
        })
    }

})