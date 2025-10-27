import { UIService as _ui } from "./UIService.js";
export function renderTable1(data) {
  const tbody = _ui.table_1.querySelector("tbody");
  const tfoot = _ui.table_1.querySelector("tfoot") || document.createElement("tfoot");
  tbody.innerHTML = "";
  tfoot.innerHTML = "";

  let sumTotalLine = 0;
  let sumTrained = 0;
  let sumNoTrained = 0;
  data.forEach((item, i) => {
    const tr = document.createElement("tr");
    const percent = Math.round((item.total_line_trained / item.total_line) * 100);
    tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${item.team}</td>
          <td>${item.total_line}</td>
          <td  style="color:green; font-weight: 700;">${item.total_line_trained}</td>
          <td  style=" color:red; font-weight: 700;">${item.total_line_no_trained}</td>
          <td>${percent}%</td>
          `;
    sumTotalLine += item.total_line;
    sumTrained += item.total_line_trained;
    sumNoTrained += item.total_line_no_trained;
    tbody.append(tr);
  });
  const totalPercent = Math.round((sumTrained / sumTotalLine) * 100);

  // Thêm vào tfoot
  tfoot.innerHTML = `
      <tr class="font-semibold bg-gray-100">
        <td colspan="2" class="text-center" style="background-color: #264c8b">Total</td>
        <td>${sumTotalLine}</td>
        <td  style="color:green; font-weight: 700;">${sumTrained}</td>
        <td  style="color:red; font-weight: 700;">${sumNoTrained}</td>
        <td>${totalPercent}%</td>
      </tr>
    `;
}

export function renderTable2(data) {
  const thead = _ui.table_2.querySelector("thead");
  const tbody = _ui.table_2.querySelector("tbody");
  const tfoot = _ui.table_2.querySelector("tfoot");

  thead.innerHTML = "";
  tbody.innerHTML = "";
  tfoot.innerHTML = "";

  // --- Lấy danh sách tuần ---
  const weeks = [...new Set(data.map((d) => d.week))];
  // --- Gom nhóm theo team ---
  const grouped = {};
  data.forEach((item) => {
    if (!grouped[item.team]) grouped[item.team] = [];
    grouped[item.team].push(item);
  });
  // --- Tạo THEAD động ---
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");

  // Hàng đầu: tên tuần (colspan=3)
  tr1.innerHTML =
    `
        <th rowspan="2">Item</th>
        <th rowspan="2">超過90天</th>
        
        ` + weeks.map((w) => `<th colspan="3">${w.split(" ")[0]}</th>`).join("");

  // Hàng hai: tên cột chi tiết
  tr2.innerHTML = weeks
    .map(
      () => `
          <th>需要完成</th>
          <th>實際完成</th>
          <th>未完成</th>
        `
    )
    .join("");

  thead.append(tr1, tr2);
  // --- Render BODY ---
  Object.keys(grouped).forEach((team) => {
    const base = grouped[team];
    const firstRecord = base[0];
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td>${team}</td>
             <td>${firstRecord.over90Qty ?? "-"}</td>
    
            ` +
      weeks
        .map((w) => {
          const rec = base.find((x) => x.week === w);
          return rec
            ? `
                  <td>${rec.totalQty}</td>
                  <td>${rec.finishQty}</td>
                  <td>${rec.unFinishQty}</td>
                `
            : `<td>-</td><td>-</td><td>-</td>`;
        })
        .join("");
    tbody.append(tr);
  });

  // --- Render FOOTER (tổng từng tuần) ---
  const sumByWeek = weeks.map((w) => {
    const items = data.filter((x) => x.week === w);
    return {
      week: w,
      totalQty: items.reduce((s, i) => s + i.totalQty, 0),
      finishQty: items.reduce((s, i) => s + i.finishQty, 0),
      unFinishQty: items.reduce((s, i) => s + i.unFinishQty, 0),
    };
  });

  const trFoot = document.createElement("tr");
  const totalOver90 = Object.values(grouped)
    .map((arr) => arr[0].over90Qty || 0)
    .reduce((a, b) => a + b, 0);

  trFoot.innerHTML =
    `<td style="background-color: #264c8b">Total</td>
          <td>${totalOver90}</td>
          ` +
    sumByWeek
      .map(
        (w) => `
          <td>${w.totalQty}</td>
          <td>${w.finishQty}</td>
          <td>${w.unFinishQty}</td>
        `
      )
      .join("");
  tfoot.append(trFoot);
}

