/**
 * ConVerse Engine Contract: Safety Tips & Playbooks
 * Module Owner: Safety Tips Teammate
 * Foundation Interface by: Tanishka
 */

import { EMERGENCY_HELPLINES } from '../../data/initial-data.js';

export const SAFETY_PLAYBOOKS = [
  {
    id: "tip-upi-1",
    category: "upi",
    title: "The Golden Rule of UPI PIN",
    summary: "UPI PIN is only required to SEND money or check balance, NEVER to receive money.",
    fullGuide: "When someone says 'Scan this QR code and enter your PIN to receive prize/refund', it will deduct money from your account immediately.",
    keyTakeaway: "Receiving money on UPI never requires a PIN or OTP.",
    riskSeverity: "danger"
  },
  {
    id: "tip-otp-1",
    category: "otp",
    title: "Bank & Police Impersonation Defense",
    summary: "No bank official, police officer, or telecom agent will ever ask for your OTP or bank password.",
    fullGuide: "Fraudsters create urgency claiming your SIM will be deactivated, parcel is intercepted by customs, or KYC has expired.",
    keyTakeaway: "Legitimate officials never demand OTPs or financial clearance transfers over video calls.",
    riskSeverity: "danger"
  },
  {
    id: "tip-apk-1",
    category: "phishing",
    title: "Beware of Unknown APK Files on WhatsApp",
    summary: "Never install files ending in '.apk' sent via WhatsApp pretending to be wedding cards or e-challans.",
    fullGuide: "These APKs install trojans that intercept SMS OTPs and control your device remotely.",
    keyTakeaway: "Only install verified apps directly from the Google Play Store.",
    riskSeverity: "danger"
  }
];

/**
 * Returns safety playbooks filtered by query or category
 * @param {Object} [filter]
 * @param {string} [filter.query]
 * @param {string} [filter.category]
 * @returns {Array<Object>}
 */
export function getSafetyPlaybooks(filter = {}) {
  let list = [...SAFETY_PLAYBOOKS];
  if (filter.category && filter.category !== "all") {
    list = list.filter(p => p.category === filter.category);
  }
  if (filter.query) {
    const q = filter.query.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q));
  }
  return list;
}

/**
 * Get emergency reaction helplines
 * @returns {Array<Object>}
 */
export function getEmergencyHelplines() {
  return [...EMERGENCY_HELPLINES];
}
