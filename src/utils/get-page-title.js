import defaultSettings from '@/settings'

const title = defaultSettings.title || '东软智能云制造'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
