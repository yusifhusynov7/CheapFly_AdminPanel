import { Ticket } from "./collections";
import { Flight } from "../flight/collections";

Meteor.publish("tickets", function (query = {}) {
  return Ticket.find(query);
});

Meteor.publishComposite("ticketWithFlight", function (query = {}) {
  return {
    find: function () {
      return Ticket.find();
    },
    children: [
      {
        find: function (ticket) {
          return Flight.find({_id:ticket.flightId});
        },
      },
    ],
  };
});
