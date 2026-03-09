import { useState, useEffect } from 'react';

function LandscapePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkDeviceAndOrientation = () => {
      // Check orientation
      const portrait = window.innerHeight > window.innerWidth;
      
      // Screen dimensions
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const minDimension = Math.min(screenWidth, screenHeight);
      const maxDimension = Math.max(screenWidth, screenHeight);
      
      // Check if touch device
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // User agent and platform
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = (navigator.platform || '').toLowerCase();
      const vendor = (navigator.vendor || '').toLowerCase();
      
      // Multiple iPad detection methods
      const isIPadUserAgent = /ipad/.test(userAgent);
      const isIPadPlatform = /ipad/.test(platform);
      const isIPadOS13Plus = platform === 'macintel' && navigator.maxTouchPoints > 1;
      const isAppleDevice = /apple/.test(vendor) || /mac/.test(platform);
      
      // iPad specific screen resolutions (considering device pixel ratio)
      const pixelRatio = window.devicePixelRatio || 1;
      const actualWidth = screenWidth * pixelRatio;
      const actualHeight = screenHeight * pixelRatio;
      const actualMin = Math.min(actualWidth, actualHeight);
      const actualMax = Math.max(actualWidth, actualHeight);
      
      // Common iPad screen sizes (physical pixels)
      const iPadScreenSizes = [
        { min: 1536, max: 2048 },  // iPad Mini, iPad Air, iPad Pro 9.7"
        { min: 1668, max: 2224 },  // iPad Pro 10.5"
        { min: 1668, max: 2388 },  // iPad Pro 11"
        { min: 2048, max: 2732 },  // iPad Pro 12.9"
        { min: 1640, max: 2360 },  // iPad Air (2020+)
      ];
      
      const matchesIPadScreen = iPadScreenSizes.some(size => 
        (actualMin >= size.min - 50 && actualMin <= size.min + 50) &&
        (actualMax >= size.max - 50 && actualMax <= size.max + 50)
      );
      
      // Logical pixel check (CSS pixels)
      const logicalIPadSizes = [
        { min: 768, max: 1024 },   // Most iPads
        { min: 820, max: 1180 },   // iPad Air 2020+
        { min: 834, max: 1112 },   // iPad Pro 10.5"
        { min: 834, max: 1194 },   // iPad Pro 11"
        { min: 1024, max: 1366 },  // iPad Pro 12.9"
      ];
      
      const matchesLogicalSize = logicalIPadSizes.some(size =>
        (minDimension >= size.min - 10 && minDimension <= size.min + 10) &&
        (maxDimension >= size.max - 10 && maxDimension <= size.max + 10)
      );
      
      // Comprehensive iPad detection
      const isIPad = 
        isIPadUserAgent ||
        isIPadPlatform ||
        isIPadOS13Plus ||
        (isAppleDevice && isTouchDevice && (matchesIPadScreen || matchesLogicalSize)) ||
        (isAppleDevice && isTouchDevice && minDimension >= 768 && minDimension <= 1024);
      
      // Android tablet detection
      const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);
      
      // Generic tablet by size
      const isTabletSize = isTouchDevice && minDimension >= 600 && maxDimension >= 960;
      
      // Phone detection (to exclude)
      const isPhone = /iphone|android.*mobile|windows phone/.test(userAgent) ||
                     (isTouchDevice && minDimension < 600);
      
      // Combine all checks
      const isTabletDevice = (isIPad || isAndroidTablet || isTabletSize) && !isPhone;

    //   // Debug logging
    //   console.log('🔍 Device Detection:', {
    //     userAgent,
    //     platform,
    //     vendor,
    //     isIPadUserAgent,
    //     isIPadPlatform,
    //     isIPadOS13Plus,
    //     isAppleDevice,
    //     isIPad,
    //     isAndroidTablet,
    //     isPhone,
    //     '--- Screen Info ---': '---',
    //     screenWidth,
    //     screenHeight,
    //     windowWidth,
    //     windowHeight,
    //     minDimension,
    //     maxDimension,
    //     pixelRatio,
    //     actualWidth,
    //     actualHeight,
    //     actualMin,
    //     actualMax,
    //     matchesIPadScreen,
    //     matchesLogicalSize,
    //     '--- Final ---': '---',
    //     isTouchDevice,
    //     isTabletSize,
    //     isTabletDevice,
    //     portrait,
    //     showingPrompt: isTabletDevice && portrait,
    //     maxTouchPoints: navigator.maxTouchPoints
    //   });

      setShowPrompt(isTabletDevice && portrait);
    };

    checkDeviceAndOrientation();

    window.addEventListener('resize', checkDeviceAndOrientation);
    window.addEventListener('orientationchange', checkDeviceAndOrientation);

    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', checkDeviceAndOrientation);
    }

    return () => {
      window.removeEventListener('resize', checkDeviceAndOrientation);
      window.removeEventListener('orientationchange', checkDeviceAndOrientation);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', checkDeviceAndOrientation);
      }
    };
  }, []);

  if (!showPrompt) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      zIndex: 9999
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱 ↻</div>
      <h2>Please rotate your device</h2>
      <p>This app works best in landscape mode</p>
    </div>
  );
}

export default LandscapePrompt;