export function renderTable3(data) {
  const table = _ui.table_3;
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  tbody.innerHTML = "";
  thead.innerHTML = "";

  const labels = ["標準靜黏項數", "實際靜黏項數", "結案達成率", "項數達成率"];

  // Tạo header: 1 cột trống + các leader
  let headerHTML = "<th></th>";
  data.forEach((item) => {
    headerHTML += `<th>${item.obs_leader}</th>`;
  });
  // headerHTML += "</tr>";
  thead.innerHTML = headerHTML;

  // Tạo các row theo label
  labels.forEach((label) => {
    const tr = document.createElement("tr");
    let rowHTML = `<td>${label}</td>`;

    data.forEach((item) => {
      switch (label) {
        case "標準靜黏項數":
          rowHTML += `<td>${item.obs_items_target}</td>`;
          break;
        case "實際靜黏項數":
          rowHTML += `<td>${item.obs_items_actual}</td>`;
          break;
        case "結案達成率":
          rowHTML += `<td>${item.obs_items_rate}%</td>`;
          break;
        case "項數達成率":
          rowHTML += `<td>${item.approved_rate}%</td>`;
          break;
      }
    });

    tr.innerHTML = rowHTML;
    tbody.append(tr);
  });
}

export function renderTable4(data) {
  const thead = _ui.table_4.querySelector("thead");
  const tbody = _ui.table_4.querySelector("tbody");
  const tfoot = _ui.table_4.querySelector("tfoot");

  thead.innerHTML = "";
  tbody.innerHTML = "";
  tfoot.innerHTML = "";

  if (!data || data.length === 0) return;

  const columns = Object.keys(data[0]);
  const hasMonth = columns.includes("Month") || columns.includes("month");

  // ✅ Thêm cột Total
  const allCols = [...columns, "Total"];

  // --- Render HEAD ---
  const trHead = document.createElement("tr");
  trHead.innerHTML = allCols
    .map((col) => `<th style="text-transform: capitalize;">${col.replace("_", " ")}</th>`)
    .join("");
  thead.append(trHead);

  // --- Render BODY ---
  data.forEach((item) => {
    const tr = document.createElement("tr");

    let totalRow = 0;
    const cells = columns.map((col) => {
      const value = item[col] ?? "-";

      // ✅ Cộng tổng, bỏ qua cột Month
      if (typeof value === "number" && col.toLowerCase() !== "month") totalRow += value;

      // ✅ Tô đỏ nếu ≠ 0 và không phải cột Month
      const style =
        typeof value === "number" && value !== 0 && col.toLowerCase() !== "month" ? "color:red;font-weight:700;" : "";

      return `<td style="${style}">${value}</td>`;
    });

    // Thêm ô tổng cuối
    cells.push(`<td style="font-weight:600;">${totalRow}</td>`);

    tr.innerHTML = cells.join("");
    tbody.append(tr);
  });

  // --- Tính tổng theo cột ---
  const totals = {};
  columns.forEach((col) => {
    if (col.toLowerCase() !== "month") {
      totals[col] = data.reduce((sum, item) => sum + (item[col] || 0), 0);
    } else {
      totals[col] = "Total";
    }
  });

  const totalOfTotals = columns.reduce((sum, col) => {
    return col.toLowerCase() !== "month" ? sum + (totals[col] || 0) : sum;
  }, 0);
  totals["Total"] = totalOfTotals;

  // --- Render dòng tổng ---
  const trTotal = document.createElement("tr");
  trTotal.style.fontWeight = "bold";
  trTotal.innerHTML = allCols.map((col) => `<td>${totals[col]}</td>`).join("");
  tbody.append(trTotal);

  // --- Dòng trừ điểm ---
  const minusRow = {};
  columns.forEach((col) => {
    if (col.toLowerCase() !== "month") {
      minusRow[col] = (totals[col] * 0.2).toFixed(1);
    } else {
      minusRow[col] = "扣分 (每件扣0.2分)";
    }
  });
  minusRow["Total"] = (totalOfTotals * 0.2).toFixed(1);

  const trMinus = document.createElement("tr");
  trMinus.innerHTML = allCols.map((col) => `<td>${minusRow[col]}</td>`).join("");
  tbody.append(trMinus);
}

