import "./airlines.html";
import { Airlines } from "../../../api/airlines/collections";

Template.airlines.onCreated(function () {
  this.subscribe("airlines");
  this.selectedAirlines = new ReactiveVar(null);
});

Template.airlines.helpers({
  airlines: function () {
    return Airlines.find().fetch();
  },

  selectedAirlines: function () {
    return Template.instance().selectedAirlines.get();
  },

  formatGates: function (gate) {
    // Extract gate names from the array of objects
    const gateNames = gate.map((gate) => gate.name);
    return gateNames.join(",");
  },
});

Template.airlines.events({
  "click #openFlightModal": function (event, template) {
    template.selectedAirlines.set({});
  },

  "click .edit-airline": function (event, template) {
    template.selectedAirlines.set(this);
  },

  "click .delete-airline": function (event, template) {
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
        Meteor.call("airlines.remove", id, function (error, result) {
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
});
