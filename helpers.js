const Helper = (function () {
    // Search data in multilevel array
    function deepSearch(obj, searchTerm) {
        let stack = [obj];

        while (stack.length > 0) {
            let current = stack.pop();
            for (let key in current) {
                if (Object.prototype.toString.call(current[key]) === '[object Object]') {
                    stack.push(current[key]);
                } else if (Object.prototype.toString.call(current[key]) === '[object Array]') {
                    current[key].forEach((item) => stack.push(item));
                } else {
                    if (current[key] && current[key].toString().toLowerCase().trim().indexOf(searchTerm.toString().toLowerCase().trim()) > -1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Only type number
    function allowOnlyDigits(selector) {
        const inputs = document.querySelectorAll(selector);

        inputs.forEach((input) => {
            input.addEventListener('input', function () {
                this.value = this.value.replace(/[^\d\-\.]+/g, '');
            });
        });
    }

    // Currency formating accourding to the ISO standard
    function formatCurrencyISO(number, decimals = null) {
        // Dùng API của JS
        if (number === null || number === undefined || number === '' || isNaN(number)) {
            return number;
        }

        const isInteger = Number.isInteger(number);
        decimals = isInteger ? 0 : decimals;

        if (decimals !== null) {
            number = Number(number).toFixed(decimals);
        }

        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals !== null ? decimals : 0,
            maximumFractionDigits: decimals !== null ? decimals : 20,
        }).format(Number(number));

        // // Cách viết thuần
        // if (number === null || number === undefined || number === '' || isNaN(number)) {
        //     return number;
        // }

        // const num = Number(number);

        // const parts = decimals !== null ? num.toFixed(decimals).toString().split('.') : num.toString().split('.');

        // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // return parts.join('.');
    }

    function getCookie(cname) {
        const name = cname + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    const parseNumber = (val, fallback = '') => {
        if (val === null || val === undefined || val === '') return fallback;
        const n = Number(val);
        if (Number.isNaN(val)) return fallback;
        return Number.isInteger(n) ? n : parseFloat(n.toFixed(2));
    };

    return {search: deepSearch, allowOnlyDigits, formatCurrencyISO, getCookie, parseNumber};
})();
