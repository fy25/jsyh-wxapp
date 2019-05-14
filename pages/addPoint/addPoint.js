import { AddPoint } from "../../service/addPoint"
import { Config } from "../../utils/config"
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
        markers: [],
        tmp_id: '',

        Config,
        branchTextList: [],
        index: null,
        stateIndex: null,
        BUG_ID: null,
        State: null,
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
        stateTextlist: ["未开发", "正在开发", "已开发"],
        Img: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            lat: options.lat,
            long: options.long,
            markers: options.markers
        })
        this.getBugId()
        this.getLocationInfo()
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

    chooseImg() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const tempFilePaths = res.tempFilePaths
                this.setData({
                    tempFilePaths
                })
            }
        })
    },
    nameInput: function(e) {
        this.setData({
            name: e.detail.value
        })
    },
    tipInput: function(e) {
        this.setData({
            tip: e.detail.value
        })
    },
    getBugId: function() {
        addPoint.getBugId({
            action: 'get_user_group_index'
        }).then(res => {
            let { branchTextList } = this.data
            this.data.branchList = res
                // console.log(res)
                // for (let i = 0; i < res.length; i++) {
                //     t.push({
                //         id: res[i].USERGROUP_ID,
                //         text: res[i].USERGROUP_NAME
                //     })
                // }
            if (res.length != 0) {
                res.forEach(item => {
                    branchTextList.push(item.USERGROUP_NAME)
                })
            }
            this.setData({
                branchTextList: branchTextList
            })
        })
    },

    // 选择银行
    branchTap(e) {
        let { branchList } = this.data
        console.log(e.detail.value)
        this.setData({
            index: e.detail.value,
            BUG_ID: branchList[e.detail.value].USERGROUP_ID
        })
    },

    statehTap(e) {
        let { statelist } = this.data
        console.log(e.detail.value)
        this.setData({
            stateIndex: e.detail.value,
            State: statelist[e.detail.value].value
        })
    },

    getDate: function(e) {
        let tmp_id = this.data.selectArray[e.detail.id].id
        this.setData({
            tmp_id: tmp_id
        })
    },
    makeImg() {
        let that = this
        let file = this.data.tempFilePaths[0]
        if (typeof(file) != "undefined") {
            wx.getFileSystemManager().readFile({
                filePath: file, //选择图片返回的相对路径
                encoding: 'base64', //编码格式
                success: res => { //成功的回调
                    console.log(res, "dui")
                    that.data.Img = 'data:image/png;base64,' + res.data
                },
                fail: (err) => {
                    console.log(err, "cuo")
                }
            })
        } else {
            return ''
        }
    },

    submitTap: function() {
        let { name, State, BUG_ID } = this.data
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
        } else {
            let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
                //处理图片
            let img = this.makeImg()

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
                user_id: userid
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
        }
    }
})