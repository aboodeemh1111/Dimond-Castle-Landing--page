import { Schema, model, models } from 'mongoose'

const CtaSchema = new Schema(
  {
    labelEN: { type: String, default: '' },
    labelAR: { type: String, default: '' },
    href: { type: String, default: '' },
  },
  { _id: false }
)

const HeroSettingsSchema = new Schema(
  {
    titleLeadingEN: { type: String, default: '' },
    titleLeadingAR: { type: String, default: '' },
    titleTrailingEN: { type: String, default: '' },
    titleTrailingAR: { type: String, default: '' },
    subtitleEN: { type: String, default: '' },
    subtitleAR: { type: String, default: '' },
    primaryCta: { type: CtaSchema, default: {} },
    secondaryCta: { type: CtaSchema, default: {} },
    scrollLabelEN: { type: String, default: '' },
    scrollLabelAR: { type: String, default: '' },
    backgroundImagePublicId: { type: String, default: '' },
    overlayGradientStart: { type: String, default: 'rgba(46,94,78,0.85)' },
    overlayGradientEnd: { type: String, default: 'rgba(212,175,55,0.35)' },
    highlightOverlay: {
      type: String,
      default: 'radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.25), transparent)',
    },
    radialOverlayEnabled: { type: Boolean, default: true },
    updatedBy: String,
  },
  { timestamps: true }
)

export default models.HeroSettings || model('HeroSettings', HeroSettingsSchema)


