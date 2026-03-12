param(
  [string]$SourceDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$OutputDir = (Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..")).Path ".deploy"),
  [string]$MeasurementId = $env:GA_MEASUREMENT_ID,
  [string]$EnvFilePath = (Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..")).Path ".env.deploy")
)

$ErrorActionPreference = "Stop"

if (-not $MeasurementId -and (Test-Path $EnvFilePath)) {
  $envRaw = Get-Content -Path $EnvFilePath -Raw
  # Support UTF BOM and common .env formats (with optional "export" and quotes).
  $match = [regex]::Match(
    $envRaw,
    "(?im)^(?:\uFEFF)?\s*(?:export\s+)?GA_MEASUREMENT_ID\s*=\s*(.+?)\s*$"
  )
  if ($match.Success) {
    $MeasurementId = $match.Groups[1].Value.Trim().Trim("'`"")
  }
}

if (Test-Path $OutputDir) {
  Remove-Item -Path $OutputDir -Recurse -Force
}

New-Item -ItemType Directory -Path $OutputDir | Out-Null

$excludeDirs = @(
  ".git",
  "node_modules",
  ".deploy",
  "scripts",
  "admin"
)

# Copy top-level entries except excluded ones to avoid copying .deploy into itself.
Get-ChildItem -Path $SourceDir -Force | ForEach-Object {
  if ($excludeDirs -notcontains $_.Name) {
    Copy-Item -Path $_.FullName -Destination $OutputDir -Recurse -Force
  }
}

foreach ($dir in $excludeDirs) {
  $target = Join-Path $OutputDir $dir
  if (Test-Path $target) {
    Remove-Item -Path $target -Recurse -Force
  }
}

$excludeFiles = @(
  "deploy.log",
  "deploy.txt",
  "Makefile",
  "README.md",
  "package.json",
  "package-lock.json"
)

foreach ($file in $excludeFiles) {
  $target = Join-Path $OutputDir $file
  if (Test-Path $target) {
    Remove-Item -Path $target -Force
  }
}

$indexPath = Join-Path $OutputDir "index.html"
if (-not (Test-Path $indexPath)) {
  throw "index.html not found in $OutputDir"
}

$indexContent = Get-Content -Path $indexPath -Raw

$gaTag = ""
if ($MeasurementId) {
  $gaTag = @"
    <script async src="https://www.googletagmanager.com/gtag/js?id=$MeasurementId"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '$MeasurementId');
    </script>
"@
}

if ($indexContent -match "<!-- GA_TAG -->") {
  $indexContent = $indexContent.Replace("<!-- GA_TAG -->", $gaTag)
} else {
  $indexContent = $indexContent -replace "</head>", "$gaTag`r`n</head>"
}

Set-Content -Path $indexPath -Value $indexContent -Encoding UTF8

Write-Host "Prepared deploy folder: $OutputDir"
if ($MeasurementId) {
  Write-Host "GA tag injected with measurement id: $MeasurementId"
} else {
  Write-Warning "GA_MEASUREMENT_ID missing: no GA tag injected."
}
