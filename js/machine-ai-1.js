import * as T from './types.js'; // eslint-disable-line no-unused-vars
import Utils from "./Utils.js";
import AutoScrollElement from './autoscroll.js';
import { handleMessageFromAgent, writerAgent } from './agent.js';
import gsap from './libs/gsap/gsap-core.js';
import { FORCE_RECALL_LAST_MESSAGE, SETTING_STORE_KEY } from './config.js';
import {renderChart1,highchartsInit,renderChart2,renderChart3,renderChart4,renderChart5} from './renderChart.js'
import {renderTable1,renderTable2} from './renderTable.js'

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
        table_1: Utils.createDOMRef('table-1'),
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
        scrollizeForWriteAgent();
        writerAgent('Summary capacity status', _state, checkRedirectToReport);
        _setupEventListener();
        highchartsInit();
       
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

  


    return {
        init,
        openRightAside,
        openLeftAside,
        closeAside,
        toggleLeftAside,
        toggleRightAside,
        switchToHome,
        toggleAppPanel,
        refreshAgentInteraction,
        
    };
})();

window.DashboardSMT = DashboardSMT;

document.addEventListener('DOMContentLoaded', () => {
    let oldSetting = localStorage.getItem(SETTING_STORE_KEY);
    if (oldSetting) {
        oldSetting = JSON.parse(oldSetting);
    }
    DashboardSMT.init({
        
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
        
    });
});
