import { ROLES } from "../../../startup/both/constants/roles";
import "./sidebar.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.sidebar.onCreated(function () {
  let self = this;
  this.path = new ReactiveVar("");

  this.autorun(function () {
    FlowRouter.watchPathChange();
    const path = FlowRouter.current().path;
    self.path.set(path);
  });
});

Template.sidebar.helpers({
  isActive: function (path) {
    console.log(FlowRouter.current().path);
    return path === Template.instance().path.get() ? "active" : "";
  },
  isAdmin: function () {
    const user = Meteor.user();
    return user?.profile.role === ROLES.admin;
  },

  isCurrentLng: function (lng) {
    return lng === localStorage.getItem("lng") ? "selected" : "";
  },
});

Template.sidebar.events({
  "click #logout": function (event, template) {
    Meteor.logout(function (error) {
      if (error) {
        console.log("error", error);
        return;
      }
      FlowRouter.go("/login");
    });
  },

  "change #lng": function (event, tenplate) {
    var lang = $(event.target).val();
    TAPi18n.setLanguage(lang)
      .done(function () {})
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
    localStorage.setItem("lng", lang);
  },
});
