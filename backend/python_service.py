from flask import Flask, request, jsonify
import io
import base64
from cryptography.fernet import Fernet
import fitz
import spacy
import re
import cv2
import numpy as np

app = Flask(__name__)


nlp = spacy.load("en_core_web_trf")

key = b"7h9jIS_M9KaxHzFAoBuLHmVWBCJ_LiVnmz5u1IUpEYM="
cipher = Fernet(key)

def anonymize_text(text, section_titles):
   
    doc = nlp(text)
    anonymized_text = text
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "ORG"]:  
            if not any(title in text for title in section_titles):
                anonymized_text = anonymized_text.replace(ent.text, "[***]")
  
    anonymized_text = re.sub(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", "[***]", anonymized_text)
    anonymized_text = re.sub(r"\+?\d{1,3}[-.\s]?\(?\d{2,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}", "[***]", anonymized_text)
    return anonymized_text

def anonymize_pdf(pdf_bytes):
   
    pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
    section_titles = ["INTRODUCTION", "MATERAILS", "METHODS", "METHODOLOGY", "RESULTS", "REFERENCES", "ACKNOWLEDGMENT", "CONCLUSION", "RELATED WORK", "WORK"]
    for page in pdf_document:
        text = page.get_text("text")
       
        anonymized_text = anonymize_text(text, section_titles)

     
        email_rects = page.search_for(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
        for rect in email_rects:
            
            expanded_rect = fitz.Rect(rect.x0 - 50, rect.y0, rect.x1 + 50, rect.y1)
            page.draw_rect(expanded_rect, color=(1, 1, 1), fill=(1, 1, 1))  

     
        phone_rects = page.search_for(r"\+?\d{1,3}[-.\s]?\(?\d{2,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}")
        for rect in phone_rects:
            
            expanded_rect = fitz.Rect(rect.x0 - 50, rect.y0, rect.x1 + 50, rect.y1)
            page.draw_rect(expanded_rect, color=(1, 1, 1), fill=(1, 1, 1)) 

     
        doc = nlp(text)
        for ent in doc.ents:
            if ent.label_ in ["PERSON", "ORG"]:
                rects = page.search_for(ent.text)
                for rect in rects:
                    page.add_redact_annot(rect)
                    for img in page.get_images(full=True):
                       
                        if isinstance(img[7], (list, tuple)):
                            img_rect = fitz.Rect(img[7])
                            if rect.intersects(img_rect): 
                                xref = img[0]
                                base_image = pdf_document.extract_image(xref)
                                image_bytes = base_image["image"]
                                image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
                                blurred_image = cv2.GaussianBlur(image, (51, 51), 0)
                                page.replace_image(xref, stream=cv2.imencode('.png', blurred_image)[1].tobytes())
                        else:
                            continue 
        page.apply_redactions()

    output_pdf = io.BytesIO()
    pdf_document.save(output_pdf)
    output_pdf.seek(0)
    return output_pdf.getvalue()

def decrypt_pdf(encrypted_pdf_bytes):
  
    decrypted_pdf = cipher.decrypt(encrypted_pdf_bytes)
    return decrypted_pdf

@app.route('/anonymize', methods=['POST'])
def anonymize_and_encrypt_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "PDF dosyası yüklenmedi"}), 400
    pdf_file = request.files['file'].read()
    anonymized_pdf = anonymize_pdf(pdf_file)
    encrypted_pdf = cipher.encrypt(anonymized_pdf)
    return jsonify({"encrypted_pdf": base64.b64encode(encrypted_pdf).decode('utf-8')})

@app.route('/decrypt', methods=['POST'])
def decrypt_and_serve_pdf():
   
    if 'encrypted_pdf' not in request.json:
        return jsonify({"error": "Şifreli PDF verisi eksik"}), 400
    encrypted_pdf_b64 = request.json['encrypted_pdf']
    encrypted_pdf = base64.b64decode(encrypted_pdf_b64)  
    decrypted_pdf = decrypt_pdf(encrypted_pdf)
    return jsonify({
        "decrypted_pdf": base64.b64encode(decrypted_pdf).decode('utf-8')
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)