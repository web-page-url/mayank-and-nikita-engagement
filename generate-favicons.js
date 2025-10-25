import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicons() {
  const inputPath = path.join(__dirname, 'public', 'manik-hero-5.jpeg');
  const outputDir = path.join(__dirname, 'public');

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    console.error('Input file not found:', inputPath);
    return;
  }

  console.log('Generating favicons from:', inputPath);

  try {
    // Read the input image
    const inputBuffer = fs.readFileSync(inputPath);

    // Define favicon sizes and their output paths
    const faviconConfigs = [
      { size: 16, name: 'favicon-16x16.png' },
      { size: 32, name: 'favicon-32x32.png' },
      { size: 180, name: 'apple-touch-icon.png' },
      { size: 192, name: 'android-chrome-192x192.png' },
      { size: 512, name: 'android-chrome-512x512.png' },
    ];

    // Generate individual PNG files
    for (const config of faviconConfigs) {
      await sharp(inputBuffer)
        .resize(config.size, config.size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(path.join(outputDir, config.name));

      console.log(`✓ Generated ${config.name} (${config.size}x${config.size})`);
    }

    // Generate ICO file with multiple sizes
    await sharp(inputBuffer)
      .resize(32, 32, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(outputDir, 'favicon-temp-32.png'));

    await sharp(inputBuffer)
      .resize(16, 16, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(outputDir, 'favicon-temp-16.png'));

    // For ICO, we'll use the 32x32 version as the main favicon.ico
    // (browsers will typically use the highest quality available)
    await sharp(path.join(outputDir, 'favicon-temp-32.png'))
      .toFile(path.join(outputDir, 'favicon.ico'));

    console.log('✓ Generated favicon.ico');

    // Clean up temp files
    try {
      fs.unlinkSync(path.join(outputDir, 'favicon-temp-16.png'));
      fs.unlinkSync(path.join(outputDir, 'favicon-temp-32.png'));
    } catch (err) {
      // Ignore cleanup errors
    }

    console.log('\n🎉 All favicons generated successfully!');
    console.log('Files created:');
    console.log('- favicon.ico');
    console.log('- favicon-16x16.png');
    console.log('- favicon-32x32.png');
    console.log('- apple-touch-icon.png');
    console.log('- android-chrome-192x192.png');
    console.log('- android-chrome-512x512.png');

  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

// Run the function
generateFavicons();
