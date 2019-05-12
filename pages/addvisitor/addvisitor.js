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
    onLoad: function(options) {
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

    chooseImg() {
        wx.chooseImage({
            count: 9,
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
            add.addAct({
                action: 'add_caller_index',
                _key: "",
                Img_1: "",
                Img_2: "",
                Img_3: "",
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



        }

    }
})