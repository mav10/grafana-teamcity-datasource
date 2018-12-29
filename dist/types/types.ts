import {JsonData, Meta} from "./instanceSettings";
import {RangeRaw, ITarget, Range} from "./queryOptions";

export interface IFields {
   [name: string]: string[]
}

export interface IHeaders {
    [name: string]: string
}

export const TargetTypes: any = {
    Builds: "build",
    Projects: "project"
}

export const BuildStates: any = {
    SUCCESS: 100,
	PENDING_AND_SUCCESS: 65,
    PENDING: 50,
	PENDING_AND_FAILED: 35,
    QUEUED: 25,
    FAILED: 0
}

export interface IRequestOptions {
    url: string;
    method: string;
    withCredentials: boolean;
    headers: IHeaders;
}

export interface buildRequests {
    from: Date,
    to: Date,
    count: number,
    buildId: string
}

export interface IInstanceSettings {
    id: number;
    jsonData: JsonData;
    meta: Meta;
    name: string;
    type: string;
    url: string;
    basicAuth: string;
    withCredentials: boolean;
}

export interface IQueryOptions {
    timezone: string;
    panelId: number;
    dashboardId: number;
    range: Range;
    rangeRaw: RangeRaw;
    interval: string;
    intervalMs: number;
    targets: ITarget[];
    maxDataPoints: number;
    scopedVars: any;
}

export interface IExtendedBuildType extends IBuildType {
    id: string;
    name: string;
    projectName: string;
    projectId: string;
}

export interface IBuildType {
    name: string;
    projectName: string;
}

export interface IBuildFromResponse {
    id: number;
    number: string;
    status: string;
    state: string;
    webUrl: string;
    statusText: string;
    buildType: IBuildType;
    finishDate: string;
}

export interface SeriesResult {
    /**
     * title of target build
     */
    target: string;
    /**
     * time series. It has 2 values:
     *   - first one: it's a value of series. e.g. for status it will be "SUCCESS" or "FAILED"
     *   - second one: it's a timespan
     */
    datapoints: number[][]
}

export interface BuildFields {
    id: number;
    number: string;
    state: string;
    status: number;
    statusText: string;
    date: number;
    name: string;
    projectName: string;
}