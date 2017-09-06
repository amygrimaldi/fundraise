angular.module('ionic-ecommerce.services', [])
.service('AuthService', AuthService)
.factory('ProductService', ProductService)
.factory('CartService', CartService)
.factory('LocalStorage', LocalStorage);



function httppostrequest($http, apiurl, apidata){
    return $http({
        method : "POST",
        withCredentials: false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: apiurl,
        data: JSON.stringify(apidata),
        timeout: 5000
    });
}

// Auth Service
AuthService.$inject = ['$q', '$http', 'LocalStorage', 'CONFIG'];
function AuthService($q, $http, LocalStorage, CONFIG) {
  var localStorage_token_key = CONFIG.localStorage_token_key;
  var token_header = CONFIG.token_header;
  var authToken;

  function loadUserCredentials() {
    var token = LocalStorage.get(localStorage_token_key);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    LocalStorage.set(localStorage_token_key, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    $http.defaults.headers.common[token_header] = token;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common[token_header] = undefined;
    LocalStorage.remove(localStorage_token_key);
  }

  function createuser(username, password, email) {
      var signupurl = "http://angelamustafa-001-site5.ctempurl.com/register";
      var datastring = '{"username":"'+username+'","'+password+'":"1111","email":"'+email+'","token":"user_id:514;app_id:2;device_id:56135127a430b2a4;language:en-GB;timestamp:0"}';
      var signupdata = JSON.parse(datastring);

      httppostrequest($http, signupurl, signupdata);
  }

  var login = function(email, password) {
    var endpoint = CONFIG.api_login_uri;
    var deferred = $q.defer();
    var promise = deferred.promise;
    var params = { email: email, password: password };
    $http
      .post(endpoint, params)
      .success(function(response) {
        storeUserCredentials(response.token);
        deferred.resolve(response);
      })
      .error(function(rejection) { deferred.reject(rejection); });

    promise.success = function (callback) {
      promise.then(callback);
      return promise;
    };
    promise.error = function (callback) {
      promise.then(null, callback);
      return promise;
    };
    return promise;
  };

  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();

  var loginurl = 'http://angelamustafa-001-site5.ctempurl.com/login';
  var logindata = JSON.parse('{"username":"Eta","password":"1111","token":"user_id:542;app_id:2;device_id:56135127a430b2a4;language:en-GB;timestamp:0"}');

  console.log("local storage isloggein te service "+LocalStorage.get("isloggedin"));
  function loginuser(username, password) {
      var loginurl = 'http://angelamustafa-001-site5.ctempurl.com/login';
      var logindata = JSON.parse('{"username":"'+username+'","password":"'+password+'","token":"user_id:542;app_id:2;device_id:56135127a430b2a4;language:en-GB;timestamp:0"}');
      return httppostrequest($http, loginurl, logindata);
  }

    function create_new_user(username, password, email) {
        var signupurl = 'http://angelamustafa-001-site5.ctempurl.com/register';
        var signupdata = JSON.parse('{"username":"'+username+'","password":"'+password+'","email":"'+email+'","token":"user_id:542;app_id:2;device_id:56135127a430b2a4;language:en-GB;timestamp:0"}');
        return httppostrequest($http, signupurl, signupdata);
    }

    function update_user(name, gender, street, city, country, email, phone){
          /*house_number, zip*/ //todo: kto nuk i sjell
      var user_id = LocalStorage.get('user_id');
      var language = LocalStorage.get('language');
      var updatetoken = "user_id:"+user_id+";app_id:3;device_id:56135127a430b2a4;language:"+language+";timestamp:0";
      var updateurl = "http://angelamustafa-001-site5.ctempurl.com/updateuser";
      var updatedata = JSON.parse('{"name":"'+name+'","street":"'+street+'","city":"'+city+'","zip":"125","email":"'+email+'","phone":"'+phone+'", "gender":"'+gender+'", "id":"'+user_id+'","country":"'+country+'","house_number ":"house_number ","token":"'+updatetoken+'"}')
        return httppostrequest($http, updateurl, updatedata);
    }

    function change_pass(oldpass, newpass){
        var user_id = LocalStorage.get('user_id');
        var language = LocalStorage.get('language');
        var updatetoken = "user_id:"+user_id+";app_id:3;device_id:56135127a430b2a4;language:"+language+";timestamp:0";
        var updateurl = "http://angelamustafa-001-site5.ctempurl.com/updatepassword";
        var updatedata = JSON.parse('{"old_password":"'+oldpass+'","new_password":"'+newpass+'","token":"'+updatetoken+'"}')
        return httppostrequest($http, updateurl, updatedata);
    }


  return {
    login: login,
    logout: logout,
    token: function() {return authToken;},
    userlogin: httppostrequest($http, loginurl, logindata),
    loginuser: loginuser,
    create_new_user: create_new_user,
    update_user: update_user,
    change_pass: change_pass
  };

}

// Product Service
ProductService.$inject = ['$http', '$q', 'AuthService', 'CONFIG'];
function ProductService($http, $q, AuthService, CONFIG) {
    var service = this;
    service.endpoint = CONFIG.api_products_uri;
    service.all = all;
    service.get = get;


    var productlisturl = 'http://angelamustafa-001-site5.ctempurl.com/products';
    var productlistdata = JSON.parse('{ "token": "user_id:513;app_id:2;device_id:56135127a430b2a4;language:en-GB;timestamp:0" }');
    service.productdata = {};
    service.myDataPromise = httppostrequest($http, productlisturl, productlistdata);

    var producturl = 'http://angelamustafa-001-site5.ctempurl.com/products';
    var productdata = JSON.parse('{"id":156,"token":"user_id:513;app_id:2;device_id:56135127a430b2a4;language:en-GB;timestamp:0"}');
    service.productdetaildata = {};
    service.productdetail = httppostrequest($http, producturl, productdata);


    function all(cache) {
        return httpRequestHandler(service.endpoint, cache);
    }

    function get(slug, cache) {
        return httpRequestHandler(service.endpoint + "/" + slug, cache);
    }

    function httpRequestHandler(url, cache) {
        var timedOut = false,
            timeout = $q.defer(),
            result = $q.defer(),
            httpRequest;

        cache = (typeof cache === 'undefined') ? true : cache;

        setTimeout(function () {
            timedOut = true;
            timeout.resolve();
        }, (1000 * CONFIG.timeout));

        httpRequest = $http({
            method: 'get',
            url: url,
            cache: cache,
            timeout: timeout.promise
        });

        httpRequest.success(function(response, status, headers, config) {
            var data = {};
            data.response = response;
            data.status = status;
            data.headers = headers;
            data.config = config;
            result.resolve(data);
        });

        httpRequest.error(function(rejection, status, headers, config) {
            var data = {};
            data.status = status;
            data.headers = headers;
            data.config = config;
            data.rejection = timedOut ? 'Request took longer than ' + CONFIG.timeout + ' seconds.' : rejection;
            result.reject(data);
        });

        return result.promise;
    }
    return service;
}

// Cart Service
CartService.$inject = ['$http', '$q', 'ProductService'];
function CartService($http, $q, ProductService) {
  var service = this;
  service.products = [];
  service.cart_product_id = 0;
  service.total = 0;
  service.add = add;
  service.remove = remove;
  service.getCount = getCount;

  function add(product) {
    var newProduct = $.extend(true, {}, product);
    newProduct.cart_product_id = ++service.cart_product_id;
    service.products.push(newProduct);
    service.total += parseFloat(newProduct.price);
  }

  function remove(product) {
    service.products = service.products.filter(function (el) { return el !== product; });
    service.total -= parseFloat(product.price);
  }

  function getCount() {
    return service.products.length;
  }

  return service;
}

LocalStorage.$inject = ['$window'];
function LocalStorage($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
}
