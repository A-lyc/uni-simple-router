import { methods, baseConfig, Global } from '../helpers/config';
import { noop, formatURLQuery } from '../helpers/util';
import { warn } from '../helpers/warn';

let stop = null;
const methodsReverse = JSON.parse(JSON.stringify(methods).replace(/("\w+"):("\w+")/g, '$2:$1'));

/**
 * 处理原生 api 跳转 让其走路由守卫
 * @param {Object} params uni api 跳转的参数
 * @param {Boolean} useNative  是否调用原生uni api 而不是走重写过后的api
 * @param {String} name  需要触发的uni跳转方法名称
 */
const nativeNav = function ({ params, useNative, name }) {
    warn(`当前你是否调用原生的API：${useNative},true==>调用原生API，不会触发路由守卫。false==>调用原生API，会触发路由守卫。`);
    if (useNative) {
        return this.uniMethods[name](...params);
    }
    console.log(params);
    const { $parseQuery } = this;
    // const { url: pathQuery, ...otherParams } = params;
    const { url: pathQuery } = params;
    const path = pathQuery.split('?')[0];
    const query = $parseQuery.parse($parseQuery.extract(pathQuery));
    if (name == 'navigateBack') { // 调用api返回页面时

    }
    this[methodsReverse[name]]({ path, query: { ...query } });
};

/**
 * @param {Object} finalRoute 格式化后的路由跳转规则
 * @param {Object} NAVTYPE 需要调用的跳转方法
 */
export const uniPushTo = function (finalRoute, NAVTYPE) {
    return new Promise((resolve) => {
        const query = formatURLQuery(`?${finalRoute.uniRoute.query}`);
        const { APP } = baseConfig;
        const { url } = finalRoute.uniRoute;
        stop = setTimeout(() => {
            resolve(url);
            resolve = noop;	// 执行完了就没了 确保不会被下一次执行
            Global.LockStatus = false; // 跳转完成解锁状态
        }, APP.switchPageOutTime);

        uni[methods[NAVTYPE]]({
            url: url + query,
            ...finalRoute.route.animation,
            complete: () => {
                clearTimeout(stop);
                resolve(url);
                resolve = noop;	// 执行完了就没了 确保不会被下一次执行
                Global.LockStatus = false; // 跳转完成解锁状态
            },
        }, true); // 这里传递true 主要是兼容重写 uni.switchTab
    });
};

/**
 * 重写掉 uni-app 的跳转方式
 *
 * @param {Object} uniMethods 需要重写掉的 uni-app 路由api
 *
 * this 为 Router 实例
 */
export const rewriteUniApi = function (uniMethods) {
    const uniMethodsKeys = Object.keys(uniMethods);
    for (let i = 0; i < uniMethodsKeys.length; i += 1) {
        const name = uniMethodsKeys[i];
        uni[name] = (params, useNative = false) => {
            nativeNav.call(this, { params, useNative, name }); // 把每个uni的原生api跳转都重写掉
        };
    }
};
