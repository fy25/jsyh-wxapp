import {
    AddPoint
} from "../../service/addPoint"
import {
    Config
} from "../../utils/config"
const addPoint = new AddPoint()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tempFilePaths: [],
        selectArray: [],
        name: '',
        tmp_id: '',

        Config,
        branchTextList: [],
        index: null,
        stateIndex: null,
        publicIndex: null,
        BUG_ID: null,
        State: null,
        IsPublic: null,
        statelist: [{
                value: "0",
                label: "未开发"
            },
            {
                value: "1",
                label: "正在开发"
            },
            {
                value: "2",
                label: "已开发"
            }
        ],
        publicList: [{
                value: 0,
                label: "公司部"
            },
            {
                value: 1,
                label: "零售部"
            },
        ],
        publicTextList: ["公司部", "零售部"],
        stateTextlist: ["未开发", "正在开发", "已开发"],
        Img: null,
        tempImg: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options.ispublic)
        if (options.id) {
            this.data.id = options.id
        }
        this.setData({
            lat: options.lat,
            long: options.long
        })
        this.getBugId()
        this.getLocationInfo()
        this.setData({
            isPublic: options.ispublic
        })
    },

    // 获取地理位置信息
    getLocationInfo() {
        var qqmapsdk = new QQMapWX({
            key: this.data.Config.mapKey // 必填
        });
        let that = this
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: that.data.lat,
                longitude: that.data.long
            },
            success: (res) => {
                console.log(res)
                this.data.Province = res.result.address_component.province
                this.data.City = res.result.address_component.city
                this.data.District = res.result.address_component.district
                this.data.Street = res.result.address_component.street
            },
            fail: function(error) {
                console.error(error);
            },
            complete: function(res) {
                console.log(res);
            }
        })
    },

    // chooseImg(e) {
    //     console.log(e.detail.imgList, "111")
    //     this.data.Img = e.detail.imgList
    // },
    // deleteTap(e) {
    //     console.log(e.detail.imgList, "222")
    //     this.data.Img = e.detail.imgList
    // },
    nameInput: function(e) {
        this.setData({
            name: e.detail.value
        })
    },
    tipInput: function(e) {
        this.setData({
            tip: encodeURI(e.detail.value)
        })
    },
    getBugId: function() {
        addPoint.getBugId({
            action: 'get_user_group_index'
        }).then(res => {
            let {
                branchTextList
            } = this.data
            this.data.branchList = res
            if (res.length != 0) {
                res.forEach(item => {
                    branchTextList.push(`${item.USERGROUP_CODE}${item.USERGROUP_NAME}`)
                })
            }
            this.setData({
                branchTextList: branchTextList
            })
        })
    },

    // 选择银行
    branchTap(e) {
        let {
            branchList
        } = this.data
        console.log(e.detail.value)
        this.setData({
            index: e.detail.value,
            BUG_ID: branchList[e.detail.value].USERGROUP_ID
        })
    },

    // statehTap(e) {
    //     let {
    //         statelist
    //     } = this.data
    //     console.log(e.detail.value)
    //     this.setData({
    //         stateIndex: e.detail.value,
    //         State: statelist[e.detail.value].value
    //     })
    // },

    // publicTap(e) {
    //     let {
    //         publicList
    //     } = this.data
    //     console.log(e.detail.value)
    //     this.setData({
    //         publicIndex: e.detail.value,
    //         IsPublic: publicList[e.detail.value].value
    //     })
    // },

    getDate: function(e) {
        let tmp_id = this.data.selectArray[e.detail.id].id
        this.setData({
            tmp_id: tmp_id
        })
    },
    // makeImg() {
    //     return new Promise((resolve, reject) => {
    //         let {
    //             Img
    //         } = this.data
    //         if (Img != null && Img.length > 0) {

    //             let tempImg = []

    //             Img.forEach(item => {
    //                 wx.getFileSystemManager().readFile({
    //                     filePath: item, //选择图片返回的相对路径
    //                     encoding: 'base64', //编码格式
    //                     success: res => { //成功的回调

    //                         tempImg.push(`data:image/png;base64,${res.data}`)
    //                         if (tempImg.length == Img.length) {
    //                             resolve(tempImg.join("|"))
    //                         }
    //                     },
    //                     fail: (err) => {
    //                         console.log(err, "cuo")
    //                     }
    //                 })
    //             })
    //         } else {
    //             resolve([])
    //         }

    //     })
    // },

    // 上传图片
    // upLoadImg() {
    //     this.makeImg().then(res => {
    //         console.log(res)
    //         for (let i = 0; i < res.length; i++) {
    //             addPoint.addMarker({
    //                 action: 'upload_pictures_img',
    //                 Img: res[i],
    //                 user_id: JSON.parse(wx.getStorageSync('userinfo')).USER_ID,
    //                 name: 'Sign'
    //             })
    //         }
    //     })
    // },



    submitTap: function() {
        let {
            name,
            State,
            BUG_ID,
            IsPublic
        } = this.data
        if (name == "") {
            wx.showToast({
                title: '请填写标注名称！',
                icon: 'none'
            })
        } else if (State == null) {
            wx.showToast({
                title: '请选择状态',
                icon: 'none'
            })
        } else if (BUG_ID == null) {
            wx.showToast({
                title: '请选择区域',
                icon: 'none'
            })
        } else if (IsPublic == null) {
            wx.showToast({
                title: '请选择权限',
                icon: 'none'
            })
        } else {
            let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID


            this.makeImg().then(img => {
                console.log(img)
                addPoint.addMarker({
                    action: 'add_sign_index',
                    Sign_Name: this.data.name,
                    Remark: this.data.tip,
                    Longitude: this.data.long,
                    Latitude: this.data.lat,
                    Province: this.data.Province,
                    City: this.data.City,
                    District: this.data.District,
                    Street: this.data.Street,
                    State: this.data.State,
                    BUG_ID: this.data.BUG_ID,
                    Img: img,
                    user_id: userid,
                    IsPublic: IsPublic
                }).then(res => {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 2000,
                        mask: true,
                        success: () => {
                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 2000)
                        }
                    })
                })
            })


        }
    }
})