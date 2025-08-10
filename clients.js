import { loadNavbarFooter, showMessage } from "./main.js";
import { clients, refreshData, saveClients } from "./data.js";
import { validateField, isValidEmail } from "./utils.js";

// وقتی صفحه آماده شد
document.addEventListener("DOMContentLoaded", () => {
  loadNavbarFooter();
  displayClients();
  refreshData();
});

const clientForm = document.querySelector("#clientForm");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const companyInput = document.querySelector("#companyName");
const noteInput = document.querySelector("#message");
const charCount = document.querySelector("#charCount");
const noteError = document.querySelector("#noteError");
const clientTableBody = document.querySelector("#clientTableBody");

// به‌روزرسانی شمارش کاراکترهای یادداشت
function updateCharCount() {
  const length = noteInput.value.length;
  charCount.textContent = `${length} / 100`;
  charCount.className = "";
  noteInput.classList.remove("is-invalid");
  noteError.classList.add("d-none");

  if (length > 100) {
    charCount.classList.add("text-danger");
    noteInput.classList.add("is-invalid");
    noteError.textContent = "Note must be between 50 and 100 characters.";
    noteError.classList.remove("d-none");
  } else if (length >= 90) {
    charCount.classList.add("text-warning");
  } else if (length >= 50) {
    charCount.classList.add("text-success");
  } else {
    charCount.classList.add("text-muted");
  }
}

// وقتی متن یادداشت تغییر کرد شمارش را به‌روزرسانی کن
noteInput.addEventListener("input", updateCharCount);

// پاک کردن خطا هنگام تایپ در هر فیلد
[nameInput, emailInput, companyInput, noteInput].forEach(input => {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      input.classList.remove("is-invalid");
      input.nextElementSibling.classList.add("d-none");
    }
  });
});

// نمایش لیست مشتریان در جدول
export function displayClients() {
  clientTableBody.innerHTML = "";
  clients.forEach((client, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.company}</td>
      <td>${client.note}</td>
      <td>
        <button class="btn btn-sm btn-warning mb-2 edit-btn" data-id="${client.id}">
           <i class="bi bi-pencil-square"></i> Edit
        </button>
        <button class="btn btn-sm btn-danger mb-2 delete-btn" data-id="${client.id}">
           <i class="bi bi-trash"></i> Delete
        </button>
      </td>
    `;
    clientTableBody.appendChild(tr);
  });

  // حذف مشتری
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      deleteClient(id);
    });
  });

  // بارگذاری اطلاعات مشتری برای ویرایش
  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      loadClientToForm(id);
    });
  });
}

// حذف مشتری از آرایه و ذخیره
function deleteClient(id) {
  const index = clients.findIndex(client => client.id === id);
  if (index > -1) {
    clients.splice(index, 1);
    saveClients();
    displayClients();
  }
}

// بارگذاری داده‌های مشتری در فرم برای ویرایش
function loadClientToForm(id) {
  const client = clients.find(c => c.id === id);
  if (!client) return;

  nameInput.value = client.name;
  emailInput.value = client.email;
  companyInput.value = client.company;
  noteInput.value = client.note;
  updateCharCount();

  clientForm.dataset.editingId = id;
}

// ویرایش اطلاعات مشتری
function editClient(id, updatedData) {
  const index = clients.findIndex(c => c.id === id);
  if (index > -1) {
    clients[index] = { ...clients[index], ...updatedData };
    saveClients();
    displayClients();
  }
}

// ثبت فرم مشتری جدید یا ویرایش شده
clientForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const noteLength = noteInput.value.trim().length;
  const isNameValid = validateField(nameInput);
  const isEmailValid = validateField(emailInput);
  const isCompanyValid = validateField(companyInput);

  if (!isNameValid || !isEmailValid || !isCompanyValid) return;

  if (!isValidEmail(emailInput.value.trim())) {
    emailInput.classList.add("is-invalid");
    emailInput.nextElementSibling.textContent = "Please enter a valid email address.";
    emailInput.nextElementSibling.classList.remove("d-none");
    return;
  }

  if (noteLength < 50 || noteLength > 100) {
    noteInput.classList.add("is-invalid");
    noteError.textContent = "Note must be between 50 and 100 characters.";
    noteError.classList.remove("d-none");
    return;
  }

  const newClientData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    company: companyInput.value.trim(),
    note: noteInput.value.trim(),
  };

  if (clientForm.dataset.editingId) {
    const id = Number(clientForm.dataset.editingId);
    editClient(id, newClientData);
    delete clientForm.dataset.editingId;
    showMessage("Client updated successfully!", "success");

  } else {
    const newClient = { id: Date.now(), ...newClientData };
    clients.push(newClient);
    saveClients();
    showMessage("Client added successfully!", "success");

  }

  clientForm.reset();
  charCount.textContent = "0 / 100";
  charCount.className = "text-muted";
  noteError.classList.add("d-none");

  displayClients();
});
