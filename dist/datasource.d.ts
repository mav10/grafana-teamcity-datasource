/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { ITarget } from "./types/queryOptions";
import { BuildFields, buildRequests, IExtendedBuildType, IFields, IHeaders, IInstanceSettings, IQueryOptions, IRequestOptions, SeriesResult } from "./types/types";
export default class TeamcityDataSource {
    private $q;
    id: number;
    name: string;
    type: string;
    url: string;
    targetTypes: string[];
    fields: IFields;
    headers: IHeaders;
    withCredentials: boolean;
    private backendSrv;
    private templateSrv;
    private q;
    /** @ngInject */
    constructor(instanceSettings: IInstanceSettings, backendSrv: any, templateSrv: any, $q: any);
    query: (options: IQueryOptions) => any;
    /**
     *
     * @param {IQueryOptions} queryOptions
     * @param {ITarget} target - current target query. @see collection in IQueryOptions.targets[]
     * @returns {SeriesResult}
     */
    queryOneTarget(queryOptions: IQueryOptions, target: ITarget): any;
    annotationQuery(options: any): void;
    /**
     *
     * @param {string} query
     * @returns {any} list view with build names
     */
    metricFindQuery(query: string): any;
    testDataSource: () => Promise<any>;
    /**
     * Returns last 10 build results for target buildType.
     * @param {buildRequests} request
     * @returns {Promise<IBuildFromResponse>}
     */
    getBuilds: (request: buildRequests) => Promise<BuildFields[]>;
    mapStatusToBuildStates: (state: string, status: string) => number;
    getBuildsList: () => Promise<IExtendedBuildType[]>;
    mapResult: (target: ITarget, items: BuildFields[]) => SeriesResult;
    doRequest(options: IRequestOptions): any;
}
