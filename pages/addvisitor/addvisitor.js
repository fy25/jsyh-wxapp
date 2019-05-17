import { Add } from "../../service/add"
const add = new Add()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tempFilePaths: [],
        Caller_Phone: "",
        Caller_Name: "",
        statelist: [{
            value: "0",
            label: "不可发掘客户"
        },
        {
            value: "1",
            label: "未跟进客户"
        },
        {
            value: "2",
            label: "已跟进"
        }
        ],
        stateTextlist: ["不可发掘客户", "未跟进客户", "已跟进"],
        stateIndex: null,
        State: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            id: options.id
        })

    },
    titleInput(e) {
        this.setData({
            Caller_Name: e.detail.value
        })
    },
    telInput(e) {
        this.setData({
            Caller_Phone: e.detail.value
        })
    },
    contentInput(e) {
        this.setData({
            Remark: e.detail.value
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
                            resolve(tempImg.join('|'))
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
        let { Caller_Name, Caller_Phone, State, Remark } = this.data
        if (Caller_Name == "") {
            wx.showToast({
                title: '请输入访客名称',
                icon: 'none'
            })
        } else if (State == null) {
            wx.showToast({
                title: '请选择访客状态',
                icon: 'none'
            })
        } else if (Caller_Phone == "") {
            wx.showToast({
                title: '请输入访客电话',
                icon: 'none'
            })
        } else {
            let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
            this.makeImg().then(img => {
                add.addAct({
                    action: 'add_caller_index',
                    _key: "",
                    Img: img,
                    Caller_Phone: Caller_Phone,
                    Remark: Remark,
                    Caller_Name: Caller_Name,
                    State: State,
                    Activity_ID: this.data.id,
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

    }
})