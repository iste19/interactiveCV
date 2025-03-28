import timelineData from "./experienceTimelineData.js";

import projectDetailData from "./projectDetailData.js";

const toggle = document.getElementById("darkModeToggle");

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    document.body.classList.add("dark-mode");
    document.getElementById("logoImg").src = "/assets/favicondark.ico";
    document.getElementById("darkmode-change").style.color = "#c4c4c4";

    let roles = document.getElementsByClassName("role");
    for (let i = 0; i < roles.length; i++) {
      roles[i].style.backgroundColor = "rgba(95, 142, 190, 0.2)";
      roles[i].style.color = "white";
    }

    document.getElementById("slider").classList.remove("slider-nav-dark");
    document
      .getElementById("slider")
      .classList.remove("slider-indicators-dark");
    document.getElementById("contacts-container").style.backgroundColor =
      "#1E2A39";
  } else {
    document.body.classList.remove("dark-mode");
    document.getElementById("logoImg").src = "/assets/favicon.ico";
    document.getElementById("darkmode-change").style.color = "#747370";

    let roles = document.getElementsByClassName("role");
    for (var i = 0; i < roles.length; i++) {
      roles[i].style.backgroundColor = "#eef1f4";
      roles[i].style.color = "black";
    }
    document.getElementById("slider").classList.add("slider-nav-dark");
    document.getElementById("slider").classList.add("slider-indicators-dark");
    document.getElementById("contacts-container").style.backgroundColor =
      "#eef1f4";
  }
});

const feedbackToggle = document.getElementById("feedbackModeToggle");

feedbackToggle.addEventListener("change", async () => {
  if (!(await isAuthorised())) {
    alert("You need to be logged in to provide feedback.");
    feedbackToggle.checked = false;
    return;
  }

  viewPrevComments();
  feedbackToggle.checked
    ? document.body.classList.add("feedback-mode")
    : document.body.classList.remove("feedback-mode");
});

const commentsUrl = "http://localhost:5001/api/comments/";

