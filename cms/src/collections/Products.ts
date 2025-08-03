import type { CollectionConfig } from 'payload'
import { colorPickerField } from '@innovixx/payload-color-picker-field'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
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
    {
      name: "colors",
      type: "array",
      fields: [
        {
          name: "colorName",
          type: "text",
          required: true
        },
        colorPickerField({
          name: 'color',
          label: 'Color',
          required: true,
          admin: {
            position: 'sidebar',
            description: 'Choose a color for a variation of this product',
          }
        })
      ]
    },
    {
      name: "otherProductVariants",
      type: "array",
      fields: [
        {
          name: "variantName",
          type: "text",
          required: true
        },
        {
          name: "variantOptions",
          type: "array",
          required: true,
          fields: [
            { name: "option", type: "text", required: true },
          ]
        }
      ]
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      required: true,
    },
  ],
  admin: {
    useAsTitle: "name"
  },
}