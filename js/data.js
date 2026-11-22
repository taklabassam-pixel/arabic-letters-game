const gameData = [
  // 🦁 الحيوانات (10)
  {
    id: 'asad',
    letter: 'أ',
    word: 'أَسَدٌ',
    imagePath: './assets/images/asad.webp',
    audioPath: './assets/audio/words/asad.mp3',
    letterAudioPath: './assets/audio/letter_word/alif_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/asad.mp3'
  },
  {
    id: 'batta',
    letter: 'ب',
    word: 'بَطَّةٌ',
    imagePath: './assets/images/batta.webp',
    audioPath: './assets/audio/words/batta.mp3',
    letterAudioPath: './assets/audio/letter_word/baa_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/batta.mp3'
  },
  {
    id: 'jamal',
    letter: 'ج',
    word: 'جَمَلٌ',
    imagePath: './assets/images/jamal.webp',
    audioPath: './assets/audio/words/jamal.mp3',
    letterAudioPath: './assets/audio/letter_word/jeem_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/jamal.mp3'
  },
  { id: 'wurud',
    letter: 'و',
    word: 'وُرُودٌ',
    imagePath: './assets/images/wurud.webp',
    audioPath: './assets/audio/words/wurud.mp3',
    letterAudioPath: './assets/audio/letter_word/waw_damma_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/wurud.mp3'
  },
  {
    id: 'hisan',
    letter: 'ح',
    word: 'حِصَانٌ',
    imagePath: './assets/images/hisan.webp',
    audioPath: './assets/audio/words/hisan.mp3',
    letterAudioPath: './assets/audio/letter_word/haa_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/hisan.mp3'
  },
  {
    id: 'dolfeen',
    letter: 'د',
    word: 'دُلفينٌ',
    imagePath: './assets/images/dolfeen.webp',
    audioPath: './assets/audio/words/dolfeen.mp3',
    letterAudioPath: './assets/audio/letter_word/daal_damma_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/dolfeen.mp3'
  },
  {
    id: 'dhib',
    letter: 'ذ',
    word: 'ذِئْبٌ',
    imagePath: './assets/images/dhib.webp',
    audioPath: './assets/audio/words/dhib.mp3',
    letterAudioPath: './assets/audio/letter_word/dhal_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/dhib.mp3'
  },
  {
    id: 'zarafa',
    letter: 'ز',
    word: 'زَرَافَةٌ',
    imagePath: './assets/images/zarafa.webp',
    audioPath: './assets/audio/words/zarafa.mp3',
    letterAudioPath: './assets/audio/letter_word/zay_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/zarafa.mp3'
  },
  {
    id: 'samaka',
    letter: 'س',
    word: 'سَمَكَةٌ',
    imagePath: './assets/images/samaka.webp',
    audioPath: './assets/audio/words/samaka.mp3',
    letterAudioPath: './assets/audio/letter_word/seen_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/samaka.mp3'
  },
  {
    id: 'feel',
    letter: 'ف',
    word: 'فِيلٌ',
    imagePath: './assets/images/feel.webp',
    audioPath: './assets/audio/words/feel.mp3',
    letterAudioPath: './assets/audio/letter_word/faa_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/feel.mp3'
  },
  {
    id: 'qitta',
    letter: 'ق',
    word: 'قِطَّةٌ',
    imagePath: './assets/images/qitta.webp',
    audioPath: './assets/audio/words/qitta.mp3',
    letterAudioPath: './assets/audio/letter_word/qaf_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/qitta.mp3'
  },

  // 🍎 الفواكه والطبيعة (10)
  {
    id: 'tuffaha',
    letter: 'ت',
    word: 'تُفَّاحَةٌ',
    imagePath: './assets/images/tuffaha.webp',
    audioPath: './assets/audio/words/tuffaha.mp3',
    letterAudioPath: './assets/audio/letter_word/taa_damma_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/tuffaha.mp3'
  },
  {
    id: 'mawza',
    letter: 'م',
    word: 'مَوْزَةٌ',
    imagePath: './assets/images/mawza.webp',
    audioPath: './assets/audio/words/mawza.mp3',
    letterAudioPath: './assets/audio/letter_word/meem_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/mawza.mp3'
  },
  {
    id: 'burtuqal',
    letter: 'ب',
    word: 'بُرْتُقَالٌ',
    imagePath: './assets/images/burtuqala.webp',
    audioPath: './assets/audio/words/burtuqala.mp3',
    letterAudioPath: './assets/audio/letter_word/baa_damma_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/burtuqal.mp3'
  },
  {
    id: 'teen',
    letter: 'ت',
    word: 'تِينٌ',
    imagePath: './assets/images/teen.webp',
    audioPath: './assets/audio/words/teen.mp3',
    letterAudioPath: './assets/audio/letter_word/taa_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/teen.mp3'
  },
  {
    id: 'thum',
    letter: 'ث',
    word: 'ثُومٌ',
    imagePath: './assets/images/thum.webp',
    audioPath: './assets/audio/words/thum.mp3',
    letterAudioPath: './assets/audio/letter_word/thaa_damma_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/thum.mp3'
  },
  {
    id: 'rumman',
    letter: 'ر',
    word: 'رُمَّانٌ',
    imagePath: './assets/images/rumman.webp',
    audioPath: './assets/audio/words/rumman.mp3',
    letterAudioPath: './assets/audio/letter_word/raa_damma_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/rumman.mp3'
  },
  {
    id: 'zaytun',
    letter: 'ز',
    word: 'زَيْتُونٌ',
    imagePath: './assets/images/zaytun.webp',
    audioPath: './assets/audio/words/zaytun.mp3',
    letterAudioPath: './assets/audio/letter_word/zay_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/zaytun.mp3'
  },
  {
    id: 'inab',
    letter: 'ع',
    word: 'عِنَبٌ',
    imagePath: './assets/images/inab.webp',
    audioPath: './assets/audio/words/inab.mp3',
    letterAudioPath: './assets/audio/letter_word/ain_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/inab.mp3'
  },
  {
    id: 'ferjar',
    letter: 'ف',
    word: 'فِرْجَارٌ',
    imagePath: './assets/images/ferjar.webp',
    audioPath: './assets/audio/words/ferjar.mp3',
    letterAudioPath: './assets/audio/letter_word/faa_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/ferjar.mp3'
  },
  {
    id: 'laymun',
    letter: 'ل',
    word: 'لَيْمُونٌ',
    imagePath: './assets/images/laymun.webp',
    audioPath: './assets/audio/words/laymun.mp3',
    letterAudioPath: './assets/audio/letter_word/lam_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/laymun.mp3'
  },

  // 🧸 الأشياء والأدوات (10)
  {
    id: 'ibriq',
    letter: 'إ',
    word: 'إِبْرِيقٌ',
    imagePath: './assets/images/ibriq.webp',
    audioPath: './assets/audio/words/ibriq.mp3',
    letterAudioPath: './assets/audio/letter_word/alif_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/ibriq.mp3'
  },
  {
    id: 'bab',
    letter: 'ب',
    word: 'بَابٌ',
    imagePath: './assets/images/bab.webp',
    audioPath: './assets/audio/words/bab.mp3',
    letterAudioPath: './assets/audio/letter_word/baa_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/bab.mp3'
  },
  {
    id: 'taj',
    letter: 'ت',
    word: 'تَاجٌ',
    imagePath: './assets/images/taj.webp',
    audioPath: './assets/audio/words/taj.mp3',
    letterAudioPath: './assets/audio/letter_word/taa_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/taj.mp3'
  },
  {
    id: 'jaras',
    letter: 'ج',
    word: 'جَرَسٌ',
    imagePath: './assets/images/jaras.webp',
    audioPath: './assets/audio/words/jaras.mp3',
    letterAudioPath: './assets/audio/letter_word/jeem_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/jaras.mp3'
  },
  {
    id: 'darraja',
    letter: 'د',
    word: 'دَرَّاجَةٌ',
    imagePath: './assets/images/darraja.webp',
    audioPath: './assets/audio/words/darraja.mp3',
    letterAudioPath: './assets/audio/letter_word/daal_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/darraja.mp3'
  },
  {
    id: 'zahra',
    letter: 'ز',
    word: 'زَهْرَةٌ',
    imagePath: './assets/images/zahra.webp',
    audioPath: './assets/audio/words/zahra.mp3',
    letterAudioPath: './assets/audio/letter_word/zay_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/zahra.mp3'
  },
  {
    id: 'sayyara',
    letter: 'س',
    word: 'سَيَّارَةٌ',
    imagePath: './assets/images/sayyara.webp',
    audioPath: './assets/audio/words/sayyara.mp3',
    letterAudioPath: './assets/audio/letter_word/seen_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/sayyara.mp3'
  },
  {
    id: 'qamar',
    letter: 'ق',
    word: 'قَمَرٌ',
    imagePath: './assets/images/qamar.webp',
    audioPath: './assets/audio/words/qamar.mp3',
    letterAudioPath: './assets/audio/letter_word/qaf_fatha_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/qamar.mp3'
  },
  {
    id: 'kitab',
    letter: 'ك',
    word: 'كِتَابٌ',
    imagePath: './assets/images/kitab.webp',
    audioPath: './assets/audio/words/kitab.mp3',
    letterAudioPath: './assets/audio/letter_word/kaf_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/kitab.mp3'
  },
  {
    id: 'miqass',
    letter: 'م',
    word: 'مِقَصٌّ',
    imagePath: './assets/images/miqass.webp',
    audioPath: './assets/audio/words/miqass.mp3',
    letterAudioPath: './assets/audio/letter_word/meem_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/miqass.mp3'
  },
  {id: 'miftah',
    letter: 'م',
    word: 'مِفْتَاحٌ',
    imagePath: './assets/images/miftah.webp',
    audioPath: './assets/audio/words/miftah.mp3',
    letterAudioPath: './assets/audio/letter_word/meem_kasra_1.mp3',
    pictureAudioPath: './assets/audio/letter_word/miftah.mp3'}
];

const educationalItems = gameData;