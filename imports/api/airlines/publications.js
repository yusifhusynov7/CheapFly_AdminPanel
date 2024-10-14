import { Airlines } from "./collections";
Meteor.publish("airlines", function () {
  if (!this.userId) return;
  const user = Meteor.user();
  if (!user?.profile?.isAdmin) {
    return;
  }
  return Airlines.find();
});
