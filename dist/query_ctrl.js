///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash', 'app/plugins/sdk', './css/query_editor.css!'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var lodash_1, sdk_1;
    var TeamcityDataSourceQueryCtrl;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (_1) {}],
        execute: function() {
            TeamcityDataSourceQueryCtrl = (function (_super) {
                __extends(TeamcityDataSourceQueryCtrl, _super);
                /** @ngInject **/
                function TeamcityDataSourceQueryCtrl($scope, $injector, templateSrv) {
                    _super.call(this, $scope, $injector);
                    this.templateSrv = templateSrv;
                    this.defaults = {};
                    lodash_1["default"].defaultsDeep(this.target, this.defaults);
                    this.target.target = this.target.target || 'select metric';
                    this.target.type = this.target.type || 'build';
                    this.target.field = this.target.field || 'status';
                }
                TeamcityDataSourceQueryCtrl.prototype.getOptions = function (query) {
                    return this.datasource.metricFindQuery(query || '');
                };
                TeamcityDataSourceQueryCtrl.prototype.onChangeInternal = function () {
                    this.panelCtrl.refresh(); // Asks the panel to refresh data.
                };
                TeamcityDataSourceQueryCtrl.templateUrl = 'partials/query.editor.html';
                return TeamcityDataSourceQueryCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("TeamcityDataSourceQueryCtrl", TeamcityDataSourceQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map