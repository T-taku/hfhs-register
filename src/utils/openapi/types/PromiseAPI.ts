import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { HTTPValidationError } from '../models/HTTPValidationError';
import { LocationInner } from '../models/LocationInner';
import { ValidationError } from '../models/ValidationError';
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Add History
     * @param className 
     * @param change 
     * @param total 
     * @param product 
     */
    public addHistoryHistoryAddClassNamePost(className: string, change: number, total: number, product: string, _options?: Configuration): Promise<any> {
        const result = this.api.addHistoryHistoryAddClassNamePost(className, change, total, product, _options);
        return result.toPromise();
    }

    /**
     * Get All History
     * @param className 
     */
    public getAllHistoryHistoryClassNameGet(className: string, _options?: Configuration): Promise<any> {
        const result = this.api.getAllHistoryHistoryClassNameGet(className, _options);
        return result.toPromise();
    }

    /**
     * Get Userinfo
     */
    public getUserinfoUserGet(_options?: Configuration): Promise<any> {
        const result = this.api.getUserinfoUserGet(_options);
        return result.toPromise();
    }

    /**
     * Get Islogin
     */
    public getIsloginAuthGet(_options?: Configuration): Promise<any> {
        const result = this.api.getIsloginAuthGet(_options);
        return result.toPromise();
    }
    
    /**
     * Index
     */
    public indexGet(_options?: Configuration): Promise<any> {
        const result = this.api.indexGet(_options);
        return result.toPromise();
    }

}



