///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import moment from 'moment';

import {ITarget} from "./typings/queryOptions";
import {
    IBuildFromResponse, BuildFields,
    buildRequests, IExtendedBuildType,
    IFields,
    IHeaders,
    IInstanceSettings,
    IQueryOptions, IRequestOptions, SeriesResult, BuildStates, TargetTypes,
} from "./typings/types";

export default class TeamcityDataSource {
    id: number;
    name: string;
    type: string;
    url: string;
    targetTypes: string[];
    fields: IFields;
    headers: IHeaders;
    withCredentials: boolean;
    private backendSrv: any;
    private templateSrv: any;
    private q: any;

    /** @ngInject */
    constructor(instanceSettings: IInstanceSettings, backendSrv: any, templateSrv: any, private $q: any) {
        this.name = instanceSettings.name;
        this.id = instanceSettings.id;
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.withCredentials = instanceSettings.withCredentials;

        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.q = $q;

        this.headers = {'Content-Type': 'application/json'};
        if (instanceSettings.basicAuth)
            this.headers['Authorization'] = instanceSettings.basicAuth;

        this.targetTypes = [TargetTypes.Builds]
        this.fields = {
            build: ['id', 'state', 'status', 'statusText', 'date', 'number', 'name', 'projectName']
        }
    }

    query = (options: IQueryOptions): any => {
        var promises = options.targets
            .map(target => this.queryOneTarget(options, target));

        return Promise.all(promises)
            .then(results => ({data: [].concat.apply([], results)}));
    }

    /**
     *
     * @param {IQueryOptions} queryOptions
     * @param {ITarget} target - current target query. @see collection in IQueryOptions.targets[]
     * @returns {SeriesResult}
     */
    queryOneTarget(queryOptions: IQueryOptions, target: ITarget): any {
        if (this.targetTypes.indexOf(target.type) == -1) {
            return Promise.reject({status: 'error', message: `queryOneTarget: Unknown target type ${target.type}`})
        }
        if (this.fields[target.type].indexOf(target.field) == -1) {
            return Promise.reject({status: 'error', message: `queryOneTarget: Unknown field ${target.field}`})
        }
        if (target.type == TargetTypes.Builds) {
            const buildRequestOptions = {
                buildId: target.target,
                count: queryOptions.maxDataPoints,
                from: queryOptions.range.from,
                to: queryOptions.range.to
            } as buildRequests;

            return this.getBuilds(buildRequestOptions)
                .then(builds => this.mapResult(target, builds))
        }

        return Promise.reject({status: 'error', message: `queryOneTarget: Unexpected state`})
    }

    annotationQuery(options) {
        console.log('anotationsOptions: ', options)
        throw new Error("Annotation Support not implemented yet.");
    }

    /**
     *
     * @param {string} query
     * @returns {any} list view with build names
     */
    metricFindQuery(query: string): any {
        return this.getBuildsList().then(types =>
            types
                .filter(type => type.id.indexOf(query) != -1)
                .map(type => ({text: type.id, value: type.id}))
        )
    }

    testDataSource = (): Promise<any> => {
        return this.getBuildsList()
            .then((builds: IExtendedBuildType[]) =>
                ({status: 'success', message: `Data source is working. ${builds.length}`, title: 'Success'})
            )
    }

    /**
     * Returns last 10 build results for target buildType.
     * @param {buildRequests} request
     * @returns {Promise<IBuildFromResponse>}
     */
    getBuilds = (request: buildRequests): Promise<BuildFields[]> => {
        var from = encodeURIComponent(moment(request.from).format("YYYYMMDDTHHmmssZ"))
        var to = encodeURIComponent(moment(request.to).format("YYYYMMDDTHHmmssZ"))
        var url = `${this.url}/httpAuth/app/rest/buildTypes/id:${request.buildId}`
            + `/builds?locator=start:0,count:10,defaultFilter:false&`
            + 'fields=build(webUrl,id,state,number,status,statusText,finishDate,buildType(name,projectName))'
        return this.doRequest({
            url: url,
            method: 'GET'
        } as IRequestOptions).then(result => {
            return result.data.build.map((build: IBuildFromResponse) => ({
                id: build.id,
                number: build.number,
                state: build.state,
                status: this.mapStatusToBuildStates(build.state, build.status),
                statusText: build.statusText,
                date: moment(build.finishDate, 'YYYYMMDDTHHmmssZ').unix() * 1000,
                name: build.buildType.name,
                projectName: build.buildType.projectName
            }) as BuildFields)
        })
    }

    mapStatusToBuildStates = (state: string, status: string): number => {
        if (state != 'finished') {
            return state == 'running' ? BuildStates.PENDING : BuildStates.QUEUED;
        } else if (status != null && status == 'SUCCESS') {
            return BuildStates.SUCCESS;
        }
        return BuildStates.FAILED;
    }

    getBuildsList = (): Promise<IExtendedBuildType[]> => {
        var url = `${this.url}/httpAuth/app/rest/buildTypes?fields=buildType(id,name,projectName,projectId)`
        return this.doRequest({
            url: url,
            method: 'GET'
        } as IRequestOptions).then(result => {
            return result.data.buildType.map(type => ({
                id: type.id,
                name: type.name,
                projectId: type.projectId,
                projectName: type.projectName
            }))
        })
    }

    mapResult = (target: ITarget, items: BuildFields[]): SeriesResult => {
        return {
            target: target.target,
            datapoints: items
                .map(item => [item[target.field], item.date])
        }
    }

    doRequest(options: IRequestOptions) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;

        return this.backendSrv.datasourceRequest(options)
    }
}