async function viewPrevComments() {
  try {
    let token =
      localStorage.getItem("access-token") || (await refreshAccessToken());

    let response = await fetch(commentsUrl, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      token = await refreshAccessToken();

      response = await fetch(commentsUrl, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    const data = await response.json();

    if (!response.ok) {
      console.log(`*Error: ${data.message}`);
    } else {
      data.forEach((oldComment) => {
        const pin = document.createElement("div");
        pin.classList.add("pin");

        const feedbackContainer = document.createElement("div");
        feedbackContainer.classList.add("feedback-container");
        feedbackContainer.style.position = "absolute";

        feedbackContainer.style.left = oldComment.position.left;
        feedbackContainer.style.top = oldComment.position.top;

        const commentModal = document.createElement("div");
        commentModal.classList.add("comment-modal");
        commentModal.style.left = "0px";
        commentModal.style.top = "25px";

        commentModal.innerHTML = `
          <p>Last modified:
        ${
          oldComment.updatedAt
            ? new Date(oldComment.updatedAt).toLocaleString("en-NZ", {
                timeZone: "Pacific/Auckland",
              })
            : "Date not available"
        }
      </p>
      <p>Section: ${oldComment.sectionHeading}</p>
      <p>Comment: ${oldComment.comment}</p>
    `;

        commentModal.style.display = "none";

        feedbackContainer.appendChild(pin);
        feedbackContainer.appendChild(commentModal);

        document.body.appendChild(feedbackContainer);

        feedbackContainer.addEventListener("mouseenter", () => {
          commentModal.style.display = "block";
        });

        feedbackContainer.addEventListener("mouseleave", () => {
          commentModal.style.display = "none";
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
}

document.body.addEventListener("click", (event) => {
  if (!feedbackToggle.checked) {
    return;
  }

  const target = event.target;
  let extraInfo = "";
  let sectionHeading = "No Heading";

  if (target.closest("#contacts-container")) {
    sectionHeading = "Contact Info";
  }
  //cant click on these elements
  else if (
    target.closest(".feedback-container") ||
    target.closest(".toggles switch") ||
    target.closest(".timeline-content:hover") ||
    target.closest(".close") ||
    target.closest(".auth-buttons") ||
    (!target.closest("section") &&
      !target.closest(".header-container") &&
      !target.closest(".toggle-message"))
  ) {
    return;
  } else {
    const section = target.closest("section");
    if (section) {
      sectionHeading = section.querySelector(".section-heading").innerText;
      if (sectionHeading === "LANGUAGES") {
        const lastSection = target.closest(".spacing");
        sectionHeading =
          lastSection.querySelector(".section-heading").innerText;
      }
    }
  }

  const pin = document.createElement("div");
  pin.classList.add("pin");

  const feedbackContainer = document.createElement("div");
  feedbackContainer.classList.add("feedback-container");
  feedbackContainer.style.position = "absolute";

  const offsetX = window.scrollX;
  const offsetY = window.scrollY;

  feedbackContainer.style.left = event.clientX + offsetX + "px";
  feedbackContainer.style.top = event.clientY + offsetY + "px";

  const targetElement = event.target;
  extraInfo += `Clicked Element: ${targetElement.tagName}`;
  if (targetElement.id) {
    extraInfo += `#${targetElement.id}`;
  }
  if (targetElement.classList.length > 0) {
    extraInfo += `.${Array.from(targetElement.classList).join(".")}`;
  }

  let parent = targetElement.parentElement;
  let depth = 0;
  while (parent && depth < 5) {
    extraInfo += ` > ${parent.tagName}`;
    if (parent.id) {
      extraInfo += `#${parent.id}`;
    }
    if (parent.classList.length > 0) {
      extraInfo += `.${Array.from(parent.classList).join(".")}`;
    }
    parent = parent.parentElement;
    depth++;
  }

  if (
    targetElement.classList &&
    targetElement.classList.contains("timeline-content")
  ) {
    extraInfo += ` (Timeline Index: ${targetElement.dataset.index})`;
  }

  if (
    targetElement.classList &&
    targetElement.classList.contains("projectDetailBut")
  ) {
    extraInfo += ` (Project Index: ${targetElement.dataset.projectIndex})`;
  }

  // Capture other data attributes
  for (const attr of targetElement.attributes) {
    if (attr.name.startsWith("data-")) {
      extraInfo += ` (${attr.name}:${attr.value})`;
    }
  }

  extraInfo += ` (Left: ${feedbackContainer.style.left}, Top: ${feedbackContainer.style.top})`;

  const commentModal = document.createElement("div");
  commentModal.classList.add("comment-modal");
  commentModal.style.left = "0px";
  commentModal.style.top = "25px";

  const errorElement = document.createElement("p");
  errorElement.id = "commentError";

  commentModal.innerHTML = `
        <form>
            <textarea name="comment" placeholder="Leave your comment" rows="8" cols="30"></textarea>
            <div id="commentError"> </div>
            <button id="submitCommentbtn" type="submit">Submit</button>
            <button id="editCommentbtn" type="submit">Edit</button>
        </form>
    `;

  commentModal.style.display = "none";

  feedbackContainer.appendChild(pin);
  feedbackContainer.appendChild(commentModal);

  document.body.appendChild(feedbackContainer);

  feedbackContainer.addEventListener("mouseenter", () => {
    commentModal.style.display = "block";
  });

  feedbackContainer.addEventListener("mouseleave", () => {
    commentModal.style.display = "none";
  });

  let currentCommentId = null;

  commentModal.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const comment = e.target.comment.value;
    const error = commentModal.querySelector("#commentError");
    error.innerHTML = "";

    try {
      let token =
        localStorage.getItem("access-token") || (await refreshAccessToken());

      let requestUrl = commentsUrl;

      if (currentCommentId) {
        requestUrl += currentCommentId;
      }

      const method = currentCommentId ? "PUT" : "POST";

      let response = await fetch(requestUrl, {
        method: method,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: comment,
          sectionHeading: sectionHeading,
          position: {
            left: feedbackContainer.style.left,
            top: feedbackContainer.style.top,
          },
          extraInfo: extraInfo,
        }),
      });

      if (response.status === 401) {
        token = await refreshAccessToken();

        response = await fetch(requestUrl, {
          method: method, // retry with PUT/POST
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment: comment,
            sectionHeading: sectionHeading,
            position: {
              left: feedbackContainer.style.left,
              top: feedbackContainer.style.top,
            },
            extraInfo: extraInfo,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        error.innerHTML = `*Error: ${data.message}`;
      } else {
        e.target.querySelector("#submitCommentbtn").style.display = "none";
        e.target.querySelector("#editCommentbtn").style.display = "block";
        e.target.comment.disabled = true;

        if (!currentCommentId) {
          currentCommentId = data._id;
        } else {
          const commentElement = document.querySelector(
            `[data-comment-id="${currentCommentId}"]`
          );
          if (commentElement) {
            commentElement.querySelector("p").textContent = comment;
          }
        }
      }
    } catch (err) {
      error.innerHTML = `*Error: ${err.message}`;
    }
  });

  commentModal
    .querySelector("#editCommentbtn")
    .addEventListener("click", (e) => {
      e.preventDefault();

      const commentField = commentModal.querySelector("textarea");
      commentField.disabled = false;
      commentField.focus();

      e.target.style.display = "none";
      commentModal.querySelector("#submitCommentbtn").style.display = "block";
    });
});

// --------------------- login/ sign up --------------------- //

document.getElementById("signup").addEventListener("click", () => {
  document.getElementById("signupContainer").style.display = "flex";
});

document.getElementById("login").addEventListener("click", () => {
  document.getElementById("loginContainer").style.display = "flex";
});

document.getElementsByClassName("closeLog")[0].addEventListener("click", () => {
  document.getElementById("signupContainer").style.display = "none";
});

document.getElementsByClassName("closeLog")[1].addEventListener("click", () => {
  document.getElementById("loginContainer").style.display = "none";
});

const greeting = document.getElementById("greeting");

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("access-token");
  document.getElementById("signup").style.display = "inline";
  document.getElementById("login").style.display = "inline";
  document.getElementById("logout").style.display = "none";
  greeting.innerHTML = "";
  addCommentsButtonIfAdmin();
});

const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = "http://localhost:5001/api/users/register";

  const error = document.getElementById("errorSignup");
  error.innerHTML = "";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: signupForm.uname.value,
        email: signupForm.eml.value,
        password: signupForm.psw.value,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      error.innerHTML += `Error: ${data.message}`;
    } else {
      console.log("User registered:", data);
      document.getElementById("signupContainer").style.display = "none";
    }
  } catch (err) {
    error.innerHTML += `Error: ${err.message}`;
  }
});

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = "http://localhost:5001/api/users/login";

  const error = document.getElementById("errorLogin");
  error.innerHTML = "";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: loginForm.eml.value,
        password: loginForm.psw.value,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      error.innerHTML += `Error: ${data.message}`;
    } else {
      greeting.innerHTML = await userGreeting(data.accessToken);
      localStorage.setItem("access-token", data.accessToken);
      document.getElementById("loginContainer").style.display = "none";
      document.getElementById("signup").style.display = "none";
      document.getElementById("login").style.display = "none";
      document.getElementById("logout").style.display = "block";
      await addCommentsButtonIfAdmin();
    }
  } catch (err) {
    error.innerHTML += `Error: ${err.message}`;
  }
});

