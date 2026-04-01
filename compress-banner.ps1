# 使用 .NET System.Drawing 压缩图片
Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\Administrator.DESKTOP-BLI48LE\Desktop\ecomafola-peace\public\images\banner-main.jpg"
$outputPath = "C:\Users\Administrator.DESKTOP-BLI48LE\Desktop\banner-main-compressed.jpg"

Write-Host "📊 原始文件大小：$([math]::Round((Get-Item $sourcePath).Length / 1MB, 2)) MB"

# 加载图片
$originalImage = [System.Drawing.Image]::FromFile($sourcePath)
Write-Host "📐 原始尺寸：$($originalImage.Width) x $($originalImage.Height)"

# 创建 Bitmap 对象用于调整质量
$bitmap = New-Object System.Drawing.Bitmap($originalImage.Width, $originalImage.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.DrawImage($originalImage, 0, 0, $originalImage.Width, $originalImage.Height)

# 保存为 JPG（质量 85）
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$quality = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85)
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = $quality

$bitmap.Save($outputPath, $encoder, $encoderParams)

Write-Host "📊 压缩后大小：$([math]::Round((Get-Item $outputPath).Length / 1KB, 2)) KB"
Write-Host "💾 压缩率：$([math]::Round((1 - (Get-Item $outputPath).Length / (Get-Item $sourcePath).Length) * 100, 1))%"
Write-Host "`n✅ 压缩完成：$outputPath"

# 清理
$graphics.Dispose()
$bitmap.Dispose()
$originalImage.Dispose()
