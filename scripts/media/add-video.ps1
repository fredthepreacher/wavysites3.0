<#
  Adds one portfolio video (or the hero reel) to the site in web-ready form.

    pwsh scripts/media/add-video.ps1 -Video <clip.mp4> -Poster <frame.jpg> -Id vertical-builders
    pwsh scripts/media/add-video.ps1 -Video <reel.mp4> -Poster <reel.jpg> -Id wavy-sites-portfolio-reel -Kind hero

  Writes to assets/video/<projects|hero>/:
    <id>.mp4         the clip (copied byte-for-byte when already silent + fast-start; otherwise remuxed)
    <id>.jpg         original poster (fallback)
    <id>-1280.webp   poster for wide screens / retina cards
    <id>-640.webp    poster for phones / standard cards
    <id>-960.mp4     hero only: lighter encode for phones

  Requires ffmpeg + ffprobe on PATH. Never adds an audio track. Then add the card markup (see
  docs/VIDEO_UPGRADE_2026-11-02.md) and a row to docs/video-manifest.json.
#>
param(
  [Parameter(Mandatory = $true)][string]$Video,
  [Parameter(Mandatory = $true)][string]$Poster,
  [Parameter(Mandatory = $true)][ValidatePattern('^[a-z0-9]+(-[a-z0-9]+)*$')][string]$Id,
  [ValidateSet('project', 'hero')][string]$Kind = 'project'
)

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$dest = Join-Path $root ("assets\video\" + ($(if ($Kind -eq 'hero') { 'hero' } else { 'projects' })))
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$probe = ffprobe -v error -show_entries stream=codec_type,codec_name,width,height -of json -- $Video | ConvertFrom-Json
$hasAudio = @($probe.streams | Where-Object codec_type -eq 'audio').Count -gt 0
$head = [System.Text.Encoding]::ASCII.GetString([System.IO.File]::ReadAllBytes($Video)[0..8191])
$fastStart = $head.Contains('moov') -and (-not $head.Contains('mdat') -or $head.IndexOf('moov') -lt $head.IndexOf('mdat'))

$mp4 = Join-Path $dest "$Id.mp4"
if (-not $hasAudio -and $fastStart) {
  Copy-Item -LiteralPath $Video -Destination $mp4 -Force
} else {
  # Strip any audio and move the index to the front so playback can start before the file finishes downloading.
  ffmpeg -v error -y -i $Video -map 0:v:0 -c copy -an -movflags +faststart $mp4
}

Copy-Item -LiteralPath $Poster -Destination (Join-Path $dest "$Id.jpg") -Force
ffmpeg -v error -y -i $Poster -vf "scale=1280:-2" -c:v libwebp -quality 72 -compression_level 6 (Join-Path $dest "$Id-1280.webp")
ffmpeg -v error -y -i $Poster -vf "scale=640:-2" -c:v libwebp -quality 70 -compression_level 6 (Join-Path $dest "$Id-640.webp")

if ($Kind -eq 'hero') {
  ffmpeg -v error -y -i $Video -vf "scale=960:-2" -c:v libx264 -preset slow -crf 30 -profile:v high -pix_fmt yuv420p -an -movflags +faststart (Join-Path $dest "$Id-960.mp4")
}

Get-ChildItem -LiteralPath $dest -Filter "$Id*" | ForEach-Object { "{0,-44} {1,10:N0} B" -f $_.Name, $_.Length }
