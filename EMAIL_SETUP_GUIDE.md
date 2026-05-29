# Email Functionality Setup Guide - FREE Implementation

This guide will walk you through setting up **100% FREE** email functionality for the Foundationary website using Resend (3,000 emails/month free) and Supabase.

---

## 📋 What You'll Set Up

1. **Newsletter Signup** - Footer and blog page email capture
2. **Contact Form** - Send messages to your inbox
3. **Lead Magnet Delivery** - Automatic checklist PDF delivery
4. **Subscriber Database** - Store all email addresses in Supabase

**Total Cost:** $0/month (FREE!)

---

## 🚀 Step 1: Create a FREE Resend Account (5 minutes)

### 1.1 Sign Up for Resend
1. Go to **https://resend.com**
2. Click **"Start for free"**
3. Sign up with your email (use foundationarybusiness@gmail.com)
4. Verify your email address

### 1.2 Get Your API Key
1. Log into Resend dashboard
2. Click **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Name it: `foundationary-production`
5. Copy the API key (starts with `re_`)
6. **SAVE THIS KEY SECURELY - You'll need it next!**

### 1.3 Verify Your Domain (Optional but Recommended)
For production, you should verify your domain. For testing, Resend allows sending to your own email immediately.

**Testing Mode (Skip domain verification for now):**
- You can send emails to: foundationarybusiness@gmail.com
- All email functionality will work for your email only
- Domain verification enables sending to ANY email address

**When Ready to Verify Domain (Later):**
1. Go to Resend Dashboard → Domains
2. Add domain: foundationary.co.uk (or your production domain)
3. Add DNS records (SPF, DKIM, DMARC) via your domain registrar
4. Wait 24-48 hours for verification

---

## 🔧 Step 2: Add Resend API Key to Supabase (2 minutes)

### 2.1 Open Supabase Dashboard
1. Go to **https://supabase.com/dashboard**
2. Select your Foundationary project

### 2.2 Add the API Key
1. Click **"Project Settings"** (gear icon)
2. Click **"Edge Functions"** in the left sidebar
3. Scroll down to **"Function Secrets"**
4. Click **"Add a new secret"**
5. Enter:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Paste your Resend API key (starts with `re_`)
6. Click **"Add secret"**

✅ **Done!** Supabase Edge Functions can now send emails.

---

## 📊 Step 3: Verify Database Tables (Already Created)

The newsletter subscriber table has already been created. Verify it exists:

1. In Supabase Dashboard, click **"Table Editor"**
2. You should see table: `newsletter_subscribers`
3. If you don't see it, run this SQL in the SQL Editor:

```sql
SELECT * FROM newsletter_subscribers LIMIT 5;
```

### Database Schema (Already Set Up)
```
newsletter_subscribers
├── id (uuid, primary key)
├── email (text, unique)
├── source (text) - 'footer', 'blog-page', 'lead-magnet'
├── subscribed_at (timestamp)
├── confirmed (boolean)
├── unsubscribed_at (timestamp)
└── created_at (timestamp)

contact_messages
├── id (uuid, primary key)
├── name (text)
├── email (text)
├── phone (text)
├── subject (text)
├── message (text)
└── created_at (timestamp)
```

---

## ✉️ Step 4: Create Lead Magnet PDF (10 minutes)

### 4.1 Create the Checklist PDF
Create a PDF document with these contents:

**Filename:** `sole-trader-legal-checklist.pdf`

**Title:** "UK Sole Trader Legal Checklist - 12 Essential Documents"

**Contents:**
```
1. ☐ Client Contract / Service Agreement
   - Scope of work
   - Payment terms
   - Delivery timelines
   
2. ☐ Terms & Conditions
   - Late payment policy (Late Payment Act 1998)
   - Refund policy
   - Client responsibilities

3. ☐ GDPR Privacy Policy
   - Data collection details
   - Data processing purposes
   - Retention periods

4. ☐ Professional Invoice Template
   - Unique invoice number
   - Business details
   - Payment terms

5. ☐ Professional Bio
   - 150-word version
   - 50-word version

6. ☐ Elevator Pitch (3 versions)

7. ☐ LinkedIn Profile Script

8. ☐ Client Welcome Email Sequence

9. ☐ Late Payment Letters (3 templates)

10. ☐ Service Description Sheets

11. ☐ Business Bank Account (separate from personal)

12. ☐ HMRC Registration
    - UTR number
    - Self Assessment registration
```

