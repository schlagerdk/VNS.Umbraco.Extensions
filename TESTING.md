# Testing Guide - VNS Umbraco Extensions UFM

## Quick Start Testing

### 1. Verify Build & Deployment

```bash
# Build
npm run build

# Check output folder exists
ls -la App_Plugins/VNS.Umbraco.Extensions/dist/

# Should show:
# - umbraco-package.js
# - manifests.js
# - Filters/DateFormat.filter.js
# - Components/badge/badge.component.js
```

### 2. Copy to Umbraco

```bash
# Copy the entire plugin folder
cp -r App_Plugins/VNS.Umbraco.Extensions /path/to/your/umbraco/wwwroot/App_Plugins/

# Then restart Umbraco (recycle app pool or restart server)
```

### 3. Open Umbraco & Test

1. Login to Umbraco backoffice
2. Open browser Developer Tools (F12)
3. Go to **Console** tab
4. Look for any JavaScript errors related to VNS or UFM

### 4. Test dateFormat Filter

**Test Case 1: Hard-coded test (confirms filter is loaded)**

Create a label template with:
```
${dateFormat('2026-04-24 13:45:00', 'dd-MM-yyyy')}
```

Expected output: `24-04-2026`

**If this fails:**
- Check console for errors
- Verify `umbraco-package.js` is loaded (Network tab)
- Hard refresh browser: Ctrl+Shift+R
- Restart Umbraco

**Test Case 2: With property**

Create a label template with:
```
{= myDateProperty | dateFormat:dd-MM-yyyy}
```

Expected: Date formatted as `24-04-2026`

**If this shows unchanged:**
- Confirm `myDateProperty` exists on your document type
- Check console for value of `myDateProperty`
- Verify it's a DateTime property (not text)

**Test Case 3: Different formats**

Try these in a label template:
```
${dateFormat('2026-04-24 13:45:00', 'short')}
${dateFormat('2026-04-24 13:45:00', 'long')}
${dateFormat('2026-04-24 13:45:00', 'monthYear')}
${dateFormat('2026-04-24 13:45:00', 'MMMM dd, yyyy')}
```

### 5. Test Badge Component

**Test Case 1: Boolean property**

Create a label template with:
```
{badge:isBestSeller:BESTSELLER:positive:secondary}
```

Expected:
- If `isBestSeller` = true → Blue badge shows "BESTSELLER"
- If `isBestSeller` = false/null → No badge

**Test Case 2: String property**

Create a label template with:
```
{badge:status}
```

Expected:
- If `status` has value → Badge shows the value
- If `status` is empty → No badge

**Test Case 3: Settings**

Create a label template with:
```
{badge:$settings.featured:FEATURED:warning:outline}
```

Expected:
- If `$settings.featured` = true → Yellow badge
- If false → No badge

## Troubleshooting Checklist

### Plugin Not Loading

```bash
# 1. Verify files exist
ls -la /path/to/umbraco/wwwroot/App_Plugins/VNS.Umbraco.Extensions/dist/

# 2. Check console in browser (F12 > Console)
# Look for messages like: "VNS.Umbraco.Extensions" or UFM errors

# 3. Hard refresh browser
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)

# 4. Clear browser cache completely
# Or use Private/Incognito window for fresh test
```

### dateFormat Not Found

```javascript
// In browser console, test:
console.log(typeof dateFormat);  // Should be 'function'

// If not 'function', the filter didn't load
// Check:
// - Is umbraco-package.js loaded? (Network tab)
// - Any errors in console?
// - Did you restart Umbraco?
```

### dateFormat Returns Unchanged Value

```javascript
// In a label template, test:
${dateAndTime}                    // What's the actual value?
${typeof dateAndTime}             // Is it a string? Date object?
${dateAndTime ? 'exists' : 'null'} // Does property exist?

// Common issues:
// 1. Property doesn't exist (typo in alias)
// 2. Property value is null/undefined
// 3. Property is not a date (it's plain text)
```

### Badge Not Showing

```javascript
// In a label template, test:
${isFree}                         // Is property value truthy?
${typeof isFree}                  // What type is it?
${isFree ? 'show' : 'hide'}       // Should show 'show' if property is true

// If property shows value but badge doesn't appear:
// - The component might not be registered
// - Check console for UFM component errors
// - Restart Umbraco and hard refresh
```

## File Locations

```
Umbraco installation:
wwwroot/
└── App_Plugins/
    └── VNS.Umbraco.Extensions/
        ├── dist/                    (compiled output)
        │   ├── umbraco-package.js
        │   ├── manifests.js
        │   ├── Filters/
        │   │   └── DateFormat.filter.js
        │   └── Components/badge/
        │       ├── badge.component.js
        │       └── badge.element.js
        └── umbraco-package.json     (Umbraco manifest)
```

## Console Commands for Testing

Open browser console (F12) and run:

```javascript
// Check if dateFormat is available
window.dateFormat

// Check loaded manifests
// (varies by Umbraco version - check network tab for manifests.js)

// Test date formatting directly
dateFormat('2026-04-24', 'dd-MM-yyyy')
```

## Common Scenarios

### Scenario 1: Everything Loads But Nothing Works

1. Check console for any red errors
2. Verify the label template syntax is correct
3. Hard refresh browser (Ctrl+Shift+R)
4. Restart Umbraco
5. Check if property aliases match your document type

### Scenario 2: dateFormat Works, Badge Doesn't

1. dateFormat loading ✅ means the plugin loaded
2. Badge might need different approach
3. Try hard refresh and restart
4. Check console for UFM component errors

### Scenario 3: Everything Works Locally, Not on Server

1. Verify plugin folder path on server (might be different)
2. Check file permissions on server
3. Verify App_Plugins folder exists on server
4. Restart app pool on server
5. Check web server logs for errors

## Next Steps After Testing

If everything works:
1. ✅ You can now use dateFormat filter in all label templates
2. ✅ You can use badge component in content labels
3. ✅ Ready to deploy to production

If there are issues:
1. Check console errors
2. Follow troubleshooting checklist above
3. Verify all files deployed correctly
4. Try on fresh Umbraco instance to isolate issue
