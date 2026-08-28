// ─────────────────────────────────────────────
//  malayalamContent.ts — Pure Kerala Culinary Humor, Memes & Dialogue Engine
// ─────────────────────────────────────────────
import type { GamePhase } from '../types/game';

export interface PhaseContent {
  malayalamTitle: string;
  englishTitle: string;
  tag: string;
  malayalamObjective: string;
  englishObjective: string;
  ammachiTip: string;
  funnyQuote: string;
}

export const MALAYALAM_PHASE_CONTENT: Record<GamePhase, PhaseContent> = {
  INTRO: {
    malayalamTitle: 'സ്വാഗതം',
    englishTitle: 'Welcome',
    tag: 'തനി നാടൻ അടുക്കള സിമുലേറ്റർ',
    malayalamObjective: 'അടുക്കളയിലേക്ക് സ്വാഗതം! ചൂട് ഉണ്ണിയപ്പവും കട്ടൻ ചായയും റെഡിയാക്കാം.',
    englishObjective: 'Step into your miniature Kerala kitchen to craft golden crispy Unniyappams.',
    ammachiTip: 'എന്തായാലും തുടങ്ങി... ഇനിയൊരു കട്ടൻ ചായയും കൂടി ഇട് മക്കളേ! ☕',
    funnyQuote: 'ഉണ്ണിയപ്പം ഉണ്ടാക്കാൻ ക്ഷമ വേണം, തിന്നാൻ വേഗതയും! 🫓',
  },
  TUTORIAL: {
    malayalamTitle: 'പഠിക്കാം',
    englishTitle: 'Tutorial',
    tag: 'അടുക്കള പാഠങ്ങൾ',
    malayalamObjective: 'ചേരുവകൾ ശ്രദ്ധയോടെ തയ്യാറാക്കൂ.',
    englishObjective: 'Prepare the ingredients carefully.',
    ammachiTip: 'പാചകത്തിൽ കളി പാടില്ല, അളവ് തെറ്റിയാൽ അമ്മായിയമ്മ വഴക്കു പറയും! 😂',
    funnyQuote: 'റെസിപ്പി പുസ്തകം നോക്കണ്ട, മനക്കണക്ക് മതി!',
  },
  PREPARE_INGREDIENTS: {
    malayalamTitle: 'ചേരുവകൾ ചേർക്കുക',
    englishTitle: 'Add Ingredients',
    tag: 'ഘട്ടം 1 / 9',
    malayalamObjective: 'പാളയംകോടൻ പഴം, ശർക്കരപ്പാവ്, ഏലക്കാപ്പൊടി, അരിപ്പൊടി എന്നിവ പാത്രത്തിലേക്ക് ഇടൂ!',
    englishObjective: 'Drag the Bananas, Jaggery, Cardamom, and Rice Flour into the mixing bowl.',
    ammachiTip: 'നല്ല നാടൻ പഴവും ശർക്കരയും തന്നെ വേണം! അല്ലാതെ പഞ്ചസാര ഇട്ടാൽ രുചി പോകും! 🍌',
    funnyQuote: 'ഏലക്കായുടെ മണം അടുത്ത വീട്ടിലെ അളിയൻ പോലും അറിയണം! 🌿',
  },
  MIX_BATTER: {
    malayalamTitle: 'മാവ് കുഴക്കുക',
    englishTitle: 'Mix Batter',
    tag: 'ഘട്ടം 2 / 9',
    malayalamObjective: 'തവിയെടുത്ത് വട്ടത്തിൽ കറക്കി മാവ് കട്ടയില്ലാതെ നല്ല മയത്തിൽ കുഴച്ചെടുക്കൂ!',
    englishObjective: 'Swirl the wooden spoon in circles until the batter is velvety smooth.',
    ammachiTip: 'ഇളക്ക് മോനേ ഇളക്ക്... കൈ കുഴഞ്ഞാൽ അടുത്ത ആൾക്ക് കൊടുക്ക്! കട്ട പാടില്ല! 💪🥣',
    funnyQuote: 'ജിമ്മിൽ പോയി ഡംബൽസ് എടുക്കുന്നതിലും നല്ല വ്യായാമം ഈ മാവ് ഇളക്കലാണ്!',
  },
  HEAT_PAN: {
    malayalamTitle: 'ചട്ടി ചൂടാക്കുക',
    englishTitle: 'Heat Pan',
    tag: 'ഘട്ടം 3 / 9',
    malayalamObjective: 'സ്റ്റൗവ് നോബ് തിരിച്ച് കറക്റ്റ് Medium തീയിലേക്ക് വെക്കൂ. അപ്പാച്ചട്ടി ചൂടാവട്ടെ!',
    englishObjective: 'Turn the stove knob to Medium flame to heat the cast-iron appachatti.',
    ammachiTip: 'തീ അധികമായാൽ കരിയും, കുറഞ്ഞാൽ അപ്പം വേവില്ല! Medium flame is the secret! 🔥',
    funnyQuote: 'തീ കൂട്ടി വെച്ച് ഫോണിൽ നോക്കിയിരുന്നാൽ ഉണ്ണിയപ്പം കരിയോലയാവും! ⚠️',
  },
  ADD_OIL: {
    malayalamTitle: 'വെളിച്ചെണ്ണ ഒഴിക്കുക',
    englishTitle: 'Pour Oil',
    tag: 'ഘട്ടം 4 / 9',
    malayalamObjective: 'എണ്ണക്കുപ്പി എടുത്ത് അപ്പാച്ചട്ടിയിലെ 15 കുഴികളിലേക്കും വെളിച്ചെണ്ണ ഒഴിക്കൂ!',
    englishObjective: 'Drag the oil bottle over the appachatti to pour pure coconut oil into all 15 cavities.',
    ammachiTip: 'വെളിച്ചെണ്ണയിൽ പിശുക്ക് കാണിക്കരുത്! ഉണ്ണിയപ്പം എണ്ണയിൽ കിടന്ന് നീന്തി തുടിക്കട്ടെ! 🥥✨',
    funnyQuote: 'ശുദ്ധമായ വെളിച്ചെണ്ണയുടെ മണം... ആഹാ അന്തസ്സ്!',
  },
  POUR_BATTER: {
    malayalamTitle: 'മാവൊഴിക്കുക',
    englishTitle: 'Pour Batter',
    tag: 'ഘട്ടം 5 / 9',
    malayalamObjective: 'തവിയിൽ മാവെടുത്ത് 15 കുഴികളിലും നിറയ്ക്കൂ. പുറത്തേക്ക് തൂവല്ലേ!',
    englishObjective: 'Drag the batter ladle over the pan to fill each of the 15 cavities.',
    ammachiTip: 'ഓരോ കുഴിയിലും കൃത്യം മുക്കാൽ ഭാഗം മാവൊഴിക്കണം... അപ്പൊ പൊങ്ങി വരും! 🫓',
    funnyQuote: 'കുഴി തെറ്റാതെ മാവൊഴിക്കാൻ നല്ലൊരു കൈയടക്കം വേണം കേട്ടോ!',
  },
  COOK: {
    malayalamTitle: 'മൊരിഞ്ഞു വരട്ടെ',
    englishTitle: 'Sizzle & Cook',
    tag: 'ഘട്ടം 6 / 9',
    malayalamObjective: 'ആഹാ... ആ പൊരിയുന്ന ശബ്ദം കേൾക്കൂ! ഉണ്ണിയപ്പം അടിഭാഗം സ്വർണ്ണ നിറമാവുന്നു.',
    englishObjective: 'Listen to the golden sizzling! Steam is rising and the crust is crisping up.',
    ammachiTip: 'ആ സുഗന്ധം വരുന്നുണ്ട്! ചായ തിളച്ചോ എന്ന് പെട്ടെന്ന് നോക്കിക്കേ! 🤤✨',
    funnyQuote: 'ഉണ്ണിയപ്പം പൊരിയുന്ന സൗണ്ട് കേൾക്കുമ്പോഴേ വായിൽ വെള്ളം ഊറും!',
  },
  FLIP: {
    malayalamTitle: 'മറിച്ചിടുക',
    englishTitle: 'Flip Appams',
    tag: 'ഘട്ടം 7 / 9',
    malayalamObjective: 'ഈർക്കിലി കൊണ്ടോ തവി കൊണ്ടോ ഓരോ ഉണ്ണിയപ്പവും 180° തിരിച്ചിട്ട് മറുപുറവും മൊരിക്കൂ!',
    englishObjective: 'Click each unniyappam in the pan to flip it 180° to toast the back side.',
    ammachiTip: 'കരിയാതെ വേഗം തിരിച്ചിട്! ഒരു ഈർക്കിലി എടുത്തോ! രണ്ടു വശവും മൊരിയണം! 🥢',
    funnyQuote: 'ജീവിതത്തിലും ഇതുപോലെ ചില സാഹചര്യങ്ങൾ തിരിച്ചിടേണ്ടി വരും!',
  },
  SERVE: {
    malayalamTitle: 'വാഴയിലയിൽ വിളമ്പുക',
    englishTitle: 'Serve on Leaf',
    tag: 'ഘട്ടം 8 / 9',
    malayalamObjective: 'ചൂടോടെ മൊരിഞ്ഞ 15 ഉണ്ണിയപ്പങ്ങളും നാടൻ വാഴയില തട്ടിലേക്ക് വിളമ്പൂ!',
    englishObjective: 'Serve all 15 steaming hot golden unniyappams onto the fresh banana leaf.',
    ammachiTip: 'വാഴയിലയിൽ ചൂടോടെ നിരത്തി വെക്ക്! കുടുംബക്കാരെ മുഴുവൻ വിളിക്ക്! 🍃🎉',
    funnyQuote: 'ചൂടോടെ തിന്നണം, തണുത്താൽ ആരും ചോദിക്കില്ല!',
  },
  COUNT_KUZHI: {
    malayalamTitle: 'കുഴി എണ്ണൽ ഓഡിറ്റ്',
    englishTitle: 'Count the Kuzhi',
    tag: 'ഘട്ടം 9 / 9 — ഫൈനൽ ഓഡിറ്റ്',
    malayalamObjective: 'നിൽക്ക്! കഴിക്കുന്നതിന് മുൻപ് അപ്പാച്ചട്ടിയിലെ മുഴുവൻ കുഴികളും തൊട്ട് കൃത്യമായി എണ്ണി തിട്ടപ്പെടുത്തൂ!',
    englishObjective: 'Wait! Inspect the appachatti and tap each cavity to verify the total count before eating.',
    ammachiTip: 'അല്ലാ... അപ്പം ഉണ്ടാക്കി കഴിഞ്ഞിട്ട് ഈ കുഴി എണ്ണുന്നത് ഏത് ശാസ്ത്രം?! 🧐🔎',
    funnyQuote: 'അപ്പാച്ചട്ടിയിൽ കുഴിയുണ്ടോ ഇല്ലയോ എന്ന് ഇപ്പോഴാണോ നോക്കുന്നത്?! 😂',
  },
  PRANK: {
    malayalamTitle: 'പ്രത്യേക അറിയിപ്പ്',
    englishTitle: 'Prank Reveal',
    tag: 'സർട്ടിഫൈഡ് മലയാളി തമാശ',
    malayalamObjective: 'അപ്പം തിന്നാൽ പോരെ കുഴി എണ്ണണോ?! 😂',
    englishObjective: 'Appam thinna pore Kuzhi ennano?!',
    ammachiTip: 'ഇത്രേം നേരം കഷ്ടപ്പെട്ട് ഉണ്ടാക്കീട്ട് കുഴി എണ്ണാൻ ഇരുന്ന തനി മടിയൻ! 🏆',
    funnyQuote: 'കുഴി എണ്ണിയവർക്ക് പ്രത്യേക അവാർഡ് തരാൻ കമ്മിറ്റി തീരുമാനിച്ചിരിക്കുന്നു!',
  },
  RESULT: {
    malayalamTitle: 'റിസൾട്ട് & സർട്ടിഫിക്കറ്റ്',
    englishTitle: 'Final Certificate',
    tag: 'ഔദ്യോഗിക കുഴി എണ്ണൽ സർട്ടിഫിക്കറ്റ്',
    malayalamObjective: 'നിങ്ങളുടെ വിലപ്പെട്ട സമയം പാഴാക്കിയതിനുള്ള സർട്ടിഫിക്കറ്റ്!',
    englishObjective: 'Congratulations on achieving culinary excellence and zero productivity!',
    ammachiTip: 'ഇനി ഈ സർട്ടിഫിക്കറ്റ് ഫ്രെയിം ചെയ്ത് വാട്സാപ്പ് ഫാമിലി ഗ്രൂപ്പിൽ ഇട്ടോ! 📲',
    funnyQuote: 'അപ്പം റെഡി, കട്ടൻ ചായ റെഡി, പണി മാത്രം നടന്നില്ല!',
  },
};

