// This app currently persists check-ins to the browser's localStorage
// (see src/composables/useFanJourney.js) so it works immediately with
// zero setup. When you're ready to move to a real backend:
//
// 1. npm install @supabase/supabase-js
// 2. Create a Supabase project, then create these tables (see README.md
//    for the full schema): events, attendances, achievements
// 3. Add a .env file (never commit it) with:
//      VITE_SUPABASE_URL=your-project-url
//      VITE_SUPABASE_ANON_KEY=your-anon-key
// 4. Uncomment the block below and import { supabase } from this file
//    inside useFanJourney.js, replacing the localStorage read/write calls
//    with supabase.from('attendances').select()/upsert() calls.
//
// import { createClient } from '@supabase/supabase-js'
//
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// )
