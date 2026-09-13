let testMode = false;
let testModeStartedAt = null;
let simulatedStart = null;

const isTestPage = document.querySelector(".test-controls") !== null;

function updateDefrostingTimer() {
  const start = new Date(new Date().getFullYear(), 7, 1); // August 1
  const end = new Date(new Date().getFullYear(), 11, 1); // December 1
  let now = new Date();

  if (testMode) {
    const elapsed = Date.now() - testModeStartedAt;
    now = new Date(simulatedStart.getTime() + elapsed);
  }

  const progressBar = document.getElementById("progress-bar");
  const timer = document.getElementById("timer");
  const iceBlock = document.getElementById("ice-block");
  const crack = document.getElementById("crack");

  if (now < start) {
    progressBar.style.width = "0%";
    progressBar.textContent = "0%";
    progressBar.classList.remove("build-up");
    timer.classList.remove("build-up");
    iceBlock.style.opacity = 1;
    crack.style.opacity = 0;

    const remaining = start - now;
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    timer.textContent =
      `${days}d ${hours}h ${minutes}m ${seconds}s until defrosting begins.`;

    return;
  }

  if (now >= end) {
    progressBar.style.width = "100%";
    progressBar.textContent = "100%";
    progressBar.classList.remove("build-up");
    timer.classList.remove("build-up");
    timer.textContent = "Mariah has fully defrosted! 🎄";

    if (isTestPage) {
      shatterIce();
    } else {
      iceBlock.style.opacity = 0;
    }

    return;
  }

  const total = end - start;
  const elapsed = now - start;

  const percentage = Math.max(
    0,
    Math.min(100, (elapsed / total) * 100)
  );

  progressBar.style.width = percentage.toFixed(2) + "%";
  progressBar.textContent = percentage.toFixed(2) + "%";

  if (isTestPage && percentage > 90) {
    progressBar.classList.add("build-up");
    timer.classList.add("build-up");
  } else {
    progressBar.classList.remove("build-up");
    timer.classList.remove("build-up");
  }

  // Ice block melts gradually
  iceBlock.style.opacity = (100 - percentage) / 100;

  // Crack becomes more visible as time passes
  crack.style.opacity = percentage / 100;

  const remaining = end - now;
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  timer.textContent =
    `${days}d ${hours}h ${minutes}m ${seconds}s until full defrost.`;
}

function shatterIce() {
  const iceBlock = document.getElementById("ice-block");

  if (!iceBlock) {
    return;
  }

  iceBlock.style.opacity = 0;

  if (!isTestPage) {
    return;
  }

  for (let i = 0; i < 12; i++) {
    const shard = document.createElement("div");
    shard.classList.add("shard");

    shard.style.setProperty(
      "--dx",
      (Math.random() * 400 - 200) + "px"
    );

    shard.style.setProperty(
      "--dy",
      (Math.random() * 400 - 200) + "px"
    );

    shard.style.setProperty(
      "--rot",
      (Math.random() * 720 - 360) + "deg"
    );

    shard.style.left = "50%";
    shard.style.top = "50%";
    shard.style.opacity = 1;

    document.body.appendChild(shard);

    setTimeout(() => shard.remove(), 1200);
  }
}

function createSnowflake() {
  const snowflake = document.createElement("div");

  snowflake.classList.add("snowflake");
  snowflake.textContent = "❄️";

  snowflake.style.left =
    Math.random() * window.innerWidth + "px";

  snowflake.style.animationDuration =
    (Math.random() * 5 + 5) + "s";

  snowflake.style.fontSize =
    (Math.random() * 10 + 10) + "px";

  document.body.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, 10000);
}

function toggleTestMode() {
  if (!isTestPage) {
    return;
  }

  testMode = !testMode;

  if (testMode) {
    testModeStartedAt = Date.now();

    simulatedStart = new Date(
      new Date().getFullYear(),
      10,
      30,
      23,
      59,
      50
    );
  } else {
    testModeStartedAt = null;
    simulatedStart = null;
  }

  updateDefrostingTimer();
}

setInterval(updateDefrostingTimer, 1000);
updateDefrostingTimer();

setInterval(createSnowflake, 200);