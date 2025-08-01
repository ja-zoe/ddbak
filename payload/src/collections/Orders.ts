import type { CollectionConfig } from "payload";

const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "stripeSessionId",
    defaultColumns: ["customerEmail", "status", "createdAt"],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "customerEmail",
      type: "email",
      required: true,
    },
    {
      name: "shippingAddress",
      type: "group",
      fields: [
        { name: "line1", type: "text", required: true },
        { name: "line2", type: "text" },
        { name: "city", type: "text", required: true },
        { name: "state", type: "text" },
        { name: "postal_code", type: "text", required: true },
        { name: "country", type: "text", required: true },
      ],
    },
    {
      name: "items",
      type: "array",
      required: true,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "selectedColor",
          type: "group",
          fields: [
            { name: "name", type: "text" },
            { name: "hex", type: "text" },
          ],
        },
        {
          name: "selectedVariants",
          type: "json",
          admin: {
            description: "Key-value pairs of variant options (e.g. Size: M)",
          },
        },
        {
          name: "quantity",
          type: "number",
          required: true,
        },
        {
          name: "unitPrice",
          type: "number",
          required: true,
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "unfulfilled",
      options: ["unfulfilled", "processing", "shipped", "cancelled"],
    },
    {
      name: "stripeSessionId",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "totalAmount",
      type: "number",
      required: true,
    },
  ],
};

export default Orders;
