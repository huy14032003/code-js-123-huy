const Utils = (() => {
    /**
     * @author lamlib
     * @version 1.0.0
     * @param {object} target The object that is store data
     * @param {object} resorce The object that need passing data to target
     * @returns {object} The object is merged
     */
    function merge(target, resorce) {
        for (let i in resorce) {
            if (
                i in target &&
                typeof resorce[i] === 'object' &&
                typeof target[i] === 'object'
            ) {
                merge(target[i], resorce[i]);
                continue;
            }
            target[i] = resorce[i];
        }
        return target;
    };

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {Function} func 
     * @param {number} timeout 
     * @returns 
     */
    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args) }, timeout);
        };
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {Function} func 
     * @param {number} timeout 
     * @returns 
     */
    function debounceAsync(func, timeout = 300) {
        let timer;
        let resolveList = [];
        return (...args) => {
            // Trả về một Promise mỗi khi debounce được gọi
            return new Promise((resolve, reject) => {
                clearTimeout(timer);

                // Gom các resolve lại (nếu muốn nhiều caller cùng được thông báo)
                resolveList.push({ resolve, reject });

                timer = setTimeout(async () => {
                    try {
                        const result = await func(...args);

                        // Gọi tất cả resolve đã gom trước đó
                        resolveList.forEach(({ resolve }) => resolve(result));
                    } catch (err) {
                        resolveList.forEach(({ reject }) => reject(err));
                    } finally {
                        resolveList = [];
                    }
                }, timeout);
            });
        };
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {Function} func 
     * @param {number} timeout 
     * @returns 
     */
    function throttle(func, timeout = 300) {
        let lastTime = 0;
        return (...args) => {
            let now = Date.now();
            if (now - lastTime >= timeout) {
                func.apply(this, args);
                lastTime = now;
            }
        }
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {string} str 
     * @returns 
     */
    function getParamsURL(str) {
        const prm = decodeURIComponent(decodeURIComponent(new URLSearchParams(location.search).get(str)));
        return prm === 'null' ? null : prm;
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {string} field The name of params that you want to change the value.
     * @param {string | number} value The value must be change.
     */
    function changeParamsURL(field, value) {
        const url = new URL(window.location);
        url.searchParams.set(field, value ?? '');
        const newUrl = url.toString().replace(/\+/g, '%20');
        window.history.pushState({}, '', newUrl);
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {any} val Giá trị bất kỳ
     */
    function fixNullish(val) {
        return val ?? 'N/A';
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {number} vh 
     * @returns 
     */
    function vhToPx(vh) {
        const vhInPx = window.innerHeight / 100;
        return vh * vhInPx;
    }

    
    /**
     * @author lamlib
     * @version 1.0.0
     * @param {number} vw 
     * @returns 
     */
    function vwToPx(vw) {
        const vwInPx = window.innerWidth / 100;
        return vw * vwInPx;
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * Groups an array of objects by a specified key.
     *
     * @template T - The type of objects in the array.
     * @template K - The key of the object to group by.
     * @param {T[]} xs - The array of objects to group.
     * @param {K} key - The key to group the objects by.
     * @returns {Record<string, T[]>} An object where the keys are the values of the specified key in the objects, 
     * and the values are arrays of objects that have that key value.
     * @throws {Error} If the input array is not provided.
     */
    const groupBy = (xs, key) => {
        if (!xs) {
            throw new Error("Can't group array because input is not array");
        }
        return xs.reduce((rv, x) => {
            const keyValue = x[key];
            (rv[keyValue] = rv[keyValue] || []).push(x);
            return rv;
        }, {});
    };

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {number} num 
     */
    function secondsToHours(num) {
        if (isNaN(num) || num === 0) {
            return 0;
        }
        return num / 60 /*minutesInSeconds*/ / 60 /*hoursInMinus*/;
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {number} num 
     */
    function minutesToHours(num) {
        if (isNaN(num) || num === 0) {
            return 0;
        }
        return num / 60 /*hoursInMinus*/;
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {*} num 
     * @param {*} param1 
     * @returns 
     */
    function formatNum(num, {
        minimumFractionDigits = 2,
        maximumFractionDigits = 2,
        locales = 'en-US'
    }) {
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits,
            maximumFractionDigits,
        });
        return Number(formatter.format(+num));
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {*} num 
     * @returns 
     */
    function numberToReadableString(num) {
        const abbreviations = [
            { value: 1e9, symbol: 'b' },
            { value: 1e6, symbol: 'm' },
            { value: 1e3, symbol: 'k' },
        ];

        if (num < 1000) {
            return Number.isInteger(num) ? num.toString() : num.toFixed(2);
        }

        for (let i = 0; i < abbreviations.length; i++) {
            if (num >= abbreviations[i].value) {
            let divided = num / abbreviations[i].value;
            // làm tròn 2 chữ số thập phân
            let rounded = Math.round(divided * 100) / 100;

            // Nếu phần thập phân là 0 thì chỉ lấy phần nguyên
            let str = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2).replace(/\.?0+$/, '');
            
            return str + abbreviations[i].symbol;
            }
        }

        // Trường hợp số rất nhỏ < 1000 (đã xử lý ở trên)
        return num.toString();
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * Kiểm tra xem chuỗi có phải JSON hợp lệ hay không
     * @param {string} jsonString - Chuỗi cần kiểm tra
     * @returns {boolean} true nếu là JSON hợp lệ, false nếu không
     */
    function isJsonValid(jsonString) {
        try {
            JSON.parse(jsonString);
        } catch {
            return false;
        }
        return true;
    }


    /**
     * @author lamlib
     * @version 1.0.0
     * Truy cập DOM một lần duy nhất sử dụng WeekRef tránh rò rỉ bộ nhớ, nếu DOM bị replace hoàn toàn thì truy cập lại để lấy mới
     * @param {string} id Index của DOM cần tham chiếu yếu
     */
    function createDOMRef(id) {
        let element = document.getElementById(id);
        let ref = element && new WeakRef(element);
        return {
            /**
             * @returns {HTMLElement | null}
             */
            get value() {
                let el = ref?.deref();
                if (el) return el;
                element = document.getElementById(id);
                ref = element && new WeakRef(element);
                return ref?.deref() || null;
            }
        };
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {*} duration 
     * @returns 
     */
    function durationToReadableString(duration) {
        if(duration < 60) {
            return `${numberToReadableString(duration)} s`;
        } else if(duration < 60 * 60) {
            return `${numberToReadableString(duration / 60)} m`
        } else {
            return `${numberToReadableString(duration / (60 * 60))} h`
        } 
    }

    /**
     * @author lamlib
     * @version 1.0.0
     * @param {*} duration 
     * @returns 
     */
    function durationToReadableHourString(duration) {
        return `${numberToReadableString(duration / (60 * 60))} h`
    }

    return {
        debounce,
        throttle,
        getParamsURL,
        changeParamsURL,
        merge,
        fixNullish,
        vhToPx,
        vwToPx,
        groupBy,
        secondsToHours,
        formatNum,
        minutesToHours,
        debounceAsync,
        isJsonValid,
        createDOMRef,
        numberToReadableString,
        durationToReadableString,
        durationToReadableHourString
    }
})();

export default Utils;