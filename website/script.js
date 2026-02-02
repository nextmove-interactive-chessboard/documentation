const STORAGE_KEY = 'demo_username_v3';
const usernameInput = document.getElementById('username');
const saveBtn = document.getElementById('saveBtn');
const avatar = document.getElementById('avatar');
const toast = document.getElementById('toast');


function sanitize(name) {
  return name.replace(/\s+/g, ' ').trim();
}

function initialsFrom(name) {
  if (!name) return '—';
  return name[0].toUpperCase();
}

function updateAvatar(name) {
  avatar.textContent = initialsFrom(name);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.style.opacity = 1;
  setTimeout(() => (toast.style.opacity = 0), 1500);
}

function saveName() {
  const name = sanitize(usernameInput.value);
  if (!name) {
    alert('Bitte gib einen gültigen Namen ein.');
    return;
  }
  localStorage.setItem(STORAGE_KEY, name);
  updateAvatar(name);
  showToast('Gespeichert!');
  setTimeout(() => {
    window.location.href = 'welcome.html';
  }, 1000);
}

saveBtn.addEventListener('click', saveName);
usernameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') saveName();
});

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  usernameInput.value = saved;
  updateAvatar(saved);
}


async function generateHash(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function register_user() {
    const username = document.getElementById("username").value;
    if (!username) {
        alert("Bitte Benutzernamen eingeben!");
        return;
    }

    // Zufälligen Seed generieren
    const randomSeed = crypto.getRandomValues(new Uint8Array(32));

    // Seed in hex umwandeln
    const seedHex = Array.from(randomSeed)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    // Hash aus (username + zufälliger seed) generieren
    const generatedHash = await generateHash(username + seedHex);

    console.log("Generierter Hash:", generatedHash);

    // An Backend senden
    const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            hash: generatedHash
        })
    });

    const data = await res.json();
    console.log(data);
    console.log("register_user() wurde aufgerufen");
  }