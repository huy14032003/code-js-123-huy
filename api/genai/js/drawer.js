import * as T from './types.js'; // eslint-disable-line no-unused-vars
import Utils from "./Utils.js";
import { COLOR_PALETTE, THEME_COLOR, MACHINE_STATUS, COLUMNS_DETAIL, LANE_ENUM, PICKUP_STATUS, MIRROR_REDRAW_LAPSE, BASE_VW_UNIT, Z_INDEX_PLOT_LINE, SPLIT_KEY } from "./config.js";
import Highcharts from './libs/highcharts/esm/highcharts.js';
import './libs/highcharts/esm/modules/solid-gauge.js';
import './libs/highcharts/esm/modules/pareto.js';
import DOMPurify from './libs/dompurify/purify.es.js';
import { marked } from "./libs/marked/marked.esm.js";
import numeral from './libs/numeral/numeral.min.js';
function _drawChart({ state, name, opts }) {
    state[name] && state[name].destroy();
    state[name] = Highcharts.chart(name, opts);
}

const renderer = {
    table(data) {
        return `
    <div class="table-responsive">
      <table class="table table-sm table-dark text-center table-striped">
        <thead class="bg-secondary">
            <tr>
                ${data.header.map(cell => `<td>${cell.text}</td>`).join('')}
            </tr>
        </thead>
        <tbody>${data.rows.map(row =>
            `<tr>
                ${row.map(cell => `<td>${cell.text}</td>`).join('')}
            </tr>`
        ).join('')}</tbody>
      </table>
    </div>
    `;
    },
};

export function drawProgress(steps, currentStepIndex) {
    const target = document.getElementById('agent-interaction-progress');
    const progressStep = document.getElementById('progressStep')
    const progressStepCurrent = document.getElementById('progressStepCurrent')
    if (progressStep && progressStepCurrent) {
        progressStep.innerHTML = steps.map((e, index) => {
            return `
            <div class="d-flex gap-1 align-items-center">
                <svg class="${index == currentStepIndex ? 'text-warning' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE --><g><circle cx="3" cy="12" r="2" fill="currentColor"/><circle cx="21" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="21" r="2" fill="currentColor"/><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="5.64" cy="5.64" r="2" fill="currentColor"/><circle cx="18.36" cy="18.36" r="2" fill="currentColor"/><circle cx="5.64" cy="18.36" r="2" fill="currentColor"/><circle cx="18.36" cy="5.64" r="2" fill="currentColor"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
                <svg class="${index < currentStepIndex ? 'text-success' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m8 12.5l2.5 2.5L16 9"/></g></svg>
                <svg class="${index > currentStepIndex ? 'text-primary' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="round" d="M19 9.62c0 2.58-1.27 4.565-3.202 5.872c-.45.304-.675.456-.786.63c-.11.172-.149.4-.224.854l-.06.353c-.132.798-.199 1.197-.479 1.434s-.684.237-1.493.237h-2.612c-.809 0-1.213 0-1.493-.237s-.346-.636-.48-1.434l-.058-.353c-.076-.453-.113-.68-.223-.852s-.336-.326-.787-.634C5.192 14.183 4 12.199 4 9.62C4 5.413 7.358 2 11.5 2a7.4 7.4 0 0 1 1.5.152"/><path d="m16.5 2l.258.697c.338.914.507 1.371.84 1.704c.334.334.791.503 1.705.841L20 5.5l-.697.258c-.914.338-1.371.507-1.704.84c-.334.334-.503.791-.841 1.705L16.5 9l-.258-.697c-.338-.914-.507-1.371-.84-1.704c-.334-.334-.791-.503-1.705-.841L13 5.5l.697-.258c.914-.338 1.371-.507 1.704-.84c.334-.334.503-.791.841-1.705zm-3 17v1c0 .943 0 1.414-.293 1.707S12.443 22 11.5 22s-1.414 0-1.707-.293S9.5 20.943 9.5 20v-1"/></g></svg>
                ${e}
            </div>
            `
        }).join('');
        progressStepCurrent.innerHTML = `
        <svg class="${steps[currentStepIndex] ? 'text-warning' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE --><g><circle cx="3" cy="12" r="2" fill="currentColor"/><circle cx="21" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="21" r="2" fill="currentColor"/><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="5.64" cy="5.64" r="2" fill="currentColor"/><circle cx="18.36" cy="18.36" r="2" fill="currentColor"/><circle cx="5.64" cy="18.36" r="2" fill="currentColor"/><circle cx="18.36" cy="5.64" r="2" fill="currentColor"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
        <svg class="${steps[currentStepIndex] ? 'd-none' : 'text-success'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m8 12.5l2.5 2.5L16 9"/></g></svg>
        ${steps[currentStepIndex] ?? steps.at(-1)}
        `;
        return;
    }
    target.innerHTML = `
        <div class="d-flex gap-2 justify-content-end pe-4 align-items-center">
            <svg class="cursor-pointer" onclick="DashboardSMT.refreshAgentInteraction()" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.01 2v3.132a.314.314 0 0 1-.556.201A9.98 9.98 0 0 0 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10"/></svg>
            <div class="btn-group dropstart">
            <a id="progressStepCurrent" class="btn btn-sm btn-dark text-light border-0 d-flex align-items-center justify-content-center gap-2 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg class="${steps[currentStepIndex] ? 'text-warning' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE --><g><circle cx="3" cy="12" r="2" fill="currentColor"/><circle cx="21" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="21" r="2" fill="currentColor"/><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="5.64" cy="5.64" r="2" fill="currentColor"/><circle cx="18.36" cy="18.36" r="2" fill="currentColor"/><circle cx="5.64" cy="18.36" r="2" fill="currentColor"/><circle cx="18.36" cy="5.64" r="2" fill="currentColor"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
                <svg class="${steps[currentStepIndex] ? 'd-none' : 'text-success'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m8 12.5l2.5 2.5L16 9"/></g></svg>
                ${steps[currentStepIndex] ?? steps.at(-1)}
            </a>
        <ul class="dropdown-menu">
           <div class="card card-body border-0 p-0 ps-3" style="min-width: 15rem" id="progressStep">
                ${steps.map((e, index) => {
        return `
                        <div class="d-flex gap-1 align-items-center">
                            <svg class="${index == currentStepIndex ? 'text-warning' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE --><g><circle cx="3" cy="12" r="2" fill="currentColor"/><circle cx="21" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="21" r="2" fill="currentColor"/><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="5.64" cy="5.64" r="2" fill="currentColor"/><circle cx="18.36" cy="18.36" r="2" fill="currentColor"/><circle cx="5.64" cy="18.36" r="2" fill="currentColor"/><circle cx="18.36" cy="5.64" r="2" fill="currentColor"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
                            <svg class="${index < currentStepIndex ? 'text-success' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m8 12.5l2.5 2.5L16 9"/></g></svg>
                            <svg class="${index > currentStepIndex ? 'text-primary' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="round" d="M19 9.62c0 2.58-1.27 4.565-3.202 5.872c-.45.304-.675.456-.786.63c-.11.172-.149.4-.224.854l-.06.353c-.132.798-.199 1.197-.479 1.434s-.684.237-1.493.237h-2.612c-.809 0-1.213 0-1.493-.237s-.346-.636-.48-1.434l-.058-.353c-.076-.453-.113-.68-.223-.852s-.336-.326-.787-.634C5.192 14.183 4 12.199 4 9.62C4 5.413 7.358 2 11.5 2a7.4 7.4 0 0 1 1.5.152"/><path d="m16.5 2l.258.697c.338.914.507 1.371.84 1.704c.334.334.791.503 1.705.841L20 5.5l-.697.258c-.914.338-1.371.507-1.704.84c-.334.334-.503.791-.841 1.705L16.5 9l-.258-.697c-.338-.914-.507-1.371-.84-1.704c-.334-.334-.791-.503-1.705-.841L13 5.5l.697-.258c.914-.338 1.371-.507 1.704-.84c.334-.334.503-.791.841-1.705zm-3 17v1c0 .943 0 1.414-.293 1.707S12.443 22 11.5 22s-1.414 0-1.707-.293S9.5 20.943 9.5 20v-1"/></g></svg>
                            ${e}
                        </div>`
    }).join('')}
            </div>
        </ul>
        </div>
        <div class="mai-logo"></div>
        </div>
        `
}

