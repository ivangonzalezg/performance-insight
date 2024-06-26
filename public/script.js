document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("request-form");
  const methodSelect = document.getElementById("method");
  const requestBodyContainer = document.getElementById(
    "request-body-container"
  );
  const cardsContainer = document.getElementById("metrics-cards");

  methodSelect.addEventListener("change", () => {
    if (methodSelect.value === "POST") {
      requestBodyContainer.style.display = "flex";
      requestBodyContainer.style.flexDirection = "column";
    } else {
      requestBodyContainer.style.display = "none";
    }
  });

  const fetchMetrics = async () => {
    try {
      const response = await axios.get("/api/sessions");
      const sessions = response.data;
      cardsContainer.innerHTML = "";
      sessions.forEach((session) => {
        const card = document.createElement("div");
        card.className = "card";
        if (session.status === "running") {
          card.classList.add("running");
        }

        card.innerHTML = `
          <div class="card-header">
            <div>
              <h3>Session ID</h3>
              <p>${session.session_id}</p>
            </div>
            <div>
              <h3>Status</h3>
              <p>${session.status}</p>
            </div>
          </div>
          <div class="card-body">
            <div>
              <p><strong>Start Time:</strong> ${moment(
                session.start_time
              ).format("YYYY-MM-DD HH:mm:ss")}</p>
              <p><strong>End Time:</strong> ${moment(session.end_time).format(
                "YYYY-MM-DD HH:mm:ss"
              )}</p>
            </div>
            <div>
              <p><strong>Total Requests:</strong> ${session.total_requests}</p>
              <p><strong>Requests Per Second:</strong> ${session.requests_per_second.toFixed(
                2
              )}</p>
            </div>
            <div>
              <p><strong>Average Response Time (ms):</strong> ${session.average_response_time.toFixed(
                2
              )}</p>
              <p><strong>Error Percentage:</strong> ${session.error_percentage.toFixed(
                2
              )}%</p>
            </div>
          </div>
        `;

        cardsContainer.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const requestData = {
      method: formData.get("method"),
      url: formData.get("url"),
      iterations: Number(formData.get("iterations")),
      delay: Number(formData.get("delay")),
      virtualUsers: Number(formData.get("virtualUsers")),
      duration: Number(formData.get("duration")),
    };

    if (formData.get("method") === "POST") {
      try {
        requestData.data = JSON.parse(formData.get("body"));
      } catch (error) {
        alert("Invalid JSON format in request body");
        return;
      }
    }

    try {
      await axios.post("/api/run", requestData);
      alert("Request initiated successfully");
      fetchMetrics();
    } catch (error) {
      console.error("Error running request:", error);
      alert("Failed to initiate request");
    }
  });

  fetchMetrics();
});
