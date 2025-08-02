import type { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true
    },
    {
      name: 'relatedProducts',
      type: 'join',
      collection: 'products',
      on: 'category'
    },
    {
      name: 'picture',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
  ],
  admin: {
    useAsTitle: "name"
  }
}