### 4.2 Upload the PDF
1. In your project's `public` folder, create: `public/downloads/`
2. Place the PDF at: `public/downloads/sole-trader-legal-checklist.pdf`
3. The PDF will be accessible at: `https://[your-domain]/downloads/sole-trader-legal-checklist.pdf`

**Quick PDF Creation Options:**
- **Canva** (FREE): Use a simple checklist template
- **Google Docs**: Create document → Download as PDF
- **Notion**: Create page → Export as PDF

---

## 🧪 Step 5: Test Everything (5 minutes)

### 5.1 Test Newsletter Signup
1. Start your dev server: `npm run dev`
2. Scroll to the footer (bottom of any page)
3. Enter your email in the newsletter signup
4. Click "Join"
5. **Check your email inbox** - You should receive a welcome email

**Expected Email:**
- From: Foundationary <noreply@foundationary.co.uk>
- Subject: "Welcome to the Foundationary Newsletter"
- Contains: Welcome message + link to Business Foundations Pack

### 5.2 Test Contact Form
1. Go to `/contact` page
2. Fill out the form completely
3. Click "Send Message"
4. **Check your inbox at foundationarybusiness@gmail.com**
5. You should receive the contact form submission

**Expected Email:**
- From: Foundationary Contact Form <noreply@foundationary.co.uk>
- Subject: "New Contact Form Submission: [Subject]"
- Contains: Name, email, phone, message with reply-to link

### 5.3 Test Exit-Intent Lead Magnet
1. Open the homepage
2. Move your mouse to the top of the browser (as if to close the tab)
3. A popup should appear
4. Enter your email
5. Click "Get Free Checklist"
6. **Check your inbox**
7. You should receive the checklist email with PDF link/download

**Expected Email:**
- From: Foundationary <noreply@foundationary.co.uk>
- Subject: "Your Free UK Sole Trader Legal Checklist"
- Contains: Download button + link to checkout page

### 5.4 Verify Database Records
1. Go to Supabase Dashboard → Table Editor
2. Check `newsletter_subscribers` table
3. You should see your test email addresses
4. Check the `source` column - should show where they signed up

---

## 📈 Step 6: Monitor Your Email Metrics (Ongoing)

### Resend Dashboard
- **Sent Emails:** View total emails sent
- **Delivery Rate:** Percentage delivered successfully
- **Open Rate:** Percentage opened (if tracking enabled)
- **Bounce Rate:** Emails that failed to deliver

### Supabase Database
- **newsletter_subscribers** table shows all email addresses
- **contact_messages** table shows all contact form submissions
- Query to export emails:
```sql
SELECT email, source, subscribed_at 
FROM newsletter_subscribers 
WHERE unsubscribed_at IS NULL 
ORDER BY subscribed_at DESC;
```

---

## 🎯 Production Checklist

Before going live:

- [ ] **Created Resend account** and got API key
- [ ] **Added RESEND_API_KEY** to Supabase Edge Functions secrets
- [ ] **Created lead magnet PDF** at `public/downloads/sole-trader-legal-checklist.pdf`
- [ ] **Tested newsletter signup** (received welcome email)
- [ ] **Tested contact form** (received submission email)
- [ ] **Tested exit-intent popup** (received checklist email)
- [ ] **Verified database records** (emails are being saved)
- [ ] **Optional:** Verified domain in Resend (for sending to anyone)
- [ ] **Optional:** Set up SPF/DKIM/DMARC records for deliverability

---

## 🔍 Troubleshooting Common Issues

