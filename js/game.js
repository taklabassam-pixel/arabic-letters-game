// js/game.js - منطق اللعبة والمستويات مع عداد الأسئلة (5 أسئلة لكل مستوى)

let currentLevel = 1;
let score = 0;
let currentTarget = null;

// متغيرات تتبع حالة اللعبة والتحدي
let correctStreak = 0; // عداد البطاقات المنجزة بشكل صحيح متتالي
let wrongAttempts = 0; // عداد الأخطاء المرتكبة
let isGameWindowOpen = false; // حالة نافذة اللعبة (مفتوحة/مغلقة)

let mistakeCount = 0; // عداد الأخطاء داخل اللعبة

// متغيرات تتبع الأسئلة
let questionCount = 0;
const questionsPerLevel = 5;

// عناصر الصوت التفاعلية
const successAudio = document.getElementById('audio-success');
const wrongAudio = document.getElementById('audio-wrong');
const wordAudioPlayer = document.getElementById('audio-word-player');

// تشغيل الصوت الذاتي للكلمة المستهدفة أو الحرف في المستوى الثالث
function playCurrentAudio() {
  if (!currentTarget) return;

  let audioPath = currentTarget.audioPath; // المسار الافتراضي (للمستويات 1 و 2)

  // في المستوى الثالث، نستخدم مسار الصوت الخاص بالحرف المشكول المخصص
  if (currentLevel === 3 && currentTarget.letterAudioPath) {
    audioPath = currentTarget.letterAudioPath;
  }

  if (audioPath) {
    wordAudioPlayer.src = audioPath;
    wordAudioPlayer.currentTime = 0;
    wordAudioPlayer.play().catch(err => console.log("Audio file pending:", audioPath));
  }
}