export function drawMarkDown(content) {
    const target = document.getElementById('agent-interaction')
    marked.use({ renderer });
    target.innerHTML = marked.parse(content);
}

/**
 * 
 * @param {string} errorCode 
 */
export function drawStroubleShootingDoc(errorCode) {
    document.getElementById('strouble-shooting-doc').src = `${BASE_URL}js/libs/pdfjs/web/viewer.html?file=${BASE_URL}assets/pdf/document.pdf#search=${errorCode}`
}

/**
 * @param {number} machineStatus 
 * @returns {string} HTML for display machine status.
 */
function _pickMachineStatusDot(machineStatus) {
    switch (machineStatus) {
        case MACHINE_STATUS.NO_DATA: // No data bị đổi thành shutdown, để chuyển về trạng thái cũ bỏ comment bên dưới và comment dòng kế
            // return `<div class="bg-white dot-btn h-3 w-3 rounded-pill  m-auto btn p-0"></div>`;
            return `<div class="bg-secondary dot-btn h-3 w-3 rounded-pill  m-auto btn p-0"></div>`;
        case MACHINE_STATUS.RUNNING:
            return `<div class="bg-success dot-btn h-3 w-3 rounded-pill  m-auto btn p-0"></div>`;
        case MACHINE_STATUS.STANDBY:
            return `<div class="bg-warning dot-btn h-3 w-3 rounded-pill  m-auto btn p-0"></div>`
        case MACHINE_STATUS.FAULT:
            return `<div class="bg-danger dot-btn h-3 w-3 rounded-pill  m-auto btn p-0"></div>`
        case MACHINE_STATUS.SHUTDOWN:
            return `<div class="bg-secondary dot-btn h-3 w-3 rounded-pill  m-auto btn p-0"></div>`
        default:
            return `<div class="bg-white dot-btn h-3 w-3 rounded-pill  m-auto btn p-0"></div>`
    }
}

function _pickMachineStatusText(machineStatus) {
    switch (machineStatus) { // No data bị đổi thành shutdown, để chuyển về trạng thái cũ bỏ comment bên dưới và comment dòng kế
        case MACHINE_STATUS.NO_DATA:
            // return `No Data`;
            return `Off`;
        case MACHINE_STATUS.RUNNING:
            return `Running`;
        case MACHINE_STATUS.STANDBY:
            return `Stop`;
        case MACHINE_STATUS.FAULT:
            return `Error`;
        case MACHINE_STATUS.SHUTDOWN:
            return `Off`;
        default:
            return `No Data`;
    }
}

/**
 * @param {number} pickupRate The rate that pickup is success.
 * @param {string} lineName 
 * @param {string} machineName 
 * @returns {string} HTML for display severity rate.
 */
function _pickPickupStatusDot(pickupRate, lineName, machineName) {
    if (pickupRate <= PICKUP_STATUS.DANGER) {
        return `<div class="bg-danger h-3 w-3 cursor-pointer rounded-pill" onclick="DashboardSMT.changeLineAndMachine('${lineName}', '${machineName}')"></div>`;
    }
    if (PICKUP_STATUS.DANGER < pickupRate && pickupRate < PICKUP_STATUS.SAFETY) {
        return `<div class="bg-warning h-3 w-3 cursor-pointer rounded-pill" onclick="DashboardSMT.changeLineAndMachine('${lineName}', '${machineName}')"></div>`;
    }
    if (pickupRate >= PICKUP_STATUS.SAFETY) {
        return `<div class="bg-success h-3 w-3 cursor-pointer rounded-pill" onclick="DashboardSMT.changeLineAndMachine('${lineName}', '${machineName}')"></div>`;
    }
    return `<div class="bg-white h-3 w-3 cursor-pointer rounded-pill" onclick="DashboardSMT.changeLineAndMachine('${lineName}', '${machineName}')"></div>`
}

export function drawNozzlesPickup(state, data) {
    state.optionsNozzlesPickup = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null
        },
        xAxis: {
            categories: data.map(datum => datum.name),
        },
        yAxis: [{
            title: {
                text: null
            },
            labels: {
                style: {
                    color: THEME_COLOR
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.value);
                }
            },
            gridLineWidth: 0
        }, {
            title: {
                text: null,
            },
            softMax: 100,
            min: 99,
            labels: {
                style: {
                    color: '#00CED1'
                },
                format: '{value}%'
            },
            opposite: true,
            plotLines: [{
                value: 99.9,
                color: 'green',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'OK',
                    align: 'right',
                    style: {
                        color: 'green'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            },
            {
                value: 99.7,
                color: 'red',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'NG',
                    align: 'right',
                    style: {
                        color: 'red'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            }]
        }],
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.category}</b>`;
                this.points.forEach(point => {
                    if (point.series.name === 'Pickup Rate') {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${numeral(point.y).format('0.00') + '%'}</b>`;
                    } else {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${Utils.numberToReadableString(point.y)}</b>`;
                    }
                });
                return s;
            }
        },
        series: [{
            visible: false,
            name: 'Throw count',
            data: data.map(datum => datum.throwCount),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.negative.end],
                    [0.7, COLOR_PALETTE.column.negative.end],
                    [1, COLOR_PALETTE.column.negative.start]
                ]
            },
            yAxis: 0,
            type: 'column',
            pointPlacement: -0.15,
            dataLabels: {
                enabled: true,
                inside: false,
                style: {
                    color: '#007acc',
                    fontWeight: 'bold'
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.y);
                },
            }
        },
        {
            name: 'Pickup rate',
            data: data.map(datum => datum.pickupRate),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.start],
                    [0.7, COLOR_PALETTE.column.positive.start],
                    [1, COLOR_PALETTE.column.positive.end]
                ]
            },
            yAxis: 1,
            type: 'column',
            pointPlacement: 0.15,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return numeral(this.y).format('0.00') + '%';
                },
                style: {
                    color: '#00CED1',
                    fontWeight: 'bold',
                }
            }
        }],
    })
    _drawChart({
        state,
        name: 'chart20',
        opts: state.optionsNozzlesPickup() ?? {}
    });
}
// 
export function drawFeedersPickup(state, data) {
    state.optionsFeedersPickup = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null
        },
        xAxis: {
            categories: data.map(datum => datum.name),
        },
        yAxis: [{
            title: {
                text: null
            },
            labels: {
                style: {
                    color: THEME_COLOR
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.value);
                }
            },
            gridLineWidth: 0
        }, {
            title: {
                text: null,
            },
            softMax: 100,
            min: 99,
            labels: {
                style: {
                    color: '#00CED1'
                },
                format: '{value}%'
            },
            opposite: true,
            plotLines: [{
                value: 99.9,
                color: 'green',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'OK',
                    align: 'right',
                    style: {
                        color: 'green'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            },
            {
                value: 99.7,
                color: 'red',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'NG',
                    align: 'right',
                    style: {
                        color: 'red'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            }]
        }],
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.category}</b>`;
                this.points.forEach(point => {
                    if (point.series.name === 'Pickup Rate') {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${numeral(point.y).format('0.00') + '%'}</b>`;
                    } else {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${Utils.numberToReadableString(point.y)}</b>`;
                    }
                });
                return s;
            }
        },
        series: [{
            visible: false,
            name: 'Throw count',
            data: data.map(datum => datum.throwCount),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.negative.end],
                    [0.7, COLOR_PALETTE.column.negative.end],
                    [1, COLOR_PALETTE.column.negative.start]
                ]
            },
            yAxis: 0,
            type: 'column',
            pointPlacement: -0.15,
            dataLabels: {
                enabled: true,
                inside: false,
                style: {
                    color: '#007acc',
                    fontWeight: 'bold'
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.y);
                },
            }
        },
        {
            name: 'Pickup rate',
            data: data.map(datum => datum.pickupRate),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.start],
                    [0.7, COLOR_PALETTE.column.positive.start],
                    [1, COLOR_PALETTE.column.positive.end]
                ]
            },
            yAxis: 1,
            type: 'column',
            pointPlacement: 0.15,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return numeral(this.y).format('0.00') + '%';
                },
                style: {
                    color: '#00CED1',
                    fontWeight: 'bold',
                }
            }
        }],
    });
    _drawChart({
        state,
        name: 'chart19',
        opts: state.optionsFeedersPickup() ?? {},
    });
}

