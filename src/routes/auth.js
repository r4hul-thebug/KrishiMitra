import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as store from '../db/store.js';

export const auth = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'krishimitraaz-secure-farmer-portal-token-2026';

auth.post('/register', async (req, res) => {
  const { name, officialId, password, crop, sowingDate, landAcres, location, language, yieldHistory, village, state } = req.body;

  if (!officialId || !password || !name) {
    return res.status(400).json({ error: 'name, officialId, and password are required' });
  }

  const existingFarmer = await store.getFarmerByOfficialId(officialId);
  if (existingFarmer) {
    return res.status(400).json({ error: 'Farmer with this Official ID already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let parsedLocation = { lat: 28.61, lon: 77.20 };
  if (location && typeof location === 'object') {
    const lat = parseFloat(location.lat ?? location.latitude);
    const lon = parseFloat(location.lon ?? location.longitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      parsedLocation = { lat: Number(lat.toFixed(4)), lon: Number(lon.toFixed(4)) };
    }
  }

  const farmer = await store.createFarmer({
    name,
    officialId,
    password: hashedPassword, // Store securely encrypted password
    crop: crop || 'wheat',
    sowingDate: sowingDate || null,
    landAcres: landAcres ? parseFloat(landAcres) : 1,
    location: parsedLocation,
    village: village || null,
    state: state || null,
    language: language || 'hi',
    yieldHistory: yieldHistory || [],
  });

  const token = jwt.sign({ id: farmer.id }, JWT_SECRET, { expiresIn: '7d' });
  
  // Omit password from response
  const { password: _, ...farmerData } = farmer;
  res.status(201).json({ token, farmer: farmerData });
});

auth.post('/login', async (req, res) => {
  const { officialId, password } = req.body;

  if (!officialId || !password) {
    return res.status(400).json({ error: 'officialId and password are required' });
  }

  const farmer = await store.getFarmerByOfficialId(officialId);
  
  if (!farmer) {
    return res.status(401).json({ error: 'Invalid credentials (user not found)' });
  }

  const isMatch = await bcrypt.compare(password, farmer.password);
  
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials (password mismatch)' });
  }

  const token = jwt.sign({ id: farmer.id }, JWT_SECRET, { expiresIn: '7d' });
  
  const { password: _, ...farmerData } = farmer;
  res.json({ token, farmer: farmerData });
});

