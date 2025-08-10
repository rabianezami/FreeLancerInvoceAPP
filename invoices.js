import { loadNavbarFooter, showMessage } from "./main.js";
import { clients, invoices, saveInvoices } from "./data.js";

// وقتی صفحه بارگذاری شد
document.addEventListener("DOMContentLoaded", () => {
  loadNavbarFooter();

  const clientSelect = document.getElementById("clientSelect");
  const invoiceForm = document.getElementById("invoiceForm");
  const descriptionInput = document.getElementById("description");
  const factorInput = document.getElementById("factor");
  const numberInput = document.getElementById("number");
  const amountInput = document.getElementById("amount");
  const dateInput = document.getElementById("date");
  const invoiceTableBody = document.getElementById("invoiceTableBody");

  let editingInvoiceId = null;

  // پر کردن لیست مشتریان در انتخابگر
  function populateClientSelect() {
    clientSelect.innerHTML = '<option disabled selected>-- Select Client --</option>';
    clients.forEach(client => {
      const option = document.createElement("option");
      option.value = client.id;
      option.textContent = client.name;
      clientSelect.appendChild(option);
    });
  }

  // گرفتن نام مشتری بر اساس شناسه
  function getClientNameById(id) {
    const client = clients.find(c => c.id === id);
    return client ? client.name : "Unknown";
  }

  // نمایش فاکتورها در جدول
  function displayInvoices() {
    invoiceTableBody.innerHTML = "";
    invoices.forEach((inv, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${getClientNameById(inv.clientId)}</td>
        <td>${inv.factor}</td>
        <td>${inv.description}</td>
        <td>${inv.number}</td>
        <td>${inv.amount}</td>
        <td>${new Date(inv.date).toLocaleDateString()}</td>
        <td class= "d-flex flex-wrap gap-2 justify-content-center align-items-center">
        ${inv.paid
          ? '<span class="badge bg-success"><i class="bi bi-check-circle me-1"></i>Paid</span>'
          : '<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-circle me-1"></i>Unpaid</span>'}
        <button class="btn btn-sm btn-success pay-btn" data-id="${inv.id}">
          <i class="bi bi-cash-stack me-1"></i>${inv.paid ? "Mark Unpaid" : "Mark Paid"}
        </button>
        <button class="btn btn-sm btn-warning edit-btn" data-id="${inv.id}">
          <i class="bi bi-pencil-square me-1"></i>Edit
        </button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${inv.id}">
          <i class="bi bi-trash me-1"></i>Delete
        </button>
        </td>
      `;
      invoiceTableBody.appendChild(tr);
    });

    // اضافه کردن رویداد حذف
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        deleteInvoice(Number(btn.dataset.id));
      });
    });

    // اضافه کردن رویداد ویرایش
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        loadInvoiceToForm(Number(btn.dataset.id));
      });
    });

    // اضافه کردن رویداد علامت زدن پرداخت شده / نشده
    document.querySelectorAll(".pay-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleInvoicePaid(Number(btn.dataset.id));
      });
    });
  }

  // حذف فاکتور
  function deleteInvoice(id) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    const index = invoices.findIndex(inv => inv.id === id);
    if (index > -1) {
      invoices.splice(index, 1);
      saveInvoices(invoices);
      displayInvoices();
      resetForm();
      showMessage("Invoice deleted successfully!", "success");
    }
  }

  // بارگذاری فاکتور در فرم برای ویرایش
  function loadInvoiceToForm(id) {
    const inv = invoices.find(inv => inv.id === id);
    if (!inv) return;

    clientSelect.value = inv.clientId;
    factorInput.value = inv.factor;
    descriptionInput.value = inv.description;
    numberInput.value = inv.number;
    amountInput.value = inv.amount;
    dateInput.value = inv.date;

    editingInvoiceId = id;

    invoiceForm.querySelector("button[type=submit]").textContent = "Update Invoice";
  }

  // تغییر وضعیت پرداخت فاکتور
  function toggleInvoicePaid(id) {
    const inv = invoices.find(inv => inv.id === id);
    if (!inv) return;
    inv.paid = !inv.paid;
    saveInvoices(invoices);
    displayInvoices();
    showMessage(`Invoice marked as ${inv.paid ? "Paid" : "Unpaid"}`, "info");
  }

  // اعتبارسنجی فرم
  function validateForm() {
    if (!clientSelect.value) {
      alert("Please select a client");
      return false;
    }
    if (!factorInput.value.trim()) {
      alert("Please enter factor name");
      return false;
    }
    if (!descriptionInput.value.trim()) {
      alert("Please enter description");
      return false;
    }
    if (!numberInput.value || Number(numberInput.value) <= 0) {
      alert("Please enter a valid number");
      return false;
    }
    if (!amountInput.value || Number(amountInput.value) <= 0) {
      alert("Please enter a valid amount");
      return false;
    }
    if (!dateInput.value) {
      alert("Please select a date");
      return false;
    }
    return true;
  }

  // بازنشانی فرم
  function resetForm() {
    invoiceForm.reset();
    editingInvoiceId = null;
    invoiceForm.querySelector("button[type=submit]").textContent = "Save";
  }

  // رویداد ارسال فرم
  invoiceForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm()) return;

    const invoiceData = {
      clientId: Number(clientSelect.value),
      factor: factorInput.value.trim(),
      description: descriptionInput.value.trim(),
      number: Number(numberInput.value),
      amount: Number(amountInput.value),
      date: dateInput.value,
      paid: false
    };

    if (editingInvoiceId) {
      const index = invoices.findIndex(inv => inv.id === editingInvoiceId);
      if (index > -1) {
        invoices[index] = { ...invoices[index], ...invoiceData };
        saveInvoices(invoices);
        displayInvoices();
        resetForm();
        showMessage("Invoice updated successfully!", "success");
      }
    } else {
      invoices.push({ id: Date.now(), ...invoiceData });
      saveInvoices(invoices);
      displayInvoices();
      resetForm();
      showMessage("Invoice added successfully!", "success");
    }
  });

  // شروع کار
  populateClientSelect();
  displayInvoices();
});
