angular.module('ionic-ecommerce.controllers', [])
.controller('TabCtrl', TabCtrl)
.controller('HomeCtrl', HomeCtrl)
.controller('ProductsCtrl', ProductsCtrl)
.controller('ProductDetailCtrl', ProductDetailCtrl)
.controller('CartCtrl', CartCtrl)
.controller('AccountCtrl', AccountCtrl)
.controller('LoginCtrl', LoginCtrl);

// Tab Controller
TabCtrl.$inject = ['$scope', 'CartService', 'CONFIG'];
function TabCtrl(   $scope,   CartService,   CONFIG) {
  var vm = this;
  vm.count = 1; //CartService.getCount();
  vm.messages = CONFIG.tabs;
/*

 $scope.$watch(function(){ return CartService.getCount();}, function(current, original) {
 vm.count = current;
 });
* */
}

// Home Controller
HomeCtrl.$inject = ['ProductService', 'CartService', 'CONFIG', '$scope', '$state', '$ionicPopup', '$ionicSlideBoxDelegate', '$timeout'];
function HomeCtrl(   ProductService,   CartService,   CONFIG,   $scope,   $state,   $ionicPopup,   $ionicSlideBoxDelegate,   $timeout) {
  var vm = this,
      cacheLoaded = false;

  vm.show_featured = false;
  vm.addedToCart = false;
  vm.addToCart = addToCart;
  vm.messages = CONFIG.home;


    function addToCart(product, $event) {
      $event.stopPropagation();
      CartService.add(product);
      vm.addedToCart = true;
      $timeout(function(){vm.addedToCart = false;}, 700);
    }
}

//Products Controller
ProductsCtrl.$inject = ['$scope', '$state', '$ionicLoading', '$ionicPopup', 'AuthService', 'ProductService', 'CONFIG'];
function ProductsCtrl($scope, $state,   $ionicLoading,   $ionicPopup,   AuthService,   ProductService,   CONFIG) {
    var vm = this;
    vm.messages = CONFIG.products;

    //ketu kaloj tek cart (e view) te gjitha vlerat e marra nga sherbimi
    vm.thedata = ProductService.myDataPromise.then(function(result) {
        vm.productdata = result;
        console.log(result);
    });

}

//Products Controller
ProductDetailCtrl.$inject = ['$scope', '$state', '$ionicLoading', '$ionicPopup', 'AuthService', 'ProductService', 'CONFIG'];
function ProductDetailCtrl($scope, $state,   $ionicLoading,   $ionicPopup,   AuthService,   ProductService,   CONFIG) {
    //opens page of a single product. Gets data for this product
    $scope.gotoproduct = function (product_id) {
        var vm = this;
        console.log("the product id "+product_id); //ok

        vm.thedatas = ProductService.productdetail(product_id).then(function(data) {
            // $scope.userdata = data;
            console.log("@product detail controller funct")
            console.log(data);
            console.log("prape id -- "+product_id);
            vm.product_id = 10;
            $state.go('product_detail', {the_data: vm.product_id})
        }).catch(function(errorResponse) {
            console.log('error', errorResponse);
        });

    }

}

// Cart Controller
CartCtrl.$inject = ['$scope', '$state', 'CartService', 'CONFIG'];
function CartCtrl( $scope,   $state,   CartService,   CONFIG) {
  var vm = this;
  vm.messages = CONFIG.cart;
  vm.remove = remove;

  /*
  $scope.$on('$ionicView.enter', function(e) {
    vm.products = CartService.products;
    vm.total = CartService.total;
    console.log(vm.products);
    for (var key in vm.products) {
      var product = vm.products[key];
      product.image = CONFIG.image_root + product.master.images[0].mini_url;
    }
  });
  */
/*

 vm.cart_list = ProductService.myDataPromise.then(function(result) {
 vm.productdata = result;
 console.log(result);
 });
 */



    //appoint result returned from login
    //$scope.log_in = function () {
        vm.cart_list = CartService.cart_list().then(function(response){
            console.log(response);
            vm.crt_list = response;
            /*
            if(ok){
                save_user_data(LocalStorage, response.data); //store data in local storage
                //change view, passing parameters
                $state.go('account_info', {
                    username: response.data.name, email: response.data.email, country: response.data.country,
                    city: response.data.city, street: response.data.street, phone: response.data.phone
                });
            }
            else{ //nqs jo i loguar, nuk ka cart
                var alertPopup = $ionicPopup.alert({
                    title: 'Unsuccessful login',
                    template: 'Username and password did not match'
                });
                alertPopup.then(function(res) {
                    // Custom functionality....
                });
            }
            */
        });
    //}

  function remove(product) {
    CartService.remove(product);
    vm.total = CartService.total;
    $state.reload();
  }

}


