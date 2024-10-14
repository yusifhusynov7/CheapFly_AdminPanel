import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Planes = new Mongo.Collection("planes");

const Schema = {};

Schema.Plane = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 200,
  },
  pilot: {
    type: String,
    label: "Pilot",
  },

  
  model: {
    type: String,
    label: "Model",
  },
  type: {
    type: String,
    label: "Type",
  },

  ecoCapacity: {
    type: Number,
    label: "Economic Capacity",
  },
  businessCapacity: {
    type: Number,
    label: "Business Capacity",
  },

  baggageCapacity: {
    type: Number,
    label: "Baggage Capacity",
  },

  status: {
    type: String,
    label: "Status",
    defaultValue: "READY",
  },
  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function () {
      return new Date();
    },
  },
});

// validation context
export const PlaneInsertValidator = Schema.Plane.namedContext("planeForm");

Planes.attachSchema(Schema.Plane);
