import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres';

const ITEMS_TO_MOVE = [
  'a7469b72-393e-4324-818a-7b945ec07243', // Sản phẩm
  '155a258c-e42d-487a-a6eb-6cb0591bdcaa', // Dịch vụ
  'd19790e6-601e-4bab-998a-3ec450cfffb3', // Dự án
  'b8f762a9-dcb0-4841-b287-cf6525752886', // Đội ngũ
  'cae770ac-35fa-4f81-8e13-8d79ba14c7b0'  // Tin tức
];

async function reorganizeMenu() {
  const client = new Client({ connectionString });
  console.log('🔄 Đang bắt đầu tái cấu trúc menu...');

  try {
    await client.connect();
    await client.query('BEGIN');

    // 1. Create "Khám phá" menu item
    const insertRes = await client.query(
      "INSERT INTO navigation (label, path, position, order_index, is_active, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      ['Khám phá', '#', 'header', 5, true, 'internal']
    );
    const exploreId = insertRes.rows[0].id;
    console.log(`✅ Đã tạo menu "Khám phá" (ID: ${exploreId})`);

    // 2. Move items to be children of "Khám phá"
    for (let i = 0; i < ITEMS_TO_MOVE.length; i++) {
        const id = ITEMS_TO_MOVE[i];
        await client.query(
            "UPDATE navigation SET parent_id = $1, order_index = $2 WHERE id = $3",
            [exploreId, i + 1, id]
        );
        console.log(`  - Đã di chuyển mục ID ${id} vào submenu.`);
    }

    // 3. Update "Liên hệ" order
    await client.query(
        "UPDATE navigation SET order_index = 6 WHERE label = 'Liên hệ' AND position = 'header'"
    );
    console.log('✅ Đã cập nhật vị trí cho mục "Liên hệ".');

    // 4. Ensure previous items (1-4) are correct
    // (Already correct: 1-Giới thiệu, 2-HỆ THỐNG LẠNH, 3-Cơ điện, 4-Trung tâm dữ liệu)

    await client.query('COMMIT');
    console.log('🎉 Tái cấu trúc menu hoàn tất!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Lỗi:', err.message);
  } finally {
    await client.end();
  }
}

reorganizeMenu();