async function getAllCommentsForAdmin() {
  try {
    let token =
      localStorage.getItem("access-token") || (await refreshAccessToken());
    console.log("Token for comments fetch:", token);

    const response = await fetch("http://localhost:5001/api/comments/admin", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.log("401 error, refreshing token...");
      token = await refreshAccessToken();
      console.log("New token:", token);
      response = await fetch("http://localhost:5001/api/comments/admin", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `*Error fetching comments: ${response.status} - ${errorData}`
      );
    } else {
      const comments = await response.json();
      localStorage.setItem("all-comments", JSON.stringify(comments));
      window.location.href = "/comments";
    }
  } catch (error) {
    console.error("Error in getAllCommentsForAdmin:", error);
  }
}
async function addCommentsButtonIfAdmin() {
  const authButtons = document.querySelector(".auth-buttons");
  const existingCommentsButton = document.getElementById("seeComments");

  if (existingCommentsButton) {
    authButtons.removeChild(existingCommentsButton);
  }

  try {
    let token =
      localStorage.getItem("access-token") || (await refreshAccessToken());

    if (!token) return;

    const url = "http://localhost:5001/api/users/current";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.role === "admin") {
      const commentsButton = document.createElement("button");
      commentsButton.id = "seeComments";
      commentsButton.className = "auth-button";
      commentsButton.textContent = "Feedbacks";
      authButtons.appendChild(commentsButton);

      commentsButton.addEventListener("click", async () => {
        window.location.href = "/comments";
        await getAllCommentsForAdmin();
      });
    }
  } catch (err) {
    console.error("Error checking user role:", err);
  }
}

async function userGreeting(token) {
  const url = "http://localhost:5001/api/users/current";
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.log(`Error: ${data.message}`);
    } else {
      return `Welcome, <b>${data.username}</b>`;
    }
  } catch (error) {
    console.log(`Error: ${err.message}`);
  }
}

