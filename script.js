import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((res) => res.json())
  .then((data) => {
    const svg = d3.select("svg");
    const tooltip = d3.select("#tooltip");
    const h = 600;
    const w = 800;
    const padding = 70;
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Year))
      .range([padding, w - padding]);
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Seconds))
      .range([padding, h - padding]);
    svg
      .attr("viewBox", `0 0 ${w} ${h}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate( ${padding},0)`)
      .call(
        d3.axisLeft(yScale).tickFormat((seconds) => {
          const m = Math.floor(seconds / 60);
          const s = seconds % 60;
          return `${m}:${s.toString().padStart(2, "0")}`;
        })
      );

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - padding})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .attr("text-anchor", "middle")
      .attr("class", "axis-label")
      .text("Year");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -h / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("class", "axis-label")
      .text("Time (mm:ss)");

    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("fill", (d) => (d.Doping ? "tomato" : "steelblue"))
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr(
        "data-yvalue",
        (d) =>
          new Date(1970, 0, 1, 0, Math.floor(d.Seconds / 60), d.Seconds % 60)
      )
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Seconds))
      .attr("r", 5)
      .on("mouseover", (event, d) => {
        tooltip
          .style("top", event.pageY - 20 + "px")
          .style("left", event.pageX + 10 + "px")
          .style("opacity", 1)
          .attr("data-year", d.Year)
          .html(
            `<strong>${d.Name}</strong>${d.Nationality}<br><strong>Year</strong>: ${d.Year}, <strong>Time</strong>: ${d.Time}<br><br>${d.Doping}`
          );
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${w - padding - 250}, ${padding})`);

    const legendData = [
      { color: "tomato", text: "Riders with doping allegations" },
      { color: "steelblue", text: "No doping allegations" },
    ];

    legend
      .selectAll("rect")
      .data(legendData)
      .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 25)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => d.color);

    legend
      .selectAll("text")
      .data(legendData)
      .join("text")
      .attr("x", 25)
      .attr("y", (d, i) => i * 25 + 14)
      .text((d) => d.text);
  });
