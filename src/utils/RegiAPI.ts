import { Configuration, DefaultApi, ResponseError } from "./openapi";
import { DBSchema, openDB, IDBPDatabase } from "idb";

import type {
  AddHistoryRequest,
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
  userinfo?: User;

  constructor(
    token?: Promise<string> | string | (() => Promise<string> | string),
    useLocal?: boolean,
    useBackup?: boolean
  ) {
    this.api = new DefaultApi(
      new Configuration({
        basePath: useLocal
          ? "http://localhost:8000"
          : useBackup
          ? "https://regi-api.suyoharu.net"
          : "https://regi-api.hfhs-digital.app",
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
      const userinfoCache =
        this.userinfo ??
        ((await this.db?.get("user", "userinfo")) as User | undefined);
      if (!userinfoCache) {
        const userinfo = await this.api.getUserinfo();
        await this.db?.put("user", userinfo, "userinfo");
        return userinfo;
      }
      this.userinfo = userinfoCache;
    } catch {
      this.userinfo = await this.api.getUserinfo();
    }
    return this.userinfo;
  }

  private async updateUserinfoCache() {
    const userinfo = await this.api.getUserinfo();
    try {
      await this.db?.put("user", userinfo, "userinfo");
    } catch {}
    this.userinfo = userinfo;
    return userinfo;
  }

  async fetchHistory(force?: boolean) {
    if (force) {
      return await this.updateHistoryCache();
    } else {
      try {
        const historiesCache = await this.db?.getAll("history");
        if (!historiesCache) {
          return this.updateHistoryCache();
        }
        return historiesCache;
      } catch {
        const param = {
          className:
            this.userinfo?.userClass ?? (await this.getUserinfo()).userClass,
        };
        return await this.api.getHistory(param);
      }
    }
  }

  private async updateHistoryCache() {
    const param = {
      className:
        this.userinfo?.userClass ?? (await this.getUserinfo()).userClass,
    };
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

  async addHistory(param: Omit<AddHistoryRequest, "className">) {
    try {
      const flushResult = await this.flushHistory();
      if (flushResult.status == "IN-QUEUE") {
        throw flushResult.error;
      }
      const request = {
        className:
          this.userinfo?.userClass ?? (await this.getUserinfo()).userClass,
        ...param,
      };
      await this.api.addHistory(request);
      return { status: "COMPLETE" } as const;
    } catch (e) {
      const request = {
        className:
          this.userinfo?.userClass ?? (await this.getUserinfo()).userClass,
        ...param,
      };
      await this.db?.put("history-queue", request);
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
        return { status: "NONE" } as const;
      }
    } catch (e) {
      return { status: "IN-QUEUE", error: e } as const;
    }
  }

  async getSetting(force?: boolean): Promise<Setting> {
    if (force) {
      return await this.updateSettingCache();
    } else {
      try {
        const settingCache = (await this.db?.get("user", "settings")) as
          | Setting
          | undefined;
        if (!settingCache) {
          if (!this.userinfo) this.userinfo = await this.getUserinfo();
          const param = { className: this.userinfo.userClass };
          try {
            const setting = await this.api.getSetting(param);
            await this.db?.put("user", setting, "settings");
            return setting;
          } catch (e) {
            console.error(e);
            return this.settingErrorResponseHandler(e);
          }
        }
        return settingCache;
      } catch {
        const param = {
          className:
            this.userinfo?.userClass ?? (await this.getUserinfo()).userClass,
        };
        try {
          return await this.api.getSetting(param);
        } catch (e) {
          console.error(e);
          return this.settingErrorResponseHandler(e);
        }
      }
    }
  }

  private settingErrorResponseHandler(e: unknown): Setting {
    if (e instanceof ResponseError && e.response.status === 404) {
      return {
        className: this.userinfo?.userClass!,
      };
    } else {
      throw e;
    }
  }

  private async updateSettingCache(): Promise<Setting> {
    const param = {
      className:
        this.userinfo?.userClass ?? (await this.getUserinfo()).userClass,
    };
    try {
      const setting = await this.api.getSetting(param);
      try {
        await this.db?.put("user", setting, "settings");
      } catch {}
      return setting;
    } catch (e) {
      return this.settingErrorResponseHandler(e);
    }
  }

  async setSetting(param: Omit<SetSettingRequest, "className">) {
    const request = {
      className:
        this.userinfo?.userClass ?? (await this.getUserinfo()).userClass,
      ...param,
    };
    await this.api.setSetting(request);
    return await this.updateSettingCache();
  }

  async clearAllCache() {
    const stores = ["history", "history-queue", "user"] as const;
    const transaction = this.db?.transaction(stores, "readwrite");
    for (const storeName of stores) {
      const store = transaction?.objectStore(storeName);
      await store?.clear();
    }
  }
}
