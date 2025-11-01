export function renderTable1(table, data) {
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  const label = ["Cyclops", "Needle Fish", "GoldFish", "Marfin"];

  label.forEach((item) => {
    const tr = document.createElement("tr");
    let rowHTML = `<td style="width: 15rem;">${item}</td>`;

    for (let i = 0; i < 5; i++) {
      const val = Math.round(Math.random() * 100);
      let color = "";

      if (val === 0) color = "white";
      else if (val <= 90) color = "#FF5D43";
      else if (val <= 95) color = "#E6F338  ";
      else color = "#00E2B5";

      switch (item) {
        case "Cyclops":
          rowHTML += `<td style="background-color:${color};color:#00000080;">${val}%</td>`;
          break;
        case "Needle Fish":
          rowHTML += `<td style="background-color:${color};color:#00000080">${val}%</td>`;
          break;
        case "GoldFish":
          rowHTML += `<td style="background-color:${color};color:#00000080">${val}%</td>`;
          break;
        case "Marfin":
          rowHTML += `<td style="background-color:${color};color:#00000080">${val}%</td>`;
          break;
      }
    }

    tr.innerHTML = rowHTML;
    tbody.append(tr);
  });
}

export function renderTable2(table, data) {
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const val = Math.round(Math.random() * 100);
    let color = "";

    if (val === 0) color = "white";
    else if (val <= 50) color = "#ff5c43e1";
    else color = "#00e2b5ec";
    tbody.innerHTML += `
        <tr>
        <td style="background-color:${color};color:#00000080;">${val}</td>
        <td style="background-color:${color};color:#00000080;">${val}</td>
        <td style="background-color:${color};color:#00000080;">${val}</td>
        <td style="background-color:${color};color:#00000080;">${val}</td>
        <td style="background-color:${color};color:#00000080;">${val}</td>
        <td style="background-color:${color};color:#00000080;">${val}</td>
        <td style="background-color:${color};color:#00000080;">${val}</td>
        </tr>
        `;
  }
}

export function renderTable3(table, n) {
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const val = Math.round(Math.random() * 100);
    let tds = "";
    for (let j = 0; j < n; j++) {
      tds += `<td>${val}</td>`;
    }
    tbody.innerHTML += `
      <tr>
        ${tds}
      </tr>
    `;
  }
}