// Funny Ammachi commentary lines triggered during gameplay
export const AMMACHI_REACTIONS = {
  banana: [
    'നല്ല മധുരമുള്ള നാടൻ പഴം! ഉണ്ണിയപ്പത്തിന് നല്ല സോഫ്റ്റ്‌നെസ്സ് കിട്ടും! 🍌',
    'പഴം നല്ലോണം ഉടക്കണം കേട്ടോ, കട്ട കിടക്കരുത്! 👍',
  ],
  jaggery: [
    'ശർക്കരപ്പാവ് ഒഴിക്ക്! ആഹാ ആ കറുത്ത നിറവും കൊഴുപ്പും... സ്വർഗ്ഗം! 🥥',
    'മധുരം കുറഞ്ഞാൽ ചായ കുടിക്കുന്ന അളിയൻ കുറ്റം പറയും! 🍯',
  ],
  cardamom: [
    'ഏലക്കായുടെ സുഗന്ധം മൂക്കിലേക്ക് അടിച്ചു കയറണം! 🌿✨',
    'ഏലക്കാപ്പൊടി ഇട്ടതോടെ അടുക്കളയ്ക്ക് ഒരു ലക്ഷണം വന്നു! 🌿',
  ],
  batter: [
    'അരിപ്പൊടി ചേർത്തു! ഇനി നല്ലോണം ഇളക്കണം! 🍚',
    'വറുത്ത അരിപ്പൊടിയുടെ മണം തന്നെ വേറെ ലെവൽ! 🥣',
  ],
  stirClick: [
    'ഇളക്കിക്കോ ഇളക്കിക്കോ... കൈ മസില് പെരുക്കട്ടെ! 💪',
    'ആഹാ മാവ് നല്ല വെണ്ണ പോലെ ആവുന്നുണ്ട്! ✨',
    'കട്ടയൊന്നുമില്ലാതെ വട്ടത്തിൽ തന്നെ ചുഴറ്റിക്കോ! 🥄',
  ],
  heatHigh: [
    '⚠️ അയ്യോ തീ കൂട്ടി കരിക്കല്ലേ! അടുക്കള മൊത്തം പുകയായി! വേഗം Medium-ലേക്ക് ആക്ക്!',
    'തീ കൂട്ടി വെച്ചാൽ ഉണ്ണിയപ്പം ബോംബ് പോലെ കരിയും കേട്ടോ! 🔥😱',
  ],
  heatLow: [
    'തീ ഇത്ര കുറച്ചാൽ ഇന്ന് രാത്രിയായാലും ഉണ്ണിയപ്പം വേവില്ല! 😴',
  ],
  heatMedium: [
    'ആഹാ കറക്റ്റ് തീ! പാൻ പാകത്തിന് ചൂടാവുന്നുണ്ട്! ✨👌',
  ],
  oiled: [
    'എണ്ണ തിളച്ചു തുടങ്ങി... നല്ല ചൂടോടെ കിടക്കട്ടെ! 🫒',
  ],
  batterPoured: [
    'കുഴികളിൽ മാവ് നിറഞ്ഞു... ഇനി പൊരിയുന്നത് നോക്കി നിൽക്കാം! 🫓',
  ],
  flipped: [
    'തിരിച്ചിട്ടു! അടിപൊളി സ്വർണ്ണ നിറം! മറുപുറവും മൊരിയട്ടെ! 🔄✨',
    'ഈർക്കിലി മാജിക്! ഒരു അപ്പം പോലും ഒട്ടിപ്പിടിച്ചില്ല! 🥢',
  ],
  served: [
    'ആഹാ സ്വർണ്ണം പോലെയുള്ള ഉണ്ണിയപ്പം വാഴയിലയിൽ! എടുത്തോ കഴിച്ചോ! 🍃🤤',
  ],
  kuzhiTap: (num: number) => {
    const list = [
      `കുഴി 1: "തുടക്കം കൊള്ളാം..." 🧐`,
      `കുഴി 2: "ശ്രദ്ധയോടെ എണ്ണിക്കോ..." 🔍`,
      `കുഴി 3: "അളിയാ, സത്യത്തിൽ എന്തിനാ ഇത് എണ്ണുന്നത്?" 🤔`,
      `കുഴി 4: "അപ്പം തിന്നാൻ കൊതിയാവുന്നുണ്ടല്ലേ?" 🤤`,
      `കുഴി 5: "പകുതി വഴിയിലെത്തി..." ⏱️`,
      `കുഴി 6: "നിങ്ങൾക്ക് വേറെ പണിയൊന്നുമില്ലേ?!" 😂`,
      `കുഴി 7: "ഗവേഷണം പുരോഗമിക്കുന്നു..." 🔬`,
      `കുഴി 8: "ഇത്രേം ശ്രദ്ധ പണ്ട് പഠിക്കാൻ ഉണ്ടായിരുന്നെങ്കിൽ..." 📚`,
      `കുഴി 9: "അപ്പാച്ചട്ടി കമ്പനിക്കാർ പോലും ഇത്ര എണ്ണിയിട്ടുണ്ടാവില്ല!" 🏭`,
      `കുഴി 10: "പത്ത് കുഴി കഴിഞ്ഞു! അവാർഡ് ഉടൻ വരും!" 🏅`,
      `കുഴി 11: "ഓഡിറ്റിംഗ് ശക്തമായി തുടരുന്നു..." 💼`,
      `കുഴി 12: "ഇനി 3 എണ്ണം കൂടി..." ⏳`,
      `കുഴി 13: "ക്ഷമയുടെ നെല്ലിപ്പലക കണ്ടു!" 🪵`,
      `കുഴി 14: "ദാ അവസാനത്തെ കുഴിക്ക് തൊട്ടടുത്ത്!" 🎯`,
      `കുഴി 15: "കഴിഞ്ഞു! മൊത്തം 15 കുഴിയും കൃത്യം! എന്തൊരു നേട്ടം!" 🏆🎉`,
    ];
    return list[Math.min(num - 1, list.length - 1)] || `കുഴി ${num} കണ്ടെത്തി! 🔎`;
  },
};

