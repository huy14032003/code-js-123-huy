import Utils from "./Utils.js";
import { COLUMNS_DETAIL } from "./config.js";
import numeral from './libs/numeral/numeral.min.js';

/**
 * Tiêu chuẩn hóa đầu vào dữ liệu (máy chủ => máy khách)
 * @version 1.0.0
 * @param {Record<any, any>[]} data 
 * @returns
 */
export function _standalizeItemFilter(data) {
    if (!Array.isArray(data) && typeof data == 'object') {
        data = Object.values(data);
    }
    for (let i in data) {
        data[i].label = data[i].value = data[i].name?.toUpperCase();
        data[i].children = _standalizeItemFilter(data[i].listBuilder);
        if (data[i].type == 'Factory') {
            data[i].children.unshift({
                label: 'All Building',
                value: 'All Building',
                children: [
                    {
                        label: 'All Project',
                        value: 'All Project',
                        children: [
                            {
                                label: 'All Section',
                                value: 'All Section',
                                children: [
                                    {
                                        label: 'All Line',
                                        value: 'All Line',
                                        children: [
                                            {
                                                label: 'All Machine',
                                                value: 'All Machine',
                                                children: [
                                                ],
                                            }
                                        ],
                                    }
                                ],
                            }
                        ],
                    }
                ],
            }
            )
        } else if (data[i].type == 'Building') {
            data[i].children.unshift({
                label: 'All Project',
                value: 'All Project',
                children: [
                    {
                        label: 'All Section',
                        value: 'All Section',
                        children: [
                            {
                                label: 'All Line',
                                value: 'All Line',
                                children: [
                                    {
                                        label: 'All Machine',
                                        value: 'All Machine',
                                        children: [
                                        ],
                                    }
                                ],
                            }
                        ],
                    }
                ],
            }
            )
        } else if (data[i].type == 'Project') {
            data[i].children.unshift({
                label: 'All Section',
                value: 'All Section',
                children: [
                    {
                        label: 'All Line',
                        value: 'All Line',
                        children: [
                            {
                                label: 'All Machine',
                                value: 'All Machine',
                                children: [
                                ],
                            }
                        ],
                    }
                ],
            }
            )
        } else if (data[i].type == 'Section') {
            data[i].children.unshift({
                label: 'All Line',
                value: 'All Line',
                children: [
                    {
                        label: 'All Machine',
                        value: 'All Machine',
                        children: [
                        ],
                    }
                ],
            }
            )
        } else if (data[i].type == 'Line') {
            data[i].children.unshift({
                label: 'All Machine',
                value: 'All Machine',
                children: [
                ],
            }
            )
        }
        delete data[i].name;
        delete data[i].listBuilder;
        delete data[i].type;
    }
    return data;
}

const sortTextBy = (field) => {
    if(field) {
        return (a, b) => {
            if (a[field].toLowerCase() < b[field].toLowerCase()) {
                return -1;
            }
            if (a[field].toLowerCase() > b[field].toLowerCase()) {
                return 1;
            }
            return 0;
        }
    }
    return (a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) {
            return -1;
        }
        if (a.toLowerCase() > b.toLowerCase()) {
            return 1;
        }
        return 0;
    }
} 

/**
 * @version 1.0.0
 * @param {Record<any, any>[]} data 
 * @param { Strategy } strategy 
 * @returns
 */
