import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
      default: '',
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    badgeText: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: 'Shop Wholesale Deals',
    },
    overlayOpacity: {
      type: Number,
      default: 40,
    },
    linkUrl: {
      type: String,
      default: '/shop',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSideOffer: {
      type: Boolean,
      default: false,
    },
    isMiddleBanner: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Clear cached model in development so schema changes (like optional imageUrl) apply immediately
if (mongoose.models.Banner) {
  delete (mongoose.models as any).Banner;
}

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