export function drawMachinesPickup(state, data) {
    state.optionsMachinesPickup = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null
        },
        xAxis: {
            categories: data.map(datum => datum.name),
        },
        yAxis: [{
            title: {
                text: null
            },
            labels: {
                style: {
                    color: THEME_COLOR
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.value);
                }
            },
            gridLineWidth: 0
        },
        {
            title: {
                text: null,
            },
            softMax: 100,
            min: 99,
            labels: {
                style: {
                    color: '#00CED1'
                },
                format: '{value}%'
            },
            opposite: true,
            plotLines: [{
                value: 99.9,
                color: 'green',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'OK',
                    align: 'right',
                    style: {
                        color: 'green'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            },
            {
                value: 99.7,
                color: 'red',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'NG',
                    align: 'right',
                    style: {
                        color: 'red'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            }]
        }],
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.category}</b>`;
                this.points.forEach(point => {
                    if (point.series.name === 'Pickup Rate') {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${numeral(point.y).format('0.00') + '%'}</b>`;
                    } else {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${Utils.numberToReadableString(point.y)}</b>`;
                    }
                });
                return s;
            }
        },
        series: [{
            visible: false,
            name: 'Throw count',
            data: data.map(datum => datum.throwCount),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.negative.end],
                    [0.7, COLOR_PALETTE.column.negative.end],
                    [1, COLOR_PALETTE.column.negative.start]
                ]
            },
            yAxis: 0,
            pointPlacement: -0.15,
            type: 'column',
            dataLabels: {
                enabled: true,
                inside: false,
                style: {
                    color: '#007acc',
                    fontWeight: 'bold'
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.y);
                },
            }
        },
        {
            name: 'Pickup rate',
            data: data.map(datum => datum.pickupRate),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.start],
                    [0.7, COLOR_PALETTE.column.positive.start],
                    [1, COLOR_PALETTE.column.positive.end]
                ]
            },
            yAxis: 1,
            type: 'column',
            pointPlacement: 0.15,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return numeral(this.y).format('0.00') + '%';
                },
                style: {
                    color: '#00CED1',
                    fontWeight: 'bold',
                }
            }
        }],
    });
    _drawChart({
        state,
        name: 'chart18',
        opts: state.optionsMachinesPickup() ?? {},
    });
}

export function drawLinesDownTime(state, data) {
    state.optionsLinesDowntime = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: data.map(datum => datum.name),
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        yAxis: {
            title: {
                text: 'Duration (hours)',
                style: {
                    color: THEME_COLOR
                }
            },
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.key}</b>`;
                this.points.forEach(point => {
                    s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b>`;
                    if (point.series.name === 'Downtime') s += ' hours';
                });
                return s;
            }
        },
        plotOptions: {
            column: {
                pointWidth: Utils.vwToPx(1.8),
                dataLabels: {
                    enabled: true,
                }
            }
        },
        series: [{
            name: 'Downtime',
            data: data.map(datum => Utils.formatNum(Utils.secondsToHours(Number(datum.duration)), {})),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.start],
                    [1, COLOR_PALETTE.column.positive.end]
                ]
            },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y.toFixed(2) + ' h';
                },
            }
        }],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
    });
    let maxItem = { duration: 0 };
    for (let i = 0; i < data.length; i++) {
        if (data[i].duration > (maxItem.duration)) {
            maxItem = data[i];
        }
    }
    if (maxItem.name) {
        state.calcLineName = maxItem.name;
    }
    _drawChart({
        state,
        name: 'chart8',
        opts: state.optionsLinesDowntime() ?? {},
    });
}

export function drawLinesPickup(state, data) {
    state.optionsLinesPickup = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null
        },
        xAxis: {
            categories: data.map(datum => datum.lineName),
        },
        yAxis: [{
            title: {
                text: null
            },
            labels: {
                style: {
                    color: THEME_COLOR
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.value);
                }
            },
            gridLineWidth: 0
        }, {
            title: {
                text: null,
            },
            softMax: 100,
            min: 99,
            labels: {
                style: {
                    color: '#00CED1'
                },
                format: '{value}%'
            },
            opposite: true,
            plotLines: [{
                value: 99.9,
                color: 'green',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'OK',
                    align: 'right',
                    style: {
                        color: 'green'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            },
            {
                value: 99.7,
                color: 'red',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'NG',
                    align: 'right',
                    style: {
                        color: 'red'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            }]
        }],
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.category}</b>`;
                this.points.forEach(point => {
                    if (point.series.name === 'Pickup Rate') {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${numeral(point.y).format('0.00') + '%'}</b>`;
                    } else {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${Utils.numberToReadableString(point.y)}</b>`;
                    }
                });
                return s;
            }
        },
        series: [{
            visible: false,
            name: 'Throw count',
            data: data.map(datum => datum.throwCount),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.negative.end],
                    [0.7, COLOR_PALETTE.column.negative.end],
                    [1, COLOR_PALETTE.column.negative.start]
                ]
            },
            type: 'column',
            yAxis: 0,
            pointPlacement: -0.15,
            dataLabels: {
                enabled: true,
                inside: false,
                style: {
                    color: '#007acc',
                    fontWeight: 'bold'
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.y);
                },
            }
        },
        {
            name: 'Pickup rate',
            data: data.map(datum => datum.pickupRate),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.start],
                    [0.7, COLOR_PALETTE.column.positive.start],
                    [1, COLOR_PALETTE.column.positive.end]
                ]
            },
            pointPlacement: 0.15,
            yAxis: 1,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return numeral(this.y).format('0.00') + '%';
                },
                style: {
                    color: '#00CED1',
                    fontWeight: 'bold',
                }
            }
        }],
    });
    _drawChart({
        state,
        name: 'chart17',
        opts: state.optionsLinesPickup() ?? {},
    });
}

export function drawFailuresRecent(data) {
    const placeHolder = new Array(12).fill({ _isEmpty: true });
    document.querySelector('.container-recently-error').innerHTML = `
        ${placeHolder.map((e, index) => {
        if (data[index]?._isEmpty ?? true) {
            return `<div class="item-recently-error rounded-1 bg-secondary bg-opacity-25"></div>`;
        } else {
            return `
            <div class="item-recently-error rounded-1 ${data[index].isFinish ? 'bg-danger bg-opacity-75' : 'bg-success bg-opacity-25'}">
                <small>#${DOMPurify.sanitize(data[index][COLUMNS_DETAIL[6]])} <br>${DOMPurify.sanitize(data[index]._startHour)} (${DOMPurify.sanitize(data[index][COLUMNS_DETAIL[8]])})</small>
            </div>
            `;
        }
    }).join('')}`
}

/**
 * 
 * @param {Array<Record<any, any>>} data 
 * @param {*} action 
 */
