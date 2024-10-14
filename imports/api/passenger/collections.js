import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Passenger = new Mongo.Collection("passenger");

const Schema = {};

Schema.Passenger = new SimpleSchema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  gender: {
    type: String,
    allowedValues: "M" || "F",
  },
  passportNumber: {
    type: String,
  },
  passportCountry: {
    type: String,
  },
  passportExpiredDate: {
    type: Date,
  },
});

Passenger.attachSchema(Schema.Passenger);
