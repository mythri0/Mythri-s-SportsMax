import fs from "fs";
import path from "path";
import {
  renderLeadAcknowledgement,
  renderWelcomeEmail,
  renderReengagementEmail,
  renderAdvertisementEmail,
  renderBusinessValueEmail,
  renderLeadGenerationEmail,
  renderProductHighlightEmail,
} from "../src/lib/email-templates";

const outDir = path.resolve("email-previews");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const sampleAck = renderLeadAcknowledgement({
  leadNumber: "SM-20261016-8349",
  fullName: "Jordan Taylor",
  workEmail: "jordan.taylor@varsityathletics.org",
  organization: "Varsity Athletics Performance Hub",
  roleTitle: "Director of High Performance",
  sports: ["Running", "Athletics", "Football"],
  requirement: "Multi-Squad Wearable & Video Telemetry Integration",
  phone: "+1 (555) 234-5678",
  additionalDetails: "We are looking to connect 45 athletes with ACWR injury risk models.",
});
fs.writeFileSync(path.join(outDir, "acknowledgement-preview.html"), sampleAck.html);

const welcome = renderWelcomeEmail({
  recipientName: "Jordan Taylor",
  organization: "Varsity Athletics",
});
fs.writeFileSync(path.join(outDir, "1-welcome-preview.html"), welcome.html);

const reengage = renderReengagementEmail({
  recipientName: "Jordan Taylor",
  daysInactive: 14,
});
fs.writeFileSync(path.join(outDir, "2-reengagement-preview.html"), reengage.html);

const ad = renderAdvertisementEmail({
  recipientName: "Jordan Taylor",
  campaignHeadline: "Olympic-Grade Telemetry at 50% Off Team Tier",
  offerDetails: "Special preseason onboarding package for collegiate athletic programs.",
});
fs.writeFileSync(path.join(outDir, "3-advertisement-preview.html"), ad.html);

const bval = renderBusinessValueEmail({
  recipientName: "Jordan Taylor",
  recipientOrganization: "Varsity Athletics",
});
fs.writeFileSync(path.join(outDir, "4-business-value-preview.html"), bval.html);

const leadGen = renderLeadGenerationEmail({
  recipientName: "Jordan Taylor",
  sportFocus: "Track & Field",
});
fs.writeFileSync(path.join(outDir, "5-lead-generation-preview.html"), leadGen.html);

const prod = renderProductHighlightEmail({
  recipientName: "Jordan Taylor",
  featureName: "Optical Computer Vision Pitch Tracking",
  featureSummary:
    "Extract multi-player kinematic velocity, heatmaps, and spatial density straight from broadcast or tactical video without body sensors.",
  capabilities: [
    "Sub-50ms automated detection of player tracking markers",
    "Tactical territory control calculation and pitch voronoi partitions",
    "Sprint acceleration arcs and deceleration impact loads",
  ],
});
fs.writeFileSync(path.join(outDir, "6-product-preview.html"), prod.html);

console.log("SUCCESS_RENDERED_ALL_7_PREVIEWS");
