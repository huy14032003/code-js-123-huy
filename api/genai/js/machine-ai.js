import * as T from './types.js'; // eslint-disable-line no-unused-vars
import Utils from "./Utils.js";
import ScreenController from "./screen-controller.js";
import MirrorChart from "./mirror-chart.js";
import Chatbot from "./chatbot.js";
import AutoScrollElement from './autoscroll.js';
import {
    hasError, messageState,
    getMachinesStatus, getLinesFailure, getMachinesFailure,
    getErrorsFailure, getDowntimeTrend, getLinesDowntimeTrend,
    getHoursFailure, getFailuresDetail, getDowntime,
    getItemsFilter, getJudgesItem, getLinesPickup,
    getMachinesPickup, getFeedersPickup, getNozzlesPickup,
    getPickupRateTrend, getPickupTracking, dataStore
} from "./apis.js";
import { Setting } from './settings.js';
import { createFlatPickr } from './time.js';
import { handleMessageFromAgent, writerAgent } from './agent.js';
import { standalizeData } from './helpers.js';
import Flow from './flow.js';
import LiveStatus from './live-status.js';
import { drawDowntime, drawDowntimeTrend, drawErrorsFailure, drawErrorsFailurePareto, drawFailuresDetail, drawFailuresRecent, drawFeedersPickup, drawHoursFailure, drawItemsFilter, drawJudgesLine, drawJudgesMachine, drawLineHoursDownTime, drawLineInformation, drawLinesDownTime, drawLinesDowntimeTrend, drawLinesFailure, drawLinesFailureColumn, drawLinesPickup, drawMachineHoursDownTime, drawMachineInformation, drawMachinesDownTime, drawMachinesFailure, drawMachinesPickup, drawMachinesStatus, drawMarkDown, drawNozzlesPickup, drawPickupRate, drawPickupRateTrend, drawPickupTracking, drawStroubleShootingDoc } from './drawer.js'
import gsap from './libs/gsap/gsap-core.js';
import DOMPurify from './libs/dompurify/purify.es.js';
import { FORCE_RECALL_LAST_MESSAGE, SETTING_STORE_KEY } from './config.js';

