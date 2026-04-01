import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Time "mo:core/Time";
import List "mo:core/List";
import BlobStorage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

actor {
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceInCents : Nat;
    image : BlobStorage.ExternalBlob;
  };

  type ShoppingCartItem = {
    productId : Text;
    quantity : Nat;
  };

  type ShoppingCart = List.List<ShoppingCartItem>;

  type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  type StoreOrder = {
    id : Nat;
    user : Principal;
    items : [ShoppingCartItem];
    totalAmountInCents : Nat;
    status : OrderStatus;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
    address : Text;
    email : Text;
  };

  // State
  let products = Map.empty<Text, Product>();
  let carts = Map.empty<Principal, ShoppingCart>();
  let orders = Map.empty<Nat, StoreOrder>();
  var nextOrderId = 1;
  var nextProductId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Product Management (Admin)
  public shared ({ caller }) func addProduct(product : Product) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = "product_" # nextProductId.toText();
    let newProduct = {
      product with
      id;
    };
    products.add(id, newProduct);
    nextProductId += 1;
    id;
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  // User Profile Management
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update or create user profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get user profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (user == caller or AccessControl.isAdmin(accessControlState, caller)) {
      userProfiles.get(user);
    } else {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
  };

  // Shopping Cart
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add products to cart");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let cart = switch (carts.get(caller)) {
          case (null) { List.empty<ShoppingCartItem>() };
          case (?existing) { existing };
        };

        cart.add({ productId; quantity });
        carts.add(caller, cart);
      };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove products from cart");
    };
    switch (carts.get(caller)) {
      case (null) { () };
      case (?cart) {
        let filteredCart = cart.filter(func(item) { item.productId != productId });
        carts.add(caller, filteredCart);
      };
    };
  };

  public query ({ caller }) func getCart() : async [ShoppingCartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  // Order Management
  public shared ({ caller }) func placeOrder() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };
    if (cart.isEmpty()) {
      Runtime.trap("Cart is empty");
    };

    var totalAmount = 0;
    for (item in cart.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found: " # item.productId) };
        case (?product) {
          totalAmount += product.priceInCents * item.quantity;
        };
      };
    };

    let orderId = nextOrderId;
    let newOrder = {
      id = orderId;
      user = caller;
      items = cart.toArray();
      totalAmountInCents = totalAmount;
      status = #pending;
      createdAt = Time.now();
    };
    orders.add(orderId, newOrder);
    nextOrderId += 1;

    carts.remove(caller);
    orderId;
  };

  public query ({ caller }) func getMyOrders() : async [StoreOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their orders");
    };
    orders.values().toArray().filter(func(order) { order.user == caller });
  };

  public query ({ caller }) func getAllOrders() : async [StoreOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can see all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };
};