export function drawFailuresDetail(data, action = {}) {
    new Pagination({
        tableId: 'table-failure-detail',
        paginationContainerId: 'table-failure-detail-pagination',
        searchInputId: 'table-failure-detail-searching',
        itemsPerPage: 4,
        data: data,
        noData: `<tr><td colspan="100">No data</td></tr>`,
        rowRenderer: (i, e) => {
            const rootCause = DOMPurify.sanitize(e[COLUMNS_DETAIL[13]]);
            const correctiveAction = DOMPurify.sanitize(e[COLUMNS_DETAIL[14]]);
            return `
                <tr>
                    <td>${i + 1}</td>
                    <td class="d-none">${DOMPurify.sanitize(e[COLUMNS_DETAIL[0]])}</td>
                    <td class="d-none">${DOMPurify.sanitize(e[COLUMNS_DETAIL[1]])}</td>
                    <td class="d-none"${DOMPurify.sanitize(e[COLUMNS_DETAIL[2]])}</td>
                    <td class="d-none">${DOMPurify.sanitize(e[COLUMNS_DETAIL[3]])}</td>
                    <td class="text-info">${DOMPurify.sanitize(e[COLUMNS_DETAIL[4]])}</td>
                    <td class="text-info">${DOMPurify.sanitize(e[COLUMNS_DETAIL[5]])}</td>
                    <td>${DOMPurify.sanitize(e[COLUMNS_DETAIL[6]])}</td>
                    <td>${DOMPurify.sanitize(e[COLUMNS_DETAIL[7]])}</td>
                    <td class="text-danger fw-bold">${DOMPurify.sanitize(e[COLUMNS_DETAIL[8]])}</td>
                    <td>${DOMPurify.sanitize(e[COLUMNS_DETAIL[9]])}</td>
                    <td>${DOMPurify.sanitize(e[COLUMNS_DETAIL[10]])}</td>
                    <td>${DOMPurify.sanitize(e[COLUMNS_DETAIL[11]])}</td>
                    <td><a href="javascript:void(0)" class="text-decoration-underline" onclick="handleShowRootCause(${e[COLUMNS_DETAIL[15]]}, ${e[COLUMNS_DETAIL[16]]}, '${rootCause}', '${correctiveAction}')">${rootCause}</a></td>
                    <td><a href="javascript:void(0)" class="text-decoration-underline" onclick="handleShowRootCause(${e[COLUMNS_DETAIL[15]]}, ${e[COLUMNS_DETAIL[16]]}, '${rootCause}', '${correctiveAction}')">${correctiveAction}</a></td>
                    <td class="d-none">
                        ${action.buttonsDisplay?.includes('troubleShootingCallback') ? `action.buttonsShow <a href="#appMain" class="text-info"  onclick="(${action.troubleShootingCallback()})('${DOMPurify.sanitize(e[COLUMNS_DETAIL[6]])}')">Repair</a>` : ''}
                    </td>
                </tr>`
        }
    });
}

export function drawLinesDowntimeTrend(state, data) {
    const groupDate = Utils.groupBy(data, 'date');
    const groupLine = Utils.groupBy(data, 'lineName');
    const categories = Object.keys(groupDate);
    const lines = Object.keys(groupLine);
    state.optionsLinesDowntimeTrend = () => ({
        chart: {
            type: 'spline',
        },
        title: {
            text: null,
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat('%a<br>%m-%d', new Date(this.value).getTime());
                }
            },
            categories,
        },
        yAxis: {
            title: {
                text: 'Availability (%)',
            },
            gridLineWidth: 0,
        },
        series: lines.map((line, index) => ({
            name: line,
            data: categories.map(date => groupLine[line].find(e => e.date == date)?.availabilityRate ?? 0),
        })),
    });
    _drawChart({
        state,
        name: 'chart6',
        opts: state.optionsLinesDowntimeTrend() ?? {},
    });
}

export function drawDowntimeTrend(state, data) {
    state.optionsDowntimeTrend = () => ({
        chart: {
            type: 'column',
        },
        title: {
            text: null,
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat('%a<br>%m-%d', new Date(this.value).getTime());
                }
            },
            categories: data.map(e => e.date),
        },
        yAxis: [{
            title: {
                text: 'Avaiability (%)',
            },
            softMax: 100,
            labels: {
                format: '{value}%'
            },
            opposite: true
        }, {
            title: {
                text: 'Duration (hours)'
            },
        }],
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.x}</b>`;
                this.points.forEach(point => {
                    s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b>`;
                    if (point.series.name === 'Percentage') s += '%';
                });
                return s;
            }
        },
        series: [{
            name: 'Downtime',
            data: data.map(e => Utils.formatNum(Utils.secondsToHours(Number(e.downtime)), {})),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.negative.end],
                    [0.8, COLOR_PALETTE.column.negative.end],
                    [1, COLOR_PALETTE.column.negative.start]
                ]
            },
            yAxis: 1,
            type: 'column',
            dataLabels: {
                enabled: true,
                inside: false,
            }
        }, {
            name: 'Availability Rate',
            data: data.map(e => e.availabilityRate),
            color: '#00CED1',
            yAxis: 0,
            type: 'spline',
            marker: {
                enabled: true
            },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y.toFixed(2) + '%';
                },
            }
        }],
        legend: {
            enabled: false,
        },
    });
    _drawChart({
        state,
        name: 'chart5',
        opts: state.optionsDowntimeTrend() ?? {},
    });
}