const DashboardSMT = (() => {
    /** @type {T.OptsDashboardSMT} */
    let _opts = {};

    /** @type {T.State} */
    const observerMap = {}

    /**@type {T.State} */
    const _state = new Proxy({
        timeSpan: null,
        workDate: null,
        factory: Utils.getParamsURL('factory') ?? null,
        project: Utils.getParamsURL('project') ?? null,
        building: Utils.getParamsURL('building') ?? null,
        section: Utils.getParamsURL('section') ?? null,
        lineName: Utils.getParamsURL('lineName') ?? null,
        machine: Utils.getParamsURL('machine') ?? null,
        errorCode: Utils.getParamsURL('errorCode') ?? null,
        systemTimeSpan: dayjs().subtract(6, 'day').format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs().format('YYYY/MM/DD 23:59:59'),
        systemWorkDate: dayjs().format('YYYY/MM/DD 00:00:01'),
        systemFactory: '',
        systemProject: '',
        systemBuilding: '',
        systemSection: '',
        systemLineName: '',
        systemMachine: '',
        calcLineName: null,
        calcMachine: null,
        threadId: '',
        itemsReport: [],
        itemsNeedReport: [],
        reportLine: !!(Utils.getParamsURL('reportLine') ?? false),
        reportMachine: !!(Utils.getParamsURL('reportMachine') ?? false),
        reportPickup: !!(Utils.getParamsURL('reportPickup') ?? false),
        agentWindowRef: null,
        minSecondQueryDetail: 300,
        lastAgentMessage: '',
        grossLabel: null,
    }, {
        async set(obj, prop, value) {
            const oldValue = obj[prop];
            obj[prop] = value;
            if (oldValue != value) {
                observerMap[prop] = 1;
                if (['lineName', 'machine', 'factory', 'project', 'building', 'section', 'errorCode', 'reportLine', 'reportMachine', 'reportPickup'].includes(prop)) {
                    Utils.changeParamsURL(prop, value);
                }
                if (['lineName', 'machine', 'errorCode'].includes(prop)) {
                    _showCurrentHeaderReport(prop, value);
                    _showCurrentBadge(prop, value);
                }
                if (prop == 'errorCode') {
                    _handleSelectErrorCode(value);
                }
                await Flow.handleChangeState({
                    state: _state,
                    observerMap,
                    loadDownTimeOverall: _loadDownTimeOverall,
                    loadPickupOverall: _loadPickupOverall,
                    loadDownTimeTrend: _loadDownTimeTrend,
                    loadErrorsFailure: _loadErrorsFailure,
                    loadFailuresDetail: _loadFailuresDetail,
                    loadFeedersPickup: _loadFeedersPickup,
                    loadHoursFailure: _loadHoursFailure,
                    loadJudgesLine: _loadJudgesLine,
                    loadJudgesMachine: _loadJudgesMachine,
                    loadLineHoursDownTime: _loadLineHoursDownTime,
                    loadLinesDownTime: _loadLinesDownTime,
                    loadLinesDownTimeTrend: _loadLinesDownTimeTrend,
                    loadLinesFailure: _loadLinesFailure,
                    loadLinesPickup: _loadLinesPickup,
                    loadMachineHoursDownTime: _loadMachineHoursDownTime,
                    loadMachinesDownTime: _loadMachinesDownTime,
                    loadMachinesFailure: _loadMachinesFailure,
                    loadMachinesPickup: _loadMachinesPickup,
                    loadMachinesStatus: _loadMachinesStatus,
                    loadNozzlesPickup: _loadNozzlesPickup,
                    loadPickupRateTrend: _loadPickupRateTrend,
                    loadPickupsStatus: _loadPickupsStatus,
                    loadStroubleShooting: _loadStroubleShooting,
                });
            }
            return value;
        },
    });

    const _ui = {
        appMain: Utils.createDOMRef('appMain'),
        appWrapper: Utils.createDOMRef('appWrapper'),
        appAsideLeft: Utils.createDOMRef('appAsideLeft'),
        appAsideRight: Utils.createDOMRef('appAsideRight'),
        tableMachinesStatus: Utils.createDOMRef('tableMachinesStatus'),
        tablePickupStatus: Utils.createDOMRef('tablePickupStatus'),
        timeSpan: Utils.createDOMRef('timeSpan'),
        availabilityRate: Utils.createDOMRef('availabilityRate'),
        downTimeRate: Utils.createDOMRef('downTimeRate'),
        workDateDisplayDate: Utils.createDOMRef('workDateDisplayDate'),
        workDateDisplayDay: Utils.createDOMRef('workDateDisplayDay'),
        pickupRate: Utils.createDOMRef('pickupRate'),
        throwRate: Utils.createDOMRef('throwRate'),
        workDateDisplayDatePickup: Utils.createDOMRef('workDateDisplayDatePickup'),
        workDateDisplayDayPickup: Utils.createDOMRef('workDateDisplayDayPickup'),
        chart4: Utils.createDOMRef('chart4'),
        chart4Pareto: Utils.createDOMRef('chart4Pareto'),
        chart4Legend: Utils.createDOMRef('chart4Legend'),
        chart4LegendPareto: Utils.createDOMRef('chart4LegendPareto'),
        chart2: Utils.createDOMRef('chart2'),
        chart2Column: Utils.createDOMRef('chart2Column'),
        chart5: Utils.createDOMRef('chart5'),
        chart6: Utils.createDOMRef('chart6'),
        chart7: Utils.createDOMRef('chart7'),
        chart13: Utils.createDOMRef('chart13'),
        reportName: Utils.createDOMRef('reportName'),
        reportPanel: Utils.createDOMRef('reportPanel'),
        reportList: Utils.createDOMRef('list-report'),
        agentPlayground: Utils.createDOMRef('agent-interaction'),
        agentProgress: Utils.createDOMRef('agent-interaction-progress'),
        chart7Legend: Utils.createDOMRef('chart7Legend'),
        chart5Legend: Utils.createDOMRef('chart5Legend'),
        currentLineSelected: Utils.createDOMRef('currentLineSelected'),
        currentLinePickupSelected: Utils.createDOMRef('currentLinePickupSelected'),
        currentMachineSelected: Utils.createDOMRef('currentMachineSelected'),
        currentMachinePickupSelected: Utils.createDOMRef('currentMachinePickupSelected'),
        currentErrorSelected: Utils.createDOMRef('currentErrorSelected'),
        currentMachineReportHeader: Utils.createDOMRef('currentMachineReportHeader'),
        currentLineReportHeader: Utils.createDOMRef('currentLineReportHeader'),
        currentPickupReportHeader: Utils.createDOMRef('currentPickupReportHeader'),
        tableFailureDetailSearching: Utils.createDOMRef('table-failure-detail-searching'),
        lowestTimeDisplay: Utils.createDOMRef('lowestTimeDisplay'),
    }

    function _handleSelectErrorCode(errorCode) {
        /**@type {HTMLInputElement} */
        const input = _ui.tableFailureDetailSearching.value;
        input.value = errorCode;
        input.dispatchEvent(new Event('input'));
        input.disabled = !!input.value;
    }

    /**
     * Cập nhập giao diện và trạng thái cascader
     * @param {T.State} state
     */
    function _updateCascader(state) {
        state?.cascader?.setValue([
            state.factory || 'All Factory',
            state.building || 'All Building',
            state.project || 'All Project',
            state.section || 'All Section',
            state.lineName || 'All Line',
            state.machine || 'All Machine'
        ]);
    }

    /**
     * Xóa trạng thái của baged đang đại diện
     * @param {HTMLElement} dom 
     */
    function clearFilter(dom) {
        dom.parentElement.classList.add('d-none');
        const { dataset } = dom;
        switch (dataset.type) {
            case 'line':
                _state.lineName = '';
                break;
            case 'machine':
                _state.machine = '';
                break;
            case 'errorCode':
                _state.errorCode = '';
                break;
            default:
                break;
        }
        _updateCascader(_state);
    }

    /**
     * 
     * @param {'lineName'|'machine'} prop 
     * @param {string} value 
     */
    function _showCurrentBadge(prop, value) {
        switch (prop) {
            case 'lineName':
                const line = _ui.currentLineSelected.value;
                line.innerHTML = `${value} <span onclick="DashboardSMT.clearFilter(this)" data-type="line" data-value="${value}" class="cursor-pointer">x</span>`;
                line.classList[value ? 'remove' : 'add']('d-none');

                const linePickup = _ui.currentLinePickupSelected.value;
                linePickup.innerHTML = `${value} <span onclick="DashboardSMT.clearFilter(this)" data-type="line" data-value="${value}" class="cursor-pointer">x</span>`;
                linePickup.classList[value ? 'remove' : 'add']('d-none');
                break;
            case 'machine':
                const machine = _ui.currentMachineSelected.value;
                machine.innerHTML = `${value} <span onclick="DashboardSMT.clearFilter(this)" data-type="machine" data-value="${value}" class="cursor-pointer">x</span>`;
                machine.classList[value ? 'remove' : 'add']('d-none');

                const machinePickup = _ui.currentMachinePickupSelected.value;
                machinePickup.innerHTML = `${value} <span onclick="DashboardSMT.clearFilter(this)" data-type="machine" data-value="${value}" class="cursor-pointer">x</span>`;
                machinePickup.classList[value ? 'remove' : 'add']('d-none');
                break;
            case 'errorCode':
                const errorCode = _ui.currentErrorSelected.value;
                errorCode.innerHTML = `${value} <span onclick="DashboardSMT.clearFilter(this)" data-type="errorCode" data-value="${value}" class="cursor-pointer">x</span>`;
                errorCode.classList[value ? 'remove' : 'add']('d-none');
                break;
            default:
                break;
        }
    }

    /**
     * Thay đổi tên báo cáo
     * @param {'lineName'|'machine'} prop 
     * @param {string|null} value 
     */
    function _showCurrentHeaderReport(prop, value) {
        const { value: currentLineReportHeader } = _ui.currentLineReportHeader;
        const { value: currentMachineReportHeader } = _ui.currentMachineReportHeader;
        const { value: currentPickupReportHeader } = _ui.currentPickupReportHeader;
        switch (prop) {
            case 'lineName':
                currentLineReportHeader && (currentLineReportHeader.innerHTML = `Downtime report of line ${value ?? 'All'}`);
                currentPickupReportHeader && (currentPickupReportHeader.innerHTML = `Pickup Rate Report ${value ?? 'All'}`);
                break;
            case 'machine':
                currentMachineReportHeader && (currentMachineReportHeader.innerHTML = `Downtime report of machine ${value ?? 'All'}`);
                currentPickupReportHeader && (currentPickupReportHeader.innerHTML = `Pickup Rate Report ${value ?? 'All'}`);
                break;
            default:
                break;
        }
    }

    /**
     * Ẩn phần tử một cách an toàn.
     * @param {HTMLElement | null} element 
     */
    function _safeHide(element) {
        if (!element) {
            console.warn('Element is not exiting for hidding operation.');
        } else if (element.classList.contains('d-none')) {
            console.warn('Element has been hidden, you don\'t need to trigger hidding operation.');
        } else {
            element.classList.add('d-none');
        }
    }

    /**
     * Hiện phần tử một cách an toàn.
     * @param {HTMLElement | null} element 
     */
    function _safeShow(element) {
        if (!element) {
            console.warn('Element is not exiting for showing operation.');
        } else if (!element.classList.contains('d-none')) {
            console.warn('Element has been shown, you don\'t need to trigger showing operation.');
        } else {
            element.classList.remove('d-none');
        }
    }

    /**
     * Ẩn report name và layout của thẻ trong layout.
     */
    function _hideReportName() {
        _safeHide(_ui.reportName.value);
        _ui.agentProgress.value?.classList.replace('progress--report', 'progress--main');
        _ui.agentPlayground.value?.classList.replace('mt-4', 'mt-2');
    }

    /**
     * Hiện thị report name và layout của thẻ trong layout.
     */
    function _showReportName() {
        _safeShow(_ui.reportName.value);
        _ui.agentProgress.value?.classList.replace('progress--main', 'progress--report');
        _ui.agentPlayground.value?.classList.replace('mt-2', 'mt-4');
    }

    function switchToScreen(num) {
        ScreenController.switchTo(`screen${num}`, {
            onComplete: function (screenName) {
                switch (screenName) {
                    case 'screen1':
                        _showAppPanel();
                        _hideReportName();
                        _drawPanelContent(_state.itemsReport);
                        break;
                    case 'screen2':
                        if (_ui.reportName.value) {
                            _ui.reportName.value.innerHTML = `
                            <button class="btn btn-sm btn-dark bg-body d-flex align-items-center rounded-3" onclick="DashboardSMT.switchToHome()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 12.002H19m-8 6s-6-4.419-6-6s6-6 6-6"></path></svg>
                                Back
                            </button>
                            <span id="currentMachineReportHeader">
                              Downtime report of machine ${_state.machine}
                            </span>`;
                        }
                        _showAppPanel();
                        _showReportName();
                        _drawPanelContent(_state.itemsReport);
                        break;
                    case 'screen3':
                        if (_ui.reportName.value) {
                            _ui.reportName.value.innerHTML = `
                            <button class="btn btn-sm btn-dark bg-body d-flex align-items-center rounded-3" onclick="DashboardSMT.switchToHome()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 12.002H19m-8 6s-6-4.419-6-6s6-6 6-6"></path></svg>
                                Back
                            </button>
                            <span id="currentLineReportHeader">
                                Downtime report of line ${_state.lineName}
                            </span>`;
                        }
                        _showAppPanel();
                        _showReportName();
                        _drawPanelContent(_state.itemsReport);

                        break;
                    case 'screen4':
                        if (_ui.reportName.value) {
                            _ui.reportName.value.innerHTML = `
                            <button class="btn btn-sm btn-dark bg-body d-flex align-items-center rounded-3" onclick="DashboardSMT.switchToHome()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 12.002H19m-8 6s-6-4.419-6-6s6-6 6-6"></path></svg>
                                Back
                            </button>
                            <span id="currentPickupReportHeader">
                                Pickup rate report ${_state.machine || _state.lineName}
                            </span>
                            `;
                        }
                        _showAppPanel();
                        _showReportName();
                        _drawPanelContent(_state.itemsReport);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    function openRightAside() {
        _state.currentTransform = 'rightOpen';
        _ui.appAsideRight.value.classList.remove('opacity-0', 'app_aside-right--collapsed');
        _ui.appAsideLeft.value.classList.add('opacity-0', 'app_aside-left--collapsed', 'hide');
    }

    function openLeftAside() {
        _state.currentTransform = 'leftOpen';
        _ui.appAsideRight.value.classList.add('opacity-0', 'app_aside-right--collapsed', 'hide');
        _ui.appAsideLeft.value.classList.remove('opacity-0', 'app_aside-left--collapsed');
    }

    function closeAside() {
        _state.currentTransform = 'center';
        _ui.appAsideRight.value.classList.add('opacity-0', 'app_aside-right--collapsed');
        _ui.appAsideRight.value.classList.remove('hide');
        _ui.appAsideLeft.value.classList.add('opacity-0', 'app_aside-left--collapsed');
        _ui.appAsideLeft.value.classList.remove('hide');
    }

    function toggleLeftAside() {
        if (_state.currentTransform != 'leftOpen') {
            openLeftAside();
            return;
        }
        closeAside();
    }

    function toggleRightAside() {
        if (_state.currentTransform != 'rightOpen') {
            openRightAside();
            return;
        }
        closeAside();
    }

    /**
     * 
     * @param {string} errorCode 
     */
    async function _loadStroubleShooting(errorCode) {
        errorCode && drawStroubleShootingDoc(errorCode);
    }

    async function _loadNozzlesPickup({ factory = '', project = '', building = '', section = '', lineName = '', machine = '', timeSpan = '' }) {
        let data = await getNozzlesPickup({ factory, project, building, section, lineName, timeSpan, machine }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, 'NOZZLE_PICKUP')
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawNozzlesPickup(_state, []);
            return;
        }
        if (data.length > 10) {
            data = data.slice(0, 10)
        }
        drawNozzlesPickup(_state, data);
    }

    async function _loadFeedersPickup({ factory = '', project = '', building = '', section = '', lineName = '', machine = '', timeSpan = '' }) {
        let data = await getFeedersPickup({ factory, project, building, section, lineName, machine, timeSpan }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, 'FEEDER_PICKUP')
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawFeedersPickup(_state, []);
            return;
        }
        if (data.length > 10) {
            data = data.slice(0, 10)
        }
        drawFeedersPickup(_state, data);
    }

    async function _loadMachinesPickup({ factory = '', project = '', building = '', section = '', lineName = '', timeSpan = '', machine = '' }) {
        let data = await getMachinesPickup({ factory, project, building, section, lineName, machine, timeSpan }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, 'MACHINE_PICKUP')
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawMachinesPickup(_state, []);
            return;
        }
        if (data.length > 10) {
            data = data.slice(0, 10)
        }
        drawMachinesPickup(_state, data);
    }

    async function _loadLinesPickup({ factory = '', project = '', building = '', section = '', lineName = '', workDate = '', timeSpan = '', machine = '' }) {
        let data = await getLinesPickup({ factory, project, building, section, lineName, workDate, timeSpan, machine }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, 'LINE_PICKUP')
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawLinesPickup(_state, []);
            return;
        }
        drawLinesPickup(_state, data);
    }

    let globalDetailData;
    async function _loadFailuresDetail({ factory = '', project = '', building = '', section = '', lineName = '', timeSpan = '', machine = '', min = 300 }) {
        let data = await getFailuresDetail({ factory, project, building, section, lineName, timeSpan, machine, min }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, 'FAILURE_DETAIL');
        globalDetailData = data;
        function troubleShootingCallback() {
            return (errorCode) => {
                document.getElementById('strouble-shooting-doc').src = `${BASE_URL}js/libs/pdfjs/web/viewer.html?file=${BASE_URL}assets/pdf/document.pdf#search=${errorCode}`
                DashboardSMT.switchToScreen(5);
            }
        }

        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawFailuresDetail([], { troubleShootingCallback, buttonsDisplay: [] });
            drawFailuresRecent([], { troubleShootingCallback, buttonsDisplay: [] });
            return;
        }
        drawFailuresDetail(data, { troubleShootingCallback });
        drawFailuresRecent(data.slice(0, 12), { troubleShootingCallback, buttonsDisplay: [] });
        _state.errorCode && _handleSelectErrorCode(_state.errorCode);
    }

    let tempId, tempErrorId;
    const handleShowRootCause = (id, errorId, rootCause, correctiveAction) => {
        const modalRootCause = new bootstrap.Modal('#modal-root-cause');
        modalRootCause.show();

        tempId = id;
        tempErrorId = errorId;

        document.querySelector('#root-cause').value = ['na', 'NA', 'n/a', 'N/A', 'null', 'undefined'].includes(rootCause) || !rootCause ? '' : rootCause;
        document.querySelector('#corrective-action').value = ['na', 'NA', 'n/a', 'N/A', 'null', 'undefined'].includes(correctiveAction) || !correctiveAction ? '' : correctiveAction;
    }

    const postSubmitRootCause = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.target;
        if (!form.checkValidity()) {
            e.target.classList.add('was-validated');
            return;
        }

        const params = new URLSearchParams({
            idRecord: tempId,
            errorId: tempErrorId,
            rootCause: form['root-cause'].value,
            correctiveAction: form['corrective-action'].value
        }).toString();

        const res = await fetch(`/genai-system/api/genai/saveRootCause?${params}`, {
            method: 'POST'
        });
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message);
        }

        if (result.code == 'SUCCESS') {
            Swal.fire({
                title: "Success",
                text: "Save note successfully",
                icon: "success"
            });

            const modal = bootstrap.Modal.getInstance(document.getElementById('modal-root-cause'));
            modal.hide();

            _loadFailuresDetail({});
        } else {
            Swal.fire({
                title: "Error",
                text: "Failed to save note",
                icon: "error"
            });
        }
    }

    window.handleShowRootCause = handleShowRootCause;
    window.postSubmitRootCause = postSubmitRootCause;

    async function _loadLinesDownTimeTrend({ factory = '', project = '', building = '', section = '', lineName = '', timeSpan = '' }) {
        let data = await getLinesDowntimeTrend({ factory, project, building, section, lineName, timeSpan }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "LINE_DOWNTIME_TREND")
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawLinesDowntimeTrend(_state, []);
            return;
        }
        drawLinesDowntimeTrend(_state, data);
    }

    async function _loadDownTimeTrend({ factory = '', project = '', building = '', section = '', lineName = '', timeSpan = '', machine = '', errorCode = '' }) {
        let data = await getDowntimeTrend({ factory, project, building, section, lineName, timeSpan, machine, errorCode }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "DOWNTIME_TREND");
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawDowntimeTrend(_state, []);
            return;
        }
        drawDowntimeTrend(_state, data);
    }

    async function _loadPickupRateTrend({ timeSpan }) {
        let data = await getPickupRateTrend({ timeSpan }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "PICKUP_RATE_TREND")
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            Logger.error(messageState.error?.message);
            drawPickupRateTrend(_state, []);
            return;
        }
        if (data.length > 10) {
            data = data.slice(0, 10)
        }
        drawPickupRateTrend(_state, data);
    }

    async function _loadErrorsFailure({ factory = '', project = '', building = '', section = '', lineName = '', machine = '', timeSpan = '' }) {
        let data = await getErrorsFailure({ factory, project, building, section, lineName, machine, timeSpan }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "ERROR_FAILURE")
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            if (_opts.setting.opts.typeChartDowntimeByError == 'mirror') {
                _ui.chart4.value.classList.remove('d-none');
                _ui.chart4Legend.value.classList.remove('d-none');
                _ui.chart4LegendPareto.value.classList.add('d-none');
                _ui.chart4Pareto.value.classList.add('d-none');
                drawErrorsFailure({
                    data: [],
                    state: _state,
                    drawer: _opts
                });
            } else if (_opts.setting.opts.typeChartDowntimeByError == 'pareto') {
                _ui.chart4.value.classList.add('d-none');
                _ui.chart4Legend.value.classList.add('d-none');
                _ui.chart4LegendPareto.value.classList.remove('d-none');
                _ui.chart4Pareto.value.classList.remove('d-none');
                drawErrorsFailurePareto({
                    data: [],
                    state: _state,
                    drawer: _opts
                })
            }
            return;
        }
        if (_opts.setting.opts.typeChartDowntimeByError == 'mirror') {
            _ui.chart4.value.classList.remove('d-none');
            _ui.chart4Legend.value.classList.remove('d-none');
            _ui.chart4LegendPareto.value.classList.add('d-none');
            _ui.chart4Pareto.value.classList.add('d-none');
            drawErrorsFailure({
                data,
                state: _state,
                drawer: _opts,
                onClick: (error) => {
                    const errorName = error.name.split('(#')[0];
                    _state.errorCode = errorName;
                }
            });
        } else if (_opts.setting.opts.typeChartDowntimeByError == 'pareto') {
            _ui.chart4.value.classList.add('d-none');
            _ui.chart4Legend.value.classList.add('d-none');
            _ui.chart4LegendPareto.value.classList.remove('d-none');
            _ui.chart4Pareto.value.classList.remove('d-none');
            drawErrorsFailurePareto({
                data,
                state: _state,
                drawer: _opts,
                onClick: (error) => {
                    const errorName = error.name.split('(#')[0];
                    _state.errorCode = errorName;
                }
            })
        }
    }

    async function _loadMachinesFailure({ factory = '', project = '', building = '', section = '', lineName = '', timeSpan = '', machine = '' }) {
        let data = await getMachinesFailure({ factory, project, building, section, lineName, timeSpan, machine }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "MACHINE_FAILURE")
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            Logger.error(messageState.error?.message);
            drawMachinesFailure({
                data: [],
                state: _state,
                drawer: _opts,
                onClick: (machine) => {
                    const machineName = machine.name.split('(#')[0];
                    _state.machine = machineName;
                    _updateCascader(_state);
                }
            });
            return;
        }
        drawMachinesFailure({
            data,
            state: _state,
            drawer: _opts,
            onClick: (machine) => {
                const machineName = machine.name.split('(#')[0];
                _state.machine = machineName;
                _updateCascader(_state);
            }
        });
    }

    async function _loadMachineHoursDownTime({ factory = '', project = '', building = '', section = '', lineName = '', workDate = '', machine = '' }) {
        let data = await getHoursFailure({ factory, project, building, section, lineName, workDate, machine, errorCode: '' }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "HOUR_DOWNTIME")
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            Logger.error(messageState.error?.message);
            drawMachineHoursDownTime(_state, []);
            return;
        }
        drawMachineHoursDownTime(_state, data);
    }

    async function _loadLineHoursDownTime({ factory = '', project = '', building = '', section = '', lineName = '', workDate = '' }) {
        let data = await getHoursFailure({ factory, project, building, section, lineName, workDate, machine: '', errorCode: '' }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "HOUR_DOWNTIME")
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            Logger.error(messageState.error?.message);
            drawLineHoursDownTime(_state, []);
            return;
        }
        drawLineHoursDownTime(_state, data);
    }

    async function _loadLinesDownTime({ factory = '', project = '', building = '', section = '', lineName = '', timeSpan = '' }) {
        let data = await getLinesFailure({ factory, project, building, section, lineName, timeSpan }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "LINE_DOWNTIME")
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            Logger.error(messageState.error?.message);
            drawLinesDownTime(_state, []);
            return;
        }
        drawLinesDownTime(_state, data);
    }

    async function _loadMachinesDownTime({ factory = '', project = '', building = '', section = '', lineName = '', timeSpan = '', machine = '' }) {
        let data = await getMachinesFailure({ factory, project, building, section, lineName, timeSpan, machine }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "MACHINE_DOWNTIME")
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            Logger.error(messageState.error?.message);
            drawMachinesDownTime(_state, []);
            return;
        }
        drawMachinesDownTime(_state, data);
    }

    async function _loadDownTimeOverall({ factory = '', project = '', building = '', section = '', lineName = '', timeSpan = '', machine = '', errorCode = '' }) {
        let data = await getDowntime({ factory, project, building, section, lineName, machine, timeSpan, errorCode }) ?? [];
        Array.isArray(data) || (data = []);
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            Logger.error(messageState.error?.message);
            drawDowntime({
                data: [0, 0],
                state: _state,
                downtimeRateElement: _ui.downTimeRate.value,
                availabilityRateElement: _ui.availabilityRate.value,
                workDateDisplayDateElement: _ui.workDateDisplayDate.value,
                workDateDisplayDayElement: _ui.workDateDisplayDay.value,
            });
            return;
        }
        drawDowntime({
            data: standalizeData(data, "DOWNTIME"),
            state: _state,
            downtimeRateElement: _ui.downTimeRate.value,
            availabilityRateElement: _ui.availabilityRate.value,
            workDateDisplayDateElement: _ui.workDateDisplayDate.value,
            workDateDisplayDayElement: _ui.workDateDisplayDay.value,
        });
    }

    async function _loadPickupOverall({ timeSpan = '' }) {
        let data = await getPickupRateTrend({ timeSpan }) ?? [];
        Array.isArray(data) || (data = []);
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            Logger.error(messageState.error?.message);
            drawPickupRate({
                data: [0, 0],
                state: _state,
                downtimeRateElement: _ui.throwRate.value,
                availabilityRateElement: _ui.pickupRate.value,
                workDateDisplayDateElement: _ui.workDateDisplayDatePickup.value,
                workDateDisplayDayElement: _ui.workDateDisplayDayPickup.value,
            });
            return;
        }
        drawPickupRate({
            data: standalizeData(data, "PICKUP_RATE"),
            state: _state,
            downtimeRateElement: _ui.throwRate.value,
            availabilityRateElement: _ui.pickupRate.value,
            workDateDisplayDateElement: _ui.workDateDisplayDatePickup.value,
            workDateDisplayDayElement: _ui.workDateDisplayDayPickup.value,
        });
    }

    async function _loadJudgesLine({ factory = '', project = '', building = '', section = '', timeSpan = '', lineName = '' }) {
        if (lineName) {
            let data = await getJudgesItem({ factory, project, building, section, value: lineName, timeSpan, typeFind: 'byLine' }) ?? {};
            typeof data === 'object' || (data = {});
            if (hasError()) {
                toast.error('Access data failing', messageState.error?.message);
                drawJudgesLine({});
                return;
            }
            drawJudgesLine(standalizeData(data, 'JUDGES_ITEM'));
        } else {
            drawJudgesLine({});
        }
    }

    async function _loadJudgesMachine({ factory = '', project = '', building = '', section = '', timeSpan = '', machine = '' }) {
        if (machine) {
            let data = await getJudgesItem({ factory, project, building, section, value: machine, timeSpan, typeFind: 'byMachine' }) ?? {};
            typeof data === 'object' || (data = {});
            if (hasError()) {
                toast.error('Access data failing', messageState.error?.message);
                drawJudgesMachine({});
                return;
            }
            drawJudgesMachine(standalizeData(data, 'JUDGES_ITEM'));
        } else {
            drawJudgesMachine({});
        }
    }

    async function _loadPickupsStatus({ factory = '', project = '', building = '', section = '', lineName = '', machine = '', timeSpan = '' }) {
        let data = await getPickupTracking({ factory, project, building, section, lineName, machine, timeSpan }) ?? [];
        Array.isArray(data) || (data = []);
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawPickupTracking({
                state: _state,
                data: [],
                element: _ui.tablePickupStatus.value
            });
            return;
        }
        drawPickupTracking({
            state: _state,
            data: standalizeData(data, "PICKUP_TRACKING"),
            element: _ui.tablePickupStatus.value
        });
    }

    async function _loadHoursFailure({ factory = '', project = '', building = '', section = '', lineName = '', machine = '', errorCode = '', workDate = dayjs().format('YYYY/MM/DD') }) {
        let data = await getHoursFailure({ factory, project, building, section, lineName, machine, errorCode, workDate }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "HOUR_FAILURE");
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawHoursFailure(_state, []);
            return;
        }
        drawHoursFailure(_state, data);
    }

    async function _loadLinesFailure({ factory = '', project = '', building = '', section = '', lineName = '', timeSpan = '' }) {
        let data = await getLinesFailure({ factory, project, building, section, lineName, timeSpan }) ?? [];
        Array.isArray(data) || (data = []);
        data = standalizeData(data, "LINE_FAILURE")
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            if (_opts.setting.opts.typeChartDowntimeByLine == 'mirror') {
                _ui.chart2.value.classList.remove('d-none');
                _ui.chart2Column.value.classList.add('d-none');
                drawLinesFailure({
                    data: [],
                    state: _state,
                    drawer: _opts,
                    onClick: (line) => {
                        const lineName = line.name.split('(#')[0];
                        _state.lineName = lineName;
                        _updateCascader(_state);
                    }
                });
            } else if (_opts.setting.opts.typeChartDowntimeByLine == 'column') {
                _ui.chart2.value.classList.add('d-none');
                _ui.chart2Column.value.classList.remove('d-none');
                drawLinesFailureColumn({
                    data: [],
                    state: _state,
                    drawer: _opts,
                    onClick: (line) => {
                        const lineName = line.name.split('(#')[0];
                        _state.lineName = lineName;
                        _updateCascader(_state);
                    }
                });
            }
            return;
        }
        if (_opts.setting.opts.typeChartDowntimeByLine == 'mirror') {
            _ui.chart2.value.classList.remove('d-none');
            _ui.chart2Column.value.classList.add('d-none');
            drawLinesFailure({
                data: data,
                state: _state,
                drawer: _opts,
                onClick: (line) => {
                    const lineName = line.name.split('(#')[0];
                    _state.lineName = lineName;
                    _updateCascader(_state);
                }
            });
        } else if (_opts.setting.opts.typeChartDowntimeByLine == 'column') {
            _ui.chart2.value.classList.add('d-none');
            _ui.chart2Column.value.classList.remove('d-none');
            drawLinesFailureColumn({
                data: data,
                state: _state,
                drawer: _opts,
                onClick: (line) => {
                    const lineName = line.name.split('(#')[0];
                    _state.lineName = lineName;
                    _updateCascader(_state);
                }
            });
        }
    }

    async function _loadMachinesStatus({ factory = '', project = '', building = '', section = '', lineName = '', machine = '' }) {
        let data = await getMachinesStatus({ factory, project, building, section, lineName, machine }) ?? [];
        Array.isArray(data) || (data = []);
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawMachinesStatus({
                state: _state,
                data: [],
                element: _ui.tableMachinesStatus.value,
            });
            return;
        }
        drawMachinesStatus({
            state: _state,
            data: standalizeData(data, "MACHINE_STATUS"),
            element: _ui.tableMachinesStatus.value,
        });

        checkRedirectToReport();
    }

    /**
     * 
     * @param {T.ItemNeedReport[] | undefined} itemsNeedReport 
     */
    function checkRedirectToReport(itemsNeedReport) {
        if (itemsNeedReport && itemsNeedReport.length > 0) {
            if (_state.reportLine || _state.reportMachine || _state.reportPickup) {
                const line = itemsNeedReport.find(item => item.lineName);
                const machine = itemsNeedReport.find(item => item.machine);
                _state.lineName = line;
                _state.machine = machine;
            }
        }
        if (_state.reportLine || _state.reportMachine || _state.reportPickup) {
            _state.reportLine && _state.lineName && (viewLineReport(_state.lineName), _state.reportLine = '');
            _state.reportMachine && _state.machine && (viewMachineReport(_state.machine), _state.reportMachine = '');
            _state.reportPickup && _state.lineName && (viewLinePickupReport(_state.lineName), _state.reportPickup = '');
            _state.reportPickup && _state.machine && (viewMachinePickupReport(_state.machine), _state.reportPickup = '');
        }
    }

    /**
     * Hàm cập nhập lại `_state.timeSpan` và `_state.workDate`
     * 
     * @author Lamlib
     * @param {[Date]} selectedDates Thời gian bắt đầu và kết thúc của bộ chọn thời gian
     * @param {T.State} state Biến trạng thái dùng chung
     */
    function _handleChangeTimeSpan(selectedDates, state) {
        const endDate = dayjs(selectedDates[0]).format('YYYY/MM/DD 23:59:59');
        state.workDate = endDate;
        state.timeSpan = dayjs(selectedDates[0]).subtract(6, 'day').format('YYYY/MM/DD 00:00:01') + ' - ' + endDate;
    }

    async function _loadItemsFilter() {
        let data = await getItemsFilter() ?? {};
        typeof data == 'object' || (data = {});
        if (hasError()) {
            toast.error('Access data failing', messageState.error?.message);
            drawItemsFilter(_state, {});
            return;
        }
        drawItemsFilter(_state, standalizeData(data, 'ITEMS_FILTER'));
    }

    const loopRealtimeMachineStatus = Utils.debounceAsync(async () => {
        await _loadMachinesStatus({
            factory: _state.factory ?? _state.systemFactory ?? '',
            building: _state.building ?? _state.systemBuilding ?? '',
            project: _state.project ?? _state.systemProject ?? '',
            section: _state.section ?? _state.systemSection ?? '',
            lineName: _state.lineName ?? _state.systemLineName ?? '',
            machine: _state.machine ?? _state.systemMachine ?? '',
        });
        await loopRealtimeMachineStatus();
    }, 2000);

    function scrollizeForWriteAgent() {
        const agentPlayground = _ui.agentPlayground.value;
        if (agentPlayground) {
            new AutoScrollElement(agentPlayground);
        } else {
            console.warn('Play ground is missing for creating auto scroll element');
        }
    }

    /**
     * Khởi tạo dashboard SMT bắt đầu từ đây
     * @param {T.OptsDashboardSMT} opts
     */
    async function init(opts = {}) {
        Utils.merge(_opts, opts);
        // Làm cho thẻ chứa tin nhắn agent tại vùng chính (dưới header) tự động scroll tới đáy khi nội dung bị tràn
        scrollizeForWriteAgent();

        _showCurrentBadge('lineName', _state.lineName);
        _showCurrentBadge('machine', _state.machine);
        _showCurrentBadge('errorCode', _state.errorCode);


        writerAgent('Summary capacity status', _state, checkRedirectToReport);

        ScreenController.init(_opts);

        await _loadItemsFilter();

        _state.flatpickr = createFlatPickr({
            defaultDate: dayjs().format('YYYY-MM-DD'),
            uiTimeSpan: _ui.timeSpan.value,
            onUpdateWorkPeriod: (selectedDates) => { _handleChangeTimeSpan(selectedDates, _state) },
        });

        addEventListener('message', (messageEvent) => Utils.debounceAsync(handleMessageFromAgent({
            messageEvent,
            screenController: ScreenController,
            state: _state,
            uiFullScreen: _ui.appAsideRight.value
        })))

        document.getElementById('agent-interaction').addEventListener('click', (e) => {
            /**@type{HTMLElement} */
            const ele = e.target;
            const btn = ele.closest('button');
            if (btn) {
                Swal.fire({
                    title: 'Detail analysis',
                    text: 'For detail analysis, I need open in fullscreen mode.',
                    showCancelButton: true,
                    confirmButtonText: 'Continue',
                    cancelButtonText: 'Cancel',
                    icon: 'question'
                }).then((result) => {
                    if (result.isConfirmed) {
                        _openOrFocusTab(
                            _state.agentWindowRef,
                            `${agentUiUrl}?apiUrl=${agentUrl}&assistantId=agent&appTheme=light&hideToolCalls=true&defaultQuestion=${encodeURI(btn.textContent)}`,
                            btn.textContent
                        )
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // writerAgent(btn.textContent, _state);
                    }
                });
            }
        });

        document.addEventListener('click', (e) => {
            /**@type{HTMLElement} */
            const ele = e.target;
            const btn = ele.closest('button');
            if (btn && btn.hasAttribute('data-machine') && btn.hasAttribute('is-btn-analysis')) {
                const machineName = btn.getAttribute('data-machine');
                viewMachineReport(machineName);
            }
            if (btn && btn.hasAttribute('data-machine') && btn.hasAttribute('is-btn-analysis-pickup')) {
                const machineName = btn.getAttribute('data-machine');
                viewMachinePickupReport(machineName);
            }
            if (btn && btn.hasAttribute('data-machine') && btn.hasAttribute('is-btn-ai-port')) {
                const machineName = btn.getAttribute('data-machine');
                _openOrFocusTab(
                    _state.agentWindowRef,
                    `${agentUiUrl}?apiUrl=${agentUrl}&assistantId=agent&appTheme=light&hideToolCalls=true&defaultQuestion=Analyze%20machine%20${machineName}`,
                    `Analyze machine ${machineName}`
                );
            }
            if (btn && btn.hasAttribute('data-line') && btn.hasAttribute('is-btn-analysis')) {
                const lineName = btn.getAttribute('data-line');
                viewLineReport(lineName);
            }
            if (btn && btn.hasAttribute('data-line') && btn.hasAttribute('is-btn-analysis-pickup')) {
                const lineName = btn.getAttribute('data-line');
                viewLinePickupReport(lineName);
            }
            if (btn && btn.hasAttribute('data-line') && btn.hasAttribute('is-btn-ai-port')) {
                const lineName = btn.getAttribute('data-line');
                _openOrFocusTab(
                    _state.agentWindowRef,
                    `${agentUiUrl}?apiUrl=${agentUrl}&assistantId=agent&appTheme=light&hideToolCalls=true&defaultQuestion=Analyze%20line%20${lineName}`,
                    `Analyze line ${lineName}`
                );
            }
        })
        const { createMirrorCharts } = _opts;
        createMirrorCharts.call(_opts);
        addEventListener('resize', createMirrorCharts.bind(_opts));
        LiveStatus.init({ containerId: 'machine-live-status', status: 0 });
        _setupEventListener();
    }

    function _setupEventListener() {
        const lowestTimeDisplay = _ui.lowestTimeDisplay.value;
        if (lowestTimeDisplay) {
            lowestTimeDisplay.addEventListener('change', (event) => {
                const selection = event.currentTarget;
                if (selection instanceof HTMLSelectElement) {
                    let seconds = +selection.value;
                    if (Number.isNaN(seconds)) seconds = 0;
                    _state.minSecondQueryDetail = seconds;
                }
            });
        } else {
            console.error('Lowest time display is not exit, please ensure that this DOM have completed loaded or being exit!')
        }
    }

    function viewMachineReport(machineName) {
        writerAgent(`Summarize machine ${machineName}`, _state);
        const machines = dataStore.get('getMachinesStatus') ?? [];
        const machine = standalizeData([machines.find(m => m.MACHINE_NO === machineName) ?? {}], 'MACHINE_STATUS')?.[0] ?? {};
        drawMachineInformation(machine, document.getElementById('machine-information'));
        document.getElementById('machineReportAIPort').setAttribute('data-machine', machineName);
        LiveStatus.init({ containerId: 'machine-live-status', status: machine.machineStatus });
        _state.lineName = '';
        _state.machine = machineName;
        _updateCascader(_state);
        _state.itemsReport = _state.itemsNeedReport.filter(item => item.machine != machineName).map((items) => {
            return {
                category: 'machine',
                value: items.machine,
            }
        });
        _state.itemsReport.unshift(({
            value: machineName,
            category: 'machinePickup',
        }));
        switchToScreen(2);
    }

    function viewLineReport(lineName) {
        writerAgent(`Summarize line ${lineName}`, _state);
        const machines = dataStore.get('getMachinesStatus') ?? [];
        const machinesFilter = standalizeData(machines.filter(m => m.LINE_NAME === lineName) ?? [], 'MACHINE_STATUS') ?? [];
        drawLineInformation(machinesFilter, document.getElementById('line-information'));
        document.getElementById('lineReportAIPort').setAttribute('data-line', lineName);
        _state.machine = '';
        _state.lineName = lineName;
        _updateCascader(_state);
        _state.itemsReport = _state.itemsNeedReport.filter(item => item.lineName != lineName).map((items) => {
            return {
                category: 'line',
                value: items.lineName,
            }
        });
        _state.itemsReport.unshift(({
            category: 'linePickup',
            value: lineName,
        }));
        switchToScreen(3);
    }

    function viewLinePickupReport(lineName) {
        writerAgent(`Summarize pickup line ${lineName}`, _state);
        const machines = dataStore.get('getMachinesStatus') ?? [];
        const machinesFilter = standalizeData(machines.filter(m => m.LINE_NAME === lineName) ?? [], 'MACHINE_STATUS') ?? [];
        drawLineInformation(machinesFilter, document.getElementById('line-information'));
        _state.machine = '';
        _state.lineName = lineName;
        _updateCascader(_state);
        _state.itemsReport = _state.itemsNeedReport.filter(item => item.lineName != _state.lineName).map((items) => {
            return {
                category: 'linePickup',
                value: items.lineName,
            }
        });
        switchToScreen(4);
    }

    function viewMachinePickupReport(machineName) {
        writerAgent(`Summarize pickup machine ${machineName}`, _state);
        const machines = dataStore.get('getMachinesStatus') ?? [];
        const machine = standalizeData([machines.find(m => m.MACHINE_NO === machineName) ?? {}], 'MACHINE_STATUS')?.[0] ?? {};
        drawMachineInformation(machine, document.getElementById('machine-information'));
        LiveStatus.init({ containerId: 'machine-live-status', status: machine.machineStatus });
        _state.machine = machineName;
        _state.lineName = '';
        _updateCascader(_state);
        _state.itemsReport = _state.itemsNeedReport.filter(item => item.machine != _state.machine).map((items) => {
            return {
                category: 'machinePickup',
                value: items.machine,
            }
        });
        switchToScreen(4);
    }

    function changeDowntimeType(type) {
        switch (type) {
            case 'by hours':
                _ui.chart7.value?.classList.remove('d-none');
                _ui.chart5.value?.classList.add('d-none');
                _ui.chart7Legend.value.classList.replace('d-none', 'd-flex');
                _ui.chart5Legend.value.classList.replace('d-flex', 'd-none');
                break;
            default:
                _ui.chart7.value?.classList.add('d-none');
                _ui.chart5.value?.classList.remove('d-none');
                _ui.chart7Legend.value.classList.replace('d-flex', 'd-none');
                _ui.chart5Legend.value.classList.replace('d-none', 'd-flex');
                break;
        }
    }

    function changeLineDowntimeType(type) {
        switch (type) {
            case 'by hours':
                _ui.chart13.value.classList.remove('d-none');
                _ui.chart6.value.classList.add('d-none');
                break;
            default:
                _ui.chart13.value.classList.add('d-none');
                _ui.chart6.value.classList.remove('d-none');
                break;
        }
    }

    function refreshAgentInteraction() {
        writerAgent(FORCE_RECALL_LAST_MESSAGE, _state);
    }

    function switchToHome() {
        writerAgent('Summary capacity status', _state);
        ['factory', 'building', 'project', 'section', 'lineName', 'machine'].forEach(prop => {
            _state[prop] = null;
        });
        _updateCascader(_state);
        switchToScreen(1);
    }

    function toggleAppPanel() {
        const reportPanel = _ui.reportPanel.value;
        if (!reportPanel) {
            console.warn('Report panel is not exiting for toggle operation');
        } else {
            if (reportPanel.classList.contains('open')) {
                gsap.to(reportPanel, { x: '18.6rem', ease: 'expoScale(0.5,7,power2.in)', duration: 0.3 });
                reportPanel.classList.remove('open');
                reportPanel.querySelector('.arrow-open')?.classList.remove('d-none'); //TODO: change to index for using DOMRef for increasing better performance
                reportPanel.querySelector('.arrow-close')?.classList.add('d-none'); //TODO: change to index for using DOMRef for increasing better performance
            } else {
                gsap.to(reportPanel, { x: '0rem', ease: 'expoScale(0.5,7,power2.out)', duration: 0.3 });
                reportPanel.classList.add('open');
                reportPanel.querySelector('.arrow-open').classList.add('d-none'); //TODO: change to index for using DOMRef for increasing better performance
                reportPanel.querySelector('.arrow-close').classList.remove('d-none'); //TODO: change to index for using DOMRef for increasing better performance
            }
        }
    }

    function _hideAppPanel() {
        const reportPanel = _ui.reportPanel.value;
        if (!reportPanel) {
            console.warn('Report panel is not exiting for closing operation.');
        } else if (reportPanel.classList.contains('d-none')) {
            console.warn('Report panel is at hidden state show you don\'t need trigger hidding operation.');
        } else {
            reportPanel.classList.add('d-none');
        }
    }

    /**
     * @param {Window} winRef 
     * @param {string} href 
     * @param {string} mess 
     */
    function _openOrFocusTab(winRef, href, mess) {
        if (!winRef || winRef.closed) {
            _state.agentWindowRef = window.open(href, 'Random text');
        } else {
            winRef.focus();
            mess && winRef.postMessage(mess, {
                targetOrigin: agentUiUrl,
            });
        }
    }

    function _showAppPanel() {
        const reportPanel = _ui.reportPanel.value;
        if (!reportPanel) {
            console.warn('Report panel is not exiting for closing operation.');
            return;
        }
        if (reportPanel.classList.contains('d-none')) {
            reportPanel.classList.remove('d-none');
            return;
        }
        console.warn('Report panel is not at hidden state show, you don\'t need trigger showing operation.');
    }

    /**
     * 
     * @param {Array<T.ItemReport>} contents
     * @returns 
     */
    function _drawPanelContent(contents) {
        const reportList = _ui.reportList.value;
        if (!reportList) {
            console.warn('Report list is not exiting for displaying primity panel content.');
            return;
        }

        const reports = {
            line: [`<button type="button" onclick="DashboardSMT.triggerReport('B81S1', 'line')" class="list-group-item list-group-item-action">Create line B81S1 report</button>`],
            machine: [`<button type="button" onclick="DashboardSMT.triggerReport('B81S1H1', 'machine')" class="list-group-item list-group-item-action">Create machine B81S1H1 report</button>`],
            linePickup: [`<button type="button" onclick="DashboardSMT.triggerReport('B81S1', 'linePickup')" class="list-group-item list-group-item-action">Create pickup B81S1 report</button>`],
        };

        let reportHTML = contents.map(content => {
            const value = DOMPurify.sanitize(content.value);
            const category = content.category;
            switch (category) {
                case 'line':
                    if (value) {
                        reports.line.length == 0;
                        reports.line.push(`<button type="button" onclick="DashboardSMT.triggerReport('${value}', '${category}')" class="list-group-item list-group-item-action">Create line ${value} report</button>`);
                    }
                    return '';
                case 'machine':
                    if (value) {
                        reports.machine.length == 0;
                        reports.machine.push(`<button type="button" onclick="DashboardSMT.triggerReport('${value}', '${category}')" class="list-group-item list-group-item-action">Create machine ${value} report</button>`);
                    }
                    return '';
                case 'machinePickup':
                    return `<button type="button" onclick="DashboardSMT.triggerReport('${value}', '${category}')" class="list-group-item list-group-item-action">Create pickup ${value} report</button>`
                case 'linePickup':
                    if (value) {
                        reports.linePickup.length == 0;
                        reports.linePickup.push(`<button type="button" onclick="DashboardSMT.triggerReport('${value}', '${category}')" class="list-group-item list-group-item-action">Create pickup ${value} report</button>`);
                    }
                    return '';
                default:
                    return '';
            }
        }).join('');

        for (const k in reports) {
            reportHTML += reports[k].join('');
        }

        reportList.innerHTML = reportHTML;
    }

    async function triggerReport(value, category) {
        const reportPanel = _ui.reportPanel.value;
        if (!reportPanel) {
            console.warn('Report panel is not exiting for toggle operation')
        } else if (reportPanel.classList.contains('open')) {
            reportPanel.classList.remove('open');
            reportPanel.querySelector('.arrow-open')?.classList.remove('d-none');
            reportPanel.querySelector('.arrow-close')?.classList.add('d-none');
            await gsap.to(reportPanel, { x: '18.6rem', ease: 'expoScale(0.5,7,power2.in)', duration: 0.3 });
        }

        switch (category) {
            case 'line':
                viewLineReport(value);
                break;
            case 'machine':
                viewMachineReport(value);
                break;
            case 'machinePickup':
                viewMachinePickupReport(value);
                break;
            case 'linePickup':
                viewLinePickupReport(value);
                break;
            default:
                break;
        }
    }

    // Handle click chart pickup by line
    async function _handleClickChart17(evt) {
        _state.lineName = evt.point.key;
        _updateCascader(_state);
    }

    // Handle click chart pickup by machine
    async function _handleClickChart18(evt) {
        _state.machine = evt.point.key;
        _updateCascader(_state);
    }

    async function _handleClickChart(evt) {
        switch (this.chart.renderTo.id) {
            case 'chart17':
                _handleClickChart17.call(this, evt);
                break;
            case 'chart18':
                _handleClickChart18.call(this, evt);
                break;
            default:
                break;
        }
    }

    function changeLineAndMachine(lineName, machineName) {
        if (lineName != null) {
            _state.lineName = lineName;
        }
        if (machineName != null) {
            _state.machine = machineName;
        }
        _updateCascader(_state);
    }

    return {
        init,
        switchToScreen,
        openRightAside,
        openLeftAside,
        closeAside,
        toggleLeftAside,
        toggleRightAside,
        _state,
        _opts,
        _loadMachinesStatus,
        changeDowntimeType,
        changeLineDowntimeType,
        switchToHome,
        toggleAppPanel,
        viewMachineReport,
        changeLineAndMachine,
        viewLineReport,
        viewMachinePickupReport,
        viewLinePickupReport,
        clearFilter,
        refreshAgentInteraction,
        triggerReport,
        handleClickChart: _handleClickChart
    };
})();

