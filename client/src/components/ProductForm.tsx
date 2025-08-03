"use client";

import type { Product } from "@payload";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from "@/contexts/CartProvider";

const ProductForm = ({ product }: { product: Product }) => {
  const cart = useCart();
  function buildSchema(product: Product) {
    const variantKeys =
      product.otherProductVariants?.map((v) => v.variantName) || [];

    const schema = z.object({
      color: product.colors?.length
        ? z.string().min(1, "Please select a color")
        : z.string().optional(),
      otherVariants: variantKeys.length
        ? z.object(
            variantKeys.reduce((acc, key) => {
              acc[key] = z.string().min(1, `Please select ${key}`);
              return acc;
            }, {} as Record<string, z.ZodString>)
          )
        : z.record(z.string(), z.string()).optional(),
    });

    const defaultValues = {
      color: "",
      otherVariants: variantKeys.reduce((acc, key) => {
        acc[key] = ""; // initialize with empty string to match z.string()
        return acc;
      }, {} as Record<string, string>),
    };

    return { schema, defaultValues };
  }

  const { schema, defaultValues } = buildSchema(product);
  type FormData = z.infer<typeof schema>;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: FormData) => {
    const selectedColor = product.colors?.find(
      (c) => c.colorName === data.color
    );

    const color = selectedColor
      ? { name: selectedColor.colorName, hex: selectedColor.color }
      : undefined;

    const otherVariants = data.otherVariants;
    console.log();

    cart.addItem({ id: product.id, color, otherVariants, quantity: 1 });
  };
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        {/* COLORS */}
        {product.colors && product.colors.length > 0 && (
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {product.colors?.map((color) => (
                      <SelectItem key={color.colorName} value={color.colorName}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.color }}
                          />
                          <span>{color.colorName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {product.otherProductVariants?.map((variant) => (
          <FormField
            key={variant.variantName}
            name={`otherVariants.${variant.variantName}`}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{variant.variantName}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    form.setValue(
                      `otherVariants.${variant.variantName}`,
                      value,
                      {
                        shouldValidate: true, // this is what you're missing
                        shouldTouch: true,
                      }
                    );
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue
                        placeholder={`Select a ${variant.variantName}`}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {variant.variantOptions.map((opt) => (
                      <SelectItem key={opt.option} value={opt.option}>
                        {opt.option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <button
          type="submit"
          className="bg-gold text-white px-2 py-1 rounded-sm text-lg w-full cursor-pointer"
        >
          Add to cart
        </button>
      </form>
    </Form>
  );
};

export default ProductForm;
