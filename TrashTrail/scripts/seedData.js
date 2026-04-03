const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["citizen", "collector", "admin"], default: "citizen" },
  phone: String,
  address: String,
  ward: String,
  greenScore: { type: Number, default: 0 },
  totalWasteRecycled: { type: Number, default: 0 },
  carbonSaved: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const WasteBagSchema = new Schema({
  qrCode: { type: String, unique: true },
  citizenId: { type: Schema.Types.ObjectId, ref: "User" },
  collectorId: { type: Schema.Types.ObjectId, ref: "User" },
  wasteType: String,
  weightAtSource: Number,
  weightAtCollection: Number,
  weightAtFacility: Number,
  status: { type: String, enum: ["created", "collected", "in_transit", "at_facility", "processed", "recycled"], default: "created" },
  photoUrl: String,
  anomalyFlag: { type: Boolean, default: false },
  anomalyReason: String,
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    location: { lat: Number, lng: Number },
    note: String,
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AnomalySchema = new Schema({
  wasteBagId: { type: Schema.Types.ObjectId, ref: "WasteBag" },
  collectorId: { type: Schema.Types.ObjectId, ref: "User" },
  type: String, 
  description: String,
  severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["detected", "investigating", "resolved"], default: "detected" },
  resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  resolvedNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ComplaintSchema = new Schema({
  citizenId: { type: Schema.Types.ObjectId, ref: "User" },
  type: String,
  description: String,
  photoUrl: String,
  ward: String,
  location: { lat: Number, lng: Number },
  status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
  resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  resolutionNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = models.User || model("User", UserSchema);
const WasteBag = models.WasteBag || model("WasteBag", WasteBagSchema);
const Anomaly = models.Anomaly || model("Anomaly", AnomalySchema);
const Complaint = models.Complaint || model("Complaint", ComplaintSchema);

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/trashtrail";

const getRandomDelhiCoord = () => ({
  lat: 28.5 + Math.random() * 0.3,
  lng: 77.1 + Math.random() * 0.2 
});

const getRandomWard = () => `Ward ${Math.floor(Math.random() * 10) + 1}`;
const wasteTypesArr = ['plastic', 'paper', 'metal', 'glass', 'organic', 'mixed', 'e_waste'];

async function seed() {
  console.log('🌱 Starting database seeding process...');
  try {
    await mongoose.connect(URI);
    console.log('✅ Connected to MongoDB');

    // CLEAR DB
    await User.deleteMany();
    await WasteBag.deleteMany();
    await Anomaly.deleteMany();
    await Complaint.deleteMany();
    console.log('🧹 Cleared existing data');

    const pwdHash = await bcrypt.hash('password123', 10);
    
    // Admins & Staff
    const admin = await User.create({ name: 'Admin User', email: 'admin@trashtrail.com', password: pwdHash, role: 'admin' });
    const collectors = await User.insertMany([
      { name: 'Ram Kumar', email: 'ram@trashtrail.com', password: pwdHash, role: 'collector', phone: '9876543210', ward: 'Ward 1' },
      { name: 'Suresh', email: 'suresh@trashtrail.com', password: pwdHash, role: 'collector', phone: '8765432109', ward: 'Ward 3' },
      { name: 'Deepak', email: 'deepak@trashtrail.com', password: pwdHash, role: 'collector', phone: '7654321098', ward: 'Ward 5' }
    ]);
    const citizens = await User.insertMany([
      { name: 'Rahul', email: 'rahul@example.com', password: pwdHash, role: 'citizen', address: 'B-12 CP', ward: 'Ward 1', greenScore: 120, totalWasteRecycled: 45, carbonSaved: 22.5 },
      { name: 'Priya', email: 'priya@example.com', password: pwdHash, role: 'citizen', address: 'Green Park', ward: 'Ward 2', greenScore: 85, totalWasteRecycled: 30, carbonSaved: 15 },
      { name: 'Amit', email: 'amit@example.com', password: pwdHash, role: 'citizen', address: 'Rohini', ward: 'Ward 8', greenScore: 210, totalWasteRecycled: 105, carbonSaved: 52.5 },
      { name: 'Sneha', email: 'sneha@example.com', password: pwdHash, role: 'citizen', address: 'Dwarka', ward: 'Ward 9', greenScore: 50, totalWasteRecycled: 10, carbonSaved: 5 },
      { name: 'Vikram', email: 'vikram@example.com', password: pwdHash, role: 'citizen', address: 'Lajpat Nagar', ward: 'Ward 5', greenScore: 340, totalWasteRecycled: 180, carbonSaved: 90 },
      { name: 'Anjali', email: 'anjali@example.com', password: pwdHash, role: 'citizen', address: 'Saket', ward: 'Ward 3', greenScore: 150, totalWasteRecycled: 60, carbonSaved: 30 },
      { name: 'Siddharth', email: 'sid@example.com', password: pwdHash, role: 'citizen', address: 'Janakpuri', ward: 'Ward 10', greenScore: 90, totalWasteRecycled: 35, carbonSaved: 17.5 },
      { name: 'Megha', email: 'megha@example.com', password: pwdHash, role: 'citizen', address: 'Vasant Kunj', ward: 'Ward 2', greenScore: 275, totalWasteRecycled: 140, carbonSaved: 70 },
      { name: 'Karan', email: 'karan@example.com', password: pwdHash, role: 'citizen', address: 'Pitampura', ward: 'Ward 8', greenScore: 65, totalWasteRecycled: 22, carbonSaved: 11 },
      { name: 'Ishaan', email: 'ishaan@example.com', password: pwdHash, role: 'citizen', address: 'Hauz Khas', ward: 'Ward 1', greenScore: 195, totalWasteRecycled: 92, carbonSaved: 46 }
    ]);
    console.log('👥 Created 1 Admin, 3 Collectors, 10 Citizens');

    const bagsList = [];
    
    const generateTimeline = (statusLimit, cId, colId, dateStart) => {
      const statuses = ["created", "collected", "in_transit", "at_facility", "processed", "recycled"];
      const tLine = [];
      let currentIdx = 0;
      let targetIdx = statuses.indexOf(statusLimit);
      
      let baseTime = new Date(dateStart).getTime();
      
      while(currentIdx <= targetIdx) {
        let st = statuses[currentIdx];
        tLine.push({
          status: st,
          timestamp: new Date(baseTime),
          location: getRandomDelhiCoord(),
          note: `Bag status updated to ${st}`,
          updatedBy: currentIdx === 0 ? cId : (currentIdx <= 2 ? colId : admin._id)
        });
        baseTime += (Math.random() * 12 + 2) * 3600000;
        currentIdx++;
      }
      return { tLine, lastTime: new Date(baseTime) };
    };

    const bagDist = [
      { status: 'recycled', count: 10 },
      { status: 'processed', count: 5 },
      { status: 'at_facility', count: 5 },
      { status: 'collected', count: 4 },
      { status: 'in_transit', count: 3 },
      { status: 'created', count: 3 }
    ];

    let bagCounter = 1;

    for (const dist of bagDist) {
      for (let i = 0; i < dist.count; i++) {
        const cId = citizens[Math.floor(Math.random() * citizens.length)]._id;
        const colId = collectors[Math.floor(Math.random() * collectors.length)]._id;
        const weight = Number((Math.random() * 9 + 1).toFixed(1)); 
        const wType = wasteTypesArr[Math.floor(Math.random() * wasteTypesArr.length)];
        
        // Pick start date 3 to 7 days ago
        let dateStart = Date.now() - (Math.random() * 4 + 3) * 86400000;
        
        if (dist.status === 'created' && i === 0) {
           dateStart = Date.now() - 50 * 3600000; 
        }

        const { tLine, lastTime } = generateTimeline(dist.status, cId, colId, dateStart);

        let weightColl = weight;
        let weightFac = weight;
        let isAnomaly = false;
        let anomalyReason = '';

        if (dist.status === 'collected' && i === 0) {
           weightColl = weight - (weight * 0.45); 
           isAnomaly = true;
           anomalyReason = `Weight mismatch detected. Source: ${weight.toFixed(1)}kg vs Collected: ${weightColl.toFixed(1)}kg`;
        }
        if (dist.status === 'collected' && i === 1) {
           weightColl = weight - (weight * 0.25); 
           isAnomaly = true;
           anomalyReason = `Weight mismatch detected. Source: ${weight.toFixed(1)}kg vs Collected: ${weightColl.toFixed(1)}kg`;
        }
        
        const suffix = String(bagCounter).padStart(5, '0');
        
        bagsList.push({
          qrCode: `TT-2025-${suffix}`,
          citizenId: cId,
          collectorId: dist.status === 'created' ? null : colId,
          wasteType: wType,
          weightAtSource: weight,
          weightAtCollection: dist.status === 'created' ? null : weightColl,
          weightAtFacility: ['at_facility','processed','recycled'].includes(dist.status) ? weightFac : null,
          status: dist.status,
          anomalyFlag: isAnomaly,
          anomalyReason,
          timeline: tLine,
          createdAt: new Date(dateStart),
          updatedAt: lastTime
        });
        bagCounter++;
      }
    }

    const insertedBags = await WasteBag.insertMany(bagsList);
    console.log(`📦 Created ${insertedBags.length} Waste Bags`);

    // ANOMALIES
    const mismatchBags = insertedBags.filter(b => b.anomalyFlag);
    const anomalyPayload = [];
    
    if (mismatchBags[0]) {
      anomalyPayload.push({
        wasteBagId: mismatchBags[0]._id,
        collectorId: mismatchBags[0].collectorId,
        type: 'weight_mismatch',
        severity: 'high',
        description: mismatchBags[0].anomalyReason,
        status: 'investigating'
      });
    }

    if (mismatchBags[1]) {
      anomalyPayload.push({
        wasteBagId: mismatchBags[1]._id,
        collectorId: mismatchBags[1].collectorId,
        type: 'weight_mismatch',
        severity: 'medium',
        description: mismatchBags[1].anomalyReason,
        status: 'detected'
      });
    }

    const facBags = insertedBags.filter(b => b.status === 'at_facility');
    if (facBags.length > 0) {
       anomalyPayload.push({
          wasteBagId: facBags[0]._id,
          collectorId: facBags[0].collectorId,
          type: 'delayed_processing',
          severity: 'low',
          description: `Waste bag ${facBags[0].qrCode} at facility for 52 hours without processing`,
          status: 'resolved',
          resolvedBy: admin._id,
          resolvedNotes: 'Backlog cleared today.'
       });
    }

    const crtBags = insertedBags.filter(b => b.status === 'created');
    if (crtBags.length > 0) {
      anomalyPayload.push({
          wasteBagId: crtBags[0]._id,
          collectorId: null,
          type: 'missed_pickup',
          severity: 'high',
          description: `Waste bag ${crtBags[0].qrCode} not picked up for 50 hours`,
          status: 'detected'
       });
       if (crtBags.length > 1) {
         anomalyPayload.push({
            wasteBagId: crtBags[1]._id,
            collectorId: null,
            type: 'missed_pickup',
            severity: 'medium',
            description: `Waste bag ${crtBags[1].qrCode} not picked up for 26 hours`,
            status: 'investigating'
         });
       }
    }

    await Anomaly.insertMany(anomalyPayload);
    console.log(`⚠️ Created 5 Anomalies`);

    // COMPLAINTS
    await Complaint.insertMany([
      { citizenId: citizens[0]._id, type: 'missed_pickup', description: 'Bin is overflowing outside appartment since 3 days', ward: 'Ward 1', location: getRandomDelhiCoord(), status: 'open' },
      { citizenId: citizens[2]._id, type: 'improper_handling', description: 'Collector mixed wet and dry waste together in same bucket', ward: 'Ward 8', location: getRandomDelhiCoord(), status: 'in_progress' },
      { citizenId: citizens[4]._id, type: 'overflow', description: 'Public dustbin completely broken', ward: 'Ward 5', location: getRandomDelhiCoord(), status: 'resolved', resolutionNotes: 'Bin replaced' },
      { citizenId: citizens[1]._id, type: 'other', description: 'Strange odor from collection truck', ward: 'Ward 2', location: getRandomDelhiCoord(), status: 'open' },
      { citizenId: citizens[3]._id, type: 'missed_pickup', description: 'No one came for pickup today', ward: 'Ward 9', location: getRandomDelhiCoord(), status: 'open' }
    ]);
    console.log(`📢 Created 5 Complaints`);

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding Error: ', err);
    process.exit(1);
  }
}

seed();
