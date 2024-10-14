import "./ticketModal.html";
import { Flight } from "../../../api/flight/collections";
import { showPopUp } from "../../../startup/both/constants/ErrorHandeler";
import { TicketInsertValidator } from "../../../api/ticket/collections";

Template.ticketModal.onCreated(function () {
  this.autorun(() => {
    this.subscribe("flights");
  });
});

Template.ticketModal.helpers({
  flights: function () {
    return Flight.find().fetch();
  },

  // getTicket () {
  //  return Template.currentData().selectedTicket
  // }
});

Template.ticketModal.events({
  "submit #ticketAddForm ": function (event, template) {
    event.preventDefault();

    const flightId = event.target.flight.value;
    const count = event.target.count.value;
    const price = event.target.ticketPrice.value;
    const type = event.target.ticketType.value;
    const baggagePrice = event.target.baggagePrice.value;

    const ticket = {
      flightId,
      count,
      price,
      type,
      baggagePrice,
    };

    TicketInsertValidator.reset();
    const data = TicketInsertValidator.clean(ticket);
    TicketInsertValidator.validate(data);
    if (!TicketInsertValidator.isValid()) {
      TicketInsertValidator.validationErrors().map((error) => {
        document.getElementById(
          `error-${error.name}`
        ).innerText = `${error.name} is ${error.type}`;
      });
      return;
    }

    if (Template.currentData().selectedTicket?._id) {
      Meteor.call("ticket.update", 
      Template.currentData().selectedTicket._id,
      data, (err) => {
        if (err) {
          showPopUp(err.message);
        }
      });
    } else {
      Meteor.call("ticket.insert", data, (err) => {
        if (err) {
          showPopUp(err.message);
        }
      });
    }
    $("#ticketModal").modal("hide");

    event.target.reset();

  },
});
