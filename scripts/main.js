const toggle = document.getElementById("darkModeToggle")

toggle.addEventListener("change", () => {
    toggle.checked ? document.body.classList.add("dark-mode") : document.body.classList.remove("dark-mode")
})