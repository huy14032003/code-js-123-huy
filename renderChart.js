const chartsList = [];
function applyScaleToCharts(baseWidth = 1920, baseMarker = 4, baseLineWidth = 2) {
  const scale = window.innerWidth / baseWidth;

  chartsList.forEach((chart) => {
    if (chart.series) {
      chart.series.forEach((series) => {
        if (series.type === "line" || series.type === "pareto" || series.type === "spline" || series.type === "pie") {
          series.update(
            {
              marker: { radius: baseMarker * scale },
              lineWidth: baseLineWidth * scale,
            },
            false
          );
        }
      });
      chart.redraw(false);
    }
  });
}
function renderCenterText(chart, data, baseWidth = 1920, baseMarker = 4, baseLineWidth = 2) {
  const total = data.reduce((sum, item) => sum + item.total, 0);
  const scale = window.innerWidth / baseWidth;
  if (chart.centerText) chart.centerText.destroy();
  chart.centerText = chart.renderer
    .text(`<b>TOTAL<br>${total}</b>`, chart.plotLeft + chart.plotWidth / 2, chart.plotTop + chart.plotHeight / 2)
    .attr({ align: "center", zIndex: 10 })
    .css({
      color: "#fff",
      fontSize: `${1.5}rem`,
      textAlign: "center",
    })
    .add();
}
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

export function renderChart1(data) {
  Highcharts.chart("chart-1", {
    chart: {
      type: "column",
      events: {
        load: function () {
          chartsList.push(this);
          applyScaleToCharts();
        },
      },
    },
    title: {
      text: data.length ? "" : "NO DATA",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: data.map((item) => item.team),
      crosshair: true,
      labels: {
        // formatter: function () {
        //   const val = String(this.value);
        //   return val.substring(0, 3);
        // },
        style: {
          fontSize: "0.7rem",
        },
      },
    },
    yAxis: [
      {
        // Trục trái (số lượng)
        min: 0,
        title: {
          text: null,
        },
        stackLabels: {
          enabled: false,
        },
      },
      {
        // Trục phải (phần trăm)
        title: {
          text: null,
        },
        labels: {
          format: "{value}%",
        },
        opposite: true,
        max: 100, // để giới hạn theo %
        min: 0,
        tickInterval: 20,
      },
    ],

    tooltip: {
      shared: true,
      // headerFormat: "<b>{point.x}</b><br/>",
    },
    legend: {
      itemStyle: { color: "#fff" },
      align: "right", // 🟢 Căn sang phải
      verticalAlign: "top", // 🟢 Căn giữa theo chiều dọc
      layout: "horizontal", // 🟢 Hiển thị legend theo cột dọc
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
          color: "#fff",
          style: { textOutline: "none" },
        },
      },
      spline: {
        dataLabels: {
          enabled: true,
          style: {
            color: "#fff", // màu trắng
            textOutline: "none", // bỏ viền chữ đen mặc định
          },
        },
      },
    },
    series: [
      {
        name: "線已培訓",
        data: data.map((item) => item.total_line_no_trained),
        color: "#FF5D43",
      },
      {
        name: "線未培訓",
        data: data.map((item) => item.total_line_trained),
        color: "#00E272",
      },

      {
        name: "比率",
        type: "spline",
        yAxis: 1, // dùng trục phải
        color: "#36A5FF",
        data: data.map((item) => Number(((item.total_line_trained / item.total_line) * 100).toFixed(2))), // giá trị phần trăm
        tooltip: {
          valueSuffix: "%",
        },
      },
    ],
  });
}

