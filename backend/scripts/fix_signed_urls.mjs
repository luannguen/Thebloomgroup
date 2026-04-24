
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSignedUrls() {
    console.log('Starting to fix signed URLs in database...');

    const tables = [
        { name: 'static_pages', columns: ['content', 'image_url'] },
        { name: 'news', columns: ['image_url'] },
        { name: 'team_members', columns: ['image_url'] },
        { name: 'banners', columns: ['image_url'] },
        { name: 'projects', columns: ['image_url'] },
        { name: 'services', columns: ['image_url'] }
    ];

    let totalUpdated = 0;

    for (const table of tables) {
        console.log(`Scanning table: ${table.name}...`);
        
        const { data: rows, error } = await supabase
            .from(table.name)
            .select(`id, ${table.columns.join(', ')}`);

        if (error) {
            console.error(`Error fetching from ${table.name}:`, error);
            continue;
        }

        for (const row of rows) {
            let hasChanges = false;
            const updates = {};

            for (const col of table.columns) {
                const value = row[col];
                if (!value) continue;

                if (typeof value === 'string') {
                    if (value.includes('/storage/v1/object/sign/media/')) {
                        const publicUrl = value.replace('/storage/v1/object/sign/media/', '/storage/v1/object/public/media/').split('?')[0];
                        console.log(`Replacing in ${table.name}.${col} (ID: ${row.id}): ${value.substring(0, 50)}... -> ${publicUrl}`);
                        updates[col] = publicUrl;
                        hasChanges = true;
                    }
                } else if (typeof value === 'object') {
                    // Handle JSON content (like in static_pages.content)
                    const contentObj = JSON.parse(JSON.stringify(value));
                    let contentChanged = false;

                    const processNode = (node) => {
                        if (!node || typeof node !== 'object') return;
                        for (const key in node) {
                            const val = node[key];
                            if (typeof val === 'string' && val.includes('/storage/v1/object/sign/media/')) {
                                const publicUrl = val.replace('/storage/v1/object/sign/media/', '/storage/v1/object/public/media/').split('?')[0];
                                node[key] = publicUrl;
                                contentChanged = true;
                                hasChanges = true;
                            } else if (typeof val === 'object') {
                                processNode(val);
                            }
                        }
                    };

                    processNode(contentObj);
                    if (contentChanged) {
                        updates[col] = contentObj;
                    }
                }
            }

            if (hasChanges) {
                const { error: updateError } = await supabase
                    .from(table.name)
                    .update(updates)
                    .eq('id', row.id);

                if (updateError) {
                    console.error(`Error updating ${table.name} (ID: ${row.id}):`, updateError);
                } else {
                    console.log(`Successfully updated ${table.name} (ID: ${row.id})`);
                    totalUpdated++;
                }
            }
        }
    }

    console.log(`Finished. Total records updated: ${totalUpdated}`);
}

fixSignedUrls();
