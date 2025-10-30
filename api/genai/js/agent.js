import * as T from './types.js'; // eslint-disable-line no-unused-vars
import ScreenController from "./screen-controller.js";
import Logger from './libs/logger/logger.min.js';
import gsap from './libs/gsap/index.js';
import { drawMarkDown, drawProgress } from './drawer.js';
import Utils from './Utils.js';
import { FORCE_RECALL_LAST_MESSAGE } from './config.js';

/**
 * @version 0.0.1
 */
export async function createThread() {
    const response = await fetch(`${agentUrl}/threads`, {
        method: 'POST',
        body: JSON.stringify({
            metadata: {},
        })
    });

    const raw = await response.json();
    return raw?.thread_id ?? '';
}

/**
 * @version 1.0.0
 * @param {Object} opts
 * @param {T.ShowPageKey} opts.showPage 
 * @param {string[]} opts.highlightCharts 
 * @param {T.State} opts.state
 */
export function _handleHighlightFromAgent({ showPage, highlightCharts, state, repeat = -1 }) {
    const highlightAnimation = [{ scaleX: 0.975, scaleY: 0.975 }, { scaleX: 1.025, scaleY: 1.025, duration: 0.5, repeat, yoyo: true }];

    const ITEM_COUNT = 43;

    for (let i = 1; i <= ITEM_COUNT; i++) {
        const animate = state[`gsapAnimation${i}`];
        animate && animate?.kill();
    }

    const chartsMap = new Map([
        ['home_page', new Map([
            ['downtime_overall', 1],
            ['downtime_by_line', 3],
            ['downtime_by_machine', 4],
            ['downtime_by_error', 5],
        ])],
        ['downtime_by_line', new Map([
            ['overall', 1],
            ['analysis_downtime_by_line', 21],
            ['downtime_by_hours', 8],
            ['downtime_by_days', 8],
            ['downtime_by_errors', 5],
            ['quick_statistic', 14],
        ])],
        ['downtime_by_machine', new Map([
            ['overall', 1],
            ['downtime_by_hours', 8],
            ['downtime_by_days', 8],
            ['downtime_by_errors', 5],
            ['quick_statistic', 23],
        ])],
        ['pickup_overall', new Map([
            ['overall', 43],
            ['total_trend', 30],
            ['pickup_by_line', 33],
            ['pickup_by_machine', 34],
            ['pickup_by_feeder', 35],
            ['pickup_by_nozzle', 37],
        ])],
        ['troubleshooting_guide', new Map([
            ['downtime_by_errors', 5]
        ])],
    ]);

    if (chartsMap.has(showPage)) {
        const charts = chartsMap.get(showPage);
        highlightCharts.forEach(chart => {
            if (charts.has(chart)) {
                const index = charts.get(chart);
                state[`gsapAnimation${index}`] = gsap.fromTo(`.cardItem${index}`, ...highlightAnimation).then((tween) => {
                    if(repeat != -1) {
                        tween.revert();
                    }
                });
                if(repeat != -1) {
                    state[`gsapAnimation${index}`] = null;
                }
            }
        })
    }
}

/**
 * @version 1.0.0
 * @param {T.PramsSMT & { errorCode } } params 
 * @param {T.State} target 
 */
export function _handleParamsFromAgent(params, target) {
    console.log(params, 'HERE');
    
    params?.factory == null || (target.factory = params.factory || null);
    params?.building == null || (target.building = params.building || null);
    params?.project_name == null || (target.project = params.project_name || null);
    params?.section_name == null || (target.section = params.section_name || null);
    params?.line_name == null || (target.lineName = params.line_name || null);
    params?.machine_no == null || (target.machine = params.machine_no || null);
    params?.errorCode == null || (target.errorCode = params.errorCode || null);
    if (params?.startTime != null && params?.endTime != null) {
        const startTime = params?.startTime || dayjs().subtract(6, 'day').format('YYYY/MM/DD 00:00:01');
        const endTime = params?.endTime || dayjs().format('YYYY/MM/DD 23:59:59');
        target.timeSpan = startTime + ' - ' + endTime;
        target.workDate = endTime;
        target?.flatpickr?.setDate(new Date(target.workDate));
    }
    target?.cascader?.setValue([
        target.factory || 'All Factory',
        target.building || 'All Building',
        target.project || 'All Project',
        target.section || 'All Section',
        target.lineName || 'All Line',
        target.machine || 'All Machine']);
}

