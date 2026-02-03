# Email Setup Instructions

## Step 1: Enable Email Sending

To enable real email sending, you need to configure a Gmail account:

### For Gmail:

1. **Go to your Google Account settings**: https://myaccount.google.com/

2. **Enable 2-Step Verification**:
   - Go to Security → 2-Step Verification
   - Turn it ON

3. **Generate an App Password**:
   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Shuttle Management System"
   - Click "Generate"
   - Copy the 16-character password

4. **Update `.env` file**:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  (the 16-digit app password)
```

## Step 2: Install Nodemailer

Run this command in the `server` folder:

```bash
npm install nodemailer
```

## Step 3: Restart Your Server

After updating `.env`, restart your Node.js server.

## Testing

Send a test OTP or booking confirmation to see if emails are working. If email fails, the system will automatically fall back to console logging.

---

## Alternative Email Services

You can also use:
- **SendGrid**: More reliable for production
- **Mailgun**: Good for bulk emails
- **AWS SES**: Cost-effective for large scale

Just update the transporter configuration in `server/utils/email.js`.