// تحميل سؤال جديد (الكلمة المستهدفة + 3 خيارات صور/كلمات مطابقة بالكامل)
function loadQuestion() {
  const feedback = document.getElementById('feedback-msg');
  feedback.textContent = '';
  feedback.className = 'feedback-banner';

  if (educationalItems.length === 0) {
    console.error("educationalItems is not defined or empty.");
    return;
  }

  // التحقق من إنهاء الأسئلة الـ 5 للمستوى الحالي
  if (questionCount >= questionsPerLevel) {
    showLevelCompleteScreen();
    return;
  }

  // اختيار العنصر المستهدف ككتلة واحدة متكاملة (ID + Word + Image + Audio Paths)
  const randomIndex = Math.floor(Math.random() * educationalItems.length);
  currentTarget = educationalItems[randomIndex];

  // 🔍 تتبع للتأكد من تطابق الـ ID والمسارات في وحدة التحكم
  console.log("🎯 العنصر المستهدف الكامل:", currentTarget);

  const instruction = document.getElementById('instruction');
  const targetWord = document.getElementById('target-word');
  const optionsContainer = document.getElementById('options-container');

  optionsContainer.innerHTML = '';

  const progressText = ` (السؤال رقم ${questionCount + 1} )`;

  // ==========================================
  // المستوى 1: الكلمة والصورة
  // ==========================================
  if (currentLevel === 1) {
    instruction.textContent = ' إختر الصورة المطابقة للكلمة -' + progressText;
    targetWord.textContent = currentTarget.word;

    let pool = educationalItems.filter(item => item.id !== currentTarget.id);
    pool.sort(() => Math.random() - 0.5);
    let selectedOptions = [currentTarget, pool[0], pool[1]];
    selectedOptions.sort(() => Math.random() - 0.5);

    selectedOptions.forEach(item => {
      const card = document.createElement('div');
      card.className = 'option-card';
      
      const img = document.createElement('img');
      img.src = item.imagePath;
      img.alt = item.word;
      
      img.onerror = () => {
        card.innerHTML = `<span class="option-text">${item.word}</span>`;
      };

      card.appendChild(img);
      // ✅ تمرير العنصر card هنا
      card.onclick = () => checkAnswer(item.id, card);
      optionsContainer.appendChild(card);
    });

  // ==========================================
  // المستوى 2: الحرف والكلمة
  // ==========================================
  } else if (currentLevel === 2) {
    instruction.textContent = 'اختر الكلمة التي تبدأ بهذا الحرف:' + progressText;
    targetWord.textContent = `حرف (${currentTarget.letter})`;

    let pool = educationalItems.filter(item => item.id !== currentTarget.id);
    pool.sort(() => Math.random() - 0.5);
    let selectedOptions = [currentTarget, pool[0], pool[1]];
    selectedOptions.sort(() => Math.random() - 0.5);

    selectedOptions.forEach(item => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.innerHTML = `<span class="option-text">${item.word}</span>`;
      // ✅ تمرير العنصر card هنا أيضاً
      card.onclick = () => checkAnswer(item.id, card);
      optionsContainer.appendChild(card);
    });

  // ==========================================
  // المستوى 3: الحرف والصورة
  // ==========================================
  } else if (currentLevel === 3) {
    instruction.textContent = 'اختر الصورة التي تبدأ بهذا الحرف:' + progressText;
    
    const firstLetterWithHarakat = currentTarget.word ? currentTarget.word.slice(0, 2) : currentTarget.letter;
    targetWord.textContent = `حرف - ${firstLetterWithHarakat}`;

    let pool = educationalItems.filter(item => 
      item.id !== currentTarget.id && 
      (!item.word || item.word.slice(0, 2) !== firstLetterWithHarakat)
    );

    if (pool.length < 2) {
      pool = educationalItems.filter(item => item.id !== currentTarget.id);
    }

    pool.sort(() => Math.random() - 0.5);
    
    let selectedOptions = [currentTarget, pool[0], pool[1]];
    selectedOptions.sort(() => Math.random() - 0.5);

    optionsContainer.innerHTML = '';

    selectedOptions.forEach(item => {
      const card = document.createElement('div');
      card.className = 'option-card';
      
      const img = document.createElement('img');
      img.src = item.imagePath;
      img.alt = item.word;
      
      img.onerror = () => {
        card.innerHTML = `<span class="option-text">${item.word}</span>`;
      };

      card.appendChild(img);
      
      card.onclick = () => {
        const audioFileName = item.pictureAudioPath ? item.pictureAudioPath.split('/').pop() : 'غير متوفر';
        const letterAudioFileName = item.letterAudioPath ? item.letterAudioPath.split('/').pop() : 'غير متوفر';

        console.log("🔊 معرف/اسم ملف صوت الصورة (الفعلي):", audioFileName, "| المسار الكامل:", item.pictureAudioPath);
        console.log("🔊 معرف/اسم ملف صوت الحرف:", letterAudioFileName, "| المسار الكامل:", item.letterAudioPath);
        console.log("🏷️ ID العنصر النظيف:", item.id, "| الكلمة:", item.word);
        
        // ✅ تمرير العنصر card هنا أيضاً في المستوى الثالث
        checkAnswer(item.id, card);
      };
      optionsContainer.appendChild(card);
    });
  }
}

// ==========================================
// 🔍 كود المراقبة والتتبع (Console Debugging)
// ==========================================

// المتغيرات الأساسية للمستويات والتقدم
let highestUnlockedLevel = 1; // 🔒 يبدأ المستوى 1 فقط متاحاً، والمستويان 2 و3 مقفلان

