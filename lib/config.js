"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPABASE_ENABLED =
  exports.NEXT_PUBLIC_GOOGLE_CLIENT_ID =
  exports.PRIVATE_SUPABASE_SERVICE_KEY =
  exports.PUBLIC_SUPABASE_ANON_KEY =
  exports.PUBLIC_SUPABASE_URL =
    void 0;
exports.PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
exports.PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
exports.PRIVATE_SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
exports.NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
exports.SUPABASE_ENABLED =
  exports.PUBLIC_SUPABASE_URL && exports.PUBLIC_SUPABASE_ANON_KEY && exports.PRIVATE_SUPABASE_SERVICE_KEY ? true : false;
