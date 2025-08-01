import type { CollectionConfig } from 'payload'
import { colorPickerField } from '@innovixx/payload-color-picker-field'

export const GalleryPictures: CollectionConfig = {
  slug: 'gallery-pictures',
  fields: [
    {
      name: 'pictures',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
  ]
}