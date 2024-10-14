import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Flight = new Mongo.Collection("flight");
export const FlightCount = new Mongo.Collection("flight_count");

const Schema = {};

Schema.Flight = new SimpleSchema({
  number: {
    type: String,
    label: "Flight Number",
    autoValue: function () {
      // generate random unique numbers
      return Math.floor(10000 + Math.random() * 9000).toString();
    },
    optional: true,
  },
  date: {
    type: Date,
    label: "Flight Date",
    min: Date.now(),
  },
  time: {
    type: String,
    label: "Flight Time",
  },
  from: {
    type: String,
    label: "Flight From",
  },
  destinationFrom: {
    type: String,
    label: "Destination From",
  },
  destinationTo: {
    type: String,
    label: "Destination To",
  },
  to: {
    type: String,
    label: "Flight To",
  },
  duration: {
    type: String,
    label: "Flight Duration",
    optional: true,
  },
  arrivalDate: {
    type: Date,
    label: "Arrival Date",
    min: this.date,
  },
  arrivalTime: {
    type: String,
    label: "Arrival Time",
  },
  status: {
    type: String,
    label: "Flight Status",
  },
  planeId: {
    type: String,
    label: "Plane Id",
  },
  gate: {
    type: String,
    label: "Gate Number",
    optional: true,
  },
});

// validation context
export const FlightInsertValidator = Schema.Flight.namedContext("flightForm");

Flight.attachSchema(Schema.Flight);
