import { Planes } from "../plane/collections";
import { Flight } from "./collections";
import { Ticket } from "../ticket/collections";
import { Order } from "../order/collections";
import { ROLES } from "../../startup/both/constants/roles";
import { Airlines } from "../airlines/collections";

Meteor.methods({
  "flight.insert": function (data) {
    if (!this.userId) return;

    const user = Meteor.user();
    if (!user?.profile?.isAdmin) {
      throw new Meteor.Error("You are not admin");
    }
    const flight = Flight.insert(data);
    Planes.update({ _id: data.planeId }, { $set: { status: "BUSY" } });

    if (data.gate) {
      Airlines.update(
        {
          _id: data.destinationFrom,
          gates: { $elemMatch: { name: data.gate } },
        },
        { $set: { "gates.$.full": true } }
      );
    }

    return flight;
  },

  "flight.update": function (id, data) {
    if (!this.userId) return;
    const user = Meteor.user();
    if (!user?.profile?.isAdmin) {
      throw new Meteor.Error("You are not admin");
    }
    return Flight.update({ _id: id }, { $set: data }, (err) => {
      console.log(err);
    });
  },

  "flight.finish": function (id) {
    if (!this.userId) return;

    const user = Meteor.user();
    if (!user?.profile?.isAdmin) {
      throw new Meteor.Error("You are not admin");
    }
    const flight = Flight.findOne(id);
    if (flight.status !== "ACTIVE") {
      throw new Meteor.Error("Flight isn't active");
    }

    // Change status
    Flight.update(
      { _id: id },
      {
        $set: {
          status: "FINISHED",
        },
      }
    );

    if (flight.gate) {
      Airlines.update(
        {
          _id: flight.destinationFrom,
          gates: { $elemMatch: { name: flight.gate } },
        },
        { $set: { "gates.$.full": false } }
      );
    }

    Planes.update({ _id: flight.planeId }, { $set: { status: "READY" } });
  },

  "flight.remove": function (id) {
    if (!this.userId) return;

    const user = Meteor.user();
    if (!user?.profile?.isAdmin) {
      throw new Meteor.Error("You are not admin");
    }
    const flight = Flight.findOne(id);
    if (flight.status !== "ACTIVE") {
      throw new Meteor.Error("Flight isn't active");
    }

    // Change status
    Flight.update(
      { _id: id },
      {
        $set: {
          status: "CANCELED",
        },
      }
    );

    if (flight.gate) {
      Airlines.update(
        {
          _id: flight.destinationFrom,
          gates: { $elemMatch: { name: flight.gate } },
        },
        { $set: { "gates.$.full": false } },
        (err) => {
          if (err) {
            throw new Meteor.Error(err);
          }
        }
      );
    }

    Planes.update({ _id: flight.planeId }, { $set: { status: "READY" } });
  },

  "flight.refund": function (id) {
    if (!Meteor.userId()) return;

    const user = Meteor.user();

    if (user?.profile?.role !== ROLES.admin) {
      throw new Meteor.Error("You are not admin");
    }

    const flight = Flight.findOne(id);
    if (flight.status !== "ACTIVE") {
      throw new Meteor.Error("Flight isn't active");
    }

    Planes.update({ _id: flight.planeId }, { $set: { status: "READY" } });

    Flight.update(
      { _id: id },
      {
        $set: {
          status: "REFUNDED",
        },
      }
    );

    let tickets = Ticket.find(
      { flightId: id },
      {
        fields: { _id: 1 },
      }
    ).fetch();

    let orders = Order.find(
      { ticketId: { $in: tickets } },
      { fields: { userId: 1, price: 1 } }
    ).fetch();
    let sum = 0;
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      Meteor.users.update(
        { _id: order.userId },
        { $inc: { "profile.amount": order.price } },
        (err) => {
          if (err) {
            console.log(err);
            throw new Meteor.Error(err);
          }
        }
      );
      sum += order.price || 0;
    }

    Meteor.users.update(
      { _id: user._id },
      { $inc: { "profile.amount": -sum } },
      (err) => {
        if (err) {
          console.log(err);
          throw new Meteor.Error(err);
        }
      }
    );

    return Ticket.update(
      { flightId: id },
      { $set: { soldCount: 0 } },
      { multi: true },
      (err) => {
        if (err) {
          console.log(err);
          throw new Meteor.Error(err);
        }
      }
    );

  },
});
