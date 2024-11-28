import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const products = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
      }
      break;

    case 'POST':
      try {
        const { name, price, description } = req.body;
        const newProduct = await prisma.product.create({
          data: { name, price: parseFloat(price), description },
        });
        res.status(201).json(newProduct);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
      }
      break;

    case 'PUT':
      try {
        const { id, name, price, description } = req.body;
        const updatedProduct = await prisma.product.update({
          where: { id: parseInt(id) },
          data: { name, price: parseFloat(price), description },
        });
        res.status(200).json(updatedProduct);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
