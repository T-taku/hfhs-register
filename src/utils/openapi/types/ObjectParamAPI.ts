import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { HTTPValidationError } from '../models/HTTPValidationError';
import { LocationInner } from '../models/LocationInner';
import { ValidationError } from '../models/ValidationError';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiAddHistoryHistoryAddClassNamePostRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApiaddHistoryHistoryAddClassNamePost
     */
    className: string
    /**
     * 
     * @type number
     * @memberof DefaultApiaddHistoryHistoryAddClassNamePost
     */
    change: number
    /**
     * 
     * @type number
     * @memberof DefaultApiaddHistoryHistoryAddClassNamePost
     */
    total: number
    /**
     * 
     * @type string
     * @memberof DefaultApiaddHistoryHistoryAddClassNamePost
     */
    product: string
}

export interface DefaultApiGetAllHistoryHistoryClassNameGetRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApigetAllHistoryHistoryClassNameGet
     */
    className: string
}

export interface DefaultApiGetUserinfoUserGetRequest {
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Add History
     * @param param the request object
     */
    public addHistoryHistoryAddClassNamePost(param: DefaultApiAddHistoryHistoryAddClassNamePostRequest, options?: Configuration): Promise<any> {
        return this.api.addHistoryHistoryAddClassNamePost(param.className, param.change, param.total, param.product,  options).toPromise();
    }

    /**
     * Get All History
     * @param param the request object
     */
    public getAllHistoryHistoryClassNameGet(param: DefaultApiGetAllHistoryHistoryClassNameGetRequest, options?: Configuration): Promise<any> {
        return this.api.getAllHistoryHistoryClassNameGet(param.className,  options).toPromise();
    }

    /**
     * Get Userinfo
     * @param param the request object
     */
    public getUserinfoUserGet(param: DefaultApiGetUserinfoUserGetRequest = {}, options?: Configuration): Promise<any> {
        return this.api.getUserinfoUserGet( options).toPromise();
    }

    /**
     * Get Islogin
     * @param param the request object
     */
    public getIsloginAuthGet(param: DefaultApiGetIsloginAuthGetRequest = {}, options?: Configuration): Promise<any> {
        return this.api.getIsloginAuthGet( options).toPromise();
    }

    /**
     * Index
     * @param param the request object
     */
    public indexGet(param: DefaultApiIndexGetRequest = {}, options?: Configuration): Promise<any> {
        return this.api.indexGet( options).toPromise();
    }

}

export interface DefaultApiGetIsloginAuthGetRequest {
}

export interface DefaultApiIndexGetRequest {
}