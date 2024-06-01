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


interface ResponceAdd extends HistoryAdd {
  result: boolean;
}

export interface RegisterDBSchema extends DBSchema {
  history: {
    value: ResponseHistory;
    key: string;
  };
  "history-queue": {
    value: AddHistoryHistoryAddClassNamePostRequest;
    key: number;
  };
  user: {
    key: "userData";
    value: ResponseUser;
  } | {
    key: "settings";
    value: ResponseSetting;
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

  constructor(protected configuration: Configuration, database: IDBPDatabase<RegisterDBSchema>) {
    super(configuration);
    this.database = database;
  }

  /**
   * Add History
   */
  async addHistory(requestParameters: AddHistoryHistoryAddClassNamePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponceAdd> {
    if (this.database) {
      try {
        const response = await this.addHistoryHistoryAddClassNamePostRaw(requestParameters, initOverrides);
        return { result: true, ...(await response.value()) };
      } catch (e) {
        const history = await this.historyQueueTransaction!.objectStore("history-queue").add(requestParameters);
        return { result: false, ...requestParameters }
      }
    } else {
      throw Error("IndexedDB failed.");
    }
  }

    /**
   * Add History
   */
    async _addHistoryWithOutQueue(requestParameters: AddHistoryHistoryAddClassNamePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponceAdd> {
      if (this.database) {
        try {
          const response = await this.addHistoryHistoryAddClassNamePostRaw(requestParameters, initOverrides);
          return { result: true, ...(await response.value()) };
        } catch (e) {
          return { result: false, ...requestParameters }
        }
      } else {
        throw Error("IndexedDB failed.");
      }
    }

  async sendHistoryQueue(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponceAdd[]> {
    if (this.database) {
      if (await this.historyQueueTransaction!.objectStore("history-queue").count() === 0) return [];
      const historyKeys = await this.historyQueueTransaction!.objectStore("history-queue").getAllKeys()
      const results: ResponceAdd[] = [];
      for (const index of historyKeys) {
        const historyQueue = (await this.historyQueueTransaction!.objectStore("history-queue").get(index))!;
        const request = await this._addHistoryWithOutQueue(historyQueue, initOverrides);
        if (request.result) await this.historyQueueTransaction!.objectStore("history-queue").delete(index);
        results.push(request);
      }
      return results;
    } else {
      throw Error("IndexedDB failed.");
    }
  }

  /**
   * Get History
   */
  async getHistory(requestParameters: GetHistoryHistoryClassNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ResponseHistory>> {
    if (this.database) {
      try {
        const history = await this.historyTransaction!.objectStore("history").getAll()
        if (history) return history
      } catch (e) {
        console.warn(e)
      }
    }
    return await this.fetchHistory(requestParameters, initOverrides);
  }

  /**
   * Get HistoryQueue
   */
  async getHistoryQueue(): Promise<Array<AddHistoryHistoryAddClassNamePostRequest>> {
    if (this.database) {
      const history = await this.historyQueueTransaction!.objectStore("history-queue").getAll()
      if (history) return history;
      else return [];
    } else {
      throw Error("IndexedDB is unavailable.");
    }
  }

  async fetchHistory(requestParameters: GetHistoryHistoryClassNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ResponseHistory>> {
    if (navigator.onLine) {
      try {
        const response = await this.getHistoryHistoryClassNameGetRaw(requestParameters, initOverrides);
        const value = await response.value();
        if (this.database) {
          try {
            const historyTransaction = await this.historyTransaction!.objectStore("history")
            for (const key in value) {
              await historyTransaction.put(value[key], key)
            }
          } catch (e) {
            console.warn(e)
          }
        }
        return value
      } catch (e: unknown) {
        console.error(e);
        if (this.database) {
          try {
            const history = await this.historyTransaction!.objectStore("history").getAll()
            if (history) return history
            else throw e;
          } catch (e) {
            throw e;
          }
        } else {
          throw e;
        }
      }
    } else {
      if (this.database) {
        try {
          const history = await this.historyTransaction!.objectStore("history").getAll()
          if (history) return history
          else throw Error("Connection is Offline.");
        } catch (e) {
          throw e;
        }
      } else {
        throw Error("IndexedDB is unavailable.");
      }
    }
  }

  /**
   * Get Islogin
   */
  async getIslogin(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ isLogin: string }> {
    if (navigator.onLine) {
      try {
        const response = await this.getUserinfoUserGetRaw(initOverrides);
        const value = await response.value();
        if (this.database) {
          try {
            await this.userTransaction!.objectStore("user").put(value, "userData")
          } catch (e) {
            console.error(e)
          }
        }
        return { isLogin: value.userMail }
      } catch (e: unknown) {
        console.error(e);
        if (this.database) {
          try {
            const userdata = await this.userTransaction!.objectStore("user").get("userData") as ResponseUser;
            if (userdata) return { isLogin: userdata.userMail };
            else throw e;
          } catch (e) {
            throw e;
          }
        } else {
          throw e;
        }
      }
    } else {
      if (this.database) {
        try {
          const userdata = await this.userTransaction!.objectStore("user").get("userData") as ResponseUser;
          console.log(userdata);
          if (userdata) return { isLogin: userdata.userMail };
          else throw Error("Connection is Offline.");
        } catch (e) {
          throw e;
        }
      } else {
        throw Error("IndexedDB is unavailable.")
      }
    }
  }

  /**
   * Get Userinfo
   */
  async getUserinfo(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseUser> {
    if (navigator.onLine) {
      try {
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
      } catch (e: unknown) {
        console.error(e);
        if (this.database) {
          try {
            const userdata = await this.userTransaction!.objectStore("user").get("userData") as ResponseUser;
            if (userdata) return userdata;
            else throw e;
          } catch (e) {
            throw e;
          }
        } else {
          throw e;
        }
      }
    } else {
      if (this.database) {
        try {
          const userdata = await this.userTransaction!.objectStore("user").get("userData") as ResponseUser;
          console.log(userdata);
          if (userdata) return userdata;
          else throw Error("Connection is Offline.");
        } catch (e) {
          throw e;
        }
      } else {
        throw Error("IndexedDB is unavailable.")
      }
    }
  }

  /**
   * Index
   */
  async indexGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
    const response = await this.indexGetRaw(initOverrides);
    return await response.value();
  }
}

export async function initAPI(token: (() => string) | (() => Promise<string>) | undefined) {
  const db = await openDB<RegisterDBSchema>("register-db", 1, {
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

  const config = new Configuration({ basePath: "https://regi-api.hfhs-digital.app", accessToken: token });
  return new API(config, db);
}