const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

// Colors
const NAVY = "1B3A5C";
const ACCENT = "2E7D32";
const LIGHT_BG = "F0F4F8";
const GREEN_BG = "E8F5E9";
const YELLOW_BG = "FFF8E1";
const RED_BG = "FFEBEE";
const BORDER_COLOR = "B0BEC5";
const CHECK_GREEN = "2E7D32";
const PENDING_AMBER = "F57F17";

const border = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: NAVY, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 20 })]
    })]
  });
}

function cell(text, width, opts = {}) {
  const runs = [];
  if (opts.bold) {
    runs.push(new TextRun({ text, bold: true, font: "Arial", size: 20, color: opts.color || "333333" }));
  } else {
    runs.push(new TextRun({ text, font: "Arial", size: 20, color: opts.color || "333333" }));
  }
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({ children: runs })]
  });
}

function statusCell(text, width) {
  let fill, color;
  if (text === "DONE") { fill = GREEN_BG; color = CHECK_GREEN; }
  else if (text === "PENDING") { fill = YELLOW_BG; color = PENDING_AMBER; }
  else if (text === "BLOCKED") { fill = RED_BG; color = "C62828"; }
  else { fill = LIGHT_BG; color = "333333"; }
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, font: "Arial", size: 20, color })]
    })]
  });
}

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 32, color: NAVY })]
  });
}

function subHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: NAVY })]
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.noSpace ? 0 : 120 },
    children: [new TextRun({ text, font: "Arial", size: 21, color: "333333", bold: opts.bold || false, italics: opts.italic || false })]
  });
}

function bulletItem(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 21, color: "333333" })]
  });
}

function richBullet(runs, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: runs
  });
}

