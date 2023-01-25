const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { putText, getText } = require("../../lib/commands.js");

const {
  selectDateTime,
  orderTickets,
  checkSeatIsTaken,
} = require("../../lib/util.js");

let tomorrow = "nav.page-nav > a:nth-child(2)";
let weekLater = "nav.page-nav > a:nth-child(7)";
let movieTime = "[data-seance-id='94']";
let ticketHint = "p.ticket__hint";

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

/*Given("user is on {string} page", async function (string) {
  return await this.page.goto(`http://qamid.tmweb.ru/client${string}`, {
    setTimeout: 7000000,
  });
});*/

Given("user is on page", async function () {
  return await this.page.goto(`http://qamid.tmweb.ru/client/index.php`, {
    setTimeout: 90000000,
  });
});

When("user choose {int}-th day and movie", async function (int1) {
  //выбор дня по дате и сеанса
  return await selectDateTime(
    this.page,
    `nav.page-nav > a:nth-child(${int1})`,
    movieTime
  );
});

When("select {int} row and {int} seat", async function (int1, int2) {
  //выбор ряда и 1 места
  return await orderTickets(this.page, int1, int2);
});

When(
  "select {int} row and {int},{int} seats",
  async function (int1, int2, int3) {
    //выбор ряда и нескольких мест
    return await orderTickets(this.page, int1, int2, int3);
  }
);

/*When(
  "trying to select reserved {int} row and {int} seat",
  async function (int1, int2) {
    await checkSeatIsTaken(this.page, int1, int2);
    try {
      await orderTickets(this.page, int1, int2);
    } catch (error) {
      expect(error).to.be.an("error");
      expect(error.message).to.be.equal("Seat(s) is taken");
    }
  }
);*/

Then("ticket purchase is confirmed", async function () {
  //подтверждение бронирования
  const actual = await getText(this.page, ticketHint);
  expect(actual).contains(
    "Покажите QR-код нашему контроллеру для подтверждения бронирования."
  );
});

Then("booking is not possible", async function () {
  const buttonStatus = await this.page.$eval(
    `.acceptin-button`,
    (el) => el.disabled
  );
  expect(buttonStatus).toEqual(true);
});
