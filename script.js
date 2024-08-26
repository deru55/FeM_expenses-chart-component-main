const myBalance = document.getElementById("my-balance");
const totalThisMonth = document.getElementById("total-this-month");
const chartDiv = document.getElementById("chart");

(async (e) => {
  try {
    const res = await fetch("./data.json");
    const data = await res.json();
    loadChart(data);
  } catch (err) {
    console.error("Promise rejected");
  }
})();

const loadChart = (data) => {
  const getBgColors = () => {
    const today = new Date();
    const day = today.getDay() || 7;
    let filledArray = new Array(7).fill("hsl(10, 79%, 65%)");

    filledArray[day - 1] = "hsl(186, 34%, 60%)";

    return filledArray;
  };

  const getHoverBgColors = () => {
    const colorArr = getBgColors();

    return colorArr.map((clr) => {
      function replacer(match, p1, p2, p3, offset, string) {
        return p1 + p2 + `${Number(p3) + 15}`;
      }
      return clr.replace(/(\d+\w*,\s*)(\d+%,\s*)(\d+)/, replacer);
    });
  };

  const xValues = data.map((item) => item.day);
  const yValues = data.map((item) => item.amount);
  const barColors = getBgColors();
  const hoverBarColors = getHoverBgColors();

  new Chart(chartDiv, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          data: yValues,
          backgroundColor: barColors,
          borderRadius: 5,
          hoverBackgroundColor: hoverBarColors,
        },
      ],
    },
    options: {
      onHover: (event, chartElement) => {
        event.native.target.style.cursor = chartElement[0]
          ? "pointer"
          : "default";
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => {
              return null;
              /* console.log(tooltipItems[0]);
              const titles =
                tooltipItems[0].dataset.data[tooltipItems[0].dataIndex];
              return `$${titles}`; */
            },
            label: (tooltipData) => {
              const labels = tooltipData.dataset.data[tooltipData.dataIndex];
              return `$${labels}`;
            },
          },
          displayColors: false,
          backgroundColor: "hsl(25, 47%, 15%)",
          titleColor: "hsl(33, 100%, 98%)",
          bodyColor: "hsl(33, 100%, 98%)",
          bodyFont: { size: 18 },
          titleFont: { weight: "bold" },
          padding: 8,
          cornerRadius: 5,
          borderColor: "#042a0b",
          yAlign: "bottom",
        },
      },
    },
  });
};

/* const loadChart = (data) => {
  console.log(data);

  data.forEach((element) => {
    chartDiv.innerHTML += `
        <div class="chart-element chart-element--${element.day}">
            <div class="bar" style="--bar-height: ${
              element.amount * 2.75
            }px;"></div>

            <p>${element.day}</p>
        </div>
    `;
  });
}; */
