(function(){
    /**
     * ONES 基本插件
     * */
    ones.pluginRegister("loadModelFromJson", function(injector, defer, modelPath, filename) {
        modelPath = modelPath.split(".");
        var model = modelPath[1];

        var rootScope = injector.get("$rootScope");
        
        filename = filename ? filename : "model.json";
        $.getJSON(sprintf("apps/%s/data/"+filename, modelPath[0]), function(data){
            var property = data._property;
            ones.pluginScope.set(model+"ModelProperty", property);
            data._property = undefined;
            delete data._property;
            ones.pluginScope.set(model+"Model", data[model]);

            var result = {};
            angular.forEach(data[model], function(field, k){
                if(k == "_property") {
                    return;
                }
                if(field.displayName && angular.isArray(field.displayName)) {
                    field.displayName = toLang(field.displayName[0], field.displayName[1]||undefined, rootScope);
                }
                result[k] = field;
            });

            defer.resolve(result);
        });

        ones.pluginScope.set("defer", defer);
    });
})();