async function refreshAccessToken() {
  try {
    const response = await fetch("http://localhost:5001/api/users/refresh", {
      method: "POST",
      credentials: "same-origin", // Ensures cookies are sent with the request
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("access-token", data.accessToken);
      return data.accessToken;
    } else {
      console.log("Refresh token expired or invalid.");
      localStorage.removeItem("access-token");
      window.location.reload(); // Redirect to login or show login form
    }
  } catch (err) {
    console.error("Failed to refresh access token:", err);
    localStorage.removeItem("access-token");
    window.location.reload();
  }
}

async function isAuthorised() {
  try {
    let token =
      localStorage.getItem("access-token") || (await refreshAccessToken());
    if (!token) {
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error during authorization check:", err);
    localStorage.removeItem("access-token");
    window.location.reload();
    return false;
  }
}

// --------------------- project details --------------------- //

const modal = document.getElementById("projectDetailModal");
const modalTitle = document.getElementById("modalProjectTitle");
const modalSliderContent = document.getElementById("modalSliderContent");
const modalDetails = document.getElementById("modalProjectDetails");
const modalVideo = document.getElementById("modalProjectVideo");
const closeModalButton = document.querySelector(".close");
const mainSlider = document.getElementById("slider");

if (mainSlider) {
  mainSlider
    .querySelector(".slider-container")
    .addEventListener("scroll", () => {
      const container = mainSlider.querySelector(".slider-container");
      const lastSlide = container.lastElementChild;

      if (lastSlide.classList.contains("slide-visible")) {
        setTimeout(() => {
          container.scroll({ left: 0, behavior: "smooth" });
        }, 1200);
      }
    });
}

const detailButtons = document.querySelectorAll(".projectDetailBut");

function initializeModalSlider(modalElement, images) {
  let imagesLoaded = 0;
  const sliderElement = modalElement.querySelector("#modalProjectSlider");

  const checkImagesLoaded = () => {
    if (
      imagesLoaded === images.length &&
      window.swiffyslider &&
      sliderElement
    ) {
      sliderElement.classList.add("swiffy-slider");
      setTimeout(() => {
        try {
          window.swiffyslider.initSlider(sliderElement);
        } catch (error) {
          console.error("Error initializing slider:", error);
        }
      }, 100);
    }
  };

  if (images.length === 0) {
    checkImagesLoaded();
  } else {
    images.forEach((img) => {
      if (img.complete) {
        imagesLoaded++;
        checkImagesLoaded();
      } else {
        img.onload = img.onerror = () => {
          imagesLoaded++;
          checkImagesLoaded();
        };
      }
    });
  }
}

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const projectIndex = parseInt(button.dataset.projectIndex);
    const project = projectDetailData[projectIndex];

    modalTitle.textContent = project.title;
    modalDetails.innerHTML = project.details || "";

    modalSliderContent.innerHTML = project.images
      .map(
        (imageUrl) =>
          `<li class=""><img src="${imageUrl}" alt="Project Image"></li>`
      )
      .join("");

    if (project.videoUrl2) {
      modalVideo.innerHTML = `<div class="subheading">DawgNourish Phone App mockup</div>`;
      modalVideo.innerHTML += project.videoUrl;
      modalVideo.innerHTML += `<div class="subheading2">Husky munchies vending machine digital mockup</div>`;
      modalVideo.innerHTML += project.videoUrl2;
      modalVideo.innerHTML += `<a class="medium" href="https://cse440.medium.com/a-paired-approach-to-tackling-food-insecurity-at-uw-71ae9bbfa6ce" target="_blank">Read the Medium Article</a>`;
    } else {
      if (project.videoUrl) {
        modalVideo.innerHTML = `<div class="subheading">Demo</div>`;
        modalVideo.innerHTML += project.videoUrl;
      } else {
        modalVideo.innerHTML = "";
      }
    }

    modal.style.display = "block";

    const indicators = modal.querySelector(".modal-slider-indicators");
    indicators.innerHTML = "";

    project.images.forEach((_, index) => {
      const indicatorButton = document.createElement("button");
      indicatorButton.setAttribute("aria-label", "Go to slide");
      if (index === 0) {
        indicatorButton.classList.add("active");
      }
      indicators.appendChild(indicatorButton);
    });

    const images = modalSliderContent.querySelectorAll("img");
    initializeModalSlider(modal, images);
  });
});

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
// --------------------- timeline --------------------- //

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
