import { Schema, model, models } from 'mongoose'

type NavItem = {
  id: string
  labelEN: string
  labelAR: string
  href: string
  type: 'internal' | 'external'
  visible?: boolean
  newTab?: boolean
  children?: NavItem[]
}

const NavItemSchema = new Schema<NavItem>(
  {
    id: { type: String, required: true },
    labelEN: { type: String, required: true },
    labelAR: { type: String, required: true },
    href: { type: String, required: true },
    type: { type: String, enum: ['internal', 'external'], required: true },
    visible: { type: Boolean, default: true },
    newTab: { type: Boolean, default: false },
    children: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false }
)

const NavigationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    items: { type: [NavItemSchema], default: [] },
  },
  { timestamps: true }
)

export type NavigationDocument = ReturnType<typeof models.Navigation> extends infer T
  ? T
  : any

export default models.Navigation || model('Navigation', NavigationSchema)


