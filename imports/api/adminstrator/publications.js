import { Planes } from "../plane/collections";
import { ROLES } from "../../startup/both/constants/roles";

Meteor.publish("adminstratorWithPlane",function(){
  if (!this.userId) return;
  if (Meteor.user().profile?.role !== ROLES.admin){
    return;
  }
  return Meteor.users.find({ "profile.role": ROLES.adminstrator })
})