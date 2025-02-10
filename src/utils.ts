import appInfo from './appInfo';
export const isClient = typeof window !== 'undefined'
export const IOSPREFIX: string = 'http://callclient?method=';
const ANDROIDPREFIX: any = isClient ? (window as any).toolbox : {};
interface ProxyF {
  android: Function;
  ios: Function;
};

interface CallbackOption {
  count: number; // 回调次数
};

export interface CallbackFunction extends Function {
  (res?: any, option?: CallbackOption): void;
}

export function versionComparison(appVersion: string) {
  if (appInfo.AppVersion) {
    const v1 = appInfo.AppVersion;
    const v2 = appVersion;
    const arr1 = v1.split('.');
    const arr2 = v2.split('.');
    const len = Math.max(arr1.length, arr2.length);
    while (arr1.length < len) {
      arr1.push('0');
    }
    while (arr2.length < len) {
      arr2.push('0');
    }
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(arr1[i]);
      const num2 = parseInt(arr2[i]);
      if (num1 < num2) {
        return false;
      } else if (num1 > num2) {
        return true;
      }
    }
    return true;
  } else {
    return false;
  }
}

/**
 * 代理，根据不同设备执行不同方法
 * @param f 
 */
export function osProxy(f: ProxyF, version: string = '1.0.0', callback?: Function) {
  let appVersion = ''
  let versionMatch = false
  if (appInfo.AppVersion) {
    versionMatch = versionComparison(appVersion)
  }
  if (versionMatch) {
    if (appInfo.Andriod && f.android) {
      return f.android();
    }
    if (appInfo.IOS && f.ios) {
      return f.ios();
    }
  } else {
    callback && callback({
      success: false,
      data: {
        message: '暂不支持'
      }
    });
    return;
  }
};

/**
 * ios 工厂函数
 * @param url 
 */
export function iosFactoryFn(url: string): void {
  const _window: any = window
  const messageHandlers = _window.webkit && _window.webkit.messageHandlers ? _window.webkit.messageHandlers : {}
  const nativeApi = messageHandlers.nativeApi || null
  if (nativeApi && nativeApi.postMessage) {
    // 新版通过 postMessage 通信，优化性能
    const arr = url.split('&')
    const method: string = arr.shift() as string
    let params = {}
    let callback = ''
    for (const item of arr) {
      const arr1 = item.split('=')
      const key = arr1[0]
      const value = arr1[1] || ''
      if (key === 'callback') {
        callback = value
      } else if (key === 'param') {
        const val = decodeURIComponent(value)
        params = val[0] === '{' ? JSON.parse(val) : val
      }
    }
    nativeApi.postMessage({
      method,
      params,
      callback
    })
  } else {
    const iframeDom: HTMLIFrameElement = document.createElement('iframe');
    iframeDom.src = `${IOSPREFIX}${url}`;
    iframeDom.style.display = 'none';
    document.documentElement.appendChild(iframeDom);
    setTimeout(() => {
      document.documentElement.removeChild(iframeDom);
    }, 0);
  }
};

/**
 * 发送消息到ios
 * @param method
 * @param paramStr 
 * @param callback 
 */
export function postMessageToIOS(method: string, paramStr: string = '', callback: string = '') {
  iosFactoryFn(`${method}&param=${encodeURIComponent(paramStr)}&callback=${callback}`)
}

/**
 * 发送消息到ios
 * @param method
 * @param paramStr 
 * @param callback 
 */
export function postMessageToAndroid(method: string, paramStr: string = '', callback: string = '') {
  ANDROIDPREFIX[`notifyAndroid_${method}`](paramStr, callback)
}

/**
 * 本地回调函数
 * @param res 
 */
export function formatNativeParam(res: any) {
  const data = osProxy({
    android: () => {
      if (typeof res === 'object') {
        return res;
      }
      if (!res) {
        return { success: true }
      }
      if (res.indexOf('{') === 0) {
        try {
          return JSON.parse(res)
        } catch (err) {
          return { success: true, data: res }
        }
      }
      return { success: true, data: res }
    },
    ios: () => {
      if (res && res.hasOwnProperty('success')) {
        if (res.success === '1') {
          res.success = true
        } else if (res.success === '0') {
          res.success = false
        } else {
          res.success = !!res.success
        }
      }
      return res;
    }
  });
  return data;
};

/**
 * 生成随机回调函数
 * @param fn 回调函数，第二个参数为系统参数 count：当前是第几次回调
 * @param callbackNum 最大回调次数，某些特定场景可以指定多次回调
 */
export function createCallBack(fn: CallbackFunction, maxCallbackNum: number = 1): string {
  const mathRandom = Math.ceil(Math.random() * 1000);
  const callBackName = `nativeCallBack${new Date().getTime()}${mathRandom}`;
  const _window: any = window
  if (!_window.nativeCallback) {
    _window.nativeCallback = {}
  }
  _window.nativeCallback[callBackName] = {
    max: maxCallbackNum,
    current: 0
  };
  _window[callBackName] = (res: any) => {
    _window.nativeCallback[callBackName].current++;
    fn(formatNativeParam(res), { count: _window.nativeCallback[callBackName].current });
    if (_window.nativeCallback[callBackName].current >= _window.nativeCallback[callBackName].max) {
      removeCallback(callBackName);
    }
  }
  return callBackName;
};

/**
 * 清除回调函数
 * @param callBackName 
 */
export function removeCallback(callBackName: string) {
  const _window: any = window
  if (_window.nativeCallback) {
    delete _window.nativeCallback[callBackName];
  }
  delete _window[callBackName];
}

/**
 * encodeURIComponent 数据
 * @param data 
 */
export function encodeData(data: object): string {
  return encodeURIComponent(JSON.stringify(data));
};

/**
 * 判定数组所在值
 * @param {val} number
 * @param {arr} Array
 */
export function inArray(val: number, arr: any[]): number {
  for (let x = 0, len = arr.length; x < len; x++) {
    if (arr[x] == val) {
      return x;
    }
  }
  return -1;
}