# Document Anonymization

This is a full-stack web application for uploading, anonymizing, and peer-reviewing academic papers. It helps editorial teams to securely remove sensitive information from submitted documents to ensure double-blind peer review.

---


##  Features

-  **PDF Upload** with author name, article title, and email
-  **Automatic Anonymization** of author name, email, affiliation, and contact info
-  **Blind Review System**: Assign reviewers without exposing author identity
-  **Reviewer Panel** for comment submission and evaluation
-  View both **original** and **anonymized** versions
-  Unique tracking ID for article status queries
-  Admin and referee interfaces with dynamic assignment logic

---

##  Technologies Used

- **Frontend:** HTML, CSS, React.js, Bootstrap  
- **Backend:** Node.js (Express)  
- **Database:** MongoDB  
- **PDF Processing:** `pdf-lib`, `pdfjs`, `regex-based anonymization`  
- **Advanced Anonymization (Python):** spaCy, re (regex), PyPDF2 for enhanced NLP-based anonymization  

> **Note:** Python scripts are integrated to improve entity recognition and anonymization quality, specifically targeting sensitive elements such as author names, institutions, and emails.

---

##  Anonymization Logic

- Removes or masks:
  - Author full name(s)
  - Institution/affiliation
  - Email addresses
- Ignores anonymization in these sections:
  - Introduction
  - Related Work
  - References
  - Acknowledgement

---

##  Workflow

1. Author uploads a paper
2. The system automatically anonymizes the file
3. Admin assigns available reviewers
4. Reviewers access anonymized version and submit comments
5. Admin views feedback and makes decisions

---

##  Getting Started

1. Clone the repository
2. Run `npm install` in both `/frontend` and `/backend`
3. Create a `.env` file in `/backend` with MongoDB URI and PORT
4. Start backend:
```bash
cd frontend
npm run dev
cd ..
cd backend
npm start
