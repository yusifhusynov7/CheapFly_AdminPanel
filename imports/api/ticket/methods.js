import { Ticket } from "./collections";
import { Flight } from "../flight/collections";
import { Planes } from "../plane/collections";

Meteor.methods({
  "ticket.insert": function (data) {
    if (!this.userId) return;
    const fligth = Flight.findOne(data.flightId);
    const plane = Planes.findOne(fligth.planeId);

    // Checking do have enough place for Business trip
    if (data.type === "Business") {
      const tickets = Ticket.find({
        fligthId: data.flightId,
        type: "Business",
      }).fetch();
      const total = tickets.reduce((pre, next) => {
        pre += next.count;
        return pre;
      }, 0);
      if (plane?.businessCapacity < parseInt(data.count) + total)
        throw new Meteor.Error("Business Capacity is full");
    }
    // Checking do have enough place for Econom trip
    else {
      const tickets = Ticket.find({
        fligthId: data.flightId,
        type: "Econom",
      }).fetch();
      const total = tickets.reduce((pre, next) => {
        pre += next.count;
        return pre;
      }, 0);

      if (plane?.ecoCapacity < parseInt(data.count) + total) {
        throw new Meteor.Error("Econom Capacity is full");
      }
    }

    return Ticket.insert(data);
  },

  "ticket.update": function (id, data) {
    if (!this.userId) return;
    return Ticket.update(id, { $set: data });
  },

  "ticket.remove": function (id) {
    if (!this.userId) return;
    const ticket = Ticket.findOne(id);
    if(ticket.soldCount>0){
      throw new Meteor.Error("permissionForTicket")
    }
    return Ticket.remove(id);
  },
});
