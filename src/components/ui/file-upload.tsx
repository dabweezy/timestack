'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploadProps {
  onChange: (files: File[]) => void
  accept?: string
  maxFiles?: number
  maxSize?: number
  className?: string
  disabled?: boolean
  preview?: boolean
  existingImage?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  accept = 'image/*',
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
  disabled = false,
  preview = true,
  existingImage
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles)
    setFiles(newFiles)
    
    if (preview) {
      const urls = newFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
    
    onChange(newFiles)
  }, [maxFiles, preview, onChange])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxFiles,
    maxSize,
    disabled
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    
    setFiles(newFiles)
    setPreviewUrls(newUrls)
    onChange(newFiles)
  }

  const hasFiles = files.length > 0 || existingImage

  const rootProps = getRootProps()

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        {...(rootProps as any)}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : hasFiles 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
        animate={!hasFiles && !isDragActive ? {
          boxShadow: [
            '0 0 0 0 rgba(59, 130, 246, 0)',
            '0 0 0 4px rgba(59, 130, 246, 0.1)',
            '0 0 0 0 rgba(59, 130, 246, 0)'
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: !hasFiles && !isDragActive ? Infinity : 0,
          ease: "easeInOut"
        }}
        whileHover={!disabled ? {
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        } : {}}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {!hasFiles ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <motion.div 
                className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  animate={{ 
                    y: isDragActive ? [-2, 2, -2] : 0,
                    rotate: isDragActive ? [-2, 2, -2] : 0
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: isDragActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <Upload className="w-8 h-8 text-gray-600" />
                </motion.div>
              </motion.div>
              <div>
                <motion.p 
                  className="text-lg font-medium text-gray-900"
                  animate={{ 
                    color: isDragActive ? "#3B82F6" : "#111827"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isDragActive ? 'Drop files here' : 'Upload file'}
                </motion.p>
                <motion.p 
                  className="text-sm text-gray-500 mt-1"
                  animate={{ 
                    color: isDragActive ? "#60A5FA" : "#6B7280"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Drag or drop your files here or click to upload
                </motion.p>
                {(accept === 'image/*' || accept === 'image/*,.pdf') && (
                  <motion.p 
                    className="text-xs text-gray-400 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {accept === 'image/*' ? 'PNG, JPG, GIF' : 'Images, PDF'} up to {Math.round(maxSize / 1024 / 1024)}MB
                  </motion.p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Existing Image */}
              {existingImage && !files.length && (
                <motion.div 
                  className="relative inline-block"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <img
                    src={existingImage}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg mx-auto shadow-md"
                  />
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange([])
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </motion.div>
              )}
              
              {/* New Files */}
              <div className="flex flex-wrap justify-center gap-2">
                {previewUrls.map((url, index) => (
                  <motion.div 
                    key={index} 
                    className="relative inline-block"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: index * 0.1 
                    }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm font-medium text-gray-900">
                  {files.length > 0 ? `${files.length} file(s) selected` : 'Image uploaded'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click to change or drag to replace
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Error Messages */}
      {fileRejections.length > 0 && (
        <div className="mt-2 text-sm text-red-600">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              {errors.map(error => (
                <p key={error.code}>
                  {error.code === 'file-too-large' 
                    ? `File is too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`
                    : error.message
                  }
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
