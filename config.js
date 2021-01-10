const config={
  alianceKey:"04rNbDIGuBoYcsQn",//后台分配的allianceKey
  dev:{//开发环境
    domain:"http://127.0.0.1:8080/api",//后台接口地址
    qiniuDomain:"https://image.qiuhuiyi.cn",//七牛地址
    bgImage:"tmp/wx0f587d7c97a68e2b.o6zAJs3oh85Zb1lJE8oWix57vny0.91gGjMXALWNEf6b9dd803a7fe4bf5f75b6afd5705a73.jpg"//个人中心背景图片
  },
  prod:{//生产环境
    domain: "https://love.qiuhuiyi.cn/api",
    qiniuDomain: "https://image.qiuhuiyi.cn",
    bgImage: "tmp/wx0f587d7c97a68e2b.o6zAJs3oh85Zb1lJE8oWix57vny0.91gGjMXALWNEf6b9dd803a7fe4bf5f75b6afd5705a73.jpg"
  }
}

//const domain = config.prod.domain;
const domain = config.dev.domain;


module.exports = {
  domain
}