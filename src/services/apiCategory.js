import supabase from "./supabase";
import { supabaseUrl } from "./supabase";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*, products_categories(*)");

  if (error) throw new Error(error.message);

  const categories = data?.map((category) => {
    return {
      id: category.id,
      category: category.category,
      image: category.image,
      itemCount: category.products_categories.length || 0,
    };
  });

  return categories;
}

export async function createEditCategory({ category, image, id }) {
  // Check if the image is already a Supabase URL
  const hasImagePath = image?.startsWith?.(supabaseUrl);

  // Generate new image path if needed
  const imageName = `${Math.random()}-${image?.name || ""}`.replaceAll("/", "");

  const imagePath = hasImagePath
    ? image
    : `${supabaseUrl}/storage/v1/object/public/images/${imageName}`;

  let query = await supabase.from("categories");

  if (!id) query = query.insert([{ category, image: imagePath }]);

  if (id) query = query.update([{ category, image: imagePath }]).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to create new category: ${error.message}`);
  }

  if (hasImagePath) return data;

  const pathParts = data.image.split("/images/");
  const filePath = pathParts[1]; // e.g. 'avatar-0.123456'

  if (filePath) {
    await supabase.storage.from("images").remove([filePath]);
  }

  // 2. Upload image
  const { error: storageError } = await supabase.storage
    .from("images")
    .upload(imageName, image);

  // 3. Delete the cabin if there was an error uploading image
  if (storageError) {
    await supabase.from("categories").delete().eq("id", data.id);
    console.error("Supabase error:", error);
    throw new Error(`Failed to create new category: ${error.message}`);
  }

  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to before delete category: ${error.message}`);
  }

  return true;
}
