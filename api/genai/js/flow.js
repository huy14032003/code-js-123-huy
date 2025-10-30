import * as T from './types.js'; // eslint-disable-line no-unused-vars
import Utils from "./Utils.js";
const Flow = (() => {
    /**
 * @param {Object} opts
  * @param {T.State} opts.state
  * 
  * @param {T.State} opts.observerMap
  * @param {Function} opts.loadMachinesStatus
  * @param {Function} opts.loadPickupsStatus
  * @param {Function} opts.loadDownTimeOverall
  * @param {Function} opts.loadLinesFailure
  * @param {Function} opts.loadMachinesFailure
  * @param {Function} opts.loadErrorsFailure
  * @param {Function} opts.loadDownTimeTrend
  * @param {Function} opts.loadLinesDownTimeTrend
  * @param {Function} opts.loadHoursFailure
  * @param {Function} opts.loadFailuresDetail
  * @param {Function} opts.loadLinesDownTime
  * @param {Function} opts.loadMachinesDownTime
  * @param {Function} opts.loadPickupRateTrend
  * @param {Function} opts.loadLinesPickup
  * @param {Function} opts.loadMachinesPickup
  * @param {Function} opts.loadFeedersPickup
  * @param {Function} opts.loadNozzlesPickup
  * @param {Function} opts.loadMachineHoursDownTime
  * @param {Function} opts.loadJudgesMachine
  * @param {Function} opts.loadLineHoursDownTime
  * @param {Function} opts.loadJudgesLine
  * @param {Function} opts.loadStroubleShooting
  * @returns {Promise<void>}
  */
    let handleChangeState = (opts) => {

    };

    handleChangeState = Utils.debounceAsync(async ({
        state,
        observerMap,
        loadMachinesStatus,
        loadPickupsStatus,
        loadDownTimeOverall,
        loadPickupOverall,
        loadLinesFailure,
        loadMachinesFailure,
        loadErrorsFailure,
        loadDownTimeTrend,
        loadLinesDownTimeTrend,
        loadHoursFailure,
        loadFailuresDetail,
        loadLinesDownTime,
        loadMachinesDownTime,
        loadPickupRateTrend,
        loadLinesPickup,
        loadMachinesPickup,
        loadFeedersPickup,
        loadNozzlesPickup,
        loadMachineHoursDownTime,
        loadJudgesMachine,
        loadLineHoursDownTime,
        loadJudgesLine,
        loadStroubleShooting
    }) => {
        /**
         * 
         * @param {Array<string>} props 
         */
        function cleanupObserver(props) {
            if(props) {
                props.forEach(prop => {
                    observerMap[prop] = 0;
                });
                return;
            }
            for (let i in observerMap) {
                observerMap[i] = 0;
            }
        }
        try {
            const timeSpan = state.timeSpan ?? state.systemTimeSpan ?? '';
            const workDate = state.workDate ?? state.systemWorkDate ?? '';
            const factory = state.factory ?? state.systemFactory ?? '';
            const building = state.building ?? state.systemBuilding ?? '';
            const project = state.project ?? state.systemProject ?? '';
            const section = state.section ?? state.systemSection ?? '';
            const lineName = state.lineName ?? state.systemLineName ?? '';
            const machine = state.machine ?? state.systemMachine ?? '';
            const errorCode = state.errorCode ?? state.systemErrorCode ?? '';

            if(observerMap.errorCode) {
                loadStroubleShooting(errorCode);
            }

            if(observerMap.minSecondQueryDetail) {
                loadFailuresDetail({
                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                    factory,
                    building,
                    project,
                    section,
                    lineName,
                    machine,
                    min: state.minSecondQueryDetail
                });
            }

            if ((observerMap.timeSpan && observerMap.workDate) || (observerMap.systemTimeSpan && observerMap.systemWorkDate)) {
                console.warn(`Time span & work date is changed to ${timeSpan} & ${workDate}`);
                cleanupObserver();
                await Promise.all([
                    loadPickupsStatus({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                    }),
                    loadMachinesStatus({
                        factory,
                        building,
                        project,
                        section,
                    }),
                    loadDownTimeOverall({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                    loadPickupOverall({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                    }),
                    loadLinesFailure({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                    }),
                    loadMachinesFailure({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine
                    }),
                    loadErrorsFailure({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                    loadDownTimeTrend({
                        timeSpan,
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                        errorCode
                    }),
                    loadLinesDownTimeTrend({
                        timeSpan,
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                    }),
                    loadHoursFailure({
                        workDate,
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                        errorCode,
                    }),
                    loadFailuresDetail({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                        min: state.minSecondQueryDetail
                    }),
                    loadLinesDownTime({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName
                    }).then(async () => {
                        await Promise.all([
                            loadLineHoursDownTime({
                                workDate,
                                factory,
                                building,
                                project,
                                section,
                                lineName: lineName || state.calcLineName,
                                machine,
                            }),
                            loadJudgesLine({
                                timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                factory,
                                building,
                                project,
                                section,
                                lineName: lineName || state.calcLineName,
                            }),
                        ]);
                    }),
                    loadMachinesDownTime({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }).then(async () => {
                        await Promise.all([
                            loadMachineHoursDownTime({
                                workDate,
                                factory,
                                building,
                                project,
                                section,
                                lineName,
                                machine: state.machine || state.calcMachine,
                            }),
                            loadJudgesMachine({
                                timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                factory,
                                building,
                                project,
                                section,
                                machine: state.machine || state.calcMachine,
                            }),
                        ]);
                    }),
                    loadPickupRateTrend({
                        timeSpan,
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                    loadLinesPickup({
                       timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName
                    }),
                    loadMachinesPickup({
                       timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine
                    }),
                    loadFeedersPickup({
                       timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                    loadNozzlesPickup({
                       timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                ]);
            } else if (observerMap.timeSpan || observerMap.systemTimeSpan) {
                Logger.warn('Time span is changed!');
                cleanupObserver();
                await Promise.all([
                    loadDownTimeTrend({
                        timeSpan,
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                        errorCode
                    }),
                    loadLinesDownTimeTrend({
                        timeSpan,
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                    }),
                    loadLinesDownTime({
                        timeSpan,
                        factory,
                        building,
                        project,
                        section,
                        lineName
                    }).then(async () => {
                        await Promise.all([
                            loadLineHoursDownTime({
                                workDate,
                                factory,
                                building,
                                project,
                                section,
                                lineName: lineName || state.calcLineName,
                                machine,
                            }),
                            loadJudgesLine({
                                timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                factory,
                                building,
                                project,
                                section,
                                lineName: lineName || state.calcLineName,
                            }),
                        ]);
                    }),
                    
                    loadPickupRateTrend({
                        timeSpan,
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                ]);
            } else if (observerMap.workDate || observerMap.systemWorkDate) {
                Logger.warn(`Work date is changed to ${workDate}`);
                cleanupObserver();
                await Promise.all([
                    loadLinesFailure({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                    loadMachinesFailure({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine
                    }),
                    loadPickupOverall({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                    }),
                    loadPickupsStatus({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                    }),
                    loadDownTimeOverall({
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                    }),
                    loadMachinesDownTime({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }).then(async () => {
                        await Promise.all([
                            loadMachineHoursDownTime({
                                workDate,
                                factory,
                                building,
                                project,
                                section,
                                lineName,
                                machine: state.machine || state.calcMachine,
                            }),
                            loadJudgesMachine({
                                timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                factory,
                                building,
                                project,
                                section,
                                machine: state.machine || state.calcMachine,
                            }),
                        ]);
                    }),
                    loadHoursFailure({
                        workDate,
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                        errorCode,
                    }),
                     loadErrorsFailure({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                    loadLineHoursDownTime({
                        workDate,
                        factory,
                        building,
                        project,
                        section,
                        lineName: lineName || state.calcLineName,
                        machine,
                    }),
                    loadMachineHoursDownTime({
                        workDate,
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine: state.machine || state.calcMachine,
                    }),
                    loadFailuresDetail({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                        min: state.minSecondQueryDetail
                    }),
                    loadLinesPickup({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName
                    }),
                    loadMachinesPickup({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine
                    }),
                    loadFeedersPickup({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                    loadNozzlesPickup({
                        timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        factory,
                        building,
                        project,
                        section,
                        lineName,
                        machine,
                    }),
                ]);
            } else {
                if (observerMap.factory) {
                    Logger.warn(`Factory is changed to ${factory}`);
                    cleanupObserver();
                    await Promise.all([
                        loadDownTimeOverall({
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        }),
                        loadLinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadMachinesStatus({
                            factory,
                            building,
                            project,
                            section,
                        }),
                        loadMachinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadErrorsFailure({
                           timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode
                        }),
                        loadLinesDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                        }),
                        loadHoursFailure({
                            workDate,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode,
                        }),
                        loadFailuresDetail({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            min: state.minSecondQueryDetail
                        }),
                        loadLinesDownTime({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }).then(async () => {
                            await Promise.all([
                                loadLineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                    machine,
                                }),
                                loadJudgesLine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                }),
                            ]);
                        }),
                        loadMachinesDownTime({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }).then(async () => {
                            await Promise.all([
                                loadMachineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName,
                                    machine: state.machine || state.calcMachine,
                                }),
                                loadJudgesMachine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    machine: state.machine || state.calcMachine,
                                }),
                            ]);
                        }),
                        loadPickupsStatus({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                        }),
                        loadPickupRateTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadLinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }),
                        loadMachinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadFeedersPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadNozzlesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                    ]);
                } else if (observerMap.building || observerMap.systemBuilding) {
                    Logger.warn(`Building is changed to ${building}`);
                    cleanupObserver();
                    await Promise.all([
                        loadDownTimeOverall({
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        }),
                        loadLinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadMachinesStatus({
                            factory,
                            building,
                            project,
                            section,
                        }),
                        loadMachinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadErrorsFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                       
                        loadDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode
                        }),
                        loadLinesDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                        }),
                        loadHoursFailure({
                            workDate,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode,
                        }),
                        loadFailuresDetail({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            min: state.minSecondQueryDetail
                        }),
                        loadLinesDownTime({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }).then(async () => {
                            await Promise.all([
                                loadLineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                    machine,
                                }),
                                loadJudgesLine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                }),
                            ]);
                        }),
                        loadMachinesDownTime({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }).then(async () => {
                            await Promise.all([
                                loadMachineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName,
                                    machine: state.machine || state.calcMachine,
                                }),
                                loadJudgesMachine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    machine: state.machine || state.calcMachine,
                                }),
                            ]);
                        }),
                        loadPickupsStatus({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                        }),
                        loadPickupRateTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadLinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }),
                        loadMachinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadFeedersPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadNozzlesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                    ]);
                } else if (observerMap.project || observerMap.systemProject) {
                    Logger.warn(`Project is changed to ${project}`);
                    cleanupObserver();
                    await Promise.all([
                        loadDownTimeOverall({
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        }),
                        loadLinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadMachinesStatus({
                            factory,
                            building,
                            project,
                            section,
                        }),
                        loadMachinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadErrorsFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode
                        }),
                        loadLinesDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                        }),
                        loadHoursFailure({
                            workDate,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode,
                        }),
                        loadFailuresDetail({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            min: state.minSecondQueryDetail
                        }),
                        loadLinesDownTime({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }).then(async () => {
                            await Promise.all([
                                loadLineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                    machine,
                                }),
                                loadJudgesLine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                }),
                            ]);
                        }),
                        loadMachinesDownTime({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }).then(async () => {
                            await Promise.all([
                                loadMachineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName,
                                    machine: state.machine || state.calcMachine,
                                }),
                                loadJudgesMachine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    machine: state.machine || state.calcMachine,
                                }),
                            ]);
                        }),
                        loadPickupsStatus({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                        }),
                        loadPickupRateTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadLinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }),
                        loadMachinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadFeedersPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadNozzlesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                    ]);
                } else if (observerMap.section || observerMap.systemSection) {
                    Logger.warn(`Section is changed to ${section}`);
                    cleanupObserver();
                    await Promise.all([
                        loadDownTimeOverall({
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        }),
                        loadLinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadMachinesStatus({
                            factory,
                            building,
                            project,
                            section,
                        }),
                        loadMachinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadErrorsFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                       
                        loadDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode
                        }),
                        loadLinesDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                        }),
                        loadHoursFailure({
                            workDate,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode,
                        }),
                        loadFailuresDetail({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            min: state.minSecondQueryDetail
                        }),
                        loadLinesDownTime({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }).then(async () => {
                            await Promise.all([
                                loadLineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                    machine,
                                }),
                                loadJudgesLine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                }),
                            ]);
                        }),
                        loadMachinesDownTime({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }).then(async () => {
                            await Promise.all([
                                loadMachineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName,
                                    machine: state.machine || state.calcMachine,
                                }),
                                loadJudgesMachine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    machine: state.machine || state.calcMachine,
                                }),
                            ]);
                        }),
                        loadPickupsStatus({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                        }),
                        loadPickupRateTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadLinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }),
                        loadMachinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadFeedersPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadNozzlesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                    ]);
                } else if (observerMap.lineName || observerMap.systemLineName) {
                    Logger.warn(`Line is changed to ${lineName}`);
                    cleanupObserver();
                    await Promise.all([
                        loadDownTimeOverall({
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        }),
                        loadLinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadMachinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadErrorsFailure({
                           timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        
                        loadDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode
                        }),
                        loadLinesDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                        }),
                        loadHoursFailure({
                            workDate,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode,
                        }),
                        loadFailuresDetail({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            min: state.minSecondQueryDetail
                        }),
                        loadLinesDownTime({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }).then(async () => {
                            await Promise.all([
                                loadLineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                    machine,
                                }),
                                loadJudgesLine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName: lineName || state.calcLineName,
                                }),
                            ]);
                        }),
                        loadMachinesDownTime({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }).then(async () => {
                            await Promise.all([
                                loadMachineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName,
                                    machine: state.machine || state.calcMachine,
                                }),
                                loadJudgesMachine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    machine: state.machine || state.calcMachine,
                                }),
                            ]);
                        }),
                        loadPickupRateTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadLinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName
                        }),
                        loadMachinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadFeedersPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadNozzlesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                    ]);
                } else if (observerMap.machine || observerMap.systemMachine) {
                    Logger.warn(`Machine is changed to ${machine}`);
                    cleanupObserver();
                    await Promise.all([
                        loadDownTimeOverall({
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                        }),
                        loadMachinesFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadErrorsFailure({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode
                        }),
                        loadHoursFailure({
                            workDate,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode,
                        }),
                        loadFailuresDetail({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            min: state.minSecondQueryDetail
                        }),
                        loadMachinesDownTime({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }).then(async () => {
                            await Promise.all([
                                loadMachineHoursDownTime({
                                    workDate,
                                    factory,
                                    building,
                                    project,
                                    section,
                                    lineName,
                                    machine: state.machine || state.calcMachine,
                                }),
                                loadJudgesMachine({
                                    timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                                    factory,
                                    building,
                                    project,
                                    section,
                                    machine: state.machine || state.calcMachine,
                                }),
                            ]);
                        }),
                        loadPickupRateTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadMachinesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine
                        }),
                        loadFeedersPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                        loadNozzlesPickup({
                            timeSpan: dayjs(workDate).format('YYYY/MM/DD 00:00:01') + ' - ' + dayjs(workDate).format('YYYY/MM/DD 23:59:59'),
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                        }),
                    ]);
                } else if(observerMap.errorCode || observerMap.systemErrorCode) {
                    cleanupObserver();
                    await Promise.all([
                        loadDownTimeTrend({
                            timeSpan,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode,
                        }),
                        loadHoursFailure({
                            workDate,
                            factory,
                            building,
                            project,
                            section,
                            lineName,
                            machine,
                            errorCode,
                        }),
                    ]);
                }
            }
        } catch (error) {
            toast.error('Error when change state', error.message);
            console.error(error);
            cleanupObserver();
        }
    }, 500);
    return {
        handleChangeState
    }
})();

export default Flow;

