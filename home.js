var app = angular.module('myapp', []);
(function() {

    app.directive('onlyLettersInput', onlyLettersInput);
    
    function onlyLettersInput() {
        return {
          require: 'ngModel',
          link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
              var transformedInput = text.replace(/[^a-zA-Z]/g, '');
              //console.log(transformedInput);
              if (transformedInput !== text) {
                ngModelCtrl.$setViewValue(transformedInput);
                ngModelCtrl.$render();
              }
              return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
          }
        };
      };
  
  })();
  
app.controller('appCon', function ($scope, $window, servFlames, servIndex) {
  
    var matchCase = 0;
    var i=1;
    $scope.letters = ["F", "L", "A", "M", "E", "S"];
    $scope.dumletters = angular.copy($scope.letters);
    var newAr = angular.copy($scope.dumletters);
   
    $scope.calc = function () {
        $scope.content1Show = true;
        $scope.findClicked = true;

        var minLen = $scope.name1.length < $scope.name2.length ? $scope.name1.length : $scope.name2.length
        var maxLen = $scope.name1.length < $scope.name2.length ? $scope.name2.length : $scope.name1.length
        if ( minLen == $scope.name1.length) {
            minArr = $scope.name1.toLowerCase();
            MaxArr = $scope.name2.toLowerCase();
        }

        else {
            minArr = $scope.name2;
            MaxArr = $scope.name1;
        }
        for (var i = 0; i < minLen; i++) {
            for (j = 0; j < maxLen; j++) {
                if ( minArr[i] == MaxArr[j] ) {
                    matchCase += 1;
                    MaxArr=MaxArr.slice(0,j)+MaxArr.slice(j+1);
                    break;
                }
            }
        }
        $scope.matchCase = matchCase;
        angular.element(document.querySelectorAll(".content")).addClass("hidden");
        if( matchCase == 0){
            $scope.matchCase=0;
            $scope.matchCaseMsg = "You may find a better pair";
        }
        else
        {
          
            $scope.show2 = true;
            $scope.ani();
        }
        matchCase = 0;


        // setTimeout(10000, $scope.ani());
    };
    $scope.pos = function (event) {
        // console.log(event.screenX);
        // console.log(event.screenY);
        // console.log(event.screenX);
        // console.log(event.screenY);
    }
    $scope.ani = function () {
        // for (var i = 1; i < 6; i++) {
        setTimeout(function(){
            arr = servFlames.remove($scope.matchCase, newAr.slice());
            ind = servIndex.getIndex(newAr, arr);
            angular.element(document.querySelectorAll(".content2 > button")[ind[0]]).addClass("cross");
            // angular.element(document.querySelectorAll(".content2 > button")[ind[0]]).addClass("hidden");
            
            if (ind[1] == newAr.length - 1 || ind[1] == 0) {
                newAr = arr;
            }
            else {
                val = ind[1] + 1;
                newAr = newAr.slice(val).concat(newAr.slice(0, ind[1]));
            }
            i++;
            if(i<6)
            $scope.ani();
            
        },2000)
           
        
        // }
      
       
    }
});
app.service('servFlames', function () {
    this.remove = function (x, array) {
        if (x < array.length) {
            delIndex = x - 1;
        }
        else {
            x = x % array.length;
            if (x == 0) delIndex = array.length - 1;
            else delIndex = x - 1;
        }
        array.splice(delIndex, 1)
        return array;
    }
});
app.service('servIndex', function () {
    var dumy = ['F', 'L', 'A', 'M', 'E', 'S'];
    var origIndex;
    this.getIndex = function (oldArray1, newArray) {
        var num;
        for (var j = 0; j < oldArray1.length; j++) {
            // look for same thing in new array
            if (newArray.indexOf(oldArray1[j]) == -1) {
                num = j;
            }
        }
        origIndex = [dumy.indexOf(oldArray1[num]), num];
        return origIndex;
    }
});
