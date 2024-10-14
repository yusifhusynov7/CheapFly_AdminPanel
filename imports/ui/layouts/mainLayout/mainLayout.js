import "./mainLayout.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.mainLayout.onCreated(function () {
  if (Meteor.isClient) {
    Meteor.startup(function () {
      var lang = localStorage.getItem("lng") || "az";
      TAPi18n.setLanguage(lang)
        .done(function () {})
        .fail(function (error_message) {
          // Handle the situation
          console.log(error_message);
        });
      localStorage.setItem("lng", lang);
    });
  }
});

Template.mainLayout.helpers({
  checkRole: function (key) {
    if (!key.includes(Meteor.user().profile?.role)) {
      FlowRouter.go("/*");
    }
  },
});
