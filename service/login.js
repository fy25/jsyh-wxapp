import { Base } from "../utils/base"

class Login extends Base {
    constructor() {
        super()
    }

    // 获取加密字段
    getCode(data) {
        return this.post({
            url: `/ajax/Com_PCInfo.ashx`,
            data: data
        })
    }

    // 登录
    signIn(data) {
        return this.post({
            url: `/ajax/Com_PCInfo.ashx`,
            data: data
        })
    }
}

export { Login }