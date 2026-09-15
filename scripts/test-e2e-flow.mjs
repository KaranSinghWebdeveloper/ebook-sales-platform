/**
 * DigiVault Complete End-to-End Test Suite
 * Tests full business flow across:
 *  1. Dual Auth (Seller & Buyer Registration/Login/Session)
 *  2. Seller Product Upload with binary PDF
 *  3. Ad Campaign Link Generator & UTM verification
 *  4. Buyer Razorpay Checkout & Atomic Payment Verification
 *  5. Anti-Piracy PDF Stream & Expiration Verification
 *  6. Seller Withdrawal Request & Wallet Balance Decrement
 *  7. Super Admin Moderation, Withdrawal Approval/Rejection with Auto-Refund
 *  8. Super Admin Live Dynamic Theming & Commission Slider
 */

const BASE_URL = 'http://localhost:3000';

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.results = [];
  }

  async run(name, fn) {
    process.stdout.write(`\n⏳ Running: ${name}... `);
    try {
      const result = await fn();
      this.passed++;
      console.log(`\x1b[32m✔ PASSED\x1b[0m`);
      if (result) console.log(`   ${result}`);
      this.results.push({ name, status: 'PASSED', details: result });
    } catch (err) {
      this.failed++;
      console.log(`\x1b[31m✖ FAILED\x1b[0m`);
      console.error(`   Error:`, err.message);
      this.results.push({ name, status: 'FAILED', error: err.message });
    }
  }

  summary() {
    console.log('\n=============================================');
    console.log(`Test Execution Summary:`);
    console.log(`  Total:  ${this.passed + this.failed}`);
    console.log(`  Passed: \x1b[32m${this.passed}\x1b[0m`);
    console.log(`  Failed: ${this.failed > 0 ? `\x1b[31m${this.failed}\x1b[0m` : `0`}`);
    console.log('=============================================\n');
    return this.failed === 0;
  }
}

// Helper to extract cookies from response
function getCookieHeader(response) {
  const setCookie = response.headers.get('set-cookie');
  if (!setCookie) return '';
  return setCookie.split(';')[0];
}

async function main() {
  const runner = new TestRunner();
  const timestamp = Date.now();

  // Test state variables
  const sellerEmail = `pro_seller_${timestamp}@example.com`;
  const sellerPassword = 'sellerStrongPassword2026!';
  const buyerEmail = `buyer_${timestamp}@example.com`;
  const buyerPassword = 'buyerStrongPassword2026!';

  let sellerCookie = '';
  let buyerCookie = '';
  let adminCookie = '';

  let createdProduct = null;
  let orderData = null;
  let verifiedPayment = null;
  let downloadToken = null;
  let firstWithdrawalId = null;
  let secondWithdrawalId = null;

  // ----------------------------------------------------
  // TEST CASE 1: Authentication & Account Creation
  // ----------------------------------------------------
  await runner.run('1.1 Register New Seller Account', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Arjun Mehta',
        email: sellerEmail,
        password: sellerPassword,
        role: 'SELLER',
        storeName: 'Arjun Architecture Lab',
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register seller');
    if (data.user.role !== 'SELLER') throw new Error(`Expected role SELLER, got ${data.user.role}`);
    sellerCookie = getCookieHeader(res);
    return `Created seller ${data.user.email} (ID: ${data.user.id})`;
  });

  await runner.run('1.2 Verify Seller Session via /api/auth/me', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: sellerCookie },
    });
    const data = await res.json();
    if (!res.ok || !data.user) throw new Error('Session cookie invalid');
    if (data.user.email !== sellerEmail) throw new Error('Session email mismatch');
    return `Session verified for ${data.user.name} (${data.user.role})`;
  });

  await runner.run('1.3 Register New Buyer Account', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Sharma',
        email: buyerEmail,
        password: buyerPassword,
        role: 'BUYER',
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register buyer');
    if (data.user.role !== 'BUYER') throw new Error(`Expected role BUYER, got ${data.user.role}`);
    buyerCookie = getCookieHeader(res);
    return `Created buyer ${data.user.email} (ID: ${data.user.id})`;
  });

  await runner.run('1.4 Login as Super Admin', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@digivault.com',
        password: 'adminpassword123',
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin login failed');
    if (data.user.role !== 'SUPER_ADMIN') throw new Error('Admin role missing');
    adminCookie = getCookieHeader(res);
    return `Logged in as Super Admin (${data.user.email})`;
  });

  // ----------------------------------------------------
  // TEST CASE 2: Seller Digital Product Upload
  // ----------------------------------------------------
  await runner.run('2.1 Seller Uploads PDF Product via Multipart Form', async () => {
    const samplePdfContent = `%PDF-1.5
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 72 >>
stream
BT
/F1 24 Tf
100 700 Td
(The Ultimate TypeScript Blueprint 2026 - Arjun Mehta) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000201 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
324
%%EOF`;

    const pdfBlob = new Blob([samplePdfContent], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('title', 'The Ultimate TypeScript & System Architecture Blueprint (2026)');
    formData.append('shortDesc', 'Production architectural patterns, micro-frontends, and high-concurrency systems in Next.js 16.');
    formData.append('description', 'Comprehensive 150-page deep dive covering distributed caching, database indexing, and enterprise design.');
    formData.append('price', '799');
    formData.append('category', 'Engineering');
    formData.append('tags', 'typescript, system-design, nextjs, architecture');
    formData.append('pageCount', '150');
    formData.append('coverImage', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80');
    formData.append('file', pdfBlob, 'typescript-architecture-blueprint-2026.pdf');

    const res = await fetch(`${BASE_URL}/api/seller/products`, {
      method: 'POST',
      headers: { Cookie: sellerCookie },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload product');
    if (!data.product || !data.product.id) throw new Error('Product object not returned');
    if (data.product.price !== 799) throw new Error(`Price mismatch: expected 799, got ${data.product.price}`);
    if (!data.product.shareKey) throw new Error('Product shareKey was not generated');

    createdProduct = data.product;
    return `Product created: "${createdProduct.title}" (Slug: ${createdProduct.slug}, ShareKey: ${createdProduct.shareKey})`;
  });

  await runner.run('2.2 Verify Product Appears in Seller Catalog & Public Catalog', async () => {
    // Check seller products endpoint
    const sellerRes = await fetch(`${BASE_URL}/api/seller/products`, {
      headers: { Cookie: sellerCookie },
    });
    const sellerData = await sellerRes.json();
    const foundInSeller = sellerData.products.some((p) => p.id === createdProduct.id);
    if (!foundInSeller) throw new Error('Product not listed in seller products');

    // Check public search
    const publicRes = await fetch(`${BASE_URL}/api/products?search=TypeScript`);
    const publicData = await publicRes.json();
    const foundInPublic = publicData.products.some((p) => p.id === createdProduct.id);
    if (!foundInPublic) throw new Error('Product not searchable in public catalog');

    return `Verified product in both seller listings and public search query for "TypeScript"`;
  });

  // ----------------------------------------------------
  // TEST CASE 3: Ad Campaign Link Generation & Verification
  // ----------------------------------------------------
  await runner.run('3.1 Verify Marketing Ad Link with UTM Tags', async () => {
    const campaignParams = new URLSearchParams({
      ref: createdProduct.shareKey,
      utm_source: 'meta_ads',
      utm_medium: 'instagram_reels',
      utm_campaign: 'typescript_launch_q1',
    });

    const campaignUrl = `${BASE_URL}/product/${createdProduct.slug}?${campaignParams.toString()}`;
    const res = await fetch(campaignUrl);
    if (!res.ok) throw new Error(`Campaign link returned status ${res.status}`);

    const html = await res.text();
    if (!html.includes('The Ultimate TypeScript &amp; System Architecture Blueprint') && !html.includes('The Ultimate TypeScript')) {
      throw new Error('Product title missing in rendered campaign landing page');
    }

    return `Campaign link functional: ${campaignUrl}`;
  });

  // ----------------------------------------------------
  // TEST CASE 4: Buyer Order & Razorpay Atomic Verification
  // ----------------------------------------------------
  await runner.run('4.1 Create Razorpay Order with Dynamic Commission Calculation', async () => {
    const res = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: createdProduct.id,
        buyerName: 'Rohan Sharma',
        buyerEmail: buyerEmail,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order creation failed');
    if (!data.orderId || !data.razorpayOrderId) throw new Error('Missing order tokens');

    orderData = data;
    return `Order created (ID: ${data.orderId}, RZP: ${data.razorpayOrderId}, Amount: ₹${data.amount / 100})`;
  });

  await runner.run('4.2 Verify Payment & Execute Atomic Multi-Table Wallet Settlement', async () => {
    const res = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderData.orderId,
        razorpayOrderId: orderData.razorpayOrderId,
        razorpayPaymentId: `pay_sim_${timestamp}`,
        razorpaySignature: 'sig_simulated_valid',
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Payment verification failed');
    if (!data.downloadToken) throw new Error('Secure download token not issued');

    verifiedPayment = data;
    downloadToken = data.downloadToken;
    return `Payment confirmed! Token issued: ${downloadToken.substring(0, 16)}... | Seller credited ₹${data.sellerEarning}, Platform fee ₹${data.platformFee}`;
  });

  await runner.run('4.3 Verify Seller Wallet Credited in Database', async () => {
    const res = await fetch(`${BASE_URL}/api/seller/earnings`, {
      headers: { Cookie: sellerCookie },
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch seller earnings');

    if (data.walletBalance <= 0) {
      throw new Error(`Seller wallet balance not credited: ${data.walletBalance}`);
    }

    const orderFound = data.orders && data.orders.some((o) => o.id === orderData.orderId);
    if (!orderFound) throw new Error('Order not found in seller orders history');

    return `Seller wallet balance updated to ₹${data.walletBalance.toFixed(2)} (Orders count: ${data.orders.length})`;
  });

  // ----------------------------------------------------
  // TEST CASE 5: Anti-Piracy PDF Download Stream
  // ----------------------------------------------------
  await runner.run('5.1 Stream Secure PDF via Download Token', async () => {
    const res = await fetch(`${BASE_URL}/api/download/${downloadToken}`);
    if (!res.ok) throw new Error(`Download endpoint failed with status ${res.status}`);

    const contentType = res.headers.get('content-type');
    const disposition = res.headers.get('content-disposition');

    if (!contentType || !contentType.includes('application/pdf')) {
      throw new Error(`Incorrect content-type: ${contentType}`);
    }

    if (!disposition || !disposition.includes('attachment')) {
      throw new Error(`Missing or invalid attachment header: ${disposition}`);
    }

    const buffer = await res.arrayBuffer();
    const textHeader = new TextDecoder().decode(buffer.slice(0, 8));
    if (!textHeader.startsWith('%PDF-')) {
      throw new Error('Downloaded stream does not begin with valid PDF signature %PDF-');
    }

    return `Streamed ${buffer.byteLength} bytes of authenticated PDF with attachment header: "${disposition}"`;
  });

  await runner.run('5.2 Reject Tampered or Non-Existent Download Tokens', async () => {
    const res = await fetch(`${BASE_URL}/api/download/dtk_fake_invalid_token_12345`);
    if (res.status !== 404) {
      throw new Error(`Expected 404 for invalid token, got ${res.status}`);
    }
    return `Successfully rejected spoofed download token with HTTP 404`;
  });

  // ----------------------------------------------------
  // TEST CASE 6: Seller Payout / Withdrawal Request
  // ----------------------------------------------------
  await runner.run('6.1 Seller Submits Withdrawal Request', async () => {
    const res = await fetch(`${BASE_URL}/api/seller/withdrawals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sellerCookie,
      },
      body: JSON.stringify({
        amount: 500,
        method: 'UPI',
        accountDetails: 'arjun@oksbi',
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Withdrawal request failed');
    if (data.withdrawal.amount !== 500 || data.withdrawal.status !== 'PENDING') {
      throw new Error('Withdrawal record mismatch');
    }

    firstWithdrawalId = data.withdrawal.id;

    // Verify seller wallet was decremented
    const earningsRes = await fetch(`${BASE_URL}/api/seller/earnings`, {
      headers: { Cookie: sellerCookie },
    });
    const earningsData = await earningsRes.json();
    const expectedRemaining = verifiedPayment.sellerEarning - 500;
    if (Math.abs(earningsData.walletBalance - expectedRemaining) > 0.1) {
      throw new Error(`Wallet not decremented correctly: expected ~${expectedRemaining}, got ${earningsData.walletBalance}`);
    }

    return `Withdrawal #${firstWithdrawalId} created for ₹500. Remaining wallet balance: ₹${earningsData.walletBalance.toFixed(2)}`;
  });

  // ----------------------------------------------------
  // TEST CASE 7: Super Admin Approval & Auto-Refund Engine
  // ----------------------------------------------------
  await runner.run('7.1 Super Admin Rejects Withdrawal with Automatic Wallet Refund', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/withdrawals`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        id: firstWithdrawalId,
        status: 'REJECTED',
        adminNote: 'UPI verification test refund - please provide bank IFSC',
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reject withdrawal');

    // Check that seller wallet was automatically refunded ₹500
    const earningsRes = await fetch(`${BASE_URL}/api/seller/earnings`, {
      headers: { Cookie: sellerCookie },
    });
    const earningsData = await earningsRes.json();
    if (Math.abs(earningsData.walletBalance - verifiedPayment.sellerEarning) > 0.1) {
      throw new Error(`Wallet balance was not refunded: expected ~${verifiedPayment.sellerEarning}, got ${earningsData.walletBalance}`);
    }

    return `Withdrawal rejected by Admin. Atomic transaction automatically restored seller wallet to ₹${earningsData.walletBalance.toFixed(2)}`;
  });

  await runner.run('7.2 Seller Submits Valid Request & Admin Approves Payout', async () => {
    // Seller submits second withdrawal
    const reqRes = await fetch(`${BASE_URL}/api/seller/withdrawals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sellerCookie,
      },
      body: JSON.stringify({
        amount: 400,
        method: 'BANK',
        accountDetails: JSON.stringify({
          accountNumber: '9182374981273',
          ifsc: 'HDFC0001234',
          bankName: 'HDFC Bank',
        }),
      }),
    });
    const reqData = await reqRes.json();
    if (!reqRes.ok) throw new Error('Second withdrawal failed');
    secondWithdrawalId = reqData.withdrawal.id;

    // Super Admin approves
    const approveRes = await fetch(`${BASE_URL}/api/admin/withdrawals`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        id: secondWithdrawalId,
        status: 'COMPLETED',
        adminNote: 'UTR: NEFT-HDFC-991823712398 confirmed',
      }),
    });
    const approveData = await approveRes.json();
    if (!approveRes.ok) throw new Error('Failed to approve withdrawal');

    // Verify balance remains sellerEarning - 400
    const earningsRes = await fetch(`${BASE_URL}/api/seller/earnings`, {
      headers: { Cookie: sellerCookie },
    });
    const earningsData = await earningsRes.json();
    const expected = verifiedPayment.sellerEarning - 400;
    if (Math.abs(earningsData.walletBalance - expected) > 0.1) {
      throw new Error(`Expected balance ${expected}, got ${earningsData.walletBalance}`);
    }

    return `Payout #${secondWithdrawalId} marked COMPLETED. Seller balance accurately retained at ₹${earningsData.walletBalance.toFixed(2)}`;
  });

  // ----------------------------------------------------
  // TEST CASE 8: Super Admin Theming & Commission Slider
  // ----------------------------------------------------
  await runner.run('8.1 Super Admin Updates Commission Split via PATCH', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/commissions`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        platformPercent: 10,
        sellerPercent: 90,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update commission');
    return `Commission split adjusted: Platform: ${data.commission.platformPercent}%, Seller: ${data.commission.sellerPercent}%`;
  });

  await runner.run('8.2 Super Admin Updates Live Dynamic Theme Colors via PATCH', async () => {
    const newTheme = {
      primaryColor: '#6366F1',
      accentColor: '#10B981',
      bgDark: '#0B0F19',
      bgCard: 'rgba(17, 24, 39, 0.7)',
      borderRadius: '16px',
    };

    const res = await fetch(`${BASE_URL}/api/admin/theme`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify(newTheme),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update theme');

    // Verify public theme endpoint returns updated variables
    const getRes = await fetch(`${BASE_URL}/api/admin/theme`);
    const getData = await getRes.json();

    if (getData.primaryColor !== '#6366F1' || getData.accentColor !== '#10B981') {
      throw new Error(`Theme not applied: ${JSON.stringify(getData)}`);
    }

    return `Dynamic theme persisted: Primary ${getData.primaryColor}, Accent ${getData.accentColor}, Radius ${getData.borderRadius}`;
  });

  const allPassed = runner.summary();
  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test suite failed unexpectedly:', err);
  process.exit(1);
});
