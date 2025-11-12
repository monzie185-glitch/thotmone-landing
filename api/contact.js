// api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { name, email, company, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  try {
    // 🔧 Configuration du transport SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 📤 Envoi de l’email
    await transporter.sendMail({
      from: `"Thotm One" <no-reply@thotmone.com>`,
      to: "contact@thotmone.com",
      subject: "Nouveau message — Thotm One (Landing)",
      replyTo: email,
      text: `
Nom : ${name}
Email : ${email}
Entreprise : ${company || "-"}
-----------------------------
${message}
      `,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Erreur d’envoi :", error);
    res.status(500).json({ error: "Échec de l’envoi du message." });
  }
}
