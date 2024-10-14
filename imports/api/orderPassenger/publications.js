import { OrderPassenger, PassengerTicket } from "./collections";
import { Passenger } from "../passenger/collections";
import { Order } from "../order/collections";
import { Ticket } from "../ticket/collections";

Meteor.publishComposite(
  "orderPassenger",
  function (query = {}, limit, skip = 0) {
    if (!this.userId) return;
    const user = Meteor.user();
    if (!user?.profile?.isAdmin) {
      return;
    }
    return {
      find: function () {
        return OrderPassenger.find({}, { limit, skip });
      },
      children: [
        {
          find: function (orderPassenger) {
            return Order.find({
              _id: orderPassenger.orderId,
            });
          },
          children: [
            {
              find: function (order) {
                return Ticket.find(
                  { _id: order.ticketId },
                  {
                    fields: {
                      number: 1,
                      price: 1,
                    },
                  }
                );
              },
            },
          ],
        },
        {
          find: function (orderPassenger) {
            return Passenger.find({
              _id: orderPassenger.passengerId,
              passportNumber: {
                $regex: query.passportNumber,
                $options: "i",
              },
            });
          },
        },
      ],
    };
  }
);

Meteor.publish("get.orderPassenger.count", function (query = {}) {
  let count = 0;
  let initializing = true;
  const handleCount = OrderPassenger.find(query).observeChanges({
    added: () => {
      count += 1;
      if (!initializing) {
        console.log("count", count);
        this.changed("orderPassenger_count", Meteor.userId(), {
          count,
        });
      }
    },
    removed: () => {
      count -= 1;

      this.changed("orderPassenger_count", Meteor.userId(), {
        count,
      });
    },
  });
  initializing = false;
  this.added(
    "orderPassenger_count",
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
