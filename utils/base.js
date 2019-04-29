import { Config } from "../utils/config"


class Base {
    constructor() {
        this.baseRequestUrl = Config.serverUrl
    }

    _request(params) {
        let url = this.baseRequestUrl + params.url

        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                data: params.data,
                method: params.method,
                header: {
                    'content-type': 'application/json',
                },
                success: (res) => {
                    console.log(res)
                    if (res.statusCode == 200) {
                        resolve(res.data)
                    } else {
                        wx.showToast({
                            title: '服务器出错',
                            icon: 'none',
                            duration: 1500
                        })
                    }
                },
                fail: (err) => {
                    reject && reject(err)
                }
            })
        })
    }

    get(params) {
        params.type = "GET";
        return this._request(params);
    }

    put(params) {
        params.type = "PUT";
        return this._request(params)
    }

    post(params) {
        params.type = "POST";
        return this._request(params)
    }
}

export { Base }