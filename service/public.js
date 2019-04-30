import { Base } from "../utils/base"

class Public extends Base {
    constructor() {
        super()
    }

    // 公用接口
    public(data) {
        return this.post({
            url: `/ajax/Com_PCInfo.ashx`,
            data: data
        })
    }
}

export { Public }