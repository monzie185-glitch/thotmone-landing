const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  const { name, email, company, message } = req.body || {};
  if (!name || !email || !message) {
    res.status(400).json({ error: "Champs requis manquants." });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_PORT) === "465",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Thotm One" <no-reply@thotmone.com>`,
      to: "contact@thotmone.com",
      subject: "Nouveau message — Thotm One (Landing)",
      replyTo: email,
      text: `Nom : ${name}
Email : ${email}
Entreprise : ${company || "-"}
-----------------------------
${message}`,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Erreur d’envoi :", error);
    res.status(500).json({ error: "Échec de l’envoi du message." });
  }
};

