import TeamcityDataSource from './datasource';
import {TeamcityDataSourceQueryCtrl} from './query_ctrl';
import {TeamcityDataSourceConfigCtrl} from './config_ctrl';

class TeamCityQueryOptionsCtrl {
    static templateUrl = 'partials/query.options.html';
}

class  TeamcityDataSourceAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export {
    TeamcityDataSource as Datasource,
    TeamcityDataSourceQueryCtrl as QueryCtrl,
    TeamcityDataSourceConfigCtrl as ConfigCtrl,
    TeamCityQueryOptionsCtrl as QueryOptionsCtrl,
    TeamcityDataSourceAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
