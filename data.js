// تبدیل امن داده‌های ذخیره شده در localStorage به آرایه یا مقدار پیش‌فرض
function safeParse(key) {
  const data = localStorage.getItem(key);
  if (data && data !== "undefined") {
    try {
      return JSON.parse(data); // تبدیل رشته به شیء جاوااسکریپت
    } catch {
      return []; // در صورت خطا، آرایه خالی برگردان
    }
  } else {
    return []; // اگر داده وجود نداشت، آرایه خالی برگردان
  }
}

// بارگذاری داده‌های مشتریان و فاکتورها از localStorage
export let clients = safeParse("clients");
export let invoices = safeParse("invoices");

// ذخیره مشتریان جدید یا فعلی در localStorage
export function saveClients(newClients = clients) {
  clients = newClients;
  localStorage.setItem("clients", JSON.stringify(clients)); // تبدیل به رشته و ذخیره
}

// ذخیره فاکتورهای جدید یا فعلی در localStorage
export function saveInvoices(newInvoices = invoices) {
  invoices = newInvoices;
  localStorage.setItem("invoices", JSON.stringify(invoices)); // تبدیل به رشته و ذخیره
}

// تازه کردن داده‌ها از localStorage
export function refreshData() {
  clients = safeParse("clients");
  invoices = safeParse("invoices");
}

// گرفتن مشتری با شناسه خاص
export function getClientById(id) {
  return clients.find(client => client.id === id);
}

// گرفتن فاکتور با شناسه خاص
export function getInvoiceById(id) {
  return invoices.find(invoice => invoice.id === id);
}