export function drawPickupRateTrend(state, data) {
    state.optionsPickupRateTrend = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null,
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat('%a<br>%m-%d', new Date(this.value).getTime());
                }
            },
            categories: data.map(e => e.date),
        },
        yAxis: [{
            title: {
                text: null,
            },
            softMax: 100,
            labels: {
                style: {
                    color: '#00CED1'
                },
                format: '{value}%'
            },
            opposite: true,
            plotLines: [{
                value: 99.9,
                color: 'green',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'OK',
                    align: 'right',
                    style: {
                        color: 'green'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            },
            {
                value: 99.7,
                color: 'red',
                width: Utils.vwToPx(BASE_VW_UNIT / 16 * 2),
                dashStyle: 'Dash',
                label: {
                    text: 'NG',
                    align: 'right',
                    style: {
                        color: 'red'
                    }
                },
                zIndex: Z_INDEX_PLOT_LINE,
            }]
        }, {
            title: {
                text: null
            },
            labels: {
                style: {
                    color: THEME_COLOR
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.value);
                }
            },
            gridLineWidth: 0
        }],
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${Highcharts.dateFormat('%a %m-%d', new Date(this.category).getTime())}</b>`;
                this.points.forEach(point => {
                    if (point.series.name === 'Pickup Rate') {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${numeral(point.y).format('0.00') + '%'}</b>`;
                    } else {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${Utils.numberToReadableString(point.y)}</b>`;
                    }
                });
                return s;
            }
        },
        series: [{
            visible: false,
            name: 'Throw count',
            data: data.map(e => e.throwCount),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.negative.end],
                    [0.7, COLOR_PALETTE.column.negative.end],
                    [1, COLOR_PALETTE.column.negative.start]
                ]
            },
            yAxis: 1,
            type: 'column',
            dataLabels: {
                enabled: true,
                inside: false,
                style: {
                    color: '#007acc',
                    fontWeight: 'bold'
                },
                formatter: function () {
                    return Utils.numberToReadableString(this.y);
                },
            }
        }, {
            name: 'Pickup Rate',
            data: data.map(e => e.pickupRate),
            color: '#00CED1',
            yAxis: 0,
            type: 'spline',
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return numeral(this.y).format('0.00') + '%';
                },
                style: {
                    color: '#00CED1',
                    fontWeight: 'bold',
                }
            }
        }],
    });
    _drawChart({
        state,
        name: 'chart16',
        opts: state.optionsPickupRateTrend() ?? {},
    });
}

/**
 * @deprecated
 * @param {Object} opts
 * @param {T.State} opts.state
 * @param {T.MirrorChart} opts.drawer
 * @param {Array<any>} opts.data 
 * @param {() => {}} opts.onClick
 * Display 5 items at one time
 */
export function drawLinesFailure({ data, state, drawer, onClick }) {
    data = data.map((line, index) => ({ ...line, name: line.name + `(#${index + 1})` }))
    state.idIntervalLineFailure && clearInterval(state.idIntervalLineFailure)
    let idx = 0;
    drawer.dataMirrorChartLine = data.slice(idx, idx + 5);
    drawer.mirrorChartLine.updateChart(drawer.dataMirrorChartLine, onClick);
    idx++;
    state.idIntervalLineFailure = setInterval(() => {
        if (drawer.mirrorChartLine.state.isHovering) {
            return;
        }
        if (drawer?.mirrorChartLine?.dom?.closest('.cardItem')?.classList?.contains('d-none')) {
            return;
        }
        if (idx >= data.length - 5) idx = 0;
        drawer.dataMirrorChartLine = data.slice(idx, idx + 5);
        drawer.mirrorChartLine.updateChart(drawer.dataMirrorChartLine, onClick);
        idx++;
    }, MIRROR_REDRAW_LAPSE);
}

/**
 * @param {Object} opts
 * @param {T.State} opts.state
 * @param {T.MirrorChart} opts.drawer
 * @param {Array<any>} opts.data 
 * @param {() => {}} opts.onClick
 * Display 5 items at one time
 */
export function drawLinesFailureColumn({ data, state, drawer, onClick }) {
    data = data.slice(0, 5);
    const opts = {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null
        },
        xAxis: {
            categories: data.map(datum => datum.name),
            labels: {
                style: {
                    fontSize: Utils.vwToPx(0.6) + 'px',
                }
            }
        },
        yAxis: [{
            title: {
                text: null,
            },
            gridLineWidth: 0
        }, {
            title: {
                text: null,
            },
            opposite: true,
            gridLineWidth: 0
        }],
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.category}</b>`;
                this.points.forEach(point => {
                    if (point.series.name === 'Pickup Rate') {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${numeral(point.y).format('0.00') + '%'}</b>`;
                    } else {
                        s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${Utils.numberToReadableString(point.y)}</b>`;
                    }
                });
                return s;
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Count',
            data: data.map(datum => datum.count),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.negative.end],
                    [0.7, COLOR_PALETTE.column.negative.end],
                    [1, COLOR_PALETTE.column.negative.start]
                ]
            },
            type: 'column',
            yAxis: 0,
            pointPlacement: -0.15,
            dataLabels: {
                enabled: false,
                inside: false,
                formatter: function () {
                    return Utils.numberToReadableString(this.y);
                },
            }
        },
        {
            name: 'Duration',
            data: data.map(datum => datum.duration),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.start],
                    [0.7, COLOR_PALETTE.column.positive.start],
                    [1, COLOR_PALETTE.column.positive.end]
                ]
            },
            pointPlacement: 0.15,
            yAxis: 1,
        }],
    }

    _drawChart({
        state,
        name: 'chart2Column',
        opts,
    });
}

/**
 * @deprecated
 * @param {Object} opts
 * @param {T.State} opts.state
 * @param {T.MirrorChart} opts.drawer
 * @param {Array<any>} opts.data 
 * @param {() => {}} opts.onClick
 * Display 5 items at one time
 */
export function drawErrorsFailure({ data, state, drawer, onClick }) {
    data = data.map((error, index) => ({ ...error, name: error.name + `(#${index + 1})` }))
    state.idIntervalErrorsFailure && clearInterval(state.idIntervalErrorsFailure)
    let idx = 0;
    drawer.dataMirrorChartError = data.slice(idx, idx + 5);
    drawer.mirrorChartError.updateChart(drawer.dataMirrorChartError, onClick);
    idx++;
    state.idIntervalErrorsFailure = setInterval(() => {
        if (drawer.mirrorChartError.state.isHovering) {
            return;
        }
        if (drawer?.mirrorChartError?.dom?.closest('.cardItem')?.classList?.contains('d-none')) {
            return;
        }
        if (idx >= data.length - 5) idx = 0;
        drawer.dataMirrorChartError = data.slice(idx, idx + 5);
        drawer.mirrorChartError.updateChart(drawer.dataMirrorChartError, onClick);
        idx++;
    }, MIRROR_REDRAW_LAPSE);
}

/**
 * @param {Object} opts
 * @param {T.State} opts.state
 * @param {T.MirrorChart} opts.drawer
 * @param {Array<any>} opts.data 
 * @param {() => {}} opts.onClick
 * Display 5 items at one time
 */
export function drawErrorsFailurePareto({ data, state, drawer, onClick }) {
    data = data.slice(0, 5);
    const opts = {
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        tooltip: {
            shared: true
        },
        xAxis: {
            categories: data.map(datum => datum.name),
            crosshair: true,
            labels: {
                style: {
                    fontSize: Utils.vwToPx(0.6) + 'px',
                }
            }
        },
        yAxis: [{
            title: {
                text: ''
            }
        }, {
            title: {
                text: ''
            },
            max: 100,
            min: 0,
            opposite: true,
            labels: {
                format: '{value}%'
            }
        }],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'pareto',
            name: 'Pareto',
            yAxis: 1,
            zIndex: 10,
            baseSeries: 1,
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                valueDecimals: 2,
                valueSuffix: '%'
            }
        }, {
            name: 'Downtime',
            type: 'column',
            zIndex: 2,
            color: '#38dedf',
            data: data.map(datum => datum.duration),
        }]
    };
    _drawChart({
        state,
        name: 'chart4Pareto',
        opts,
    });
}

/**
 * @param {Object} opts
 * @param {T.State} opts.state
 * @param {T.MirrorChart} opts.drawer
 * @param {Array<any>} opts.data 
 * @param {() => {}} opts.onClick
 * Display 5 items at one time
 */
export function drawMachinesFailure({ data, state, drawer, onClick }) {
    data = data.map((machine, index) => ({ ...machine, name: machine.name + `(#${index + 1})` }))
    state.idIntervalMachineFailure && clearInterval(state.idIntervalMachineFailure)
    let idx = 0;
    drawer.dataMirrorChartMachine = data.slice(idx, idx + 5);
    drawer.mirrorChartMachine.updateChart(drawer.dataMirrorChartMachine, onClick);
    idx++;
    state.idIntervalMachineFailure = setInterval(() => {
        if (drawer.mirrorChartMachine.state.isHovering) {
            return;
        }
        if (drawer?.mirrorChartMachine?.dom?.closest('.cardItem')?.classList?.contains('d-none')) {
            return;
        }
        if (idx >= data.length - 5) idx = 0;
        drawer.dataMirrorChartMachine = data.slice(idx, idx + 5);
        drawer.mirrorChartMachine.updateChart(drawer.dataMirrorChartMachine, onClick);
        idx++;
    }, MIRROR_REDRAW_LAPSE);
}

export function drawMachineHoursDownTime(state, data) {
    state.optionsMachineHoursDowntime = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: data.map(datum => datum.name),
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        yAxis: {
            title: {
                text: 'Duration (hours)',
                style: {
                    color: THEME_COLOR
                }
            },
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.key}</b>`;
                this.points.forEach(point => {
                    s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b>`;
                    if (point.series.name === 'Downtime') s += ' hours';
                });
                return s;
            }
        },
        plotOptions: {
            column: {
                pointWidth: Utils.vwToPx(1.8),
                dataLabels: {
                    enabled: true,
                }
            }
        },
        series: [{
            name: 'Downtime',
            data: data.map(datum => datum.duration),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.start],
                    [1, COLOR_PALETTE.column.positive.end]
                ]
            },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y.toFixed(2) + ' h';
                },
            }
        }],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
    });
    _drawChart({
        state,
        name: 'chart13',
        opts: state.optionsMachineHoursDowntime() ?? {},
    });
}

