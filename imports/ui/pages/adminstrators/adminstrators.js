import "./adminstrators.html";
import { Planes } from "../../../api/plane/collections";
import { ROLES } from "../../../startup/both/constants/roles";
import { showPopUp } from "../../../startup/both/constants/ErrorHandeler";

Template.adminstrators.onCreated(function () {
  this.selectedUser = new ReactiveVar(null);
  this.isEdit = new ReactiveVar(false);
  this.autorun(() => {
    this.subscribe("adminstratorWithPlane");
  });
});

// Helpers get users
Template.adminstrators.helpers({
  users: function () {
    return Meteor.users.find({ "profile.role": ROLES.adminstrator }).fetch();
  },

  getEmail() {
    return this.emails[0].address;
  },

  selectedUser: function () {
    return Template.instance().selectedUser.get();
  },

  isEdit: function () {
    return Template.instance().isEdit.get();
  },
});

Template.adminstrators.events({
  "click .delete-user": function () {
    Swal.fire({
      title: TAPi18n.__("areusure"),
      showDenyButton: true,
      confirmButtonText: TAPi18n.__("yes"),
      denyButtonText: TAPi18n.__("no"),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Meteor.call("adminstrator.remove", this._id, (err) => {
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
