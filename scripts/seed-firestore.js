#!/usr/bin/env node
/*
  Seed the staging Firestore `blogs` collection with mock blog posts.
  Uses the client Firebase SDK and the staging config from firebase/firebase.config.ts.

  Notes:
  - This writes to the real staging project (wiof-modern-staging). Be sure you want that.
  - If Firestore rules require auth, this script may fail with PERMISSION_DENIED.
    In that case, provide a service account or run the script in an authenticated context.
*/
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } = require('firebase/firestore');
const fs = require('fs');
// firebase/firebase.config.ts is a TS file; read and extract values instead of requiring it
const cfgPath = require('path').resolve(__dirname, '..', 'firebase', 'firebase.config.ts');
if (!fs.existsSync(cfgPath)) {
  console.error('Could not find firebase config at', cfgPath);
  process.exit(1);
}
const raw = fs.readFileSync(cfgPath, 'utf8');
function extract(key) {
  const re = new RegExp(key + "\\s*:\\s*[\"\\']([^\"\\']+)[\"\\']");
  const m = raw.match(re);
  return m ? m[1] : undefined;
}
const firebaseConfig = {
  apiKey: extract('apiKey'),
  authDomain: extract('authDomain'),
  databaseURL: extract('databaseURL'),
  projectId: extract('projectId'),
  storageBucket: extract('storageBucket'),
  messagingSenderId: extract('messagingSenderId'),
  appId: extract('appId'),
  measurementId: extract('measurementId')
};

async function run() {
  console.log('Initializing Firebase app with project:', firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const blogsRef = collection(db, 'blogs');

  const mockAuthors = [
    { name: 'Dr. Emma Rivers', avatar: 'https://i.pravatar.cc/150?u=emma', bio: 'Environmental Scientist' },
    { name: 'Alex Forest', avatar: 'https://i.pravatar.cc/150?u=alex', bio: 'Climate Researcher' },
    { name: 'Maria Wind', avatar: 'https://i.pravatar.cc/150?u=maria', bio: 'Sustainability Expert' },
  ];

  const elements = ['earth','water','fire','air','space'];

  console.log('Seeding 8 mock blog posts...');
  for (let i = 0; i < 8; i++) {
    const item = {
      title: `Seeded: Understanding the ${elements[i % elements.length]} Element (${i + 1})`,
      slug: `seeded-understanding-${elements[i % elements.length]}-${i+1}`,
      excerpt: 'This is seeded mock content for testing the blog listing and detail pages.',
      content: 'Full seeded article content for integration testing. Remove after QA.',
      heroUrl: `https://picsum.photos/seed/seed${i}/1200/600`,
      publishedAt: new Date(Date.now() - i * 24 * 3600 * 1000).toISOString(),
      author: mockAuthors[i % mockAuthors.length],
      tags: ['sustainability','seeded'],
      element: elements[i % elements.length],
      readTime: 4 + (i % 6),
      featured: i % 3 === 0
    };

    try {
      const docRef = await addDoc(blogsRef, { ...item, createdAt: serverTimestamp() });
      console.log('Wrote blog doc:', docRef.id);
    } catch (err) {
      console.error('Failed to write blog doc:', err && err.message ? err.message : err);
      console.error('Aborting seeding. Check Firestore rules and authentication.');
      process.exit(1);
    }
  }

  console.log('Seed complete. Fetching latest 5 documents to verify...');
  try {
    const q = query(blogsRef, orderBy('publishedAt','desc'), limit(5));
    const snap = await getDocs(q);
    snap.forEach(doc => console.log(doc.id, doc.data().title));
  } catch (err) {
    console.error('Failed to query blogs after seed:', err && err.message ? err.message : err);
  }

  console.log('Done.');
  process.exit(0);
}

run();
