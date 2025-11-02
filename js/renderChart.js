import Highcharts from "./libs/highcharts/esm/highcharts.js";
import { ChartD3 } from "./chartd3.js";
const chartsList = [];
function applyScaleToCharts(baseWidth = 1920, baseMarker = 4, baseLineWidth = 2) {
  // chartsList.forEach((chart) => {
  //   const containerWidth = chart.renderTo.clientWidth; // 👉 lấy width thật của card
  //   const scale = containerWidth / baseWidth; // scale theo card chứ không theo window
  //   console.log(containerWidth,"x")
  //   console.log(scale)
  //   if (chart.series) {
  //     chart.series.forEach((series) => {
  //       if (["line", "pareto", "spline", "pie", "column"].includes(series.type)) {
  //         series.update(
  //           {
  //             marker: { radius: baseMarker * scale },
  //             lineWidth: baseLineWidth * scale,
  //           },
  //           false
  //         );
  //       }
  //     });
  //     chart.reflow(); // đảm bảo kích thước chart đúng với khung card
  //     chart.redraw(false);
  //   }
  // });
}

// ====== Cấu hình chung ======
export const highchartsInit = () => {
  Highcharts.setOptions({
    chart: {
      backgroundColor: "transparent",
      spacing: [10, 5, 5, 5],
    },
    title: null,
    xAxis: {
      gridLineWidth: 1,
      gridLineColor: "#313f62",
      gridLineDashStyle: "Dash",
      lineWidth: 1,
      lineColor: "#313f62",
      lineDashStyle: "ShortDash",
      labels: {
        style: {
          fontSize: "0.75rem",
          fontWeight: "600",
          color: "#7a95c3",
        },
      },
    },
    legend: { enabled: true, itemStyle: { color: "#fff" } },
    yAxis: {
      gridLineWidth: 1,
      gridLineColor: "#313f62",
      gridLineDashStyle: "Dash",
      labels: {
        style: {
          fontSize: "0.75rem",
          fontWeight: "600",
          color: "#7a95c3",
        },
      },
    },

    tooltip: {
      outside: true,
      style: {
        fontSize: "1rem",
      },
    },

    credits: {
      enabled: false,
    },

    plotOptions: {
      column: {
        maxPointWidth: 40,
        borderRadius: 2,
        // pointWidth: 30,
      },
      bar: {
        maxPointWidth: 40,
        pointWidth: 20,
        borderRadius: 10,
      },

      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          style: {
            textOutline: "1px contrast",
            fontWeight: "normal",
            fontSize: "1rem",
          },
        },
        marker: {
          enabled: true,
          radius: 3,
          symbol: "circle", // hoặc 'square', 'triangle', 'diamond'
        },
      },
    },
  });
};

// ====== Render Chart ======
export function renderChart1() {
  Highcharts.chart("chart-1", {
    chart: {
      type: "solidgauge",
      backgroundColor: "transparent",
      events: {
        load() {
          const svg = this.renderer.box;
          const width = this.chartWidth;
          const height = this.chartHeight;
          svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.style.width = "100%";
          svg.style.height = "100%";
        },
      },
    },

    title: { text: null },

    tooltip: { enabled: false },

    pane: {
      startAngle: 0,
      endAngle: 360,
      background: [
        {
          outerRadius: "112%",
          innerRadius: "88%",
          backgroundColor: "rgba(0, 255, 255, 0.2)",
          borderWidth: 0,
        },
        {
          outerRadius: "87%",
          innerRadius: "63%",
          backgroundColor: "rgba(255, 255, 0, 0.2)",
          borderWidth: 0,
        },
      ],
    },

    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: [],
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: true,
          borderWidth: 0,
          format: "{y}%",
          verticalAlign: "middle", // canh dọc center
          y: 0,
          style: {
            fontSize: "1.5rem",
            color: "#fff",
            textOutline: "none",
          },
        },
        linecap: "round",
        rounded: true,
      },
    },

    series: [
      {
        name: "Efficiency",
        data: [{ color: "#00ffff", radius: "112%", innerRadius: "88%", y: 78 }],
      },
      {
        name: "Performance",
        data: [{ color: "#ffff00", radius: "87%", innerRadius: "63%", y: 52 }],
      },
    ],
  });
}