/**
 * @version 1.0.0
 * @param {T.ShowPageKey} showPage 
 * @param {ScreenController} screenController 
 */
export function _handleShowPagesFromAgent(showPage, screenController) {
    const { switchTo = () => { } } = screenController;
    switch (showPage) {
        case 'downtime_overall':
            switchTo(`screen1`);
            break;
        case 'downtime_by_line':
            switchTo(`screen3`);
            break;
        case 'downtime_by_machine':
            switchTo(`screen2`);
            break;
        case 'pickup_overall':
            switchTo(`screen4`);
            break;
        case 'troubleshooting_guide':
            switchTo(`screen5`);
            break;
        case 'pickup_by_line':
            switchTo(`screen4`);
            break;
        case 'pickup_by_machine':
            switchTo(`screen4`);
            break;
        default:
            break;
    }
}

/**
 * @version 1.1.0
 * @param {Object} opts
 * @param {MessageEvent<T.StateType>} opts.messageEvent 
 * @param {ScreenController} opts.screenController 
 * @param {HTMLElement} opts.uiFullScreen 
 * @param {T.State} opts.state 
 */
export async function handleMessageFromAgent({ messageEvent, screenController, uiFullScreen, state }) {
    switch (messageEvent.data.factor) {
        case 'agent':
            const { params = {}, showPage = '', highlightCharts = [], errorCode = '' } = messageEvent.data;
            _handleParamsFromAgent({ ...params, errorCode }, state);
            _handleShowPagesFromAgent(showPage, screenController);
            _handleHighlightFromAgent({ showPage, highlightCharts, state });
            break;
        default:
            throw new Error("Cannot handle message from agent that not be human or agent");
    }
}

function GroupButtonFollowup({ data, title }) {
    return `<br><div class="follow-up d-flex gap-1 flex-wrap">${data.map(item => `<button href="${item?.url ?? '#'}">${item?.text}</button>`).join('')}</div>`;
}

