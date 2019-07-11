// 对项目进行适配管理，对物理像素不同标准的配置
// 一般vant的使用，需要用750px标准进行rem适配
const { sep } = require('path')

module.exports = ({ file }) => {
  let rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5
    : 75

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}