// Funny ranks based on user time and kuzhi count
export const FUNNY_TITLES = [
  { title: 'ചായക്കട ചീഫ് കൺസൾട്ടന്റ്', sub: 'Chief Tea-Stall Consultant', desc: 'ഉണ്ണിയപ്പ നിർമ്മാണത്തിൽ മാസ്റ്റർ ഡിഗ്രി എടുത്ത താരം!' },
  { title: 'നാടൻ കുഴി എണ്ണൽ സ്പെഷ്യലിസ്റ്റ്', sub: 'Master Cavity Auditor', desc: 'അപ്പം തിന്നാതെ കുഴി എണ്ണി നേരം വെളുപ്പിച്ച മഹാപ്രതിഭ!' },
  { title: 'തനി നാടൻ ഫുഡി ഓഫ് ദ ഇയർ', sub: 'Kerala Foodie of the Year', desc: 'രുചിയുടെ കാര്യത്തിൽ ഒരു വിട്ടുവീഴ്ചയുമില്ലാത്ത ഉണ്ണിയപ്പ പ്രേമി!' },
  { title: 'അമ്മായിയമ്മയുടെ പ്രിയപ്പെട്ട അളിയൻ', sub: 'Favorite Family Chef', desc: 'പാചകത്തിൽ കട്ടയ്ക്ക് കൂടെ നിൽക്കുന്ന വിരുതൻ!' },
];

export const FUNNY_STATS = [
  { malayalam: 'ഉണ്ണിയപ്പം ക്രിസ്പിനെസ്സ്', english: 'Crispiness Index', value: '100%', color: 'green' },
  { malayalam: 'മാവ് കുഴച്ച മെയ്‌വഴക്കം', english: 'Mixing Fluency', value: '98%', color: 'green' },
  { malayalam: 'അമ്മായിയമ്മ അപ്രൂവൽ', english: 'Ammayi Approval Rate', value: '99.9%', color: 'green' },
  { malayalam: 'കുഴി എണ്ണിയ കൃത്യത', english: 'Kuzhi Audit Accuracy', value: '15 / 15 (100%)', color: 'orange' },
  { malayalam: 'യഥാർത്ഥ പ്രയോജനം', english: 'Actual Practical Usefulness', value: '0% (പൂജ്യം)', color: 'red' },
  { malayalam: 'വേസ്റ്റ് ചെയ്ത സമയം', english: 'Time Happily Wasted', value: 'Calculated', color: 'gold' },
];
