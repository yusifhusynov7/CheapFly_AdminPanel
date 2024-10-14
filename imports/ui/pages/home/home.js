import "./home.html";
import * as echarts from "echarts";
import { Order } from "../../../api/order/collections";
import moment from "moment";

Template.home.onCreated(function () {
  this.orders = new ReactiveVar([]);

  this.autorun(() => {
    const subscription = this.subscribe('orders');
    if (subscription.ready()) {
      this.orders.set(Order.find().fetch());
    }
  });
});

Template.home.onRendered(function () {
  this.autorun(() => {
    const orders = this.orders.get();

    // Calculate the monthly income
    const monthlyIncome = {};
    orders.forEach((order) => {
      const date = new Date(order.createdDate);
      const month = `${moment(date).format("MMM")}-${moment(date).format("YYYY")}`;
      if (!monthlyIncome[month]) {
        monthlyIncome[month] = 0;
      }
      monthlyIncome[month] += parseInt(order.price);
    });

    var chartDom = document.getElementById("main");
    var myChart = echarts.init(chartDom);

    var option = {
      xAxis: {
        type: "category",
        data: Object.keys(monthlyIncome),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: Object.values(monthlyIncome), 
          type: "line",
        },
      ],
    };

    option && myChart.setOption(option);
  });
});

Template.home.helpers({
  amount: function () {
    return Meteor.user().profile.amount || 0;
  },
});