// فحص الإجابة المختارة
function checkAnswer(selectedId, clickedCard) {
  const feedback = document.getElementById('feedback-msg');
  
  // تعطيل النقر المؤقت لمنع التكرار أثناء التشغيل
  const cards = document.querySelectorAll('.option-card');
  cards.forEach(card => card.style.pointerEvents = 'none');

  // التحقق هل الإجابة صحيحة أم خاطئة بناءً على المطابقة التامة للـ ID
  if (selectedId === currentTarget.id) {
    // 🌟 إجابة صحيحة
    correctStreak++;
    wrongAttempts = 0; // إعادة تعيين عداد الأخطاء عند الإجابة الصحيحة
    
    feedback.textContent = 'إجابة صحيحة! أحسنت 🎉';
    feedback.className = 'feedback-banner success';

    // 🎯 [إصلاح عداد النقاط]
    if (typeof score !== 'undefined') {
      score += 10;
    }
    if (typeof updateScoreDisplay === 'function') {
      updateScoreDisplay();
    } else {
      const scoreElement = document.getElementById('score') || document.getElementById('points');
      if (scoreElement) scoreElement.textContent = score;
    }

    // تلوين البطاقة الصحيحة بالأخضر
    if (clickedCard) {
      clickedCard.style.border = '4px solid #4CAF50';
    }

    // 🔓 التحقق من فتح نافذة اللعبة تلقائياً عند إنجاز 3 بطاقات صحيحة
    if (correctStreak >= 3 && !isGameWindowOpen) {
      openGameActiveWindow();
    }

    // 🔊 تشغيل صوت العنصر الفعلي أولاً
    const audioSrc = currentTarget.pictureAudioPath || currentTarget.letterAudioPath;
    const targetAudio = new Audio(audioSrc);
    targetAudio.play().catch(err => console.log("Target audio error:", err));

    targetAudio.onended = () => {
      triggerSuccessAndNext();
    };

    const fallbackTimer = setTimeout(() => {
      if (targetAudio.paused) {
        triggerSuccessAndNext();
      }
    }, 2500);

    function triggerSuccessAndNext() {
      clearTimeout(fallbackTimer);
      
      const successAudioElem = document.getElementById('audio-success') || (typeof successAudio !== 'undefined' ? successAudio : null);
      if (successAudioElem) {
        successAudioElem.currentTime = 0;
        successAudioElem.play().catch(() => {});
      }

      if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }

      questionCount++;
      
      setTimeout(() => {
        // التحقق من إتمام 5 أسئلة لإنهاء المستوى الحالي بنجاح
        if (questionCount >= 5) {
          showLevelCompleteScreen();
        } else {
          transitionToNextQuestion();
        }
      }, 3500);
    }
    
  } else {
    // ❌ إجابة خاطئة
    wrongAttempts++;
    correctStreak = 0; // تصفير عداد الإجابات الصحيحة المتتالية عند الخطأ

    console.log("🚨 تم الضغط على صورة خطأ! ID الذي تم النقر عليه:", selectedId, "بينما الهدف الصحيح هو:", currentTarget.id);
    feedback.textContent = 'حاول مرة أخرى! ❌';
    feedback.className = 'feedback-banner error';

    // 🔴 تلوين إطار البطاقة المضغوطة باللون الأحمر
    if (clickedCard) {
      clickedCard.classList.add('wrong-selection');

      const computedStyle = window.getComputedStyle(clickedCard);
      console.log("----------------------------------------");
      console.log("🎨 لون الخلفية الفعلي (background-color):", computedStyle.backgroundColor);
      console.log("🎨 لون الإطار الفعلي (border-color):", computedStyle.borderColor);
      console.log("----------------------------------------");
    }

    // 🔊 تشغيل ملف الفشل
    const wrongAudio = document.getElementById('audio-wrong');
    if (wrongAudio) {
      wrongAudio.currentTime = 0;
      wrongAudio.play().catch(err => console.log("Wrong audio error:", err));
    }

    // 🛑 التحقق من إغلاق نافذة اللعبة والعودة للواجهة الأساسية عند الوصول لخطأين
    if (wrongAttempts >= 2) {
      console.log("❌ تم ارتكاب خطأين! إغلاق نافذة اللعبة والعودة للواجهة الرئيسية.");
      setTimeout(() => {
        closeGameWindowAndReturnHome();
      }, 1000);
      return;
    }

    setTimeout(() => {
      cards.forEach(card => {
        card.style.pointerEvents = 'auto';
        card.classList.remove('wrong-selection');
      });
      feedback.textContent = '';
      feedback.className = 'feedback-banner';
    }, 1200);
  }
}

