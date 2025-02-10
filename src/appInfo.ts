const isClient = typeof window !== 'undefined'
const userAgent = isClient ? window.navigator.userAgent : ''
const IsProd = isClient ? location.host.indexOf('.com') > 0 : true
const UA = window.navigator.userAgent
let  appType = 'NATIVE_APP'
const regex =  new RegExp(`${appType}\/\\d{1}\\.\\d{1,2}\\.\\d{1,2}`, 'ig') 
const matchResult = (UA.match(regex)?.[0] as unknown as string)?.split('/')
const isAndroid = UA.indexOf('Android') > -1 || UA.indexOf('Adr') > -1;
const lowerUserAgent = userAgent.toLowerCase()
const appUas: [string?] = []

const appVersionRegExp = new RegExp(`(${appUas.join('|')})\\/([^\s]*)\s?`, 'i')
const appVersionResult = lowerUserAgent.match(appVersionRegExp)

export const appInfo = {
  appName: matchResult?.[0] || 'NATIVE_APP',
  isXXXAPP: userAgent.includes('NATIVE_APP'),
  AppVersion: appVersionResult ? appVersionResult[2] : '',
  IOS: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  Andriod: userAgent.includes('Android') || userAgent.includes('Adr'),
  version: matchResult?.[1] || '1.0.0',
  system: isAndroid ? 'android' : 'ios',
  IsProd: IsProd,
  isAppWebview: !!matchResult?.length
}

export default appInfo;
