import supabase from "./supabase";
import { supabaseUrl } from "./supabase";

export async function getProducts() {
  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to load products");
  }

  return products;
}

export async function getProduct(productId) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("product_id", productId);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to load product");
  }

  return product;
}

export async function getProductCategories(productId) {
  const { data: productCategories, error } = await supabase
    .from("products_categories")
    .select("*, categories(id, category)")
    .eq("product_id", productId);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to load product's categories");
  }

  return productCategories;
}

export async function getProductSizes(productId) {
  const { data: productCategories, error } = await supabase
    .from("products_stock")
    .select("*, sizes(id, sizeValue)")
    .eq("product_id", productId);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to load product's categories");
  }

  return productCategories;
}

export async function getSizes() {
  const { data: sizes, error } = await supabase.from("sizes").select("*");

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to load sizes");
  }

  return sizes;
}

export async function createProduct({
  newImage,
  newProduct,
  newProductSizes,
  newProductCategoryIds,
}) {
  // Check if the image is already a Supabase URL
  const hasImagePath = newProduct.image?.startsWith?.(supabaseUrl);

  // Generate new image path if needed
  const imageName = `${Math.random()}-${newImage?.name || ""}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newProduct.image
    : `${supabaseUrl}/storage/v1/object/public/images/${imageName}`;

  // 1. Insert product
  const { data: createdProduct, error: errorProduct } = await supabase
    .from("products")
    .insert([{ ...newProduct, image: imagePath }])
    .select()
    .single();

  if (errorProduct) {
    console.error("Supabase error:", errorProduct);
    throw new Error("Failed to create product");
  }

  const productId = createdProduct.id;

  // 2. Insert product categories
  const productCategoriesRows = newProductCategoryIds.map((categoryId) => ({
    product_id: productId,
    category_id: categoryId,
  }));

  const { error: errorInsertProductCategories } = await supabase
    .from("products_categories")
    .insert(productCategoriesRows);

  if (errorInsertProductCategories) {
    // Rollback: delete the product
    await supabase.from("products").delete().eq("id", productId);
    console.error("Supabase error:", errorInsertProductCategories);
    throw new Error("Failed to add product's categories");
  }

  // 3. Insert product sizes
  const productSizesRows = newProductSizes.map((size) => ({
    product_id: productId,
    size_id: size.id,
    itemCount: size.itemCount,
  }));

  const { error: errorInsertProductSizes } = await supabase
    .from("products_stock")
    .insert(productSizesRows);

  if (errorInsertProductSizes) {
    // Rollback: delete product and categories
    await supabase
      .from("products_categories")
      .delete()
      .eq("product_id", productId);
    await supabase.from("products").delete().eq("id", productId);
    console.error("Supabase error:", errorInsertProductSizes);
    throw new Error("Failed to add product's sizes");
  }

  // 4. Upload image if needed
  if (!hasImagePath && newImage) {
    const { error: storageError } = await supabase.storage
      .from("images")
      .upload(imageName, newImage);

    if (storageError) {
      // Rollback: delete product, categories, and sizes
      await supabase
        .from("products_stock")
        .delete()
        .eq("product_id", productId);
      await supabase
        .from("products_categories")
        .delete()
        .eq("product_id", productId);
      await supabase.from("products").delete().eq("id", productId);
      throw new Error(
        "Product image could not be uploaded. The product creation was rolled back."
      );
    }
  }

  return createdProduct;
}

export async function editProduct(
  { newImage, oldImageUrl, newProduct, newProductSizes, newProductCategoryIds },
  id
) {
  // Check if the image is already a Supabase URL
  const hasImagePath = newProduct.image?.startsWith?.(supabaseUrl);

  // Generate new image path if needed
  const imageName = `${Math.random()}-${newImage?.name || ""}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newProduct.image
    : `${supabaseUrl}/storage/v1/object/public/images/${imageName}`;

  // Update product
  const { data: updatedProduct, error: errorProduct } = await supabase
    .from("products")
    .update({ ...newProduct, image: imagePath })
    .eq("id", id)
    .select()
    .single();

  if (errorProduct) {
    console.error("Supabase error:", errorProduct);
    throw new Error(`Failed to edit product: ${errorProduct.message}`);
  }

  // --- CATEGORY SECTION ---

  // Get old product categories
  const { data: oldProductCategories, error: errorGetProductCategories } =
    await supabase.from("products_categories").select("*").eq("product_id", id);

  if (errorGetProductCategories) {
    console.error("Supabase error:", errorGetProductCategories);
    throw new Error("Failed to get old product's categories");
  }

  // Delete old product categories
  const { error: errorDeleteProductCategories } = await supabase
    .from("products_categories")
    .delete()
    .eq("product_id", id);

  if (errorDeleteProductCategories) {
    console.error("Supabase error:", errorDeleteProductCategories);
    throw new Error("Failed to delete old product's categories");
  }

  // Insert new product categories
  const productCategoriesRows = newProductCategoryIds.map((categoryId) => ({
    product_id: id,
    category_id: categoryId,
  }));

  const { error: errorInsertProductCategories } = await supabase
    .from("products_categories")
    .insert(productCategoriesRows);

  if (errorInsertProductCategories) {
    // Rollback: restore old categories
    if (oldProductCategories && oldProductCategories.length > 0) {
      const rollbackRows = oldProductCategories.map((cat) => ({
        product_id: cat.product_id,
        category_id: cat.category_id,
      }));
      await supabase.from("products_categories").insert(rollbackRows);
    }
    console.error("Supabase error:", errorInsertProductCategories);
    throw new Error("Failed to add new product's categories");
  }

  // --- SIZE SECTION ---

  // 1. Get old product sizes (for rollback)
  const { data: oldProductSizes, error: errorGetProductSizes } = await supabase
    .from("products_stock")
    .select("*")
    .eq("product_id", id);

  if (errorGetProductSizes) {
    console.error("Supabase error:", errorGetProductSizes);
    throw new Error("Failed to get old product's sizes");
  }

  // 2. Delete old product sizes
  const { error: errorDeleteProductSizes } = await supabase
    .from("products_stock")
    .delete()
    .eq("product_id", id);

  if (errorDeleteProductSizes) {
    console.error("Supabase error:", errorDeleteProductSizes);
    throw new Error("Failed to delete old product's sizes");
  }

  // 3. Insert new product sizes
  // newProductSizes should be an array of objects like: { size_id, stock, ... }
  const productSizesRows = newProductSizes.map((size) => ({
    product_id: id,
    size_id: size.id,
    itemCount: size.itemCount,
  }));

  const { error: errorInsertProductSizes } = await supabase
    .from("products_stock")
    .insert(productSizesRows);

  if (errorInsertProductSizes) {
    // Rollback: restore old sizes
    if (oldProductSizes && oldProductSizes.length > 0) {
      const rollbackRows = oldProductSizes.map((size) => ({
        product_id: size.product_id,
        size_id: size.size_id,
        itemCount: size.itemCount,
        // add other fields as needed
      }));
      await supabase.from("products_stock").insert(rollbackRows);
    }
    console.error("Supabase error:", errorInsertProductSizes);
    throw new Error("Failed to add new product's sizes");
  }

  if (hasImagePath) return updatedProduct;

  if (oldImageUrl) {
    // Extract path after '/avatars/'
    const pathParts = oldImageUrl.split("/images/");
    const filePath = pathParts[1]; // e.g. 'avatar-0.123456'

    if (filePath) {
      await supabase.storage.from("images").remove([filePath]);
    }
  }

  // 2. Upload image
  const { error: storageError } = await supabase.storage
    .from("images")
    .upload(imageName, newImage);

  // 3. Delete the product if there was an error uploading image
  if (storageError) {
    // Rollback: delete product, categories, and sizes
    await supabase
      .from("products_stock")
      .delete()
      .eq("product_id", updatedProduct.id);
    await supabase
      .from("products_categories")
      .delete()
      .eq("product_id", updatedProduct.id);
    await supabase.from("products").delete().eq("id", updatedProduct.id);
    throw new Error(
      "Product image could not be uploaded. The product update was rolled back."
    );
  }

  return updatedProduct;
}

