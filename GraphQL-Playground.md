# mutation SingleUploadMutation($file: Upload!) {
#   singleUpload(file: $file) {
#     encoding filename mimetype
#   }
# }

mutation UploadFile($file: Upload!) {
  uploadFile(file: $file)
}