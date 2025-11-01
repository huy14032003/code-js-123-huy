import * as T from "./types.js"; // eslint-disable-line no-unused-vars
import Utils from "./Utils.js";
import AutoScrollElement from "./autoscroll.js";
import { writerAgent } from "./agent.js";
import gsap from "./libs/gsap/gsap-core.js";
import { FORCE_RECALL_LAST_MESSAGE, SETTING_STORE_KEY } from "./config.js";
import {
  highchartsInit,
  renderChart6,
  renderChart7,
  renderChart8,
  renderChart9,
  renderChart1,
} from "./renderChart.js";
import { renderTable1, renderTable2 } from "./renderTable.js";
const DashboardSMT = (() => {
  const observerMap = {};
  const _state = new Proxy(
    {},
    {
      async set(obj, prop, value) {
        const oldValue = obj[prop];
        obj[prop] = value;
        if (oldValue != value) {
          observerMap[prop] = 1;
          if (
            [
              "lineName",
              "machine",
              "factory",
              "project",
              "building",
              "section",
              "errorCode",
              "reportLine",
              "reportMachine",
              "reportPickup",
            ].includes(prop)
          ) {
            Utils.changeParamsURL(prop, value);
          }
          if (["lineName", "machine", "errorCode"].includes(prop)) {
            _showCurrentHeaderReport(prop, value);
            _showCurrentBadge(prop, value);
          }
          if (prop == "errorCode") {
            _handleSelectErrorCode(value);
          }
        }
        return value;
      },
    }
  );

  const _ui = {
    reportPanel: Utils.createDOMRef("reportPanel"),
    appAsideRight: Utils.createDOMRef("appAsideRight"),
    appAsideLeft: Utils.createDOMRef("appAsideLeft"),
    agentProgress: Utils.createDOMRef("agent-interaction-progress"),
    agentPlayground: Utils.createDOMRef("agent-interaction"),
  };

  function openRightAside() {
    _state.currentTransform = "rightOpen";
    _ui.appAsideRight.value.classList.remove("opacity-0", "app_aside-right--collapsed");
    _ui.appAsideLeft.value.classList.add("opacity-0", "app_aside-left--collapsed", "hide");
  }

  function openLeftAside() {
    _state.currentTransform = "leftOpen";
    _ui.appAsideRight.value.classList.add("opacity-0", "app_aside-right--collapsed", "hide");
    _ui.appAsideLeft.value.classList.remove("opacity-0", "app_aside-left--collapsed");
  }

  function closeAside() {
    _state.currentTransform = "center";
    _ui.appAsideRight.value.classList.add("opacity-0", "app_aside-right--collapsed");
    _ui.appAsideRight.value.classList.remove("hide");
    _ui.appAsideLeft.value.classList.add("opacity-0", "app_aside-left--collapsed");
    _ui.appAsideLeft.value.classList.remove("hide");
  }

  function toggleLeftAside() {
    if (_state.currentTransform != "leftOpen") {
      openLeftAside();
      return;
    }
    closeAside();
  }

  function toggleRightAside() {
    if (_state.currentTransform != "rightOpen") {
      openRightAside();
      return;
    }
    closeAside();
  }

  function checkRedirectToReport(itemsNeedReport) {
    if (itemsNeedReport && itemsNeedReport.length > 0) {
      if (_state.reportLine || _state.reportMachine || _state.reportPickup) {
        const line = itemsNeedReport.find((item) => item.lineName);
        const machine = itemsNeedReport.find((item) => item.machine);
        _state.lineName = line;
        _state.machine = machine;
      }
    }
    if (_state.reportLine || _state.reportMachine || _state.reportPickup) {
      _state.reportLine && _state.lineName && (viewLineReport(_state.lineName), (_state.reportLine = ""));
      _state.reportMachine && _state.machine && (viewMachineReport(_state.machine), (_state.reportMachine = ""));
      _state.reportPickup && _state.lineName && (viewLinePickupReport(_state.lineName), (_state.reportPickup = ""));
      _state.reportPickup && _state.machine && (viewMachinePickupReport(_state.machine), (_state.reportPickup = ""));
    }
  }

  const loopRealtimeMachineStatus = Utils.debounceAsync(async () => {
    await _loadMachinesStatus({
      factory: _state.factory ?? _state.systemFactory ?? "",
      building: _state.building ?? _state.systemBuilding ?? "",
      project: _state.project ?? _state.systemProject ?? "",
      section: _state.section ?? _state.systemSection ?? "",
      lineName: _state.lineName ?? _state.systemLineName ?? "",
      machine: _state.machine ?? _state.systemMachine ?? "",
    });
    await loopRealtimeMachineStatus();
  }, 2000);

  function scrollizeForWriteAgent() {
    const agentPlayground = _ui.agentPlayground.value;
    if (agentPlayground) {
      new AutoScrollElement(agentPlayground);
    } else {
      console.warn("Play ground is missing for creating auto scroll element");
    }
  }

  function refreshAgentInteraction() {
    writerAgent(FORCE_RECALL_LAST_MESSAGE, _state);
  }

  function switchToHome() {
    writerAgent("Summary capacity status", _state);
    ["factory", "building", "project", "section", "lineName", "machine"].forEach((prop) => {
      _state[prop] = null;
    });
    _updateCascader(_state);
    switchToScreen(1);
  }

  function toggleAppPanel() {
    const reportPanel = _ui.reportPanel.value;
    if (!reportPanel) {
      console.warn("Report panel is not exiting for toggle operation");
    } else {
      if (reportPanel.classList.contains("open")) {
        gsap.to(reportPanel, { x: "18.6rem", ease: "expoScale(0.5,7,power2.in)", duration: 0.3 });
        reportPanel.classList.remove("open");
        reportPanel.querySelector(".arrow-open")?.classList.remove("d-none"); //TODO: change to index for using DOMRef for increasing better performance
        reportPanel.querySelector(".arrow-close")?.classList.add("d-none"); //TODO: change to index for using DOMRef for increasing better performance
      } else {
        gsap.to(reportPanel, { x: "0rem", ease: "expoScale(0.5,7,power2.out)", duration: 0.3 });
        reportPanel.classList.add("open");
        reportPanel.querySelector(".arrow-open").classList.add("d-none"); //TODO: change to index for using DOMRef for increasing better performance
        reportPanel.querySelector(".arrow-close").classList.remove("d-none"); //TODO: change to index for using DOMRef for increasing better performance
      }
    }
  }

  async function init() {
    scrollizeForWriteAgent();
    writerAgent("Summary capacity status", _state, checkRedirectToReport);
    highchartsInit();
    renderChart6();
    renderChart7();
    renderChart8();
    renderChart9();
    renderChart1();
    renderTable1(document.getElementById("table-1"));
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

document.addEventListener("DOMContentLoaded", () => {
  let oldSetting = localStorage.getItem(SETTING_STORE_KEY);
  if (oldSetting) {
    oldSetting = JSON.parse(oldSetting);
  }
  DashboardSMT.init({
    numberOfScreen: 43,
    layoutId: "appLayout",
    createMirrorCharts: function () {
      this.mirrorChartError = MirrorChart.chart({ container: "chart4" });
      this.mirrorChartMachine = MirrorChart.chart({ container: "chart3" });
      this.mirrorChartLine = MirrorChart.chart({ container: "chart2" });
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
