import Highcharts from "./libs/highcharts/esm/highcharts.js";

const chartsList = [];
function applyScaleToCharts(baseWidth = 1920, baseMarker = 4, baseLineWidth = 2) {
  const scale = window.innerWidth / baseWidth;
  chartsList.forEach((chart) => {
    if (chart.series) {
      chart.series.forEach((series) => {
        if (["line", "pareto", "spline", "pie"].includes(series.type)) {
          series.update({ marker: { radius: baseMarker * scale }, lineWidth: baseLineWidth * scale }, false);
        }
      });
      chart.redraw(false);
    }
  });
}
function drawCenterText(chart) {
  const value = chart.series[0].points[0].y;

  // Xóa text cũ
  if (chart.centerText) chart.centerText.destroy();

  const offsetX = 25;
  const offsetY = 0;
  // Tính vị trí giữa thực tế
  const cx = chart.plotLeft + chart.plotWidth / 2 + offsetX;
  const cy = chart.plotTop + chart.plotHeight / 2 + offsetY;
  // 👆 chỉnh offset nhẹ (0.02 = 2%), có thể đổi thành số px cố định nếu muốn

  // Vẽ text giữa chart
  chart.centerText = chart.renderer
    .text(`${value}%`, cx, cy)
    .attr({
      align: "center",
      zIndex: 10,
    })
    .css({
      color: "#fff",
      fontSize: "1.4rem",
      textOutline: "none",
    })
    .add();

  // Căn giữa chính xác bằng cách điều chỉnh điểm neo
  const bbox = chart.centerText.getBBox();
  chart.centerText.attr({
    x: cx - bbox.width / 2,
    y: cy + bbox.height / 4, // căn chỉnh lại để chữ thật sự giữa vòng
  });
}

// ====== Vẽ chữ giữa chart ======

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
          fontSize: "1rem",
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
          fontSize: "1rem",
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
        load: function () {
          chartsList.push(this);
          applyScaleToCharts();
          drawCenterText(this);
        },
        render: function () {
          drawCenterText(this);
        },
      },
    },

    title: {
      text: null,
    },

    tooltip: {
      enabled: false,
    },

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
          enabled: false,
          borderWidth: 0,
          format: "{y}%",
          style: {
            fontSize: "1.3rem",
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
        data: [
          {
            color: "#00ffff",
            radius: "112%",
            innerRadius: "88%",
            y: 78,
          },
        ],
      },
      {
        name: "Performance",
        data: [
          {
            color: "#ffff00",
            radius: "87%",
            innerRadius: "63%",
            y: 52,
          },
        ],
      },
    ],
  });
}

export function renderChart2() {
  const categories = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const dataA = [50, 6, 7, 42, 33, 67, 20, 50, 10, 150];
  const dataB = [2, 3, 6, 87, 9, 11, 40, 70, 5, 10];

  Highcharts.Templating.helpers.abs = (value) => Math.abs(value);

  const chart = Highcharts.chart("chart-2", {
  chart: {
    type: "bar",
    animation: { duration: 600 },
    backgroundColor: "transparent",
  },
  title: null,

  // 🔹 Ẩn trục X
  xAxis: [
    {
      categories: categories.slice(0, 6),
      visible: false, // <-- Ẩn toàn bộ trục X (gồm label + grid)
    },
    {
      opposite: true,
      linkedTo: 0,
      categories: categories.slice(0, 6),
      visible: false, // <-- Ẩn luôn trục X bên phải
    },
  ],

  // 🔹 Ẩn grid Y
  yAxis: {
    title: { text: null },
    gridLineWidth: 0, // <-- Ẩn đường kẻ ngang
    labels: { enabled: false }, // <-- Ẩn nhãn số trục Y
  },

  plotOptions: {
    series: {
      stacking: "normal",
      borderRadius: 100,
      animation: { duration: 600 },
      dataLabels: {
        enabled: true,
        formatter() {
          return Math.abs(this.y);
        },
        style: { fontWeight: "bold", color: "#fff" },
      },
    },
  },

  series: [
    { name: "Nhóm 1", data: dataA.slice(0, 6).map((v) => -v), color: "#2b908f" },
    { name: "Nhóm 2", data: dataB.slice(0, 6), color: "#90ee7e" },
  ],
});

// --- Auto scroll setup ---
let start = 0;
let scrollInterval;

function scrollChart() {
  start = (start + 1) % (categories.length - 5);
  const cats = categories.slice(start, start + 6);
  chart.xAxis[0].setCategories(cats, false);
  chart.xAxis[1].setCategories(cats, false);

  const newDataA = dataA.slice(start, start + 6).map((v) => -v);
  const newDataB = dataB.slice(start, start + 6);
  chart.series[0].setData(newDataA, false, { duration: 600 });
  chart.series[1].setData(newDataB, true, { duration: 600 });
}

function startScroll() {
  scrollInterval = setInterval(scrollChart, 2000);
}

function stopScroll() {
  clearInterval(scrollInterval);
}

// Bắt đầu cuộn
startScroll();

// --- Dừng khi hover, chạy lại khi rời ---
chart.container.addEventListener("mouseenter", stopScroll);
chart.container.addEventListener("mouseleave", startScroll);

}

// ====== Tự động update khi resize ======
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    applyScaleToCharts();
    chartsList.forEach((chart) => {
      chart.redraw();
      drawCenterText(chart);
    });
  }, 150);
});