export function renderChart2(data) {
  Highcharts.chart("chart-2", {
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
    title: {
      text: data.length ? "" : "NO DATA",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: data.map((item) => item.week),
      crosshair: true,
      labels: {
        formatter: function () {
          const val = String(this.value);
          return val.substring(0, 4);
        },
      },
    },
    yAxis: [
      {
        min: 0,
        title: { text: null },
      },
      {
        min: 0,
        max: 10,
        title: { text: null },
        labels: {
          format: "{value}%",
        },
        opposite: true, // 👉 nằm bên phải
      },
    ],
    legend: {
      itemStyle: { color: "#fff" },
    },
    tooltip: {
      shared: true,
      headerFormat: "{point.key}<br/>",
      pointFormat: "{series.name}: <b>{point.y}</b><br/>",
    },
    plotOptions: {
      column: {
        grouping: true, // nhóm cột
        shadow: false,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          color: "#fff",
          style: { textOutline: "none" },
        },
      },
      spline: {
        dataLabels: {
          enabled: true,
          format: "{y}%",
          color: "#fff",
        },
      },
    },
    series: [
      {
        name: "標準完成數",
        color: "#36A5FF", // xanh dương
        data: data.map((item) => item.totalQty),
      },
      {
        name: "實際完成數",
        color: "#00E272", // xanh lá
        data: data.map((item) => item.finishQty),
      },
      {
        name: "超過90天",
        color: "#FF5D43", // đỏ
        data: data.map((item) => item.over90Qty),
      },
      {
        type: "spline",
        yAxis: 1,
        name: "Percent",
        color: "#fff", // đỏ
        data: data.map((item) => item.percentTotal),
        tooltip: { valueSuffix: "%" },
      },
    ],
  });
}

export function renderChart3(data) {
  Highcharts.chart("chart-3", {
    chart: {
      type: "column",
      events: {
        load: function () {
          chartsList.push(this);
          applyScaleToCharts();
        },
      },
    },
    title: {
      text: data.length ? "" : "NO DATA",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: data.map((item) => item.obs_leader),
      crosshair: true,
      accessibility: {
        // description: "Countries",
      },
    },
    yAxis: [
      {
        min: 0,
        title: {
          text: null,
        },
      },
      {
        min: 0,
        title: {
          text: null,
        },
        opposite: true,
        labels: {
          format: "{value}%",
        },
        // tickInterval: 1.0,
      },
    ],
    tooltip: {
      shared: true,
    },
    legend: {
      itemStyle: { color: "#fff" },
      align: "right", // 🟢 Căn sang phải
      verticalAlign: "top", // 🟢 Căn giữa theo chiều dọc
      layout: "horizontal", // 🟢 Hiển thị legend theo cột dọc
      y: 0,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          color: "#CECECE",
          style: { textOutline: "none" },
        },
      },
      line: {
        marker: {
          enabled: true,
        },
      },
      spline: {
        dataLabels: {
          enabled: true,
          style: {
            color: "#CECECE", // màu trắng
            textOutline: "none", // bỏ viền chữ đen mặc định
          },
        },
      },
    },
    series: [
      {
        name: "標準靜黏項數",
        type: "column",
        yAxis: 0,
        color: "#FF5D43",

        data: data.map((item) => item.obs_items_target),
      },
      {
        name: "實際靜黏項數",
        type: "column",
        yAxis: 0,
        color: "#36A5FF",
        data: data.map((item) => item.obs_items_actual),
      },
      {
        name: "結案達成率",
        type: "spline",
        yAxis: 1,
        color: "#FFDE59",
        data: data.map((item) => item.obs_items_rate),
        tooltip: {
          // valueSuffix: " (Trend)",
        },
      },
      {
        name: "項數達成率",
        type: "spline",
        yAxis: 1,
        color: "#fff", // màu cam
        data: data.map((item) => item.approved_rate),
        tooltip: {
          // valueSuffix: " (Trend)",
        },
      },
    ],
  });
}
// page 2
export function renderChart4(data) {
  Highcharts.chart("chart-4", {
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
    title: {
      text: data.length ? "" : "NO DATA",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: data.map((item) => item.team),
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: { text: null },
    },
    legend: {
      itemStyle: { color: "#fff" },
    },
    tooltip: {
      shared: true,
      headerFormat: "{point.key}<br/>",
      pointFormat: "{series.name}: <b>{point.y}</b><br/>",
    },
    plotOptions: {
      column: {
        grouping: true, // nhóm cột
        shadow: false,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          color: "#fff",
          style: { textOutline: "none" },
        },
      },
    },
    series: [
      {
        name: "違紀事件數",
        color: "#36A5FF",
        data: data.map((item) => item.totalViolation),
      },
      {
        name: "違紀人員數",
        color: "#EDC834",
        data: data.map((item) => item.totalViolator),
      },
      // {
      //   name: "Trend (%)",
      //   type: "spline",
      //   color: "#36A5FF",
      //   data: [69, 60, 75, 90], // giá trị phần trăm
      //   tooltip: {
      //     valueSuffix: "%",
      //   },
      // },
    ],
  });
}

