export const data = [
  { id: 5, label: "AUT037", count: 7, duration: 7 },
  { id: 4, label: "AUT037", count: 4, duration: 5 },
  { id: 3, label: "AUT037", count: 3, duration: 4 },
  { id: 2, label: "AUT037", count: 2, duration: 3 },
  { id: 1, label: "AUT037", count: 1, duration: 2 },
];

export function ChartD3(chart) {
  const container = d3.select(chart);

  const margin = { top: 0, right: 50, bottom: 0, left: 50 };
  const viewBoxW = 800; // viewBox cố định
  const viewBoxH = 500;

  const svg = container
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("viewBox", `0 0 ${viewBoxW} ${viewBoxH}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "100%");

  const g = svg
    .selectAll("g.chart-group")
    .data([null])
    .join("g")
    .attr("class", "chart-group")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const chartW = viewBoxW - margin.left - margin.right;
  const chartH = viewBoxH - margin.top - margin.bottom;

  const maxVal = d3.max(data, (d) => Math.max(d.count, d.duration));
  const x = d3
    .scaleLinear()
    .domain([0, maxVal])
    .range([0, chartW / 2]);
  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.id))
    .range([0, chartH])
    .padding(0.65);

  // COUNT bars + text
  const leftBars = g.selectAll(".bar-count").data(data);
  leftBars
    .join("rect")
    .attr("class", "bar bar-count")
    .attr("fill", "#ff5f46")
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("y", (d) => y(d.id))
    .attr("height", y.bandwidth())
    .attr("x", chartW / 2)
    .attr("width", 0)
    .transition()
    .duration(800)
    .attr("x", (d) => chartW / 2 - x(d.count))
    .attr("width", (d) => x(d.count));

  const countText = g.selectAll(".count-text").data(data);
  countText
    .join("text")
    .attr("class", "count-text")
    .attr("y", (d) => y(d.id) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .attr("fill", "#fff")
    .style("font-size", `${Math.min(25, y.bandwidth())}px`)
    .text(0)
    .transition()
    .duration(800)
    .tween("text", function (d) {
      const i = d3.interpolateNumber(0, d.count);
      return function (t) {
        d3.select(this).text(Math.round(i(t)));
        d3.select(this).attr("x", chartW / 2 - x(d.count) * t - 4);
      };
    });

  // DURATION bars + text
  const rightBars = g.selectAll(".bar-duration").data(data);
  rightBars
    .join("rect")
    .attr("class", "bar bar-duration")
    .attr("fill", "#2ee5eb")
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("y", (d) => y(d.id))
    .attr("height", y.bandwidth())
    .attr("x", chartW / 2)
    .attr("width", 0)
    .transition()
    .duration(800)
    .attr("width", (d) => x(d.duration));

  const durationText = g.selectAll(".duration-text").data(data);
  durationText
    .join("text")
    .attr("class", "duration-text")
    .attr("y", (d) => y(d.id) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "start")
    .attr("fill", "#fff")
    .style("font-size", `${Math.min(25, y.bandwidth())}px`)
    .text(0)
    .transition()
    .duration(800)
    .tween("text", function (d) {
      const i = d3.interpolateNumber(0, d.duration);
      return function (t) {
        d3.select(this).text(Math.round(i(t)) + "H");
        d3.select(this).attr("x", chartW / 2 + x(d.duration) * t + 4);
      };
    });

  // Labels
  g.selectAll(".label")
    .data(data)
    .join("text")
    .attr("class", "label")
    .attr("x", chartW / 2)
    .attr("y", (d) => y(d.id) - 20)
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .style("font-size", `${Math.min(45, y.bandwidth())}px`)
    .text((d) => d.label);
}
