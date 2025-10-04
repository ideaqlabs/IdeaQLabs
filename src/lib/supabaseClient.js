import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cgofkggsbjvjumhurnhx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnb2ZrZ2dzYmp2anVtaHVybmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTU5NDksImV4cCI6MjA3NTE3MTk0OX0.u6r7GY8QfGOv4U0qstC-HRkWeBTTf2x7tCK_5dutNTQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
