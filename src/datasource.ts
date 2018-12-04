///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import moment from 'moment';
import _ from 'lodash';

import {buildRequests, IFields, IHeaders, TargetTypes} from "./types";

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
  private q:any;

  /** @ngInject */
  constructor(instanceSettings, backendSrv, templateSrv, private $q) {
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.withCredentials = instanceSettings.withCredentials;

    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.q = $q;

    this.headers = {'Content-Type': 'application/json'};

    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
        this.headers['Authorization'] = instanceSettings.basicAuth;
    }

    this.targetTypes = [ TargetTypes.Build ]
    this.fields = {
        build: [ 'id', 'state', 'status', 'statusText', 'date', 'number', 'name', 'projectName' ]
    }
  }

  query(options) {
      var promises = options.targets
          .map(target => this.queryOneTarget(options, target))

      return Promise.all(promises).then(results => ({ data: [].concat.apply([], results) }));
  }

  async queryOneTarget(queryOptions, target): Promise<any> {
      console.log(queryOptions, target);
      if (this.targetTypes.indexOf(target.type) == -1) {
          return Promise.reject({ status: 'error', message: `queryOneTarget: Unknown target type ${target.type}` })
      }
      if (this.fields[target.type].indexOf(target.field) == -1) {
          return Promise.reject({ status: 'error', message: `queryOneTarget: Unknown field ${target.field}` })
      }
      if (target.type == 'build') {
          return this.getBuilds({
              buildId: target.target,
              count: queryOptions.maxDataPoints,
              from: queryOptions.range.from,
              to: queryOptions.range.to
          } as buildRequests).then(builds => this.mapResult(target, builds))
      }

      //TODO: do the same for projects here
      return Promise.reject({ status: 'error', message: `queryOneTarget: Unexpected state` })
  }

  annotationQuery(options) {
    throw new Error("Annotation Support not implemented yet.");
  }

  metricFindQuery(query: string) {
      return this.getBuildsList().then(types =>
          types
              .filter(type => type.id.indexOf(query) != -1)
              .map(type => ({ text: type.id, value: type.id }))
      )
  }

  testDataSource() {
    return this.getBuildsList()
        .then(() => ({ status: 'success', message: 'Data source is working', title: 'Success' }))
  }

    getBuilds(request: buildRequests) {
        var from = encodeURIComponent(moment(request.from).format("YYYYMMDDTHHmmssZ"))
        var to = encodeURIComponent(moment(request.to).format("YYYYMMDDTHHmmssZ"))
        var url = `${this.url}/httpAuth/app/rest/buildTypes/id:${request.buildId}`
            + `/builds?locator=start:0,count:10,defaultFilter:false&`
            + 'fields=build(webUrl,id,state,number,status,statusText,finishDate,buildType(name,projectName))'
        return this.doRequest({
            url: url,
            method: 'GET'
        }).then(result => {
            return result.data.build.map(build => ({
                id: build.id,
                number: build.number,
                state: build.state,
                status: build.status != 'SUCCESS' ? (build.state != 'finished' ? 50 : 0) : (build.state != 'finished' ? 50 : 100),
                statusText: build.statusText,
                date: moment(build.finishDate, 'YYYYMMDDTHHmmssZ').unix() * 1000,
                name: build.buildType.name,
                projectName: build.buildType.projectName
            }))
        })
    }

    getBuildsList() {
        var url = `${this.url}/httpAuth/app/rest/buildTypes?fields=buildType(id,name,projectName,projectId)`
        return this.doRequest({
            url: url,
            method: 'GET'
        }).then(result => {
            return result.data.buildType.map(type => ({
                id: type.id,
                name: type.name,
                projectId: type.projectId,
                projectName: type.projectName
            }))
        })
    }

    mapResult(target, items) {
        return {
            target: target.target,
            datapoints: items.map(item => [item[target.field], item.date])
                .sort((a, b) => a[1] > b[1])
        }
    }

    doRequest(options) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;

        return this.backendSrv.datasourceRequest(options)
    }
}
