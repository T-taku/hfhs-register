import { AddHistoryHistoryAddClassNamePostRequest, Configuration, DefaultApi, GetHistoryHistoryClassNameGetRequest, GetSettingSettingClassNameGetRequest, SetSettingSettingSetClassNamePostRequest } from "./openapi";
import { openDB } from "idb"

const db = await openDB("register-db", 1, {
  upgrade(db, oldVersion, newVersion, transaction, event) {
    
  },
  blocked(currentVersion, blockedVersion, event) {
    throw event
  },
  blocking(currentVersion, blockedVersion, event) {
    throw event
  },
  terminated() {
    
  },
});

import * as runtime from './openapi/runtime';
import type {
  HistoryAdd,
  ResponseHistory,
  ResponseSetting,
  ResponseUser,
  Setting,
} from './openapi/models';

/**
 * API
 */
export class API extends DefaultApi {

    /**
     * Add History
     */
    async addHistory(requestParameters: AddHistoryHistoryAddClassNamePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HistoryAdd> {
        const response = await this.addHistoryHistoryAddClassNamePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get History
     */
    async getHistory(requestParameters: GetHistoryHistoryClassNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ResponseHistory>> {
        const response = await this.getHistoryHistoryClassNameGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get Islogin
     */
    async getIslogin(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.getIsloginAuthGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get Setting
     */
    async getStoreSetting(requestParameters: GetSettingSettingClassNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseSetting> {
        const response = await this.getSettingSettingClassNameGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get Userinfo
     */
    async getUserinfo(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseUser> {
        const response = await this.getUserinfoUserGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Index
     */
    async indexGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.indexGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Set Setting
     */
    async setStoreSetting(requestParameters: SetSettingSettingSetClassNamePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Setting> {
        const response = await this.setSettingSettingSetClassNamePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}


export function useApi(token: (() => string) | (() => Promise<string>) ) {
  const config = new Configuration({basePath: "https://registar-api.hfhs-schoolfestival2023.fun", accessToken: token});
  return new API(config);
}