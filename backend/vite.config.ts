import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import type { IncomingMessage, ServerResponse } from 'http'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (including non-VITE_ ones) for server-side use
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      // Dev API middleware - proxies /api/media requests locally using Service Role Key
      {
        name: 'media-api-dev',
        configureServer(server) {
          const supabaseUrl = env.VITE_SUPABASE_URL || ''
          const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || ''

          if (!serviceRoleKey) {
            console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found in .env - /api/media will not work in dev')
            return
          }

          const adminClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
          })

          const BUCKET = 'media'

          // Parse JSON body from request
          function parseBody(req: IncomingMessage): Promise<Record<string, string>> {
            return new Promise((resolve) => {
              let data = ''
              req.on('data', (chunk: Buffer) => { data += chunk.toString() })
              req.on('end', () => {
                try { resolve(JSON.parse(data)) } catch { resolve({}) }
              })
            })
          }

          server.middlewares.use('/api/media', async (req: IncomingMessage, res: ServerResponse) => {
            res.setHeader('Content-Type', 'application/json')

            try {
              const body: Record<string, string> = req.method === 'POST' ? await parseBody(req) : {}
              const parsedUrl = new URL(req.url || '', 'http://localhost')
              const action = req.method === 'GET' ? parsedUrl.searchParams.get('action') : body.action

              switch (action) {
                case 'list': {
                  const folder = (req.method === 'GET' ? parsedUrl.searchParams.get('folder') : body.folder) || 'uploads'
                  const { data, error } = await adminClient.storage
                    .from(BUCKET)
                    .list(folder, { limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } })

                  if (error) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ error: error.message }))
                    return
                  }

                  const files = data.filter(item => item.name && item.name !== '.emptyFolderPlaceholder')
                  const paths = files.map(item => `${folder}/${item.name}`)
                  const { data: signedUrls } = await adminClient.storage.from(BUCKET).createSignedUrls(paths, 3600)

                  const items = files.map((item, index) => ({
                    ...item,
                    url: signedUrls?.[index]?.signedUrl || adminClient.storage.from(BUCKET).getPublicUrl(`${folder}/${item.name}`).data.publicUrl,
                    path: `${folder}/${item.name}`,
                  }))

                  res.end(JSON.stringify({ data: items }))
                  return
                }

                case 'getUploadUrl': {
                  const filePath = body.path
                  if (!filePath) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ error: 'path is required' }))
                    return
                  }
                  const { data, error } = await adminClient.storage.from(BUCKET).createSignedUploadUrl(filePath)
                  if (error) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ error: error.message }))
                    return
                  }
                  res.end(JSON.stringify({ data }))
                  return
                }

                case 'delete': {
                  const deletePath = body.path
                  if (!deletePath) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ error: 'path is required' }))
                    return
                  }
                  const { error } = await adminClient.storage.from(BUCKET).remove([deletePath])
                  if (error) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ error: error.message }))
                    return
                  }
                  res.end(JSON.stringify({ success: true }))
                  return
                }

                case 'cleanup': {
                  const cleanupFolder = body.folder || 'uploads'
                  const { data, error } = await adminClient.storage.from(BUCKET).list(cleanupFolder, { limit: 200, offset: 0 })
                  if (error) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ error: error.message }))
                    return
                  }

                  const files = data.filter(item => item.name && item.name !== '.emptyFolderPlaceholder')
                  const ghostPaths: string[] = []

                  for (const file of files) {
                    const fp = `${cleanupFolder}/${file.name}`
                    const { error: dlErr } = await adminClient.storage.from(BUCKET).download(fp)
                    if (dlErr) ghostPaths.push(fp)
                  }

                  if (ghostPaths.length > 0) {
                    await adminClient.storage.from(BUCKET).remove(ghostPaths)
                  }

                  res.end(JSON.stringify({ data: { deleted: ghostPaths.length, kept: files.length - ghostPaths.length } }))
                  return
                }

                default:
                  res.statusCode = 400
                  res.end(JSON.stringify({ error: `Unknown action: ${action}` }))
                  return
              }
            } catch (err: unknown) {
              console.error('Dev Media API error:', err)
              res.statusCode = 500
              const message = err instanceof Error ? err.message : 'Internal server error'
              res.end(JSON.stringify({ error: message }))
            }
          })

          console.log('✅ Dev media API middleware registered at /api/media')
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
