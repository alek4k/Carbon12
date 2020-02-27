define(["app/plugins/sdk"],(function(e){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=27)}({13:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();(t.PredireInGrafanaAppConfigCtrl=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.$location=t}return e.$inject=["$location"],n(e,[{key:"redirect",value:function(){this.$location.url("plugins/predire-in-grafana-app/page/import")}}]),e}()).templateUrl="components/config.html"},27:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.importCtrl=t.ConfigCtrl=void 0,r(31),r(37);var n=r(13),o=r(28);(0,r(7).loadPluginCss)({dark:"plugins/predire-in-grafana-app/css/grafana-zabbix.dark.css",light:"plugins/predire-in-grafana-app/css/grafana-zabbix.light.css"}),t.ConfigCtrl=n.PredireInGrafanaAppConfigCtrl,t.importCtrl=o.importCtrl},28:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.importCtrl=void 0;var n,o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(29),a=(n=i)&&n.__esModule?n:{default:n};(t.importCtrl=function(){function e(t,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.$location=t,this.backendSrv=r,this.jsonImported=!1,this.jsonError="",this.notSelectedError=""}return e.$inject=["$location","backendSrv"],o(e,[{key:"uploadFile",value:function(e){this.jsonImported=!0,this.jsonError=""}},{key:"loadText",value:function(){try{this.uploadFile(JSON.parse(this.jsonText))}catch(e){this.jsonError=e.message}}},{key:"createPanel",value:function(){var e=this;if(this.checkForm())return this.backendSrv.post("api/dashboards/import",{dashboard:a.default,folderId:0,overwrite:!0}).then((function(t){e.$location.url(t.importedUrl)}))}},{key:"checkForm",value:function(){var e=this.cpu||this.ram||this.diskio;return this.jsonImported&&e&&this.model?(this.notSelectedError="",!0):(this.notSelectedError="È necessario selezionare",this.jsonImported||(this.notSelectedError+=" un file JSON",e||this.model?e&&this.model||(this.notSelectedError+=" e"):this.notSelectedError+=","),e||(this.notSelectedError+=" almeno una sorgente",this.model||(this.notSelectedError+=" e")),this.model||(this.notSelectedError+=" un modello"),!1)}}]),e}()).templateUrl="components/import.html"},29:function(e){e.exports=JSON.parse('{"title":"Predire in Grafana","tags":[],"style":"dark","timezone":"browser","editable":true,"hideControls":false,"rows":[{"height":"350px","collapse":false,"editable":true,"panels":[{"span":12,"type":"graph-prediction","datasource":"MySQL","x-axis":true,"y-axis":true,"scale":1,"y_formats":["short","short"],"grid":{"max":null,"min":null,"leftMax":null,"rightMax":null,"leftMin":null,"rightMin":null,"threshold1":null,"threshold2":null,"threshold1Color":"rgba(216, 200, 27, 0.27)","threshold2Color":"rgba(234, 112, 112, 0.22)"},"resolution":100,"lines":true,"fill":1,"linewidth":2,"dashes":false,"dashLength":10,"spaceLength":10,"points":false,"pointradius":5,"bars":false,"stack":true,"spyable":true,"options":false,"legend":{"show":true,"values":false,"min":false,"max":false,"current":false,"total":false,"avg":false},"interactive":true,"legend_counts":true,"timezone":"browser","percentage":false,"nullPointMode":"connected","steppedLine":false,"tooltip":{"value_type":"cumulative","query_as_alias":true},"targets":[{"refId":"A","policy":"default","resultFormat":"time_series","orderByTime":"ASC","tags":[{"key":"server","operator":"=","value":"localhost:3306"}],"groupBy":[{"type":"time","params":["$__interval"]},{"type":"fill","params":["null"]}],"select":[[{"type":"field","params":["bytes_received"]},{"type":"mean","params":[]}]],"measurement":"mysql_mysql"}],"aliasColors":{},"aliasYAxis":{},"renderer":"flot","annotate":{"enable":false}}]}],"nav":[{"type":"timepicker","collapse":false,"enable":true,"status":"Stable","time_options":["5m","15m","1h","6h","12h","24h","2d","7d","30d"],"refresh_intervals":["5s","10s","30s","1m","5m","15m","30m","1h","2h","1d"],"now":true}],"time":{"from":"now-6h","to":"now"},"templating":{"list":[]},"refresh":"10s","version":0}')},31:function(e,t){},37:function(e,t){},7:function(t,r){t.exports=e}})}));
//# sourceMappingURL=module.js.map