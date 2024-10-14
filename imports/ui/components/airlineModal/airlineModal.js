import "./airlineModal.html";
import { showPopUp } from "../../../startup/both/constants/ErrorHandeler";
import { countries } from "../../../startup/both/countries";
import { AirlineInsertValidator } from "../../../api/airlines/collections";

Template.airlineModal.helpers({
  countries: function () {
    return countries;
  },
  formatGates: function (gate) {
    // Extract gate names from the array of objects
    const gateNames = gate.map((gate) => gate.name);
    return gateNames.join(",");
  },
});

Template.airlineModal.events = {
  "submit #airlineAddForm": function (event, template) {
    event.preventDefault();
    // Split the input by comma
    const gateNames = event.target.gates.value.split(",");

    // Create the array of objects
    const formattedGates = gateNames.map((name) => ({ name, full: false }));
    const airline = {
      name: event.target.name.value,
      country: event.target.country.value,
      gates: formattedGates,
    };

    if (Template.currentData().selectedAirlines?._id) {
      Meteor.call(
        "airlines.update",
        Template.currentData().selectedAirlines._id,
        airline,
        function (error, result) {
          if (error) {
            showPopUp();
          }
          if (result) {
            $("#airlineModal").modal("hide");
          }
        }
      );
    } else {
      AirlineInsertValidator.reset();
      const data = AirlineInsertValidator.clean(airline);
      AirlineInsertValidator.validate(data);

      if (!AirlineInsertValidator.isValid()) {
        AirlineInsertValidator.validationErrors().map((error) => {
          document.getElementById(
            `error-${error.name}`
          ).innerText = `${error.name} is ${error.type}`;
        });
        return;
      }

      Meteor.call("airlines.insert", data, function (error, result) {
        if (error) {
          showPopUp();
        }
      });

      $("#airlineModal").modal("hide");
      event.target.reset();
    }
  },
};
