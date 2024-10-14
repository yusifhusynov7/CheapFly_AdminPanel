import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const OrderPassenger = new Mongo.Collection("orderPassenger");
export const OrderPassengerCount = new Mongo.Collection("orderPassenger_count");


const Schema = {};

Schema.OrderPassenger = new SimpleSchema({
  passengerId: {
    type: String,
  },
  orderId: {
    type: String,
  },
});

OrderPassenger.attachSchema(Schema.OrderPassenger);
