import { AddHistoryHistoryAddClassNamePostRequest, Configuration, DefaultApi, GetHistoryHistoryClassNameGetRequest, GetSettingSettingClassNameGetRequest, SetSettingSettingSetClassNamePostRequest } from "./openapi";
import { DBSchema, openDB, IDBPDatabase } from "idb"

import * as runtime from './openapi/runtime';
import type {
  HistoryAdd,
  ResponseHistory,
  ResponseSetting,
  ResponseUser,
  Setting,
} from './openapi/models';

export interface RegisterDBSchema extends DBSchema {
  history: {
    value: {
      name: string;
      price: number;
      productCode: string;
    };
    key: string;
    indexes: { 'by-price': number };
  };
  "history-queue": {
    value: AddHistoryHistoryAddClassNamePostRequest;
    key: number;
  };
  user: {
    value: ResponseUser;
    key: "userData";
  }
}

/**
 * API
 */
export class API extends DefaultApi {

  database?: IDBPDatabase<RegisterDBSchema>

  get historyQueueTransaction() {
    return this.database?.transaction("history-queue", "readwrite")
  }

  get historyTransaction() {
    return this.database?.transaction("history", "readwrite")
  }

  get userTransaction() {
    return this.database?.transaction("user", "readwrite")
  }

  constructor(protected configuration: Configuration, database: Promise<IDBPDatabase<RegisterDBSchema>>) {
    super(configuration);
    database.then((db) => {
      this.database = db
    })
  }

  /**
   * Add History
   */
  async addHistory(requestParameters: AddHistoryHistoryAddClassNamePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HistoryAdd> {
    if (this.database) {

    }
    const response = await this.addHistoryHistoryAddClassNamePostRaw(requestParameters, initOverrides);
    return await response.value();
  }

  /**
   * Get History
   */
  // async getHistory(requestParameters: GetHistoryHistoryClassNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ResponseHistory>> {
  //   return 
  // }

  async fetchHistory(requestParameters: GetHistoryHistoryClassNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction) {
    try {
      const response = await this.getHistoryHistoryClassNameGetRaw(requestParameters, initOverrides);
      const value = await response.value();
      return value
    } catch (e: unknown) {
      if (e instanceof runtime.FetchError) {

      } else {
        throw e
      }
    }
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
    if (this.database) {
      try {
        const userdata = await this.userTransaction!.objectStore("user").get("userData");
        console.log(userdata);
        if (userdata) return userdata;
      } catch (e) {
        console.warn(e)
      }
    }
    const response = await this.getUserinfoUserGetRaw(initOverrides);
    const value = await response.value();
    if (this.database) {
      try {
        await this.userTransaction!.objectStore("user").put(value, "userData")
      } catch (e) {
        console.error(e)
      }
    }
    return value
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

export function initAPI(token: (() => string) | (() => Promise<string>)) {
  const db = openDB<RegisterDBSchema>("register-db", 1, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
      db.createObjectStore("user");
      db.createObjectStore("history");
      db.createObjectStore("history-queue", { autoIncrement: true });
    },
    blocked(currentVersion, blockedVersion, event) {
      throw event
    },
    blocking(currentVersion, blockedVersion, event) {
      throw event
    }
  });

  const config = new Configuration({ basePath: "https://registar-api.hfhs-schoolfestival2023.fun", accessToken: token });
  return new API(config, db);
}