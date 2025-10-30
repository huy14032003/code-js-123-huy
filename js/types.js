/**
 * @typedef {Object} ItemReport
 * @property {'machine'|'line'|'machinePickup'|'linePickup'} category
 * @property {string} value
 */

/**
 * @typedef {Object} ItemNeedReport
 * @property {string} [machine]
 * @property {string} [lineName]
 */

/**
 * @typedef {object} State
 * @property {string | null} timeSpan
 * @property {string | null} workDate
 * @property {string | null} factory
 * @property {string | null} building
 * @property {string | null} project
 * @property {string | null} section
 * @property {string | null} lineName
 * @property {string | null} machine
 * @property {string | null} errorCode
 * 
 * @property {string} systemTimeSpan
 * @property {string} systemWorkDate
 * @property {string} systemFactory
 * @property {string} systemBuilding
 * @property {string} systemProject
 * @property {string} systemSection
 * @property {string} systemLineName
 * @property {string} systemMachine
 * 
 * @property {string} calcLineName
 * @property {string} calcMachine
 * 
 * @property {Cascader} cascader
 * @property {Flatpickr} flatpickr
 * 
 * @property {string} threadId
 * @property {Array<ItemReport>} itemsReport
 * @property {Array<ItemNeedReport>} itemsNeedReport
 * @property {boolean} reportLine
 * @property {boolean} reportMachine
 * @property {boolean} reportPickup
 * @property {Window | null} agentWindowRef
 * @property {number} minSecondQueryDetail
 * @property {string} lastAgentMessage
 * @property {any} grossLabelDowntime
 * @property {any} grossLabelPickup
 * 
 */

/**
 * @typedef {object} OptsDashboardSMT 
 * @property {Chatbot} chatbot - Instance Chatbot
 * @property {number} numberOfScreen - Số lượng item mà screen định nghĩa
 * @property {string} layoutId - Index của DOM sẽ áp dụng css grid
 * @property {MirrorChartInstance} mirrorChartMachine
 * @property {MirrorChartInstance} mirrorChartLine
 * @property {UserActivityDetector} activityDetector
 * @property {import('./settings').Setting} setting
 * @property {Function} createMirrorCharts
 */

/**
 * @typedef {Object} StandardJudgesItem
 * @property {string} object
 * @property {string} comment
 * @property {string} failureDuration
 * @property {string} downtimeRanking
 * @property {string} failureFrequency
 * @property {string} frequencyRanking
 */

/**
 * @typedef {Object} StandardFilterItem
 * @property {string} label
 * @property {string} value
 * @property {StandardFilterItem[]} children
 */

/**
 * @typedef {Object} StandardStatusMachine
 * @property {string} machineName
 * @property {string} lineName
 * @property {string} locationNo
 * @property {MachineStatus} machineStatus
 * @property {string} lane
 */

/**
 * @typedef {Object} StandardPickupMachine
 * @property {string} machineName
 * @property {string} lineName
 * @property {string} locationNo
 * @property {number} pickupRate
 * @property {string} lane
 */

/**
 * @typedef {Object} StandardFailureItem
 * @property {string} name - Tên của hạng mục thống kê
 * @property {number} count - Số lần lỗi
 * @property {number} duration - Thời gian lỗi
 */

/**
 * @typedef {Object} StandardPickupItem
 * @property {string} name - Tên của hạng mục thống kê
 * @property {number} throwCount - Số lần liệu rơi
 * @property {number} pickupRate - Tỉ lệ hút thành công
 */

/**
 * @typedef {Object} StandardDowntimeItem
 * @property {string} name - Tên của hạng mục thống kê
 * @property {number} duration - Thời gian lỗi
 * @property {number} availabilityRate - Tỉ lệ khả dụng
 */

/**
 * @typedef {[number , number]} StandardTimeAllocation - Total time and downtime
 */

/**
 * @typedef {1 | 2 | 3 | 4 | 5} MachineStatus
 */

/**
 * @typedef { 'downtime_overall' |  'downtime_by_line' |  'downtime_by_machine' |  'pickup_overall' |  'troubleshooting_guide' | 'pickup_by_line' | 'pickup_by_machine' } ShowPageKey
 */

/**
 * @typedef {Object} PramsSMT
 * @property {string} [factory]
 * @property {string} [building]
 * @property {string} [project_name]
 * @property {string} [section_name]
 * @property {string} [line_name]
 * @property {string} [machine_no]
 * @property {string} [startTime]
 * @property {string} [endTime]
 */

/**
 * @typedef {Object} StateType
 * @property {Message[]} messages
 * @property {UIMessage[]} [ui]
 * @property {PramsSMT} [params]
 * @property {ShowPageKey} [showPage]
 * @property {string[]} [highlightCharts]
 * @property {'human'|'agent'} factor
 * @property {boolean} [isFullScreen]
 * @property {string} [errorCode]
 */

export const T = {};

