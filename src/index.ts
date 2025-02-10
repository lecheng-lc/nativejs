import EventBus from './event-bus';
import { osProxy, iosFactoryFn, createCallBack, encodeData, isClient } from './utils';

const VOIDFN = (res: any) => { }; // 默认空函数
const VOID_EVENT_FN = (event: string, data: any) => { }; // 事件空函数
const ANDROIDPREFIX: any = isClient ? (window as any).toolbox || {} : {};
const customWindow: any = isClient ? window as any : {};
interface CommOptions {
  [propName: string]: any;
};
/**
 * 分享类型
 * wechat_friend-微信好友
 * wechat_moment-朋友圈
 * qq-qq好友  
 * qqzone-qq空间  
 * sinaweibo-新浪微博
 */
type ShareType = 'wechat_friend' | 'wechat_moment' | 'qq' | 'qqzone' | 'sinaweibo';
type SingleImg = {
  base64?: string, // 安卓base64
  method?: string, // ios base64取方法名称
};
interface ShareOptions extends CommOptions {
  copy_writing?: string; // 原生底部的title
  share_string?: string; // 一级标题
  share_desc?: string; // 二级标题
  share_url?: string; // 分享地址
  share_img_url?: string; // 分享图片
  share_type?: ShareType; // 分享类型
  single_img?: SingleImg; // base64图片
};
class NativeApi {
    /**
   * 分享
   * @param shareOptions 
   * @param callback 
   * @description 单图分享只需要传 single_img | SingleImg
   */
  doShare(shareOptions: ShareOptions, callback = VOIDFN) {
    const callBackName = createCallBack(callback);
    osProxy({
      android: () => {
        if (shareOptions.single_img) {
          delete shareOptions.single_img.method;
        }
        ANDROIDPREFIX.notifyAndroid_doShare(JSON.stringify(shareOptions), callBackName);
      },
      ios: () => {
        if (shareOptions.single_img) {
          delete shareOptions.single_img.base64;
        }
        iosFactoryFn(`share&param=${encodeData(shareOptions)}&callback=${callBackName}`);
      },
    });
  };
    /**
   * 绑定事件
   * @param event 事件名
   * @param func 回调
   * @param target 事件目标，默认为当前 nativeApi 实例
   */
  addEventListener(event: string, func = VOID_EVENT_FN, target: any = this) {
    let sFunc = func;
    EventBus.on(event, target, sFunc);
  };

  /**
   * 移除事件
   * @param event 事件名
   * @param target 事件目标，默认为当前 nativeApi 实例 
   */
  removeEventListener(event: string, target: any = this) {
    EventBus.remove(event, target);
  }

  /**
   * 触发事件
   * @param event 事件名
   * @param data 事件参数
   */
  raiseEvent(event: string, data: any = {}) {
    EventBus.emit(event, data);
  };
}
const instance = new NativeApi();

// 提供类供app调用
customWindow.NativeApi = function () {
  return instance;
};
customWindow.NativeApi = instance;
export const Events = EventBus.types;
export default instance;

