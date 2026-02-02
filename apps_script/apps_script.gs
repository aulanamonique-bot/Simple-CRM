/**
 * Google Apps Script: Lead Intake → Google Sheets (v2)
 *
 * Step 1) Create a Google Sheet
 * Step 2) Extensions → Apps Script → paste this file
 * Step 3) Replace SPREADSHEET_ID with your sheet id
 * Step 4) Deploy → New deployment → Web app
 *    Execute as: Me
 *    Who has access: Anyone (or Anyone with link)
 * Step 5) Copy the Web App URL (ends with /exec) into script.js ENDPOINT
 */
const SPREADSHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";

function doGet() {
  // Quick health check: open your /exec URL in a browser and you should see OK
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    const intake = ss.getSheetByName("Intake") || ss.insertSheet("Intake");
    const leads = ss.getSheetByName("Leads") || ss.insertSheet("Leads");

    ensureHeaders_(intake, [
      "Lead ID","Created At","Lead Name","Company","Phone","Email","Source","Service Needed",
      "Status","Next Follow-Up","Notes","Assigned To","Priority","Raw JSON"
    ]);
    ensureHeaders_(leads, [
      "Lead ID","Created At","Lead Name","Company","Phone","Email","Source","Service Needed",
      "Status","Next Follow-Up","Last Contacted","Assigned To","Priority","Notes"
    ]);

    const data = JSON.parse((e && e.postData && e.postData.contents) ? e.postData.contents : "{}");

    const now = new Date();
    const tz = Session.getScriptTimeZone();
    const leadId = "L-" + Utilities.formatDate(now, tz, "yyyyMMdd-HHmmss");

    intake.appendRow([
      leadId,
      now,
      data.leadName || "",
      data.company || "",
      data.phone || "",
      data.email || "",
      data.source || "",
      data.serviceNeeded || "",
      data.status || "New",
      data.nextFollowUp || "",
      data.notes || "",
      data.assignedTo || "",
      data.priority || "Normal",
      JSON.stringify(data)
    ]);

    leads.appendRow([
      leadId,
      now,
      data.leadName || "",
      data.company || "",
      data.phone || "",
      data.email || "",
      data.source || "",
      data.serviceNeeded || "",
      data.status || "New",
      data.nextFollowUp || "",
      "", // Last Contacted
      data.assignedTo || "",
      data.priority || "Normal",
      data.notes || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        leadId: leadId,
        spreadsheetUrl: ss.getUrl(),
        leadsLastRow: leads.getLastRow(),
        intakeLastRow: intake.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function ensureHeaders_(sheet, headers){
  const range = sheet.getRange(1,1,1,headers.length);
  const firstRow = range.getValues()[0];
  const empty = firstRow.every(v => !v);
  if (sheet.getLastRow() === 0 || empty){
    range.setValues([headers]);
  }
}
