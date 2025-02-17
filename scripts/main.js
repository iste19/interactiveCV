import timelineData from "./experienceTimelineData.js";

const toggle = document.getElementById("darkModeToggle");

toggle.addEventListener("change", () => {
  toggle.checked
    ? document.body.classList.add("dark-mode")
    : document.body.classList.remove("dark-mode");
});

//console.log(timelineData);

const timeline = document.getElementById("timeline");

function loadTimeline() {
  timeline.innerHTML = "";

  timelineData.forEach((item, index) => {
    let modalContent = "";

    modalContent = `
    <div id="modal-${index}" class="modal">
      <div class="modal-content">
        <span class="close" id="close-${index}">&times;</span>
        <ul>
        ${item.modalContent.jobDescription
          .map((point) => `<li>${point}</li>`)
          .join("")}
        </ul>
      </div>
    </div>
    `;

    const timelineItem = `
      <div class="timeline-item ${item.side}">
        <div class="timeline-content" id="timeline-content-${index}">
          <h3>${item.date}</h3>
          <div><span class="role">${item.role}</span> · ${item.type}</div>
          <p><em>${item.company}</em></p>
        </div>
        ${modalContent}
      </div>
    `;

    timeline.innerHTML += timelineItem;

    document
      .getElementById(`timeline-content-${index}`)
      .addEventListener("click", () => {
        document.getElementById(`modal-${index}`).style.display = "block";
      });

    document.getElementById(`close-${index}`).addEventListener("click", () => {
      document.getElementById(`modal-${index}`).style.display = "none";
    });
  });
}

loadTimeline();

for (let i = 0; i < timelineData.length; i++) {
  document
    .getElementById(`timeline-content-${i}`)
    .addEventListener("click", () => {
      document.getElementById(`modal-${i}`).style.display = "block";
    });

  document.getElementById(`close-${i}`).addEventListener("click", () => {
    document.getElementById(`modal-${i}`).style.display = "none";
  });
}
