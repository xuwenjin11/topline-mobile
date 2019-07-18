import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 按需加载

dayjs.locale('zh-cn') // 全局使用中文
dayjs.extend(relativeTime)
export default (val) => {
  return dayjs().from(dayjs(val))
}
