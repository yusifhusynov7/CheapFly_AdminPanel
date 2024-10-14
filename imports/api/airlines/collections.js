import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Airlines = new Mongo.Collection("airlines");

const Schema = {};

Schema.Airline = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
  },
  country: {
    type: String,
    label: "Country",
  },
  gates: {
    type: Array,
    label: "Gates",
    optional: true,
  },
  "gates.$": {
    type: Object,
    blackbox: true,
    label: "Gate",
  },
});

// validation context
export const AirlineInsertValidator =
  Schema.Airline.namedContext("airlineForm");

Airlines.attachSchema(Schema.Airline);
