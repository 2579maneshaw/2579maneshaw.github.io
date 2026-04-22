let selectedDate = "";
let postLink = "";

const isInstagram = window.location.pathname.includes("/ig");
const isFacebook = window.location.pathname.includes("/fb");

const airbnbTitle = "Our Happily Ever After House 10 Min to Disney";
const airbnbUrl = "https://www.airbnb.com/rooms/1626958722930248767?viralityEntryPoint=1&s=76&source_impression_id=p3_1771862170_P3u5M5-NH7ujRrFY";

const emailTo = "enchantedvillaofwindsorhills@gmail.com";
const emailCc = "sunstatepropmanagement@gmail.com";

function getPostFile() {
  return isInstagram ? "/discount/igpost.txt" : "/discount/fbpost.txt";
}

function getPostButtonId() {
  return isInstagram ? "igPostButton" : "fbPostButton";
}

function showCopyStatus() {
  const status = document.getElementById("copyStatus");
  if (!status) return;
  status.style.display = "inline";
  setTimeout(() => (status.style.display = "none"), 2000);
}

async function copyTextSafely(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

function buildComment() {
  if (isInstagram) {
    return `@sunstatevacationhomes @enchanted_villa_windsor_hills Please send me a quote for 'Our Happily Ever After House'
${selectedDate}`;
  }

  return `@sunstatevacationhomes
@enchantedvillawh
${selectedDate}`;
}

async function copyComment() {
  try {
    await copyTextSafely(buildComment());
    showCopyStatus();
  } catch {
    alert("Copy failed. Please copy manually.");
  }
}

function buildEmailSubject() {
  return "Our Happily Ever After 20%OFF Social media quote";
}

function buildEmailBody() {
  return `If still available, please send me a quote to stay in ${airbnbTitle}
${airbnbUrl}

My requested dates are: ${selectedDate}.

Please include the 20% social media discount from your post: ${postLink}`;
}

function updatePreview() {
  document.getElementById("previewSubject").textContent = buildEmailSubject();
  document.getElementById("previewAirbnbTitle").textContent = airbnbTitle;

  const linkEl = document.getElementById("previewAirbnbLink");
  linkEl.textContent = airbnbUrl;
  linkEl.href = airbnbUrl;

  document.getElementById("previewDate").textContent = selectedDate;

  const postEl = document.getElementById("previewPostLink");
  postEl.textContent = postLink;
  postEl.href = postLink;
}

function updateEmailButton() {
  const subject = buildEmailSubject();
  const body = buildEmailBody();

  const mail = `mailto:${emailTo}?cc=${encodeURIComponent(emailCc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.getElementById("emailButton").href = mail;
}

function updateAll() {
  document.getElementById("commentPreview").textContent = buildComment();
  document.getElementById("selectedDateNote").textContent = selectedDate ? `Selected stay: ${selectedDate}` : "";

  updatePreview();
  updateEmailButton();
}

function renderDates(dates) {
  const el = document.getElementById("datesList");
  el.innerHTML = "";

  dates.forEach((d, i) => {
    const label = document.createElement("label");
    label.className = "discountDateOption";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "date";
    input.value = d;

    if (i === 0) {
      input.checked = true;
      selectedDate = d;
    }

    input.addEventListener("change", () => {
      selectedDate = d;
      updateAll();
    });

    label.appendChild(input);
    label.appendChild(document.createTextNode(d));
    el.appendChild(label);
  });

  updateAll();
}

function loadPostLink() {
  fetch(getPostFile(), { cache: "no-store" })
    .then(r => r.text())
    .then(text => {
      postLink = text.trim();

      const btn = document.getElementById(getPostButtonId());
      if (btn) btn.href = postLink;

      updateAll();
    });
}

function loadDates() {
  fetch("/discount/dates", { cache: "no-store" })
    .then(r => r.text())
    .then(text =>
      text
        .split(/\r?\n/)
        .map(x => x.split("#")[0].trim())
        .filter(x => x)
    )
    .then(renderDates);
}

function init() {
  const btn = document.getElementById("copyCommentButton");
  if (btn) btn.addEventListener("click", copyComment);

  loadPostLink();
  loadDates();
}

document.addEventListener("DOMContentLoaded", init);