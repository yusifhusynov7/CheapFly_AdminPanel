import { Airlines } from "../../../api/airlines/collections";
import "./planeModal.html";
import { showPopUp } from "../../../startup/both/constants/ErrorHandeler";
import { PlaneInsertValidator } from "../../../api/plane/collections";

Template.planeModal.onCreated(function () {
  this.selectedAirline = new ReactiveVar(null);
});

Template.planeModal.events({

  "submit #planeAddForm": function (event, template) {
    event.preventDefault();
    const plane = {
      name: event.target.name.value,
      pilot: event.target.pilot.value,
      model: event.target.model.value,
      type: event.target.type.value,
      ecoCapacity: event.target.passengerCapacity.value,
      businessCapacity: event.target.businessCapacity.value,
      baggageCapacity: event.target.baggageCapacity.value,
      status: event.target.status?.value,
    };

    if (Template.currentData().selectedPlane?._id) {
      Meteor.call(
        "planes.update",
        { _id: Template.currentData().selectedPlane._id, ...plane },
        (err, res) => {
          if (err) {
            showPopUp();
          }
        }
      );
    } else {
      
      PlaneInsertValidator.reset();
      const data = PlaneInsertValidator.clean(plane);
      PlaneInsertValidator.validate(data);
      if (!PlaneInsertValidator.isValid()) {
        PlaneInsertValidator.validationErrors().map((error) => {
          document.getElementById(
            `error-${error.name}`
          ).innerText = `${error.name} is ${error.type}`;
        });
        return;
      }

      Meteor.call("planes.insert", data, function (err, result) {
        if (err) {
          showPopUp();
        }
      });
    }

    $("#planeModal").modal("hide");

    // clearing the form
    event.target.reset();
  },
});
