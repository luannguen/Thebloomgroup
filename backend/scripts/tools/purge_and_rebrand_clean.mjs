import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:X1PODLTRV56BMPTQ@db.okccyedrnmzzprqotilz.supabase.co:5432/postgres';

async function purgeAndRebrand() {
  const client = new Client({ connectionString });
  await client.connect();

  console.log('=== Starting Thorough Rebranding on Supabase Database ===');

  // 1. static_pages: Replace VIETVINH / Viet Vinh / VVC in content, excerpt, and excerpt_*
  console.log('1. Cleaning static_pages...');
  const { rows: pages } = await client.query('SELECT id, slug, title, content, excerpt, excerpt_en, excerpt_ja, excerpt_ko, excerpt_zh FROM static_pages');
  
  for (const page of pages) {
    let updated = false;
    let newContent = page.content;
    let newExcerpt = page.excerpt;
    let newExcerptEn = page.excerpt_en;
    let newExcerptJa = page.excerpt_ja;
    let newExcerptKo = page.excerpt_ko;
    let newExcerptZh = page.excerpt_zh;

    const replaceText = (text) => {
      if (!text) return text;
      return text
        .replace(/VIETVINH INDUSTRIES CORPORATION/g, 'THEBLOOMGROUP CORPORATION')
        .replace(/VIETVINH CORPORATION/g, 'THEBLOOMGROUP CORPORATION')
        .replace(/Việt Vinh Industries Corporation/gi, 'Thebloomgroup')
        .replace(/Việt Vinh Corporation/gi, 'Thebloomgroup')
        .replace(/Việt Vinh Corp/gi, 'Thebloomgroup')
        .replace(/VietVinhCorp/gi, 'Thebloomgroup')
        .replace(/VIETVINH’s/g, "Thebloomgroup's")
        .replace(/VIETVINH's/g, "Thebloomgroup's")
        .replace(/VIETVINH/g, 'Thebloomgroup')
        .replace(/VietVinh/g, 'Thebloomgroup')
        .replace(/Việt Vinh/g, 'Thebloomgroup')
        .replace(/Viet Vinh/g, 'Thebloomgroup')
        .replace(/\bVVC\b/g, 'Thebloomgroup')
        .replace(/vietvinhcorp\.com/gi, 'thebloomgroup.vn')
        .replace(/vvc\.com\.vn/gi, 'thebloomgroup.vn');
    };

    if (newContent) {
      const replaced = replaceText(newContent);
      if (replaced !== newContent) {
        newContent = replaced;
        updated = true;
      }
    }
    if (newExcerpt) {
      const replaced = replaceText(newExcerpt);
      if (replaced !== newExcerpt) {
        newExcerpt = replaced;
        updated = true;
      }
    }
    if (newExcerptEn) {
      const replaced = replaceText(newExcerptEn);
      if (replaced !== newExcerptEn) {
        newExcerptEn = replaced;
        updated = true;
      }
    }
    if (newExcerptJa) {
      const replaced = replaceText(newExcerptJa);
      if (replaced !== newExcerptJa) {
        newExcerptJa = replaced;
        updated = true;
      }
    }
    if (newExcerptKo) {
      const replaced = replaceText(newExcerptKo);
      if (replaced !== newExcerptKo) {
        newExcerptKo = replaced;
        updated = true;
      }
    }
    if (newExcerptZh) {
      const replaced = replaceText(newExcerptZh);
      if (replaced !== newExcerptZh) {
        newExcerptZh = replaced;
        updated = true;
      }
    }

    if (updated) {
      console.log(`  Updating static_page: ${page.slug}`);
      await client.query(`
        UPDATE static_pages 
        SET content = $1, excerpt = $2, excerpt_en = $3, excerpt_ja = $4, excerpt_ko = $5, excerpt_zh = $6, updated_at = NOW()
        WHERE id = $7
      `, [newContent, newExcerpt, newExcerptEn, newExcerptJa, newExcerptKo, newExcerptZh, page.id]);
    }
  }

  // 2. services: Replace VietVinh / VVC in content, description, title
  console.log('2. Cleaning services...');
  const { rows: services } = await client.query('SELECT id, slug, title, description, content FROM services');
  for (const s of services) {
    let updated = false;
    let newContent = s.content;
    let newDesc = s.description;

    const replaceText = (text) => {
      if (!text) return text;
      return text
        .replace(/VietVinh/g, 'Thebloomgroup')
        .replace(/Việt Vinh/g, 'Thebloomgroup')
        .replace(/VIETVINH/g, 'Thebloomgroup')
        .replace(/\bVVC\b/g, 'Thebloomgroup');
    };

    if (newContent) {
      const replaced = replaceText(newContent);
      if (replaced !== newContent) {
        newContent = replaced;
        updated = true;
      }
    }
    if (newDesc) {
      const replaced = replaceText(newDesc);
      if (replaced !== newDesc) {
        newDesc = replaced;
        updated = true;
      }
    }

    if (updated) {
      console.log(`  Updating service: ${s.slug}`);
      await client.query(`
        UPDATE services
        SET content = $1, description = $2, updated_at = NOW()
        WHERE id = $3
      `, [newContent, newDesc, s.id]);
    }
  }

  // 3. products: Clean specifications and descriptions
  console.log('3. Cleaning products...');
  const { rows: products } = await client.query('SELECT id, slug, specifications, description FROM products');
  for (const p of products) {
    let specsStr = JSON.stringify(p.specifications || {});
    if (specsStr.includes('VietVinh') || specsStr.includes('VVC') || specsStr.includes('Việt Vinh')) {
      specsStr = specsStr
        .replace(/VietVinh/g, 'Thebloomgroup')
        .replace(/Việt Vinh/g, 'Thebloomgroup')
        .replace(/VIETVINH/g, 'Thebloomgroup')
        .replace(/\bVVC\b/g, 'Thebloomgroup');
      console.log(`  Updating product specs: ${p.slug}`);
      await client.query('UPDATE products SET specifications = $1::jsonb, updated_at = NOW() WHERE id = $2', [specsStr, p.id]);
    }
  }

  // 4. banners: Clean banner descriptions
  console.log('4. Cleaning banners...');
  await client.query(`
    UPDATE banners 
    SET description = REPLACE(description, 'Việt Vinh', 'Thebloomgroup')
    WHERE description LIKE '%Việt Vinh%';
  `);

  // 5. partners: Clean partner names
  console.log('5. Cleaning partners...');
  await client.query(`
    UPDATE partners 
    SET name = 'Thebloomgroup'
    WHERE name ILIKE '%vietvinh%';
  `);

  console.log('=== Purge & Rebrand Complete! ===');
  await client.end();
}

purgeAndRebrand().catch(err => {
  console.error('Purge error:', err);
  process.exit(1);
});
