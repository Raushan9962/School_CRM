const prisma = require('../config/prismaClient');

exports.createFee = async (req, res) => {
    try {
        const { studentId, amount, dueDate, status, paymentMethod, paidAmount } = req.body;
        const fee = await prisma.fee.create({
            data: { 
                studentId, 
                amount, 
                dueDate: new Date(dueDate), 
                status, 
                paymentMethod,
                paidAmount: paidAmount || 0
            }
        });
        res.status(201).json({ message: 'Fee record created successfully', fee });
    } catch (error) {
        res.status(500).json({ error: 'Error creating fee record' });
    }
};

exports.getAllFees = async (req, res) => {
    try {
        const fees = await prisma.fee.findMany({ include: { student: true } });
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fees' });
    }
};

exports.getFeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const fee = await prisma.fee.findUnique({
            where: { id: parseInt(id) },
            include: { student: true }
        });
        if (!fee) return res.status(404).json({ error: 'Fee record not found' });
        res.status(200).json(fee);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fee details' });
    }
};

exports.updateFee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);

        const fee = await prisma.fee.update({
            where: { id: parseInt(id) },
            data: updates
        });
        res.status(200).json({ message: 'Fee record updated successfully', fee });
    } catch (error) {
        res.status(500).json({ error: 'Error updating fee record' });
    }
};

exports.deleteFee = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.fee.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Fee record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting fee record' });
    }
};
