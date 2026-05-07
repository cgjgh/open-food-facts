"use server"

import { z } from "zod"

export const submitFoodSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  barcode: z.string().min(8, "Valid barcode is required"),
  productName: z.string().min(1, "Product name is required"),
  brands: z.string().min(1, "Brand is required"),
  // Note: File validation in Zod when passed from Server Actions can be tricky.
  // We'll handle the File extraction manually in the action.
})

export async function submitFoodAction(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const barcode = formData.get("barcode") as string
  const productName = formData.get("productName") as string
  const brands = formData.get("brands") as string
  const photo = formData.get("photo") as File

  // Basic validation
  if (!username || !password || !barcode || !productName || !brands) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    // 1. Submit product data to Open Food Facts
    const productData = new URLSearchParams()
    productData.append("code", barcode)
    productData.append("user_id", username)
    productData.append("password", password)
    productData.append("product_name", productName)
    productData.append("brands", brands)

    const productRes = await fetch("https://world.openfoodfacts.org/cgi/product_jqm2.pl", {
      method: "POST",
      body: productData,
      headers: {
        "User-Agent": "OpenFoodFactsNextJs - Web - Version 1.0",
      },
    })

    if (!productRes.ok) {
      throw new Error("Failed to save product details")
    }

    // 2. Submit photo if present
    if (photo && photo.size > 0) {
      const photoData = new FormData()
      photoData.append("code", barcode)
      photoData.append("imagefield", "front")
      photoData.append("user_id", username)
      photoData.append("password", password)
      photoData.append("imgupload_front", photo)

      const photoRes = await fetch("https://world.openfoodfacts.org/cgi/product_image_upload.pl", {
        method: "POST",
        body: photoData,
        headers: {
          "User-Agent": "OpenFoodFactsNextJs - Web - Version 1.0",
        },
      })

      if (!photoRes.ok) {
        throw new Error("Failed to upload product photo")
      }
    }

    return { success: true, barcode }
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}
