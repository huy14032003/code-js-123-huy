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
                <svg class="${index == currentStepIndex ? 'text-warning' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><!-- Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE --><g><circle cx="3" cy="12" r="2" fill="currentColor"/><circle cx="21" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="21" r="2" fill="currentColor"/><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="5.64" cy="5.64" r="2" fill="currentColor"/><circle cx="18.36" cy="18.36" r="2" fill="currentColor"/><circle cx="5.64" cy="18.36" r="2" fill="currentColor"/><circle cx="18.36" cy="5.64" r="2" fill="currentColor"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
                <svg class="${index < currentStepIndex ? 'text-success' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m8 12.5l2.5 2.5L16 9"/></g></svg>
                <svg class="${index > currentStepIndex ? 'text-primary' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="round" d="M19 9.62c0 2.58-1.27 4.565-3.202 5.872c-.45.304-.675.456-.786.63c-.11.172-.149.4-.224.854l-.06.353c-.132.798-.199 1.197-.479 1.434s-.684.237-1.493.237h-2.612c-.809 0-1.213 0-1.493-.237s-.346-.636-.48-1.434l-.058-.353c-.076-.453-.113-.68-.223-.852s-.336-.326-.787-.634C5.192 14.183 4 12.199 4 9.62C4 5.413 7.358 2 11.5 2a7.4 7.4 0 0 1 1.5.152"/><path d="m16.5 2l.258.697c.338.914.507 1.371.84 1.704c.334.334.791.503 1.705.841L20 5.5l-.697.258c-.914.338-1.371.507-1.704.84c-.334.334-.503.791-.841 1.705L16.5 9l-.258-.697c-.338-.914-.507-1.371-.84-1.704c-.334-.334-.791-.503-1.705-.841L13 5.5l.697-.258c.914-.338 1.371-.507 1.704-.84c.334-.334.503-.791.841-1.705zm-3 17v1c0 .943 0 1.414-.293 1.707S12.443 22 11.5 22s-1.414 0-1.707-.293S9.5 20.943 9.5 20v-1"/></g></svg>
                ${e}
            </div>
            `
        }).join('');
        progressStepCurrent.innerHTML = `
        <svg class="${steps[currentStepIndex] ? 'text-warning' : 'd-none'}" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><!-- Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE --><g><circle cx="3" cy="12" r="2" fill="currentColor"/><circle cx="21" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="21" r="2" fill="currentColor"/><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="5.64" cy="5.64" r="2" fill="currentColor"/><circle cx="18.36" cy="18.36" r="2" fill="currentColor"/><circle cx="5.64" cy="18.36" r="2" fill="currentColor"/><circle cx="18.36" cy="5.64" r="2" fill="currentColor"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
        <svg class="${steps[currentStepIndex] ? 'd-none' : 'text-success'}" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m8 12.5l2.5 2.5L16 9"/></g></svg>
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
    // const target = document.getElementById('agent-interaction')
    // marked.use({ renderer });
    // target.innerHTML = marked.parse(content);
}