export async function deleteProduct(productId) {
  // 1. Delete product sizes
  const { error: errorDeleteSizes } = await supabase
    .from("products_stock")
    .delete()
    .eq("product_id", productId);

  if (errorDeleteSizes) {
    console.error("Supabase error:", errorDeleteSizes);
    throw new Error("Failed to delete product's sizes");
  }

  // 2. Delete product categories
  const { error: errorDeleteCategories } = await supabase
    .from("products_categories")
    .delete()
    .eq("product_id", productId);

  if (errorDeleteCategories) {
    console.error("Supabase error:", errorDeleteCategories);
    throw new Error("Failed to delete product's categories");
  }

  // 3. Delete product categories
  const { error: errorDeleteFavorite } = await supabase
    .from("favorites")
    .delete()
    .eq("product_id", productId);

  if (errorDeleteFavorite) {
    console.error("Supabase error:", errorDeleteFavorite);
    throw new Error("Failed to delete user's favorites ");
  }

  const { data: product, error } = await supabase
    .from("products")
    .select("image")
    .eq("id", productId);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to before delete product: ${error.message}`);
  }

  // 3. Delete the product itself
  const { error: errorDeleteProduct } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (errorDeleteProduct) {
    console.error("Supabase error:", errorDeleteProduct);
    throw new Error(`Failed to delete product: ${errorDeleteProduct.message}`);
  }

  const pathParts = product[0].image.split("/images/");
  const filePath = pathParts[1]; // e.g. 'avatar-0.123456'

  if (filePath) {
    await supabase.storage.from("images").remove([filePath]);
  }

  return true;
}
