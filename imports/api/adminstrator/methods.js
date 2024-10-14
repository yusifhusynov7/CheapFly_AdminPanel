import { Planes } from "../plane/collections";
import { ROLES } from "../../startup/both/constants/roles";

Meteor.methods({
  "adminstrator.insert": function (user) {
    if (!this.userId) return;
    if (Meteor.user().profile.role !== ROLES.admin)
      throw new Meteor.Error("not-authorized");
    const currentUser = Accounts.createUser(user);
    return currentUser;
  },

  "adminstrator.remove": function (userId) {
    if (!this.userId) return;
    if (Meteor.user().profile.role !== ROLES.admin)
      throw new Meteor.Error("not-authorized");
    return Meteor.users.remove(userId);
  },

  "adminstrator.update": function (userId, user) {
    if (!this.userId) return;
    if (Meteor.user().profile.role !== ROLES.admin)
      throw new Meteor.Error("not-authorized");
    return Meteor.users.update(userId, {
      $set: {
        profile: user.profile,
      },
    });
  },
});
