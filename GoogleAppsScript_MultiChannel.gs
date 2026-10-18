/**
 * Google Apps Script (Code.gs) for SportsMax Multi-Channel Hub
 * 
 * Supports:
 *  1. action === "contact_lead" -> Writes to "Contact_Leads" tab (Includes UTM attribution from LinkedIn)
 *  2. action === "youtube_engagement_sync" -> Writes to "YouTube Engagement" tab
 *  3. action === "linkedin_engagement_sync" -> Writes to "LinkedIn Engagement" tab
 *     (Stores: Post URL/Title, Likes Count, Comment Text, Commenter Name, Commenter LinkedIn Profile/ID, Date, Timestamp)
 */

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : "";
    if (!raw) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Empty body" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // -------------------------------------------------------------
    // TAB 1: LinkedIn Engagement & Comments Tab
    // -------------------------------------------------------------
    if (data.action === "linkedin_engagement_sync" || data.type === "linkedin_engagement") {
      var liSheet = ss.getSheetByName("LinkedIn Engagement");
      if (!liSheet) {
        liSheet = ss.insertSheet("LinkedIn Engagement");
        liSheet.appendRow([
          "Post Title / Topic",
          "Post URL",
          "Total Post Likes",
          "Total Impressions",
          "Commenter Name",
          "Commenter LinkedIn Profile URL / User ID",
          "Comment Text",
          "Comment Likes",
          "Comment Date",
          "Sync Timestamp"
        ]);
        liSheet.setFrozenRows(1);
        liSheet.getRange(1, 1, 1, 10).setBackground("#0284c7").setFontColor("#ffffff").setFontWeight("bold");
      }
      
      var items = data.records || [];
      if (items.length > 0) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          liSheet.appendRow([
            item.postTitle || data.postTitle || "",
            item.postUrl || data.postUrl || "",
            item.totalLikes || data.likes || 0,
            item.impressions || data.impressions || 0,
            item.commenterName || "Unknown Member",
            item.commenterProfileUrl || item.commenterUserId || "",
            item.commentText || "",
            item.commentLikes || 0,
            item.commentDate || new Date().toISOString(),
            new Date().toISOString()
          ]);
        }
      } else {
        // Single post / summary row entry
        liSheet.appendRow([
          data.postTitle || "",
          data.postUrl || "",
          data.likes || data.reactions || 0,
          data.impressions || 0,
          data.commenterName || "Summary Entry",
          data.commenterProfileUrl || data.commenterUserId || "",
          data.commentText || "",
          data.commentLikes || 0,
          data.date || new Date().toISOString(),
          new Date().toISOString()
        ]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", sheet: "LinkedIn Engagement" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // -------------------------------------------------------------
    // TAB 2: YouTube Engagement Tab
    // -------------------------------------------------------------
    if (data.action === "youtube_engagement_sync") {
      var ytSheet = ss.getSheetByName("YouTube Engagement");
      if (!ytSheet) {
        ytSheet = ss.insertSheet("YouTube Engagement");
        ytSheet.appendRow([
          "Video Title",
          "Video ID",
          "Total Views",
          "Total Likes",
          "Commenter Name",
          "Commenter Channel / Handle URL",
          "Comment Text",
          "Comment Likes",
          "Comment Date",
          "Comment Link",
          "Sync Timestamp"
        ]);
        ytSheet.setFrozenRows(1);
        ytSheet.getRange(1, 1, 1, 11).setBackground("#dc2626").setFontColor("#ffffff").setFontWeight("bold");
      }
      
      var recs = data.records || [];
      for (var r = 0; r < recs.length; r++) {
        var rec = recs[r];
        ytSheet.appendRow([
          rec.videoTitle || "",
          rec.videoId || "",
          rec.totalViews || 0,
          rec.totalLikes || 0,
          rec.commenterDisplayName || "",
          rec.commenterChannelId || "",
          rec.commentText || "",
          rec.commentLikes || 0,
          rec.commentDate || "",
          rec.commentUrl || "",
          rec.lastSyncedTime || new Date().toISOString()
        ]);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", sheet: "YouTube Engagement", count: recs.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // -------------------------------------------------------------
    // TAB 3: Contact Leads Tab (With LinkedIn UTM Attribution)
    // -------------------------------------------------------------
    if (data.action === "contact_lead" || data.event === "contact_lead") {
      var leadSheet = ss.getSheetByName("Contact_Leads") || ss.getSheetByName("Contact Leads");
      if (!leadSheet) {
        leadSheet = ss.insertSheet("Contact_Leads");
        leadSheet.appendRow([
          "Lead Reference",
          "Full Name",
          "Work Email",
          "Role",
          "Organization",
          "Sports",
          "Requirement",
          "Phone",
          "Message",
          "Traffic Source",
          "Campaign",
          "Medium",
          "Landing Page",
          "Page Submitted",
          "Timestamp"
        ]);
        leadSheet.setFrozenRows(1);
        leadSheet.getRange(1, 1, 1, 15).setBackground("#059669").setFontColor("#ffffff").setFontWeight("bold");
      }
      
      leadSheet.appendRow([
        data.leadNumber || data.lead_number || "",
        data.name || "",
        data.email || "",
        data.role || "",
        data.organization || "",
        data.sports || data.sport || "",
        data.requirement || "",
        data.phone || "",
        data.message || "",
        data.source || data.utmSource || "",
        data.utmCampaign || data.utm_campaign || "",
        data.utmMedium || data.utm_medium || "",
        data.landingPage || data.landing_page || "",
        data.page || "",
        data.timestamp || new Date().toISOString()
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", sheet: "Contact_Leads" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Fallback: Append generic event to an Activity log
    var actSheet = ss.getSheetByName("Activity_Log");
    if (!actSheet) {
      actSheet = ss.insertSheet("Activity_Log");
      actSheet.appendRow(["Event", "Payload", "Timestamp"]);
    }
    actSheet.appendRow([data.action || data.event || "unknown", JSON.stringify(data), new Date().toISOString()]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", sheet: "Activity_Log" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