const highlighCapacityIssue = Utils.debounce((listWarning) => {
    /**@type{HTMLTableElement} */
    const tableMachine = document.getElementById('tableMachinesStatus');
    if (!tableMachine) {
        console.warn('Không tìm thấy bảng tableMachinesStatus');
        return;
    }

    const rows = Array.from(tableMachine.rows);
    
    const tbody = tableMachine.tBodies[0] || tableMachine; // hỗ trợ cả <tbody> hoặc table trực tiếp

    const warningRows = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const lineCell = row.cells[0];
        const machineCells = Array.from(row.cells).slice(1);

        let matched = false;

        for (let warningIdx in listWarning) {
            const warning = listWarning[warningIdx]
            if (lineCell.textContent.includes(warning.lineName)) {
                matched = warningIdx;

                // Highlight bằng GSAP
                gsap.fromTo(row.cells, 
                    { backgroundColor: "#fff" },
                    { backgroundColor: "#421811", duration: 0.5, stagger: 0.1 },
                    // { backgroundColor: "#ef53508a", duration: 0.5, stagger: 0.1 },
                ).then(() => {
                    machineCells.forEach(cell => {
                        if (cell.textContent.includes(warning.machine)) {
                            gsap.to(cell, {
                                backgroundColor: "#ef5350",
                                duration: 0.5
                            });
                        }
                    });
                })

                break; // đã match thì không cần kiểm tra tiếp warning list
            }
        }

        if (matched) {
            warningRows[matched] = row;
        }

        const listReportEl = document.getElementById('list-report');
        if (listReportEl) {
            const warning = listWarning[0];
            let html = '';
            if(warning) {
                html += `
                    ${warning.lineName ? `<button type="button" onclick="DashboardSMT.triggerReport('${warning.lineName}', 'line')" class="list-group-item list-group-item-action">Create line ${warning.lineName} report</button>` : `<button type="button" onclick="DashboardSMT.triggerReport('B81S1', 'line')" class="list-group-item list-group-item-action">Create line B81S1 report</button>`}

                    ${warning.machine ? `<button type="button" onclick="DashboardSMT.triggerReport('${warning.machine}', 'machine')" class="list-group-item list-group-item-action">Create machine ${warning.machine} report</button>` : `<button type="button" onclick="DashboardSMT.triggerReport('B81S1H1', 'machine')" class="list-group-item list-group-item-action">Create machine B81S1H1 report</button>`}

                    ${warning.lineName ? `<button type="button" onclick="DashboardSMT.triggerReport('${warning.lineName}', 'linePickup')" class="list-group-item list-group-item-action">Create pickup ${warning.lineName} report</button>` : `<button type="button" onclick="DashboardSMT.triggerReport('', 'linePickup')" class="list-group-item list-group-item-action">Create pickup report</button>`}
                `;
            }
            listReportEl.innerHTML = html;
        }
    }

    // Đẩy warningRows lên đầu (sau header)
    for (let i = warningRows.length - 1; i >= 0; i--) {
        const row = warningRows[i];
        if(row) {
            tbody.insertBefore(row, tbody.rows[0]); // đẩy lên ngay sau header
        }
    }
}, 5000)


let currentAbortController = null;
let highlightTimeouts = [];

/**
 * @param {string} message 
 * @param {T.State} state
 * @param {() => {} | undefined} checkRedirectToReport 
 */
