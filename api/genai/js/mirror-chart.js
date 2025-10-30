import { BASE_VW_UNIT } from "./config.js";
import numeral from "./libs/numeral/numeral.min.js";
import Utils from "./Utils.js";

/**
 * @typedef {Object} MirrorChartInstance
 * @property {function(any): void} updateChart - Cập nhập dữ liệu cho biểu đồ
 */

/**
 * @typedef {Object} Opts
 * @property {string} container - Index của HTMLSVGElement sẽ vẽ biểu đồ
 */



/** @type {{ chart: (opts?: Object) => MirrorChartInstance }} */
const MirrorChart = (() => {
    /**
     * Sử dụng d3
     * @param {*} opts 
     * @returns 
     */
    function chart (opts = {}) {
        let _opts = {
            container: null,
        }
        let _state = {
            isHovering: false,
        }
        Utils.merge(_opts, opts);
        const dom = document.getElementById(_opts.container)
        dom.innerHTML = '';

        const svg = d3.select(`#${_opts.container}`);

        const width = dom.clientWidth;
        const height = dom.clientHeight;
        const margin = {
            top: Utils.vwToPx(BASE_VW_UNIT),
            right: Utils.vwToPx(BASE_VW_UNIT * 2),
            bottom: Utils.vwToPx(BASE_VW_UNIT),
            left: Utils.vwToPx(BASE_VW_UNIT * 2)
        };

        const chartWidth = width - margin.left - margin.right,
              chartHeight = height - margin.top - margin.bottom;
        
        const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Thêm một thẻ div có class lm-tooltip
        const tooltip = d3.select('body').append('div').attr('class', 'lm-tooltip');

        // Tạo một thang đo dải cao từ đáy khung chứa tới có padding một nửa không gian
        const HALF_OF_SPACE = 0.5;
        const categoryScale = d3.scaleBand().range([0, chartHeight]).paddingInner(HALF_OF_SPACE);

        // Tạo thang đo x bên trái có khoảng đo lường từ một nửa chiều rộng biểu đồ về 0
        const HALF_OF_CHART = chartWidth / 2;
        const xLeft = d3.scaleLinear().range([HALF_OF_CHART, 0]);

        // Tạo thang đo x bên phải có khoảng đo lường từ 0 về một nửa chiều rộng biểu đồ
        const xRight = d3.scaleLinear().range([0, HALF_OF_CHART]);

        // Tạo một trục tọa độ y nằm chính giữa không gian, vẽ đường thằng x = 0;
        const yAxisGroup = g.append('g').attr('transform', `translate(${chartWidth/2}, 0)`).attr('class', 'lm-y-axis');

        function updateCountTooltip(event, d) {
            _state.isHovering = true;
            tooltip.style('opacity', 1) // Hiển thị tooltip
                    .html(`Count: ${d.count} times`) // Hiển thị thông tin số lần xảy ra
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 25) + 'px')
        }

        function updateDowntimeTooltip(event, d) {
            _state.isHovering = true;
            tooltip.style("opacity", 1)
                    .html(`Downtime: ${d.duration} hours`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 25) + "px");
        }

        function updateTooltipPos(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 25) + "px");
        }

        function hideTooltip() {
            _state.isHovering = false;
            tooltip.style("opacity", 0)
        }

        /**
         * Cập nhập biểu đồ theo giá trị thực
         * @param {*} data 
         * @param {*} onClick 
         */
        function updateChart(data, onClick) {
            categoryScale.domain(data.map(d => d.name));

            xLeft.domain([0, d3.max(data, d => d.count) || 10]);
            xRight.domain([0, d3.max(data, d => d.duration) || 10]);

            // Cập nhập trục tọa độ y với thang đo mới nhất (danh sách categories mới nhất)
            yAxisGroup.transition().duration(1000).call(d3.axisLeft(categoryScale).tickSize(0))
            .selectAll(`#${_opts.container} text`)
            .style('text-anchor', 'start')
            .style('font-size', Utils.vhToPx(1.25) + 'px');

            // Gắn dữ liệu để sử dụng làm tham chiếu ánh xạ tới dữ liệu `counting`.
            const barsLeft = g.selectAll(`#${_opts.container} .lm-bar.left`).data(data, d => d.name);

            barsLeft.join( 
                // Gẵn dữ liệu
            enter => enter.append('rect') // Thêm một hình chữ nhật
                .attr('class', 'lm-bar left cursor-pointer') // Thêm từ khóa để truy vấn sau
                .attr('x', xLeft(0)) // Lấy giá trị range (tọa độ x) từ domain đề làm tọa độ x của trung điểm cạnh trái của hình chữ nhật
                .attr('y', d => categoryScale(d.name) + categoryScale.step() / 2) // Lấy giá trị range (tọa độ y) từ domain để làm tọa độ y trung điểm cạnh trái và phải của hình chữ nhật
                .attr('width', 0) // Ban đầu hình chữ nhật sẽ không có độ rộng (để làm hiệu ứng hình chữ nhật to dần và lấy cạnh bên phải làm gốc và to về bên trái)
                .attr('height', Utils.vhToPx(BASE_VW_UNIT)) // Chiều cao lúc này của hình chữ nhật chính là độ dày của bar nằm ngang
                .attr('rx', Utils.vwToPx(BASE_VW_UNIT * 5 / 16)) // Tạo border cho hình chữ nhật
                .attr('ry', Utils.vwToPx(BASE_VW_UNIT * 5 / 16)) // Tạo border cho hình chữ nhật
                .on("mouseover", updateCountTooltip)
                .on("mousemove", updateTooltipPos)
                .on("mouseout", hideTooltip)
                .on('click', (event, d) => { onClick && onClick(d) })
                .call(enter => enter.transition().duration(800).attr('x', d => xLeft(d.count)).attr('width', d => xLeft(0) - xLeft(d.count))), // Sau khi khởi tạo, dịch chuyển cạnh bên phải ra tọa độ thực tế của nó đồng thời tăng độ rông 
            update => update
                .transition().duration(800)
                .attr("y", d => categoryScale(d.name) + categoryScale.step() / 2)
                .attr("x", d => xLeft(d.count))
                .attr("width", d => xLeft(0) - xLeft(d.count)),
            exit => exit.transition().duration(1000).attr("width", 0).attr("x", xLeft(0)).remove()) // Khi thanh chữ nhật bị loại khỏi DOM thì tạo hiệu ứng nhỏ dần về gốc (kích thước và tọa độ thay đổi) sau đó xóa

            // Data labels cho bên trái
            const labelsLeft = g.selectAll(`#${_opts.container} .lm-label.left`).data(data, d => d.name);

            labelsLeft.join(
            enter => enter.append('text')
                .attr('class', 'lm-label left')
                .attr('x', d => xLeft(d.count) - 20)
                .attr('y', d => categoryScale(d.name) + categoryScale.step() / 2 + Utils.vhToPx(0.75))
                .attr('text-anchor', 'end') // canh phải text để sát thanh bar
                .style('font-size', Utils.vhToPx(BASE_VW_UNIT * 1.5) + 'px')
                .text(d => Utils.numberToReadableString(d.count))
                .style('opacity', 0)
                .transition().duration(800)
                .style('opacity', 1),
            update => update
                .transition().duration(800)
                .attr('x', d => xLeft(d.count) - 20)
                .attr('y', d => categoryScale(d.name) + categoryScale.step() / 2 + Utils.vhToPx(0.75))
                .text(d => Utils.numberToReadableString(d.count)),
            exit => exit.transition().duration(1000).style('opacity', 0).remove());

            const barsRight = g.selectAll(`#${_opts.container} .lm-bar.right`)
            .data(data, d => d.name);

            barsRight.join(
            enter => enter.append("rect")
                .attr("class", "lm-bar right cursor-pointer")
                .attr("x", chartWidth / 2)
                .attr("y", d => categoryScale(d.name) + categoryScale.step() / 2)
                .attr("width", 0)
                .attr('rx', Utils.vwToPx(BASE_VW_UNIT * 5 / 16))
                .attr("height", Utils.vhToPx(1))
                .on("mouseover", updateDowntimeTooltip)
                .on("mousemove", updateTooltipPos)
                .on("mouseout", hideTooltip)
                .on('click', (event, d) => {
                    onClick && onClick(d)
                })
                .call(enter => enter.transition().duration(800)
                .attr("width", d => xRight(d.duration))),
            update => update
                .transition().duration(800)
                .attr("y", d => categoryScale(d.name) + categoryScale.step() / 2)
                .attr("width", d => xRight(d.duration))
                .attr("height", Utils.vhToPx(1)),
            exit => exit.transition().duration(1000).attr("width", 0).remove()); // Khi thanh chữ nhật bị loại khỏi DOM thì tạo hiệu ứng nhỏ dần về gốc (kích thước và tọa độ thay đổi) sau đó xóa

            

            // Data labels cho bên phải
            const labelsRight = g.selectAll(`#${_opts.container} .lm-label.right`)
            .data(data, d => d.name);

            labelsRight.join(
            enter => enter.append('text')
                .attr('class', 'lm-label right')
                .attr('x', d => chartWidth / 2 + xRight(d.duration) + 20)
                .attr('y', d => categoryScale(d.name) + categoryScale.step() / 2 + Utils.vhToPx(0.75))
                .attr('text-anchor', 'start') // canh trái text để sát thanh bar
                .style('font-size', Utils.vhToPx(1.25) + 'px')
                .text(d => d.duration)
                .style('opacity', 0)
                .transition().duration(800)
                .style('opacity', 1),
            update => update
                .transition().duration(800)
                .attr('x', d => chartWidth / 2 + xRight(d.duration) + 20)
                .attr('y', d => categoryScale(d.name) + categoryScale.step() / 2 + Utils.vhToPx(0.75))
                .text(d => d.duration),
            exit => exit.transition().duration(1000).style('opacity', 0).remove()
            );
        }

        return {updateChart, dom, state: _state};
    }
    return { chart };
})();

export default MirrorChart;