export function renderChart5(data) {
  Highcharts.chart("chart-5", {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      events: {
        load: function () {
          chartsList.push(this);
          applyScaleToCharts();
          renderCenterText(this, data);
        },
        redraw: function () {
          renderCenterText(this, data);
        },
      },
    },
    title: {
      text: data.length ? "" : "NO DATA",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    accessibility: {
      point: {
        // valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        size: "100%", // ✅ chiếm toàn bộ không gian
        dataLabels: {
          enabled: false,
          format: "{point.y}",
          style: {
            color: "#fff",
            textOutline: "none",
          },
        },
        showInLegend: true,
        innerSize: "75%",
      },
    },
    legend: {
      itemStyle: { color: "#fff" },
      align: "right", // 🟢 Căn sang phải
      verticalAlign: "middle", // 🟢 Căn giữa theo chiều dọc
      layout: "vertical", // 🟢 Hiển thị legend theo cột dọc
    },
    series: [
      {
        name: "Quantity ",
        colorByPoint: true,
        data: data.map((item) => ({
          name: item.typeError,
          y: item.total,
        })),
      },
    ],
  });
}

export function renderChart6(data) {
  Highcharts.chart("chart-6", {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: data.length ? "" : "NO DATA",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: data.map((item) => item.audit_time),
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: { text: null },
    },
    legend: {
      itemStyle: { color: "#fff" },
    },
    tooltip: {
      shared: true,
      headerFormat: "{point.key}<br/>",
      pointFormat: "{series.name}: <b>{point.y}</b><br/>",
    },
    plotOptions: {
      column: {
        grouping: true, // nhóm cột
        shadow: false,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          color: "#fff",
          style: { textOutline: "none" },
        },
      },
    },
    series: [...new Set(data.flatMap((item) => item.floor))].map((floor) => {
      return {
        name: floor,
        data: data.map((item) => {
          const index = item.floor.indexOf(floor);
          return index !== -1 ? item.finish[index] : 0; // không có thì 0
        }),
      };
    }),
  });
}