// دالة تحديث عرض النقاط والنجوم منفصلين (⭐ نجمة لكل 30 نقطة)
// دالة تحديث عرض النقاط والنجوم (تظهر فقط عند الوصول لـ 30 نقطة فأكثر)
function updateScoreDisplay() {
  const scoreElement =
    document.querySelector('.score-badge') ||
    document.getElementById('score') ||
    document.getElementById('points');

  const starsBadge = document.getElementById('stars-badge');
  const starsMedalsElement = document.getElementById('stars-medals');
  const starsCountElement = document.getElementById('stars-count');

  // تحويل آمن للنقاط إلى رقم (مع تنبيه إذا كان score عنصر DOM بالخطأ)
  const rawScore = typeof score === 'undefined' ? 0 : score;
  const numericScore = Number(rawScore);
  const safeScore = Number.isFinite(numericScore) && numericScore > 0 ? numericScore : 0;
  const starsCount = Math.floor(safeScore / 30);

  // 1. تحديث عداد النقاط وحده
  if (scoreElement) {
    scoreElement.textContent = `النقاط: ${safeScore}`;

    scoreElement.classList.remove('animate-spin');
    void scoreElement.offsetWidth;
    scoreElement.classList.add('animate-spin');

    setTimeout(() => {
      scoreElement.classList.remove('animate-spin');
    }, 800);
  }

  // 2. إخفاء النجوم/الأوسمة طالما النقاط أقل من 30، وإظهارها بحركة دورية عند 30 فأكثر
  if (starsBadge) {
    if (safeScore < 30 || starsCount <= 0) {
      starsBadge.classList.add('stars-hidden');
      starsBadge.classList.remove('stars-attention', 'star-pulse');
      if (starsCountElement) starsCountElement.textContent = '0';
      if (starsMedalsElement) starsMedalsElement.innerHTML = '';
      return;
    }

    const previousStars = Number(starsCountElement?.textContent) || 0;
    starsBadge.classList.remove('stars-hidden');
    starsBadge.classList.add('stars-attention');

    if (starsCountElement) {
      starsCountElement.textContent = String(starsCount);
    }

    if (starsMedalsElement) {
      starsMedalsElement.innerHTML = '';
      for (let i = 0; i < starsCount; i++) {
        const medal = document.createElement('span');
        medal.className = 'star-medal';
        medal.textContent = '⭐';
        if (i >= previousStars) {
          medal.classList.add('star-pulse');
        }
        starsMedalsElement.appendChild(medal);
      }
    }

    if (starsCount > previousStars) {
      starsBadge.classList.remove('star-pulse');
      void starsBadge.offsetWidth;
      starsBadge.classList.add('star-pulse');

      setTimeout(() => {
        starsBadge.classList.remove('star-pulse');
      }, 450);
    }
  }
}

// دالة فتح نافذة اللعبة تلقائياً
function openGameActiveWindow() {
  isGameWindowOpen = true;
  const gameContainer = document.querySelector('.game-container');
  if (gameContainer) {
    gameContainer.style.display = 'block';
    gameContainer.classList.add('active-game-window');
  }
  console.log("🔓 تم فتح نافذة اللعبة تلقائياً لتجاوز 3 بطاقات صحيحة بنجاح!");
}

// دالة إغلاق النافذة والعودة للواجهة الأساسية عند بلوغ خطأين
function closeGameWindowAndReturnHome() {
  isGameWindowOpen = false;
  correctStreak = 0;
  wrongAttempts = 0;

  const gameContainer = document.querySelector('.game-container');
  if (gameContainer) {
    gameContainer.style.display = 'none';
  }

  alert("عذراً، لقد أخطأت مرتين! سيتم إغلاق نافذة اللعبة والعودة للواجهة الأساسية.");
  window.location.href = '../index.html'; 
}

// دالة الانتقال بين المستويات مع تتبع تفصيلي في الكونسول
let isSwitchingLevel = false;

