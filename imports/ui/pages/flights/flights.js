import "./flights.html";
import { Flight } from "../../../api/flight/collections";
import { Planes } from "../../../api/plane/collections";
import { Airlines } from "../../../api/airlines/collections";
import moment from "moment/moment";

const ITEMS_PER_PAGE = 1;

Template.flights.onCreated(function () {
  this.searchText = new ReactiveVar("");
  this.searchStatus = new ReactiveVar("ACTIVE");
  this.selectedFlight = new ReactiveVar();

  this.skip = new ReactiveVar(0);
  this.limit = new ReactiveVar(ITEMS_PER_PAGE);

  this.isDeleted = new ReactiveVar(false);
  this.isEdit = new ReactiveVar(false);

  this.autorun(() => {
    this.subscribe("get.flight.count");
  });

  this.autorun(() => {
    this.subscribe(
      "flights",
      {
        number: this.searchText.get(),
        status: this.searchStatus.get(),
      },
      this.limit.get(),
      this.skip.get()
    );
  });
});

Template.flights.helpers({
  flights: function () {
    return Flight.find().fetch();
  },

  isDeleted: function () {
    return Template.instance().isDeleted.get();
  },

  isEdit: function () {
    return Template.instance().isEdit.get();
  },

  isDisabled: function () {
    return this.status !== "ACTIVE";
  },

  dateFormat: function (date) {
    return moment(date).format("DD MMM YYYY");
  },

  selectedFlight: function () {
    return Template.instance().selectedFlight.get();
  },

  getPlaneName: function (planeId) {
    const plane = Planes.findOne(planeId);
    return plane?.name;
  },

  getDestinationFrom: function (airlineId) {
    const airline = Airlines.findOne(airlineId);
    return airline?.name;
  },

  getDestinationTo: function (airlineId) {
    const airline = Airlines.findOne(airlineId);
    return airline?.name;
  },

  isDisabledPre: function () {
    return Template.instance().skip.get() === 0;
  },

  isDisabledNext: function () {
    const count = FlightCount.findOne()?.count;
    return Template.instance().skip.get() + ITEMS_PER_PAGE >= count;
  },
});

Template.flights.events({
  "submit #search": function (event, template) {
    event.preventDefault();
    template.searchText.set(event.target.search.value);
    template.searchStatus.set(event.target.status.value);
  },

  "click .delete-flight": function (event, template) {
    template.isDeleted.set(true);
    template.selectedFlight.set({ _id: this._id });
    template.isEdit.set(false);
  },

  "click #openFlightModal": function (event, template) {
    template.isDeleted.set(false);
    template.isEdit.set(false);
    template.selectedFlight.set({});
  },

  "click .finish-flight": function (event, template) {
    Meteor.call("flight.finish", this._id, (err) => {
      if (err) {
        alert(err);
      }
    });
  },

  "click .edit-flight": function (event, template) {
    template.selectedFlight.set(this);
    template.isDeleted.set(false);
    template.isEdit.set(true);
  },

  "click #next": function (event, template) {
    template.skip.set(template.skip.get() + ITEMS_PER_PAGE);
  },

  "click #pre": function (event, template) {
    template.skip.set(template.skip.get() - ITEMS_PER_PAGE);
  },
});
