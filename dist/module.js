System.register(['./datasource', './query_ctrl', './config_ctrl'], function(exports_1) {
    var datasource_1, query_ctrl_1, config_ctrl_1;
    var TeamCityQueryOptionsCtrl, TeamcityDataSourceAnnotationsQueryCtrl;
    return {
        setters:[
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            },
            function (config_ctrl_1_1) {
                config_ctrl_1 = config_ctrl_1_1;
            }],
        execute: function() {
            TeamCityQueryOptionsCtrl = (function () {
                function TeamCityQueryOptionsCtrl() {
                }
                TeamCityQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
                return TeamCityQueryOptionsCtrl;
            })();
            TeamcityDataSourceAnnotationsQueryCtrl = (function () {
                function TeamcityDataSourceAnnotationsQueryCtrl() {
                }
                TeamcityDataSourceAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
                return TeamcityDataSourceAnnotationsQueryCtrl;
            })();
            exports_1("Datasource", datasource_1["default"]);
            exports_1("QueryCtrl", query_ctrl_1.TeamcityDataSourceQueryCtrl);
            exports_1("ConfigCtrl", config_ctrl_1.TeamcityDataSourceConfigCtrl);
            exports_1("QueryOptionsCtrl", TeamCityQueryOptionsCtrl);
            exports_1("AnnotationsQueryCtrl", TeamcityDataSourceAnnotationsQueryCtrl);
        }
    }
});
//# sourceMappingURL=module.js.map