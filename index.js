import { loadNavbarFooter } from "./main.js";
import { clients, invoices, refreshData } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
    loadNavbarFooter(); // بارگذاری نوار بالا و پایین صفحه
    refreshData(); // تازه کردن داده‌ها از localStorage

    const today = new Date();
    document.querySelector("#todayDate").textContent = 
    " " + today.toLocaleDateString(); // نمایش تاریخ امروز

    const totalClients = clients.length;
    document.querySelector("#totalClients").textContent = totalClients; // نمایش تعداد کل مشتری‌ها

    const totalInvoices = invoices.length;
    document.querySelector("#totalInvoices").textContent = totalInvoices; // نمایش تعداد کل فاکتورها

    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    document.querySelector("#totalAmount").textContent = 
    "$" + totalAmount.toFixed(2); // محاسبه و نمایش مجموع مبلغ‌ها

    const paidInvoices = invoices.filter(inv => inv.paid);
    const unpaidInvoices = invoices.filter(inv => !inv.paid);
    document.querySelector("#paidUnpaid").textContent = 
    `${paidInvoices.length} / ${unpaidInvoices.length}`; // نمایش تعداد پرداخت شده / پرداخت نشده

    const paidPercent = 
    totalInvoices > 0 ? (paidInvoices.length / totalInvoices)* 100 : 0;
    document.querySelector("#paymentProgress").style.width = paidPercent + "%"; // تنظیم درصد نوار پیشرفت

    // نقل قول آفلاین (نمایش نقل قول تصادفی)
    const quotes = [
        {text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
        { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" }
    ];

    const quoteTextEl = document.querySelector("#quoteText");
    const quoteAuthorEl = document.querySelector("#quoteAuthor");

    const randomQuote = quotes[Math.floor(Math.random()* quotes.length)];
    quoteTextEl.textContent = `"${randomQuote.text}"`;
    quoteAuthorEl.textContent = randomQuote.author;
});
