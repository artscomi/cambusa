import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const groupId = uuidv4();
    res.status(200).json({ groupId });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}