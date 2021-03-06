angular.module('ionic-ecommerce')

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner></ion-spinner>',
  // template: '<ion-spinner class="spinner-positive"></ion-spinner>',
  noBackdrop: false,
})

.constant('CONFIG', {
  // api_login_uri: "http://localhost:3000/api/login.json",
  // api_products_uri: "http://localhost:3000/api/products",
  // image_root: "http://localhost:3000",
  // localStorage_token_key: "ionic-ecommerce-api-key-localhost",

  api_login_uri: "https://ionic-ecommerce.herokuapp.com/api/login.json",
  api_products_uri: "https://ionic-ecommerce.herokuapp.com/api/products",

  // set to server address (ie http://www.servername.com) if image paths are local, else leave blank
  image_root: "",
  localStorage_token_key: "ionic-ecommerce-api-key-heroku",

  timeout: 10, // how many seconds before remote http requests should be considered timed out?
  token_header: "X-Spree-Token",
  tabs: {
    home: "Home",
    products: "Products",
    cart: "Cart",
    account: "Account",
  },
  home: {
    title: "Home",
    welcome: "Welcome to Ionic e-Commerce",
    featured_products: "Featured Products",
    add_to_cart: "Add to Cart",
    added_to_cart: "Product added!",
    view_all_products: "View All Products!",
  },
  products: {
    title: "Products",
  },
  product: {
    title: "Product Detail",
    add_to_cart: "Add to Cart",
    added_to_cart: "Product added!!",
  },
  cart: {
    title: "Cart",
    empty_cart: "Your Cart is Empty!",
    remove_from_cart: "Remove",
    total: "Total",
    checkout: "Checkout",
  },
  account: {
    title: "Account",
    token: "Token:",
    login: "Login",
    logout: "Logout"
  },
  login: {
    title: "Login",
    email: "Email",
    email_placeholder: "Email",
    password: "Password",
    password_placeholder: "Password",
    login_button_text: "Login",
  }

});
