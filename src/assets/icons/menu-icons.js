/**
 * 菜单图标库
 * 使用自定义 SVG 图标
 */

// 系统管理图标
export const systemIcons = {
  Setting: {
    name: 'Setting',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/><path d="M19.4 15C19.7686 15.3941 19.9624 15.9192 19.9346 16.4553C19.9069 16.9915 19.6602 17.4934 19.25 17.85L16.55 20.15C16.1863 20.4678 15.7113 20.6263 15.2318 20.5927C14.7523 20.5591 14.3024 20.3361 13.98 19.97L12 18L10.02 19.97C9.69764 20.3361 9.24773 20.5591 8.76824 20.5927C8.28875 20.6263 7.81368 20.4678 7.45003 20.15L4.75003 17.85C4.33984 17.4934 4.09317 16.9915 4.06541 16.4553C4.03765 15.9192 4.23144 15.3941 4.60003 15L6.60003 13L4.60003 11C4.23144 10.6059 4.03765 10.0808 4.06541 9.54465C4.09317 9.00853 4.33984 8.50663 4.75003 8.14997L7.45003 5.84997C7.81368 5.53213 8.28875 5.37367 8.76824 5.40727C9.24773 5.44088 9.69764 5.66389 10.02 6.02997L12 8L13.98 6.02997C14.3024 5.66389 14.7523 5.44088 15.2318 5.40727C15.7113 5.37367 16.1863 5.53213 16.55 5.84997L19.25 8.14997C19.6602 8.50663 19.9069 9.00853 19.9346 9.54465C19.9624 10.0808 19.7686 10.6059 19.4 11L17.4 13L19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  User: {
    name: 'User',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  UserFilled: {
    name: 'UserFilled',
    svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C9.243 2 7 4.243 7 7C7 9.757 9.243 12 12 12C14.757 12 17 9.757 17 7C17 4.243 14.757 2 12 2ZM12 14C8.686 14 3 15.657 3 19V21H21V19C21 15.657 15.314 14 12 14Z" fill="currentColor"/></svg>`
  },
  Menu: {
    name: 'Menu',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  OfficeBuilding: {
    name: 'OfficeBuilding',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 21V8M4 8H9M4 8V5M9 8H16M9 8V21M9 8V5M16 8H20M16 8V21M16 8V5M20 8V21M4 21H20M9 21H16M9 5H16M9 5V3M16 5V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  Postcard: {
    name: 'Postcard',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="2"/><line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" stroke-width="2"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/><line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" stroke-width="2"/></svg>`
  },
  Notebook: {
    name: 'Notebook',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H16C17.1046 4 18 4.89543 18 6V18C18 19.1046 17.1046 20 16 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="currentColor" stroke-width="2"/><path d="M18 8H22V16H18" stroke="currentColor" stroke-width="2"/><line x1="6" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="2"/><line x1="6" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="2"/><line x1="6" y1="16" x2="10" y2="16" stroke="currentColor" stroke-width="2"/></svg>`
  },
  Edit: {
    name: 'Edit',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  Bell: {
    name: 'Bell',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 11.0902 5.22047 12.906 4.38922 14.0538C3.80106 14.8613 3.50697 15.2651 3.59886 15.7354C3.69177 16.2105 4.11477 16.5197 4.96075 17.1381C6.45963 18.2429 8.69727 19 12 19C15.3027 19 17.5404 18.2429 19.0392 17.1381C19.8852 16.5197 20.3082 16.2105 20.4011 15.7354C20.493 15.2651 20.1989 14.8613 19.6108 14.0538C18.7795 12.906 18 11.0902 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  Document: {
    name: 'Document',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="9" x2="8" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  Form: {
    name: 'Form',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><line x1="7" y1="7" x2="17" y2="7" stroke="currentColor" stroke-width="2"/><line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="2"/><line x1="7" y1="17" x2="13" y2="17" stroke="currentColor" stroke-width="2"/></svg>`
  },
  Timer: {
    name: 'Timer',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  // 监控管理图标
  Monitor: {
    name: 'Monitor',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  Calendar: {
    name: 'Calendar',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  Histogram: {
    name: 'Histogram',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  Server: {
    name: 'Server',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="6" y1="6" x2="6.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="18" x2="6.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  // 财务管理图标
  Money: {
    name: 'Money',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 9V12L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  DataLine: {
    name: 'DataLine',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 15H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 9H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 3V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 18H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  TrendCharts: {
    name: 'TrendCharts',
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 9L13.5 13.5L9.5 9.5L5.5 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  }
}

// 获取所有图标列表
export function getAllIcons() {
  return Object.entries(systemIcons).map(([key, value]) => ({
    key,
    name: value.name,
    svg: value.svg
  }))
}

// 根据图标名称获取 SVG
export function getIconSvg(name) {
  return systemIcons[name]?.svg || ''
}

// 渲染图标组件
export function renderIcon(name, size = 20) {
  const svg = getIconSvg(name)
  if (!svg) return null
  return {
    template: `<span style="display: inline-flex; align-items: center; justify-content: center;" v-html="svg"></span>`,
    data() {
      return { svg }
    }
  }
}
