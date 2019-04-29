import { Login } from "../../service/login"
import util from "../../utils/util"
const loginApi = new Login()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: null,
        pwd: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    // 登录
    signIn() {
        let { name, pwd } = this.data
        console.log(name, pwd)
        if (name == null) {
            util.toust('请输入工号')
        } else if (pwd == null) {
            util.toust('请输入密码')
        } else {
            this.getCode(name).then(res => {
                console.log(res, "32312")

                let data = {
                    action: 'get_user_info',
                    name: name,
                    pwd: pwd,
                    code: res
                }
                loginApi.signIn(data).then(res => {
                    console.log(res, "99999999999")
                    wx.navigateTo({ url: `/pages/map/map` })
                })
            })
        }
    },

    inputTap(e) {
        let { category } = e.currentTarget.dataset
        let value = e.detail.value
        this.setData({
            [category]: value
        })
    },

    // 获取加密字段
    getCode(name) {
        let data = {
            action: 'md_info',
            name: name
        }
        return loginApi.getCode(data)
    }
})