"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scraper = scraper;
var israeli_bank_scrapers_1 = require("israeli-bank-scrapers");
function scraper(company, credentials, year, month) {
    return __awaiter(this, void 0, void 0, function () {
        var all_transactions, month_index, year_index, puppeteer, browser, options, scraper_1, scrapeResult, month_str, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 5]);
                    month_index = month - 2;
                    year_index = year;
                    if (month == 1) {
                        month_index = 11;
                        year_index = year - 1;
                    }
                    puppeteer = require("puppeteer-core");
                    return [4 /*yield*/, puppeteer.connect({
                            browserWSEndpoint: "wss://chrome.browserless.io?token=Rqo90C4fF5Xibx42297674bdc3d5129eb0dafb4634",
                        })];
                case 1:
                    browser = _b.sent();
                    options = {
                        companyId: company,
                        startDate: new Date(year_index, month_index, 28),
                        browser: browser,
                        skipCloseBrowser: false,
                        combineInstallments: false,
                        showBrowser: false,
                        additionalTransactionInformation: true,
                    };
                    scraper_1 = (0, israeli_bank_scrapers_1.createScraper)(options);
                    return [4 /*yield*/, scraper_1.scrape(credentials)];
                case 2:
                    scrapeResult = _b.sent();
                    console.log(" --- scraping data from ".concat(company, ", from date 1.").concat(month, ".").concat(year, " ---"));
                    if (scrapeResult.success) {
                        all_transactions = [];
                        month_str = (options.startDate.getMonth() + 1).toString();
                        if (month_str.length == 1) {
                            month_str = "0" + month_str;
                        }
                        (_a = scrapeResult.accounts) === null || _a === void 0 ? void 0 : _a.forEach(function (account) {
                            console.log("   --- scraping account number ".concat(account.accountNumber, " ---"));
                            account.txns.forEach(function (transaction) {
                                var d = new Date(transaction.date);
                                if (d.getMonth() + 1 == month && d.getFullYear() == year && notCreditCard(transaction.description)) {
                                    var category = findCategory(transaction.description, transaction.category);
                                    // console.log(
                                    //   transaction.description,
                                    //   transaction.originalAmount,
                                    //   `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
                                    //   category
                                    // );
                                    all_transactions.push({
                                        description: transaction.description,
                                        amount: transaction.originalAmount,
                                        year: d.getFullYear(),
                                        month: d.getMonth(),
                                        day: d.getDate(),
                                        category: category,
                                    });
                                }
                            });
                        });
                        console.log(" --- scraping data from ".concat(company, " succeeded ---"));
                        return [2 /*return*/, all_transactions];
                    }
                    else {
                        throw new Error(scrapeResult.errorType);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _b.sent();
                    console.log(" --- scraping ".concat(company, " failed for the following reason: ").concat(e_1.message, " ---"));
                    return [4 /*yield*/, scraper(company, credentials, year, month)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
//function that categorizes the transaction by its description
function findCategory(description, category) {
    category = category || "אחר";
    if (description.includes("משכורת")) {
        category = "משכורת";
    }
    else if (description.includes("שיק")) {
        category = "שכר דירה";
    }
    else if (description.includes("ביט")) {
        category = "העברת כספים ביט VD/MS";
    }
    else if (category.includes("מלונאות ואירוח")) {
        category = "תיירות";
    }
    else if (description.includes("BIT")) {
        category = "העברת כספים ביט VD/MS";
    }
    else if (category.includes("רשתות שווק מזון") || category.includes("מינימרקטים ומכולות")) {
        category = "מכולת/סופר";
    }
    else if (description.includes("התימני") || description.includes("WOLT")) {
        category = "מסעדות/קפה";
    }
    else if (description.includes('ב"ל מילואים') || description.includes('מופ"ת')) {
        category = "מילואים";
    }
    else if (description.includes("מקס אמות")) {
        category = "כלי בית";
    }
    else if (description.includes("Spotify")) {
        category = "מוסיקה";
    }
    else if (category.includes("שונות") || category.includes("אחר")) {
        category = "אחר";
    }
    else if (category.includes("פנאי")) {
        category = "פנאי בילוי";
    }
    return category || "אחר";
}
//function that checks if the transaction is not a credit card payment
function notCreditCard(description) {
    return !(description.includes('ישראכרט בע"מ') || description.includes("כרטיסי אשראי") || description.includes("מקט איט"));
}
