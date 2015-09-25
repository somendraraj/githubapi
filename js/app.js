// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app=angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
});

app.controller('myCtrl', function($scope,$http, $timeout) {
    $scope.message="This is my message";
	$scope.url="";
	
	var timeout;
$scope.events = null;
$scope.pulls = 0;

$scope.sevendaycount = 0;
$scope.onedaycount = 0;





$scope.viewissues = function(url){
   
   console.log('Button is clicked!!!');
   console.log(url);
    $scope.loader = true;
    $scope.sevendaycount = 0;                            //variable to store sevendaycount
    $scope.onedaycount = 0;                              //variable to store onedaycount
    $scope.pulls = 0;
    var newurl = 'https://api.github.com/repos/' + url + '/issues';       //url of issues
    var baseurl = 'https://api.github.com/repos/' + url;                  //url for repo
    console.log(newurl);

    
    var d = new Date();
    d.setDate(d.getDate()-1);				//last 24 hours
    d = d.toISOString();
    var d2 = new Date();
    d2.setDate(d2.getDate()-7);				//last 7 days
    d2 = d2.toISOString();
    var _count = 1;
    var _count2 = 1;
    var _count3 = 1;
    getbasicdata(baseurl);
    getsingledayissues(newurl, d, _count);                                  //function to get all single day issue
    getsevendayissues(newurl, d2, _count2);                                 //function to get seven day issue
    getpulls(baseurl + '/pulls' , _count3);                                 //function to get pull requests 


}



var getsingledayissues = function(url , date, _count){

    $http.get(url + '?page=' + _count + '&per_page=100&state=open&since=' + date).then(function(results){

        console.log(results.data);
        _count += 1;
						
        results.data.forEach(function(entry){
         
         console.log(entry.pull_request);

         
                   // before1day.setDate(before1day.getDate()-1);
                    var _before1day = Date.parse(date);
                     var created_time = Date.parse(entry.created_at);
         if(!entry.pull_request && created_time>_before1day )
           {
            $scope.onedaycount++;
           }

        });
        

        
       // $scope.onedaycount += results.data.length ; 
        if(results.data.length==100)
        {
           getsingledayissues(url, date, _count);

        }


    });
    

}




var getsevendayissues = function(url , date, _count2){

    $http.get(url + '?page=' + _count2 + '&per_page=100&state=open&since=' + date).then(function(results){

        console.log(results.data);
        _count2 += 1;
								//itterating the whole object to filter pull requests
        results.data.forEach(function(entry){
         
          var _before7day = Date.parse(date);
                     var created_time = Date.parse(entry.created_at);
         if(!entry.pull_request && created_time>_before7day )
           {
            $scope.sevendaycount++;
           }

        });

        //$scope.sevendaycount += results.data.length ;
        if(results.data.length==100)
        {
           getsevendayissues(url, date, _count2);

        }
        else{
            $scope.loader = false;
        }

    });
    

}


var getpulls = function(url , _count3){

    $http.get(url + '?page=' + _count3 + '&per_page=100').then(function(results){

        console.log(results.data);
        _count3 += 1;

        $scope.pulls += results.data.length;
       
       // $scope.onedaycount += results.data.length ; 
        if(results.data.length==100)
        {
           getpulls(url , _count3);

        }


    });
    

}




var getbasicdata = function(url){

    $http.get(url).then(function(results){
        console.log(results.data);
        $scope.repo = results.data;
    })
}






	
});
