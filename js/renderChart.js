import Highcharts from "./libs/highcharts/esm/highcharts.js";
import{ChartD3}from './chartd3.js'
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
 ChartD3("#chart-2")
}

export function renderChart3()
{
  ChartD3("#chart-3")
}


export function renderChart4()
{
   Highcharts.chart('chart-4', {
      chart: {
        type: 'spline'
      },
      title: {
        text: null
      },
      xAxis: {
        categories: ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','CN']
      },
      yAxis: {
        title: {
          text: null
        }
      },
      tooltip: {
        shared: true
      },
      series: [
        { name: 'Dây A', data: [10, 2, 30, 25, 35, 40, 50] },
        { name: 'Dây B', data: [5, 15, 29, 20, 30, 35, 45] },
        { name: 'Dây C', data: [8, 18, 2, 23, 3, 38, 48] },
        { name: 'Dây D', data: [12, 22, 15, 27, 7, 42, 2] },
        { name: 'Dây E', data: [7, 17, 27, 22, 32, 66, 4] }
      ]
    });
}
export function renderChart5()
{
  Highcharts.chart('chart-5', {
  chart: {
    zoomType: 'xy'
  },
  title: {
    text: null
  },
  xAxis: {
    categories: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00',
                 '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00',
                 '16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
    crosshair: true
  },
  yAxis: [{
    // Trục Y cột
    labels: {
      format: '{value}',
      // style: { color: '#FF0000' }
    },
    title: {
      text: 'Số lượng',
      // style: { color: '#FF0000' }
    }
  },{
    // Trục Y line
    title: {
      text: 'Failure Rate (%)',
      // style: { color: '#FFC107' }
    },
    labels: {
      format: '{value}%',
      // style: { color: '#FFC107' }
    },
    opposite: true
  }],
  tooltip: {
    shared: true
  },
  series: [{
    name: 'NTF',
    type: 'column',
    data: [3,12,10,8,24,25,16,1,3,4,12,13,22,21,6,3,9,7,5,1,3,2,5,4],
    color: '#ff4d504f'
  },{
    name: 'Failure',
    type: 'column',
    data: [2,8,5,4,20,22,10,0,2,3,10,11,18,17,5,2,8,6,4,0,2,1,3,3],
    color: '#ff7231ff'
  },{
    name: 'Failure Rate',
    type: 'spline',
    data: [10,18,12,20,12,22,8,1,7,15,20,25,18,19,10,8,20,15,10,0,5,4,10,12],
    color: '#f8e36bff',
    yAxis: 1,
    marker: {
      enabled: true,
      radius: 3
    }
  }]
});
}
export function renderChart6()
{
  Highcharts.chart('chart-6', {
    chart: {
        type: 'bar' // 'bar' là horizontal, 'column' là vertical
    },
    title: {
        text: 'Horizontal Bar Chart'
    },
    xAxis: {
        categories: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Fruits eaten',
            align: 'high'
        }
    },
    series: [{
        name: 'John',
        data: [5, 3, 4, 7, 2]
    }, {
        name: 'Jane',
        data: [2, 2, 3, 2, 1]
    }]
});
}
