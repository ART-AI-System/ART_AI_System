const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const crypto = require('crypto');

dotenv.config({ path: path.join(__dirname, '../../backend/.env') });

const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@art-ai-system.rpdlfxc.mongodb.net/`;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const submissions = db.collection('submissions');
    
    // Find submissions without fileStorageKey
    const missingKeys = await submissions.find({
      $or: [
        { fileStorageKey: { $exists: false } },
        { fileStorageKey: null },
        { fileStorageKey: "" }
      ]
    }).toArray();
    
    console.log(`Found ${missingKeys.length} submissions needing local files.`);
    
    const uploadsDir = path.join(__dirname, '../../backend/uploads/submissions');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const dummyTxtPath = path.join(uploadsDir, 'dummy.txt');
    fs.writeFileSync(dummyTxtPath, 'This is a seeded submission dummy file.');

    for (const sub of missingKeys) {
      const uuid = crypto.randomUUID();
      const ext = path.extname(sub.fileName) || '.zip';
      const storageFileName = `${uuid}${ext}`;
      const fileStorageKey = `uploads/submissions/${storageFileName}`;
      const absolutePath = path.join(uploadsDir, storageFileName);

      if (ext.toLowerCase() === '.zip') {
        // Create a zip file
        console.log(`Creating zip file: ${absolutePath}`);
        try {
          execSync(`powershell Compress-Archive -Path "${dummyTxtPath}" -DestinationPath "${absolutePath}" -Force`);
        } catch (e) {
          console.error(`Failed to create zip file: ${e.message}`);
          continue;
        }
      } else {
        // Just copy the text file
        console.log(`Creating text file: ${absolutePath}`);
        fs.copyFileSync(dummyTxtPath, absolutePath);
      }

      // Update DB
      await submissions.updateOne(
        { _id: sub._id },
        { $set: { fileStorageKey: fileStorageKey, uuid: uuid } }
      );
      console.log(`Updated DB for submission ${sub._id} with key ${fileStorageKey}`);
    }
    
    // Cleanup
    if (fs.existsSync(dummyTxtPath)) fs.unlinkSync(dummyTxtPath);

    console.log('Seeding setup complete.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
