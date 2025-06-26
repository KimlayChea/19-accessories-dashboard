import supabase from "./supabase";

export async function getCustomerMessages() {
  const { data, error } = await supabase.from("customerMessages").select("*");

  if (error) throw new Error(error.message);

  return data;
}

export async function updateStatus({ id, value }) {
  const { data, error } = await supabase
    .from("customerMessages")
    .update({ status: value })
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);

  return data;
}
