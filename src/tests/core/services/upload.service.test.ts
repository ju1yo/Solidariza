import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UploadService } from '@/core/services/upload.service'
import { AppError } from '@/core/domain/errors/domain.error'
import * as fs from 'fs/promises'

vi.mock('fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs/promises')>()
  const mockWriteFile = vi.fn()
  const mockMkdir = vi.fn()
  return {
    ...actual,
    writeFile: mockWriteFile,
    mkdir: mockMkdir,
    default: {
      ...((actual as any).default || actual),
      writeFile: mockWriteFile,
      mkdir: mockMkdir,
    },
  }
})

describe('UploadService', () => {
  let uploadService: UploadService

  beforeEach(() => {
    uploadService = new UploadService()
    vi.clearAllMocks()
    vi.mocked(fs.mkdir).mockResolvedValue(undefined as any)
    vi.mocked(fs.writeFile).mockResolvedValue(undefined as any)
  })

  it('should upload a valid file', async () => {
    const file = new File(['content'], 'test.png', { type: 'image/png' })
    const result = await uploadService.uploadFile(file)

    expect(result).toContain('/uploads/')
    expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true })
    expect(fs.writeFile).toHaveBeenCalled()
  })

  it('should fail if no file is provided', async () => {
    // @ts-ignore
    await expect(uploadService.uploadFile(null)).rejects.toThrow('Nenhum arquivo enviado')
  })

  it('should fail if file type is not allowed', async () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' })
    await expect(uploadService.uploadFile(file)).rejects.toThrow('Tipo de arquivo não permitido')
  })

  it('should fail if file is too large', async () => {
    const file = new File(['a'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' })
    await expect(uploadService.uploadFile(file)).rejects.toThrow('Arquivo muito grande')
  })

  it('should handle fs errors', async () => {
    vi.mocked(fs.mkdir).mockRejectedValueOnce(new Error('Disk Full'))
    const file = new File([''], 'test.png', { type: 'image/png' })
    
    await expect(uploadService.uploadFile(file)).rejects.toThrow('Falha ao processar upload')
  })
})
