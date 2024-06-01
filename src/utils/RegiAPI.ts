import { Configuration, DefaultApi } from "./openapi";
import { DBSchema, openDB, IDBPDatabase } from "idb";
import { env } from "process";

import type {
  AddHistoryRequest,
  GetHistoryRequest,
  GetSettingRequest,
  SetSettingRequest,
  Setting,
  User,
  History,
} from "./openapi";

export type {
  AddHistoryRequest,
  GetHistoryRequest,
  GetSettingRequest,
  SetSettingRequest,
  Setting,
  User,
  History,
} from "./openapi";

export interface RegisterDBSchema extends DBSchema {
  history: {
    key: string;
    value: History;
  };
  "history-queue": {
    key: number;
    value: AddHistoryRequest;
  };
  user:
    | {
        key: "userinfo";
        value: User;
      }
    | {
        key: "settings";
        value: Setting;
      };
}

/**
 * hfhs-regi API
 */
export class RegiAPI {
  api: DefaultApi;
  db?: IDBPDatabase<RegisterDBSchema>;

  constructor(
    token: Promise<string> | string | (() => Promise<string> | string)
  ) {
    this.api = new DefaultApi(
      new Configuration({
        basePath: "https://regi-api.hfhs-digital.app",
        accessToken: token,
      })
    );
    openDB<RegisterDBSchema>("hfhs-regi", 1, {
      upgrade(database, oldVersion, newVersion, transaction, event) {
        database.createObjectStore("user");
        database.createObjectStore("history");
        database.createObjectStore("history-queue", { autoIncrement: true });
      },
    }).then((db) => {
      this.db = db;
    });
  }

  async getServerStatus() {
    return await this.api.getStatus();
  }

  async getAuthStatus() {
    return await this.api.getIsLogin();
  }

  async getUserinfo(force?: boolean) {
    if (force) {
      return await this.updateUserinfoCache();
    }
    try {
      const userinfoCache = (await this.db?.get("user", "userinfo")) as
        | User
        | undefined;
      if (!userinfoCache) {
        const userinfo = await this.api.getUserinfo();
        await this.db?.put("user", userinfo, "userinfo");
        return userinfo;
      }
      return userinfoCache;
    } catch {
      return await this.api.getUserinfo();
    }
  }

  private async updateUserinfoCache() {
    const usetinfo = await this.api.getUserinfo();
    try {
      await this.db?.put("user", usetinfo, "userinfo");
    } catch {}
    return usetinfo;
  }

  async fetchHistory(param: GetHistoryRequest, force?: boolean) {
    if (force) {
      return await this.updateHistoryCache(param);
    } else {
      try {
        const historiesCache = await this.db?.getAll("history");
        if (!historiesCache) {
          return this.updateHistoryCache(param);
        }
        return historiesCache;
      } catch {
        return await this.api.getHistory(param);
      }
    }
  }

  private async updateHistoryCache(param: GetHistoryRequest) {
    const histories = await this.api.getHistory(param);
    try {
      const transaction = this.db?.transaction("history", "readwrite");
      const store = transaction?.objectStore("history");
      for (const history of histories) {
        await store?.put(history, history.paymentId);
      }
    } catch {}
    return histories;
  }

  async addHistory(param: AddHistoryRequest) {
    try {
      const flushResult = await this.flushHistory();
      if (flushResult.status == "IN-QUEUE") {
        throw flushResult.error;
      }
      await this.api.addHistory(param);
      return { status: "COMPLETE" } as const;
    } catch (e) {
      await this.db?.put("history-queue", param);
      return { status: "IN-QUEUE", error: e } as const;
    }
  }

  async getHistoryQueue() {
    return await this.db?.getAll("history-queue");
  }

  async flushHistory() {
    try {
      const historyQueueIndexes = await this.db?.getAllKeys("history-queue");
      if (
        Array.isArray(historyQueueIndexes) &&
        historyQueueIndexes.length > 0
      ) {
        for (const historyIndex of historyQueueIndexes) {
          const history = await this.db?.get("history-queue", historyIndex);
          if (history) {
            await this.api.addHistory(history);
          }
          await this.db?.delete("history-queue", historyIndex);
        }
        return { status: "COMPLETE" } as const;
      } else {
        return { status: "NONE" } as const
      }
    } catch (e) {
      return { status: "IN-QUEUE", error: e } as const;
    }
  }

  async getSetting(param: GetSettingRequest, force?: boolean) {
    if (force) {
      return await this.updateSettingCache(param);
    } else {
      try {
        const settingCache = (await this.db?.get("user", "settings")) as
          | Setting
          | undefined;
        if (!settingCache) {
          const setting = await this.api.getSetting(param);
          await this.db?.put("user", setting, "settings");
          return setting;
        }
        return settingCache;
      } catch {
        return await this.api.getSetting(param);
      }
    }
  }

  private async updateSettingCache(param: GetSettingRequest) {
    const setting = await this.api.getSetting(param);
    try {
      await this.db?.put("user", setting, "settings");
    } catch {}
    return setting;
  }

  async setSetting(param: SetSettingRequest) {
    return await this.api.setSetting(param);
  }

  async clearAllCache() {
    const stores = ["history", "history-queue", "user"] as const;
    const transaction = this.db?.transaction(stores, "readwrite");
    for(const storeName of stores) {
      const store = transaction?.objectStore(storeName);
      await store?.clear();
    }
  }
}
