import { FlowRouter } from "meteor/ostrio:flow-router-extra";
// Pages
import "../../ui/pages/home/home";
import "../../ui/pages/login/login";
import "../../ui/pages/planes/planes";
import "../../ui/pages/adminstrators/adminstrators";
import "../../ui/pages/flights/flights";
import "../../ui/pages/airlines/airlines";
import "../../ui/pages/tickets/tickets";
import "../../ui/pages/notFound/notFound";
import "../../ui/pages/passengers/passengers";

// Components
import "../../ui/components/sidebar/sidebar";
import "../../ui/components/planeModal/planeModal";
import "../../ui/components/adminstratorModal/adminstratorModal";
import "../../ui/components/flightModal/flightModal";
import "../../ui/components/airlineModal/airlineModal";
import "../../ui/components/ticketModal/ticketModal";

// Layouts
import "../../ui/layouts/mainLayout/mainLayout";

// Triggers
FlowRouter.triggers.enter(
  [
    () => {
      if (!Meteor.userId()) {
        FlowRouter.go("App.login");
      }
    },
  ],
  { except: ["App.login"] }
);

FlowRouter.triggers.enter(
  [
    () => {
      if (Meteor.userId()) {
        FlowRouter.go("/");
      }
    },
  ],
  { only: ["App.login"] }
);

// Home page
FlowRouter.route("/", {
  name: "App.home",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "home",
      key: ["ADMIN", "ADMINSTRATOR"],
    });
  },
});

// Planes page
FlowRouter.route("/planes", {
  name: "App.planes",
  action() {
    BlazeLayout.render("mainLayout", { main: "planes", key: ["ADMIN"] });
  },
});

// Adminstrators page
FlowRouter.route("/adminstrators", {
  name: "App.adminstrators",
  action() {
    BlazeLayout.render("mainLayout", { main: "adminstrators", key: ["ADMIN"] });
  },
});

// Flights page
FlowRouter.route("/flights", {
  name: "App.flights",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "flights",
      key: ["ADMIN", "ADMINSTRATOR"],
    });
  },
});

// Airlines page
FlowRouter.route("/airlines", {
  name: "App.airlines",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "airlines",
      key: ["ADMIN", "ADMINSTRATOR"],
    });
  },
});

// Tickets page
FlowRouter.route("/tickets", {
  name: "App.tickets",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "tickets",
      key: ["ADMIN", "ADMINSTRATOR"],
    });
  },
});

// Passengers
FlowRouter.route("/passengers", {
  name: "App.passengers",
  action() {
    BlazeLayout.render("mainLayout", {
      main: "passengers",
      key: ["ADMIN", "ADMINSTRATOR"],
    });
  },
});

// Login page
FlowRouter.route("/login", {
  name: "App.login",
  action() {
    BlazeLayout.render("login", { main: "login" });
  },
});

// Not Found page
FlowRouter.route("/*", {
  name: "App.notFound",
  action() {
    BlazeLayout.render("mainLayout", { main: "notFound" });
  },
});
