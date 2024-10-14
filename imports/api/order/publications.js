import { Order } from "./collections";

Meteor.publish("orders", function () {
  return Order.find();
});

