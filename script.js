/* ---- Edit these two lines ---- */
const WA_NUMBER = "920000000000"; // country code + number, no "+" or spaces
const CURRENCY = "Rs ";           // used in WhatsApp order messages (card prices live in index.html)

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => CURRENCY + Number(n).toLocaleString("en-US");
const openWA = text => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");

/* Mobile menu */
const burger = $("#burger");
const setMenu = open => { document.body.classList.toggle("menu-open", open); burger.setAttribute("aria-expanded", open); };
burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
$$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* Toast */
let timer;
const toast = msg => {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove("show"), 2400);
};

/* Cart: items are sent to WhatsApp as an order */
const cart = new Map();
$$(".btn--add").forEach(btn => btn.addEventListener("click", () => {
  const card = btn.closest(".card");
  const name = $("h3", card).textContent;
  const item = cart.get(name) || { price: +card.dataset.price, qty: 0 };
  item.qty++;
  cart.set(name, item);
  $("#cartCount").textContent = [...cart.values()].reduce((s, i) => s + i.qty, 0);
  btn.classList.add("added");
  btn.textContent = "Added";
  setTimeout(() => { btn.classList.remove("added"); btn.textContent = "Add to cart"; }, 1400);
  toast(`${name} added to your bag`);
}));
$("#cartBtn").addEventListener("click", () => {
  if (!cart.size) return toast("Your bag is empty. Add a product first.");
  let total = 0;
  const lines = [...cart].map(([name, i]) => { total += i.price * i.qty; return `- ${i.qty} x ${name} (${money(i.price * i.qty)})`; });
  openWA(`Hello Kashaf Parlor, I'd like to order:\n${lines.join("\n")}\nTotal: ${money(total)}`);
});

/* Service buttons preselect the booking form */
$$("[data-service]").forEach(a => a.addEventListener("click", () => { $("#service").value = a.dataset.service; }));

/* Booking form to WhatsApp */
$("input[type=date]").min = new Date().toISOString().split("T")[0];
$("#bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  openWA(`Hello Kashaf Parlor, I'd like to book an appointment.\nService: ${d.service}\nDate: ${d.date} at ${d.time}\nName: ${d.name}\nPhone: ${d.phone}${d.notes ? `\nNotes: ${d.notes}` : ""}`);
  $("#formMsg").textContent = "Almost done. Press send in WhatsApp to confirm your request.";
  e.target.reset();
});

/* Footer year and floating WhatsApp button */
$("#yr").textContent = new Date().getFullYear();
$("#waFab").href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Kashaf Parlor, I have a question.")}`;
