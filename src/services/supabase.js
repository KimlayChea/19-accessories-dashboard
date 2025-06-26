import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ufcgeaktlgizeqopoufv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmY2dlYWt0bGdpemVxb3BvdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjU0ODQsImV4cCI6MjA2NDU0MTQ4NH0.CIZWnlO4uG2hvv69ixu_9gsN7WYVVGbG22mQlpFSTh0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
export { supabaseUrl };
