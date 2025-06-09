const fs = require('fs-extra');
const path = require('path');
const { Document, Packer, Paragraph, TextRun } = require('docx');

async function generateAgreementFile({ clientName, ownerName, propertyTitle, startDate, endDate, totalPrice, fileName }) {
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ text: 'ДОГОВОР АРЕНДЫ', heading: "TITLE", spacing: { after: 300 } }),

                new Paragraph(`Арендодатель: ${ownerName}`),
                new Paragraph(`Арендатор: ${clientName}`),
                new Paragraph(`Объект аренды: ${propertyTitle}`),
                new Paragraph(`Срок аренды: с ${startDate} по ${endDate}`),
                new Paragraph(`Стоимость: ${totalPrice} руб.`),

                new Paragraph({
                    children: [
                        new TextRun({ text: "\nПодписи сторон:", bold: true }),
                        new TextRun("\nАрендодатель: ___________"),
                        new TextRun("\nАрендатор: ___________"),
                    ]
                }),
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(__dirname, '../static/', fileName);
    await fs.writeFile(filePath, buffer);

    return fileName;
}

module.exports = generateAgreementFile;
