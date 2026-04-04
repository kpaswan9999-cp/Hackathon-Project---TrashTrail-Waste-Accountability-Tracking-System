import connectDB from './mongodb';
import User from '../models/User';
import WasteBag from '../models/WasteBag';
import Anomaly from '../models/Anomaly';
import Complaint from '../models/Complaint';

const localDb = {
  users: {
    async find(query = {}) {
      await connectDB();
      return await User.find(query).lean();
    },
    async findOne(query) {
      await connectDB();
      return await User.findOne(query).lean();
    },
    async findById(id) {
      await connectDB();
      return await User.findById(id).lean();
    },
    async create(userData) {
      await connectDB();
      return await User.create(userData);
    },
    async updateById(id, updates) {
      await connectDB();
      return await User.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
  },
  wastebags: {
    async find(query = {}) {
      await connectDB();
      return await WasteBag.find(query).lean();
    },
    async findOne(query) {
      await connectDB();
      return await WasteBag.findOne(query).lean();
    },
    async findById(id) {
      await connectDB();
      return await WasteBag.findById(id).lean();
    },
    async create(bagData) {
      await connectDB();
      return await WasteBag.create(bagData);
    },
    async updateById(id, updates) {
      await connectDB();
      return await WasteBag.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
  },
  anomalies: {
    async find() {
      await connectDB();
      return await Anomaly.find({}).lean();
    },
    async create(data) {
      await connectDB();
      return await Anomaly.create(data);
    },
    async updateById(id, updates) {
      await connectDB();
      return await Anomaly.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
  },
  complaints: {
    async find() {
      await connectDB();
      return await Complaint.find({}).lean();
    },
    async create(data) {
      await connectDB();
      return await Complaint.create(data);
    }
  },
  async getRawData() {
    await connectDB();
    const [users, wastebags, anomalies, complaints] = await Promise.all([
      User.find({}).lean(),
      WasteBag.find({}).lean(),
      Anomaly.find({}).lean(),
      Complaint.find({}).lean(),
    ]);
    return { users, wastebags, anomalies, complaints };
  }
};

export default localDb;
