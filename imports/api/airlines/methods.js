import { Airlines } from "./collections";
import { ROLES } from "../../startup/both/constants/roles";


Meteor.methods({
  "airlines.insert": function (data) {
    if (!this.userId) return;
    if (Meteor.user().profile.role !== ROLES.admin)
      throw new Meteor.Error("not-authorized");
    const airline = Airlines.insert(data);
    return airline;
  },

  "airlines.update": function (id, data) {
    if (!this.userId) return;
    if (Meteor.user().profile.role !== ROLES.admin)
      throw new Meteor.Error("not-authorized");
    return Airlines.update(id, { $set: data });
  },

  "airlines.remove": function (id) {
    if (!this.userId) return;
    if (Meteor.user().profile.role !== ROLES.admin)
      throw new Meteor.Error("not-authorized");
    return Airlines.remove(id);
  },
});