export function renderChart2() {
  ChartD3("#chart-2");
}

export function renderChart3() {
  ChartD3("#chart-3");
}

export function renderChart4() {
  Highcharts.chart("chart-4", {
    chart: {
      type: "spline",
      events: {
        load: function () {
          chartsList.push(this);
          applyScaleToCharts();
        },
      },
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    tooltip: {
      shared: true,
    },
    series: [
      { name: "Dây A", data: [10, 2, 30, 25, 35, 40, 50] },
      { name: "Dây B", data: [5, 15, 29, 20, 30, 35, 45] },
      { name: "Dây C", data: [8, 18, 2, 23, 3, 38, 48] },
      { name: "Dây D", data: [12, 22, 15, 27, 7, 42, 2] },
      { name: "Dây E", data: [7, 17, 27, 22, 32, 66, 4] },
    ],
  });
}

export function renderChart5() {
  if (window.chart5Instance) {
    window.chart5Instance.destroy();
  }

  window.chart5Instance = Highcharts.chart("chart-5", {
    chart: {
      zoomType: "xy",
      backgroundColor: "transparent",
      height: null, // auto height theo container
      width: null, // auto width theo container
      style: {
        fontFamily: "Segoe UI, sans-serif",
      },
    },
    title: { text: null },
    xAxis: {
      categories: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
      crosshair: true,
    },
    yAxis: [
      {
        labels: { format: "{value}" },
        title: { text: null },
      },
      {
        title: { text: null },
        labels: { format: "{value}%" },
        opposite: true,
      },
    ],
    tooltip: { shared: true },
    plotOptions: {
      column: {
        borderRadius: 5,
        maxPointWidth: 20,
        pointWidth: 20,
        grouping: true, // nếu muốn stacked đổi thành false
        events: {
          mouseOver: function () {
            // highlight bar nếu muốn
          },
        },
      },
      series: {
        animation: { duration: 1000 }, // animation khi load
      },
    },
    series: [
      {
        name: "NTF",
        type: "column",
        data: [3, 12, 10, 8, 24, 25, 16, 1, 3, 4, 12, 13, 22, 21, 6, 3, 9, 7, 5, 1, 3, 2, 5, 4],
        color: "#5D3032",
      },
      {
        name: "Failure",
        type: "column",
        data: [2, 8, 5, 4, 20, 22, 10, 0, 2, 3, 10, 11, 18, 17, 5, 2, 8, 6, 4, 0, 2, 1, 3, 3],
        color: "#FF4D4D",
      },
      {
        name: "Failure Rate",
        type: "spline",
        data: [10, 18, 12, 20, 12, 22, 8, 1, 7, 15, 20, 25, 18, 19, 10, 8, 20, 15, 10, 0, 5, 4, 10, 12],
        color: "#FFB84D",
        yAxis: 1,
        marker: { enabled: true, radius: 3 },
      },
    ],
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: {
            plotOptions: { column: { maxPointWidth: 10 } },
            legend: { enabled: false },
          },
        },
      ],
    },
  });

  // Reflow khi window resize để auto scale
  window.addEventListener("resize", () => {
    if (window.chart5Instance) {
      window.chart5Instance.reflow();
    }
  });
}

