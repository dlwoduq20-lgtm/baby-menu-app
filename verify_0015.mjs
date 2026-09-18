import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('C:/Users/dlwod/.gemini/antigravity/scratch/baby-menu-app/.env.local', 'utf-8');
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
  console.log('=== Supabase Migration 0015 Verification ===\n');

  // 1. Check recipe_age_variants
  const { data: variants, error: vErr } = await supabase
    .from('recipe_age_variants')
    .select('id, recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method');
  
  if (vErr) {
    console.log('❌ recipe_age_variants error:', vErr.message);
  } else {
    console.log(`✅ recipe_age_variants: ${variants.length} rows (Target: 23)`);
  }

  // 2. Check ingredient_safety_rules
  const { data: safety, error: sErr } = await supabase
    .from('ingredient_safety_rules')
    .select('id, ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note');
  
  if (sErr) {
    console.log('❌ ingredient_safety_rules error:', sErr.message);
  } else {
    console.log(`✅ ingredient_safety_rules: ${safety.length} rows (Target: 8)`);
  }

  // 3. Check ingredients food_groups
  const { data: ings, error: iErr } = await supabase
    .from('ingredients')
    .select('id, name, food_groups');
  
  if (iErr) {
    console.log('❌ ingredients food_groups error:', iErr.message);
  } else {
    const taggedIngs = ings.filter(i => i.food_groups && i.food_groups.length > 0);
    console.log(`✅ ingredients with food_groups: ${taggedIngs.length} / ${ings.length} (Target: 59 / 59)`);
  }

  // 4. Check recipes menu_type
  const { data: recipes, error: rErr } = await supabase
    .from('recipes')
    .select('id, name, menu_type');
  
  if (rErr) {
    console.log('❌ recipes menu_type error:', rErr.message);
  } else {
    const taggedRecipes = recipes.filter(r => r.menu_type);
    console.log(`✅ recipes with menu_type: ${taggedRecipes.length} / ${recipes.length} (Target: 71 / 71)`);
  }

  // 5. Check '감자전' pilot recipe
  const { data: potatoRecipe, error: pErr } = await supabase
    .from('recipes')
    .select(`
      id, name, menu_type, min_age_stage,
      recipe_ingredients(count),
      recipe_steps(count),
      nutrition_data(carbs_g, protein_g),
      recipe_age_variants(count)
    `)
    .eq('name', '감자전')
    .maybeSingle();

  if (potatoRecipe) {
    console.log(`✅ Showcase Recipe '감자전': Found!`);
    console.log(`   - Variants: ${potatoRecipe.recipe_age_variants?.[0]?.count || 0} stages`);
    console.log(`   - Steps: ${potatoRecipe.recipe_steps?.[0]?.count || 0}`);
    console.log(`   - Ingredients: ${potatoRecipe.recipe_ingredients?.[0]?.count || 0}`);
  } else {
    console.log(`⏳ Showcase Recipe '감자전': Not yet inserted`);
  }
}

verify();
