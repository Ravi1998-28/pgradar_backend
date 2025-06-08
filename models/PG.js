import mongoose from 'mongoose';

const pgSchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      default: [],
    },
    pgName: {
      type: String,
      required: true,
    },
    pgAddress: {
      type: String,
      required: true,
    },
    liveLocation: {
      lat: {
        type: String,
        required: true,
      },
      long: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pgType: {
      type: [String],
      enum: ['Boys', 'Girls', 'Co living'],
      validate: [(val) => val.length > 0, 'At least one PG type is required'],
      required: true,
    },
    signleRoomAvailbility: {
      type: Boolean,
      required: true,
    },
    doubleShareAvailbility: {
      type: Boolean,
      default: false,
    },
    tripleShareAvailbility: {
      type: Boolean,
      default: false,
    },
    singleRoomRent: {
      type: Number,
      required: true,
    },
    doubleShareRent: {
      type: Number,
    },
    tripleShareRent: {
      type: Number,
    },
    balconyCharges: {
      type: Number,
      default: 0,
    },
    seciurityDeposit: {
      type: Number,
      required: true,
    },
    noticePeriod: {
      type: Number,
      required: true,
    },
    minimumStay: {
      type: String,
      required: true,
    },
    amenties: {
      type: [String],
      validate: [(val) => val.length > 0, 'At least one amenity is required'],
      required: true,
    },
    isFoodIncluded: {
      type: Boolean,
      required: true,
    },
    foodPrice: {
      type: Number,
    },
    isElectricityIncluded: {
      type: Boolean,
      required: true,
    },
    electricityUnitPrice: {
      type: Number,
    },
    pgRules: {
      type: [String],
      validate: [(val) => val.length > 0, 'At least one PG rule is required'],
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isVerified: {
      type: Boolean,
      default: false, // default unverified
    },
  },
  { timestamps: true }
);

const PG = mongoose.model('PG', pgSchema);
export default PG;
