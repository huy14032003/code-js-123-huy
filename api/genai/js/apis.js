import { registerGetEndpoint, requestHandlers } from "./libs/datasync/datasync.esm.js";

// BASE_URL được khai báo và gán giá trị trong file application.jsp (tại thẻ head của tài liệu html)

registerGetEndpoint('getErrorsFailure', `${BASE_URL}api/genai/failureByErrorType`, 'no-cache');
registerGetEndpoint('getHoursFailure', `${BASE_URL}api/genai/failureByHour`, 'no-cache');
registerGetEndpoint('getLinesFailure', `${BASE_URL}api/genai/failureByLine`, 'no-cache');
registerGetEndpoint('getMachinesFailure', `${BASE_URL}api/genai/failureByMachine`, 'no-cache');
registerGetEndpoint('getFailuresDetail', `${BASE_URL}api/genai/failureDetail`, 'no-cache');
registerGetEndpoint('getLinesDowntimeTrend', `${BASE_URL}api/genai/lineTrendDowntime`, 'no-cache');
registerGetEndpoint('getMachinesStatus', `${BASE_URL}api/genai/showDataMachine`, 'no-cache');
registerGetEndpoint('getDowntimeTrend', `${BASE_URL}api/genai/totalTrendDowntime`, 'no-cache');
registerGetEndpoint('getDowntime', `${BASE_URL}api/genai/totalTrendDowntime`, 'no-cache'); 
registerGetEndpoint('getData6', `${BASE_URL}api/genai/getDowntimeByMachine`, 'no-cache'); 
registerGetEndpoint('getItemsFilter', `${BASE_URL}api/genai/listFilter`, 'no-cache');
registerGetEndpoint('getLinesPickup', `${BASE_URL}api/genai/pickupRateByLine`, 'no-cache');
registerGetEndpoint('getMachinesPickup', `${BASE_URL}api/genai/pickupRateByMachine`, 'no-cache'); 
registerGetEndpoint('getFeedersPickup', `${BASE_URL}api/genai/pickupRateByFeeder`, 'no-cache');
registerGetEndpoint('getNozzlesPickup', `${BASE_URL}api/genai/pickupRateByNozzle`, 'no-cache');
registerGetEndpoint('getPickupRateTrend', `${BASE_URL}api/genai/pickupTotalTrend`, 'no-cache');
registerGetEndpoint('getPickupTracking', `${BASE_URL}api/genai/showDataPickupRate`, 'no-cache');
registerGetEndpoint('getJudgesItem', `${BASE_URL}api/genai/downtimeCurrentQty`, 'no-cache');

export {hasError, messageState, dataStore} from './libs/datasync/datasync.esm.js';
export const getMachinesStatus = requestHandlers.getMachinesStatus;
export const getLinesFailure = requestHandlers.getLinesFailure;
export const getMachinesFailure = requestHandlers.getMachinesFailure;
export const getErrorsFailure = requestHandlers.getErrorsFailure;
export const getDowntimeTrend = requestHandlers.getDowntimeTrend;
export const getLinesDowntimeTrend = requestHandlers.getLinesDowntimeTrend;
export const getHoursFailure = requestHandlers.getHoursFailure;
export const getFailuresDetail = requestHandlers.getFailuresDetail;
export const getDowntime = requestHandlers.getDowntime;
export const getItemsFilter = requestHandlers.getItemsFilter;
export const getJudgesItem = requestHandlers.getJudgesItem;
export const getLinesPickup = requestHandlers.getLinesPickup;
export const getMachinesPickup = requestHandlers.getMachinesPickup;
export const getFeedersPickup = requestHandlers.getFeedersPickup;
export const getNozzlesPickup = requestHandlers.getNozzlesPickup;
export const getPickupRateTrend = requestHandlers.getPickupRateTrend;
export const getPickupTracking = requestHandlers.getPickupTracking;


