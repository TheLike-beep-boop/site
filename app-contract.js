// ========= 1. Identifică contractul din link (?id=...) =========
const params = new URLSearchParams(window.location.search);
const contractId = params.get("id");

// campurile text simple, editabile direct pe pagina
const fields = ["introText", "nrContract", "dataInceput", "dataSfarsit", "firmaBeneficiara", "firmaPrestatoare"];

const status = document.getElementById("contractStatus");
const box = document.getElementById("contractBox");
const expirationInput = document.getElementById("expirationDateInput");

let currentExpirationDate = null; // folosit strict pentru calculul Valid/Invalid (format YYYY-MM-DD)

if (!contractId) {
    document.body.innerHTML = "<h2 style='padding:40px;text-align:center;color:#D4121A'>Link invalid: lipsește parametrul ?id=</h2>";
} else {
    loadData();
}

// ========= 2. Citește datele din Firestore și le afișează =========
function loadData() {
    db.collection("contracte").doc(contractId).get().then((doc) => {
        if (!doc.exists) {
            document.body.innerHTML = "<h2 style='padding:40px;text-align:center;color:#D4121A'>Nu există date pentru acest contract.</h2>";
            return;
        }
        const data = doc.data();
        fields.forEach(f => {
            document.getElementById(f).textContent = data[f] || "....";
        });
        currentExpirationDate = data.expirationDate || null;
        if (expirationInput && currentExpirationDate) {
            expirationInput.value = currentExpirationDate;
        }
        updateValidityBadge();
    }).catch((err) => {
        console.error(err);
        alert("Eroare la citirea datelor: " + err.message);
    });
}

// ========= 3. Calculează Valid / Invalid pe baza datei de încheiere =========
function updateValidityBadge() {
    if (!currentExpirationDate) return;
    const expDate = new Date(currentExpirationDate);
    expDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today > expDate) {
        status.innerHTML = '<i class="fa-solid fa-xmark"></i> Stingător Expirat';
        setBoxColor("#D4121A");
    } else {
        status.innerHTML = '<i class="fa-solid fa-check"></i> Stingător Valid';
        setBoxColor("#51C323");
    }
}
function setBoxColor(color) {
    box.style.backgroundColor = color;
    box.style.border = "7px solid " + color;
    box.style.borderTop = "20px solid " + color;
}

// ========= 4. Buton secret -> deschide login =========
const secretBtn = document.getElementById("secretEditBtn");
const loginModal = document.getElementById("loginModal");
const loginError = document.getElementById("loginError");

secretBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
    loginError.textContent = "";
});

document.getElementById("loginCancelBtn").addEventListener("click", () => {
    loginModal.style.display = "none";
});

document.getElementById("loginSubmitBtn").addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            loginModal.style.display = "none";
            enterEditMode();
        })
        .catch((err) => {
            loginError.textContent = "Email sau parolă greșită.";
        });
});

// ========= 5. Mod editare =========
const editBar = document.getElementById("editBar");
const expirationEditRow = document.getElementById("expirationEditRow");

function enterEditMode() {
    document.body.classList.add("editing");
    fields.forEach(f => {
        document.getElementById(f).setAttribute("contenteditable", "true");
    });
    expirationEditRow.style.display = "block";
    editBar.style.display = "flex";
}

function exitEditMode() {
    document.body.classList.remove("editing");
    fields.forEach(f => {
        document.getElementById(f).removeAttribute("contenteditable");
    });
    expirationEditRow.style.display = "none";
    editBar.style.display = "none";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    auth.signOut().then(() => exitEditMode());
});

// ========= 6. Salvare în Firestore =========
document.getElementById("saveBtn").addEventListener("click", () => {
    const updatedData = {};
    fields.forEach(f => {
        updatedData[f] = document.getElementById(f).textContent.trim();
    });
    updatedData.expirationDate = expirationInput.value;

    db.collection("contracte").doc(contractId).set(updatedData, { merge: true })
        .then(() => {
            currentExpirationDate = updatedData.expirationDate;
            updateValidityBadge();
            alert("Salvat cu succes!");
        })
        .catch((err) => {
            alert("Eroare la salvare: " + err.message);
        });
});

// ========= 7. Dacă utilizatorul e deja logat (revine pe pagină), rămâne în mod editare =========
auth.onAuthStateChanged((user) => {
    if (user) {
        enterEditMode();
    }
});
