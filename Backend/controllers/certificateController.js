const prisma = require('../config/prismaClient');

exports.createCertificate = async (req, res) => {
    try {
        const item = await prisma.certificate.create({ data: req.body });
        res.status(201).json({ message: 'Certificate created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating certificate' });
    }
};

exports.getAllCertificates = async (req, res) => {
    try {
        const items = await prisma.certificate.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching certificates' });
    }
};

exports.getCertificateById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.certificate.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Certificate not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching certificate' });
    }
};

exports.updateCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.certificate.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Certificate updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating certificate' });
    }
};

exports.deleteCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.certificate.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting certificate' });
    }
};
