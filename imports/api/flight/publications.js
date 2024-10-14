import { Flight } from "./collections";

Meteor.publish("flights", function (query = {}, limit, skip = 0) {
  if (!this.userId) return;
  const user = Meteor.user();
  if (!user?.profile?.isAdmin) {
    return;
  }
  let queries = { status: query.status };
  if (query?.number !== null) {
    queries = {
      ...queries,
      number: { $regex: query.number, $options: "i" },
    };
  }

  return Flight.find(queries, { sort: { date: -1 }, limit, skip });
});

Meteor.publish("get.flight.count", function (query = {}) {
  let count = 0;
  let initializing = true;
  const handleCount = Flight.find(query).observeChanges({
    added: () => {
      count += 1;
      if (!initializing) {
        this.changed("flight_count", Meteor.userId(), {
          count,
        });
      }
    },
    removed: () => {
      count -= 1;

      this.changed("flight_count", Meteor.userId(), {
        count,
      });
    },
  });
  initializing = false;
  this.added(
    "flight_count",
    Meteor.userId(),
    {
      count,
    },
    (err, res) => {
      if (err) {
        console.log("error" + err);
      } else {
        console.log("res=" + res);
      }
    }
  );
  this.ready();
  this.onStop(() => handleCount.stop());
});
