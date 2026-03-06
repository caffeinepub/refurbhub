import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Product Type
  public type Product = {
    id : Nat;
    name : Text;
    brand : Text;
    processor : Text;
    ram : Text;
    storage : Text;
    condition : Text;
    price : Float;
    discountPrice : Float;
    description : Text;
    stock : Nat;
    imageUrl : Text;
    createdAt : Int;
  };

  // Order Types
  public type OrderItem = {
    productId : Nat;
    quantity : Nat;
    price : Float;
  };

  public type Order = {
    id : Nat;
    customerName : Text;
    email : Text;
    address : Text;
    items : [OrderItem];
    total : Float;
    status : Text;
    createdAt : Int;
  };

  // Stable storage
  var productIdCounter : Nat = 1;
  var orderIdCounter : Nat = 1;
  var productsArray : [Product] = [];
  var ordersArray : [Order] = [];
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  let userProfiles = Map.empty<Principal, UserProfile>();

  // --- User Profile Functions ---

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- Product Functions ---

  public shared ({ caller }) func addProduct(
    name : Text,
    brand : Text,
    processor : Text,
    ram : Text,
    storage : Text,
    condition : Text,
    price : Float,
    discountPrice : Float,
    description : Text,
    stock : Nat,
    imageUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let product : Product = {
      id = productIdCounter;
      name;
      brand;
      processor;
      ram;
      storage;
      condition;
      price;
      discountPrice;
      description;
      stock;
      imageUrl;
      createdAt = Time.now();
    };

    productsArray := productsArray.concat([product]);
    productIdCounter += 1;
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    brand : Text,
    processor : Text,
    ram : Text,
    storage : Text,
    condition : Text,
    price : Float,
    discountPrice : Float,
    description : Text,
    stock : Nat,
    imageUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    productsArray := productsArray.map<Product, Product>(
      func(p : Product) : Product {
        if (p.id == id) {
          {
            id;
            name;
            brand;
            processor;
            ram;
            storage;
            condition;
            price;
            discountPrice;
            description;
            stock;
            imageUrl;
            createdAt = p.createdAt;
          };
        } else {
          p;
        };
      },
    );
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    productsArray := productsArray.filter<Product>(func(p : Product) : Bool { p.id != id });
  };

  public query func getProducts() : async [Product] {
    // Public access - anyone can browse products
    productsArray;
  };

  public query func getProduct(id : Nat) : async ?Product {
    // Public access - anyone can view product details
    productsArray.find<Product>(func(p : Product) : Bool { p.id == id });
  };

  // --- Order Functions ---

  public shared ({ caller }) func createOrder(
    customerName : Text,
    email : Text,
    address : Text,
    items : [OrderItem],
    total : Float,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let order : Order = {
      id = orderIdCounter;
      customerName;
      email;
      address;
      items;
      total;
      status = "pending";
      createdAt = Time.now();
    };

    ordersArray := ordersArray.concat([order]);
    orderIdCounter += 1;
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    ordersArray := ordersArray.map<Order, Order>(
      func(o : Order) : Order {
        if (o.id == id) {
          {
            id = o.id;
            customerName = o.customerName;
            email = o.email;
            address = o.address;
            items = o.items;
            total = o.total;
            status;
            createdAt = o.createdAt;
          };
        } else {
          o;
        };
      },
    );
  };

  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    ordersArray;
  };

  public query ({ caller }) func getOrder(id : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    ordersArray.find<Order>(func(o : Order) : Bool { o.id == id });
  };

  // --- Stripe Integration ---

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