export function renderTable5(data, val, _state) {
  const tbody = _ui.table_5.querySelector("tbody");
  const tfoot = _ui.table_5.querySelector("tfoot");
  const title = document.getElementById("title_table-5");
  title.innerHTML = _state.catagoty || "";
  tbody.innerHTML = "";
  tfoot.innerHTML = "";

  // Sắp xếp data theo ngày
  data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  // Nhóm theo due_date
  const groupedByDate = {};
  data.forEach((item) => {
    if (!groupedByDate[item.due_date]) groupedByDate[item.due_date] = [];
    groupedByDate[item.due_date].push(item);
  });

  let totalSum = 0,
    finishSum = 0,
    processSum = 0,
    percentSum = 0;
  let globalIndex = 1;

  Object.keys(groupedByDate).forEach((dateKey) => {
    const group = groupedByDate[dateKey];

    // Nhóm con theo cft trong mỗi due_date
    const groupedByCft = {};
    group.forEach((item) => {
      if (!groupedByCft[item.cft]) groupedByCft[item.cft] = [];
      groupedByCft[item.cft].push(item);
    });

    const dateRowspan = group.length;
    let dateInserted = false;
    Object.keys(groupedByCft).forEach((cftKey) => {
      const subGroup = groupedByCft[cftKey];
      const cftRowspan = subGroup.length;
      let cftInserted = false;

      subGroup.forEach((item, index) => {
        const tr = document.createElement("tr");

        // Cột số thứ tự
        const tdIndex = document.createElement("td");
        tdIndex.textContent = globalIndex++;
        tr.appendChild(tdIndex);

        // Merge cột cft ngay sau index
        if (!cftInserted) {
          const tdCft = document.createElement("td");
          tdCft.textContent = cftKey;
          tdCft.rowSpan = cftRowspan;
          tdCft.style.verticalAlign = "middle";
          tr.appendChild(tdCft);
          cftInserted = true;
        }

        // Các cột còn lại
        const tdName = document.createElement("td");
        tdName.textContent = item.name;
        tr.appendChild(tdName);

        const tdBoss = document.createElement("td");
        tdBoss.textContent = item.boss_owner;
        tr.appendChild(tdBoss);

        const tdTotal = document.createElement("td");
        tdTotal.textContent = item.total;
        tr.appendChild(tdTotal);

        const tdFinish = document.createElement("td");
        tdFinish.textContent = item.finish;
        tdFinish.style.color = "green";
        tdFinish.style.fontWeight = "700";
        tr.appendChild(tdFinish);

        const tdProcess = document.createElement("td");
        tdProcess.textContent = item.process;
        tdProcess.style.color = "red";
        tdProcess.style.fontWeight = "700";
        tr.appendChild(tdProcess);

        const tdPercent = document.createElement("td");
        tdPercent.textContent = item.percent_complete + "%";
        tr.appendChild(tdPercent);

        // Merge cột due_date cuối cùng
        if (!dateInserted) {
          const tdDate = document.createElement("td");
          _state.deadLineTitle = dateKey;
          tdDate.rowSpan = dateRowspan;
          tdDate.style.verticalAlign = "middle";
          tdDate.style.textAlign = "center";

          // ✅ Tạo ảnh QR code từ source có sẵn
          const img = document.createElement("img");
          img.src = `${item.qr_code}`;
          img.alt = "QR Code";
          img.style.width = "100px";
          img.style.height = "100px";

          tdDate.appendChild(img);
          tr.appendChild(tdDate);
          dateInserted = true;
        }
        tbody.appendChild(tr);

        totalSum += item.total;
        finishSum += item.finish;
        processSum += item.process;
        percentSum += item.percent_complete;
      });
    });
  });

  const avg_Percent = data.length ? (percentSum / data.length).toFixed(0) : 0;

  tfoot.innerHTML = `
        <tr>
          <td colspan="4" class="fw-bold text-center" style="background-color: #264c8b; color:white">Grand Total</td>
          <td>${totalSum}</td>
          <td style="color:green; font-weight: 700;">${finishSum}</td>
          <td style="color:red; font-weight: 700;" >${processSum}</td>
          <td>${avg_Percent}%</td>
          <td></td>
        </tr>
      `;
  _ui.deadLineTitle.textContent = _state.deadLineTitle;
}

export function renderTable6(data) {
  const tbody = _ui.table_6.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach((item, i) => {
    const tr = document.createElement("tr");
    const sta =
      item?.status === 1
        ? `<span class="text-success"  >CLOSE</span>`
        : item?.status === 0
        ? `<span class="text-warning" >ON GOING</span>`
        : "";
    tr.innerHTML = `
          <td>${i + 1}</td>
          <td style="text-align: left;">${item.checklist_item}</td>
          <td style="text-align: left;">${item.checklist_content.replace(/\r\n/g, "<br>")}</td>
          <td>${item.checklist_time}</td>
          <td>${item.checklist_team}</td>
          <td>${item.team}</td>
          <td>${item?.issue || "N/A"}</td>
          <td>${sta}</td>
          <td>${item?.issue || "N/A"}</td>
          <td><a style="cursor: pointer;font-size: 1rem;" class="text-primary text-decoration-none btn-sm btnDetail"  data-id=${
            item.id
          }>Detail</a></td>
        `;
    tbody.append(tr);
  });
}

