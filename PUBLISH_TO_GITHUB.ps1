$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$repo = 'https://github.com/kyumin-5/fit-id-official-site.git'
Write-Host 'FIT ID official website: GitHub publishing' -ForegroundColor Cyan
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is not installed.' }
$existing = (git rev-parse --show-toplevel 2>$null)
if ($existing) {
  $root = (Resolve-Path .).Path.Replace('\','/')
  if ($existing.Replace('\','/') -ne $root) { throw 'This directory is nested in an existing Git repository. Extract this ZIP into a separate folder.' }
} else {
  git init -b main
  if ($LASTEXITCODE -ne 0) { throw 'git init failed.' }
}
git add index.html styles.css app.js robots.txt package.json README.md vercel.json assets/favicon.svg assets/og-image.svg assets/og-image.png .gitignore PUBLISH_TO_GITHUB.ps1
if ($LASTEXITCODE -ne 0) { throw 'git add failed.' }
$staged = git diff --cached --name-only
if ($staged) {
  git commit -m 'Initial FIT ID official homepage'
  if ($LASTEXITCODE -ne 0) { throw 'Git commit failed. Configure git user.name and user.email if needed.' }
}
$origin = git remote get-url origin 2>$null
if (-not $origin) { git remote add origin $repo }
elseif ($origin -ne $repo) { throw "Existing origin differs: $origin" }
git branch -M main
git push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'Push failed. Create an empty GitHub repository kyumin-5/fit-id-official-site and sign in to Git first.' }
Write-Host 'Success: https://github.com/kyumin-5/fit-id-official-site' -ForegroundColor Green
Write-Host 'Next: connect GitHub repository in Vercel project Settings > Git.'