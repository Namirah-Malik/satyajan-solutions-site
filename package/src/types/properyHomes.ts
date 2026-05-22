export interface PropertyHomes {
  name: string
  rate: number
  slug: string

  // image support
  images: (
    | string
    | {
        src?: string
      }
  )[]

  // features
  features: string[]

  // optional category
  category?: string

  // extra product details
  warranty?: string
  capacity?: string
  suitableFor?: string

  // badges
  rating?: number
  isBestSeller?: boolean
  isNew?: boolean
}