// Document
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets2", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets3", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets4", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets5", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets6", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets7", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets8", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "ZZ Dream Consulting LLC  |  Tax Prep Session Recap  |  February 10, 2026", font: "Arial", size: 16, color: "999999", italics: true })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Page ", font: "Arial", size: 16, color: "999999" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" })]
        })]
      })
    },
    children: [
      // ===== TITLE =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "ZZ Dream Consulting LLC", bold: true, font: "Arial", size: 44, color: NAVY })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "2025 Tax Preparation  \u2014  Session Recap & Next Steps", font: "Arial", size: 28, color: "555555" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 360 },
        children: [new TextRun({ text: "Session Date: February 10, 2026", font: "Arial", size: 20, color: "777777" })]
      }),

      // ===== SECTION 1: CPA REQUEST =====
      sectionHeading("1. What Jason Requested"),
      bodyText("Jason Basch (CPA at Basch & Company CPAs, LLC) emailed requesting 2025 books and records for ZZ Dream Consulting LLC. He specifically asked for:"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      richBullet([
        new TextRun({ text: "General Ledger", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: " \u2014 a complete, transaction-level record of all 2025 activity across every account", font: "Arial", size: 21, color: "333333" })
      ], "bullets"),
      richBullet([
        new TextRun({ text: "Balance Sheet", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: " \u2014 assets, liabilities, and equity as of December 31, 2025", font: "Arial", size: 21, color: "333333" })
      ], "bullets"),
      richBullet([
        new TextRun({ text: "Income Statement (Profit & Loss)", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: " \u2014 revenue and expenses for the full year 2025", font: "Arial", size: 21, color: "333333" })
      ], "bullets"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      bodyText("These reports support the LLC tax filing (likely Form 1065 or Schedule C, depending on election). The filing deadline is March 15 or April 15, 2026, so time is of the essence."),

      // ===== SECTION 2: WORK COMPLETED =====
      sectionHeading("2. Work Completed This Session"),

      subHeading("2a. QuickBooks Company Restructuring"),
      bodyText("The QuickBooks company was originally called \"Zalaznick Domestic\" and contained a mix of personal and business accounts, bank feeds, and transactions. This session focused on converting it into a clean, LLC-only company."),
      new Paragraph({ spacing: { after: 40 }, children: [] }),

      // Restructuring summary table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [5000, 2360, 2000],
        rows: [
          new TableRow({ children: [headerCell("Action", 5000), headerCell("Details", 2360), headerCell("Status", 2000)] }),
          new TableRow({ children: [cell("Renamed company to ZZ Dream Consulting LLC", 5000), cell("Settings > Company", 2360), statusCell("DONE", 2000)] }),
          new TableRow({ children: [cell("Deleted 12 personal purchase transactions", 5000), cell("Vehicle loan/lease payments", 2360), statusCell("DONE", 2000)] }),
          new TableRow({ children: [cell("Deactivated 3 personal vendors", 5000), cell("GM Financial, Audi Financial, CAF", 2360), statusCell("DONE", 2000)] }),
          new TableRow({ children: [cell("Deactivated 65 personal accounts", 5000), cell("All 8000-series + Centurion + Jeff Personal", 2360), statusCell("DONE", 2000)] }),
          new TableRow({ children: [cell("Zeroed out Jeff Personal Account (#138)", 5000), cell("JE #20: $373.30 to Owner Draws", 2360), statusCell("DONE", 2000)] }),
          new TableRow({ children: [cell("Unmatched 16 posted bank feed transactions", 5000), cell("QuickBooks UI Banking > Posted > Undo", 2360), statusCell("DONE", 2000)] }),
          new TableRow({ children: [cell("Disconnected Jeff Personal bank feed", 5000), cell("Bank of America (...2148)", 2360), statusCell("DONE", 2000)] }),
          new TableRow({ children: [cell("Verified Centurion Card feed already off", 5000), cell("American Express (...3001)", 2360), statusCell("DONE", 2000)] }),
        ]
      }),

      new Paragraph({ spacing: { after: 40 }, children: [] }),

      subHeading("2b. MCP Server Upgrades"),
      bodyText("The QuickBooks MCP server (used by Claude Code to interact with QuickBooks via API) was originally read-only. Four write tools were added to enable programmatic cleanup:"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      richBullet([
        new TextRun({ text: "update_entity", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: " \u2014 sparse updates (deactivate accounts, rename, etc.)", font: "Arial", size: 21, color: "333333" })
      ], "bullets2"),
      richBullet([
        new TextRun({ text: "create_entity", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: " \u2014 create invoices, journal entries, purchases, etc.", font: "Arial", size: 21, color: "333333" })
      ], "bullets2"),
      richBullet([
        new TextRun({ text: "delete_entity", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: " \u2014 delete transactions by ID", font: "Arial", size: 21, color: "333333" })
      ], "bullets2"),
      richBullet([
        new TextRun({ text: "batch_operation", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: " \u2014 bulk operations (up to 30 per call)", font: "Arial", size: 21, color: "333333" })
      ], "bullets2"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      bodyText("A Pydantic type annotation fix was also applied (Union[str, dict]) to handle MCP protocol auto-parsing of JSON parameters."),

      subHeading("2c. OAuth Token Refresh"),
      bodyText("The QuickBooks OAuth refresh token had expired (100-day expiry). A new token was obtained through the Intuit OAuth 2.0 Playground at developer.intuit.com and saved to the .env file. Note: the client secret was briefly visible in a screenshot and should be rotated as a security precaution."),

      // ===== SECTION 3: CURRENT STATE =====
      sectionHeading("3. Current State of QuickBooks"),
      bodyText("The QuickBooks company is now a clean LLC entity. Only business accounts remain active. The connected bank feed is the ZZ Dream Consulting LLC checking account at Bank of America (Business Adv Fundamentals ...6952, balance $131,861.83)."),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      bodyText("No 2025 business transactions have been entered yet. The company currently shows zero revenue and zero expenses for 2025. All the activity described below still needs to be recorded."),

      // ===== SECTION 4: 2025 TRANSACTIONS =====
      sectionHeading("4. 2025 Business Activity to Enter"),
      bodyText("The following transactions have been identified and need to be recorded in QuickBooks:"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),

      // Transaction table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 3660, 1600, 1500, 1400],
        rows: [
          new TableRow({ children: [
            headerCell("Date", 1200), headerCell("Description", 3660), headerCell("Amount", 1600), headerCell("Account", 1500), headerCell("Status", 1400)
          ] }),
          new TableRow({ children: [
            cell("TBD", 1200), cell("Consulting income wire #1", 3660), cell("+$100.00", 1600, { color: CHECK_GREEN }), cell("4100 Service Income", 1500), statusCell("PENDING", 1400)
          ] }),
          new TableRow({ children: [
            cell("TBD", 1200), cell("Consulting income wire #2 (lifestyle & hospitality)", 3660), cell("+$108,000.00", 1600, { color: CHECK_GREEN }), cell("4100 Service Income", 1500), statusCell("PENDING", 1400)
          ] }),
          new TableRow({ children: [
            cell("TBD", 1200), cell("Investment in Bilt (RSU equity + advisory shares)", 3660), cell("-$100,000.00", 1600, { color: "C62828" }), cell("NEW: Investment - Bilt", 1500), statusCell("PENDING", 1400)
          ] }),
          new TableRow({ children: [
            cell("TBD", 1200), cell("NetJets payment (flight activity + overhead fees)", 3660), cell("-$368,414.81", 1600, { color: "C62828" }), cell("7100-7500 (breakout)", 1500), statusCell("PENDING", 1400)
          ] }),
          new TableRow({ children: [
            cell("11/21/25", 1200), cell("Transfer to Jeff personal (car payment cover)", 3660), cell("-$2,599.90", 1600, { color: "C62828" }), cell("57 Owner Draws", 1500), statusCell("PENDING", 1400)
          ] }),
          new TableRow({ children: [
            cell("Various", 1200), cell("Legal & consulting fees (business setup/structuring)", 3660), cell("TBD", 1600), cell("6310/6320", 1500), statusCell("PENDING", 1400)
          ] }),
        ]
      }),

      new Paragraph({ spacing: { after: 40 }, children: [] }),

      subHeading("4a. Important Notes on Specific Transactions"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      richBullet([
        new TextRun({ text: "$108,000 consulting income: ", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: "This wire was received in 2025 but was refunded in 2026 (client paid from wrong account). The client then repaid $108,000 from the correct account, also in 2026. For 2025 cash-basis reporting, the $108,000 received in 2025 is 2025 income. The refund and re-payment are both 2026 events. Flag this for Jason.", font: "Arial", size: 21, color: "333333" })
      ], "bullets3"),
      richBullet([
        new TextRun({ text: "$100,000 Bilt investment: ", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: "This is an equity investment, NOT an expense. It belongs on the Balance Sheet as an Other Asset (\"Investment - Bilt\"). A new account needs to be created in QuickBooks for this. The investment includes RSU equity and additional advisory shares.", font: "Arial", size: 21, color: "333333" })
      ], "bullets3"),
      richBullet([
        new TextRun({ text: "$368,414.81 NetJets payment: ", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: "This covers flight activity and overhead fees for the fractional ownership stake in a Citation Latitude. The NetJets invoice/statement should be used to break this across sub-accounts (7100 Card Services, 7200 Membership Fees, 7300 Flight Expenses, 7400 Fuel & Surcharges, 7500 Other) for proper tax treatment.", font: "Arial", size: 21, color: "333333" })
      ], "bullets3"),
      richBullet([
        new TextRun({ text: "$2,599.90 personal transfer: ", bold: true, font: "Arial", size: 21, color: "333333" }),
        new TextRun({ text: "This was a transfer from the business account to Jeff's personal account to cover a car payment. It is booked as Owner Draws (Account 57), an equity account, so it does NOT appear as a business expense on the Income Statement.", font: "Arial", size: 21, color: "333333" })
      ], "bullets3"),

      // ===== SECTION 5: CHART OF ACCOUNTS =====
      new Paragraph({ children: [new PageBreak()] }),
      sectionHeading("5. Chart of Accounts Status"),
      bodyText("The following business accounts are currently active in QuickBooks. One new account needs to be created."),
      new Paragraph({ spacing: { after: 40 }, children: [] }),

      subHeading("5a. Income Accounts"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 4000, 3960],
        rows: [
          new TableRow({ children: [headerCell("Number", 1400), headerCell("Name", 4000), headerCell("Purpose", 3960)] }),
          new TableRow({ children: [cell("4100", 1400), cell("Service Income", 4000), cell("Consulting income wires ($100 + $108K)", 3960)] }),
          new TableRow({ children: [cell("4200", 1400), cell("Consulting Revenue", 4000), cell("Alternative consulting income account", 3960)] }),
          new TableRow({ children: [cell("4300", 1400), cell("Other Income", 4000), cell("Non-service income", 3960)] }),
          new TableRow({ children: [cell("4400", 1400), cell("Miscellaneous Income", 4000), cell("Catchall", 3960)] }),
        ]
      }),

      new Paragraph({ spacing: { after: 40 }, children: [] }),
      subHeading("5b. Expense Accounts"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 4960, 3000],
        rows: [
          new TableRow({ children: [headerCell("Number", 1400), headerCell("Name", 4960), headerCell("Purpose", 3000)] }),
          new TableRow({ children: [cell("6310", 1400), cell("Professional Services - Consulting", 4960), cell("Consulting fees for biz setup", 3000)] }),
          new TableRow({ children: [cell("6320", 1400), cell("Professional Services - Legal", 4960), cell("Legal fees for biz structuring", 3000)] }),
          new TableRow({ children: [cell("6330", 1400), cell("Professional Services - Accounting", 4960), cell("Accounting/CPA fees", 3000)] }),
          new TableRow({ children: [cell("7100", 1400), cell("NetJets - Card Services", 4960), cell("NetJets card-related charges", 3000)] }),
          new TableRow({ children: [cell("7200", 1400), cell("NetJets - Membership Fees", 4960), cell("Monthly/annual membership", 3000)] }),
          new TableRow({ children: [cell("7300", 1400), cell("NetJets - Flight Expenses", 4960), cell("Occupied hourly charges", 3000)] }),
          new TableRow({ children: [cell("7400", 1400), cell("NetJets - Fuel & Surcharges", 4960), cell("Fuel surcharges", 3000)] }),
          new TableRow({ children: [cell("7500", 1400), cell("NetJets - Other", 4960), cell("Other NetJets fees", 3000)] }),
        ]
      }),

      new Paragraph({ spacing: { after: 40 }, children: [] }),
      subHeading("5c. Asset Accounts"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 4960, 3000],
        rows: [
          new TableRow({ children: [headerCell("Number", 1400), headerCell("Name", 4960), headerCell("Purpose", 3000)] }),
          new TableRow({ children: [cell("140", 1400), cell("ZZ Dream Consulting LLC (Checking)", 4960), cell("Main business bank account", 3000)] }),
          new TableRow({ children: [cell("1500-1650", 1400), cell("NetJets Assets (Account, Deposits, Credits, Prepaid)", 4960), cell("Fractional ownership assets", 3000)] }),
          new TableRow({ children: [
            cell("NEW", 1400, { bold: true, color: "C62828" }),
            cell("Investment - Bilt (needs to be created)", 4960, { bold: true, color: "C62828" }),
            cell("$100K equity investment", 3000, { color: "C62828" })
          ] }),
        ]
      }),

      new Paragraph({ spacing: { after: 40 }, children: [] }),
      subHeading("5d. Equity Accounts"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 4960, 3000],
        rows: [
          new TableRow({ children: [headerCell("ID", 1400), headerCell("Name", 4960), headerCell("Purpose", 3000)] }),
          new TableRow({ children: [cell("57", 1400), cell("Owner Draws", 4960), cell("Personal withdrawals ($2,599.90 + $373.30 JE)", 3000)] }),
        ]
      }),

      // ===== SECTION 6: NEXT STEPS =====
      new Paragraph({ children: [new PageBreak()] }),
      sectionHeading("6. Next Steps \u2014 Detailed Instructions"),
      bodyText("Follow these steps in order to complete the 2025 books and generate the reports for Jason."),
      new Paragraph({ spacing: { after: 40 }, children: [] }),

      subHeading("Step 1: Gather Source Documents"),
      bodyText("Collect the following documents. Upload them to the Cowork session or have them ready for reference when entering transactions in Claude Code:"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      richBullet([
        new TextRun({ text: "Bank of America statements ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "for ZZ Dream Consulting LLC checking account (Business Adv Fundamentals ...6952) for all of 2025. This will show exact dates for both income wires, the $100K Bilt investment wire, the $2,599.90 transfer, the NetJets payment, and all smaller expense transactions.", font: "Arial", size: 21 })
      ], "bullets4"),
      richBullet([
        new TextRun({ text: "NetJets invoice/statement ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "for the $368,414.81 payment. This will have the line-item breakdown needed to split the charge across NetJets sub-accounts (7100-7500).", font: "Arial", size: 21 })
      ], "bullets4"),
      richBullet([
        new TextRun({ text: "Client invoices ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "for the $100 and $108,000 consulting engagements. These help create proper customer records and invoice entries in QuickBooks.", font: "Arial", size: 21 })
      ], "bullets4"),
      richBullet([
        new TextRun({ text: "Receipts for legal/consulting fees ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "related to business setup and structuring. These are the smaller expense transactions.", font: "Arial", size: 21 })
      ], "bullets4"),
      richBullet([
        new TextRun({ text: "Bilt investment documentation ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "\u2014 wire confirmation, subscription agreement, or equity agreement showing the $100,000 investment terms.", font: "Arial", size: 21 })
      ], "bullets4"),

      new Paragraph({ spacing: { after: 40 }, children: [] }),
      subHeading("Step 2: Create Missing Account"),
      bodyText("In Claude Code with the MCP server, create the Investment - Bilt account:"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      bodyText("Prompt for Claude Code:", { italic: true }),
      bodyText("\"Create a new account in QuickBooks: Name = 'Investment - Bilt', AccountType = 'Other Asset', AccountSubType = 'OtherLongTermAssets', Description = 'Equity investment in Bilt - RSU equity and advisory shares'. Use the create_entity tool.\"", { italic: true }),

      new Paragraph({ spacing: { after: 40 }, children: [] }),
      subHeading("Step 3: Enter All 2025 Transactions"),
      bodyText("Using Claude Code with the MCP server, enter each transaction. Share the bank statements with Claude Code so it can read exact dates and amounts. Here is the general approach:"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      richBullet([
        new TextRun({ text: "Income wires ($100 + $108,000): ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "Create as Deposits or Sales Receipts to Account 4100 (Service Income), deposited to Account 140 (ZZ Dream Consulting LLC checking). Optionally create Invoices first for proper AR tracking, then record Payments against them.", font: "Arial", size: 21 })
      ], "bullets5"),
      richBullet([
        new TextRun({ text: "Bilt investment ($100,000): ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "Create as a Check or Expense from Account 140, categorized to the new Investment - Bilt asset account. This moves the cash from the bank to the investment on the Balance Sheet.", font: "Arial", size: 21 })
      ], "bullets5"),
      richBullet([
        new TextRun({ text: "NetJets payment ($368,414.81): ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "Create as a Check or Expense from Account 140 to Vendor: NetJets Inc. Use multiple line items to split across 7100-7500 per the NetJets invoice breakdown.", font: "Arial", size: 21 })
      ], "bullets5"),
      richBullet([
        new TextRun({ text: "Owner Draw ($2,599.90): ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "Create as a Check or Transfer from Account 140, categorized to Account 57 (Owner Draws). Date: November 21, 2025.", font: "Arial", size: 21 })
      ], "bullets5"),
      richBullet([
        new TextRun({ text: "Legal/consulting fees: ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "Create as Expenses from Account 140, categorized to 6310 (Consulting) or 6320 (Legal) depending on the vendor. Create vendor records as needed.", font: "Arial", size: 21 })
      ], "bullets5"),

      new Paragraph({ spacing: { after: 40 }, children: [] }),
      subHeading("Step 4: Match to Bank Feed (if applicable)"),
      bodyText("If the Bank of America bank feed has already downloaded 2025 transactions, the manually created entries will need to be matched to the downloaded transactions in the Banking tab. Go to Banking > For Review, and match each downloaded transaction to the corresponding QuickBooks entry. If there are no downloaded transactions for 2025, skip this step."),

      new Paragraph({ spacing: { after: 40 }, children: [] }),
      subHeading("Step 5: Reconcile"),
      bodyText("Go to Settings > Reconcile in QuickBooks. Reconcile the ZZ Dream Consulting LLC checking account for December 2025 against the Bank of America statement ending balance. This ensures all transactions are accounted for and the QuickBooks balance matches the bank."),

      new Paragraph({ spacing: { after: 40 }, children: [] }),
      subHeading("Step 6: Generate Reports for Jason"),
      bodyText("Once all transactions are entered and reconciled, generate these three reports from QuickBooks:"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      richBullet([
        new TextRun({ text: "General Ledger: ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "Reports > All Reports > General Ledger. Set date range to January 1 - December 31, 2025. Export to PDF.", font: "Arial", size: 21 })
      ], "bullets6"),
      richBullet([
        new TextRun({ text: "Balance Sheet: ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "Reports > All Reports > Balance Sheet. Set as of date to December 31, 2025. Export to PDF.", font: "Arial", size: 21 })
      ], "bullets6"),
      richBullet([
        new TextRun({ text: "Income Statement (Profit & Loss): ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: "Reports > All Reports > Profit and Loss. Set date range to January 1 - December 31, 2025. Export to PDF.", font: "Arial", size: 21 })
      ], "bullets6"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      bodyText("Alternatively, Claude Code can pull these via the MCP server using query_quickbooks, though the QuickBooks UI exports are typically what CPAs prefer to receive."),

      new Paragraph({ spacing: { after: 40 }, children: [] }),
      subHeading("Step 7: Send to Jason"),
      bodyText("Email the three PDF reports to Jason Basch. Include a brief note about the $108,000 wire that was refunded and re-paid in 2026, so he can plan for the 2026 tax implications."),

      // ===== SECTION 7: SECURITY NOTE =====
      sectionHeading("7. Security Reminder"),
      bodyText("During this session, the QuickBooks client secret was briefly visible in a screenshot shared in the conversation. As a precaution, rotate the client secret in the Intuit Developer Portal:"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),
      bulletItem("Go to developer.intuit.com > Your Apps > Keys & credentials > Production", "bullets7"),
      bulletItem("Generate a new client secret", "bullets7"),
      bulletItem("Update QUICKBOOKS_CLIENT_SECRET in the .env file at /Users/samfoley/quickbooks-mcp-server/.env", "bullets7"),

      // ===== SECTION 8: TECHNICAL REFERENCE =====
      sectionHeading("8. Technical Reference"),
      new Paragraph({ spacing: { after: 40 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3200, 6160],
        rows: [
          new TableRow({ children: [headerCell("Item", 3200), headerCell("Value", 6160)] }),
          new TableRow({ children: [cell("QuickBooks Company", 3200), cell("ZZ Dream Consulting LLC", 6160)] }),
          new TableRow({ children: [cell("Company ID", 3200), cell("9341453748656108", 6160)] }),
          new TableRow({ children: [cell("Environment", 3200), cell("Production", 6160)] }),
          new TableRow({ children: [cell("MCP Server Path", 3200), cell("/Users/samfoley/quickbooks-mcp-server", 6160)] }),
          new TableRow({ children: [cell("MCP Server File", 3200), cell("main_quickbooks_mcp.py", 6160)] }),
          new TableRow({ children: [cell("Claude Code MCP Command", 3200), cell("claude mcp add quickbooks -- uv --directory /Users/samfoley/quickbooks-mcp-server run main_quickbooks_mcp.py", 6160)] }),
          new TableRow({ children: [cell("Business Bank Account", 3200), cell("Bank of America Business Adv Fundamentals (...6952) \u2014 Account ID 140", 6160)] }),
          new TableRow({ children: [cell("OAuth Token Expiry", 3200), cell("Refresh tokens expire after 100 days. Use Intuit OAuth 2.0 Playground to renew.", 6160)] }),
          new TableRow({ children: [cell("Write Tools Added", 3200), cell("update_entity, create_entity, delete_entity, batch_operation", 6160)] }),
        ]
      }),

      new Paragraph({ spacing: { after: 200 }, children: [] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "\u2014 End of Session Recap \u2014", font: "Arial", size: 20, color: "999999", italics: true })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/elegant-beautiful-hawking/mnt/quickbooks-mcp-server/ZZ_Dream_Consulting_Session_Recap_Feb10_2026.docx", buffer);
  console.log("Document created successfully!");
});
