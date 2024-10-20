import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const handleError = (error, context) => {
  console.error(`Error ${context}:`, error);
  throw error;
};

export const fetchLyrics = async (approvedOnly = false) => {
  try {
    let query = supabase.from('bhajan_lyrics').select('*');
    if (approvedOnly) {
      query = query.eq('approved', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'fetching lyrics');
  }
};

// Other functions remain the same
export const fetchLyricById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('bhajan_lyrics')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'fetching lyric by ID');
  }
};

export const addLyric = async (lyric) => {
  try {
    const { data, error } = await supabase
      .from('bhajan_lyrics')
      .insert([lyric]);
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'adding lyric');
  }
};

export const updateLyric = async (lyric) => {
  try {
    const { data, error } = await supabase
      .from('bhajan_lyrics')
      .update({
        title: lyric.title,
        lyrics: lyric.lyrics,
        written_by: lyric.written_by,
        tags: lyric.tags,
        approved: lyric.approved
      })
      .eq('id', lyric.id);
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'updating lyric');
  }
};

export const deleteLyric = async (id) => {
  try {
    const { data, error } = await supabase
      .from('bhajan_lyrics')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'deleting lyric');
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'logging in');
  }
};