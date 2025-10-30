import Highcharts from './libs/highcharts/esm/highcharts.js';
import DOMPurify from './libs/dompurify/purify.es.js';
import gsap from './libs/gsap/index.js';
import Flip from './libs/gsap/Flip.js';
import Utils from "./Utils.js";

export const MACHINE_STATUS = {
    NO_DATA: 0,
    RUNNING: 1,
    STANDBY: 2,
    FAULT: 3,
    SHUTDOWN: 4,
}

export const MACHINE_STATUS_COLORS = {
    [MACHINE_STATUS.NO_DATA]: '#f8f9fa', // Gray
    [MACHINE_STATUS.RUNNING]: '#32cd32', // Green
    [MACHINE_STATUS.STANDBY]: '#ffc107', // Yellow
    [MACHINE_STATUS.FAULT]: '#ff5d43', //
    [MACHINE_STATUS.SHUTDOWN]: '#6c757d', //
}

export const MACHINE_STATUS_TEXT = {
    [MACHINE_STATUS.NO_DATA]: 'No signal', // Gray
    [MACHINE_STATUS.RUNNING]: 'Running', // Green
    [MACHINE_STATUS.STANDBY]: 'Stopping', // Yellow
    [MACHINE_STATUS.FAULT]: 'Broking', //
    [MACHINE_STATUS.SHUTDOWN]: 'Offline', //
}

export const PICKUP_STATUS = {
    DANGER: 99.7,
    WARNING: 99.8,
    SAFETY: 99.9,
}

export const LANE_ENUM = {
    LEFT: 'A',
    RIGHT: 'B',
}

export const THEME_COLOR = '#fff';

export const TIME_LAPSE = 300;

export const BASE_VW_UNIT = 0.9; //1rem

export const COLOR_PALETTE = {
    solidGauge: {
        outer: 'rgba(56, 222, 223, 0.26)', // Màu xanh dương nhạt
        middle: 'rgba(255, 93, 67, 0.26)', // Màu vàng neon nhạt
        inner: 'rgba(0, 255, 255, 0.1)', // Màu cyan nhạt
        conversion: '#38dedf', // Màu xanh dương đậm
        engagement: '#ff5d43', // Màu vàng neon đậm
        feedback: '#38dedf' // Màu cyan đậm
    },
    bar: {
        positive: '#38dedf', // Màu cyan đậm
        negative: '#ff5d43' // Màu đỏ đậm
    },
    spline: [
        { start: 'rgba(0, 128, 0, 1)', end: 'rgba(0, 128, 0, 1)' },  // Màu xanh lục
        { start: 'rgba(38, 95, 181, 1)', end: 'rgba(38, 95, 181, 1)' }, // Màu xanh dương nhạt
        { start: '#38dedf', end: '#38dedf' }, // Màu xanh lá đậm
        { start: '#ff5d43', end: '#ff5d43' }, // Màu đỏ đậm
        { start: 'rgba(255, 255, 255, 1)', end: 'rgba(255, 255, 255, 1)' }, // Màu xám sáng đến màu trắng
        { start: 'rgba(255, 165, 0, 1)', end: 'rgba(255, 165, 0, 1)' }, // Màu cam
        { start: 'rgba(128, 0, 128, 1)', end: 'rgba(128, 0, 128, 1)' }, // Màu tím
        { start: 'rgba(255, 192, 203, 1)', end: 'rgba(255, 192, 203, 1)' }, // Màu hồng
        { start: 'rgba(0, 255, 0, 1)', end: 'rgba(0, 255, 0, 1)' }, // Màu xanh lá cây
        { start: 'rgba(0, 0, 255, 1)', end: 'rgba(0, 0, 255, 1)' } // Màu xanh dương
    ],
    column: {
        positive: { start: '#38dedf', end: 'rgba(56, 223, 223, 0.05)' }, // Màu xanh lá đậm đến trong suốt
        negative: { start: 'rgba(255, 93, 67, 0.05)', end: '#ff5d43' } // Trong suốt đến màu đỏ đậm
    }
}

const fz1 = '0.6vw',
    fz2 = '0.7vw',
    fz3 = '0.9vw';

export const Z_INDEX_PLOT_LINE = 8;

