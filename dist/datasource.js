///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['moment', "./types/types"], function(exports_1) {
    var moment_1, types_1;
    var TeamcityDataSource;
    return {
        setters:[
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (types_1_1) {
                types_1 = types_1_1;
            }],
        execute: function() {
            TeamcityDataSource = (function () {
                /** @ngInject */
                function TeamcityDataSource(instanceSettings, backendSrv, templateSrv, $q) {
                    var _this = this;
                    this.$q = $q;
                    this.query = function (options) {
                        var promises = options.targets
                            .map(function (target) { return _this.queryOneTarget(options, target); });
                        return Promise.all(promises)
                            .then(function (results) { return ({ data: [].concat.apply([], results) }); });
                    };
                    this.testDataSource = function () {
                        return _this.getBuildsList()
                            .then(function (builds) {
                            return ({ status: 'success', message: "Data source is working. " + builds.length, title: 'Success' });
                        });
                    };
                    /**
                     * Returns last 10 build results for target buildType.
                     * @param {buildRequests} request
                     * @returns {Promise<IBuildFromResponse>}
                     */
                    this.getBuilds = function (request) {
                        var from = encodeURIComponent(moment_1["default"](request.from).format("YYYYMMDDTHHmmssZ"));
                        var to = encodeURIComponent(moment_1["default"](request.to).format("YYYYMMDDTHHmmssZ"));
                        var url = (_this.url + "/httpAuth/app/rest/buildTypes/id:" + request.buildId)
                            + "/builds?locator=start:0,count:1,defaultFilter:false&"
                            + 'fields=build(webUrl,id,state,number,status,statusText,finishDate,buildType(name,projectName))';
                        return _this.doRequest({
                            url: url,
                            method: 'GET'
                        }).then(function (result) {
                            return result.data.build.map(function (build) { return ({
                                id: build.id,
                                number: build.number,
                                state: build.state,
                                status: _this.mapStatusToBuildStates(build.state, build.status),
                                statusText: build.statusText,
                                date: moment_1["default"](build.finishDate, 'YYYYMMDDTHHmmssZ').unix() * 1000,
                                name: build.buildType.name,
                                projectName: build.buildType.projectName
                            }); });
                        });
                    };
                    this.mapStatusToBuildStates = function (state, status) {
                        if (state != 'finished') {
                            return state == 'running' ? types_1.BuildStates.PENDING : types_1.BuildStates.QUEUED;
                        }
                        else if (status != null && status == 'SUCCESS') {
                            return types_1.BuildStates.SUCCESS;
                        }
                        return types_1.BuildStates.FAILED;
                    };
                    this.getBuildsList = function () {
                        var url = _this.url + "/httpAuth/app/rest/buildTypes?fields=buildType(id,name,projectName,projectId)";
                        return _this.doRequest({
                            url: url,
                            method: 'GET'
                        }).then(function (result) {
                            return result.data.buildType.map(function (type) { return ({
                                id: type.id,
                                name: type.name,
                                projectId: type.projectId,
                                projectName: type.projectName
                            }); });
                        });
                    };
                    this.mapResult = function (target, items) {
                        return {
                            target: target.target,
                            datapoints: items
                                .map(function (item) { return [item[target.field], item.date]; })
                        };
                    };
                    this.name = instanceSettings.name;
                    this.id = instanceSettings.id;
                    this.type = instanceSettings.type;
                    this.url = instanceSettings.url;
                    this.withCredentials = instanceSettings.withCredentials;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.q = $q;
                    this.headers = { 'Content-Type': 'application/json' };
                    if (instanceSettings.basicAuth)
                        this.headers['Authorization'] = instanceSettings.basicAuth;
                    this.targetTypes = [types_1.TargetTypes.Builds];
                    this.fields = {
                        build: ['id', 'state', 'status', 'statusText', 'date', 'number', 'name', 'projectName']
                    };
                }
                /**
                 *
                 * @param {IQueryOptions} queryOptions
                 * @param {ITarget} target - current target query. @see collection in IQueryOptions.targets[]
                 * @returns {SeriesResult}
                 */
                TeamcityDataSource.prototype.queryOneTarget = function (queryOptions, target) {
                    var _this = this;
                    if (this.targetTypes.indexOf(target.type) == -1) {
                        return Promise.reject({ status: 'error', message: "queryOneTarget: Unknown target type " + target.type });
                    }
                    if (this.fields[target.type].indexOf(target.field) == -1) {
                        return Promise.reject({ status: 'error', message: "queryOneTarget: Unknown field " + target.field });
                    }
                    if (target.type == types_1.TargetTypes.Builds) {
                        var buildRequestOptions = {
                            buildId: target.target,
                            count: queryOptions.maxDataPoints,
                            from: queryOptions.range.from,
                            to: queryOptions.range.to
                        };
                        return this.getBuilds(buildRequestOptions)
                            .then(function (builds) { return _this.mapResult(target, builds); });
                    }
                    return Promise.reject({ status: 'error', message: "queryOneTarget: Unexpected state" });
                };
                TeamcityDataSource.prototype.annotationQuery = function (options) {
                    console.log('anotationsOptions: ', options);
                    throw new Error("Annotation Support not implemented yet.");
                };
                /**
                 *
                 * @param {string} query
                 * @returns {any} list view with build names
                 */
                TeamcityDataSource.prototype.metricFindQuery = function (query) {
                    return this.getBuildsList().then(function (types) {
                        return types
                            .filter(function (type) { return type.id.indexOf(query) != -1; })
                            .map(function (type) { return ({ text: type.id, value: type.id }); });
                    });
                };
                TeamcityDataSource.prototype.doRequest = function (options) {
                    options.withCredentials = this.withCredentials;
                    options.headers = this.headers;
                    return this.backendSrv.datasourceRequest(options);
                };
                return TeamcityDataSource;
            })();
            exports_1("default", TeamcityDataSource);
        }
    }
});
//# sourceMappingURL=datasource.js.map