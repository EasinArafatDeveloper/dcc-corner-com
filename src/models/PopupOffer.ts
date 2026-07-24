import mongoose from 'mongoose';

const popupOfferSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
      default: '/shop',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PopupOffer = mongoose.models.PopupOffer || mongoose.model('PopupOffer', popupOfferSchema);

export default PopupOffer;
