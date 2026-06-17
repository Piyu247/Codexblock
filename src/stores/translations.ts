export const translations = {
  en: {
    // Menu items
    file: "File",
    edit: "Edit",
    new: "New",
    saveToComputer: "Save to computer",
    loadFromComputer: "Load from computer",
    undo: "Undo",
    redo: "Redo",
    turboMode: "Turbo mode",
    tutorials: "Tutorials",
    untitledProject: "Untitled Project",

    // Tabs
    codeTab: "Code",
    costumesTab: "Costumes",
    soundsTab: "Sounds",

    // Block categories
    catMotion: "Motion",
    catLooks: "Looks",
    catSound: "Sound",
    catEvents: "Events",
    catControl: "Control",
    catSensing: "Sensing",
    catOperators: "Operators",
    catVariables: "Variables",
    catMyBlocks: "My Blocks",

    // Sprite controls
    spriteLabel: "Sprite",
    xLabel: "x",
    yLabel: "y",
    showLabel: "Show",
    sizeLabel: "Size",
    directionLabel: "Direction",
    spritesHeader: "Sprites",
    stageHeader: "Stage",
    backdropsLabel: "Backdrops",
    chooseSprite: "Choose a Sprite",
    paintSprite: "Paint",
    surpriseSprite: "Surprise",
    uploadSprite: "Upload Sprite",
    chooseBackdrop: "Choose a Backdrop",
    uploadBackdrop: "Upload Backdrop",
    addSpriteLabel: "Add",
    duplicate: "Duplicate",
    delete: "Delete",

    // Dialogs / Library
    chooseBackdropTitle: "Choose a Backdrop",
    chooseSpriteTitle: "Choose a Sprite",
    searchPlaceholder: "Search",
    noSpritesFound: "No sprites found",
    noBackdropsFound: "No backdrops found",

    // Alert / general buttons
    ok: "OK",
    cancel: "Cancel",
    close: "Close"
  },
  mr: {
    // Menu items
    file: "फाईल",
    edit: "संपादन",
    new: "नवीन",
    saveToComputer: "संगणकावर जतन करा",
    loadFromComputer: "संगणकावरून लोड करा",
    undo: "मागे घ्या",
    redo: "पुन्हा करा",
    turboMode: "टर्बो मोड",
    tutorials: "ट्यूटोरियल्स",
    untitledProject: "अनामिक प्रकल्प",

    // Tabs
    codeTab: "कोड",
    costumesTab: "वेशभूषा",
    soundsTab: "आवाज",

    // Block categories
    catMotion: "हालचाल",
    catLooks: "देखावा",
    catSound: "ध्वनी",
    catEvents: "घटना",
    catControl: "नियंत्रण",
    catSensing: "संवेदना",
    catOperators: "ऑपरेटर",
    catVariables: "चल (Variables)",
    catMyBlocks: "माझे ब्लॉक्स",

    // Sprite controls
    spriteLabel: "चित्र (Sprite)",
    xLabel: "क्ष (x)",
    yLabel: "य (y)",
    showLabel: "दाखवा",
    sizeLabel: "आकार",
    directionLabel: "दिशा",
    spritesHeader: "चित्रे (Sprites)",
    stageHeader: "रंगमंच (Stage)",
    backdropsLabel: "पार्श्वभूमी (Backdrops)",
    chooseSprite: "चित्र निवडा",
    paintSprite: "रंगवा",
    surpriseSprite: "आश्चर्य",
    uploadSprite: "चित्र अपलोड करा",
    chooseBackdrop: "पार्श्वभूमी निवडा",
    uploadBackdrop: "अपलोड करा",
    addSpriteLabel: "जोडा",
    duplicate: "प्रतिकृती बनवा",
    delete: "हटवा",

    // Dialogs / Library
    chooseBackdropTitle: "पार्श्वभूमी निवडा",
    chooseSpriteTitle: "चित्र निवडा",
    searchPlaceholder: "शोधा",
    noSpritesFound: "चित्रे आढळली नाहीत",
    noBackdropsFound: "पार्श्वभूमी आढळली नाही",

    // Alert / general buttons
    ok: "ठीक आहे",
    cancel: "रद्द करा",
    close: "बंद करा"
  }
};

export type TranslationKeys = keyof typeof translations.en;

export function useTranslation() {
  const language = useProjectStore((s) => s.language);
  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations['en'][key] || key;
  };
  return { t, language };
}

import { useProjectStore } from './projectStore';
