import {GraphCtrl} from "../graph/module";

class GraphPredictionCtrl extends GraphCtrl{
    /** @ngInject*/
    constructor($scope, $injector, annotationsSrv, backendSrv) {
        super($scope, $injector, annotationsSrv);
        $scope.ctrl.panel.title = "Carbon12 Graph Prediction";
    }
}

GraphPredictionCtrl.templateUrl = 'public/plugins/predire-in-grafana/panels/graph-prediction/module.html';
export {
    GraphPredictionCtrl as PanelCtrl
};

