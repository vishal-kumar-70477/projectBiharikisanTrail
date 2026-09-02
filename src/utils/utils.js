function generateOtp(){
    const otp = Math.floor(100000 + Math.random() * 999999);
    return otp;
}

function generateOtpHtml(otp){

    return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>Biharkisan - OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f5ef; font-family: Arial, Helvetica, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f5ef; padding:30px 0;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#2e7d32; padding:24px 32px;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="font-size:24px; font-weight:bold; color:#ffffff;">🌾 Biharkisan</span>
                  </td>
                  <td align="right">
                    <span style="font-size:13px; color:#d7ecd8;">Kisan ka Digital Sathi</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="color:#1b5e20; margin:0 0 10px 0; font-size:20px;">Namaste,</h2>
              <p style="color:#444444; font-size:15px; line-height:1.6; margin:0 0 25px 0;">
                Apna Biharkisan account verify karne ke liye niche diya gaya OTP (One Time Password) use karein. Yeh OTP agle <b>10 minute</b> tak valid hai.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <div style="display:inline-block; background-color:#e8f5e9; border:2px dashed #2e7d32; border-radius:8px; padding:18px 40px;">
                      <span style="font-size:32px; letter-spacing:10px; font-weight:bold; color:#1b5e20;">${otp}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color:#777777; font-size:13px; line-height:1.6; margin:25px 0 0 0;">
                Kripya yeh OTP kisi ke saath share na karein. Biharkisan team kabhi bhi call, SMS ya email par aapka OTP nahi puchti.
              </p>

              <p style="color:#777777; font-size:13px; line-height:1.6; margin:15px 0 0 0;">
                Agar yeh request aapne nahi ki hai, to is email ko ignore karein ya humse turant sampark karein.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f2f5ef; padding:20px 32px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#999999;">
                © 2026 Biharkisan. Sabhi adhikar surakshit.
              </p>
              <p style="margin:5px 0 0 0; font-size:12px; color:#999999;">
                Bihar ke kisano ke liye, kisano dwara.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}

module.exports = {generateOtp,generateOtpHtml}
