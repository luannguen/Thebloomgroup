import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function - Media API
 *
 * Endpoints:
 *   GET  /api/media?action=list&folder=uploads
 *   POST /api/media  { action: 'delete', path: '...' }
 *   POST /api/media  { action: 'getUploadUrl', path: '...' }
 *   POST /api/media  { action: 'cleanup', folder: '...' }
 */

function getSupabaseAdmin() {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !key) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

const BUCKET = 'media';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const supabase = getSupabaseAdmin();
        const action = req.method === 'GET'
            ? (req.query.action as string)
            : (req.body as Record<string, string>)?.action;

        switch (action) {
            case 'list': {
                const folder = (req.method === 'GET'
                    ? (req.query.folder as string)
                    : (req.body as Record<string, string>)?.folder) || 'uploads';

                const { data, error } = await supabase.storage
                    .from(BUCKET)
                    .list(folder, {
                        limit: 100,
                        offset: 0,
                        sortBy: { column: 'created_at', order: 'desc' },
                    });

                if (error) {
                    return res.status(400).json({ error: error.message });
                }

                const files = data.filter(item => item.name && item.name !== '.emptyFolderPlaceholder');
                const paths = files.map(item => `${folder}/${item.name}`);

                const { data: signedUrls } = await supabase.storage
                    .from(BUCKET)
                    .createSignedUrls(paths, 3600);

                const items = files.map((item, index) => {
                    const signedUrl = signedUrls?.[index]?.signedUrl;
                    const fallbackUrl = supabase.storage
                        .from(BUCKET)
                        .getPublicUrl(`${folder}/${item.name}`).data.publicUrl;

                    return {
                        ...item,
                        url: signedUrl || fallbackUrl,
                        path: `${folder}/${item.name}`,
                    };
                });

                return res.status(200).json({ data: items });
            }

            case 'getUploadUrl': {
                const filePath = (req.body as Record<string, string>)?.path;
                if (!filePath) {
                    return res.status(400).json({ error: 'path is required' });
                }

                const { data, error } = await supabase.storage
                    .from(BUCKET)
                    .createSignedUploadUrl(filePath);

                if (error) {
                    return res.status(400).json({ error: error.message });
                }

                return res.status(200).json({ data });
            }

            case 'delete': {
                const deletePath = (req.body as Record<string, string>)?.path;
                if (!deletePath) {
                    return res.status(400).json({ error: 'path is required' });
                }

                const { error } = await supabase.storage
                    .from(BUCKET)
                    .remove([deletePath]);

                if (error) {
                    return res.status(400).json({ error: error.message });
                }

                return res.status(200).json({ success: true });
            }

            case 'cleanup': {
                const cleanupFolder = (req.body as Record<string, string>)?.folder || 'uploads';

                const { data, error } = await supabase.storage
                    .from(BUCKET)
                    .list(cleanupFolder, { limit: 200, offset: 0 });

                if (error) {
                    return res.status(400).json({ error: error.message });
                }

                const files = data.filter(item => item.name && item.name !== '.emptyFolderPlaceholder');
                const ghostPaths: string[] = [];

                for (const file of files) {
                    const fp = `${cleanupFolder}/${file.name}`;
                    const { error: dlError } = await supabase.storage
                        .from(BUCKET)
                        .download(fp);

                    if (dlError) {
                        ghostPaths.push(fp);
                    }
                }

                if (ghostPaths.length > 0) {
                    await supabase.storage
                        .from(BUCKET)
                        .remove(ghostPaths);
                }

                return res.status(200).json({
                    data: { deleted: ghostPaths.length, kept: files.length - ghostPaths.length },
                });
            }

            default:
                return res.status(400).json({ error: `Unknown action: ${action}` });
        }
    } catch (err: unknown) {
        console.error('Media API error:', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return res.status(500).json({ error: message });
    }
}