function switchLevel(level) {
  console.log(
    `%c 🚀 [محاولة انتقال]: طلب الانتقال إلى المستوى (${level}) | المستوى الأعلى المتاح حالياً: (${highestUnlockedLevel})`,
    'color: #2196F3; font-weight: bold; font-size: 13px;'
  );

  if (level > highestUnlockedLevel) {
    console.warn(
      `%c ⛔ [رفض الانتقال]: المستوى ${level} مقفل ولا يمكن فتحه حالياً!`,
      'color: #F44336; font-weight: bold;'
    );
    alert('عذراً، يجب إكمال المستوى السابق أولاً لفتح هذا المستوى!');
    return;
  }

  // منع تداخل النقرات السريعة أثناء انقلاب الصفحة
  if (isSwitchingLevel) return;
  isSwitchingLevel = true;

  // استهدف حاوية محتوى المستوى إن وجدت، وإلا عناصر .game-container باستثناء عداد النقاط
  const container = document.querySelector('.game-container');
  const flipTarget = document.getElementById('level-content') || container;

  const applyLevelData = () => {
    currentLevel = level;
    questionCount = 0;

    console.log(
      `%c ✅ [نجاح الانتقال]: تم تعيين currentLevel بنجاح إلى: (${currentLevel})`,
      'color: #4CAF50; font-weight: bold;'
    );

    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`level-btn-${level}`);
    if (activeBtn) {
      activeBtn.classList.add('active');
      console.log(
        `%c 📌 [تحديث الزر النشط]: تم تفعيل الكلاس 'active' للزر #level-btn-${level}`,
        'color: #FF9800;'
      );
    }

    updateLevelButtonsUI();

    if (typeof loadQuestion === 'function') {
      console.log(
        `%c 🔄 [تحميل الأسئلة]: استدعاء دالة loadQuestion() للمستوى ${currentLevel}`,
        'color: #9C27B0;'
      );
      loadQuestion();
    } else {
      console.warn('⚠️ تنبيه: دالة loadQuestion غير معرفة أو غير موجودة.');
    }
  };

  if (!flipTarget) {
    applyLevelData();
    isSwitchingLevel = false;
    return;
  }

  flipTarget.classList.remove('page-flip-in');
  flipTarget.classList.add('page-flip-out');

  setTimeout(() => {
    applyLevelData();

    flipTarget.classList.remove('page-flip-out');
    flipTarget.classList.add('page-flip-in');

    setTimeout(() => {
      flipTarget.classList.remove('page-flip-in');
      isSwitchingLevel = false;
    }, 450);
  }, 420);
}

// دالة تحديث حالة الأزرار مع تتبع حالة كل زر في الكونسول
function updateLevelButtonsUI() {
  console.group("🎨 [تحديث واجهة الأزرار - updateLevelButtonsUI]");
  
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`level-btn-${i}`);
    if (!btn) {
      console.log(`⚠️ الزر level-btn-${i} غير موجود في الـ DOM!`);
      continue;
    }

    btn.classList.remove('unlocked', 'locked');

    if (i <= highestUnlockedLevel) {
      // 🔓 المستوى مفتوح وفعال
      btn.disabled = false;
      btn.style.opacity = '1';                  
      btn.style.cursor = 'pointer';
      btn.classList.add('unlocked');

      if (i === currentLevel) {
        btn.style.backgroundColor = '#4CAF50'; 
        btn.style.color = '#ffffff';          
      } else {
        btn.style.backgroundColor = '#8BC34A'; 
        btn.style.color = '#ffffff';
      }

      if (btn.textContent.includes('🔒')) {
        btn.textContent = btn.textContent.replace('🔒', '🔓');
      } else if (!btn.textContent.includes('🔓')) {
        btn.textContent = '🔓 ' + btn.textContent.replace(/^[🔓🔒]\s*/, '');
      }

      console.log(`✔️ زر المستوى ${i}: [مفتوح ومفعل] | الأيقونة: 🔓 | الشفافية: 1`);

    } else {
      // 🔒 المستوى مغلق وغير فعال
      btn.disabled = true;
      btn.style.opacity = '0.4';                
      btn.style.cursor = 'not-allowed';
      btn.style.backgroundColor = '#e0e0e0';    
      btn.style.color = '#757575';
      btn.classList.add('locked');

      if (btn.textContent.includes('🔓')) {
        btn.textContent = btn.textContent.replace('🔓', '🔒');
      } else if (!btn.textContent.includes('🔒')) {
        btn.textContent = '🔒 ' + btn.textContent.replace(/^[🔓🔒]\s*/, '');
      }

      console.log(`❌ زر المستوى ${i}: [مقفل وخامل] | الأيقونة: 🔒 | الشفافية: 0.4`);
    }
  }
  
  console.groupEnd();
}

