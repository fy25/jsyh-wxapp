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
        Sign_Name: null,
        tmp_id: '',

        Config,
        branchTextList: [],
        index: null,
        stateIndex: null,
        publicIndex: null,
        BUG_ID: '',
        State: '',
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
        Img: '',
        tempImg: [],

        CEName: null,
        Expand: '',
        EndExpand: '',
        edit: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options.ispublic)
        let edit = null;
        if (options.id) {
            console.log("修改")
            this.data.id = options.id
            this.getOne(options.id)
            edit = true
        } else {
            edit = false
        }
        this.setData({
                lat: options.lat,
                long: options.long,
                edit
            })
            // this.getBugId()
        this.getLocationInfo()
        this.setData({
            isPublic: options.ispublic
        })
    },

    // 获取数据
    getOne(id) {
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        let data = {
            action: 'get_sign_object',
            _key: id,
            user_id: userid
        }
        addPoint.getBugId(data).then(res => {
            console.log(res)
            let Sign_Name = res.SIGN_NAME
            let CEName = res.CENAME
            let Expand = res.EXPAND
            let EndExpand = res.ENDEXPAND
            this.setData({
                Sign_Name,
                CEName,
                Expand,
                EndExpand
            })
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

    // 输入事件
    inputTap(e) {
        this.setData({
            [e.currentTarget.id]: e.detail.value
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


    getDate: function(e) {
        let tmp_id = this.data.selectArray[e.detail.id].id
        this.setData({
            tmp_id: tmp_id
        })
    },



    submitTap: function() {
        console.log(this.data.isPublic)
        let { Sign_Name, isPublic, CEName, EndExpand, Expand, edit } = this.data
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        let bug_id = JSON.parse(wx.getStorageSync('userinfo')).USERGROUP_ID
        let params = {
            action: 'add_sign_index',
            Sign_Name: Sign_Name,
            Remark: this.data.tip,
            Longitude: this.data.long,
            Latitude: this.data.lat,
            Province: this.data.Province,
            City: this.data.City,
            District: this.data.District,
            Street: this.data.Street,
            State: this.data.State,
            BUG_ID: bug_id,
            Img: this.data.img,
            user_id: userid,
            IsPublic: isPublic,
            CEName: CEName,
            Expand: Expand,
            EndExpand: EndExpand
        }
        if (edit) {
            params._key = this.data.id
        }
        if (isPublic == 0) {
            if (Sign_Name == null) {
                wx.showToast({
                    title: '请填写标注名称',
                    icon: 'none'
                })
            } else if (CEName == null) {
                wx.showToast({
                    title: '请填写企事业单位名称',
                    icon: 'none'
                })
            } else {
                addPoint.addMarker(params).then(res => {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 2000,
                        mask: true,
                        success: () => {
                            setTimeout(() => {
                                wx.reLaunch({
                                    url: '/pages/map/map'
                                })
                            }, 2000)
                        }
                    })
                })
            }
        } else {
            if (Sign_Name == null) {
                wx.showToast({
                    title: '请填写标注名称',
                    icon: 'none'
                })
            } else if (CEName == null) {
                wx.showToast({
                    title: '请填写企事业单位名称',
                    icon: 'none'
                })
            } else if (Expand == '') {
                wx.showToast({
                    title: '该社区/企事业单位总人数',
                    icon: 'none'
                })
            } else if (EndExpand == '') {
                wx.showToast({
                    title: '该社区/企事业单位已拓展人数',
                    icon: 'none'
                })
            } else if (Expand < EndExpand) {
                wx.showToast({
                    title: '该社区/企事业单位已拓展人数不得大于该社区/企事业单位总人数',
                    icon: 'none'
                })
            } else {
                params.Expand = Expand
                params.EndExpand = EndExpand
                addPoint.addMarker(params).then(res => {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 2000,
                        mask: true,
                        success: () => {
                            setTimeout(() => {
                                wx.reLaunch({
                                    url: '/pages/map/map'
                                })
                            }, 2000)
                        }
                    })
                })
            }
        }

    }
})