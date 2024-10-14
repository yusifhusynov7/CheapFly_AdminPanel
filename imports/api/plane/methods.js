import { Planes } from "./collections";
import { ROLES } from "../../startup/both/constants/roles";

Meteor.methods({
  "planes.insert": function (data) {
    if (!this.userId) return;

    // if (this.userId) {
    const user = Meteor.users.findOne(this.userId);
    if (user?.profile?.role !== ROLES.admin) {
      throw new Meteor.Error("You are not admin");
    }
    // }
    return Planes.insert(data);
  },
  "planes.update": function (data) {
    if (!this.userId) return;

    // if (this.userId) {
    const user = Meteor.users.findOne(this.userId);
    if (user?.profile?.role !== ROLES.admin) {
      throw new Meteor.Error("You are not admin");
    }
    // }
    return Planes.update(data._id, { $set: data });
  },
  "planes.remove": function (id) {
    if (!this.userId) return;
    const plane = Planes.findOne(id);
    const user = Meteor.users.findOne(this.userId);
    if (plane.status !== "READY") {
      throw new Meteor.Error("Teyyarə halhazırda məşğul olduğu üçün silmək mümkün deyil!");
    }
    if (user?.profile?.role !== ROLES.admin) {
      throw new Meteor.Error("You are not admin");
    }
    return Planes.remove(id);
  },
});
