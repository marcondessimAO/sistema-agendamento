$url = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
$zipPath = "$env:TEMP\maven.zip"
$destPath = "C:\maven"
if (-not (Test-Path $destPath)) {
    New-Item -ItemType Directory -Force -Path $destPath | Out-Null
}
Write-Host "Downloading Maven..."
Invoke-WebRequest -Uri $url -OutFile $zipPath
Write-Host "Extracting Maven..."
Expand-Archive -Path $zipPath -DestinationPath $destPath -Force
$mavenBinPath = "C:\maven\apache-maven-3.9.6\bin"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notmatch [regex]::Escape($mavenBinPath)) {
    $newPath = $userPath + ";$mavenBinPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Added Maven to User PATH. You might need to restart your terminal for changes to take effect."
} else {
    Write-Host "Maven is already in User PATH."
}
Write-Host "Done!"