AccountCtrl.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'LocalStorage', 'CONFIG', '$ionicPopup'];
function AccountCtrl(   $scope,   $state, $stateParams,  AuthService, LocalStorage,   CONFIG, $ionicPopup) {
    var vm = this;
    vm.messages = CONFIG.account;
    vm.logout = logout;
    vm.thisuser = {};

    //initialize active view as account main view, if it is not already set to a value
    if(LocalStorage.get('currentstate')) {vm.currentstate = LocalStorage.get('currentstate');}
    else {vm.currentstate = 'ataccountmain';}
    read_user_data(vm.thisuser, LocalStorage); //read local values into scope variable


    $scope.$on('$ionicView.enter', function(e) {
        vm.token = AuthService.token();
    });

    //change language
    $scope.savelang = function (language) {
        console.log(language);
        LocalStorage.set('language', language);
        console.log('u vendos '+LocalStorage.get('language'))
        $state.go('account_info');
    }

    //appoint result returned from login
    $scope.log_in = function (username, password) {
        var promise = AuthService.loginuser(username, password);
        LocalStorage.set('password', password);
        console.log("the password ---- "+LocalStorage.get('password'));
        promise.then(function(response){
            if(response.data.id){
                save_user_data(LocalStorage, response.data); //store data in local storage
                //change view, passing parameters
                $state.go('account_info', {
                    username: response.data.name, email: response.data.email, country: response.data.country,
                    city: response.data.city, street: response.data.street, phone: response.data.phone
                });
            }
            else{
                console.log("te login jo i sukseshem");
                var alertPopup = $ionicPopup.alert({
                    title: 'Unsuccessful login',
                    template: 'Username and password did not match'
                });
                alertPopup.then(function(res) {
                    // Custom functionality....
                });
            }
        });
    }

    //appoint result returned from login
    $scope.createuser = function (username, password, email) {
        console.log(username+' --- '+password+' --- '+email);
        var promise = AuthService.create_new_user(username, password, email);
        promise.then(function(response){
            if(response.data.accessToken === true){
                vm.this = response.data; //pass user info to view
                save_user_data(LocalStorage, response.data); //store data in local storage
                $state.go('account_info', {
                    username: vm.this.username, email: vm.this.email, country: vm.this.country,
                    city: vm.this.city, phone: vm.this.phone
                });
            }
            else{
                var alertPopup = $ionicPopup.alert({
                    title: response.data.name,
                    template: data.error
                });
            }

        });
    }

    //edit user info
    $scope.updateuser = function (username, gender, street, city, country, email, phone) {
        LocalStorage.set('gender', gender);

        var promise = AuthService.update_user (username, gender, street, city, country, email, phone);
        promise.then(function(response){
            //todo: kontrollo response.data per te pare a ishte ok
            update_user_data(LocalStorage, vm.thisuser, username, gender, street, city, country, email, phone);
            $state.go('account_info', {
                username: vm.thisuser.username, email: vm.thisuser.email, country: vm.thisuser.country,
                city: vm.thisuser.city, phone: vm.thisuser.phone
            });
        });
    }

    // changepass(account.thisuser.password, account.thisuser.newpass, account.thisuser.newpassconfirm)
    $scope.changepass = function (password, newpass, newpassconfirm) {
        if(newpass !== newpassconfirm){
            //todo: thuaj password does not match
            console.log('new dhe confirm do not match')
            console.log('old - '+password+' --- new - '+newpass+'--- newconfirm - '+newpassconfirm);
            var alertPopup = $ionicPopup.alert({
                title: 'Password change failed', template: 'New password was not confirmed'
            });
            alertPopup.then(function(res) {});
        }
        else if(password !== LocalStorage.get('password')){
            // todo: thuaj wrong password
            console.log('old - '+password+' --- new - '+newpass+'--- newconfirm - '+newpassconfirm)
            console.log('local - '+LocalStorage.get('password'))
            var alertPopup = $ionicPopup.alert({
                title: 'Wrong password', template: 'Current password was incorrect'
            });
            alertPopup.then(function(res) {});
        }
        else{
            console.log('ok lets change it')
            console.log('old - '+password+' --- new - '+newpass+'--- newconfirm - '+newpassconfirm)
            //todo: ndrysho pass dhe ruaj te riun
            var promise = AuthService.change_pass (password, newpass);
            promise.then(function(response){
                //todo: kontrollo response.data per te pare a ishte ok
                console.log(response);
                $state.go('account_info', {
                    username: vm.thisuser.username, email: vm.thisuser.email, country: vm.thisuser.country,
                    city: vm.thisuser.city, phone: vm.thisuser.phone
                });
            });

        }
    }

    $scope.log_out = function () {
        LocalStorage.set("isloggedin", false);
        console.log("local storage isloggein te logout "+LocalStorage.get("isloggedin"));
        delete_after_logout(LocalStorage);
        $state.go('account');
    }



    $scope.gotologin = function (){
        console.log("@gotologin");
        $state.go('account_login');
    }

    $scope.gotoregister = function(){
        console.log("@gotoregister");
        $state.go('account_create');
    }

    $scope.gotomain = function () {
        console.log("@gotomain");
        $state.go('account');
    }

    $scope.editaccount = function () {
        console.log("@editaccount");
        $state.go('account_edit', {

        });
    }

    $scope.gotoaccountinfo = function () {
        console.log("@going acount info");
        $state.go('account_info');
    }

    $scope.gotochangepass = function(){
        console.log("@changepass");
        $state.go('account_passchange');
    }

    $scope.showsettings = function () {
        console.log("@showsettings");
        $state.go('account_settings', {language: vm.thisuser.language});
    }

    function logout() {
        AuthService.logout();
        vm.user = null;
        vm.token = null;

        $state.reload('account');
    }
}

