import "./flightModal.html";
import { Airlines } from "../../../api/airlines/collections";
import { countries } from "../../../startup/both/countries";
import { Planes } from "../../../api/plane/collections";
import { showPopUp } from "../../../startup/both/constants/ErrorHandeler";
import { FlightInsertValidator } from "../../../api/flight/collections";
import moment from "moment";

Template.flightModal.onCreated(function () {
  this.selectedCountry = new ReactiveVar();
  this.selectedCountry2 = new ReactiveVar();
  this.selectedAirline = new ReactiveVar({});
  this.show = new ReactiveVar(!Template.currentData().isDeleted);

  this.autorun(() => {
    this.subscribe("planes");
  });

  this.autorun(() => {
    this.subscribe("airlines");
  });

  this.autorun(() => {
    this.show.set(!Template.currentData().isDeleted);
  });
});

Template.flightModal.helpers({
  countries: function () {
    return countries;
  },

  show: function () {
    return Template.instance().show.get();
  },

  departureCountries: function () {
    return countries.filter(
      (country) => country.city !== Template.instance().selectedCountry.get()
    );
  },

  planes: function () {
    return Planes.find({ status: "READY" }).fetch();
  },

  getDepartureAirline: function () {
    return Airlines.find({
      country: Template.instance().selectedCountry2.get(),
    }).fetch();
  },

  getAirlines: function () {
    return Airlines.find({
      country: Template.instance().selectedCountry.get(),
    }).fetch();
  },

  changeDate: function () {
    let collection = Template.currentData()?.selectedFlight;
    let date = moment(collection?.date).format("YYYY-MM-DD");
    let arrivalData = moment(collection?.arrivalDate).format("YYYY-MM-DD");
    let getDate = { date, arrivalData };
    return getDate;
  },

  getPlane() {
    let collection = Template.currentData()?.selectedFlight;
    let planeId = Planes.findOne({ _id: collection?.planeId });
    return planeId.name;
  },

  getGateNumber() {
    const gate = Template.instance().selectedAirline.get()?.gates;
    console.log(gate);
    return gate?.filter((gate) => gate.full === false).map((gate) => gate.name);
  },

  getAirlineName(airlineId) {
    let destinationTo = Airlines.findOne({ _id: airlineId });
    return destinationTo.name;
  },
});

Template.flightModal.events({
  "change #from": function (event, template) {
    const selectedCountry = event.target.value;
    template.selectedCountry.set(selectedCountry);
  },

  "change #to": function (event, template) {
    const selectedCountry2 = document.getElementById("to").value;
    template.selectedCountry2.set(selectedCountry2);
  },

  "focus #destinationFrom": function (event, template) {
    const id = document.getElementById("destinationFrom").value;
    const airline = Airlines.findOne({ _id: id });
    template.selectedAirline.set(airline);
  },

  "change #destinationTo": function (event, template) {
    const id = document.getElementById("destinationTo").value;
    const airline = Airlines.findOne({ _id: id });
    template.selectedAirline2.set(airline);
  },

  "submit #flightAddForm": function (event, template) {
    event.preventDefault();
    const flight = {
      from: event.target.from.value,
      to: event.target.to.value,
      date: event.target.date.value,
      time: event.target.time.value,
      arrivalDate: event.target.arrivalDate.value,
      arrivalTime: event.target.arrivalTime.value,
      planeId: event.target.plane.value,
      destinationFrom: event.target.destinationFrom.value,
      destinationTo: event.target.destinationTo.value,
      status: Template.currentData().selectedFlight?.status ?? "ACTIVE",
      gate: event.target.gateNumber.value,
    };

    // Create two date objects
    const date1 = moment(flight.date, "YYYY-MM-DD").set({
      hour: parseInt(flight.time.split(":")[0]),
      minute: parseInt(flight.time.split(":")[1]),
    });
    const date2 = moment(flight.arrivalDate, "YYYY-MM-DD").set({
      hour: parseInt(flight.arrivalTime.split(":")[0]),
      minute: parseInt(flight.arrivalTime.split(":")[1]),
    });
    const isDate1BeforeDate2 = date1.isBefore(date2);

    console.log(date1, date2);

    if (!isDate1BeforeDate2) {
      showPopUp(`Tarix düzgün qeyd olunmamışdır`);
      return;
    }

    const selectedFlight = Template.currentData().selectedFlight;

    if (Template.currentData()?.isEdit) {
      Meteor.call("flight.update", selectedFlight?._id, flight, (err) => {
        if (err) {
          showPopUp(err.reason);
        }
      });
    } else {
      FlightInsertValidator.reset();
      const data = FlightInsertValidator.clean(flight);
      FlightInsertValidator.validate(data);

      if (!FlightInsertValidator.isValid()) {
        FlightInsertValidator.validationErrors().map((error) => {
          document.getElementById(
            `error-${error.name}`
          ).innerText = `${error.name} is ${error.type}`;
        });
        return;
      }

      Meteor.call("flight.insert", data, function (error, result) {
        if (error) {
          showPopUp();
        }
      });

      if (Template.currentData().isDeleted) {
        // Remove flight
        Meteor.call("flight.remove", selectedFlight?._id, (err) => {
          if (err) {
            showPopUp(err.reason);
          }
        });
      }
    }

    $("#flightModal")?.modal("hide");
    event.target.reset();
  },

  "click #deleteFlight": function (event, template) {
    const type = document.getElementById("deleteType").value;
    if (type === "REFUND") {
      Meteor.call(
        "flight.refund",
        Template.currentData().selectedFlight?._id,
        (err, result) => {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      );
    } else {
      template.show.set(true);
    }
  },
});
