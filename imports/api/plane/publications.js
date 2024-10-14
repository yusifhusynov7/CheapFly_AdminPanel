import { Planes } from "./collections";


Meteor.publish("planes", function (query = {}) {
  if (!this.userId) return;
  const user = Meteor.user();
  if (!user?.profile?.isAdmin) {
    throw new Meteor.Error("You are not admin");
  }
  if (user?.profile?.role === "adminstrator") {
    query = { ...query, _id: user.profile.planeId };
  }
  return Planes.find(query);
});
