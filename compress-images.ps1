# 图片压缩脚本（使用 .NET System.Drawing）
# 不需要额外安装 Python 库

$imagesDir = "C:\Users\Administrator.DESKTOP-BLI48LE\Desktop\ecomafola-peace\public\images"

Write-Host "🔍 扫描图片..."
$images = Get-ChildItem -Path $imagesDir -Recurse -Include *.jpg,*.jpeg,*.png | Where-Object { $_.Length -gt 300KB }

Write-Host "📊 找到 $($images.Count) 张需要压缩的图片`n"

foreach ($img in $images) {
    $sizeMB = [math]::Round($img.Length / 1MB, 2)
    Write-Host "🖼️  $($img.Name) ($sizeMB MB)"
    
    # 这里需要调用外部压缩工具
    # 建议手动用 https://tinypng.com/ 压缩
}

Write-Host "`n💡 请使用 https://tinypng.com/ 批量压缩这些图片"
Write-Host "   压缩后替换原文件，然后运行：vercel --prod"