// Login Controller
LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', 'AuthService', 'CONFIG'];
function LoginCtrl(   $state,   $ionicLoading,   $ionicPopup,   AuthService,   CONFIG) {
  var vm = this;
  vm.messages = CONFIG.login;
  vm.go = go;

  function go(user) {
    $ionicLoading.show();
    vm.user = null;
    AuthService.login(user.email, user.password)
      .success(function(data) {
        console.log("successful login; token: " + data.token);
        $state.go('account', {}, {reload: true});
        $ionicLoading.hide();
      })
      .error(function(data) {
        console.log("login failed", data.error);
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: data.error
        });
      });
  }
}

function save_user_data(LocalStorage, userdata){
    try{
        LocalStorage.set('user_id', userdata.id);
        LocalStorage.set('username', userdata.name);
        LocalStorage.set('email', userdata.email);
        LocalStorage.set('gender', userdata.gender);
        LocalStorage.set('country', userdata.country);
        LocalStorage.set('city', userdata.city);
        LocalStorage.set('street', userdata.street);
        LocalStorage.set('phone', userdata.phone);
    }catch (error){
        console.log(error)
        //todo: handle error
    }
}

function update_user_data(LocalStorage, thisuser, username, gender, street, city, country, email, phone){
    try{
        LocalStorage.set('username', username); thisuser.username = username;
        LocalStorage.set('gender', gender); thisuser.gender = gender;
        LocalStorage.set('street', street);  thisuser.street = street;
        LocalStorage.set('city', city); thisuser.city = city;
        LocalStorage.set('country', country); thisuser.country = country;
        LocalStorage.set('email', email); thisuser.email = email;
        LocalStorage.set('phone', phone); thisuser.phone = phone;
    }catch (error){
        console.log(error)
        //todo: handle error
    }
}

function read_user_data(thisuser, LocalStorage){
    thisuser.username = (LocalStorage.get('username')) ? LocalStorage.get('username') : '';
    thisuser.email = (LocalStorage.get('email')) ? LocalStorage.get('email') : '';
    thisuser.gender = (LocalStorage.get('gender')) ? LocalStorage.get('gender') : '';
    thisuser.phone = (LocalStorage.get('phone')) ? LocalStorage.get('phone') : '';
    thisuser.country = (LocalStorage.get('country')) ? LocalStorage.get('country') : '';
    thisuser.city = (LocalStorage.get('city')) ? LocalStorage.get('city') : '';
    thisuser.street = (LocalStorage.get('street')) ? LocalStorage.get('street') : '';
    thisuser.password = (LocalStorage.get('password')) ? LocalStorage.get('password') : '';
    thisuser.language = (LocalStorage.get('language') !== 'undefined') ? LocalStorage.get('language') : 'en';
}

function delete_after_logout(LocalStorage){
    LocalStorage.remove('user_id');
    LocalStorage.remove('username');
    LocalStorage.remove('email');
    LocalStorage.remove('gender');
    LocalStorage.remove('phone');
    LocalStorage.remove('country');
    LocalStorage.remove('city');
    LocalStorage.remove('street');
    LocalStorage.remove('password');
    LocalStorage.remove('language');
}