export function renderChart7(data, callback) {
  Highcharts.chart("chart-7", {
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
    title: {
      text: data.length ? "" : "NO DATA",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: data.map((item) => item.name),
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: { text: null },
      labels: {
        format: "{value}%", // hiển thị số + %
        // style: { color: "#fff", fontSize: "0.8rem" },
      },
    },
    legend: {
      enabled: false,
      // itemStyle: { color: "#fff" },
    },
    tooltip: {
      shared: true,
      headerFormat: "{point.key}<br/>",
      pointFormat: "{series.name}: {point.y}<br/>",
    },
    plotOptions: {
      column: {
        grouping: true, // nhóm cột
        shadow: false,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          color: "#fff",
          style: { textOutline: "none" },
        },
      },
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: callback,
          },
        },
      },
    },
    series: [
      {
        name: "標準完成數",
        color: "#36A5FF",
        data: data.map((item) => ({
          y: item.percent_complete, // giá trị hiển thị
          id: item.id, // ✅ gắn id vào từng point
          name: item.name || "", // (tuỳ chọn) nếu bạn muốn hiện label
        })),
        tooltip: { valueSuffix: "%" },
      },
    ],
  });
}
export function renderChart8(data,callback) {
  const hasData = (data.categories?.length || 0) > 0 || (data.total?.length || 0) > 0;

  const titleText = hasData ? "" : "NO DATA";

  // 🎨 Gán mỗi cột 1 màu khác nhau
  const colors = ["#36A5FF", "#00C853", "#FFB300", "#FF4C4C", "#8E24AA"]; // thêm nếu có nhiều hơn 5 cột
  const totalColored = data.total.map((value, index) => ({
    y: value,
    color: colors[index % colors.length],
  }));

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
    title: {
      text: titleText,
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: data.categories,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: { text: null },
    },
    legend: { enabled: false }, // chỉ 1 cột, không cần legend
    tooltip: {
      pointFormat: "Total: <b>{point.y}</b><br/>",
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          color: "#fff",
          style: { textOutline: "none" },
        },
      },
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: callback,
          },
        },
      },
    },
    series: [
      {
        name: "Total",
        data: totalColored, // mỗi cột có màu riêng
      },
    ],
  });
}

export function renderChart9(data, callback) {
  Highcharts.chart("chart-9", {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      events: {
        load: function () {
          chartsList.push(this);
          applyScaleToCharts();
          renderCenterText(this, data);
        },
        redraw: function () {
          renderCenterText(this, data);
        },
      },
    },
    title: {
      text: null,
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    accessibility: {
      point: {
        // valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: "pointer",
        size: "100%", // ✅ chiếm toàn bộ không gian
        dataLabels: {
          enabled: false,
          format: "{point.y}",
          style: {
            color: "#fff",
            textOutline: "none",
          },
        },
        showInLegend: true,
        innerSize: "75%",
        point: {
          events: {
            click: callback,
          },
        },
      },
    },
    legend: {
      itemStyle: { color: "#fff" },
      align: "right", // 🟢 Căn sang phải
      verticalAlign: "middle", // 🟢 Căn giữa theo chiều dọc
      layout: "vertical", // 🟢 Hiển thị legend theo cột dọc
    },
    series: [
      {
        name: data.length ? "Total" : "",
        colorByPoint: true,
        data: data.map((item) => ({
          name: item.owner,
          y: item.total,
        })),
      },
    ],
  });
}
export function renderChart10(data, callback) {
  Highcharts.chart("chart-10", {
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
    title: {
      text: data.length ? "" : "NO DATA",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: data.map((item) => item.date),
      crosshair: true,
      labels: {
        // formatter: function () {
        //   const val = String(this.value);
        //   return val.substring(0, 3);
        // },
        style: {
          fontSize: "0.7rem",
        },
      },
    },
    yAxis: {
      min: 0,
      title: { text: null },
      labels: {
        format: "{value}%", // hiển thị số + %
        // style: { color: "#fff", fontSize: "0.8rem" },
      },
    },
    legend: {
      enabled: false,
      // itemStyle: { color: "#fff" },
    },
    tooltip: {
      shared: true,
      headerFormat: "{point.key}<br/>",
      pointFormat: "{series.name}: {point.y}%<br/>",
    },
    plotOptions: {
      column: {
        grouping: true, // nhóm cột
        shadow: false,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          color: "#fff",
          style: { textOutline: "none" },
          format: "{y}%",
        },
      },
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: callback,
          },
        },
      },
      spline: {
        dataLabels: {
          enabled: true,
          format: "{y}%",
          color: "#fff",
        },
      },
    },

    series: [
      {
        type: "spline",
        name: "標準完成數",
        color: "#FF5D43", // xanh dương
        data: data.map((item) => item.pass_rate),
        tooltip: { valueSuffix: "%" },
      },
    ],
  });
}
