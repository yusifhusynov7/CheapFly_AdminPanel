import "./login.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.login.events({
  "submit form": function (event) {
    event.preventDefault();

    var emailVar = event.target.username.value;
    var passwordVar = event.target.password.value;
    console.log(emailVar, passwordVar);
    if (!emailVar || !passwordVar) {
      document.getElementById("error").innerHTML =
        "Zəhmət olmasa, bütün xanaları doldurun!";
      return;
    }
    Meteor.loginWithPassword(emailVar, passwordVar, function (error) {
      if (error) {
        document.getElementById("error").innerHTML =
          "Email və ya şifrə yanlışdır!";
        return;
      }
    });
    FlowRouter.go("App.home");
  },
});