export function standalizeData(data, strategy) {
    switch (strategy) {
        case 'JUDGES_ITEM':
            return {
                object: data?.data?.keyMap,
                comment: data?.noted,
                failureDuration: data?.data?.totalStopTime,
                downtimeRanking: data?.data?.rnDowntime,
                failureFrequency: data?.data?.countDowntime,
                frequencyRanking: data?.data?.rnCount,
            }
        case 'ITEMS_FILTER':
            const itemsFilter = _standalizeItemFilter(data);
            const allBuildings = _.flatten(itemsFilter.map(factory => factory.children.filter(building => building.value !== 'All Building')));
            const allProjects = _.flatten(allBuildings.map(building => building.children.filter(project => project.value !== 'All Project')));
            const allSections = _.flatten(allProjects.map(project => project.children.filter(section => section.value !== 'All Section')));
            const allLines = _.flatten(allSections.map(section => section.children.filter(line => line.value !== 'All Line')));
            const allMachines = _.flatten(allLines.map(line => line.children.filter(machine => machine.value !== 'All Machine')));

            itemsFilter.unshift({
                label: 'All Factory',
                value: 'All Factory',
                children: [
                    {
                        label: 'All Building',
                        value: 'All Building',
                        children: [
                            {
                                label: 'All Project',
                                value: 'All Project',
                                children: [
                                    {
                                        label: 'All Section',
                                        value: 'All Section',
                                        children: [
                                            {
                                                label: 'All Line',
                                                value: 'All Line',
                                                children: [
                                                    {
                                                        label: 'All Machine',
                                                        value: 'All Machine',
                                                        children: [
                                                        ],
                                                    },
                                                    ...allMachines,
                                                ],
                                            },
                                            ...allLines,
                                        ],
                                    },
                                    ...allSections,
                                ],
                            },
                            ...allProjects,
                        ],
                    },
                    ...allBuildings,
                ],
            })
            
            return itemsFilter;
        case 'MACHINE_STATUS':
            return data.map(e => ({
                machineName: e.MACHINE_NAME,
                lineName: e.LINE_NAME,
                locationNo: e.LOCATION_NO,
                machineStatus: e.CURRENT_STATE,
                lane: e.LANE,
                building: e.BUILDING,
                factory: e.FACTORY,
                floor: e.FLOOR,
                logPosition: e.LOG_POSITION,
                machineNo: e.MACHINE_NO,
                machineType: e.MACHINE_TYPE,
                mfrName: e.MFR_NAME,
                projectName: e.PROJECT_NAME,
                sectionName: e.SECTION_NAME,
                status: e.STATUS,
                uph: e.UPH,
            }));
        case 'PICKUP_TRACKING':
            return data.filter(e => e.LINE_NAME).map(e => ({
                machineName: e.MACHINE_NAME,
                machineNo: e.MACHINE_NO,
                lineName: e.LINE_NAME,
                locationNo: e.LOCATION_NO,
                pickupRate: e.pickupRate,
                lane: e.LANE,
            }))
        case 'LINE_FAILURE':
            return data.map(e => ({
                count: e?.countError,
                duration: +Utils.secondsToHours(Math.abs(Number(e?.ERRORTIME ?? 0))).toFixed(2),
                name: e?.LINE_NAME,
            })).sort((a, b) => b.duration - a.duration);
        case 'MACHINE_DOWNTIME':
            return data.map(e => ({
                count: e?.countError,
                duration: Utils.formatNum(Utils.secondsToHours(Number(e?.ERRORTIME)), {}),
                name: e?.MACHINE_NO,
            })).sort((a, b) => b.duration - a.duration);
        case 'LINE_DOWNTIME':
            return data.map(e => ({
                count: e?.countError,
                duration: e?.ERRORTIME,
                name: e?.LINE_NAME,
            })).sort((a, b) => b.duration - a.duration);
        case 'HOUR_DOWNTIME':
            const hourDowntimePlaceHolder = Array(24).fill({});
            for (let i = 0; i < hourDowntimePlaceHolder.length; i++) {
                const datum = data.find(e => Number(e.workHour) == i);
                hourDowntimePlaceHolder[i] = {
                    name: `${numeral(i).format('00')}:00`,
                    duration: datum ? +Utils.secondsToHours(Number(datum?.ERRORTIME ?? 0)).toFixed(2) : 0,
                    count: datum ? datum?.countError : 0
                }
            }
            return hourDowntimePlaceHolder;
        case 'MACHINE_FAILURE':
            return data.map(e => ({
                count: e?.countError,
                duration: +Utils.secondsToHours(Math.abs(Number(e?.ERRORTIME ?? 0))).toFixed(2),
                name: e?.MACHINE_NO,
            })).sort((a, b) => b.duration - a.duration);
        case 'ERROR_FAILURE':
            return data.map(e => ({
                count: e?.countError,
                duration: +Utils.secondsToHours(Math.abs(Number(e?.ERRORTIME ?? 0))).toFixed(2),
                name: e?.ERROR_CODE,
            })).sort((a, b) => b.duration - a.duration);
        case 'LINE_PICKUP':
            return data.sort(sortTextBy('LINE_NAME')).map(e => ({
                pickupRate: e?.pickupRate,
                throwCount: e?.totalThrow,
                lineName: e?.LINE_NAME,
            }))
        case 'MACHINE_PICKUP':
            return data.sort(sortTextBy('MACHINE_NO')).map(e => ({
                pickupRate: e?.pickupRate,
                throwCount: e?.totalThrow,
                name: e?.MACHINE_NO,
            }))
        case 'FEEDER_PICKUP':
            return data.sort(sortTextBy('UNIT_ID')).map(e => ({
                pickupRate: e?.pickupRate,
                throwCount: e?.totalThrow,
                name: e?.UNIT_ID,
            }))
        case 'NOZZLE_PICKUP':
            return data.sort(sortTextBy('NOZZLE_ID')).map(e => ({
                pickupRate: e?.pickupRate,
                throwCount: e?.totalThrow,
                name: e?.NOZZLE_ID,
            }))
        case 'HOUR_FAILURE':
            return data.map(e => ({
                errorCount: e?.countError,
                errorTime: e?.ERRORTIME,
                hourName: e?.workHour + ':00',
            }))
        case 'DOWNTIME_TREND':
            return data.map(e => ({
                downtime: e?.totalStopTime,
                availabilityRate: e?.totalTime ? Utils.formatNum((((e?.totalTime ?? 0) - e?.totalStopTime ?? 0) / (e?.totalTime)) * 100, {}) : 100,
                date: e?.workDate,
            }))
        case 'DOWNTIME':
            return data.reduce((pre, cur, curIdx) => {
                return [cur?.totalTime + pre[0], cur?.totalStopTime + pre[1]];
            }, [0, 0]);
        case  'PICKUP_RATE':
            return data.reduce((pre, cur, curIdx) => {
                return [cur?.pickupRate + pre[0], cur?.throwRate + pre[1]];
            }, [0, 0]);
        case 'LINE_DOWNTIME_TREND':
            return data.map(e => ({
                downtime: e?.totalStopTime,
                availabilityRate: e?.totalTime ? Utils.formatNum((((e?.totalTime ?? 0) - e?.totalStopTime ?? 0) / (e?.totalTime)) * 100, {}) : 100,
                date: e?.workDate,
                lineName: e?.LINE_NAME
            }))
        case 'PICKUP_RATE_TREND':
            return data.reverse().map(e => ({
                throwCount: e?.totalThrow,
                pickupRate: e?.pickupRate,
                date: e?.workDate,
            }))
        case 'FAILURE_DETAIL':
            return data.sort((a, b) => new Date(b.START_TIME).getTime() - new Date(a.START_TIME).getTime()).map(e => ({
                [COLUMNS_DETAIL[0]]: e?.FACTORY ?? '-',
                [COLUMNS_DETAIL[1]]: e?.BUILDING ?? '-',
                [COLUMNS_DETAIL[2]]: e?.PROJECT_NAME ?? '-',
                [COLUMNS_DETAIL[3]]: e?.SECTION_NAME ?? '-',
                [COLUMNS_DETAIL[4]]: e?.LINE_NAME ?? '-',
                [COLUMNS_DETAIL[5]]: e?.MACHINE_NAME ?? '-',
                [COLUMNS_DETAIL[6]]: e?.ERROR_CODE ?? '-',
                [COLUMNS_DETAIL[7]]: e?.ERROR_DESC ?? '-',
                [COLUMNS_DETAIL[8]]: Utils.durationToReadableHourString((dayjs(e?.END_TIME ?? new Date()).diff(dayjs(e?.START_TIME), 'second') ?? '-')),
                [COLUMNS_DETAIL[9]]:  e?.START_TIME ?? '-',
                [COLUMNS_DETAIL[10]]: e?.END_TIME ?? '-',
                [COLUMNS_DETAIL[11]]: e?.ME_OWNER ?? '-',
                [COLUMNS_DETAIL[12]]: e?.PD_OWNER ?? '-',
                [COLUMNS_DETAIL[13]]: e?.RC ?? 'N/A',
                [COLUMNS_DETAIL[14]]: e?.FA ?? 'N/A',
                [COLUMNS_DETAIL[15]]: e?.ID ?? '',
                [COLUMNS_DETAIL[16]]: e?.ERROR_ID ?? '',
                _isEmpty: false,
                _isFinish: !!e?.END_TIME,
                _startHour: e?.START_TIME ? dayjs(e?.START_TIME).format('HH:mm:ss') : '-',
            }))
        default:
            return data;
    }
}