window.DashboardSMT = DashboardSMT;

document.addEventListener('DOMContentLoaded', () => {
    Logger.info(`<span class="text-success">[DASHB]</span> Playground is ready after ${new Date().getTime() - PAGE_APPEAR}ms`);
    let oldSetting = localStorage.getItem(SETTING_STORE_KEY);
    if (oldSetting) {
        oldSetting = JSON.parse(oldSetting);
    }
    DashboardSMT.init({
        chatbot: Chatbot.init({
            flat: { enabled: true, container: 'appAsideRight' }
        }),
        numberOfScreen: 43,
        layoutId: 'appLayout',
        createMirrorCharts: function () {
            this.mirrorChartError = MirrorChart.chart({ container: 'chart4' });
            this.mirrorChartMachine = MirrorChart.chart({ container: 'chart3' });
            this.mirrorChartLine = MirrorChart.chart({ container: 'chart2' });
            this.dataMirrorChartError && this.mirrorChartError.updateChart(this.dataMirrorChartError);
            this.dataMirrorChartMachine && this.mirrorChartMachine.updateChart(this.dataMirrorChartMachine);
            this.dataMirrorChartLine && this.mirrorChartLine.updateChart(this.dataMirrorChartLine);
        },
        activityDetector: new UserActivityDetector({
            inactivityThreshold: 60,
            checkInterval: 1000,
        }),
        setting: new Setting(oldSetting ?? ({
            'isDeepSearch': 0,
            'typeChartDowntimeByError': 'pareto',
            'typeChartDowntimeByLine': 'column',
        }))
    });
});
