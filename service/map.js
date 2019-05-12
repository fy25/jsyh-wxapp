import { Base } from "../utils/base"

class Map extends Base {
  constructor() {
    super()
  }

  // 获取历史标点
  getMarkers(data) {
    return this.post({
      url: `/ajax/Com_PCInfo.ashx`,
      data: data
    })
  }

}

export { Map }