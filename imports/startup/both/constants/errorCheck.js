export const errorCheck = (err) => {
  if (err) {
    throw new Meteor.Error(err);
  }
};
