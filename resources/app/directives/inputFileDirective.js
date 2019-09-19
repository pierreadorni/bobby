app.directive('filesModel', function (){
    return {
        controller: function($parse, $element, $attrs, $scope){
            var exp = $parse($attrs.filesModel);
            var isMultiple = $attrs.multiple;
            $element.on('change', function(){
                if(isMultiple) {
                    exp.assign($scope, this.files);
                }else {
                    exp.assign($scope, this.files[0]);
                }
                $scope.$apply();
            });
        }
    };
});
