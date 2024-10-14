import "./adminstratorModal.html";
import { ROLES } from "../../../startup/both/constants/roles";


Template.adminstratorModal.events({
  "submit #userAddForm": function (event, template) {
    event.preventDefault();
    const user = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      profile: {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        role: ROLES.adminstrator,
        isAdmin: true,
      },
    };
    if (template.data.isEdit) {
      // user update
      Meteor.call(
        "adminstrator.update",
        template.data.selectedUser._id,
        user,
        (err) => {
          if (err) {
            showPopUp();
          }
        }
      );
    } else {
      // user insert
      Meteor.call("adminstrator.insert", user, (err) => {
        if (err) {
          showPopUp();
        }
      });
    }

    // clearing the form
    event.target.reset();

    $("#adminstratorModal").modal("hide");
  },
});
