import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:X1PODLTRV56BMPTQ@db.okccyedrnmzzprqotilz.supabase.co:5432/postgres'
});

async function updateFooter() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Check existing footer items
    const res = await client.query("SELECT id, label, path FROM navigation WHERE position = 'footer'");
    console.log('Current footer items:', res.rows);

    // Deactivate old footer items
    await client.query("UPDATE navigation SET is_active = false WHERE position = 'footer'");

    // Create 2 clean columns for footer:
    // Column 1: 'Về TheBloom Group'
    const col1 = await client.query(
      `INSERT INTO navigation (label, path, position, order_index, is_active, type)
       VALUES ('Về TheBloom Group', '/#', 'footer', 1, true, 'custom')
       RETURNING id`
    );
    const col1Id = col1.rows[0].id;

    // Children of Col 1
    const col1Children = [
      { label: 'Giới thiệu chung', path: '/about-us', order_index: 1 },
      { label: 'Liên hệ hợp tác', path: '/contact', order_index: 2 }
    ];
    for (const c of col1Children) {
      await client.query(
        `INSERT INTO navigation (label, path, position, order_index, is_active, type, parent_id)
         VALUES ($1, $2, 'footer', $3, true, 'internal', $4)`,
        [c.label, c.path, c.order_index, col1Id]
      );
    }

    // Column 2: 'Lĩnh vực hoạt động'
    const col2 = await client.query(
      `INSERT INTO navigation (label, path, position, order_index, is_active, type)
       VALUES ('Lĩnh vực hoạt động', '/#', 'footer', 2, true, 'custom')
       RETURNING id`
    );
    const col2Id = col2.rows[0].id;

    // Children of Col 2
    const col2Children = [
      { label: 'Thiết bị giặt là', path: '/thiet-bi-giat-la', order_index: 1 },
      { label: 'Thời trang và may mặc', path: '/thoi-trang-may-mac', order_index: 2 },
      { label: 'Không gian sống', path: '/khong-gian-song', order_index: 3 },
      { label: 'Giải pháp dịch vụ', path: '/giai-phap-dich-vu', order_index: 4 }
    ];
    for (const c of col2Children) {
      await client.query(
        `INSERT INTO navigation (label, path, position, order_index, is_active, type, parent_id)
         VALUES ($1, $2, 'footer', $3, true, 'internal', $4)`,
        [c.label, c.path, c.order_index, col2Id]
      );
    }

    await client.query('COMMIT');
    console.log('Footer navigation updated successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error updating footer nav:', e);
  } finally {
    client.release();
    await pool.end();
  }
}

updateFooter().catch(console.error);
