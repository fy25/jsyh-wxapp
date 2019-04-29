import util from "../../utils/util"
Page({
    data: {
        markers: [{
            iconPath: '/resources/others.png',
            id: 0,
            latitude: 23.099994,
            longitude: 113.324520,
            width: 50,
            height: 50
        }],
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
        controls: [{
            id: 1,
            iconPath: '/resources/location.png',
            position: {
                left: 0,
                top: 300 - 50,
                width: 50,
                height: 50
            },
            clickable: true
        }]
    },
    onLoad() {
        this.getCurrentLocation()
    },
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e.controlId)
    },

    // 定位
    getCurrentLocation() {
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                console.log(res)
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
                //                 console.log(res)
                //             }
                //         })
                //     }
                // })
            }
        })
    },


    // 导航
    gateTap() {
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                console.log(res)
                const { latitude, longitude } = res
                this.setData({
                    latitude,
                    longitude
                })
                wx.openLocation({
                    latitude,
                    longitude,
                    scale: 18,
                    // success: (res) => {
                    //     wx.chooseLocation({
                    //         success: (res) => {
                    //             console.log(res)
                    //         }
                    //     })
                    // }
                })
            }
        })
    },


    errToast() {
        util.toust('功能正在开发中')
    },



    goWhere(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url
        })
    }
})