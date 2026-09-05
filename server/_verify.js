const mongoose = require('mongoose');
(async () => {
  await mongoose.connect('mongodb+srv://admin:9505Puji23@cluster0.l25tfzi.mongodb.net/?appName=Cluster0', { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const r = await db.collection('warehouses').updateMany(
    { name: { $in: ['nishi', 'sweety', 'Pavan warehouse'] } },
    { $set: { verificationStatus: 'verified' } }
  );
  console.log('Updated', r.modifiedCount, 'warehouses to verified');
  await mongoose.disconnect();
})().catch(e => { console.log('ERR', e.message.split('.')[0]); process.exit(1); });
