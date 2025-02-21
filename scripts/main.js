import timelineData from "./experienceTimelineData.js";

let comments = [];

const toggle = document.getElementById("darkModeToggle");

toggle.addEventListener("change", () => {
  toggle.checked
    ? document.body.classList.add("dark-mode")
    : document.body.classList.remove("dark-mode");
});

const feedbackToggle = document.getElementById("feedbackModeToggle");
feedbackToggle.addEventListener("change", () => {
  feedbackToggle.checked
    ? document.body.classList.add("feedback-mode")
    : document.body.classList.remove("feedback-mode");
});

document.body.addEventListener("click", (event) => {
  if (feedbackToggle.checked) {
    const target = event.target;

    const pin = document.createElement("div");
    pin.classList.add("pin");

    const feedbackContainer = document.createElement("div");
    feedbackContainer.classList.add("feedback-container");
    feedbackContainer.style.position = "absolute";
    feedbackContainer.style.left = event.clientX + "px";
    feedbackContainer.style.top = event.clientY + "px";

    const commentModal = document.createElement("div");
    commentModal.classList.add("comment-modal");
    commentModal.style.left = "0px";
    commentModal.style.top = "25px";

    commentModal.innerHTML = `
      <form>
        <textarea name="comment" placeholder="Leave your comment" rows="8" cols="30"></textarea>
        <button type="submit">Submit</button>
      </form>
    `;

    commentModal.style.display = "none";

    feedbackContainer.appendChild(pin);
    feedbackContainer.appendChild(commentModal);
    target.appendChild(feedbackContainer);

    feedbackContainer.addEventListener("mouseenter", () => {
      commentModal.style.display = "block";
    });

    feedbackContainer.addEventListener("mouseleave", () => {
      commentModal.style.display = "none";
    });

    commentModal.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();

      const comment = e.target.comment.value;

      console.log("Comment submitted:", comment);
      comments.push(comment);
      console.log(comments);

      commentModal.style.display = "none";
    });
  }
});

const timeline = document.getElementById("timeline");

function loadTimeline() {
  timeline.innerHTML = "";

  timelineData.forEach((item, index) => {
    const modalContent = `
      <div id="modal-${index}" class="modal">
        <div class="modal-content">
          <span class="close" id="close-${index}">&times;</span>
          <img src=${item.modalContent.images[0]} alt= "company logo">
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
        <div class="timeline-content" data-index="${index}">
          <h3>${item.date}</h3>
          <div><span class="role">${item.role}</span> · ${item.type}</div>
          <p><em>${item.company}</em></p>
        </div>
        ${modalContent}
      </div>
    `;

    timeline.innerHTML += timelineItem;
  });
}

loadTimeline();

timeline.addEventListener("click", (event) => {
  const target = event.target;

  if (target.closest(".timeline-content")) {
    const index = target.closest(".timeline-content").dataset.index;
    const modal = document.getElementById(`modal-${index}`);
    if (modal) {
      modal.style.display = "block";
    }
  }

  if (target.classList.contains("close")) {
    const modal = target.closest(".modal");
    modal.style.display = "none";
  }
});
