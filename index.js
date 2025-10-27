import {
  renderChart1,
  renderChart2,
  renderChart3,
  renderChart4,
  renderChart5,
  renderChart6,
  renderChart7,
  renderChart8,
  renderChart9,
  renderChart10,
  highchartsInit,
} from "./renderChart.js";

import API from "./api.js";
import { DataTableLib } from "./applib.js";

import {
  renderTable1,
  renderTable2,
  renderTable3,
  renderTable4,
  renderTable5,
  renderTable6,
  renderTable7,
  renderTable8,
  renderTable9,
  renderTable10,
  renderTable11,
} from "./renderTable.js";
const {
  getDataViolation,
  getDataTypeError,
  getDataByViolatorAndViolate,
  getDataTraining,
  getDataMOC,
  getDataBBS,
  getDataUserCommitment,
  getAnalyzeCommitment,
  getChecklistNotice,
  getChecklistResult,
  getBbsAuto,
  getTopErrorBBSAuto,
  getBbsByOwner,
  getLearningByTeam,
  getLearningByDay,
  getBBSInternal,
} = API;
import { UIService as _ui } from "./UIService.js";
function App() {
  const _renderState = {
    commitmentId: (val) => getApiDataUserCommitment(val),
    timeSpan: (val) => {
      Promise.all([showLoader(true), getApiBbsAuto(), getApiTopErrorBBSAuto(), getApiBbsByOwner()]).then(() =>
        showLoader(false)
      );
    },
    endDate: () => {},
  };
  const _state = new Proxy(
    {
      commitmentId: null,
      catagoty: null,
      timeSpan: null,
      deadLineTitle: null,
      endDate: null,
    },
    {
      set(target, prop, val) {
        const oldVal = target[prop];
        const isDifferent =
          typeof val === "object" && val !== null ? JSON.stringify(val) !== JSON.stringify(oldVal) : val !== oldVal;
        if (isDifferent) {
          target[prop] = val;
          _renderState?.[prop]?.(val);
        }
        return true;
      },
    }
  );

  function renderTableChecklistNotice(data) {
    const dt = new DataTableLib({
      api: data,
      rows: 15,
      tableId: "tableDetail",
      paginationId: "pagination-tbl_detail",
      pagination: false,
      formatData: (result) => {
        const arr = Array.isArray(result) ? result : result.data;
        return arr.map((item, i) => ({
          _index: i + 1,
          ...item,
        }));
      },
      columnsConfig: [
        { label: "#" },
        { label: "樓棟" },
        { label: "稽核時間" },
        { label: "屬性" },
        { label: "部門" },
        { label: "隱患類型" },
        { label: "內容描述" },
        { label: "稽核圖片" },
        { label: "稽核主管" },
        { label: "責任人" },
        { label: "原因分析" },
        { label: "改善對策" },
        { label: "改善后圖片" },
        { label: "狀態 " },
        { label: "完成時間" },
      ],
      rowRenderer: (item, meta) => {
        const sta =
          item?.status === 1
            ? `<span class="text-success">CLOSE</span>`
            : item?.status === 0
            ? `<span class="text-warning">ON GOING</span>`
            : "";
        return `
        <td>${item._index}</td>
        <td>${item.factory}</td>
        <td>${item.audit_time}</td>
        <td>${item.rank_of_finding}</td>
        <td>${item.audit_department}</td>
        <td>${item.type_of_hazard}</td>
         <td>${item.description}</td>
        <td>
        <a data-fancybox="gallery" href="${item.image}">
        <img src="${item.image}" alt="images">
        </a>
        </td>
        <td>${item.team}</td>
        <td>${item.person_in_charge}</td>
        <td>${item.analyze_cause}</td>
        <td>${item.corective_action}</td>
        <td>
          <a data-fancybox="gallery" href="${item.improved_picture}">
            <img src="${item.improved_picture}" alt="images"></td>
          </a>
        <td>${sta}</td>
        <td>${item?.completed_time || ""}</td>
        
        `;
      },
    });
    dt.init();
    Fancybox.bind("[data-fancybox='gallery']", {
      Thumbs: {
        autoStart: true, // Bật thumbnails
      },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: ["zoomIn", "zoomOut", "rotateCCW", "rotateCW"],
          right: ["download", "close"],
        },
      },
    });
  }

  async function getApiMocChart() {
    const res = await getDataMOC({});
    const data = res.data;

    const groupedData = data.reduce((acc, item) => {
      const week = item.week;
      if (!acc[week]) acc[week] = [];
      acc[week].push(item);
      return acc;
    }, {});
    const chartData = Object.keys(groupedData).map((week) => {
      const items = groupedData[week];
      return {
        week: week,
        totalQty: items.reduce((sum, i) => sum + i.totalQty, 0),
        over90Qty: items.reduce((sum, i) => sum + i.over90Qty, 0),
        unFinishQty: items.reduce((sum, i) => sum + i.unFinishQty, 0),
        finishQty: items.reduce((sum, i) => sum + i.finishQty, 0),
        teams: items.map((i) => i.team).join(", "),
        percentTotal: Math.round(
          (items.reduce((sum, i) => sum + i.finishQty, 0) / items.reduce((sum, i) => sum + i.totalQty, 0)) * 100
        ),
      };
    });
    renderChart2(chartData);
    renderTable2(data);
  }

  async function getApiBBSChart() {
    const data = await getDataBBS({});
    renderChart3(data.data);
    renderTable3(data.data);
  }

  async function getApiStatusTraining() {
    const data = await getDataTraining({});
    renderChart1(data.data);
    renderTable1(data.data);
  }

  async function getApitChecklistNotice() {
    const data = await getChecklistNotice({});
    renderTable6(data.data);
  }

  async function handleGetDetail() {
    const id = this.dataset.id;
    const data = await getChecklistResult({ idNotice: id });
      const myModal = new bootstrap.Modal(document.getElementById("myModal"));
      myModal.show();
    renderTableChecklistNotice(data.data);
  }

  async function getApiChartError() {
    const data = await getDataTypeError({});
    renderChart5(data.data);
  }

  async function getApiDataViolation() {
    const data = await getDataViolation({});
    renderTable4(data.data);
  }

  async function getApiDataByViolatorAndViolate() {
    const data = await getDataByViolatorAndViolate({});
    renderChart4(data.data);
  }

  async function getApiAnalyzeCommitment() {
    const data = await getAnalyzeCommitment({});
    renderChart7(data.data, handleClickChart);
    if (data.data && data.data.length > 0) {
      const firstItem = data.data[0]; // lấy cột đầu tiên

      // Gọi hàm load chi tiết như khi click vào cột
      _state.catagoty = firstItem.name;
      _state.commitmentId = firstItem.id;
      // hoặc handleClickChart7(firstItem.id);
    }
  }

  async function getApiDataUserCommitment(val) {
    const data = await getDataUserCommitment({ commitmentId: val });
    // const res=await fetch('/sample-system/assets/js/factory_safety_daily_report/data.json')
    // const data= await res.json()
    renderTable5(data.data, val, _state);
  }

  async function getApiBbsAuto() {
    const res = await getBbsAuto({ timeSpan: _state.timeSpan });
    const data = res?.data || [];

    const [start, end] = _state.timeSpan.split(" - ").map((d) => new Date(d));
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toLocaleDateString("en-CA")); // "YYYY-MM-DD" mà KHÔNG lệch UTC
    }
    const floors = ["B08-1F", "B08-2F", "B08-3F", "B08-4F"];

    const groupDate = data.reduce((acc, item) => {
      const date = item.audit_time;
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    const dataChart = dates.map((date) => {
      const item = groupDate[date] || [];
      return {
        audit_time: date,
        floor: floors,
        total: floors.map((f) => item.find((i) => i.floor === f)?.total || 0),
        finish: floors.map((f) => item.find((i) => i.floor === f)?.finish || 0),
        process: floors.map((f) => item.find((i) => i.floor === f)?.process || 0),
      };
    });

    renderChart6(dataChart);
    renderTable7(data, floors, dates); // ✅ Truyền thêm "dates" vào
  }

  async function getApiTopErrorBBSAuto() {
    const res = await getTopErrorBBSAuto({ timeSpan: _state.timeSpan });
    const raw = res.data;

    // 1️⃣ Nhóm theo type_error
    const groupError = raw.reduce((acc, item) => {
      const key = item.type_error;
      if (!acc[key]) acc[key] = { total: 0, finish: 0, process: 0 };
      acc[key].total += item.total || 0;
      acc[key].finish += item.finish || 0;
      acc[key].process += item.process || 0;
      return acc;
    }, {});

    // 2️⃣ Chuyển về mảng để sort
    const sorted = Object.entries(groupError)
      .map(([type_error, val]) => ({
        type_error,
        total: val.total,
        finish: val.finish,
        process: val.process,
      }))
      .sort((a, b) => b.total - a.total) // sắp xếp giảm dần theo total
      .slice(0, 3); // 3 lỗi nhiều nhất

    // 3️⃣ Chuẩn hóa dữ liệu cho chart
    const dataChart = {
      categories: sorted.map((i) => i.type_error),
      total: sorted.map((i) => i.total),
      finish: sorted.map((i) => i.finish),
      process: sorted.map((i) => i.process),
    };
    // 4️⃣ Vẽ chart
    console.log(dataChart);
    renderChart8(dataChart, handleClickChart);
  }

  async function getApiBbsByOwner() {
    const data = await getBbsByOwner({ timeSpan: _state.timeSpan });
    const groupOwners = data.data.reduce((acc, item) => {
      const owners = item.owner;
      if (!acc[owners]) acc[owners] = [];
      acc[owners].push(item);
      return acc;
    }, {});
    const dataChart = Object.keys(groupOwners).map((owner) => {
      const item = groupOwners[owner];
      return {
        owner: owner,
        total: item.reduce((sum, i) => sum + i.total, 0),
        audit_time: [...new Set(item.map((i) => i.audit_time))],
      };
    });
    renderChart9(dataChart, handleClickChart);
  }

  async function getApiLearningByTeam() {
    const data = await getLearningByTeam({ timeSpan: getRange(2, 2) });
    renderTable8(data.data);
  }

  async function getApiLearningByDay(params) {
    const data = await getLearningByDay({ timeSpan: getRange(10, 1) });
    renderChart10(data.data);
  }

  function handleClickTableBBS(e) {
    const span = e.target.closest("span[data-date]");
    if (!span) return;
    const date = span.dataset.date;

    getApiBBSInternal(date);
  }

  async function getApiBBSInternal(date) {
    try {
      const formatted = date.replaceAll("-", "/");
      const time = `${formatted} 00:00 - ${formatted} 23:59`;
      const data = await getBBSInternal({ timeSpan: time });
      const groupedData = data.data.reduce((acc, item) => {
        const status = item.status;
        if (!acc[status]) acc[status] = [];
        acc[status].push(item);
        return acc;
      }, {});
      const myModal = new bootstrap.Modal(document.getElementById("detailBBS"));
      myModal.show();
      renderTable9(groupedData["0"]);
    } catch (error) {
      console.log(error);
    }
  }

  function handleAddEventListener() {
    _ui.btnDetail.forEach((item) => {
      item.addEventListener("click", handleGetDetail);
    });
    _ui?.btnHome?.addEventListener("click", () => (window.location.href = "/sample-system/"));
    _ui.table_7.addEventListener("click", (e) => handleClickTableBBS(e));
  }

  async function handleClickChart(evt) {
    const chartHandlers = {
      "chart-7": handleClickChart7,
      "chart-8": handleClickChart8,
      "chart-9": handleClickChart9,
      // "chart-9": handleClickChart9,
    };
    const chartId = this.series.chart.renderTo.id;
    const handler = chartHandlers[chartId];
    if (handler) {
      handler.call(this, evt);
    }
  }
  function handleClickChart7(event) {
    const point = event.point; // lấy đối tượng point
    const id = point.id;
    _state.commitmentId = id;
    _state.catagoty = point.category;
  }

  async function handleClickChart9(event) {
    const point = event.point;
    const data = await getBBSInternal({ timeSpan: _state.timeSpan, owner: point.name });
    const myModal = new bootstrap.Modal(document.getElementById("detailOwner"));
    myModal.show();
    renderTable10(data.data);
  }
  async function handleClickChart8(event) {
    const point = event.point;
    const data = await getBBSInternal({ timeSpan: _state.timeSpan, type: point.category });
    const myModal = new bootstrap.Modal(document.getElementById("detailTop3"));
    myModal.show();
    renderTable11(data.data);
  }
  function getTime(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - (daysAgo - 1));
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function formatTime(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${y}/${m}/${day} ${h}:${mi}`;
  }
  function getRange(daysAgoStart, daysAgoEnd) {
    const start = getTime(daysAgoStart);
    start.setHours(0, 0, 0, 0);

    const end = getTime(daysAgoEnd);
    end.setHours(23, 59, 59, 59);

    return `${formatTime(start)} - ${formatTime(end)}`;
  }
  async function init() {
    showLoader(true);
    const defaultTimeSpan = `${formatTime(getTime(6))} - ${formatTime(new Date())}`;
    _state.timeSpan = defaultTimeSpan;
    _state.endDate = formatTime(new Date());
    highchartsInit();
    await Promise.all([
      getApiStatusTraining(),
      getApiMocChart(),
      getApiBBSChart(),
      getApitChecklistNotice(),
      getApiChartError(),
      getApiDataViolation(),
      getApiDataByViolatorAndViolate(),
      getApiAnalyzeCommitment(),
      getApiLearningByDay(),
      getApiLearningByTeam(),
    ]);

    handleAddEventListener();
    flatpickr("#daterange", {
      mode: "range",
      dateFormat: "Y/m/d",
      allowInput: false,
      altInput: false,
      minDate: "2020-01-01",
      maxDate: null,
      time_24hr: true,
      enableTime: false,
      defaultDate: [getTime(6), new Date()], // mặc định 5 ngày gần nhất

      onChange: async function (selectedDates, dateStr, instance) {
        // Nếu chọn đúng 1 ngày
        if (selectedDates.length === 1) {
          const endDate = selectedDates[0];
          const startDate = new Date(endDate);
          startDate.setDate(endDate.getDate() - 5);

          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          instance.setDate([startDate, endDate], true);
        }

        // Nếu chọn đủ 2 ngày (người dùng tự chọn range)
        else if (selectedDates.length === 2) {
          const startDate = selectedDates[0];
          const endDate = selectedDates[1];
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          _state.timeSpan = `${formatTime(startDate)} - ${formatTime(endDate)}`;
          _state.endDate = `${formatTime(endDate)}`;
        }
      },
    });
    showLoader(false);
  }

  return { init };
}
document.addEventListener("DOMContentLoaded", () => {
  const app = App();
  app.init();
});
