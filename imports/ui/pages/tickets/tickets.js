import "./tickets.html";
import { Ticket } from "../../../api/ticket/collections";
import { showPopUp } from "../../../startup/both/constants/ErrorHandeler";
import {Flight} from "../../../api/flight/collections";

Template.tickets.onCreated(function () {
  this.autorun(() => {
    this.subscribe("ticketWithFlight");
  });

  this.selectedTicket = new ReactiveVar();
});

Template.tickets.helpers({
  tickets: function () {
    return Ticket.find().fetch();
  },

  getFlight: function (id) {
    return Flight.findOne(id).number;
  },

  selectedTicket: function () {
    return Template.instance().selectedTicket.get();
  },
});

Template.tickets.events({
  "click #openTicketModal ": function (event, template) {
    template.selectedTicket.set({});
  },

  "click .delete-ticket": function (event, template) {
    event.preventDefault();
    const id = this._id;
    Swal.fire({
      title: TAPi18n.__("areusure"),
      showDenyButton: true,
      confirmButtonText: TAPi18n.__("yes"),
      denyButtonText: TAPi18n.__("no"),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Meteor.call("ticket.remove", id, function (err) {
          if (err) {
            showPopUp(err.message);
          } else {
            Swal.fire(TAPi18n.__("success"), "", "success");
          }
        });
      } else if (result.isDenied) {
        Swal.fire(TAPi18n.__("nosuccess"), "", "info");
      }
    });
  },

  "click .edit-ticket": function (event, template) {
    event.preventDefault();
    template.selectedTicket.set(this);
  },
});
