import axios from "axios";

const PYTHON_SERVER_URL = "http://localhost:5001";

export const anonymizePDFWithPython = async (pdfBuffer) => {
  try {
    const formData = new FormData();
    formData.append("file", new Blob([pdfBuffer]), "document.pdf");

    const response = await axios.post(`${PYTHON_SERVER_URL}/anonymize`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.encrypted_pdf; 
  } catch (error) {
    console.error("Python anonimleştirme servisi hatası:", error);
    throw new Error("Anonimleştirme başarısız oldu.");
  }
};




export const decryptAnonymizedData = async (encryptedData) => {
  try {
    console.log(" Gelen şifreli veri (ilk 100 karakter):", encryptedData.slice(0, 100) + "...");

    if (Buffer.isBuffer(encryptedData)) {
      encryptedData = encryptedData.toString('utf-8');
    }
    const base64Pattern = /^[A-Za-z0-9+/=]+={0,2}$/;
    if (!base64Pattern.test(encryptedData.trim())) {
      console.error(" Hata: Gelen veri Base64 formatında değil.");
      throw new Error("Şifrelenmiş veri Base64 formatında değil.");
    }

    const response = await axios.post(`${PYTHON_SERVER_URL}/decrypt`, {
      encrypted_pdf: encryptedData.trim(),
    });

    if (!response.data || !response.data.decrypted_pdf) {
      console.error(" Beklenmeyen yanıt formatı:", response.data);
      throw new Error("Geçersiz şifrelenmiş veri, Python servisi hatalı yanıt verdi.");
    }

    console.log(" Decryption başarılı, Base64 boyutu:", response.data.decrypted_pdf.length);
    return Buffer.from(response.data.decrypted_pdf, "base64");
  } catch (error) {
    console.error(" Decryption error:", error);
    throw new Error("Anonimleştirilmiş veriyi çözme başarısız oldu.");
  }
};
