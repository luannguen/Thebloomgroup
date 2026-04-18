const fs = require('fs');
const path = require('path');

const localesDir = path.resolve('src/locales');
const sourceFile = path.join(localesDir, 'en', 'translation.json');
const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

const targetLangs = ['de', 'fr', 'ru', 'hr', 'sl', 'sr'];

targetLangs.forEach(lang => {
    const filePath = path.join(localesDir, lang, 'translation.json');
    let langData = {};
    if (fs.existsSync(filePath)) {
        try {
            langData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error(`Error parsing ${lang}`);
        }
    }

    // Merge: Keep existing translations, add new keys from source
    const result = { ...sourceData };
    
    // Iterate over existing lang keys and restore their translated values
    Object.keys(langData).forEach(key => {
        if (sourceData.hasOwnProperty(key)) {
            result[key] = langData[key];
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(result, null, 4), 'utf8');
    console.log(`Synced ${lang}`);
});
