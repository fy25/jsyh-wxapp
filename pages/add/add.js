import { Add } from "../../service/add"
const add = new Add()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tempFilePaths: [],
        Begin_Date: "",
        End_Date: "",
        statelist: [{
                value: "0",
                label: "未开始"
            },
            {
                value: "1",
                label: "开始"
            },
            {
                value: "2",
                label: "结束"
            },
            {
                value: "3",
                label: "超时"
            }
        ],
        stateTextlist: ["未开始", "开始", "结束", "超时"],
        stateIndex: null,
        Activity_Name: null,
        State: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        this.setData({
            lat: options.lat,
            long: options.long,
            SIGN_ID: options.SIGN_ID
        })

    },
    titleInput(e) {
        this.setData({
            Activity_Name: e.detail.value
        })
    },
    contentInput(e) {
        this.setData({
            Remark: encodeURI(e.detail.value)
        })
    },
    startTap(e) {
        this.setData({
            Begin_Date: e.detail.value
        })
    },
    endTap(e) {
        this.setData({
            End_Date: e.detail.value
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

    chooseImg(e) {
        console.log(e.detail.imgList, "111")
        this.data.Img = e.detail.imgList
    },
    deleteTap(e) {
        console.log(e.detail.imgList, "222")
        this.data.Img = e.detail.imgList
    },
    makeImg() {
        return new Promise((resolve, reject) => {
            let { Img } = this.data
            var tempImg = []
            if (Img != null && Img.length > 0) {
                Img.forEach(item => {
                    wx.getFileSystemManager().readFile({
                        filePath: item, //选择图片返回的相对路径
                        encoding: 'base64', //编码格式
                        success: res => { //成功的回调
                            tempImg.push(`data:image/png;base64,${res.data}`)
                            if (tempImg.length == Img.length) {
                                resolve(tempImg.join("|"))
                            }
                        },
                        fail: (err) => {
                            console.log(err, "cuo")
                        }
                    })
                })
            } else {
                resolve([])
            }

        })
    },

    submitTap() {
        let { Begin_Date, End_Date, Activity_Name, State, Remark } = this.data
        if (Activity_Name == null) {
            wx.showToast({
                title: '请填写活动名称',
                icon: 'none'
            })
        } else if (State == null) {
            wx.showToast({
                title: '请选择活动状态',
                icon: 'none'
            })
        } else if (Begin_Date == "") {
            wx.showToast({
                title: '请选择开始时间',
                icon: 'none'
            })
        } else if (End_Date == "") {
            wx.showToast({
                title: '请选择结束时间',
                icon: 'none'
            })
        } else {
            let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID

            this.makeImg().then(img => {
                add.addAct({
                    action: 'add_activity_index',
                    _key: "",
                    Img: img,
                    Activity_Name: Activity_Name,
                    Remark: Remark,
                    Begin_Date: Begin_Date,
                    End_Date: End_Date,
                    State: State,
                    Sign_ID: this.data.SIGN_ID,
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
            })





        }

    },
    deleteTap() {
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        add.addAct({
            action: 'del_sign_index',
            pkVal: this.data.SIGN_ID,
            user_id: userid
        }).then(res => {
            console.log(res)
            wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500,
                mask: true,
                success: () => {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
        })
    }

})