export function renderChart9() {
  Highcharts.chart("chart-9", {
    chart: {
      type: "line",
      events: {
        load: function () {
          chartsList.push(this);
          applyScaleToCharts();
        },
      },
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    tooltip: {
      shared: true,
    },
    series: [
      { name: "Dây A", color: "#8979FF", data: [10, 2, 30, 25, 35, 40, 50] },
      { name: "Dây B", color: "#537FF1", data: [5, 15, 29, 20, 30, 35, 45] },
      { name: "Dây C", color: "#FFAE4C", data: [8, 18, 2, 23, 3, 38, 48] },
      { name: "Dây D", color: "#3CC3DF", data: [12, 22, 15, 27, 7, 42, 2] },
      { name: "Dây E", color: "#fff", data: [7, 17, 27, 22, 32, 66, 4] },
    ],
  });
}

export function renderChart8() {
  Highcharts.chart("chart-8", {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      events: {
        load: function () {
          chartsList.push(this);
          applyScaleToCharts();
        },
      },
    },
    title: { text: null },
    xAxis: {
      categories: ["Line A", "Line B", "Line C", "Line D", "Line E"],
      lineColor: "#333",
    },
    yAxis: {
      min: 0,
      title: { text: null },
    },
    legend: { itemStyle: { color: "#fff" } },
    tooltip: {
      // backgroundColor: "#1c1f2a",
      // borderColor: "#333",
      // style: { color: "#fff" },
      // formatter: function () {
      //   return `<b>${this.x}</b><br/>${this.series.name}: <b>${this.y}</b>`;
      // },
    },
    plotOptions: {
      column: {
        borderRadius: 10,
        // pointPadding: 0.15,
        // groupPadding: 0.1,
        dataLabels: { enabled: true, color: "#fff" },
      },
    },
    series: [
      {
        name: "Output",
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#38DEDF"],
            [1, "#176E6F"],
          ],
        },
        data: [45, 60, 35, 80, 55],
      },
    ],
  });
}

export function renderChart7() {
  Highcharts.chart("chart-7", {
    chart: {
      type: "bar",
      backgroundColor: "transparent",
      // events: {
      //   load() {
      //     const chart = this;
      //     setTimeout(() => {
      //       const svg = chart.renderer.box;
      //       const width = chart.chartWidth;
      //       const height = chart.chartHeight;

      //       svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      //       svg.removeAttribute("width");
      //       svg.removeAttribute("height");
      //       svg.style.width = "100%";
      //       svg.style.height = "100%";
      //     }, 0);
      //   },
      //   render() {
      //     const chart = this;
      //     const svg = chart.renderer.box;
      //     const width = chart.chartWidth;
      //     const height = chart.chartHeight;

      //     svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      //     svg.removeAttribute("width");
      //     svg.removeAttribute("height");
      //     svg.style.width = "100%";
      //     svg.style.height = "100%";
      //   },
      // },
    },
    title: { text: "" },
    xAxis: { categories: ["U1", "AF", "AP", "AT", "E0"] },
    yAxis: { title: { text: null }, opposite: true },
    legend: { enabled: false },
    plotOptions: {
      bar: { dataLabels: { enabled: false, color: "#fff" } },
    },
    series: [
      {
        name: "Downtime",
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#38DEDF"],
            [1, "#176E6F"],
          ],
        },
        data: [15, 20, 25, 18, 30],
      },
    ],
  });
}

export function renderChart6() {
  Highcharts.chart("chart-6", {
    chart: {
      type: "bar",
      backgroundColor: "transparent",
      events: {
        load: function () {
          chartsList.push(this);
          applyScaleToCharts();

          // 👇 Quan trọng: thêm ResizeObserver cho container riêng của chart
          const container = this.renderTo;
          const observer = new ResizeObserver(() => applyScaleToCharts());
          observer.observe(container);
        },
      },
    },
    title: { text: null },
    xAxis: { categories: ["A/C", "A/B", "A/E", "A/D", "A/F"] },
    yAxis: { title: { text: null }, opposite: true },
    legend: { enabled: false },
    plotOptions: {
      bar: { dataLabels: { enabled: false, color: "#fff" } },
    },
    series: [
      {
        name: "Downtime",
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#FF5D43"],
            [1, "#5A3430"],
          ],
        },
        data: [10, 14, 20, 25, 28],
      },
    ],
  });
}

export function renderChart10() {
  Highcharts.chart("chart-10", {
    chart: { backgroundColor: "transparent" },
    title: { text: null },
    xAxis: {
      categories: ["10/11", "10/12", "10/13", "10/14", "10/15", "10/16", "10/17"],
    },
    yAxis: [
      {
        title: { text: null },
      },
      {
        title: { text: null, style: { color: "#00d2ff" } },
        opposite: true,
      },
    ],
    legend: { itemStyle: { color: "#fff" }, verticalAlign: "top", align: "right", y: -10 },
    tooltip: { shared: true },
    plotOptions: {
      column: { borderRadius: 5, dataLabels: { enabled: true, color: "#fff" } },
      series: { marker: { enabled: true, radius: 4 } },
    },
    series: [
      {
        type: "column",
        name: "Downtime Hours",
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#4992FF"],
            [1, "#2C5899"],
          ],
        },
        data: [8, 9, 6, 10, 5, 7, 8],
      },
      {
        type: "spline",
        name: "Availability rate",
        color: "#00e396",
        yAxis: 1,
        data: [45, 42, 38, 40, 35, 37, 41],
        tooltip: { valueSuffix: "%" },
      },
    ],
  });
}