export async function writerAgent(message, state, checkRedirectToReport) {
    if(message != FORCE_RECALL_LAST_MESSAGE) {
        state.lastAgentMessage = message;
    }
    if (currentAbortController) {
        currentAbortController.abort();
    }

    highlightTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    highlightTimeouts = [];

    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;

    document.getElementById('agent-interaction'). innerHTML = `
    <div class="text-center d-flex flex-row align-items-center h-100 justify-content-center">
                <div>
                ${state.lastAgentMessage}</br>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                  viewBox="0 0 24 24"><!-- Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE -->
                  <rect width="2.8" height="12" x="1" y="6" fill="currentColor">
                    <animate id="SVGLQdHQe4p" attributeName="y" begin="0;SVGg3vsIeGm.end-0.1s" calcMode="spline"
                      dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
                    <animate attributeName="height" begin="0;SVGg3vsIeGm.end-0.1s" calcMode="spline" dur="0.6s"
                      keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
                  </rect>
                  <rect width="2.8" height="12" x="5.8" y="6" fill="currentColor">
                    <animate attributeName="y" begin="SVGLQdHQe4p.begin+0.1s" calcMode="spline" dur="0.6s"
                      keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
                    <animate attributeName="height" begin="SVGLQdHQe4p.begin+0.1s" calcMode="spline" dur="0.6s"
                      keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
                  </rect>
                  <rect width="2.8" height="12" x="10.6" y="6" fill="currentColor">
                    <animate attributeName="y" begin="SVGLQdHQe4p.begin+0.2s" calcMode="spline" dur="0.6s"
                      keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
                    <animate attributeName="height" begin="SVGLQdHQe4p.begin+0.2s" calcMode="spline" dur="0.6s"
                      keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
                  </rect>
                  <rect width="2.8" height="12" x="15.4" y="6" fill="currentColor">
                    <animate attributeName="y" begin="SVGLQdHQe4p.begin+0.3s" calcMode="spline" dur="0.6s"
                      keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
                    <animate attributeName="height" begin="SVGLQdHQe4p.begin+0.3s" calcMode="spline" dur="0.6s"
                      keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
                  </rect>
                  <rect width="2.8" height="12" x="20.2" y="6" fill="currentColor">
                    <animate id="SVGg3vsIeGm" attributeName="y" begin="SVGLQdHQe4p.begin+0.4s" calcMode="spline"
                      dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6" />
                    <animate attributeName="height" begin="SVGLQdHQe4p.begin+0.4s" calcMode="spline" dur="0.6s"
                      keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12" />
                  </rect>
                </svg>
                </div>
              </div>
    `;

    try {
        const response = await fetch(`${agentUrl}/runs/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: {
                    messages: [{ role: 'human', content: state.lastAgentMessage }],
                },
                assistant_id: 'agent',
                stream_mode: ['values', 'messages-tuple', 'custom'],
                stream_resumable: true,
                stream_subgraphs: true,
                on_disconnect: 'continue'
            }),
            signal
        });

        let markedText = '';
        let followUpComponent = '';
        const steps = ['Start'];
        drawProgress(steps, 0);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const dataText = line.replace(/^data:\s*/, '');
                    if (!Utils.isJsonValid(dataText)) continue;

                    const parsed = JSON.parse(dataText);

                    try {
                        if (parsed?.current_step && steps.indexOf(parsed.current_step) === -1) {
                            steps.push(parsed.current_step);
                            drawProgress(steps, steps.indexOf(parsed.current_step));
                        }

                        const warning = parsed[0]?.metadata?.warning || parsed?.metadata?.warning;
                        if (warning) {
                            state.itemsNeedReport = warning;
                            highlighCapacityIssue(warning);
                            checkRedirectToReport && checkRedirectToReport(state.itemsNeedReport);
                        }

                        if (parsed[0]?.type === 'tool' || parsed?.type === 'tool') continue;

                        if (parsed[0]?.content) {
                            markedText += parsed[0].content;
                            drawMarkDown(markedText);
                        } else if (parsed?.type === 'ui' && parsed?.name === 'follow-up') {
                            followUpComponent = GroupButtonFollowup({
                                data: parsed.props?.data || [],
                                title: parsed.props?.title || 'Follow up question'
                            });
                        }

                    } catch (e) {
                        console.error('Failed to parse JSON chunk:', e);
                    }
                }
            }
        }

        markedText += followUpComponent;
        drawMarkDown(markedText);

        steps.push('End');
        drawProgress(steps, 10000);

        if (window.firstHighlightFinish) return;
        window.firstHighlightFinish = true;

        highlightTimeouts.push(setTimeout(() => {
            _handleHighlightFromAgent({
                showPage: 'downtime_overall',
                state,
                highlightCharts: ['agentInteraction'],
                repeat: 5,
            });
        }, 2000));

        highlightTimeouts.push(setTimeout(() => {
           _handleHighlightFromAgent({
                showPage: 'downtime_overall',
                state,
                highlightCharts: ['machineStatus'],
                repeat: 5,
            });
        }, 7000));

        highlightTimeouts.push(setTimeout(() => {
            gsap.to(".cardItem3", {
                duration: 1,
                boxShadow: "#ffffff59 3px 0px 86px 46px",
                ease: "power2.out"
            }).then(() => {
                gsap.to(".cardItem3", {
                duration: 1,
                boxShadow: "#ffffff59 0px 0px 0px 0px",
                ease: "power2.out"
                });
                document.querySelector('.cardItem3').classList.add('border-danger');
                document.querySelector('.cardItem3').classList.remove('border-0');
            })
        }, 10000));
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted (có thể do gọi lại writerAgent)');
        } else {
            console.error('Error in writerAgent:', error);
        }
    }
}


