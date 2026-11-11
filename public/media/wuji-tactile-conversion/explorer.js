async function initExplorer() {
  const root = document.querySelector("[data-tactile-explorer]");
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = "true";
  const english = root.dataset.locale === "en";
  const names = english
    ? ["Thumb", "Index", "Middle", "Ring", "Pinky"]
    : ["엄지", "검지", "중지", "약지", "소지"];
  const status = root.querySelector('[role="status"]');
  try {
    const response = await fetch(
      "/media/wuji-tactile-conversion/explorer.json"
    );
    if (!response.ok) throw new Error("Recorded frames unavailable");
    const data = await response.json();
    const axis = root.querySelector("select");
    const time = root.querySelector("input");
    const canvas = root.querySelector("canvas");
    const context = canvas.getContext("2d");
    const body = root.querySelector("tbody");
    time.max = data.frames.length - 1;
    time.value = data.frames.findIndex(
      frame => Math.abs(frame.time - 9) < 0.001
    );
    function draw() {
      const frame = data.frames[Number(time.value)];
      const component = Number(axis.value);
      root.querySelector("output").textContent = `${frame.time.toFixed(2)} s`;
      context.fillStyle = "#f7fafb";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = "18px sans-serif";
      context.textAlign = "center";
      body.replaceChildren();
      frame.force.forEach((force, finger) => {
        context.fillStyle = "#172c3b";
        context.fillText(names[finger], finger * 200 + 100, 28);
        frame.maps[finger][component].forEach((row, y) => {
          row.forEach((value, x) => {
            const amount = Math.min(1, Math.abs(value) / 0.01);
            const base = [20, 39, 61];
            const end = value < 0 ? [45, 130, 235] : [240, 65, 75];
            context.fillStyle = data.mask[finger][y][x]
              ? `rgb(${base.map((v, i) => Math.round(v + (end[i] - v) * amount)).join(",")})`
              : "#e8eef1";
            context.fillRect(finger * 200 + 20 + x * 5, 45 + y * 6, 5, 6);
          });
        });
        context.fillStyle = "#172c3b";
        context.fillText(
          `${force[component].toFixed(3)} N`,
          finger * 200 + 100,
          365
        );
        const row = document.createElement("tr");
        [
          names[finger],
          ...force.map(v => v.toFixed(4)),
          Math.hypot(...force).toFixed(4),
        ].forEach((value, i) => {
          const cell = document.createElement(i === 0 ? "th" : "td");
          if (i === 0) cell.scope = "row";
          cell.textContent = value;
          row.append(cell);
        });
        body.append(row);
      });
    }
    axis.addEventListener("change", draw);
    time.addEventListener("input", draw);
    draw();
    root.querySelector("fieldset").hidden = false;
    status.textContent = "";
  } catch {
    status.textContent = english
      ? "Could not load the recorded frames. Use the plots, videos, or CSV below."
      : "저장 프레임을 불러오지 못했습니다. 그래프·영상 또는 아래 CSV를 이용해주세요.";
  }
}
document.addEventListener("astro:page-load", initExplorer);
initExplorer();
