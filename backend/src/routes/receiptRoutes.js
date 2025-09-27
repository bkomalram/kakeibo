const express = require('express');
const multer = require('multer');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Configura tus datos de Document AI
const projectId = '';
const location = 'us'; // o la región de tu procesador
const processorId = '';

const client = new DocumentProcessorServiceClient();

router.post('/process-receipt', upload.single('file'), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

    const request = {
      name,
      rawDocument: {
        content: imageBuffer,
        mimeType: req.file.mimetype,
      },
    };

    const [result] = await client.processDocument(request);
    const document = result.document;

    // Extrae campos relevantes (ajusta según tu modelo de Document AI)
    let description = '';
    let amount = '';
    let date = '';

    if (document.entities) {
      document.entities.forEach(entity => {
        if (entity.type === 'merchant_name') description = entity.mentionText;
        if (entity.type === 'total_amount') amount = entity.mentionText;
        if (entity.type === 'date') date = entity.mentionText;
      });
    }

    res.json({
      description,
      amount,
      date,
    });
  } catch (error) {
    console.error('Error procesando la imagen:', error);
    res.status(500).json({ error: 'Error procesando la imagen' });
  }
});

module.exports = router;