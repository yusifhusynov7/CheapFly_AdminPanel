export const Ticket = new Mongo.Collection("ticket");
import SimpleSchema from "simpl-schema";

const Schema = {};

Schema.Ticket = new SimpleSchema({
  number: {
    type: String,
    label: "Ticket Number",
    autoValue: function () {
      // generate random unique numbers
      return Math.floor(100000 + Math.random() * 90000).toString();
    },
  },
  flightId: {
    type: String,
    label: "Flight Id",
  },
  count: {
    type: Number,
    label: "Count",
    min: 1,
  },
  soldCount: {
    type: Number,
    label: "Sold Count",
    min: 0,
    defaultValue: 0,
  },
  type: {
    type: String,
    label: "Ticket Type",
  },
  price: {
    type: Number,
    label: "Ticket Price",
  },
  baggagePrice: {
    type: Number,
    label: "Baggage price for a unit",
  },
});

// validation context
export const TicketInsertValidator = Schema.Ticket.namedContext("ticketForm");

Ticket.attachSchema(Schema.Ticket);