export function drawLineHoursDownTime(state, data) {
    state.optionsLineHoursDowntime = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: data.map(datum => datum.name),
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        yAxis: {
            title: {
                text: 'Duration (hours)',
                style: {
                    color: THEME_COLOR
                }
            },
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.key}</b>`;
                this.points.forEach(point => {
                    s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b>`;
                    if (point.series.name === 'Downtime') s += ' hours';
                });
                return s;
            }
        },
        plotOptions: {
            column: {
                pointWidth: Utils.vwToPx(1.8),
                dataLabels: {
                    enabled: true,
                }
            }
        },
        series: [{
            name: 'Duration',
            data: data.map(datum => datum.duration),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.start],
                    [1, COLOR_PALETTE.column.positive.end]
                ]
            },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y.toFixed(2) + ' h';
                },
            }
        }],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
    });
    _drawChart({
        state,
        name: 'chart9',
        opts: state.optionsLineHoursDowntime() ?? {},
    });
}

export function drawMachinesDownTime(state, data) {
    state.optionsMachinesDowntime = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: data.map(datum => datum.name),
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        yAxis: {
            title: {
                text: 'Duration (hours)',
                style: {
                    color: THEME_COLOR
                }
            },
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        tooltip: {
            shared: true,
            formatter: function () {
                let s = `<b>${this.key}</b>`;
                this.points.forEach(point => {
                    s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b>`;
                    if (point.series.name === 'Downtime') s += ' hours';
                });
                return s;
            }
        },
        plotOptions: {
            column: {
                maxPointWidth: Utils.vwToPx(1.8),
                dataLabels: {
                    enabled: true,
                }
            }
        },
        series: [{
            name: 'Downtime',
            data: data.map(datum => datum.duration),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.start],
                    [1, COLOR_PALETTE.column.positive.end]
                ]
            },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y.toFixed(2) + ' h';
                },
            }
        }],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
    });
    let maxItem = { duration: 0 };
    for (let i = 0; i < data.length; i++) {
        if (data[i].duration > (maxItem.duration)) {
            maxItem = data[i];
        }
    }
    if (maxItem.name) {
        state.calcMachine = maxItem.name;
    }
    _drawChart({
        state,
        name: 'chart12',
        opts: state.optionsMachinesDowntime() ?? {},
    });
}

export function drawDowntime({
    data,
    state,
    downtimeRateElement,
    availabilityRateElement,
    workDateDisplayDateElement,
    workDateDisplayDayElement,
}) {
    const [totalTime, downtime] = data;
    const availabilityRate = totalTime ? Utils.formatNum(((totalTime - downtime) / totalTime) * 100, {}) : 100;
    const downTimeRate = Utils.formatNum(100 - availabilityRate, {});

    downtimeRateElement.innerText = downTimeRate + ' %';
    availabilityRateElement.innerText = availabilityRate + ' %';

    function alignLabel() {
        const chart = this;
        if (state.grossLabelDonwtime) {
            state.grossLabelDonwtime.destroy();
        }
        setTimeout(() => {
            state.grossLabelDonwtime = chart.renderer.text(availabilityRate.toFixed(2) + '%', chart.plotWidth / 2, chart.plotHeight / 2)
                .css({
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    transform: 'translate(-1.5rem, 0.5rem)',
                }).add();
        }, 1000)
    }



    state.optionsDowntime = () => ({
        chart: {
            type: 'solidgauge',
            margin: [0, 0, 0, 0],
            events: {
                load: alignLabel,
                redraw: alignLabel,
            },
            backgroundColor: 'transparent',
        },
        title: {
            text: null
        },
        tooltip: {
            enabled: false
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
                outerRadius: '100%',
                innerRadius: '88%',
                borderWidth: 0,
                backgroundColor: COLOR_PALETTE.solidGauge.outer
            }, {
                outerRadius: '80%',
                innerRadius: '68%',
                borderWidth: 0,
                backgroundColor: COLOR_PALETTE.solidGauge.middle
            },
            ]
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: [],
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: false
                },
                linecap: 'round',
                stickyTracking: false,
                rounded: true
            }
        },
        series: [{
            name: 'Avaiability',
            data: [{
                color: COLOR_PALETTE.solidGauge.conversion,
                radius: '100%',
                innerRadius: '88%',
                y: availabilityRate
            }],
            dataLabels: {
                style: {
                    color: THEME_COLOR
                }
            }
        }, {
            name: 'Downtime',
            data: [{
                color: COLOR_PALETTE.solidGauge.engagement,
                radius: '80%',
                innerRadius: '68%',
                y: downTimeRate
            }],
            dataLabels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        ],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
    });
    _drawChart({
        state,
        name: 'chart1',
        opts: state.optionsDowntime() ?? {},
    });
    workDateDisplayDateElement.innerText = dayjs(state.workDate).format('MM-DD');
    workDateDisplayDayElement.innerText = dayjs(state.workDate).format('dddd');
}

export function drawPickupRate({
    data,
    state,
    downtimeRateElement,
    availabilityRateElement,
    workDateDisplayDateElement,
    workDateDisplayDayElement,
}) {
    const [availabilityRate, downTimeRate] = data;

    downtimeRateElement.innerText = downTimeRate.toFixed(2) + ' %';
    availabilityRateElement.innerText = availabilityRate.toFixed(2) + ' %';

    function alignLabel() {
        const chart = this;
        if (state.grossLabelPickup) {
            state.grossLabelPickup.destroy();
        }
        setTimeout(() => {
            state.grossLabelPickup = chart.renderer.text(availabilityRate.toFixed(2) + '%', chart.plotWidth / 2, chart.plotHeight / 2)
                .css({
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    transform: 'translate(-1.5rem, 0.5rem)',
                    textShadow: '0 0 0.5rem'
                }).add();
        }, 1000);
    }

    state.optionsPickup = () => ({
        chart: {
            type: 'solidgauge',
            margin: [0, 0, 0, 0],
            events: {
                load: alignLabel,
                redraw: alignLabel,
            },
            backgroundColor: 'transparent',
        },
        title: {
            text: null
        },
        tooltip: {
            enabled: false
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
                outerRadius: '100%',
                innerRadius: '88%',
                borderWidth: 0,
                backgroundColor: COLOR_PALETTE.solidGauge.outer
            }, {
                outerRadius: '80%',
                innerRadius: '68%',
                borderWidth: 0,
                backgroundColor: COLOR_PALETTE.solidGauge.middle
            },
            ]
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: [],
            gridLineWidth: 0,
            labels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: false
                },
                linecap: 'round',
                stickyTracking: false,
                rounded: true
            }
        },
        series: [{
            name: 'Avaiability',
            data: [{
                color: COLOR_PALETTE.solidGauge.conversion,
                radius: '100%',
                innerRadius: '88%',
                y: availabilityRate
            }],
            dataLabels: {
                style: {
                    color: THEME_COLOR
                }
            }
        }, {
            name: 'Downtime',
            data: [{
                color: COLOR_PALETTE.solidGauge.engagement,
                radius: '80%',
                innerRadius: '68%',
                y: downTimeRate
            }],
            dataLabels: {
                style: {
                    color: THEME_COLOR
                }
            }
        },
        ],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
    });
    _drawChart({
        state,
        name: 'chart43',
        opts: state.optionsPickup() ?? {},
    });
    workDateDisplayDateElement.innerText = dayjs(state.workDate).format('MM-DD');
    workDateDisplayDayElement.innerText = dayjs(state.workDate).format('dddd');
}

/**
* Hàm hiển thị dữ liệu đánh giá của chuyền cụ thể
* @param {T.StandardJudgesItem} data Dữ liệu đánh giá
*/
export function drawJudgesLine(data) {
    document.getElementById('text-judge-1').innerText = Utils.formatNum(Utils.secondsToHours(Number(data.failureDuration ?? 0)), {})
    document.getElementById('text-judge-2').innerText = data.object ?? 'N/A'
    document.getElementById('text-judge-3').innerText = data.downtimeRanking ?? 0
    document.getElementById('text-judge-4').innerText = data.failureFrequency ?? 0
    document.getElementById('text-judge-5').innerText = data.frequencyRanking ?? 0
    document.getElementById('text-judge-6').innerText = data.comment ?? 'Không có đánh giá, vui lòng lựa chọn chuyền'
}

/**
 * Hàm hiển thị dữ liệu đánh giá của máy cụ thể
 * @param {T.StandardJudgesItem} data Dữ liệu đánh giá
 */
export function drawJudgesMachine(data) {
    document.getElementById('text-judge-7').innerText = Utils.formatNum(Utils.secondsToHours(Number(data.failureDuration ?? 0)), {})
    document.getElementById('text-judge-8').innerText = data.object ?? 'N/A'
    document.getElementById('text-judge-9').innerText = data.downtimeRanking ?? 0
    document.getElementById('text-judge-10').innerText = data.failureFrequency ?? 0
    document.getElementById('text-judge-11').innerText = data.frequencyRanking ?? 0
    document.getElementById('text-judge-12').innerText = data.comment ?? 'Không có đánh giá, vui lòng lựa chọn máy!'
}

/**
 * @todo Sort line name, location and Machine name, which one using for detect `location`
 */
export function drawPickupTracking({ state, data, element }) {
    element.innerHTML = `
    <thead class="bg-secondary">
        <tr>
            <th>SMT</th>
            ${Object.values(Utils.groupBy(data.sort((a, b) => b.locationNo - a.locationNo), 'locationNo')).map(e => `<th>${DOMPurify.sanitize(e[0].machineName)}</th>`).join('')}
        </tr>
    </thead>
    <tbody>
        ${Object.keys(Utils.groupBy(data, 'lineName')).sort(sortText).map(lineName => `
        <tr>
            <td style="align-content: center" class="text-primary-emphasis cursor-pointer" onclick="DashboardSMT.changeLineAndMachine('${lineName}')">${DOMPurify.sanitize(lineName)}</td>
            ${Object.keys(Utils.groupBy(data, 'locationNo')).map(locationNo => {
        const machineName = Utils.groupBy(data, 'locationNo')[locationNo]?.find(g => g.lineName == lineName)?.machineNo;
        return `
                <td>
                    <div class="d-flex flex-column align-items-center justify-content-center">
                        <div class="d-flex gap-2 align-items-center" style="font-size: 0.8rem">
                            ${(() => {
                let pickupRate = Utils.groupBy(data, 'locationNo')[locationNo].find(g => g.lineName == lineName && g.lane == LANE_ENUM.LEFT)?.pickupRate;
                if (pickupRate != null) {
                    return 'L ' + _pickPickupStatusDot(+numeral(pickupRate).format('0.00'), lineName, machineName) + '<small class="text-secondary">' + numeral(pickupRate).format('0.00') + '%</small>';
                }
                return '&nbsp';
            })()}
                        </div>
                        <div class="d-flex gap-2 align-items-center" style="font-size: 0.8rem">
                            ${(() => {
                let pickupRate = Utils.groupBy(data, 'locationNo')[locationNo].find(g => g.lineName == lineName && g.lane == LANE_ENUM.RIGHT)?.pickupRate;
                if (pickupRate != null) {
                    return 'R ' + _pickPickupStatusDot(+numeral(pickupRate).format('0.00'), lineName, machineName) + '<small class="text-secondary">' + numeral(pickupRate).format('0.00') + '%</small>';
                }
                return '&nbsp';
            })()}
                        </div>
                    </div>
                </td>`
    }).join('')}
        </tr>`).join('')}
    </tbody>`;
}

export function drawHoursFailure(state, data) {
    const categories = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    state.optionsHoursFailure = () => ({
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            events: {
                load: function () {
                    const chart = this;
                    const middle = chart.plotHeight / 2;
                    chart.xAxis[0].update({ offset: -middle }, true);
                },
                redraw: function () {
                    const chart = this;
                    setTimeout(() => {
                        const middle = chart.plotHeight / 2;
                        chart.xAxis[0].update({ offset: -middle }, true);
                    }, 0);
                }
            }
        },
        title: {
            text: null,
        },
        xAxis: {
            categories,
            lineWidth: 0,
            lineColor: '#000',
            tickLength: 5,
            tickColor: '#000',
            labels: {
                align: 'center',
                y: 4,
            },
        },
        yAxis: [{
            title: {
                text: 'Count(times)',
                style: { color: THEME_COLOR }
            },
            labels: {
                style: { color: THEME_COLOR },
            },
            gridLineWidth: 0,
            height: '43%',
            offset: 0,
        }, {
            title: {
                text: 'Downtime(hours)',
                style: { color: THEME_COLOR }
            },
            labels: {
                style: { color: THEME_COLOR }
            },
            top: '57%',
            height: '43%',
            offset: 0,
            reversed: true,
            gridLineWidth: 0,
        }],
        tooltip: {
            shared: true,
            formatter: function () {
                let tooltip = `<b>${dayjs(state.workDate).format('YYYY/MM/DD')} ${this.key} </b><br/>`;
                this.points.forEach(point => {
                    let unit = '';
                    if (point.series.name === 'Count') unit = ' times';
                    if (point.series.name === 'Downtime') unit = ' hours';
                    tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}${unit}</b><br/>`;
                });
                return tooltip;
            }
        },
        plotOptions: {
            column: {
                pointWidth: Utils.vwToPx(0.9),
                dataLabels: {
                    enabled: false,
                    format: '{value}%'
                }
            }
        },
        series: [{
            name: 'Count',
            yAxis: 0,
            data: categories.map(e => data.find(f => f.hourName == e)?.errorCount ?? 0),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.negative.end],
                    [1, COLOR_PALETTE.column.negative.start]
                ]
            },
        }, {
            name: 'Downtime',
            yAxis: 1,
            data: categories.map(e => Utils.formatNum(Utils.secondsToHours(Number(data.find(f => f.hourName == e)?.errorTime ?? 0)), {})),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, COLOR_PALETTE.column.positive.end],
                    [1, COLOR_PALETTE.column.positive.start]
                ]
            },
        }],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
    });
    _drawChart({
        state,
        name: 'chart7',
        opts: state.optionsHoursFailure() ?? {},
    });
}

