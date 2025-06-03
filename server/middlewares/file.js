const { unlink } = require('fs/promises')
const { dirname, join } = require('path')
const { fileURLToPath } = require('url')
const ApiError = require('../Error/ApiError')

// путь к текущей директории
const _dirname = dirname(fileURLToPath(import.meta.url))

// путь к директории с файлами
const fileDir = join(_dirname, '../static')

// утилита для получения пути к файлу
export const getFilePath = (filePath) => join(fileDir, filePath)

// утилита для удаления файла
export const removeFile = async (filePath) => {
    try {
        await unlink(join(fileDir, filePath))
    } catch (e) {
        new ApiError.badRequest(e.message)
    }
}