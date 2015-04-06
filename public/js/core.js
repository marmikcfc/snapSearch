var scotchTodo = angular.module('scotchTodo', []);
var faceData = [];
function mainController($scope, $http, $sce, $location, $anchorScroll, $filter) {
	var orderBy = $filter('orderBy');
	$scope.formData = {};
	
	$scope.imageJson;
	$scope.image;
	$scope.image_keywordsJson;
	$scope.image_keywords;
	$scope.imageFaceTagsJson;
	$scope.imageFaceTags;
	$scope.imageTextTagsJson;
	$scope.imageTextTags;

	$scope.showResultsText = false;
	$scope.showResultsVisual = false;
	$scope.showProgress = false;
	$scope.predicate = '-confidence';

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$scope.showResultsText = false;
		$scope.showResultsVisual = false;
		$scope.showProgress = true;
		if($scope.formData) {
			if($scope.formData.text == undefined){
				$scope.formData = {text: document.getElementById("imageT").src};
			} else if($scope.formData.text == ''){
				$scope.formData = {text: document.getElementById("imageT").src};
			}
		}
		console.log($scope.formData);
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {text: data.image.url}; // clear the form so our user is ready to enter another
				if(data.image){
					$scope.imageJson = $scope.parseJSONData(data.image);
					$scope.image = data.image.response.image;
				}
				if(data.image_keywords){
					$scope.image_keywordsJson = $scope.parseJSONData(data.image_keywords);
					$scope.image_keywords = data.image_keywords.response.imageKeywords;
				}
				if(data.imageFaceTags){
					$scope.imageFaceTagsJson = $scope.parseJSONData(data.imageFaceTags);
					$scope.imageFaceTags = data.imageFaceTags.response.imageFaces;
				}
				if(data.imageTextTags){
					$scope.imageTextTagsJson = $scope.parseJSONData(data.imageTextTags);
					console.log(data.imageTextTags.response.results);
					$scope.imageTextTags = data.imageTextTags.response.results;
					// add Text tags in  image
					for (x in data.imageTextTags.response.results){
					    //$scope.periodUnits += $scope.dailyreportsResults.data[x].units;
					    console.log(data.imageTextTags.response.results[x].candidates[0].region.x);
					    setTextTags(data.imageTextTags.response.results[x].candidates[0].region.x, 
					    			data.imageTextTags.response.results[x].candidates[0].region.y, 
					    			data.imageTextTags.response.results[x].candidates[0].region.width, 
					    			data.imageTextTags.response.results[x].candidates[0].region.height);
					}
					//$scope.predicate = '-Confidence';
					$scope.order = function(predicate, reverse) {
						$scope.imageTextTags = orderBy($scope.imageTextTags, predicate, reverse);
					};
					$scope.order('-confidence',false);
				}
				$scope.showResultsText = true;
				$scope.showProgress = false;
				$location.hash('searchinput');
				$anchorScroll();
				$(".faceTab").click();
				$(".visulaTab").click();
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

		$scope.searchThis=function(linkUrl){

				$('#searchinput').val(linkUrl);
	

		};

	// Parse JSON data into 
	$scope.parseJSONData = function(response) {
		var results1 = JSON.stringify(response, undefined, 2),
			results2 = results1.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
	    return $sce.trustAsHtml(results2);//results2;
	};
}