Highcharts.theme = {
    colors: ['#ff6e76', '#fddd60', '#7cffb2', '#ff8a45', '#4992ff', '#9c27b0'],
    chart: {
        backgroundColor: 'transparent',
        animation: false,
        spacingTop: Utils.vwToPx(1),
        spacingRight: Utils.vwToPx(1),
        spacingBottom: Utils.vwToPx(1),
        spacingLeft: Utils.vwToPx(1),
    },
    title: {
        align: 'left',
        style: {
            color: '#ffffffff',
            fontSize: fz3,
            fontFamily: 'FontXin',
            fontWeight: 'bold',
        }
    },
    subtitle: {
        style: {
            color: '#ffffffff',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif',
        },
    },
    legend: {
        enabled: true,
        itemHoverStyle: {
            color: THEME_COLOR,
        },
        align: 'center',
        verticalAlign: 'bottom',
        borderWidth: 0,
        itemMarginTop: 1,
        itemMarginBottom: 1,
        itemStyle: {
            fontSize: fz2,
            color: THEME_COLOR,
        },
        padding: 3,
        margin: 5,
    },
    yAxis: {
        title: {
            style: {
                color: THEME_COLOR,
            },
        },
        labels: {
            style: {
                color: THEME_COLOR,
            },
            formatter: function () {
                if (typeof this.value === 'number') {
                    return Math.floor(this.value * 100) / 100;
                }
                return this.value;
            },
        },
        gridLineWidth: 0,
        gridLineColor: '#313f62',
        gridLineDashStyle: 'Dash',
    },
    xAxis: {
        title: {
            style: {
                color: THEME_COLOR,
            },
        },
        labels: {
            style: {
                color: THEME_COLOR,
            },
        },
        lineColor: '#313f62',
        gridLineWidth: 0,
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            groupPadding: 0.35,
            pointPadding: 0.1,
            borderRadius: Utils.vwToPx(0.3),
            borderWidth: 0,
            maxPointWidth: 30,
            dataLabels: {
                enabled: true,
                color: '#fff',
                allowOverlap: true,
                inside: false,
                style: {
                    fontSize: fz2,
                    fontWeight: 'normal',
                },
                formatter: function () {
                    if (typeof this.y === 'number') {
                        if (this.y == 0) {
                            return '';
                        }
                        return this.y.toFixed(2);
                    }
                    return this.y;
                },
            },
        },
        line: {
            dataLabels: {
                enabled: true,
                color: '#fff',
                style: {
                    fontSize: fz2,
                    fontWeight: 'normal',
                },
                formatter: function () {
                    if (typeof this.y === 'number') {
                        return Math.floor(this.y * 100) / 100;
                    }
                    return this.y;
                },
            },
        },
        spline: {
            lineWidth: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
            marker: {
                enabled: true,
                radius: Utils.vwToPx(BASE_VW_UNIT / 16 * 4),
                states: {
                    hover: {
                        radiusPlus: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                        lineWidthPlus: Utils.vwToPx(BASE_VW_UNIT / 16),
                    }
                }
            }
        },
        pie: {
            borderWidth: 0,
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: true,
            innerSize: '55%',
            dataLabels: {
                enabled: true,
                distance: -10,
                formatter: function () {
                    if (this.y) {
                        return this.y + '<br />(' + this.percentage.toFixed(1) + '%)';
                    }
                    return '';
                },
                crop: false,
                overflow: 'allow',
                allowOverlap: true,
                style: {
                    color: 'white',
                    textOutline: '1px contrast',
                    fontWeight: '600',
                    fontSize: fz2,
                    textAlign: 'center'
                },
            },
        },
        series: {
            events: {
                click: function (evt) {
                    DashboardSMT.handleClickChart.call(this, evt);
                },
            },
            animation: false,
            dataLabels: {
                enabled: true,
                inside: false,
                style: {
                    color: '#ffffffff',
                    fontWeight: 'bold'
                }
            },
        },
    },
    tooltip: {
        shared: false,
    },
    credits: {
        enabled: false,
    },
};

Highcharts.setOptions(Highcharts.theme);

document.addEventListener('DOMContentLoaded', () => {
    dayjs.extend(dayjs_plugin_duration);
    dayjs.extend(dayjs_plugin_isoWeek);
    window.toast = new toastify.ToastifyManager('bottom-center', {
        closeButton: true,
        withProgressBar: true,
        newestOnTop: true,
        animationType: 'flip'
    });
})

DOMPurify.setConfig({ ALLOWED_TAGS: [] });
gsap.registerPlugin(Flip);

export const COLUMNS_DETAIL = [
        'Factory',
        'Building',
        'Project',
        'Section',
        'Line',
        'Machine',
        'Error Code',
        'Error Desc',
        'Downtime',
        'Start Time',
        'End Time',
        'ME Owner',
        'PD Owner',
        'Root Cause',
        'Corrective Action',
        'Id',
        'Error Id',
    ];

export const SETTING_STORE_KEY = 'machine_ai_store_v1';

export const MIRROR_REDRAW_LAPSE = 10000; //ms

export const SPLIT_KEY = '__split__';

export const FORCE_RECALL_LAST_MESSAGE = crypto.randomUUID();






