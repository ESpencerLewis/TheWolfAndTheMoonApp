import { Capacitor } from '@capacitor/core';
import { Purchases, PURCHASES_ERROR_CODE, LOG_LEVEL } from '@revenuecat/purchases-capacitor';

// Set in .env.local — get your key from app.revenuecat.com
const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY || '';

// Must match consumable product IDs in App Store Connect
export const DONATION_PRODUCTS = {
  5:  'com.wolfandmoon.app.donate5',
  10: 'com.wolfandmoon.app.donate10',
  25: 'com.wolfandmoon.app.donate25',
  50: 'com.wolfandmoon.app.donate50',
};

let initialized = false;

export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

export async function initIAP() {
  if (!isNativePlatform() || initialized || !REVENUECAT_API_KEY) return;
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    initialized = true;
  } catch (e) {
    console.warn('RevenueCat init failed:', e);
  }
}

export async function purchaseDonation(productIdentifier) {
  if (!initialized) throw new Error('IAP not initialized');
  try {
    const { customerInfo } = await Purchases.purchaseStoreProduct({
      product: { productIdentifier },
    });
    return { success: true, customerInfo };
  } catch (e) {
    if (e.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      return { success: false, cancelled: true };
    }
    throw e;
  }
}