export function renderTable7(data, floors, dates) {
  const table = _ui.table_7;
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  const tfoot = table.querySelector("tfoot");

  thead.innerHTML = "";
  tbody.innerHTML = "";
  tfoot.innerHTML = "";

  // ✅ Gom nhóm theo ngày
  const grouped = {};
  data.forEach((item) => {
    if (!grouped[item.audit_time]) grouped[item.audit_time] = [];
    grouped[item.audit_time].push(item);
  });

  // ----- Render header -----
  const tr1 = document.createElement("tr");
  tr1.innerHTML = `<th style="height: 2rem;">Item</th>` + dates.map((d) => `<th>${d}</th>`).join("");
  thead.append(tr1);

  // ----- Render body -----
  floors.forEach((floor) => {
    const tr = document.createElement("tr");
    let rowHTML = `<td>${floor}</td>`;

    dates.forEach((date) => {
      const list = grouped[date] || [];
      const found = list.find((x) => x.floor === floor);
      rowHTML += `<td>${found ? found.total : 0}</td>`;
    });

    tr.innerHTML = rowHTML;
    tbody.append(tr);
  });
  // ----- Render footer -----
  const totalByDate = [];
  const openByDate = [];
  const percentByDate = [];

  dates.forEach((date) => {
    const list = grouped[date] || [];
    const total = list.reduce((s, i) => s + (i.total || 0), 0);
    const open = list.reduce((s, i) => s + (i.process || 0), 0);
    const finish = list.reduce((s, i) => s + (i.finish || 0), 0);
    const percent = total ? Math.round((finish / total) * 100) : 0;

    totalByDate.push(total);
    openByDate.push(open);
    percentByDate.push(percent);
  });

  // const tr=document.createElement('tr')
  const html = `
          <tr>
          <td>Total</td>
          ${totalByDate.map((item) => `<td class="">${item}</td>`).join("")}
          </tr>
          <tr>
          <td>Open</td>
          ${openByDate
            .map(
              (item, i) =>
                `<td class=""><span 
                ${item !== 0 ? `data-date="${dates[i]}"` : ""}
                 style="${
                   item !== 0
                     ? "color:red; font-weight: 700; text-decoration: underline; cursor: pointer; font-size: 1rem;"
                     : ""
                 }">${item}</span></td>`
            )
            .join("")}
          </tr>
          <tr>
          <td>Close percent</td>
          ${percentByDate.map((item) => `<td class="">${item}%</td>`).join("")}
          </tr>
          `;
  tfoot.innerHTML += html;
}

export function renderTable8(data) {
  const tbody = _ui.table_8.querySelector("tbody");
  const tfoot = _ui.table_8.querySelector("tfoot");

  tbody.innerHTML = "";
  tfoot.innerHTML = "";
  let totalSum = 0;
  let totalPass = 0;
  let totalFail = 0;
  let totalRatePass = 0;
  if (data.length) {
    data.forEach((item, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${item.department}</td>
          <td>${item.total}</td>
          <td style="color:green; font-weight: 700; ">${item.pass}</td>
          <td  style="color:red; font-weight: 700; ">${item.fail}</td>
          <td>${item.pass_rate}% </td>
          `;
      totalSum += item.total;
      totalPass += item.pass;
      totalFail += item.fail;
      tbody.append(tr);
    });
  } else {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td colspan="100">NO DATA</td>`;
    tbody.append(tr);
  }

  totalRatePass = Math.round((totalPass / totalSum) * 100);
  data?.length
    ? (tfoot.innerHTML = `
        <tr>
          <td colspan="2" class="fw-bold text-center" style="background-color: #264c8b; color:white">Grand Total</td>
          <td>${totalSum}</td>
          <td  style="color:green; font-weight: 700; ">${totalPass}</td>
          <td  style=" color:red; font-weight: 700; ">${totalFail}</td>
          <td>${totalRatePass}%</td>
        </tr>
      `)
    : "";
}

export function renderTable9(data) {
  const tbody = _ui.table_9.querySelector("tbody");
  tbody.innerHTML = "";
  // const statusOpen=Object.keys(0)
  if (data.length) {
    data.forEach((item, i) => {
      const tr = document.createElement("tr");
      const status = `${
        item.status === 0 ? `<span class="text-success">CLOSE</span>` : `<span class="text-danger">OPEN</span>`
      }`;
      tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${item.floor}</td>
          <td>${item.audit_time}</td>
          <td>${item.rank}</td>
          <td>${item.department}</td>
          <td>${item.type_error}</td>
          <td>${item.description}</td>
          <td>
          ${item.audit_picture?`
            <a data-fancybox="gallery_9" href="${item.audit_picture}">
              <img src="${item.audit_picture}" alt="images" style="width: 100px; height:100px;"></td>
            </a>
            `:''}
          </td>
          <td>${item.audit_department}</td>
          <td>${item.owner}</td>
          <td>${item.root_cause}</td>
          <td>${item.action}</td>
          <td>${item?.improved_picture?
            `
              <a data-fancybox="gallery_9" href="${item.improved_picture}">
                <img src="${item.improved_picture}" alt="images"  style="width: 100px; height:100px;"></td>
              </a>
            `:''
          }
          </td>
          <td>${status}</td>
          <td>${item.completed_time}</td>
          `;
      tbody.append(tr);
    });
    Fancybox.unbind(_ui.table_9); 
    Fancybox.bind("[data-fancybox='gallery_9']", {
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
  } else {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td colspan="100">NO DATA</td>`;
    tbody.append(tr);
  }
}
export function renderTable10(data) {
  const tbody = _ui.table_10.querySelector("tbody");
  tbody.innerHTML = "";
  // const statusOpen=Object.keys(0)
  if (data.length) {
    data.forEach((item, i) => {
      const tr = document.createElement("tr");
      const status = `${
        item.status === 0 ? `<span class="text-success">CLOSE</span>` : `<span class="text-danger">OPEN</span>`
      }`;
      tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${item.floor}</td>
          <td>${item.audit_time}</td>
          <td>${item.rank}</td>
          <td>${item.department}</td>
          <td>${item.type_error}</td>
          <td>${item.description}</td>
          <td>
          ${item.audit_picture?`
            <a data-fancybox="gallery_10" href="${item.audit_picture}">
              <img src="${item.audit_picture}" alt="images" style="width: 100px; height:100px;"></td>
            </a>
            `:''}
          </td>
          <td>${item.audit_department}</td>
          <td>${item.owner}</td>
          <td>${item.root_cause}</td>
          <td>${item.action}</td>
          <td>${item?.improved_picture?
            `
              <a data-fancybox="gallery_10" href="${item.improved_picture}">
                <img src="${item.improved_picture}" alt="images"  style="width: 100px; height:100px;"></td>
              </a>
            `:''
          }
          </td>
          <td>${status}</td>
          <td>${item.completed_time}</td>
          `;
      tbody.append(tr);
    });
    Fancybox.unbind(_ui.table_10); 
     Fancybox.bind("[data-fancybox='gallery_10']", {
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
  } else {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td colspan="100">NO DATA</td>`;
    tbody.append(tr);
  }
}
export function renderTable11(data) {
  const tbody = _ui.table_11.querySelector("tbody");
  tbody.innerHTML = "";
  // const statusOpen=Object.keys(0)
  if (data.length) {
    data.forEach((item, i) => {
      const tr = document.createElement("tr");
      const status = `${
        item.status === 0 ? `<span class="text-success">CLOSE</span>` : `<span class="text-danger">OPEN</span>`
      }`;
      tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${item.floor}</td>
          <td>${item.audit_time}</td>
          <td>${item.rank}</td>
          <td>${item.department}</td>
          <td>${item.type_error}</td>
          <td>${item.description}</td>
          <td>
          ${item.audit_picture?`
            <a data-fancybox="gallery_11" href="${item.audit_picture}">
              <img src="${item.audit_picture}" alt="images" style="width: 100px; height:100px;"></td>
            </a>
            `:''}
          </td>
          <td>${item.audit_department}</td>
          <td>${item.owner}</td>
          <td>${item.root_cause}</td>
          <td>${item.action}</td>
          <td>${item?.improved_picture?
            `
              <a data-fancybox="gallery_11" href="${item.improved_picture}">
                <img src="${item.improved_picture}" alt="images"  style="width: 100px; height:100px;"></td>
              </a>
            `:''
          }
          </td>
          <td>${status}</td>
          <td>${item.completed_time}</td>
          `;
      tbody.append(tr);
    });
    Fancybox.unbind(_ui.table_11); 
     Fancybox.bind("[data-fancybox='gallery_11']", {
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
  } else {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td colspan="100">NO DATA</td>`;
    tbody.append(tr);
  }
}
