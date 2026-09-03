export type Language =
  | 'en'
  | 'hi'
  | 'mr'
  | 'gu'
  | 'bn'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'ur';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    brandName: 'FinClosure',
    tagline: 'Closing Finances. Securing Futures.',
    activeSession: 'Active Financial Closure Session',
    loadDemo: 'Load Sample Scenario',
    seedingDemo: 'Loading Scenario...',
    demoSuccess: 'Loaded Hackathon Scenario: Rajesh Sharma & Ankit Sharma',
    talkToAi: 'Talk to FinClosure',
    signOut: 'Sign Out',

    // Navigation
    navDashboard: 'Dashboard',
    navProfile: 'Deceased Profile',
    navAssets: 'Asset Portfolio',
    navDocuments: 'Document Vault',
    navClaims: 'Claims Tracker',
    navAssistant: 'AI Assistant',
    navNotifications: 'Notifications',
    navSettings: 'Settings',

    // Auth & Landing
    signInTitle: 'Sign In to FinClosure',
    signInSubtitle: 'Access your financial closure workspace securely',
    createAccountTitle: 'Create FinClosure Account',
    createAccountSubtitle: "Start organizing your family's financial closure",
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    fullNameLabel: 'Full Name',
    phoneLabel: 'Phone Number (Optional)',
    confirmPasswordLabel: 'Confirm Password',
    continueWithGoogle: 'Continue with Google',
    orContinueWith: 'Or email & password',
    dontHaveAccount: "Don't have an account?",
    alreadyRegistered: 'Already registered?',
    signIn: 'Sign In',
    register: 'Create Account',
    creatingAccount: 'Creating Account...',

    // Dashboard
    activeProfile: 'Active Profile',
    closureProgress: 'FinClosure Progress',
    closureProgressDesc: 'Calculated from confirmed assets, uploaded documents, and claim milestones.',
    totalAssets: 'Total Assets',
    confirmedAssets: 'Confirmed',
    potentialAssets: 'Potential',
    activeClaims: 'Active Claims',
    settledClaims: 'Settled',
    pendingDocs: 'Pending Documents',
    aiDiscoveryTile: 'AI Asset Discovery',
    aiDiscoveryDesc: 'Scan notes & document text to identify unconfirmed financial assets.',
    needsAttention: 'Needs Your Attention',
    noAttentionItems: 'No urgent items requiring attention right now. Great job!',
    recentActivity: 'Recent Workspace Activity',
    noRecentActivity: 'No recent activity logged yet.',
    addAsset: 'Add Asset',
    askAi: 'Ask AI',

    // Asset Categories
    catBankAccount: 'Bank Account',
    catFixedDeposit: 'Fixed Deposit',
    catInsurance: 'Insurance',
    catInvestment: 'Investment',
    catPension: 'Pension',
    catDigitalAsset: 'Digital Asset',
    catOther: 'Other',

    // Asset Statuses
    statusKnown: 'Known',
    statusPotential: 'Potential',
    statusConfirmed: 'Confirmed',
    statusClaimStarted: 'Claim Started',
    statusClaimCompleted: 'Claim Completed',

    // Claims Statuses
    claimNotStarted: 'Not Started',
    claimDocsPending: 'Documents Pending',
    claimReadyToSubmit: 'Ready to Submit',
    claimSubmitted: 'Submitted',
    claimUnderVerification: 'Under Verification',
    claimApproved: 'Approved',
    claimCompleted: 'Completed',

    // Buttons & Dialogs
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save Changes',
    delete: 'Delete',
    back: 'Back',
    continue: 'Continue',
    close: 'Close',
    upload: 'Upload',

    // Talking Agent
    talkingAgentTitle: 'FinClosure Talking Agent',
    talkingAgentSubtitle: 'Speak naturally in English, Hindi, or Marathi to guide your claims.',
    talkingIdle: 'Tap the microphone to speak with FinClosure AI.',
    talkingListening: 'I am listening... Speak now.',
    talkingProcessing: 'Processing your request with AI...',
    talkingSpeaking: 'Speaking response aloud...',
    speakButton: 'Speak',
    stopListening: 'Stop Listening',
    stopSpeech: 'Stop Voice',
    voiceNotSupported: 'Speech recognition is not supported in this browser. You can type in the chat instead.',
  },

  hi: {
    // Brand & Header
    brandName: 'FinClosure',
    tagline: 'वित्तीय समाप्ति। सुरक्षित भविष्य।',
    activeSession: 'सक्रिय वित्तीय क्लोजर सत्र',
    loadDemo: 'नमूना परिदृश्य लोड करें',
    seedingDemo: 'डेमो लोड हो रहा है...',
    demoSuccess: 'सफलतापूर्वक लोड किया गया: राजेश शर्मा और अंकित शर्मा',
    talkToAi: 'FinClosure से बात करें',
    signOut: 'साइन आउट',

    // Navigation
    navDashboard: 'डैशबोर्ड',
    navProfile: 'मृतक प्रोफ़ाइल',
    navAssets: 'संपत्ति पोर्टफोलियो',
    navDocuments: 'दस्तावेज़ तिजोरी',
    navClaims: 'दावा ट्रैकर',
    navAssistant: 'एआई सहायक',
    navNotifications: 'सूचनाएं',
    navSettings: 'सेटिंग्स',

    // Auth & Landing
    signInTitle: 'FinClosure में साइन इन करें',
    signInSubtitle: 'अपने वित्तीय क्लोजर कार्यस्थान तक सुरक्षित रूप से पहुंचें',
    createAccountTitle: 'FinClosure खाता बनाएं',
    createAccountSubtitle: 'अपने परिवार के वित्तीय क्लोजर को व्यवस्थित करना शुरू करें',
    emailLabel: 'ईमेल पता',
    passwordLabel: 'पासवर्ड',
    fullNameLabel: 'पूरा नाम',
    phoneLabel: 'फोन नंबर (वैकल्पिक)',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    continueWithGoogle: 'गूगल के साथ जारी रखें',
    orContinueWith: 'या ईमेल और पासवर्ड',
    dontHaveAccount: 'खाता नहीं है?',
    alreadyRegistered: 'पहले से पंजीकृत हैं?',
    signIn: 'साइन इन करें',
    register: 'खाता बनाएं',
    creatingAccount: 'खाता बनाया जा रहा है...',

    // Dashboard
    activeProfile: 'सक्रिय प्रोफ़ाइल',
    closureProgress: 'वित्तीय समापन प्रगति',
    closureProgressDesc: 'पुष्टि की गई संपत्तियों, अपलोड किए गए दस्तावेज़ों और दावा मील के पत्थरों से गणना की गई।',
    totalAssets: 'कुल संपत्तियां',
    confirmedAssets: 'पुष्टि की गई',
    potentialAssets: 'संभावित',
    activeClaims: 'सक्रिय दावे',
    settledClaims: 'निपटाए गए',
    pendingDocs: 'लंबित दस्तावेज़',
    aiDiscoveryTile: 'एआई संपत्ति खोज',
    aiDiscoveryDesc: 'अपुष्ट वित्तीय संपत्तियों की पहचान करने के लिए नोट्स और दस्तावेज़ पढ़ें।',
    needsAttention: 'ध्यान देने की आवश्यकता है',
    noAttentionItems: 'अभी किसी तत्काल वस्तु पर ध्यान देने की आवश्यकता नहीं है।',
    recentActivity: 'हाल की गतिविधि',
    noRecentActivity: 'अभी तक कोई हालिया गतिविधि दर्ज नहीं की गई है।',
    addAsset: 'संपत्ति जोड़ें',
    askAi: 'एआई से पूछें',

    // Asset Categories
    catBankAccount: 'बैंक खाता',
    catFixedDeposit: 'फिक्स्ड डिपॉजिट (FD)',
    catInsurance: 'बीमा (Insurance)',
    catInvestment: 'निवेश (Investment)',
    catPension: 'पेंशन',
    catDigitalAsset: 'डिजिटल संपत्ति',
    catOther: 'अन्य',

    // Asset Statuses
    statusKnown: 'ज्ञात',
    statusPotential: 'संभावित',
    statusConfirmed: 'पुष्टि की गई',
    statusClaimStarted: 'दावा शुरू किया गया',
    statusClaimCompleted: 'दावा पूर्ण हुआ',

    // Claims Statuses
    claimNotStarted: 'प्रारंभ नहीं हुआ',
    claimDocsPending: 'दस्तावेज़ लंबित',
    claimReadyToSubmit: 'जमा करने के लिए तैयार',
    claimSubmitted: 'जमा किया गया',
    claimUnderVerification: 'सत्यापन के तहत',
    claimApproved: 'स्वीकृत',
    claimCompleted: 'पूर्ण',

    // Buttons & Dialogs
    confirm: 'पुष्टि करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    back: 'पीछे',
    continue: 'जारी रखें',
    close: 'बंद करें',
    upload: 'अपलोड करें',

    // Talking Agent
    talkingAgentTitle: 'FinClosure वॉइस एजेंट',
    talkingAgentSubtitle: 'अपने दावों का मार्गदर्शन प्राप्त करने के लिए हिंदी, अंग्रेजी या मराठी में बोलें।',
    talkingIdle: 'FinClosure AI से बात करने के लिए माइक्रोफ़ोन टैप करें।',
    talkingListening: 'मैं सुन रहा हूँ... अब बोलें।',
    talkingProcessing: 'आपकी प्रतिक्रिया संसाधित की जा रही है...',
    talkingSpeaking: 'उत्तर उच्चारित किया जा रहा है...',
    speakButton: 'बोलें',
    stopListening: 'सुनना बंद करें',
    stopSpeech: 'आवाज रोकें',
    voiceNotSupported: 'इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। आप इसके बजाय टाइप कर सकते हैं।',
  },

  mr: {
    // Brand & Header
    brandName: 'FinClosure',
    tagline: 'आर्थिक पूर्णता. सुरक्षित भविष्य.',
    activeSession: 'सक्रिय आर्थिक क्लोजर सत्र',
    loadDemo: 'नमुनाscenario लोड करा',
    seedingDemo: 'डेटा लोड होत आहे...',
    demoSuccess: 'यशस्वीरीत्या लोड केले: राजेश शर्मा आणि अंकित शर्मा',
    talkToAi: 'FinClosure शी बोला',
    signOut: 'साइन आउट',

    // Navigation
    navDashboard: 'डॅशबोर्ड',
    navProfile: 'मृत व्यक्ती प्रोफाईल',
    navAssets: 'मालमत्ता पोर्टफोलिओ',
    navDocuments: 'कागदपत्रे तिजोरी',
    navClaims: 'दावा ट्रॅकर',
    navAssistant: 'एआय सहाय्यक',
    navNotifications: 'सूचना',
    navSettings: 'सेटिंग्ज',

    // Auth & Landing
    signInTitle: 'FinClosure मध्ये साइन इन करा',
    signInSubtitle: 'तुमच्या आर्थिक क्लोजर वर्कस्पेसमध्ये सुरक्षितपणे प्रवेश करा',
    createAccountTitle: 'FinClosure खाते तयार करा',
    createAccountSubtitle: 'तुमच्या कुटुंबाच्या आर्थिक संकलनाचे नियोजन सुरू करा',
    emailLabel: 'ईमेल पत्ता',
    passwordLabel: 'पासवर्ड',
    fullNameLabel: 'पूर्ण नाव',
    phoneLabel: 'फोन नंबर (पर्यायी)',
    confirmPasswordLabel: 'पासवर्डची खात्री करा',
    continueWithGoogle: 'गूगलसह सुरू ठेवा',
    orContinueWith: 'किंवा ईमेल आणि पासवर्ड',
    dontHaveAccount: 'खाते नाही?',
    alreadyRegistered: 'आधीच नोंदणी केली आहे?',
    signIn: 'साइन इन करा',
    register: 'खाते तयार करा',
    creatingAccount: 'खाते तयार होत आहे...',

    // Dashboard
    activeProfile: 'सक्रिय प्रोफाईल',
    closureProgress: 'आर्थिक पूर्तता प्रगती',
    closureProgressDesc: 'निश्चित मालमत्ता, अपलोड केलेली कागदपत्रे आणि दाव्यांच्या टप्प्यांवरून गणना केली.',
    totalAssets: 'एकूण मालमत्ता',
    confirmedAssets: 'निश्चित',
    potentialAssets: 'संभाव्य',
    activeClaims: 'सक्रिय दावे',
    settledClaims: 'पूर्ण झालेले दावे',
    pendingDocs: 'प्रलंबित कागदपत्रे',
    aiDiscoveryTile: 'एआय मालमत्ता शोध',
    aiDiscoveryDesc: 'अप्रत्यक्ष मालमत्ता शोधण्यासाठी नोंदी व कागदपत्रे स्कॅन करा.',
    needsAttention: 'लक्ष देणे आवश्यक आहे',
    noAttentionItems: 'सध्या कोणत्याही तातडीच्या बाबीवर लक्ष देण्याची गरज नाही.',
    recentActivity: 'नुकतीच झालेली हालचाल',
    noRecentActivity: 'अजून कोणतीही नुकतीच झालेली नोंद नाही.',
    addAsset: 'मालमत्ता जोडा',
    askAi: 'एआयला विचारा',

    // Asset Categories
    catBankAccount: 'बँक खाते',
    catFixedDeposit: 'मुदत ठेव (FD)',
    catInsurance: 'विमा (Insurance)',
    catInvestment: 'गुंतवणूक (Investment)',
    catPension: 'पेंशन',
    catDigitalAsset: 'डिजिटल मालमत्ता',
    catOther: 'इतर',

    // Asset Statuses
    statusKnown: 'माहित असलेली',
    statusPotential: 'संभाव्य',
    statusConfirmed: 'निश्चित',
    statusClaimStarted: 'दावा सुरू केला',
    statusClaimCompleted: 'दावा पूर्ण झाला',

    // Claims Statuses
    claimNotStarted: 'सुरू झाले नाही',
    claimDocsPending: 'कागदपत्रे प्रलंबित',
    claimReadyToSubmit: 'सादर करण्यास तयार',
    claimSubmitted: 'सादर केले',
    claimUnderVerification: 'तपासणी सुरू',
    claimApproved: 'मंजूर',
    claimCompleted: 'पूर्ण',

    // Buttons & Dialogs
    confirm: 'खात्री करा',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    delete: 'काढून टाका',
    back: 'मागे',
    continue: 'पुढे जा',
    close: 'बंद करा',
    upload: 'अपलोड करा',

    // Talking Agent
    talkingAgentTitle: 'FinClosure टॉकिंग एजंट',
    talkingAgentSubtitle: 'तुमच्या दाव्यांचे मार्गदर्शन मिळवण्यासाठी मराठी, हिंदी किंवा इंग्रजीत बोला.',
    talkingIdle: 'FinClosure AI शी बोलण्यासाठी मायक्रोफोन टॅप करा.',
    talkingListening: 'मी ऐकत आहे... आता बोला.',
    talkingProcessing: 'तुमच्या प्रश्नावर विचार होत आहे...',
    talkingSpeaking: 'उत्तर मोठ्याने वाचले जात आहे...',
    speakButton: 'बोला',
    stopListening: 'ऐकणे थांबवा',
    stopSpeech: 'आवाज थांबवा',
    voiceNotSupported: 'या ब्राउझरमध्ये व्हॉईस सेवा उपलब्ध नाही. तुम्ही टाईप करून विचारू शकता.',
  },

  // Fallback structures for other regional languages
  gu: {},
  bn: {},
  ta: {},
  te: {},
  kn: {},
  ml: {},
  pa: {},
  ur: {},
};

export const t = (key: string, lang: Language = 'en'): string => {
  const langDict = translations[lang] || translations.en;
  if (langDict && langDict[key]) {
    return langDict[key];
  }
  return translations.en[key] || key;
};