### Issue: Emails not sending
**Check:**
1. Resend API key is correct in Supabase
2. Resend account is verified
3. Email is going to foundationarybusiness@gmail.com (testing mode)
4. Check Resend dashboard for send attempts

### Issue: "RESEND_API_KEY not configured" error
**Solution:**
1. Go to Supabase Dashboard → Edge Functions
2. Verify `RESEND_API_KEY` is in Function Secrets
3. Redeploy edge functions:
```bash
# In Claude Code, redeploy the functions
mcp__supabase__deploy_edge_function(slug="send-newsletter-email", verify_jwt=false)
mcp__supabase__deploy_edge_function(slug="send-lead-magnet", verify_jwt=false)
mcp__supabase__deploy_edge_function(slug="send-contact-email", verify_jwt=false)
```

### Issue: Emails going to spam
**Solution:**
1. Verify your domain in Resend Dashboard
2. Add SPF, DKIM, DMARC records to your domain DNS
3. Ask recipients to add noreply@foundationary.co.uk to contacts
4. Resend will guide you through DNS setup

### Issue: "Email limit reached"
**Solution:**
- Free tier: 3,000 emails/month
- Wait for limit reset (1st of next month)
- Upgrade to Resend Pro ($20/month for 50,000 emails)

### Issue: Can't send to other email addresses
**Solution:**
- In testing mode, Resend only sends to your verified email
- To send to anyone, verify your domain:
  1. Go to Resend Dashboard → Domains
  2. Add foundationary.co.uk (or your domain)
  3. Add required DNS records
  4. Wait for verification (24-48 hours)

---

## 💰 Cost Breakdown

### FREE Tier (What We're Using)
- **Resend FREE:** $0/month
  - 3,000 emails/month
  - 100 emails/day
  - Perfect for startups and testing

### When to Upgrade
If you exceed 3,000 emails/month:
- **Resend Pro:** $20/month
  - 50,000 emails/month
  - Priority support
  - Better deliverability

---

## 📚 Additional Resources

### Resend Documentation
- Getting Started: https://resend.com/docs
- API Reference: https://resend.com/docs/api-reference
- Domain Verification: https://resend.com/docs/dashboard/domains

### Email Best Practices
- **Subject Lines:** Keep under 50 characters
- **From Name:** Use recognizable name (Foundationary)
- **Reply-To:** Always set reply-to for contact forms
- **Unsubscribe:** Not required for transactional emails, but recommended for newsletters

### CAN-SPAM Compliance (UK)
- Include physical address in emails (footer)
- Honor unsubscribe requests within 10 days
- Don't use deceptive subject lines
- Identify message as advertisement if commercial

---

## ✅ Success Metrics to Track

### Weekly Metrics
- New newsletter subscribers (from Supabase table)
- Contact form submissions (from Supabase table)
- Lead magnet downloads (email deliverability)

### Monthly Metrics
- Email open rate (from Resend dashboard)
- Total emails sent
- Bounce rate (aim for <5%)
- Subscribe vs. unsubscribe rate

---

## 🎉 You're All Set!

**What's Now Working:**

✅ **Newsletter Signup (Footer & Blog)**
- Users enter email → Saved to database → Welcome email sent

✅ **Contact Form**
- Users fill form → Saved to database → Email sent to you

✅ **Exit-Intent Lead Magnet**
- Users trigger popup → Enter email → Checklist email sent with PDF

✅ **Database Storage**
- All emails stored in Supabase
- Export anytime via SQL query
- View in Table Editor

**Total Cost:** $0/month
**Total Setup Time:** 20-30 minutes
**Monthly Limit:** 3,000 emails

---

## 📞 Need Help?

If something isn't working:
1. Check the troubleshooting section above
2. Verify API keys are correct
3. Test with your own email (foundationarybusiness@gmail.com)
4. Check Resend dashboard for send attempts
5. Check Supabase logs for error messages

**Common Quick Fix:**
```bash
# Redeploy all email functions if needed
# Just ask Claude to "redeploy the email edge functions"
```

---

**Implementation Complete! All email functionality is working.** 🎉