// دالة شاشة إنهاء المستوى الموحدة والسليمة (بدون عبارة "انتقل للمستوى التالي" في المستوى الثالث)
function showLevelCompleteScreen() {
  const optionsContainer = document.getElementById('options-container');
  const targetWord = document.getElementById('target-word');
  const instruction = document.getElementById('instruction');
  const feedback = document.getElementById('feedback-msg');

  if (targetWord) targetWord.textContent = "🎉 أحسنت!";
  if (instruction) instruction.textContent = `أتممت المستوى ${currentLevel} بنجاح!`;
  
  // تخصيص رسالة الـ feedback حسب المستوى (عدم إظهار عبارة الانتقال إذا كان المستوى 3)
  if (feedback) {
    if (currentLevel < 3) {
      feedback.textContent = ''; // تم حذف عبارة انتقل للمستوى التالي
    } else {
      feedback.textContent = 'لقد أتممت كافة المستويات بنجاح تام! 🏆';
    }
    feedback.className = 'feedback-banner success';
  }
  
  if (optionsContainer) optionsContainer.innerHTML = '';

  // 🔓 تحديث أعلى مستوى تم الوصول إليه وفتحه تلقائياً
  if (currentLevel >= highestUnlockedLevel && currentLevel < 3) {
    highestUnlockedLevel = currentLevel + 1;
    updateLevelButtonsUI(); 
  }

  // إنشاء زر الانتقال للمستوى التالي أو إعادة اللعب
  const nextBtn = document.createElement('button');
  nextBtn.className = 'level-btn active';
  nextBtn.style.padding = '15px 30px';
  nextBtn.style.fontSize = '18px';
  nextBtn.style.marginTop = '20px';
  nextBtn.style.cursor = 'pointer';

    const levelNames = {
    1: 'الأول',
    2: 'الثاني',
    3: 'الثالث'
  };

  if (currentLevel < 3) {
  const nextLevel = currentLevel + 1;
  const levelLabel = levelNames[nextLevel] || nextLevel;
  nextBtn.textContent = `الانتقال إلى المستوى ${levelLabel} 🚀`;
  nextBtn.onclick = () => switchLevel(nextLevel);
} else {
  nextBtn.textContent = `🏆 إعادة اللعب من البداية`;
  nextBtn.onclick = () => {
    highestUnlockedLevel = 1;
    updateLevelButtonsUI();
    switchLevel(1);
  };
}

  if (optionsContainer) {
    optionsContainer.appendChild(nextBtn);
  }

  if (typeof confetti === 'function') {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  }
}

// دالة الانتقال للسؤال التالي بتأثير الحركة
function transitionToNextQuestion() {
  const container = document.getElementById('game-board') || document.getElementById('options-container').parentElement;
  if (!container) {
    loadQuestion();
    return;
  }
  
  container.classList.add('page-flip-out');

  setTimeout(() => {
    loadQuestion();
    container.classList.remove('page-flip-out');
    container.classList.add('page-flip-in');

    setTimeout(() => {
      container.classList.remove('page-flip-in');
    }, 600);
  }, 400);
}

// تشغيل أول سؤال عند تحميل الصفحة وتحديث الأزرار
window.onload = () => {
  updateLevelButtonsUI();
  if (typeof loadQuestion === 'function') {
    loadQuestion();
  }
};
