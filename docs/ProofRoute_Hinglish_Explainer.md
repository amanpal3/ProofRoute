# ProofRoute - Hinglish Presentation

## Slide 1: ProofRoute

ProofRoute ek document verification platform hai.

- Frontend user ko portal deta hai.
- Backend verification process ko coordinate karta hai.
- ML document tampering aur risk analyze karta hai.
- Blockchain document hash ka immutable proof rakhta hai.

## Slide 2: Problem aur Solution

Documents jaise certificate, invoice aur Bill of Lading edit ho sakte hain. Manual checking slow hoti hai.

ProofRoute:

1. File ka SHA-256 hash banata hai.
2. Blockchain record se hash compare karta hai.
3. ML OCR, ELA aur Copy-Move signals check karta hai.
4. User ko status, score aur reasons dikhata hai.

## Slide 3: End-to-End Flow

`Upload -> Hash -> Backend -> ML -> Blockchain Check -> Result`

Result mein `VALID`, `TAMPERED`, `NOT_REGISTERED`, risk score aur explainable reasons milte hain.

## Slide 4: Frontend

Next.js frontend ka kaam:

- Drag-and-drop document upload.
- Browser mein SHA-256 hashing.
- Product ID lookup.
- Verification result card.
- Risk score, confidence, ELA aur CMFD display.
- Forensics heatmap view.
- Issuer aur logistics dashboards.

## Slide 5: Backend

FastAPI backend ka kaam:

- Request, file type aur size validate karna.
- Server-side SHA-256 calculate karna.
- Blockchain aur database lookup karna.
- Uploaded bytes ML pipeline ko dena.
- ML result ko response schema mein return karna.
- ML unavailable hone par fallback heuristic use karna.

## Slide 6: ML

ML authenticity ka final proof nahi hai. Ye decision-support signal hai.

- OCR: text aur numbers ko analyze karta hai.
- ELA: compression/editing anomaly detect karta hai.
- Copy-Move: repeated regions, stamp ya seal duplication ka signal.
- Risk scorer: signals ko combine karke `0-100` score banata hai.
- Output: risk level, confidence aur reasons.

## Slide 7: Blockchain aur Database

- Blockchain: authoritative proof. Hash aur issuer record immutable hota hai.
- Database: fast application projection. Products, events aur history ke liye.
- Database blockchain ka replacement nahi hai.

## Slide 8: India Demo

### PR-IND-1001 - Authentic

- Pune medical devices.
- Origin: Pimpri-Chinchwad, Pune.
- Destination: Jebel Ali, Dubai.
- Risk: LOW, score 8.5.

### PR-IND-2002 - Tampered

- Surat cotton shipment.
- Origin: Surat, Gujarat.
- Checkpoint: Nhava Sheva, Navi Mumbai.
- Risk: HIGH, score 82.0.

## Slide 9: Security

- Hash match cryptographic proof hai.
- ML score probabilistic hai; absolute fraud proof nahi.
- Private document contents blockchain par store nahi hote.
- Uploaded files ko size, MIME type aur path se validate karna hota hai.

## Slide 10: Run Demo

```powershell
Set-Location backend
python -m uvicorn app.main:app --reload --port 8000
```

Second terminal:

```powershell
Set-Location frontend
npm run dev
```

Open: `http://localhost:3000/forensics`

Try IDs: `PR-IND-1001` and `PR-IND-2002`

## One-Line Summary

Frontend dikhaata hai, Backend coordinate karta hai, ML analyze karta hai, aur Blockchain proof rakhta hai.