export function drawLineInformation(machines = [], element) {
    const currenLine = machines[0] || {};
    element.innerHTML = `
    <div class="card flex-1 text-light bg-dark border-danger text-start d-flex">
        <div class="border-bottom border-secondary p-2">
            <strong class="fs-5">${DOMPurify.sanitize(currenLine.lineName)}</strong> - <small class="text-muted">${DOMPurify.sanitize(machines.length + 1 || '')} Machines</small>
        </div>
        <div class="row g-2 fs-7 m-2 flex-1">
            <div class="col-6">
            <div class="text-secondary fw-semibold">Factory</div>
            <div>${DOMPurify.sanitize(currenLine.factory || '')}</div>
            </div>
            <div class="col-6">
            <div class="text-secondary fw-semibold">Building / Floor</div>
            <div>${DOMPurify.sanitize(currenLine.building || '')} / ${DOMPurify.sanitize(currenLine.floor || '')}</div>
            </div>
            <div class="col-6">
            <div class="text-secondary fw-semibold">Project</div>
            <div>${DOMPurify.sanitize(currenLine.project || '')}</div>
            </div>
            <div class="col-6 d-flex align-items-end mb-2">
                <button type="button" is-btn-ai-port="" data-line="${DOMPurify.sanitize(currenLine.lineName)}" class="btn btn-danger w-100">Deep Analysis</button>
            </div>
        </div>
    </div>
    `
}