export function renderChart11() {
  // destroy chart cũ nếu có
  if (window.chart11Instance) {
    window.chart11Instance.destroy();
  }

  window.chart11Instance = Highcharts.chart("chart-11", {
    chart: {
      type: "bar",
      backgroundColor: "transparent",
      height: null, // auto height
      width: null,  // auto width
      events: {
        load() {
          const svg = this.renderer.box;
          const width = this.chartWidth;
          const height = this.chartHeight;
          svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.style.width = "100%";
          svg.style.height = "100%";
        },
      },
    },
    title: { text: null },
    xAxis: {
      categories: ["U1", "AF", "AP", "AT", "E0"],
      title: { text: null },
    },
    yAxis: {
      title: { text: null },
      opposite: true,
    },
    legend: { enabled: false },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0,0,0,0.7)",
      style: { color: "#fff" },
      formatter: function () {
        return `<b>${this.x}</b>: ${this.y}`;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: { enabled: true, color: "#fff" },
        borderRadius: 5,
        animation: { duration: 800 },
        states: {
          hover: { brightness: 0.1 } // highlight hover
        }
      },
      series: { animation: { duration: 800 } }
    },
    series: [
      {
        name: "Downtime",
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#FF5D43"],
            [1, "#5A3430"],
          ],
        },
        data: [15, 20, 25, 18, 30],
      },
    ],
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: {
            plotOptions: { bar: { maxPointWidth: 20 } },
            xAxis: { labels: { style: { fontSize: "10px" } } }
          }
        }
      ]
    }
  });

  // auto reflow khi resize
  window.addEventListener("resize", () => {
    if (window.chart11Instance) window.chart11Instance.reflow();
  });
}


export function renderChart12() {
  Highcharts.chart("chart-12", {
    chart: { type: "bar", backgroundColor: "transparent", spacing: [0, 0, 0, 0] },
    title: { text: null },
    xAxis: { categories: ["A/C", "A/B", "A/E", "A/D", "A/F"] },
    yAxis: { title: { text: null }, opposite: true },
    legend: { enabled: false },
    plotOptions: {
      bar: { dataLabels: { enabled: false, color: "#fff" } },
    },
    series: [
      {
        name: "Downtime",
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#38DEDF"],
            [1, "#176E6F"],
          ],
        },
        data: [10, 14, 20, 25, 28],
      },
    ],
  });
}

export function renderChart13() {
  Highcharts.chart("chart-13", {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: ["AUT", "MT", "IQ", "AFT"],
    },
    yAxis: {
      min: 0,
      title: null,
      stackLabels: {
        enabled: true,
        style: { color: "#fff", textOutline: "none" },
      },
    },
    legend: {
      enabled: false,
      itemStyle: { color: "#fff" },
    },
    tooltip: {
      // headerFormat: "<b>{point.x}</b><br/>",
      // pointFormat: "{series.name}: {point.y}<br/>總計: {point.stackTotal}",
    },
    plotOptions: {
      column: {
        stacking: "normal", // <--- cột chồng
        maxPointWidth: 30,
        borderRadius: 2,
        pointWidth: 30,
        dataLabels: {
          enabled: false,
          color: "#fff",
          style: { textOutline: "none" },
        },
      },
    },
    series: [
      { name: "完成 (Finish)", data: [5, 7, 3, 6], color: "#FF5D43" },
      { name: "進行中 (Process)", data: [2, 3, 4, 2], color: "#FFF" },
      { name: "未開始 (Not Started)", data: [3, 2, 2, 4], color: "#00E2B5" },
    ],
  });
}
