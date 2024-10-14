import { Passenger } from "../../../api/passenger/collections";
import { Ticket } from "../../../api/ticket/collections";
import { Order } from "../../../api/order/collections";
import moment from "moment";
import "./passengers.html";
import {
  OrderPassenger,
  OrderPassengerCount,
} from "../../../api/orderPassenger/collections";

const ITEMS_PER_PAGE = 5;

Template.passengers.onCreated(function () {
  this.searchText = new ReactiveVar("");
  this.skip = new ReactiveVar(0);
  this.limit = new ReactiveVar(ITEMS_PER_PAGE);

  this.autorun(() => {
    this.subscribe("get.orderPassenger.count");
  });

  this.autorun(() => {
    this.subscribe(
      "orderPassenger",
      { passportNumber: this.searchText.get() },
      this.limit.get(),
      this.skip.get()
    );
  });
});



Template.passengers.helpers({
  getOrderPassengers: function () {
    return OrderPassenger.find().fetch();
  },

  getPassengers: function (passengerId) {
    return Passenger.findOne({ _id: passengerId });
  },

  formatDate: function (date) {
    return moment(date).format("DD MMM YYYY");
  },

  getTicket: function (orderId) {
    const order = Order.findOne({ _id: orderId });
    console.log(Ticket.findOne({ _id: order.ticketId }))
    return Ticket.findOne({ _id: order.ticketId });
  },

  isDisabled: function () {
    return Template.instance().skip.get() === 0;
  },

  isDisabledNext: function () {
    const count = OrderPassengerCount.findOne()?.count;
    return Template.instance().skip.get() + ITEMS_PER_PAGE >= count;
  }
});

Template.passengers.events({
  "submit #search": function (event, template) {
    event.preventDefault();
    template.searchText.set(event.target.search.value);
  },

  "click #next": function (event, template) {
    template.skip.set(template.skip.get() + ITEMS_PER_PAGE);
  },

  "click #pre": function (event, template) {
    template.skip.set(template.skip.get() - ITEMS_PER_PAGE);
  },
});