export function drawMachineInformation(currentMachine = {}, element) {
    element.innerHTML = `
    <div class="card flex-1 text-light bg-dark border-danger text-start d-flex">
        <div class="border-bottom border-secondary p-2">
            <strong class="fs-5">${DOMPurify.sanitize(currentMachine.machineName)}</strong> - <small class="text-muted">${DOMPurify.sanitize(currentMachine.machineType || '')}</small>
        </div>
        <div class="row g-2 fs-7 m-2 flex-1">
            <div class="col-6">
            <div class="text-secondary fw-semibold">Location</div>
            <div>${DOMPurify.sanitize(currentMachine.lineName)} - ${DOMPurify.sanitize(currentMachine.locationNo)}</div>
            </div>
            <div class="col-6">
            <div class="text-secondary fw-semibold">Factory</div>
            <div>${DOMPurify.sanitize(currentMachine.factory || '')}</div>
            </div>
            <div class="col-6">
            <div class="text-secondary fw-semibold">Building / Floor</div>
            <div>${DOMPurify.sanitize(currentMachine.building || '')} / ${DOMPurify.sanitize(currentMachine.floor || '')}</div>
            </div>
            <div class="col-6">
            <div class="text-secondary fw-semibold">Project</div>
            <div>${DOMPurify.sanitize(currentMachine.project || '')}</div>
            </div>
            <div class="col-6">
            <div class="text-secondary fw-semibold">UPH</div>
            <div>${DOMPurify.sanitize(currentMachine.uph || '')}</div>
            </div>
            <div class="col-6 d-flex align-items-end mb-2">
                <button type="button" is-btn-ai-port="" data-machine="${DOMPurify.sanitize(currentMachine.machineNo)}" class="btn btn-danger w-100">Deep Analysis</button>
            </div>
        </div>
    </div>
    `
}



const sortText = (a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
    }
    return 0;
}

const sortLocation = (a, b) => {
    return b.locationNo - a.locationNo;
}

function pickMedal(index) {
    if (index === 0) {
        return `<span style="font-size: 1rem;">#1</span>`
    } else if (index === 1) {
        return `<span style="font-size: 1rem;">#2 </span>`
    } else if (index === 2) {
        return `<span style="font-size: 1rem;">#3 </span>`
    }
    return '';
}

function TooltipMachine({ lineName }) {
    return ` 
    <div class="card text-light bg-dark border-danger text-start" style="min-width: 200px;">
        <div class="border-bottom border-secondary p-2 mb-2">
            <strong class="fs-6">${DOMPurify.sanitize(lineName)}</strong> (<small class="text-muted">LINE NAME</small>)
        </div>
        <button type="button" is-btn-analysis data-line="${DOMPurify.sanitize(lineName)}" class="btn btn-outline-danger rounded-0 border-bottom-0">Downtime Analysis</button>
        <button type="button" is-btn-analysis-pickup data-line="${DOMPurify.sanitize(lineName)}" class="btn btn-outline-danger rounded-0 border-bottom-0">Pickup Analysis</button>
        <button type="button" is-btn-ai-port data-line="${DOMPurify.sanitize(lineName)}" class="btn btn-outline-danger rounded-0">Deep Analysis</button>
    </div>
    `;
}

function CellLine({ tooltipContent, lineName }) {
    return `<td style="align-content: center">
        <a class="link-underline link-underline-opacity-0 link-underline-opacity-75-hover tooltip-target" href="#" data-filter-type="line" data-filter-value="${lineName}">
            <div class="tooltipContent d-none">
                ${tooltipContent}
            </div>
            ${DOMPurify.sanitize(lineName)}
        </a>
    </td>`;
}

/**
 * @param {Object} opts
 * @param {T.State} opts.state
 * @param {T.StandardStatusMachine} opts.data Dữ liệu trạng thái hoạt động theo các chuyền và các máy
 * @param {HTMLTableElement} opts.element Dữ liệu trạng thái hoạt động theo các chuyền và các máy
 * @todo Sort line name, location and Machine name, which one using for detect `location` ?
 */
export function drawMachinesStatus({ state, data, element }) {
    element.innerHTML = `
    <thead class="bg-secondary">
        <tr>
            <th>SMT</th>
            ${Object.values(Utils.groupBy(data.sort(sortLocation), 'locationNo')).map(e => `<th>${DOMPurify.sanitize(e[0].machineName)}</th>`).join('')}
        </tr>
    </thead>
    <tbody>
        ${Object.keys(Utils.groupBy(data, 'lineName')).sort(sortText).map((lineName, index) => `
        <tr>
            ${CellLine({ tooltipContent: TooltipMachine({ lineName }), lineName })}
            ${Object.keys(Utils.groupBy(data.sort(sortLocation), 'locationNo')).map(locationNo => {
        const currentMachine = Utils.groupBy(data, 'locationNo')[locationNo].find(g => g.lineName == lineName);
        if (currentMachine) {
            const tooltipContent = `
                    <div class="card text-light bg-dark border-danger text-start" style="min-width: 250px;">
                        <div class="border-bottom border-secondary mb-2 p-2">
                            <strong class="fs-6">${DOMPurify.sanitize(currentMachine.machineName)}</strong> <span class="fs-6 text-muted">(${DOMPurify.sanitize(currentMachine.machineType || '')})</span>
                        </div>
                        <button type="button" is-btn-analysis data-machine="${DOMPurify.sanitize(currentMachine.machineNo)}" class="btn btn-outline-danger rounded-0 border-bottom-0">Downtime Analysis</button>
                        <button type="button" is-btn-analysis-pickup data-machine="${DOMPurify.sanitize(currentMachine.machineNo)}" class="btn btn-outline-danger rounded-0 border-bottom-0">Pickup Analysis</button>
                        <button type="button" is-btn-ai-port data-machine="${DOMPurify.sanitize(currentMachine.machineNo)}" class="btn btn-outline-danger rounded-0">Deep Analysis</button>
                    </div>
                `;
            return `
                    <td class="text-center" 
                        style="align-content: center;">
                        <span class="tooltip-target cursor-pointer" data-filter-type="machine" data-filter-value="${currentMachine.lineName}${SPLIT_KEY}${currentMachine.machineNo}">
                            <div class="tooltipContent d-none">
                                ${tooltipContent}
                            </div>
                            ${_pickMachineStatusDot(currentMachine.machineStatus ?? MACHINE_STATUS.NO_DATA)}
                        </span>
                        <span class="d-none absolute">${currentMachine.machineNo}</span>
                    </td>
                `;
        } else {
            return `<td style="align-content: center;"></td>`;
        }
    }).join('')}
        </tr>`).join('')}
    </tbody>
    `;


    Array.from(document.getElementsByClassName('tooltip-target')).forEach(target => {
        target.addEventListener('click', (event) => {
            const { dataset } = event.currentTarget;
            const { filterType, filterValue } = dataset;
            ['lineName', 'machine'].forEach(prop => {
                state[prop] = null;
            });
            switch (filterType) {
                case 'machine':
                    state.lineName = filterValue?.split(SPLIT_KEY)[0];
                    state.machine = filterValue?.split(SPLIT_KEY)[1];
                    break;
                case 'line':
                    state.lineName = filterValue;
                    break;
                default:
                    break;
            }
            state?.cascader?.setValue([
                state.factory || 'All Factory',
                state.building || 'All Building',
                state.project || 'All Project',
                state.section || 'All Section',
                state.lineName || 'All Line',
                state.machine || 'All Machine']);
        })
        tippy(target, {
            content: target.querySelector('.tooltipContent').innerHTML,
            allowHTML: true,
            interactive: true,
            placement: 'right',
        });
    });
}


/**
 * Hiển thị danh sách các hạng mục lọc
 * @param {T.State} state 
 * @param {T.StandardFilterItem} data Dữ liệu bộ lọc cho dashboard
 */
export function drawItemsFilter(state, data) {
    state.cascader = new Cascader("#filter", {
        mode: "single",
        placeholder: "Please select",
        data: data,
        showClear: false,
        defaultValue: [
            state.factory || "All Factory",
            state.building || "All Building",
            state.project || "All Project",
            state.section || "All Section",
            state.lineName || "All Line",
            state.machine || "All Machine"],
        onChange: function (value) {
            state.factory = value[0] == 'All Factory' ? null : value[0];
            state.building = value[1] == 'All Building' ? null : value[1];
            state.project = value[2] == 'All Project' ? null : value[2];
            state.section = value[3] == 'All Section' ? null : value[3];
            state.lineName = value[4] == 'All Line' ? null : value[4];
            state.machine = value[5] == 'All Machine' ? null : value[5];
        },
    });
    state.cascader.init();
}

