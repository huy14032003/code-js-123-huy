/**
 *  Khởi tạo flatpickr và đăng ký callback cập nhật thời gian
 * 
 * @author lamlib
 * @module time
 * 
 * @param {Object} opts 
 * @param {HTMLElement} opts.uiTimeSpan 
 * @param {string} opts.defaultDate 
 * @param {Function} opts.onUpdateWorkPeriod 
 * 
 * @returns {Flatpickr}
 */
export function createFlatPickr({ uiTimeSpan, defaultDate, onUpdateWorkPeriod }) {
    return flatpickr(uiTimeSpan, {
        defaultDate,
        onClose: onUpdateWorkPeriod,
        onReady: onUpdateWorkPeriod,
    });
}