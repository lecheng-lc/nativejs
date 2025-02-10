export declare function compareVersion(appVerionOne: string, appVersionTwo: string): boolean | Error;
export declare function getQueryParams(data: {
    [prop: string]: any;
}): string;
export declare function dealCallBackName(callBack: Function): (res: any) => void;
export declare function osProxy(fn: Function, version: string): void;
