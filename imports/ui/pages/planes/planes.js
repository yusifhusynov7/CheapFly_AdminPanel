import "./planes.html";
import { Planes } from "../../../api/plane/collections";
import { Airlines } from "../../../api/airlines/collections";
import { showPopUp } from "../../../startup/both/constants/ErrorHandeler";

Template.planes.onCreated(function () {
  this.autorun(() => {
    this.subscribe("planes");
  });

  this.selectedPlane = new ReactiveVar(null);
});

// Helpers get Planes
Template.planes.helpers({
  planes: function () {
    return Planes.find().fetch();
  },
  selectedPlane: function () {
    return Template.instance().selectedPlane.get();
  },
});

Template.planes.events({
  "click .delete-plane": function () {
    Swal.fire({
      title: TAPi18n.__("areusure"),
      showDenyButton: true,
      confirmButtonText: TAPi18n.__("yes"),
      denyButtonText: TAPi18n.__("no"),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Meteor.call("planes.remove", this._id, function (err) {
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

  "click .edit-plane": function (event, template) {
    template.selectedPlane.set(this);
  },

  "click #openPlaneModal": function (event, template) {
    template.selectedPlane.set(null);
  },
});
