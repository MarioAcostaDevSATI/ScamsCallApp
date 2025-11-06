import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import clientPromise from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'POST') {
    try {
      const report = {
        ...req.body,
        reporterId: session.user.id,
        timestamp: new Date(),
        status: 'pendiente',
      };

      const result = await db.collection('reports').insertOne(report);
      
      res.status(201).json({
        success: true,
        reportId: result.insertedId,
        message: 'Reporte creado exitosamente'
      });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else if (req.method === 'GET') {
    try {
      const { phoneNumber, page = '1', limit = '10' } = req.query;
      
      let query = {};
      if (phoneNumber) {
        query = { phoneNumber: { $regex: phoneNumber, $options: 'i' } };
      }

      const reports = await db
        .collection('reports')
        .find(query)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit as string))
        .skip((parseInt(page as string) - 1) * parseInt(limit as string))
        .toArray();

      const total = await db.collection('reports').countDocuments(query);

      res.status(200).json({
        reports,
        total,
        page: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
